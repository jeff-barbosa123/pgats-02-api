// fixtures/postLogin.js
// =======================================================
// 💾 Corpo da requisição (payload) exportado para uso nos testes
// =======================================================

export const postLogin = JSON.stringify({
  username: 'usuario_teste_' + Math.floor(Math.random() * 1000), // gera nome aleatório
  password: '123456',
  favorecidos: ['usuario1', 'usuario2'],
});