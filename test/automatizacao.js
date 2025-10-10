
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Endpoint de login simulado
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'teste' && password === '123') {
    return res.status(200).json({ message: 'Login bem-sucedido!', token: 'um-token-valido-jwt' });
  } else {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

module.exports = app;