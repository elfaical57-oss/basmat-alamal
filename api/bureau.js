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
      const members = await sql`SELECT * FROM bureau_members ORDER BY sort_order ASC, created_at ASC`;
      return res.status(200).json(members);
    }

    if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    const b = req.body || {};

    if (req.method === 'POST') {
      const [m] = await sql`
        INSERT INTO bureau_members (name_ar, name_fr, role_ar, role_fr, initial, color, sort_order)
        VALUES (${b.name_ar}, ${b.name_fr||b.name_ar}, ${b.role_ar}, ${b.role_fr||b.role_ar},
                ${b.initial||null}, ${b.color||'#1a6fa0'}, ${b.sort_order||0})
        RETURNING *`;
      return res.status(201).json(m);
    }

    if (req.method === 'PUT') {
      const [m] = await sql`
        UPDATE bureau_members SET name_ar=${b.name_ar}, name_fr=${b.name_fr||b.name_ar},
          role_ar=${b.role_ar}, role_fr=${b.role_fr||b.role_ar},
          initial=${b.initial||null}, color=${b.color||'#1a6fa0'}, sort_order=${b.sort_order||0}
        WHERE id=${id} RETURNING *`;
      return res.status(200).json(m);
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM bureau_members WHERE id=${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
