<!-- 🌊 CABEÇALHO VISUAL DO PROJETO -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0056D2,100:13ADC7&height=220&section=header&text=🚀%20Projeto%20de%20Testes%20Automatizados%20PGATS%20#3&fontSize=34&fontColor=fff&fontAlignY=40&desc=Mentoria%20Julio%20de%20Lima%202.0%20·%20Desafio%20#3&descAlignY=55&descAlign=50&animation=fadeIn" />
</p>

<h2 align="center">🧠 Desafio #3 — Testando um Produto de Mercado com IA Generativa</h2>

<p align="center">
  <b>👨‍💻 Autor:</b> Jefferson Paulo de Aguiar Barbosa <br/>
  <b>🎓 Mentoria:</b> Julio de Lima 2.0 · <b>🧩 Stack:</b> Mocha · Chai · SuperTest · JWT · Mochawesome
</p>

<p align="center">
  <a href="https://github.com/jeff-barbosa123/pgats-02-api/stargazers">
    <img src="https://img.shields.io/github/stars/jeff-barbosa123/pgats-02-api?color=FFD700&style=for-the-badge" />
  </a>
  <a href="https://github.com/jeff-barbosa123/pgats-02-api/network/members">
    <img src="https://img.shields.io/github/forks/jeff-barbosa123/pgats-02-api?color=00BFFF&style=for-the-badge" />
  </a>
  <a href="https://github.com/jeff-barbosa123/pgats-02-api/commits/main">
    <img src="https://img.shields.io/github/last-commit/jeff-barbosa123/pgats-02-api?color=32CD32&style=for-the-badge" />
  </a>
  <a href="https://github.com/jeff-barbosa123/pgats-02-api/issues">
    <img src="https://img.shields.io/github/issues/jeff-barbosa123/pgats-02-api?color=FF6347&style=for-the-badge" />
  </a>
</p>

---

<p align="center">
  <i>💬 “Automatizar é transformar qualidade em hábito. Cada teste é um passo rumo à excelência.”</i>
</p>

# 🧪 PGATS – Projeto de Automação de Testes de API com IA Generativa  
> Projeto desenvolvido como parte do **Desafio #3 da Mentoria PGATS – Julio de Lima 2.0**, aplicando automação de testes de APIs REST com Mocha, Chai, SuperTest e apoio de IA Generativa.



## 🧠 **Desafio #3 – Testando um Produto de Mercado com Ajuda da IA Generativa**

> 📚 *Mentoria PGATS – Julio de Lima 2.0*  
> 💡 *Desafio com foco em automação de testes de API REST utilizando Mocha, Chai, SuperTest e IA Generativa.*

