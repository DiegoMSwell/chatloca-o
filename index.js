import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

app.get('/whatsapp', (req, res) => {
  res.send('Rota /whatsapp funcionando!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
