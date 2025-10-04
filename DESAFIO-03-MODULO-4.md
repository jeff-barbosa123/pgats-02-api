# 🚀 Desafio #3 - Testando um Produto de Mercado com IA Generativa

Este repositório é um **fork do projeto [PGATS-02-API](https://github.com/juliodelimas/pgats-02-api)**, proposto na mentoria de **Testes de Software com Júlio de Lima**.  
O desafio foi planejado para ser feito em grupo, mas realizei **sozinho** para consolidar meu aprendizado no **Módulo 4 - Testando e Automatizando Testes de API**.

---

## 📂 Estrutura Implementada no Módulo 4

```bash
pgats-02-api/
│
├── ajudantes/
│   └── request.js          # Configuração global do SuperTest + dotenv
│
├── teste/
│   └── users.test.js       # Testes automatizados do endpoint /users
│
├── fixtures/               # Massa de dados
│   └── requests/
│       └── newUser.json    # Exemplo de fixture (não usado neste módulo)
│
├── mochawesome-report/     # Relatórios automáticos
│
├── .env                    # Variáveis de ambiente (BASE_URL_REST, etc.)
└── package.json


⚙️ O que foi implementado

•	📌 Configuração do projeto com SuperTest, Mocha e Chai.
•	📌 Variáveis de ambiente via .env (URLs da API).
•	📌 Helper (request.js) para centralizar configuração do SuperTest.
•	📌 Hook beforeEach para organizar execução dos testes.
•	📌 Fixtures para armazenar massa de dados.
•	📌 Relatórios Mochawesome configurados e gerados automaticamente.
•	📌 Testes criados:
o	GET /users → validar status 200, retorno array, quantidade > 0, tempo < 2000ms.
o	GET /users (aleatório) → validar username, saldo e favorecidos.


✅ Checklist do Módulo 4 concluído
•	Mentalidade de Testes em APIs
•	Criação e inicialização do projeto
•	Escrevendo primeiro teste de API Rest
•	Versionando com Git
•	Geração de relatórios (Mochawesome)
•	Variáveis de ambiente com .env
•	Helpers para reutilização de código
•	Hook beforeEach
•	Fixtures para organizar dados
•	Validação de dados no corpo da resposta

📊 Resultados Obtidos
✔️ Teste 1 – GET /users: lista completa de usuários.
✔️ Teste 2 – GET /users (aleatório): valida propriedades essenciais (username, saldo, favorecidos).

📌 Próximos Passos
O próximo módulo (Módulo 5) traz testes de performance com k6, que ainda serão implementados.


