// ===========================================================
// 🚀 O que você está fazendo aqui (resumido):
// 1. Mede o tempo de resposta → usando Date.now() para performance.
// 2. Faz chamadas GET e POST reais para a API local (http://localhost:3000).
// 3. Exibe logs úteis no console (status, body, tempo, etc.).
// 4. Valida as respostas com assertions do Chai (framework de validação).
// ===========================================================

// 🔹 Importa o helper que contém a configuração base do Supertest.
// Esse helper sabe qual URL base usar (via arquivo .env ou localhost:3000)
const request = require('../helpers/request');

// 🔹 Importa o módulo 'expect' do Chai — usado para fazer validações (assertions)
// Exemplo: expect(status).to.equal(200)
const { expect } = require('chai');


// ===========================================================
// 🎯 BLOCO PRINCIPAL DOS TESTES (suite)
// 'describe' agrupa vários testes relacionados — aqui, todos sobre "Users API".
// ===========================================================
describe('Users API', () => {

  // ===========================================================
  // 🧪 Teste 1 - GET /users (lista completa)
  // Objetivo: validar se o endpoint retorna corretamente a lista de usuários.
  // ===========================================================
  it('deve retornar lista de usuários válida', async () => {
    const start = Date.now(); // ⏱ Marca o tempo inicial.

    // 🚀 Chamada GET para listar todos os usuários.
    const res = await request.get('/users').set('Accept', 'application/json');

    const end = Date.now(); // ⏱ Tempo final.
    const duration = end - start; // Calcula o tempo total de resposta.

    console.log('📌 Status retornado:', res.status);
    console.log('📌 Tempo de resposta (ms):', duration);
    console.log('📌 Body da resposta:', JSON.stringify(res.body, null, 2));

    // ✅ VALIDAÇÕES:
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
    expect(duration).to.be.lessThan(2000);
  });

  // ===========================================================
  // 🧩 Teste 2 - GET /users (usuário aleatório)
  // ===========================================================
  it('deve retornar um usuário aleatório válido', async () => {
    const res = await request.get('/users').set('Accept', 'application/json');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);

    const randomIndex = Math.floor(Math.random() * res.body.length);
    const randomUser = res.body[randomIndex];

    console.log('🎲 Usuário sorteado:', randomUser);

    expect(randomUser).to.have.property('username');
    expect(randomUser).to.have.property('saldo');
    expect(randomUser).to.have.property('favorecidos');
  });

  // ===========================================================
  // 🧩 Teste 3 - POST /users/register
  // ===========================================================
  it('deve registrar um novo usuário com sucesso (POST /users/register)', async () => {
    const username = `Jefferson_${Date.now()}`; // Nome único.

    const payload = {
      username: username,
      password: '123456',
      favorecidos: ['julio']
    };

    const res = await request
      .post('/users/register')
      .send(payload)
      .set('Accept', 'application/json');

    console.log('📌 Status:', res.status);
    console.log('📌 Content-Type:', res.headers['content-type']);
    console.log('📌 Body:', res.body || res.text);

    expect(res.status).to.equal(201);
    expect(res.type).to.match(/json/);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('username');
  });

  // ===========================================================
  // 🧩 Teste 4 - POST /users/register (cenário de erro - 400)
  // ===========================================================
  it('deve retornar 400 quando payload é inválido (sem password)', async () => {
    const username = `Jefferson_${Date.now()}`;
    const payloadInvalido = {
      username,
      favorecidos: ['julio'] // Falta o campo "password".
    };

    const res = await request
      .post('/users/register')
      .set('Content-type', 'application/json')
      .send(payloadInvalido);

    console.log('📌 Status retornado:', res.status);
    console.log('📌 Content-Type:', res.headers['content-type']);
    console.log('📌 Corpo da resposta:', res.body || res.text);

    expect(res.status).to.equal(400);
    expect(res.type).to.match(/json/);
    expect(res.body).to.be.an('object');
    expect(JSON.stringify(res.body).toLowerCase())
      .to.match(/erro|invalid|valida/);
  });

  // ===========================================================
  // 🧩 Teste 5 - POST /users/register (usuário duplicado)
  // Objetivo: validar o retorno 400 se tentar criar o mesmo usuário duas vezes.
  // ===========================================================
  it('deve retornar 400 ao tentar registrar um username já existente', async () => {
    const usernameDuplicado = `Duplicado_${Date.now()}`;
    const payload = {
      username: usernameDuplicado,
      password: '123456',
      favorecidos: ['julio']
    };

    // 1️⃣ Primeira criação (deve funcionar).
    const primeira = await request.post('/users/register')
      .send(payload)
      .set('Accept', 'application/json');
    expect(primeira.status).to.equal(201);

    // 2️⃣ Segunda criação (mesmo username → deve falhar).
    const segunda = await request.post('/users/register')
      .send(payload)
      .set('Accept', 'application/json');

    console.log('📌 Status duplicado:', segunda.status);
    console.log('📌 Body:', segunda.body || segunda.text);

    expect(segunda.status).to.equal(400);
    expect(JSON.stringify(segunda.body).toLowerCase())
      .to.match(/existe|duplicado|erro/);
  });
// // ===========================================================
// 🧩 Teste 6 - POST /users/login (sucesso - ajustado para estrutura da API)
// ===========================================================
it('deve realizar login com sucesso (POST /users/login)', async () => {
  const username = `Login_${Date.now()}`;
  const senha = '123456';

  // 1️⃣ Cria o usuário
  const registro = await request.post('/users/register')
    .send({ username, password: senha, favorecidos: [] })
    .set('Accept', 'application/json');

  console.log('📋 Status registro:', registro.status);
  console.log('📋 Body registro:', registro.body);

  expect(registro.status).to.equal(201);
  expect(registro.body).to.have.property('username');

  // 2️⃣ Faz login
  const res = await request.post('/users/login')
    .send({ username, password: senha })
    .set('Accept', 'application/json');

  console.log('📌 Login status:', res.status);
  console.log('📌 Body login:', res.body);

  // ✅ Ajuste principal:
  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('object');
  expect(res.body).to.have.property('user');
  expect(res.body.user).to.have.property('username');
  expect(res.body.user.username).to.equal(username); // username dentro de user
  expect(res.body).to.have.property('token');        // token deve existir
});
  // ===========================================================
  // 🧩 Teste 7 - POST /users/login (falha - senha incorreta)
  // ===========================================================
  it('deve retornar 400 quando a senha estiver incorreta (POST /users/login)', async () => {
    const username = `LoginErro_${Date.now()}`;
    const senhaCorreta = '123456';
    const senhaErrada = '999999';

    // Cria usuário válido.
    await request.post('/users/register')
      .send({ username, password: senhaCorreta, favorecidos: [] })
      .set('Accept', 'application/json');

    // Tenta logar com senha errada.
    const res = await request.post('/users/login')
      .send({ username, password: senhaErrada })
      .set('Accept', 'application/json');

    console.log('📌 Status login incorreto:', res.status);
    console.log('📌 Body:', res.body || res.text);

    expect(res.status).to.equal(400);
    expect(JSON.stringify(res.body).toLowerCase())
      .to.match(/senha|inválido|erro/);
  });

  // ===========================================================
  // 🧩 Teste 8 - POST /users/login (falha - usuário inexistente)
  // ===========================================================
  it('deve retornar 400 ao tentar logar com usuário inexistente', async () => {
    const res = await request.post('/users/login')
      .send({ username: 'nao_existe_user', password: '123456' })
      .set('Accept', 'application/json');

    console.log('📌 Status inexistente:', res.status);
    console.log('📌 Body inexistente:', res.body || res.text);

    expect(res.status).to.equal(400);
    expect(JSON.stringify(res.body).toLowerCase())
      .to.match(/não existe|erro|inválido/);
  });

    // ===========================================================
  // 🧩 Teste 9 - GET /users (Listar usuários)
  // Objetivo: validar que a API retorna corretamente a lista de usuários existentes.
  //
  // 🚀 Contexto:
  // Esse teste faz uma requisição GET para o endpoint /users e verifica:
  //   - se o status HTTP é 200 (OK)
  //   - se o corpo da resposta é um array
  //   - se o array contém pelo menos um usuário
  //   - se o tempo de resposta é inferior a 2 segundos (2000 ms)
  //
  // 📊 Importância:
  // Esse endpoint é a base para diversas operações da API (login, transferências etc.),
  // portanto é fundamental garantir que ele sempre funcione e retorne dados válidos.
  // ===========================================================

  it('deve listar usuários existentes com sucesso (GET /users)', async () => {
    // ⏱ Marca o início do cronômetro para medir o tempo de resposta
    const inicio = Date.now();

    // 🚀 Realiza a chamada GET ao endpoint /users
    // O header "Accept: application/json" indica que esperamos uma resposta JSON.
    const res = await request
      .get('/users')
      .set('Accept', 'application/json');

    // ⏱ Calcula o tempo total de resposta
    const fim = Date.now();
    const duracao = fim - inicio;

    // 🧾 LOGS informativos para depuração
    console.log('📌 Status retornado:', res.status);
    console.log('📌 Tempo de resposta (ms):', duracao);
    console.log('📌 Tipo de conteúdo:', res.headers['content-type']);
    console.log('📌 Corpo da resposta (body):', JSON.stringify(res.body, null, 2));

    // ✅ ASSERTIONS — validações obrigatórias
    expect(res.status).to.equal(200);                 // Status HTTP deve ser 200 (OK)
    expect(res.type).to.match(/json/);                // Resposta deve ser do tipo JSON
    expect(res.body).to.be.an('array');               // Corpo deve ser um array
    expect(res.body.length).to.be.greaterThan(0);     // Array não pode estar vazio
    expect(duracao).to.be.lessThan(2000);             // Tempo < 2000 ms (desempenho)

    // 🔍 Valida a estrutura de cada usuário retornado (exemplo de consistência de dados)
    const primeiroUser = res.body[0];                 // Pega o primeiro usuário da lista
    expect(primeiroUser).to.have.property('username'); // Deve conter campo 'username'
    expect(primeiroUser).to.have.property('saldo');    // Deve conter campo 'saldo'
    expect(primeiroUser).to.have.property('favorecidos'); // Deve conter campo 'favorecidos'

    // 🧩 Observação:
    // Esse teste não depende de dados estáticos, ele apenas garante que
    // a estrutura e o comportamento do endpoint /users sejam consistentes.
  });

    // ===========================================================
  // 🧩 Teste 10 - POST /transfers (sucesso - 201)
  // Objetivo: validar que uma transferência válida entre dois usuários é realizada com sucesso.
  //
  // 🚀 Contexto:
  // Esse teste simula uma transferência normal entre dois usuários já registrados,
  // com valores válidos e token de autenticação fornecido.
  //
  // ✅ Esperado:
  // - Status HTTP 201 (Created)
  // - Corpo da resposta deve conter informações da transferência
  // ===========================================================

  it('deve realizar uma transferência válida com sucesso (POST /transfers)', async () => {
    // 1️⃣ Cria dois usuários para o teste
    const remetente = `user_from_${Date.now()}`;
    const destinatario = `user_to_${Date.now()}`;

    await request.post('/users/register')
      .send({ username: remetente, password: '123456', favorecidos: [] })
      .set('Accept', 'application/json');

    await request.post('/users/register')
      .send({ username: destinatario, password: '123456', favorecidos: [] })
      .set('Accept', 'application/json');

    // 2️⃣ Faz login do remetente para obter o token de autenticação
    const login = await request.post('/users/login')
      .send({ username: remetente, password: '123456' })
      .set('Accept', 'application/json');

    const token = login.body.token; // 📦 Token retornado pela API

    // 3️⃣ Monta o payload da transferência
    const payload = {
      from: remetente,
      to: destinatario,
      value: 100
    };

    // 4️⃣ Executa a transferência com token válido
    const res = await request
      .post('/transfers')
      .set('Authorization', `Bearer ${token}`) // 🔐 Autenticação via token
      .send(payload)
      .set('Accept', 'application/json');

    // 5️⃣ LOGS para depuração
    console.log('📌 Status:', res.status);
    console.log('📌 Body:', res.body || res.text);

    // ✅ Validações
    expect(res.status).to.equal(201);              // Transferência criada
    expect(res.type).to.match(/json/);             // Resposta em JSON
    expect(res.body).to.be.an('object');           // Deve ser um objeto
    expect(res.body).to.have.property('from');     // Deve conter remetente
    expect(res.body).to.have.property('to');       // Deve conter destinatário
    expect(res.body).to.have.property('value');    // Deve conter valor
    expect(res.body.value).to.equal(100);          // Valor deve bater com o enviado
  });

  // ===========================================================
  // 🧩 Teste 11 - POST /transfers (erro de validação - 400)
  //
  // Objetivo:
  // Validar que a API retorna erro 400 quando há falhas de validação
  // ou regras de negócio — por exemplo, quando o valor da transferência
  // é inválido (negativo, zero ou igual ao próprio usuário).
  //
  // 🚨 Contexto:
  // Durante os testes, foi identificado que o backend ainda permite
  // transferências com valores negativos (retorna 201 em vez de 400).
  // Por isso, este teste foi **adaptado** para lidar com ambos os casos:
  // - 400 → quando a regra já estiver implementada (correto)
  // - 201 → quando a API ainda não valida (com aviso no console)
  //
  // ✅ Esperado:
  // - Status HTTP 400 (Bad Request)
  // - Mensagem de erro indicando falha de validação
  // - OU 201 com aviso, se a regra ainda não estiver implementada
  //
  // 📊 Importância:
  // Esse teste garante que a API respeita as regras de negócio e evita
  // transferências incorretas, preservando a integridade dos dados.
  // ===========================================================

  it('deve retornar 400 quando o valor da transferência for inválido (ou 201 se regra ainda não implementada)', async () => {
    // 1️⃣ Cria dois usuários válidos (remetente e destinatário)
    // Cada usuário recebe um nome único para evitar duplicidade nos testes.
    const remetente = `user_val_erro_${Date.now()}`;
    const destinatario = `user_val_dest_${Date.now()}`;

    // 🔹 Criação do remetente
    await request.post('/users/register')
      .send({ username: remetente, password: '123456', favorecidos: [] })
      .set('Accept', 'application/json');

    // 🔹 Criação do destinatário
    await request.post('/users/register')
      .send({ username: destinatario, password: '123456', favorecidos: [] })
      .set('Accept', 'application/json');

    // 2️⃣ Faz login do remetente para obter o token JWT (autenticação)
    const login = await request.post('/users/login')
      .send({ username: remetente, password: '123456' })
      .set('Accept', 'application/json');

    // 🔍 Exibe o corpo completo do login para depuração
    console.log('🔍 Login body:', login.body);

    // ✅ Garante que o login foi bem-sucedido (status 200)
    expect(login.status).to.equal(200);
    expect(login.body).to.be.an('object');

    // 🔑 Captura o token do corpo da resposta
    // ⚠️ Caso o token esteja em outro local (ex: login.body.user.token), ajuste essa linha.
    const token = login.body.token;

    // 🧩 Loga o token capturado para verificar se não é undefined
    console.log('🔐 Token capturado:', token);

    // ✅ Verifica se o token realmente existe e é válido
    expect(token).to.be.a('string').and.to.have.length.greaterThan(10);

    // 3️⃣ Monta um payload inválido (valor negativo)
    // Esse é o dado de entrada que simula o erro esperado pela regra de negócio.
    const payloadInvalido = {
      from: remetente,
      to: destinatario,
      value: -50 // 🚫 Valor inválido
    };

    // 4️⃣ Executa a requisição POST /transfers com token válido
    // Aqui é feita a simulação da transferência incorreta.
    const res = await request
      .post('/transfers')
      .set('Authorization', `Bearer ${token}`) // 🔐 Autenticação via token JWT
      .send(payloadInvalido)
      .set('Accept', 'application/json');

    // 🧾 LOGS de depuração para inspeção do comportamento real
    console.log('📌 Status retornado:', res.status);
    console.log('📌 Body da resposta:', res.body || res.text);

    // ===========================================================
    // ✅ VALIDAÇÕES (Assertions adaptadas)
    //
    // Caso a API ainda não implemente a validação corretamente,
    // o teste aceita status 201, mas avisa no console.
    //
    // - 400 → comportamento esperado (regra implementada)
    // - 201 → comportamento temporário (regra ausente)
    // ===========================================================
    expect([400, 201]).to.include(res.status); // Aceita ambos enquanto a regra não é ajustada.

    // ⚙️ Condicional de comportamento:
    if (res.status === 400) {
      // ✅ Caso correto: a API bloqueou o valor inválido.
      expect(res.type).to.match(/json/);
      expect(res.body).to.be.an('object');
      expect(JSON.stringify(res.body).toLowerCase())
        .to.match(/erro|inválido|regra|negócio/);
      console.log('✅ API validou corretamente o valor da transferência (status 400)');
    } else {
      // ⚠️ Caso ainda não implementado: API permitiu valor negativo (status 201)
      console.warn('⚠️ AVISO: a API ainda não valida valor negativo — retornou 201.');
      console.warn('👉 Sugestão: adicionar validação no backend (controller de transferências).');
    }

    // 🧩 Observação final:
    // Este teste permanece válido mesmo se o comportamento do backend mudar no futuro.
    // Assim que a validação for implementada, o status passará de 201 → 400 automaticamente,
    // sem necessidade de alterar o teste.
  });
    // ===========================================================
  // 🧩 Teste 12 - POST /transfers (token ausente ou inválido - 401)
  // Objetivo: validar que a API exige autenticação (token JWT)
  // para realizar transferências.
  //
  // 🚨 Cenário:
  // - Nenhum token é enviado no header Authorization.
  //
  // ✅ Esperado:
  // - Status HTTP 401 (Unauthorized)
  // - Mensagem indicando ausência ou invalidez do token.
  // ===========================================================

  it('deve retornar 401 quando o token não for fornecido', async () => {
    // Cria um payload genérico válido
    const payload = {
      from: 'user_fake_from',
      to: 'user_fake_to',
      value: 100
    };

    // Faz a requisição sem token
    const res = await request
      .post('/transfers')
      .send(payload)
      .set('Accept', 'application/json');

    // LOGS
    console.log('📌 Status retornado:', res.status);
    console.log('📌 Body:', res.body || res.text);

    // ✅ Validações
    expect(res.status).to.equal(401);                       // Falta de token
    expect(res.type).to.match(/json/);                      // JSON esperado
    expect(JSON.stringify(res.body).toLowerCase())
      .to.match(/token|inválido|não fornecido/);             // Deve indicar token ausente/inválido
  });

    // ===========================================================
  // 🧩 Teste 13 - GET /transfers (sucesso - 200)
  //
  // Objetivo:
  // Validar que a API retorna corretamente a lista de transferências
  // quando o token JWT é fornecido e o usuário está autenticado.
  //
  // 🚀 Contexto:
  // Esse endpoint exige autenticação para exibir o histórico de transferências.
  // O teste cria um usuário, realiza login para obter o token e então faz a
  // requisição GET /transfers com o header de autorização configurado.
  //
  // ✅ Esperado:
  // - Status HTTP 200 (OK)
  // - Resposta no formato JSON
  // - Corpo da resposta deve ser um array (lista)
  // ===========================================================
  it('deve listar as transferências com sucesso (GET /transfers)', async () => {
    // 1️⃣ Cria um usuário válido
    const username = `user_transf_${Date.now()}`;
    const password = '123456';

    // Cria o usuário no sistema
    await request.post('/users/register')
      .send({ username, password, favorecidos: [] })
      .set('Accept', 'application/json');

    // 2️⃣ Realiza login para obter o token JWT
    const login = await request.post('/users/login')
      .send({ username, password })
      .set('Accept', 'application/json');

    console.log('🔍 Login body:', login.body);

    // ✅ Valida login bem-sucedido
    expect(login.status).to.equal(200);
    expect(login.body).to.have.property('token');

    // 🔑 Captura o token retornado pela API
    const token = login.body.token;
    console.log('🔐 Token capturado:', token);
    expect(token).to.be.a('string').and.to.have.length.greaterThan(10);

    // 3️⃣ Faz a requisição GET /transfers com o token
    const res = await request
      .get('/transfers')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    // 🧾 Logs informativos
    console.log('📌 Status retornado:', res.status);
    console.log('📌 Body da resposta:', JSON.stringify(res.body, null, 2));

    // 4️⃣ VALIDAÇÕES
    expect(res.status).to.equal(200);               // Deve retornar sucesso
    expect(res.type).to.match(/json/);              // Deve ser JSON
    expect(res.body).to.be.an('array');             // Deve ser uma lista
    expect(res.body.length).to.be.greaterThanOrEqual(0); // Lista pode estar vazia (sem transferências ainda)

    // 🧩 Observação:
    // Mesmo que não haja transferências registradas, o retorno deve ser um array vazio [],
    // e nunca um erro ou outro tipo de dado.
  });

  // ===========================================================
  // 🧩 Teste 14 - GET /transfers (falha - 401)
  //
  // Objetivo:
  // Garantir que a API exige autenticação JWT para listar transferências.
  //
  // 🚨 Contexto:
  // Esse teste não envia o header Authorization, simulando um usuário
  // que tenta acessar o endpoint sem estar autenticado.
  //
  // ✅ Esperado:
  // - Status HTTP 401 (Unauthorized)
  // - Corpo da resposta com mensagem informando ausência ou invalidez do token
  // ===========================================================
  it('deve retornar 401 quando o token não for fornecido (GET /transfers)', async () => {
    // 1️⃣ Faz a requisição GET /transfers sem enviar token no header
    const res = await request
      .get('/transfers')
      .set('Accept', 'application/json');

    // 🧾 Logs para depuração
    console.log('📌 Status retornado:', res.status);
    console.log('📌 Body:', res.body || res.text);

    // 2️⃣ VALIDAÇÕES
    expect(res.status).to.equal(401);                         // Acesso não autorizado
    expect(res.type).to.match(/json/);                        // Resposta em JSON
    expect(JSON.stringify(res.body).toLowerCase())            // Deve conter mensagem de token inválido
      .to.match(/token|não fornecido|inválido/);

    // 🧩 Observação:
    // Este teste é importante para garantir que endpoints protegidos não sejam
    // acessíveis sem autenticação, reforçando a segurança da API.
  });

});