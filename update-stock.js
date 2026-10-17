
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "buildfind.db"));

const result = db
  .prepare("UPDATE inventory SET stock_quantity = 10 WHERE stock_quantity = 0")
  .run();

console.log("Inventory records updated:", result.changes);
console.log(
  "Available inventory:",
  db.prepare("SELECT COUNT(*) AS total FROM inventory WHERE stock_quantity > 0").get().total
);

db.close();
