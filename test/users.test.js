// 🚀 O que você está fazendo aqui (resumido):
// 1. Mede tempo de resposta → Date.now().
// 2. Faz chamada GET para /users.
// 3. Mostra informações no console (console.log) para debug/apresentação:
//    - Status HTTP
//    - Tempo de resposta
//    - Body formatado
// 4. Valida (Assertions):
//    - Status deve ser 200
//    - Body deve ser array
//    - Array não pode ser vazio
//    - Tempo de resposta deve ser < 2000ms

// 📌 Importa o helper configurado (supertest + dotenv)
// Esse helper já sabe qual é a BASE_URL (vem do .env ou localhost:3000)
const request = require('../helpers/request');

// 📌 Importa o "expect" do Chai → usado para validar (assertions) no teste
const { expect } = require('chai');

describe('Users API', () => {
  
  // ================================
  // 🧪 Teeste 1 - GET /users (lista completa)
  // ================================
  it('deve retornar lista de usuários válida', async () => {
    // ⏱ Marca o tempo inicial
    const start = Date.now();

    // 🚀 Faz a chamada GET para /users
    const res = await request.get('/users').set('Accept', 'application/json');

    // ⏱ Marca o tempo final
    const end = Date.now();
    const duration = end - start;

    // 📌 LOGS DE APOIO (debug/apresentação)
    console.log('📌 Status retornado:', res.status);
    console.log('📌 Tempo de resposta (ms):', duration);
    console.log('📌 Body da resposta:', JSON.stringify(res.body, null, 2));

    // ✅ VALIDAÇÕES (Assertions)
    expect(res.status).to.equal(200);              // Status deve ser 200
    expect(res.body).to.be.an('array');            // Body deve ser array
    expect(res.body.length).to.be.greaterThan(0);  // Array não pode estar vazio
    expect(duration).to.be.lessThan(2000);         // Tempo < 2000ms
  });

  // ===================================
  // Teste 2 - GET /users (usuário aleatório)
  // ================================
  it('deve retornar um usuário aleatório válido', async () => {
    // 🚀 Faz a chamada GET para /users
    const res = await request.get('/users').set('Accept', 'application/json');

    // ✅ Garante retorno correto
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);

    // 🎲 Sorteia um índice aleatório
    const randomIndex = Math.floor(Math.random() * res.body.length);

    // 📌 Cria a constante com o usuário sorteado
    const randomUser = res.body[randomIndex];

    // 📌 LOGS DE APOIO
    console.log('🎲 Usuário sorteado:', randomUser);

// ✅ VALIDAÇÕES (Assertions)
expect(randomUser).to.have.property('username');     // Deve ter username
expect(randomUser).to.have.property('saldo');        // Deve ter saldo
expect(randomUser).to.have.property('favorecidos');  // Deve ter favorecidos
  });

});