// =======================================================
// 🧩 Importação dos módulos necessários
// =======================================================
import http from 'k6/http';
import { sleep, check } from 'k6';

// =======================================================
// ⚙️ Configurações globais do teste
// =======================================================
export const options = {
  // Define o comportamento da carga durante o teste
  stages: [
    { duration: '5s', target: 5 },   // aquecimento: poucos usuários iniciam
    { duration: '15s', target: 10 }, // carga estável: simula uso constante
    { duration: '5s', target: 0 },   // resfriamento: reduz gradualmente
  ],

  // Define os limites de desempenho (thresholds)
  thresholds: {
    http_req_duration: ['p(90)<3000', 'max<5000'], // 90% das reqs < 3s e máx < 5s
    http_req_failed: ['rate<0.05'],                // até 5% de falhas aceitáveis
  },
};

// =======================================================
// 🚀 Função principal executada por cada usuário virtual (VU)
// =======================================================
export default function () {
  const baseUrl = 'http://localhost:3000/users';
  const params = { headers: { 'Content-Type': 'application/json' } };

  // =======================================================
  // 🧱 1️⃣ CENÁRIO: REGISTRO DO USUÁRIO
  // =======================================================
  const novoUsuario = {
    username: `usuario_teste_${Math.floor(Math.random() * 10000)}`, // nome aleatório
    password: '123456',
  };

  console.log(`👤 Registrando novo usuário: ${novoUsuario.username}`);

  const respostaRegistro = http.post(
    `${baseUrl}/register`,
    JSON.stringify(novoUsuario),
    params
  );

  // ✅ Checks do registro
  const registroOk = check(respostaRegistro, {
    '✅ [REGISTER] Deve retornar status 201 (Created)': (r) => r.status === 201,
    '✅ [REGISTER] Deve conter mensagem de sucesso no corpo': (r) =>
      r.body.includes('sucesso') || r.status === 201,
  });

  // Logs detalhados
  console.log(`📡 [REGISTER] Status: ${respostaRegistro.status}`);
  console.log(`📨 [REGISTER] Corpo: ${respostaRegistro.body}`);

  // Se o registro falhar, aborta o restante do fluxo
  if (!registroOk) {
    console.error('❌ Erro: não foi possível registrar o usuário. Abortando login.');
    sleep(1);
    return;
  }

  // Espera breve antes de tentar login (garante persistência no DB)
  sleep(0.5);

  // =======================================================
  // 🔐 2️⃣ CENÁRIO: LOGIN COM SUCESSO
  // =======================================================
  const loginPayload = JSON.stringify({
    username: novoUsuario.username,
    password: novoUsuario.password,
  });

  console.log(`🔑 Tentando login com usuário válido: ${novoUsuario.username}`);

  const respostaLogin = http.post(`${baseUrl}/login`, loginPayload, params);

  // ✅ Checks do login de sucesso
  check(respostaLogin, {
    '✅ [LOGIN] Deve retornar status 200 (OK)': (r) => r.status === 200,
    '✅ [LOGIN] Deve conter mensagem de login bem-sucedido': (r) =>
      r.body.includes('Login bem-sucedido') ||
      r.body.includes('token') ||
      r.body.includes('sucesso'),
  });

  console.log(`📡 [LOGIN SUCESSO] Status: ${respostaLogin.status}`);
  console.log(`📨 [LOGIN SUCESSO] Corpo: ${respostaLogin.body}`);

  // =======================================================
  // 🚫 3️⃣ CENÁRIO: LOGIN COM ERRO (USUÁRIO INVÁLIDO)
  // =======================================================
  const loginInvalidoPayload = JSON.stringify({
    username: 'usuario_inexistente',
    password: 'senha_errada',
  });

  console.log('🚫 Tentando login com credenciais inválidas...');

  const respostaLoginErro = http.post(`${baseUrl}/login`, loginInvalidoPayload, params);

  // ⚠️ Checks do login inválido
  check(respostaLoginErro, {
    '⚠️ [LOGIN ERRO] Deve retornar status 400 (Usuário ou senha inválidos)': (r) =>
      r.status === 400,
    '⚠️ [LOGIN ERRO] Deve conter mensagem de erro no corpo': (r) =>
      r.body.includes('inválido') || r.body.includes('erro'),
  });

  console.log(`📡 [LOGIN ERRO] Status: ${respostaLoginErro.status}`);
  console.log(`📨 [LOGIN ERRO] Corpo: ${respostaLoginErro.body}`);

  // =======================================================
  // 💤 Intervalo entre execuções (simula tempo entre ações)
  // =======================================================
  sleep(2);
}