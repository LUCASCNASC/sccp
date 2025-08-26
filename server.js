require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco de dados usando variáveis do .env
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Rota para buscar todos os anos disponíveis (em ordem decrescente)
app.get('/api/elencos', async (req, res) => {
  try {
    const result = await pool.query('SELECT name_temporada FROM temporadas ORDER BY name_temporada DESC');
    res.json(result.rows.map(row => row.name_temporada));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar anos.' });
  }
});

// Rota para buscar jogadores de uma temporada específica
app.get('/api/elencos/:ano', async (req, res) => {
  const { ano } = req.params;
  try {
    // Busca o id da temporada pelo nome
    const temporadaRes = await pool.query(
      'SELECT id FROM temporadas WHERE name_temporada = $1',
      [ano]
    );
    if (temporadaRes.rows.length === 0) {
      return res.json({ ano, jogadores: [] });
    }
    const temporadaId = temporadaRes.rows[0].id;

    // Busca jogadores pelo id da temporada
    const jogadoresRes = await pool.query(
      'SELECT nome_jogador FROM jogadores WHERE id_temporadas = $1 ORDER BY nome_jogador',
      [temporadaId]
    );
    res.json({
      ano,
      jogadores: jogadoresRes.rows.map(row => row.nome_jogador)
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar elenco.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

const bcrypt = require('bcrypt');

const bcrypt = require('bcrypt');

// Endpoint para cadastrar usuário
app.post('/api/usuarios', async (req, res) => {
  const {
    nome, data_nascimento, genero, email, apelido, cidade,
    senha, foto_url, receber_novidades
  } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 12);

    await pool.query(`
      INSERT INTO usuarios (
        nome, data_nascimento, genero, email, apelido, cidade,
        senha_hash, foto_url, receber_novidades
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      nome,
      data_nascimento ? new Date(data_nascimento.split('/').reverse().join('-')) : null,
      genero || null,
      email,
      apelido || null,
      cidade || null,
      senhaHash,
      foto_url || null,
      receber_novidades !== undefined ? receber_novidades : true
    ]);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    if (err.code === '23505') { // email duplicado
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});