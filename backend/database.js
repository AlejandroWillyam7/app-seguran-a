const mysql = require('mysql2');

const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ale@2026Banco!',
  database: 'seguranca',
});

conexao.connect((erro) => {
  if (erro) {
    console.log('Erro ao conectar com o MySQL:', erro);
    return;
  }

  console.log('Conectado ao MySQL!');
});

module.exports = conexao;