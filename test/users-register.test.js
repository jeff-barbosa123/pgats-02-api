// =======================================================
// 🧩 Importação dos módulos necessários
// =======================================================

import http from 'k6/http';
import { sleep, check } from 'k6';

// =======================================================
// ⚙️ Configurações do teste
// =======================================================
export const options = {
 // iterations: 60, // define quantas vezes o teste será executado
 // e os  vus:11000,
 //durations: '60s', serve para adiciar usuarios virtuais 
 //vus:11000,
 //durations: '60s',
  //estagios seguir uma determinada definida 
 stages:[
  {duration: '5s',target:10},
  {duration: '20s',target:10},
  {duration: '5s',target:0}

 ],
  thresholds:{
     http_req_duration:['p(90)<3000','max<5000'],
      http_req_failed:['rate<0.01']
    
  }
};

// =======================================================
// 🚀 Função principal executada durante o teste
// =======================================================
export default function () {
  // Endpoint da API
  const url = 'http://localhost:3000/users/register';

  // Corpo da requisição (payload)
  const payload = JSON.stringify({
    username: 'usuario_teste_' + Math.floor(Math.random() * 1000), // gera nome aleatório
    password: '123456',
    favorecidos: ['usuario1', 'usuario2'],
  });

  // Cabeçalhos HTTP
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  // Envia o POST e captura a resposta
  const resposta = http.post(url, payload, params);

  // Tenta converter o corpo da resposta em JSON (para evitar erro quando o corpo for vazio)
  let bodyJson;
  try {
    bodyJson = JSON.parse(resposta.body);
  } catch (e) {
    bodyJson = {};
  }

  // =======================================================
  // 🧠 Validações (checks)
  // o checks não quer dizer que o cenario passou 
//sera para saber se teve sucesso na execuxão dos testes so as funcionais da api//
// Agora thresholds ai sim essa é a noção de setar validações nao funcionais 
  // =======================================================
  check(resposta, {
  // Cenário de sucesso (criação)
  '✅ Status deve ser 201 (Created)': (r) => r.status === 201,
  '✅ Retorno deve conter username': () => bodyJson.username !== undefined,

  // Cenário de erro (usuário já existe)
  ' Retorno deve indicar erro se usuário já existir': (r) => {
    if (r.status === 400) {
      return r.body.includes('usuário já existe');
    }
    return true; // ignora esse check quando é criação bem-sucedida
  },
});
  // =======================================================
  // 🪵 Logs de depuração (debug)
  // =======================================================
  console.log(`📡 Status da resposta: ${resposta.status}`);
  console.log('📨 Corpo da resposta:', resposta.body);

  // Pausa entre execuções
  sleep(2);
}