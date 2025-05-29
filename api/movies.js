// /pages/api/movies.js or /app/api/movies/route.js (depending on your Next.js version)
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "auth-db1750.hstgr.io",
  user: "u679703987_Mflix",
  password: "u679703987_Mflixs",
  database: "u679703987_Mflix",
});

export default async function handler(req, res) {
  const { name } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Missing movie name in query' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM movies WHERE name LIKE ?', [`%${name}%`]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error('MySQL error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
