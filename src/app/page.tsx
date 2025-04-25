"use client"

// --- FRONTEND CODE ---
// College Placement Portal (Next.js + TypeScript)

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
  job_id: number;
  title: string;
  description: string;
  salary_package: string;
}

interface Application {
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

  /* ---------- effects ---------- */
  // useEffect(() => {
  //   fetch("/api/jobs")
  //     .then((res) => res.json())
  //     .then((data: Job[]) => setJobs(data))
  //     .catch((err) => console.error(err));


  //   fetch("http://localhost:3001/api/jobs")
  //     .then(async (res) => {
  //       const text = await res.text(); // get raw response
  //       console.log("RAW RESPONSE:", text);
  //       return JSON.parse(text);       // attempt to parse it manually
  //     })
  //     .catch((err) => console.error("Error parsing JSON:", err));
  // }, []);

  useEffect(() => {
    // Remove the first fetch entirely
    
    // Keep only this fetch with better error handling
    fetch("http://localhost:3001/api/jobs")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Jobs data:", data);
        setJobs(data);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
      });
  }, []);

  /* ---------- handlers ---------- */
  // const registerStudent = async () => {
  //   const res = await fetch("/api/students", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(form),
  //   });
  //   const data: Student = await res.json();
  //   alert(`Registered! Student ID: ${data.student_id}`);
  //   // (optional) update students list
  //   setStudents((prev) => [...prev, data]);
  // };

  const registerStudent = async () => {
    const res = await fetch("http://localhost:3001/api/students", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(`Registered! Student ID: ${data.student_id}`);
    setStudents((prev) => [...prev, data]);
  };


  const applyToJob = async (student_id: number, job_id: number) => {
    await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id, job_id }),
    });
    alert(`Applied to Job ID: ${job_id}`);
    // (optional) update applications state
    setApplications((prev) => [...prev, { student_id, job_id }]);
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">College Placement Portal</h1>

      {/* ---- Student Registration ---- */}
      <Card className="mb-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Student Registration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              placeholder="CGPA"             
              value={String(form.cgpa)}
              onChange={(e) =>
              setForm({ ...form, cgpa: parseFloat(e.target.value) || 0 })
              }
            />
            <Button onClick={registerStudent} className="col-span-full mt-2">
              Register
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ---- Job Openings ---- */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Job Openings</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.job_id}
                className="p-3 border rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p>{job.description}</p>
                <p className="text-sm">Salary: {job.salary_package}</p>
                <Button
                  onClick={() => applyToJob(1, job.job_id)} // TODO: pass real student_id
                  className="mt-2"
                >
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
