const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '@Lcn1998',
  port: 5432,
});

// Retorna todos os anos (temporadas) disponíveis
app.get('/api/elencos', async (req, res) => {
  try {
    const result = await pool.query('SELECT name_temporada FROM temporadas ORDER BY name_temporada');
    res.json(result.rows.map(row => row.name_temporada));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar anos.' });
  }
});

// Retorna jogadores de uma temporada específica
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