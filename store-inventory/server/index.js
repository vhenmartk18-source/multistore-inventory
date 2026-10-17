const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'db', 'buildfind.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error opening database:', err.message);
  else console.log('Connected to SQLite database: ' + dbPath);
});

db.serialize(() => {
  db.run(\CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    distance TEXT
  )\);

  db.run(\CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id INTEGER,
    item_name TEXT NOT NULL,
    category TEXT,
    price REAL NOT NULL,
    stock_quantity INTEGER NOT NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id)
  )\);

  db.run(\INSERT INTO stores (name, address, distance) SELECT 'Cebu Hardware Supply', 'Mandaue City', '1.2 km' WHERE NOT EXISTS (SELECT 1 FROM stores WHERE id = 1)\);
  db.run(\INSERT INTO stores (name, address, distance) SELECT 'BuildRight Builders Supply', 'Cebu City', '3.5 km' WHERE NOT EXISTS (SELECT 1 FROM stores WHERE id = 2)\);

  db.run(\INSERT INTO inventory (store_id, item_name, category, price, stock_quantity) SELECT 1, 'Portland Cement 40kg', 'Cement', 245.00, 150 WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE id = 1)\);
  db.run(\INSERT INTO inventory (store_id, item_name, category, price, stock_quantity) SELECT 2, 'Portland Cement 40kg', 'Cement', 240.00, 45 WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE id = 2)\);
  db.run(\INSERT INTO inventory (store_id, item_name, category, price, stock_quantity) SELECT 1, 'Marine Plywood 1/4', 'Wood', 450.00, 80 WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE id = 3)\);
});

app.get('/api/search', (req, res) => {
  const query = req.query.q || '';
  const sql = \SELECT stores.name AS store_name, stores.address, stores.distance, inventory.item_name, inventory.price, inventory.stock_quantity 
               FROM inventory 
               JOIN stores ON inventory.store_id = stores.id 
               WHERE inventory.item_name LIKE ?\;
  db.all(sql, [\%\%\], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(\Server running on http://localhost:\\);
});
