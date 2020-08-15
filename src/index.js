const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

const sessionConfig = {
  secret: 'devpleno',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 10 * 60 * 1000
  }
}

app.use(session(sessionConfig));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    contas: req.session.contas
  });
});

app.post('/calc', (req, res) => {
  const OP = {
    '+': (n1, n2) => n1 + n2,
    '-': (n1, n2) => n1 - n2,
    '*': (n1, n2) => n1 * n2,
    '/': (n1, n2) => n1 / n2
  };

  let { num1, num2, op } = req.body;
  num1 = parseInt(num1);
  num2 = parseInt(num2);

  const total = OP[op](num1, num2);

  const contas = req.session.contas || [];
  contas.push({ num1, num2, op, total });

  req.session.contas = contas;
  res.redirect('/');
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('server started at http://localhost:3001'));
