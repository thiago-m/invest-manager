# Sobre o projeto Invest-Manager
Este é um projeto utilizando typescript, nestjs e mongoDB. Ele foi feito pensando em uma arquitetura modular seguindo o MVC e contem testes usando o Jest.

## *** Importante ***
O projeto esta rodando com __https__, mas o certificado não esta sendo conhecido como muito seguro, então ao acessar pelo navegador, postman, insomnia ou qualquer outro método deve-se colocar para não validar o certificado ou permitir mesmo falando que não esta seguro, caso queira rodar com __http__ para não ter esse transtorno é só remover a constante __httpsOptions__ e o seu uso na função __NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions })__ no arquivo __src/main.js__

## Como Rodar o Projeto
### 1. Pré-requisitos:
* Node.js, npm e docker-compose instalados e configurados.

### 2. Clonar o Repositório:
``` sh
git clone https://github.com/thiago-m/invest-manager.git
```
### 3. Instalar Dependências:
``` sh
npm install
```
### 4. Criar imagem Docker:
``` sh
docker-compose build
```
### 5. Executar a aplicação:

``` sh
# Rodar projeto no Docker
docker-compose up

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentação da aplicação
A documentação foi feita usando o swagger, pode ser acessada neste [link](https://localhost:3000/api/docs/):

## Funcionalidades
- __https:__ A aplicação esta usando um certificado para usar https 
- __Rate limit:__ A aplicação utiliza o __express-rate-limit__ para proteger de ataque de força bruta 
- __Cadastro de usuário:__  O projeto oferece um endpoint __POST__ para cadastro de usuários 
- __Pegar usuário:__ O projeto oferece um endpoint __GET__ para recuperar dados do usuário logado 
- __Login de usuário:__ O projeto oferece um endpoint __POST__ para o login do usuário 
- __Cadastro de investimento:__ O projeto oferece um endpoint __POST__ para cadastro de investimento do usuário logado, quando cadastrado já é feito o calculo dos proventos recebidos de acordo com a data do investimento 
- __Cron para adicionar os proventos ao investimento:__ O projeto oferece um __cron job__ que roda __todos os dias a meia noite__ para adicionar os proventos de cada investimento de acordo com a data para receber
- __Listar investimentos do usuário:__ O projeto oferece um endpoint __GET__ para listar os investimentos cadastrados do usuário, é possível também usar paginação passando os parâmetros __limit__ e __page__, também é possível usar o parâmetro __active__ para filtrar apenas investimentos ativos ou inativos 
- __Pegar um investimento do usuário pelo Id:__ O projeto oferece um endpoint __GET__ para pegar um investimento especifico do usuário 
- __Retirar um investimento do usuário:__ O projeto oferece um endpoint __PATCH__ para remoção do investimento do usuário 

## Anatomia da aplicação
A aplicação foi feito pensando na arquitetura __MVC__
````
src/
├── common/
│   └── guards/
│        └── jwt-auth.guard.ts
├── config/
│   └── configuration.ts
├── modules/
│   ├── auth/
│   │    ├── auth.controller.ts
│   │    ├── auth.module.ts
│   │    ├── auth.service.ts
│   │    ├── jwt.strategy.ts
│   │    ├── local-auth.guard.ts
│   │    └── local.strategy.ts
│   ├── invest/
│   │    ├── controllers/
│   │    │    └── invest.controller.ts
│   │    ├── dtos/
│   │    │    └── create.invest.dto.ts
│   │    ├── models/
│   │    │    └── invest.schema.ts
│   │    ├── services/
│   │    │    ├── calculate.service.ts
│   │    │    ├── invest.service.ts
│   │    │    └── monthlyIncome.service.ts
│   │    ├── invest.modules.ts
│   │    └── invest.repository.ts
│   └── user/
│        ├── controllers/
│        │    └── user.controller.ts
│        ├── dtos/
│        │    └── create.user.dto.ts
│        ├── models/
│        │    └── user.schema.ts
│        ├── services/
│        │    └── user.service.ts
│        ├── user.modules.ts
│        └── user.repository.ts
├── tests/
│   ├── auth/
│   │    ├── auth.e2e-spec.ts
│   │    └── auth.service.spec.ts
│   ├── invest/
│   │    ├── invest.e2e-spec.ts
│   │    ├── calculate.service.spec.ts
│   │    ├── invest.service.spec.ts
│   │    └── monthlyIncome.service.spec.ts
│   └── user/
│        ├── user.e2e-spec.ts
│        └── user.service.spec.ts
├── app.module.ts
├── app.service.ts/
└── main.ts/
views/
````

## Contribuindo
Se você deseja contribuir com este projeto, por favor, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para a sua feature (`git checkout -b feature/NomeDaSuaFeature`)
3. Faça commit das suas mudanças (`git commit -am 'Adicionando uma nova feature`)
4. Faça push para a branch (`git push origin feature/NomeDaSuaFeature`)
5. Crie um novo `Pull Request`
