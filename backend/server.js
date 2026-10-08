require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conexao = require('./database');

const app = express();

app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET;

app.post('/usuarios', async (req, res) => {
  const { email, senha } = req.body;

    if (!email || !senha) {
    return res.status(400).json({
      mensagem: 'E-mail e senha são obrigatórios.',
    });
  }

  if (!email.includes('@')) {
  return res.status(400).json({
    mensagem: 'Digite um e-mail válido.',
  });
}

  if (senha.length < 6) {
  return res.status(400).json({
    mensagem: 'A senha deve ter pelo menos 6 caracteres.',
  });
}

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const sql = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';

    conexao.query(sql, [email, senhaHash], (erro, resultado) => {
      if (erro) {
        console.log(erro);

        return res.status(500).json({
          mensagem: 'Erro ao cadastrar usuário.',
        });
      }

      res.status(201).json({
        mensagem: 'Usuário cadastrado com segurança!',
      });
    });
  } catch (erro) {
    console.log(erro);

    res.status(500).json({
      mensagem: 'Erro no servidor.',
    });
  }
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ?';

  conexao.query(sql, [email], async (erro, resultados) => {
    if (erro) {
      console.log(erro);

      return res.status(500).json({
        mensagem: 'Erro no servidor.',
      });
    }

    if (resultados.length === 0) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.',
      });
    }

    const usuario = resultados[0];

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.',
      });
    }

  const token = jwt.sign(
  {
    id: usuario.id,
    email: usuario.email,
  },
  JWT_SECRET,
  {
    expiresIn: '1h',
  }
);

res.json({
  mensagem: 'Login autorizado!',
  token: token,
});
  });
});

function verificarToken(req, res, next) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho) {
    return res.status(401).json({
      mensagem: 'Token não fornecido.',
    });
  }

  const partes = cabecalho.split(' ');
  const token = partes[1];

  try {
    const usuario = jwt.verify(token, JWT_SECRET);

    req.usuario = usuario;

    next();
  } catch (erro) {
    return res.status(401).json({
      mensagem: 'Token inválido ou expirado.',
    });
  }
}

app.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensagem: 'Você acessou seu perfil!',
    usuario: req.usuario,
  });
});



app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

