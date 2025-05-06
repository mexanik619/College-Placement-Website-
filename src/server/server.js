"use client"

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

// Connect to the database and handle connection errors
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message || "An unexpected error occurred" });
});

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Backend API is running!");
});

// --- EXISTING ROUTES ---

// Get job listings
app.get("/api/jobs", (req, res) => {
  db.query("SELECT * FROM job_postings", (err, results) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Register student
app.post("/api/students", (req, res) => {
  const { name, email, cgpa } = req.body;
  
  if (!name || !email || cgpa === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  db.query("INSERT INTO students (name, email, cgpa) VALUES (?, ?, ?)",
    [name, email, cgpa],
    (err, result) => {
      if (err) {
        console.error("Error registering student:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ student_id: result.insertId });
    });
});

// Apply to job
app.post("/api/applications", (req, res) => {
  const { student_id, job_id } = req.body;
  
  if (!student_id || !job_id) {
    return res.status(400).json({ error: "Missing student_id or job_id" });
  }
  
  db.query("INSERT INTO applications (student_id, job_id, application_date, status) VALUES (?, ?, CURDATE(), 'pending')",
    [student_id, job_id],
    (err, result) => {
      if (err) {
        console.error("Error creating application:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, application_id: result.insertId });
    });
});

// --- NEW ROUTES ---

// Get all companies
app.get("/api/companies", (req, res) => {
  db.query("SELECT * FROM companies", (err, results) => {
    if (err) {
      console.error("Error fetching companies:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Register new company
app.post("/api/companies", (req, res) => {
  const { name, email, industry, description } = req.body;
  
  if (!name || !email || !industry) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  db.query(
    "INSERT INTO companies (name, email, industry, description) VALUES (?, ?, ?, ?)",
    [name, email, industry, description || null],
    (err, result) => {
      if (err) {
        console.error("Error registering company:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ company_id: result.insertId });
    }
  );
});

// Post new job
app.post("/api/jobs", (req, res) => {
  const { company_id, title, description, salary_package } = req.body;
  
  console.log("Received job request body:", req.body);
  
  // Validate required fields
  if (!company_id || !title || !description || !salary_package) {
    return res.status(400).json({ error: "Missing required fields for job posting" });
  }
  
  db.query(
    "INSERT INTO job_postings (company_id, title, description, salary_package, posting_date) VALUES (?, ?, ?, ?, CURDATE())",
    [company_id, title, description, salary_package],
    (err, result) => {
      if (err) {
        console.error("Error posting job:", err);
        return res.status(500).json({ error: err.message });
      }
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
    if (err) {
      console.error("Error fetching application details:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Update application status
app.patch("/api/applications/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: "Missing status field" });
  }
  
  db.query(
    "UPDATE applications SET status = ? WHERE application_id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        console.error("Error updating application status:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});