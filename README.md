![Coverage](badges/coverage-badge.svg) ![Licence](badges/licence-badge.svg)

# MeetApp Api

- [Overview](#overview)
- [Tecnologias](#tecnologias)
- [Utilização](#utilização)
- [Documentação](#documentação)
  - [Session](#session)
  - [Cadastrar Usuário](#cadastrar-usuário)
  - [Atualizar Usuário](#atualizar-usuário)
  - [Criar Arquivo de Imagem](#criar-arquivo-de-imagem)
  - [Cadastrar Meetup](#cadastrar-meetup)
  - [Atualizar Meetup](#atualizar-meetup)
  - [Listar Meetups](#listar-meetups)
  - [Detalhe Meetup](#Detalhe-Meetup)
  - [Listar Meetups Disponiveis](#Listar-Meetups-Disponiveis)
  - [Deletar Meetup](#Deletar-Meetup)
  - [Inscrever no Meetup](#Inscrever-no-Meetup)
  - [Listar Inscrições](#Listar-Inscrições)
  - [Cancelar Inscrição](#Cancelar-Inscrição)
- [Desafio](#desafio)
- [License](#license)

## Overview

Api para o MeetApp, um agregador de meetups, para o desafio final do Bootcamp GoStack.

## Tecnologias

- NodeJs
- Typescript
- Jest
- Postgres
- Sequelize
- Bee Queue
- Redis
- Nodemailer
- Date-fns
- Nodemon
- ESLint
- Prettier
- EditorConfig

## Utilização

- Pré-requitos

  - Postgres
  - Redis

- Preencher o arquivo .env

- Instalar as dependências: `yarn install`

- Criar tabelas no banco: `yarn sequelize db:migrate`

- Mock de dados: `yarn sequelize db:seed:all`

- Iniciando a api: `yarn dev`

- Iniciando fila de email: `yarn queue`

- Testes automatizados: `yarn test`

- Criar a build: `yarn build`

## Documentação

### Session

http://localhost:3333/sessions **POST**

**Dados Enviados**

```json
{
  "email": "muci@gmail.com",
  "password": "123456"
}
```

**Dados Retornados**

```json
{
  "user": {
    "id": 1,
    "name": "Mucilon",
    "email": "muci@gmail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY4NDgwNzc5LCJleHAiOjE1NjkwODU1Nzl9.rBJ2gazkobfkw31al-jGPv9H-DyPfJl4LgxjTmxJ_mU"
}
```

**Erros Esperados**

```json
 { "error": "Email is Required" } 400 Bad Request
 { "error": "Password is Required" } 400 Bad Request
 { "error": "User not found" } 400 Bad Request
 { "error": "Password does not match" } 400 Bad Request
```

### Cadastrar Usuário

http://localhost:3333/users **POST**

**Dados Enviados**

```json
{
  "name": "Joao",
  "email": "joao@gmail.com",
  "password": "123456"
}
```

**Dados Retornados**

```json
{
  "id": 1,
  "name": "Joao",
  "email": "joao@email.com"
}
```

**Erros Esperados**

```json
 { "error": "User already exists." } 400 Bad Request
 { "error": "Name is Required" } 400 Bad Request
 { "error": "Email is Required" } 400 Bad Request
 { "error": "Password is Required" } 400 Bad Request
```

### Atualizar Usuário

http://localhost:3333/users **PUT**

**Dados Enviados**

```json
{
  "name": "Mudei de nome",
  "email": "mudei@gmail.com",
  "oldPassword": "123456",
  "password": "1234567",
  "confirmPassword": "1234567"
}
```

**Dados Retornados**

```json
{
  "id": 1,
  "name": "Mudei de nome",
  "email": "mudei@gmail.com""
}
```

**Erros Esperados**

```json
 { "error": "User already exists." } 400 Bad Request
 { "error": "Name is Required" } 400 Bad Request
 { "error": "Email is Required" } 400 Bad Request
 { "error": "Password is Required" } 400 Bad Request
```

### Criar Arquivo de Imagem

http://localhost:3333/files **POST**

**Dados Enviados**

```json
{
  "file": "banner.jpg"
}
```

**Dados Retornados**

```json
{
  "id": 4,
  "name": "Meetup1.jpg",
  "path": "839a9bb9-488b-4213-9efe-a871982979b1.jpg",
  "url": "http://192.168.1.7:3333/files/839a9bb9-488b-4213-9efe-a871982979b1.jpg"
}
```

### Cadastrar Meetup

http://localhost:3333/meetups **POST**

**Dados Enviados**

```json
{
  "title": "Meetup de Carreira",
  "description": "Nesse Meetup iremos falar de carreira",
  "location": "Em casa",
  "date": "2019-10-10T19:00:00-03:00",
  "banner_id": 1
}
```

**Dados Retornados**

```json
{
  "id": 10,
  "past": false,
  "title": "Meetup de Carreira",
  "description": "Nesse Meetup iremos falar de carreira",
  "location": "Em casa",
  "date": "2019-10-15T22:00:00.000Z",
  "banner_id": 1,
  "user_id": 4
}
```

**Erros Esperados**

```json
 { "error": "You already have a registered meetup in the next hour" } 400 Bad Request
 { "error": "Can't register date has passed" } 400 Bad Request
 { "error": "Title is Required" } 400 Bad Request
 { "error": "Description is Required" } 400 Bad Request
 { "error": "Location is Required" } 400 Bad Request
 { "error": "Date is Required" } 400 Bad Request
 { "error": "Invalid date format." } 400 Bad Request
 { "error": "Banner is Required" } 400 Bad Request
```

### Atualizar Meetup

http://localhost:3333/meetups/:meetupId/update **PUT**

**Dados Enviados**

```json
{
  "title": "Exemplo 34",
  "description": "Evento exemplo 34",
  "location": "Em casa",
  "date": "2019-10-16T17:00:00-03:00",
  "banner_id": 1
}
```

**Dados Retornados**

```json
{
  "past": true,
  "id": 10,
  "title": "Exemplo 34",
  "description": "Evento exemplo 34",
  "location": "Em casa",
  "date": "2019-10-16T20:00:00.000Z",
  "banner_id": 1,
  "user_id": 4
}
```

**Erros Esperados**

```json
 { "error": "meetup not found" } 400 Bad Request
 { "error": "can't update past meetups" } 400 Bad Request
 { "error": "this meetup does not currently belong to this user" } 400 Bad Request
 { "error": "Invalid date format." } 400 Bad Request
 { "error": "can't update date has passed" } 400 Bad Request

```

### Listar Meetups

http://localhost:3333/meetups **GET**

**Dados Retornados**

```json
[
  {
    "id": 10,
    "title": "Exemplo 34",
    "date": "2019-10-11T20:00:00.000Z"
  }
]
```

### Detalhe Meetup

http://localhost:3333/meetups/:meetupId **GET**

**Dados Retornados**

```json
{
  "past": true,
  "title": "Exemplo 34",
  "description": "Evento exemplo 34",
  "location": "Em casa",
  "date": "2019-10-16T20:00:00.000Z",
  "banner_id": 1,
  "file": {
    "path": "839a9bb9-488b-4213-9efe-a871982979b1.jpg",
    "url": "http://192.168.1.7:3333/files/839a9bb9-488b-4213-9efe-a871982979b1.jpg"
  }
}
```

### Listar Meetups Disponiveis

http://localhost:3333/openmeetups **GET**

**Dados Retornados**

```json
[
  {
    "past": true,
    "id": 1,
    "title": "Exemplo 34",
    "description": "Evento exemplo 34",
    "location": "Em casa",
    "date": "2019-10-16T20:00:00.000Z",
    "banner_id": 1,
    "user_id": 4,
    "user": {
      "name": "Mucilon",
      "email": "muci@gmail.com"
    },
    "file": {
      "path": "839a9bb9-488b-4213-9efe-a871982979b1.jpg",
      "url": "http://192.168.1.7:3333/files/839a9bb9-488b-4213-9efe-a871982979b1.jpg"
    }
  }
]
```

### Deletar Meetup

http://localhost:3333/meetups/:meetupId **DELETE**

**Erros Esperados**

```json
 { "error": "meetup not found" } 400 Bad Request
 { "error": "can't delete past meetups" } 400 Bad Request
```

### Inscrever no Meetup

http://localhost:3333/subscriptions/:meetupId **POST**

**Dados Retornados**

```json
{
  "id": 1,
  "meetup_id": 1,
  "user_id": 4
}
```

**Erros Esperados**

```json
 { "error": "meetup not found" } 400 Bad Request
 { "error": "Cannot sign up for own meetup" } 400 Bad Request
 { "error": "this metup has passed" } 400 Bad Request
 { "error": "User is already subscribed to this meetup" } 400 Bad Request
 { "error": "Cannot subscribe to two meetups at the same time" } 400 Bad Request
```

### Listar Inscrições

http://localhost:3333/subscriptions **GET**

**Dados Retornados**

```json
[
  {
    "id": 1,
    "meetup_id": 1,
    "user_id": 4,
    "meetups": {
      "past": true,
      "title": "Exemplo 34",
      "description": "Evento exemplo 34",
      "location": "Em casa",
      "date": "2019-10-16T20:00:00.000Z",
      "banner_id": 1,
      "user_id": 4,
      "user": {
        "name": "Mucilon",
        "email": "muci@gmail.com"
      },
      "file": {
        "path": "839a9bb9-488b-4213-9efe-a871982979b1.jpg",
        "url": "http://192.168.1.7:3333/files/839a9bb9-488b-4213-9efe-a871982979b1.jpg"
      }
    }
  }
]
```

### Cancelar Inscrição

http://localhost:3333/subscriptions/:meetupId **DELETE**

**Erros Esperados**

```json
 { "error": "Meetup not found" } 400 Bad Request
 { "error": "You cannot cancel a past meetup" } 400 Bad Request
```

## Desafio

A aplicação que iremos dar início ao desenvolvimento a partir de agora é um app agregador de eventos para desenvolvedores chamado Meetapp (um acrônimo à Meetup + App).

Nesse primeiro desafio vamos criar algumas funcionalidades básicas que aprendemos ao longo das aulas até aqui.

### Funcionalidades

Abaixo estão descritas as funcionalidades que você deve adicionar em sua aplicação.

#### Autenticação

Permita que um usuário se autentique em sua aplicação utilizando e-mail e senha.

- A autenticação deve ser feita utilizando JWT.
- Realize a validação dos dados de entrada;

#### Cadastro e atualização de usuários

Permita que novos usuários se cadastrem em sua aplicação utilizando nome, e-mail e senha.

Para atualizar a senha, o usuário deve também enviar um campo de confirmação com a mesma senha.

- Criptografe a senha do usuário para segurança.
- Realize a validação dos dados de entrada;

#### Gerenciamento de arquivos

Crie uma rota para upload de arquivos que cadastra em uma tabela o caminho e nome do arquivo e retorna todos dados do arquivo cadastrado.

#### Gerenciamento de meetups

O usuário pode cadastrar meetups na plataforma com título do meetup, descrição, localização, data e hora e imagem (banner). Todos campos são obrigatórios. Adicione também um campo user_id que armazena o ID do usuário que organiza o evento.

Não deve ser possível cadastrar meetups com datas que já passaram.

O usuário também deve poder editar todos dados de meetups que ainda não aconteceram e que ele é organizador.

Crie uma rota para listar os meetups que são organizados pelo usuário logado.

O usuário deve poder cancelar meetups organizados por ele e que ainda não aconteceram. O cancelamento deve deletar o meetup da base de dados.

#### Inscrição no meetup

O usuário deve poder se inscrever em meetups que não organiza.

O usuário não pode se inscrever em meetups que já aconteceram.

O usuário não pode se inscrever no mesmo meetup duas vezes.

O usuário não pode se inscrever em dois meetups que acontecem no mesmo horário.

Sempre que um usuário se inscrever no meetup, envie um e-mail ao organizador contendo os dados relacionados ao usuário inscrito. O template do e-mail fica por sua conta :)

#### Listagem de meetups

Crie uma rota para listar os meetups com filtro por data (não por hora), os resultados dessa listagem devem vir paginados em 10 itens por página. Abaixo tem um exemplo de chamada para a rota de listagem dos meetups:

```

http://localhost:3333/meetups?date=2019-07-01&page=2

```

Nesse exemplo, listaremos a página 2 dos meetups que acontecerão no dia 01 de Julho.

Nessa listagem retorne também os dados do organizador.

#### Listagem de inscrições

Crie uma rota para listar os meetups em que o usuário logado está inscrito.

Liste apenas meetups que ainda não passaram e ordene meetups mais próximos como primeiros da lista.

## License

MIT © [João Graça Neto](https://github.com/joaogn)
