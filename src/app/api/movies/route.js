// app/api/movies/route.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "srv1750.hstgr.io",
  user: "u679703987_Mflix",
  password: "1973Waheguru#",
  database: "u679703987_Mflix",
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return new Response(JSON.stringify({ error: 'Missing movie name in query' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM movies WHERE name LIKE ?', [`%${name}%`]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Movie not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('MySQL error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
