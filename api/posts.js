const { neon } = require('@neondatabase/serverless');
const jwt = require('jsonwebtoken');

function verifyAuth(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return false;
  try { jwt.verify(token, process.env.JWT_SECRET); return true; } catch { return false; }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = neon(process.env.DATABASE_URL);
  const id = req.query.id;

  try {
    if (req.method === 'GET') {
      const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
      return res.status(200).json(posts);
    }

    if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    const body = req.body || {};

    if (req.method === 'POST') {
      const { title, content, image_url } = body;
      const [post] = await sql`
        INSERT INTO posts (title, content, image_url)
        VALUES (${title}, ${content}, ${image_url || null})
        RETURNING *`;
      return res.status(201).json(post);
    }

    if (req.method === 'PUT') {
      const { title, content, image_url } = body;
      const [post] = await sql`
        UPDATE posts SET title=${title}, content=${content}, image_url=${image_url || null}
        WHERE id=${id} RETURNING *`;
      return res.status(200).json(post);
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM posts WHERE id=${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
