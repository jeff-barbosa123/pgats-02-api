// Importa o supertest
const request = require('supertest');
// Importa dotenv para carregar .env
require('dotenv').config();

// Se não tiver BASE_URL no .env, usa http://localhost:3000
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// Exporta já configurado
module.exports = request(baseUrl);

/*
🔑 O que você aprendeu aqui:

- Centralizar configuração → evita repetir `process.env.BASE_URL` em cada teste.
- O `helpers/request.js` já exporta o `request` configurado.
- Agora nos testes basta fazer: 
    const request = require('../helpers/request');
*/