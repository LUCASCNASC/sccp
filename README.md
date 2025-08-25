# Elencos Corinthians SPA + Node.js + PostgreSQL

Projeto SPA que exibe os elencos do Corinthians por temporada, buscando dados do banco PostgreSQL via API Express.

## Como rodar o backend

1. Instale as dependências:
   ```
   npm install express cors pg dotenv
   ```

2. Crie o arquivo `.env` com suas credenciais de banco de dados (exemplo já incluso).

3. Certifique-se que o banco tem as tabelas:
   ```sql
   CREATE TABLE temporadas (
     id SERIAL PRIMARY KEY,
     name_temporada TEXT NOT NULL,
     data_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   CREATE TABLE jogadores (
     id SERIAL PRIMARY KEY,
     nome_jogador TEXT NOT NULL,
     data_nascimento_jogador DATE,
     id_temporadas INTEGER REFERENCES temporadas(id),
     id_posicao_jogador INTEGER,
     id_clube_anterior INTEGER,
     id_clube_destino INTEGER,
     elenco_atual BOOLEAN,
     data_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. Insira dados de exemplo:
   ```sql
   INSERT INTO temporadas (name_temporada) VALUES ('2024');
   INSERT INTO jogadores (nome_jogador, id_temporadas) VALUES ('Hugo Souza', 1), ('Felipe Longo', 1), ('Matheus Donelli', 1);
   ```

5. Rode o backend:
   ```
   node server.js
   ```

## Como funciona

- O frontend SPA faz requisições para o backend (`/api/elencos/:ano` e `/api/elencos`) para mostrar os jogadores de cada ano.
- O cadastro de usuário é apenas um exemplo (pode ser expandido).
- Os dados sensíveis do banco de dados estão protegidos no arquivo `.env`.
