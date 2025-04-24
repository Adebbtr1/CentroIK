import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

// Criar a aplicação Express
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/centro-integrado-kids')
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB', err);
  });


// Criar schema e modelo de usuário
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
});

const User = mongoose.model('User', userSchema);

// Rota de login
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (user) {
    res.json({ isAdmin: user.isAdmin });
  } else {
    res.status(400).json({ error: 'Usuário ou senha inválidos.' });
  }
});

// Rota para alternar entre admin e usuário
app.post('/toggle-admin', async (req: Request, res: Response) => {
  const { username, password, isAdmin } = req.body;

  const user = await User.findOne({ username, password });

  if (user) {
    user.isAdmin = !isAdmin;
    await user.save();
    res.json({ success: true, newIsAdmin: user.isAdmin });
  } else {
    res.status(400).json({ error: 'Usuário não encontrado.' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
