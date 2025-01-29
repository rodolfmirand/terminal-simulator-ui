import express from 'express';
const app = express();
const port = 5500;

app.get('/', (res) => {
  res.send('Servidor Express rodando dentro do Electron!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
