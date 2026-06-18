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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const [row] = await sql`SELECT * FROM about WHERE id = 1`;
      return res.status(200).json(row || {});
    }

    if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST' || req.method === 'PUT') {
      const b = req.body || {};
      const [row] = await sql`
        INSERT INTO about (
          id, text_ar, text_fr,
          card1_icon, card1_title_ar, card1_title_fr, card1_text_ar, card1_text_fr,
          card2_icon, card2_title_ar, card2_title_fr, card2_text_ar, card2_text_fr,
          card3_icon, card3_title_ar, card3_title_fr, card3_text_ar, card3_text_fr,
          card4_icon, card4_title_ar, card4_title_fr, card4_text_ar, card4_text_fr
        ) VALUES (
          1, ${b.text_ar||null}, ${b.text_fr||null},
          ${b.card1_icon||null}, ${b.card1_title_ar||null}, ${b.card1_title_fr||null}, ${b.card1_text_ar||null}, ${b.card1_text_fr||null},
          ${b.card2_icon||null}, ${b.card2_title_ar||null}, ${b.card2_title_fr||null}, ${b.card2_text_ar||null}, ${b.card2_text_fr||null},
          ${b.card3_icon||null}, ${b.card3_title_ar||null}, ${b.card3_title_fr||null}, ${b.card3_text_ar||null}, ${b.card3_text_fr||null},
          ${b.card4_icon||null}, ${b.card4_title_ar||null}, ${b.card4_title_fr||null}, ${b.card4_text_ar||null}, ${b.card4_text_fr||null}
        )
        ON CONFLICT (id) DO UPDATE SET
          text_ar=EXCLUDED.text_ar, text_fr=EXCLUDED.text_fr,
          card1_icon=EXCLUDED.card1_icon, card1_title_ar=EXCLUDED.card1_title_ar, card1_title_fr=EXCLUDED.card1_title_fr,
          card1_text_ar=EXCLUDED.card1_text_ar, card1_text_fr=EXCLUDED.card1_text_fr,
          card2_icon=EXCLUDED.card2_icon, card2_title_ar=EXCLUDED.card2_title_ar, card2_title_fr=EXCLUDED.card2_title_fr,
          card2_text_ar=EXCLUDED.card2_text_ar, card2_text_fr=EXCLUDED.card2_text_fr,
          card3_icon=EXCLUDED.card3_icon, card3_title_ar=EXCLUDED.card3_title_ar, card3_title_fr=EXCLUDED.card3_title_fr,
          card3_text_ar=EXCLUDED.card3_text_ar, card3_text_fr=EXCLUDED.card3_text_fr,
          card4_icon=EXCLUDED.card4_icon, card4_title_ar=EXCLUDED.card4_title_ar, card4_title_fr=EXCLUDED.card4_title_fr,
          card4_text_ar=EXCLUDED.card4_text_ar, card4_text_fr=EXCLUDED.card4_text_fr
        RETURNING *`;
      return res.status(200).json(row);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
