
const request = require('supertest');
const chai = require('chai');
const app = require('../index'); // Importa a aplicação Express

const { expect } = chai;

describe('POST /login', () => {
  it('deve retornar status 200 para credenciais válidas', async () => {
    const validCredentials = {
      username: 'teste',
      password: '123'
    };

    const response = await request(app)
      .post('/login')
      .send(validCredentials)
      .expect(200); // Supertest expect para status code

    // Chai para fazer asserções mais detalhadas sobre a resposta
    expect(response.body).to.have.property('token');
    expect(response.body.message).to.equal('Login bem-sucedido!');
  });

  it('deve retornar status 401 para credenciais inválidas', async () => {
    const invalidCredentials = {
      username: 'invalido',
      password: 'senha_incorreta'
    };

    const response = await request(app)
      .post('/login')
      .send(invalidCredentials)
      .expect(401);

    expect(response.body.message).to.equal('Credenciais inválidas');
  });
});
