import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';

// Criar a aplicação Express
const app = express();
const port = 5000;

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
mongoose.connect('mongodb://localhost:27017/centro-integrado-kids')
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
