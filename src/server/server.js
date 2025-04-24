// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());



const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "placement_portal"
});



// error fixation 
app.get("/", (req, res) => {
    res.send("✅ Backend API is running!");
  });

// Get job listings
app.get("/api/jobs", (req, res) => {
  db.query("SELECT * FROM job_postings", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Register student
app.post("/api/students", (req, res) => {
  const { name, email, cgpa } = req.body;
  db.query("INSERT INTO students (name, email, cgpa) VALUES (?, ?, ?)",
    [name, email, cgpa],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ student_id: result.insertId });
    });
});

// Apply to job
app.post("/api/applications", (req, res) => {
  const { student_id, job_id } = req.body;
  db.query("INSERT INTO applications (student_id, job_id, application_date) VALUES (?, ?, CURDATE())",
    [student_id, job_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
