// =======================================================
// 🧩 Importação dos módulos necessários
// =======================================================
import http from 'k6/http';
import { sleep, check } from 'k6';
import { postLogin } from '../fixtures/postLogin.js'; // ✅ importação correta do payload externo

// =======================================================
// ⚙️ Configurações do teste
// =======================================================
export const options = {
  // Define o comportamento da carga
  stages: [
    { duration: '5s', target: 10 },   // aumento gradual
    { duration: '20s', target: 10 },  // sustentação da carga
    { duration: '5s', target: 0 },    // redução
  ],

  // Define limites de performance (thresholds)
  thresholds: {
    http_req_duration: ['p(90)<3000', 'max<5000'], // 90% das requisições < 3s, máximo < 5s
    http_req_failed: ['rate<0.01'], // menos de 1% de falhas aceitáveis
  },
};

// =======================================================
// 🚀 Função principal executada durante o teste
// =======================================================
export default function () {
  const url = 'http://localhost:3000/users/register';

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  // Envia a requisição com o payload importado de fixtures
  const resposta = http.post(url, postLogin, params);

  // Tenta converter o corpo da resposta em JSON
  let bodyJson;
  try {
    bodyJson = JSON.parse(resposta.body);
  } catch {
    bodyJson = {};
  }

  // =======================================================
  // 🧠 Validações (checks)
  // - checks: validam comportamento funcional
  // - thresholds: validam comportamento não funcional (performance)
  // =======================================================
  check(resposta, {
    '✅ Status deve ser 201 (Created)': (r) => r.status === 201,
    '✅ Retorno deve conter username': () => bodyJson.username !== undefined,
    '⚠️ Retorno deve indicar erro se usuário já existir': (r) => {
      if (r.status === 400) {
        return r.body.includes('usuário já existe');
      }
      return true; // ignora se não for caso de erro
    },
  });

  // =======================================================
  // 🪵 Logs de depuração (debug)
  // =======================================================
  console.log(`📡 Status da resposta: ${resposta.status}`);
  console.log('📨 Corpo da resposta:', resposta.body);

  // Espera entre execuções
  sleep(2);
}