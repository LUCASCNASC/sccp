const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const pool = new Pool({
  user: 'SEU_USUARIO',
  host: 'localhost',
  database: 'SEU_BANCO',
  password: 'SUA_SENHA',
  port: 5432,
});

// Rota para buscar elencos de um ano
app.get('/api/elencos/:ano', async (req, res) => {
  const { ano } = req.params;
  try {
    const result = await pool.query(
      'SELECT jogador FROM elencos WHERE ano = $1 ORDER BY jogador',
      [ano]
    );
    res.json({
      ano,
      jogadores: result.rows.map(row => row.jogador)
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar elenco.' });
  }
});

// Rota para todos os anos disponíveis
app.get('/api/elencos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT ano FROM elencos ORDER BY ano'
    );
    res.json(result.rows.map(row => row.ano));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar anos.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});