/* eslint-disable camelcase */
/* eslint-disable max-len */
const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}));

const db = new sqlite3.Database('db/reinsurance.db');

app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  db.all('SELECT * FROM Companies', (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.render('index', {companies: rows});
    }
  });
});

app.get('/portfolio', (req, res) => {
  const company = req.query.company;
  const sql = 'SELECT p.pk ' +
                    ',p.coverage_amount ' +
                    ',p.region' +
                    ',c.company_name' +
                    ',p.company_id ' +
              'FROM Policies p ' +
                    'JOIN Companies c ' +
                        'ON p.company_id = c.pk  ' +
              'WHERE p.company_id = ? ';
  if (company) {
    db.all( sql, [company], (err, rows) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.render('portfolio', {company_name: rows[0].company_name, policies: rows, company_id: rows[0].company_id});
      }
    });
  } else {
    res.redirect('/');
  }
});

app.post('/add_policy', (req, res) => {
  const coverage_amount = req.body.coverage_amount;
  const region = req.body.region;
  const company_id = req.body.company_id;

  db.run(`INSERT INTO Policies (coverage_amount, region, company_id) VALUES (?, ?, ?)`, [coverage_amount, region, company_id], (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.redirect(`/portfolio?company=${company_id}`);
    }
  });
});

app.get('/stock_data', (req, res) => {
  const company = req.query.company;
  db.all('SELECT date, closePrice FROM StockData WHERE company_id = ?', [company], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({error: 'Failed to fetch stock data'});
    } else {
      res.json(rows);
    }
  });
});

app.get('/claims', (req, res) => {
  const company = req.query.company;
  db.all('SELECT c.policy_id,c.claim_amount, cc.company_name FROM Claims c RIGHT JOIN Policies p ON c.policy_id = p.pk RIGHT JOIN Companies cc ON cc.pk = p.company_id WHERE p.company_id = ?', [company], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({error: 'Failed to fetch claims data'});
    } else {
      res.render('claims', {company_name: rows[0].company_name, claims: rows, company_id: company});
    }
  });
});

app.get('/underwriting', (req, res) => {
  const company = req.query.company;
    db.all('SELECT u.policy_id ,u.premium,u.loss_ratio,u.policyholder_type, c.company_name FROM Underwriting u RIGHT JOIN Policies p ON u.policy_id = p.pk RIGHT JOIN Companies c ON c.pk = p.company_id WHERE p.company_id = ?', [company], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({error: 'Failed to fetch claims data'});
    } else {
      res.render('underwriting', {uws: rows, company_id: company, company_name: rows[0].company_name});
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
