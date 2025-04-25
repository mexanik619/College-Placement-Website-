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

// --- EXISTING ROUTES ---

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
  db.query("INSERT INTO applications (student_id, job_id, application_date, status) VALUES (?, ?, CURDATE(), 'pending')",
    [student_id, job_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    });
});

// --- NEW ROUTES ---

// Get all companies
app.get("/api/companies", (req, res) => {
  db.query("SELECT * FROM companies", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Register new company
app.post("/api/companies", (req, res) => {
  const { name, email, industry, description } = req.body;
  db.query(
    "INSERT INTO companies (name, email, industry, description) VALUES (?, ?, ?, ?)",
    [name, email, industry, description],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ company_id: result.insertId });
    }
  );
});

// Post new job
app.post("/api/jobs", (req, res) => {
  const { company_id, title, description, salary_package } = req.body;
  db.query(
    "INSERT INTO job_postings (company_id, title, description, salary_package, posting_date) VALUES (?, ?, ?, ?, CURDATE())",
    [company_id, title, description, salary_package],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ job_id: result.insertId });
    }
  );
});

// Get applications with student and job details
app.get("/api/applications/details", (req, res) => {
  const query = `
    SELECT a.application_id, a.student_id, a.job_id, a.status, a.application_date, 
           s.name AS student_name, j.title AS job_title
    FROM applications a
    JOIN students s ON a.student_id = s.student_id
    JOIN job_postings j ON a.job_id = j.job_id
    ORDER BY a.application_date DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Update application status
app.patch("/api/applications/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.query(
    "UPDATE applications SET status = ? WHERE application_id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});