import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criar a aplicação Express
const app = express();
const port = process.env.PORT || 5000; // Usar a porta fornecida pelo Heroku ou 5000 para local

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Criar schema e modelo de usuário
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
});

// Criptografar senha antes de salvar
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Conectar ao MongoDB e criar usuário admin se não existir
const dbURI = process.env.MONGO_URL || 'mongodb://localhost:27017/centro-integrado-kids';

mongoose.connect(dbURI)
  .then(async () => {
    console.log('Conectado ao MongoDB');

    // Verificar se o usuário admin já existe
    const existingAdmin = await User.findOne({ username: 'admin' });

    if (!existingAdmin) {
      await User.create({
        username: 'admin',
        password: '123', // será criptografada automaticamente
        isAdmin: true
      });
      console.log('Usuário admin criado com sucesso!');
    } else {
      console.log('Usuário admin já existe.');
    }
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB', err);
  });

// Rota de login
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ isAdmin: user.isAdmin });
  } else {
    res.status(400).json({ error: 'Usuário ou senha inválidos.' });
  }
});

// Rota para alternar entre admin e usuário
app.post('/toggle-admin', async (req: Request, res: Response) => {
  const { username, password, isAdmin } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    user.isAdmin = !isAdmin;
    await user.save();
    res.json({ success: true, newIsAdmin: user.isAdmin });
  } else {
    res.status(400).json({ error: 'Usuário ou senha inválidos.' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Schema do usuário registrado
const registrationSchema = new mongoose.Schema({
  fullName: String,
  birthDate: String,
  email: String,
  phoneNumber: String,
  responsibleName: String,
  groupId: String,
});

const RegisteredUser = mongoose.model('RegisteredUser', registrationSchema);

// Rota para registrar um novo usuário
app.post('/register-user', async (req: Request, res: Response) => {
  try {
    const newUser = new RegisteredUser(req.body);
    await newUser.save();
    res.status(201).json({ message: 'Usuário salvo com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar o usuário.' });
  }
});

// Rota para buscar todos os usuários registrados
app.get('/users', async (req: Request, res: Response) => {
  try {
    // Excluindo o campo "password" da resposta
    const users = await RegisteredUser.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});
