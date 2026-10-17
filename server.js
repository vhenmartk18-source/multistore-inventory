
import express from "express";
import cors from "cors";
import db from "./database.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Check if the backend is running
app.get("/", (req, res) => {
  res.send("BuildFind backend is running!");
});

// Check database/API connection
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BuildFind backend is connected."
  });
});

// Get available products and store information
app.get("/api/products", (req, res) => {
  try {
    const search = String(req.query.q || "").trim();
    const location = String(req.query.location || "").trim();

    let sql = `
      SELECT
        products.id AS product_id,
        products.product_name,
        products.category,
        products.description,
        stores.id AS store_id,
        stores.store_name,
        stores.address,
        stores.contact_number,
        inventory.price,
        inventory.unit,
        inventory.stock_quantity,
        inventory.updated_at
      FROM inventory
      INNER JOIN products
        ON inventory.product_id = products.id
      INNER JOIN stores
        ON inventory.store_id = stores.id
      WHERE inventory.stock_quantity > 0
    `;

    const params = [];

    // Search by product name, category, or description
    if (search) {
      sql += `
        AND (
          products.product_name LIKE ?
          OR products.category LIKE ?
          OR products.description LIKE ?
        )
      `;

      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword);
    }

    // Filter by location
    if (location) {
      sql += ` AND stores.address LIKE ?`;
      params.push(`%${location}%`);
    }

    // Show the lowest prices first
    sql += `
      ORDER BY inventory.price ASC, products.product_name ASC
    `;

    const products = db.prepare(sql).all(...params);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Product search error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve products."
    });
  }
});

// Start the backend server
app.listen(PORT, () => {
  console.log(`BuildFind server running at http://localhost:${PORT}`);
});