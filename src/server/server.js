
import express from "express";
import cors from "cors";
import db from "./database.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BuildFind API is running!");
});

app.get("/api/products", (req, res) => {
  try {
    const search = String(req.query.search ?? "").trim();
    const location = String(req.query.location ?? "").trim();

    let sql = `
      SELECT id, name, category, price, stock, location, is_sample
      FROM products
      WHERE (
        name LIKE ?
        OR category LIKE ?
      )
    `;

    const params = [`%${search}%`, `%${search}%`];

    if (location) {
      sql += " AND LOWER(location) = LOWER(?)";
      params.push(location);
    }

    sql += " ORDER BY name ASC";

    const products = db.prepare(sql).all(...params);

    res.json(products);
  } catch (error) {
    console.error("Product search failed:", error);
    res.status(500).json({
      message: "Unable to retrieve products."
    });
  }
});

app.listen(PORT, () => {
  console.log(`BuildFind API running at http://localhost:${PORT}`);
});
