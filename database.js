
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(
  path.join(__dirname, "buildfind.db")
);

// Database settings
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT NOT NULL,
    address TEXT,
    contact_number TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    category TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    price REAL NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0
      CHECK (stock_quantity >= 0),
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id)
      REFERENCES stores(id),
    FOREIGN KEY (product_id)
      REFERENCES products(id),
    UNIQUE (store_id, product_id)
  );
`);

// Add unit column if it is missing
const inventoryColumns = db
  .prepare("PRAGMA table_info(inventory)")
  .all();

if (!inventoryColumns.some(column => column.name === "unit")) {
  db.exec(`
    ALTER TABLE inventory
    ADD COLUMN unit TEXT
  `);
}

// Demo listings.
// These are sample prices and MUST be verified
// before using them as real store prices.
// Stock starts at 0 until actual quantities are entered.
const listings = [
  {
    store: "Demo Hardware",
    location: "Danao City, Cebu",
    product: "Common wire Nails",
    price: 120,
    unit: "kg"
  },
  {
    store: "Metro Build Supply",
    location: "Danao, Cebu",
    product: "Common wire Nails",
    price: 120,
    unit: "kg"
  },
  {
    store: "Danao Hardware Center",
    location: "Danao, Cebu",
    product: "Common wire Nails",
    price: 120,
    unit: "kg"
  },
  {
    store: "Cebu Construction Depot",
    location: "Mandaue City, Cebu",
    product: "Common wire Nails",
    price: 367,
    unit: "kg"
  },
  {
    store: "Island Builders Supply",
    location: "Lapu-Lapu City, Cebu",
    product: "Common wire Nails",
    price: 450,
    unit: "kg"
  },
  {
    store: "Island Builders Supply",
    location: "Lapu-Lapu City, Cebu",
    product: "Portland Cement",
    price: 160,
    unit: "bag"
  },
  {
    store: "Danao Hardware Center",
    location: "Danao, Cebu",
    product: "Portland Cement",
    price: 360,
    unit: "bag"
  },
  {
    store: "Cebu Test Building Supplies",
    location: "Cebu City, Cebu",
    product: "Portland Cement",
    price: 400,
    unit: "bag"
  },
  {
    store: "Metro Build Supply",
    location: "Danao, Cebu",
    product: "Portland Cement",
    price: 400,
    unit: "bag"
  },
  {
    store: "Cebu Construction Depot",
    location: "Mandaue City, Cebu",
    product: "Portland Cement",
    price: 490,
    unit: "bag"
  },
  {
    store: "Demo Hardware",
    location: "Danao City, Cebu",
    product: "Portland Cement",
    price: 500,
    unit: "bag"
  },
  {
    store: "Metro Build Supply",
    location: "Danao, Cebu",
    product: "PVC Pipe",
    price: 100,
    unit: "piece"
  },
  {
    store: "Cebu Test Building Supplies",
    location: "Cebu City, Cebu",
    product: "PVC Pipe",
    price: 100,
    unit: "piece"
  },
  {
    store: "Danao Hardware Center",
    location: "Danao, Cebu",
    product: "PVC Pipe",
    price: 130,
    unit: "piece"
  },
  {
    store: "Cebu Construction Depot",
    location: "Mandaue City, Cebu",
    product: "PVC Pipe",
    price: 130,
    unit: "piece"
  },
  {
    store: "Island Builders Supply",
    location: "Lapu-Lapu City, Cebu",
    product: "PVC Pipe",
    price: 170,
    unit: "piece"
  },
  {
    store: "Metro Build Supply",
    location: "Danao, Cebu",
    product: "Route Test",
    price: 50,
    unit: "piece"
  },
  {
    store: "Cebu Construction Depot",
    location: "Mandaue City, Cebu",
    product: "Route Test",
    price: 150,
    unit: "piece"
  },
  {
    store: "Island Builders Supply",
    location: "Lapu-Lapu City, Cebu",
    product: "Route Test",
    price: 300,
    unit: "piece"
  },
  {
    store: "Danao Hardware Center",
    location: "Danao, Cebu",
    product: "Route Test",
    price: 490,
    unit: "piece"
  },
  {
    store: "Danao Hardware Center",
    location: "Danao, Cebu",
    product: "Test Tile Adhesive",
    price: 140,
    unit: "bag"
  },
  {
    store: "Island Builders Supply",
    location: "Lapu-Lapu City, Cebu",
    product: "Test Tile Adhesive",
    price: 340,
    unit: "bag"
  },
  {
    store: "Cebu Test Building Supplies",
    location: "Cebu City, Cebu",
    product: "Test Tile Adhesive",
    price: 350,
    unit: "bag"
  },
  {
    store: "Metro Build Supply",
    location: "Danao, Cebu",
    product: "Test Tile Adhesive",
    price: 350,
    unit: "bag"
  },
    {
    store: "Cebu Construction Depot",
    location: "Mandaue City, Cebu",
    product: "Test Tile Adhesive",
    price: 370,
    unit: "bag"
  },
  {
  store: "Metro Build Supply",
  location: "Danao, Cebu",
  product: "Paint",
  price: 0,
  unit: "gallon",
  stock_quantity: 10
},
{
  store: "Metro Build Supply",
  location: "Danao, Cebu",
  product: "Paint Brush",
  price: 0,
  unit: "piece",
  stock_quantity: 15
},
{
  store: "Metro Build Supply",
  location: "Danao, Cebu",
  product: "Paint Roller",
  price: 0,
  unit: "piece",
  stock_quantity: 8
},
{
  store: "Metro Build Supply",
  location: "Danao, Cebu",
  product: "Wall Putty",
  price: 0,
  unit: "bag",
  stock_quantity: 12
},
{
  store: "Metro Build Supply",
  location: "Danao, Cebu",
  product: "Paint Thinner",
  price: 0,
  unit: "gallon",
  stock_quantity: 6
}
];

// Add missing demo listings without deleting existing data
const insertListings = db.transaction(() => {
  const findStore = db.prepare(`
    SELECT id
    FROM stores
    WHERE store_name = ? AND address = ?
  `);

  const insertStore = db.prepare(`
    INSERT INTO stores (store_name, address)
    VALUES (?, ?)
  `);

  const findProduct = db.prepare(`
    SELECT id
    FROM products
    WHERE product_name = ?
  `);

  const insertProduct = db.prepare(`
    INSERT INTO products (
      product_name,
      category,
      description
    )
    VALUES (?, ?, ?)
  `);

  const findInventory = db.prepare(`
    SELECT id
    FROM inventory
    WHERE store_id = ? AND product_id = ?
  `);

  const insertInventory = db.prepare(`
  INSERT INTO inventory (
    store_id,
    product_id,
    price,
    stock_quantity,
    unit
  )
  VALUES (?, ?, ?, ?, ?)
`);

  for (const item of listings) {
    let store = findStore.get(
      item.store,
      item.location
    );

    if (!store) {
      const result = insertStore.run(
        item.store,
        item.location
      );

      store = { id: Number(result.lastInsertRowid) };
    }

    let product = findProduct.get(item.product);

    if (!product) {
      const result = insertProduct.run(
        item.product,
        "Construction Supplies",
        null
      );

      product = {
        id: Number(result.lastInsertRowid)
      };
    }

    const existingInventory = findInventory.get(
      store.id,
      product.id
    );

    if (!existingInventory) {
      insertInventory.run(
  store.id,
  product.id,
  item.price,
  item.stock_quantity ?? 0,
  item.unit
);
    }
  }
});

insertListings();

console.log("BuildFind database initialized successfully.");
console.log("Demo listings checked:", listings.length);
console.log("Stock quantities remain 0 until updated with real data.");

export default db;