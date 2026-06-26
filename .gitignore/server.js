const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));

app.get('/api/membros', (req, res) => {
  const pasta = path.join(__dirname, 'jsons', 'profiles');
  const arquivos = fs.readdirSync(pasta)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
  res.json(arquivos);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});