import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "auth-db1750.hstgr.io",
  user: "u679703987_Mflix",
  password: "u679703987_Mflixs",
  database: "u679703987_Mflix",
});

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT name FROM movies');
    const movieNames = rows.map(row => row.name.toLowerCase());

    return new Response(JSON.stringify(movieNames), {
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
