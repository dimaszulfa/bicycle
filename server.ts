import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";

dotenv.config();

const { Pool } = pg;
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// Neon connection pool
if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL is not set. Please add it to your AI Studio Secrets.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : {
    rejectUnauthorized: false, // Required for Neon
  },
});

// Database Initialization
async function initDb() {
  try {
    // Check if products table exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      );
    `);

    if (!checkTable.rows[0].exists) {
      console.log("Initializing database schema...");
      const schemaPath = path.join(process.cwd(), "schema.sql");
      const schema = fs.readFileSync(schemaPath, "utf8");
      
      // Split schema into individual commands (basic split by semicolon)
      // Note: This is a simple split, might need more robust parsing if schema is complex
      const commands = schema.split(";").filter(cmd => cmd.trim().length > 0);
      
      for (const command of commands) {
        await pool.query(command);
      }
      console.log("Database schema initialized successfully.");
    } else {
      // Force update images if they are still picsum (from previous session)
      const checkPicsum = await pool.query("SELECT id FROM products WHERE image LIKE '%picsum.photos%' LIMIT 1");
      if (checkPicsum.rows.length > 0) {
        console.log("Updating old product images to bicycle-themed Unsplash images...");
        await pool.query(`
          UPDATE products SET image = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' WHERE name = 'Polygon Cascade 4';
          UPDATE products SET image = 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80' WHERE name = 'United Detroit 1.0';
          UPDATE products SET image = 'https://images.unsplash.com/photo-1571068316344-75bc76f77891?auto=format&fit=crop&w=800&q=80' WHERE name = 'Pacific Noris 2.1';
          UPDATE products SET image = 'https://images.unsplash.com/photo-1507035895480-2b544cb897ad?auto=format&fit=crop&w=800&q=80' WHERE name = 'Thrill Ravage 5.0';
          UPDATE products SET image = 'https://images.unsplash.com/photo-1501147830916-ce44a6359892?auto=format&fit=crop&w=800&q=80' WHERE name = 'Wimcycle Pocket Rocket';
        `);
      }
    }
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

// Test connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

async function startServer() {
  await initDb();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
  };

  // API Routes
  
  // Auth
  app.post("/api/auth/register", async (req, res) => {
    const { username, email, password, phone, address } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Automatically make sanoury123@gmail.com an admin
      const role = email === 'sanoury123@gmail.com' ? 'admin' : 'customer';
      
      const result = await pool.query(
        "INSERT INTO users (username, email, password, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, role, phone, address",
        [username, email, hashedPassword, phone, address, role]
      );
      const user = result.rows[0];
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ user, token });
    } catch (err: any) {
      console.error(err);
      if (err.code === '23505') {
        return res.status(400).json({ error: "Email or username already exists" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $1", [email]);
      const user = result.rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Ensure sanoury123@gmail.com is always admin
      if (user.email === 'sanoury123@gmail.com' && user.role !== 'admin') {
        await pool.query("UPDATE users SET role = 'admin' WHERE id = $1", [user.id]);
        user.role = 'admin';
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const result = await pool.query("SELECT id, username, email, role, phone, address FROM users WHERE id = $1", [req.user.id]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/products", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    const { name, category, price, stock, description, image } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO products (name, category, price, stock, description, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, category, price, stock, description, image]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/products/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { name, category, price, stock, description, image } = req.body;
    try {
      const result = await pool.query(
        "UPDATE products SET name = $1, category = $2, price = $3, stock = $4, description = $5, image = $6 WHERE id = $7 RETURNING *",
        [name, category, price, stock, description, image, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/products/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM products WHERE id = $1", [id]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Orders
  app.get("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      let result;
      if (req.user.role === 'admin') {
        result = await pool.query("SELECT * FROM orders ORDER BY date DESC");
      } else {
        result = await pool.query("SELECT * FROM orders WHERE userId = $1 ORDER BY date DESC", [req.user.id.toString()]);
      }
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/orders", authenticateToken, async (req: any, res) => {
    const { items, total, address, paymentMethod } = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Create Order
      const orderResult = await client.query(
        "INSERT INTO orders (userId, items, total, address, paymentMethod, status, date) VALUES ($1, $2, $3, $4, $5, 'Menunggu Pembayaran', CURRENT_DATE) RETURNING *",
        [req.user.id.toString(), JSON.stringify(items), total, address, paymentMethod]
      );
      
      // 2. Reduce Stock
      for (const item of items) {
        await client.query(
          "UPDATE products SET stock = stock - $1 WHERE id = $2",
          [item.quantity, item.id]
        );
      }
      
      await client.query('COMMIT');
      res.json(orderResult.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      client.release();
    }
  });

  app.patch("/api/orders/:id/payment-proof", authenticateToken, async (req: any, res) => {
    const { id } = req.params;
    const { paymentProof } = req.body;
    try {
      const result = await pool.query(
        "UPDATE orders SET paymentProof = $1 WHERE id = $2 AND userId = $3 RETURNING *",
        [paymentProof, id, req.user.id.toString()]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/orders/:id/pay", authenticateToken, async (req: any, res) => {
    const { id } = req.params;
    try {
      // Check if order belongs to user and is in 'Menunggu Pembayaran' status
      const orderCheck = await pool.query("SELECT * FROM orders WHERE id = $1 AND userId = $2", [id, req.user.id.toString()]);
      if (orderCheck.rows.length === 0) {
        return res.status(404).json({ error: "Order not found or unauthorized" });
      }

      if (orderCheck.rows[0].status !== 'Menunggu Pembayaran') {
        return res.status(400).json({ error: "Order is already paid or in process" });
      }

      const result = await pool.query(
        "UPDATE orders SET status = 'Diproses' WHERE id = $1 RETURNING *",
        [id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/orders/:id/status", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { status } = req.body;
    try {
      const result = await pool.query(
        "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/users", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    try {
      const result = await pool.query("SELECT id, username, email, role, phone, address, created_at FROM users ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/reports", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    try {
      const salesByDate = await pool.query(`
        SELECT date, SUM(total) as total_sales, COUNT(*) as order_count 
        FROM orders 
        GROUP BY date 
        ORDER BY date ASC 
        LIMIT 30
      `);
      const topProducts = await pool.query(`
        SELECT p.name, SUM((item->>'quantity')::int) as total_sold
        FROM orders o, JSONB_ARRAY_ELEMENTS(o.items) as item
        JOIN products p ON p.id = (item->>'id')::int
        GROUP BY p.name
        ORDER BY total_sold DESC
        LIMIT 5
      `);
      res.json({ salesByDate: salesByDate.rows, topProducts: topProducts.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
