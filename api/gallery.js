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
      const items = await sql`SELECT * FROM gallery_items ORDER BY is_featured DESC, created_at ASC`;
      return res.status(200).json(items);
    }

    if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    const b = req.body || {};

    if (req.method === 'POST') {
      const [g] = await sql`
        INSERT INTO gallery_items (label_ar, label_fr, emoji, is_featured, gradient_from, gradient_to, image_url)
        VALUES (${b.label_ar||null}, ${b.label_fr||null}, ${b.emoji||'📸'},
                ${b.is_featured||false}, ${b.gradient_from||'#2980b9'}, ${b.gradient_to||'#1a6fa0'}, ${b.image_url||null})
        RETURNING *`;
      return res.status(201).json(g);
    }

    if (req.method === 'PUT') {
      const [g] = await sql`
        UPDATE gallery_items SET label_ar=${b.label_ar||null}, label_fr=${b.label_fr||null},
          emoji=${b.emoji||'📸'}, is_featured=${b.is_featured||false},
          gradient_from=${b.gradient_from||'#2980b9'}, gradient_to=${b.gradient_to||'#1a6fa0'},
          image_url=${b.image_url||null}
        WHERE id=${id} RETURNING *`;
      return res.status(200).json(g);
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM gallery_items WHERE id=${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
