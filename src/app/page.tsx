"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ------------------------------------------------------------------ */
/*  Type definitions                                                  */
/* ------------------------------------------------------------------ */

interface Student {
  student_id: number;
  name: string;
  email: string;
  cgpa: number;
}

interface Job {
  company_id: number;
  job_id: number;
  title: string;
  description: string;
  salary_package: string;
  company_name?: string;
}

interface Application{ 
  student_id: number;
  job_id: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function PlacementPortal() {
  /* ---------- state ---------- */
  const [students, setStudents] = useState<Student[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [form, setForm] = useState<Omit<Student, "student_id">>({
    name: "",
    email: "",
    cgpa: 0,
  });
  const [studentId, setStudentId] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- effects ---------- */
  useEffect(() => {
    // Fetch jobs with better error handling
    fetch("http://localhost:3001/api/jobs")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Jobs data:", data);
        // Fetch company names for each job
        const jobsWithCompanyNames = data.map(async (job: Job) => {
          try {
            const companyRes = await fetch(`http://localhost:3001/api/companies`);
            if (!companyRes.ok) throw new Error("Failed to fetch company info");
            const companies = await companyRes.json();
            const company = companies.find((c: any) => c.company_id === job.company_id);
            return { 
              ...job, 
              company_name: company ? company.name : "Unknown Company" 
            };
          } catch (err) {
            console.error("Error fetching company info:", err);
            return { ...job, company_name: "Unknown Company" };
          }
        });
        
        Promise.all(jobsWithCompanyNames).then(setJobs);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setError("Failed to load job listings. Please try again later.");
      });
  }, []);

  /* ---------- handlers ---------- */
  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Valid email is required";
    if (form.cgpa < 0 || form.cgpa > 10) return "CGPA must be between 0 and 10"; 
    return null;
  };

  const registerStudent = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/students", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await res.json();
      alert(`Registered successfully! Your Student ID: ${data.student_id}`);
      setStudentId(data.student_id);
      setIsRegistered(true);
      setStudents((prev) => [...prev, {...form, student_id: data.student_id}]);
    } catch (err) {
      console.error("Registration error:", err);
      alert(`Registration failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const applyToJob = async (job_id: number) => {
    if (!studentId) {
      alert("Please register first before applying");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, job_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Application failed");
      }

      alert(`Successfully applied to the job!`);
      setApplications((prev) => [...prev, { student_id: studentId, job_id }]);
    } catch (err) {
      console.error("Application error:", err);
      alert(`Application failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-4" style={{ backgroundColor: "#f8d7da", minHeight: "calc(100vh - 4rem)" }}>
      <h1 className="text-2xl font-bold mb-4 text-center" style={{ color: "#000000" }}>College Placement Portal</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-black px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ---- Student Registration ---- */}
      <Card className="mb-6" style={{ backgroundColor: "#fab1a0", borderColor: "#e17055" }}>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 uppercase" style={{ color: "#000000" }}>Student Registration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Name"
              style={{ color: "#000000" }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-yellow-200 border-yellow-400"
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-yellow-200 border-yellow-400"
              style={{ backgroundColor: "#ffeaa7", color: "#000000" }}
            />
            <Input
              placeholder="CGPA (0-10)"             
              value={form.cgpa === 0 ? "" : String(form.cgpa)}
              onChange={(e) =>
                setForm({ ...form, cgpa: parseFloat(e.target.value) || 0 })
              }
              className="bg-yellow-200 border-yellow-400"
              style={{ backgroundColor: "#ffeaa7", color: "#000000" }}
            />
            <Button 
              onClick={registerStudent} 
              className="col-span-full mt-2" 
              style={{ 
                backgroundColor: "#fdcb6e", 
                color: "#000000", 
                borderColor: "#e17055",
                fontWeight: "bold"
              }}
            >
              REGISTER
            </Button>
          </div>
          {isRegistered && (
            <div className="mt-3 text-center p-2 bg-green-100 rounded" style={{ color: "#000000" }}>
              Registration successful! Your Student ID: {studentId}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---- Job Openings ---- */}
      <Card style={{ backgroundColor: "#fab1a0", borderColor: "#e17055" }}>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 uppercase" style={{ color: "#000000" }}>Job Openings</h2>
          
          {jobs.length === 0 ? (
            <p className="text-center py-4" style={{ color: "#000000" }}>Loading job listings...</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.job_id}
                  className="p-4 border rounded-lg shadow-sm"
                  style={{ backgroundColor: "#ffffff", borderColor: "#e17055" }}
                >
                  <div className="flex justify-between">
                    <h3 className="text-lg font-bold" style={{ color: "#000000" }}>{job.title}</h3>
                    <span className="text-sm font-medium px-2 py-1 rounded" style={{ backgroundColor: "#ffeaa7", color: "#000000" }}>
                      {job.company_name}
                    </span>
                  </div>
                  <p className="mt-2" style={{ color: "#000000" }}>{job.description}</p>
                  <p className="text-sm mt-1" style={{ color: "#000000" }}>
                    <strong>Salary:</strong> {job.salary_package}
                  </p>
                  <Button
                    onClick={() => applyToJob(job.job_id)}
                    className="mt-3"
                    style={{ backgroundColor: "#fdcb6e", color: "#000000" }}
                  >
                    Apply Now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}