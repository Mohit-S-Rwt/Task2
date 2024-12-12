const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "notes_app",
});
db.connect((err) => {
  if (err) {
    console.log("Error connecting to mysql :", err);
  } else {
    console.log("connected to mysql");
  }
});

db.query(`
  CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

app.get("/notes", (req, res) => {
  db.query("SELECT * FROM notes ORDER BY created_at DESC", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/notes", (req, res) => {
  const { content } = req.body;
  db.query(
    "INSERT INTO notes (content) VALUES (?)",
    [content],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: result.insertId, content });
      }
    }
  );
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM notes WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