Durante o desafio, os participantes foram orientados a criar **um teste automatizado para cada endpoint** da API [PGATS-02-API](https://github.com/juliodelimas/pgats-02-api) e, posteriormente, **um teste de performance** com o K6.  
O objetivo foi exercitar habilidades técnicas e o raciocínio de QA, utilizando também o apoio de **Inteligência Artificial Generativa** para aprimorar código, documentação e estrutura de testes.

> ⚙️ **Situação atual:**  
> Este projeto já possui **todos os testes de API implementados**, com logs detalhados, tratamento de erros e autenticação JWT.  
> Os **testes de performance com K6** estão sendo desenvolvidos e serão incluídos na próxima etapa.

---

## 🤖 **Como a IA Generativa foi utilizada**

A Inteligência Artificial teve papel fundamental neste desafio, sendo aplicada para:
- ✍️ **Gerar descrições e comentários linha a linha** em cada cenário de teste.  
- 🧩 **Otimizar a estrutura dos payloads** e identificar lacunas de cobertura.  
- 📘 **Formalizar documentação técnica**, mensagens de log e estilo de código.  
- 💡 **Simular casos de falha** e prever possíveis respostas do backend.  
- 📈 **Organizar relatórios de execução e logs de performance.**



## 🧱 **Tecnologias Utilizadas**

| Tecnologia | Função |
|-------------|--------|
| **Node.js** | Ambiente de execução JavaScript |
| **Mocha + Chai** | Framework e biblioteca de assertions |
| **Supertest** | Cliente HTTP para testes de API |
| **Swagger** | Documentação dos endpoints |
| **JWT** | Autenticação baseada em token |
| **Mochawesome** | Geração de relatórios HTML e JSON |
| **K6 (em progresso)** | Testes de carga e performance |



## ⚙️ **Como Executar o Projeto**

```bash
# 1️⃣ Clonar o repositório
git clone https://github.com/jeff-barbosa123/pgats-02-api.git

# 2️⃣ Instalar dependências
npm install

# 3️⃣ Executar os testes automatizados
npm test
```

📊 Após a execução, o relatório completo será gerado em:

📁 mochawesome-report/mochawesome.html




## 🧩 **Escopo dos Testes Implementados**

### 🔹 Módulo: Usuários (`/users`)
- ✅ GET /users → lista de usuários  
- ✅ GET /users (usuário aleatório)  
- ✅ POST /users/register → registro bem-sucedido  
- ❌ POST /users/register → payload inválido (sem senha)  
- ❌ POST /users/register → usuário duplicado  
- ✅ POST /users/login → login bem-sucedido  
- ❌ POST /users/login → senha incorreta  
- ❌ POST /users/login → usuário inexistente  

### 🔹 Módulo: Transferências (`/transfers`)
- ✅ POST /transfers → transferência válida  
- ⚠️ POST /transfers → valor inválido (esperado 400, retorna 201 se regra ausente)  
- ❌ POST /transfers → sem token (401)  
- ✅ GET /transfers → listar transferências autenticadas  
- ❌ GET /transfers → sem token (401)



## 🧪 **Exemplo de Caso de Teste (Comentado)**

js
// ===========================================================
// 🧩 Teste 10 - POST /transfers (sucesso - 201)
// Objetivo: validar que uma transferência válida entre dois usuários é realizada com sucesso.
// ===========================================================
it('deve realizar uma transferência válida com sucesso (POST /transfers)', async () => {
  const remetente = `user_from_${Date.now()}`;
  const destinatario = `user_to_${Date.now()}`;

  // 1️⃣ Cria os dois usuários
  await request.post('/users/register').send({ username: remetente, password: '123456', favorecidos: [] });
  await request.post('/users/register').send({ username: destinatario, password: '123456', favorecidos: [] });

  // 2️⃣ Realiza login do remetente para obter token JWT
  const login = await request.post('/users/login').send({ username: remetente, password: '123456' });
  const token = login.body.token;

  // 3️⃣ Executa a transferência
  const payload = { from: remetente, to: destinatario, value: 100 };

  const res = await request
    .post('/transfers')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

  console.log('📌 Status:', res.status);
  console.log('📌 Body:', res.body);

  // ✅ Validações
  expect(res.status).to.equal(201);
  expect(res.body).to.have.property('from', remetente);
  expect(res.body).to.have.property('to', destinatario);
});
```



## 📊 **Relatórios de Execução**

Após rodar `npm test`, é gerado automaticamente um relatório em HTML:
📍 `mochawesome-report/mochawesome.html`

Exemplo visual do relatório (com logs e evidências):
![Relatório MochaAwesome](https://user-images.githubusercontent.com/00000000/example-mochaawesome-report.png)



## ⚙️ **Próximos Passos – Testes de Performance (K6)**

🚧 **Em desenvolvimento:**  
- Implementar script K6 para simular 50, 100 e 200 usuários simultâneos.  
- Coletar métricas de tempo de resposta e throughput por endpoint.  
- Gerar relatório visual (`summary.html`) com tempos médios e picos.  
- Validar performance do fluxo `/users/login` e `/transfers`.

📁 Estrutura planejada:

tests/
├── api/
│   └── users.test.js
│   └── transfers.test.js
└── performance/
    └── k6/
        └── transfers_stress_test.js
```



## 🔗 **Commit Importante**
📘 [Commit Profissional – Adiciona testes automatizados e documentação detalhada (Módulo 04)](https://github.com/jeff-barbosa123/pgats-02-api/commit/22dcbf77)

> 💬 Este commit marca a entrega completa dos testes automatizados da API, incluindo documentação linha a linha e logs informativos.



## 👨‍💻 **Autor**
**Jefferson Paulo de Aguiar Barbosa**  
Quality Assurance Engineer | Mentoria Julio de Lima 2.0  
📍 Recife – PE, Brasil  
🔗 [LinkedIn](https://www.linkedin.com/in/jeffersonpaulodeaguiarbarbosa/) • [GitHub](https://github.com/jeff-barbosa123)



⭐ **Dê uma estrela neste repositório** se quiser acompanhar a evolução dos testes de performance e relatórios visuais 🚀
