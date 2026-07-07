export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const TOKEN = process.env.NOTION_TOKEN;
  const { endpoint, body, method } = req.body;
  if (!TOKEN) return res.status(500).json({ error: 'Token não configurado' });
  if (!endpoint) return res.status(400).json({ error: 'Endpoint obrigatório' });
  // method é opcional — mantém 'POST' como padrão para não quebrar chamadas existentes
  // (query de databases e criação de páginas usam POST; update e archive de páginas usam PATCH)
  const notionMethod = method || 'POST';
  try {
    const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
      method: notionMethod,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body || {}),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
