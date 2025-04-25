"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ------------------------------------------------------------------ */
/*  Type definitions                                                  */
/* ------------------------------------------------------------------ */

interface Company {
  company_id: number;
  name: string;
  email: string;
  industry: string;
  description: string;
}

interface Job {
  job_id: number;
  company_id: number;
  title: string;
  description: string;
  salary_package: string;
}

interface Application {
  application_id: number;
  student_id: number;
  job_id: number;
  status: string;
  application_date: string;
  student_name: string;
  job_title: string;
}

interface Student {
  student_id: number;
  name: string;
  email: string;
  cgpa: number;
}

/* ------------------------------------------------------------------ */
/*  Dashboard Component                                               */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  /* ---------- state ---------- */
  const [activeTab, setActiveTab] = useState<"company" | "applications">("company");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [companyForm, setCompanyForm] = useState<Omit<Company, "company_id">>({
    name: "",
    email: "",
    industry: "",
    description: ""
  });
  const [jobForm, setJobForm] = useState<Omit<Job, "job_id" | "company_id">>({
    title: "",
    description: "", 
    salary_package: ""
  });
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [applicationFilter, setApplicationFilter] = useState<string>("all");

  /* ---------- effects ---------- */
  useEffect(() => {
    // Fetch companies
    fetch("http://localhost:3001/api/companies")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Companies data:", data);
        setCompanies(data);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
      });

    // Fetch applications
    fetch("http://localhost:3001/api/applications/details")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Applications data:", data);
        setApplications(data);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
      });
  }, []);

  /* ---------- handlers ---------- */
  const registerCompany = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      alert(`Company registered successfully! ID: ${data.company_id}`);
      setCompanies([...companies, {...companyForm, company_id: data.company_id}]);
      
      // Reset form
      setCompanyForm({
        name: "",
        email: "",
        industry: "",
        description: ""
      });
    } catch (error) {
      console.error("Error registering company:", error);
      alert("Failed to register company. Please try again.");
    }
  };

  const postJob = async () => {
    if (!selectedCompany) {
      alert("Please select a company first");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jobForm,
          company_id: selectedCompany
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      alert(`Job posted successfully! ID: ${data.job_id}`);
      
      // Reset form
      setJobForm({
        title: "",
        description: "",
        salary_package: ""
      });
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    }
  };

  const updateApplicationStatus = async (applicationId: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      // Update local state
      setApplications(applications.map(app => 
        app.application_id === applicationId ? {...app, status: newStatus} : app
      ));
      
      alert("Application status updated successfully!");
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update application status.");
    }
  };

  // Filter applications based on selected filter
  const filteredApplications = applicationFilter === "all" 
    ? applications 
    : applications.filter(app => app.status === applicationFilter);

  /* ---------- UI ---------- */
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Placement Portal Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <Button 
          className={activeTab === "company" ? "bg-blue-800" : "bg-blue-600"} 
          onClick={() => setActiveTab("company")}
        >
          Company Registration
        </Button>
        <Button 
          className={activeTab === "applications" ? "bg-blue-800" : "bg-blue-600"} 
          onClick={() => setActiveTab("applications")}
        >
          Application Tracking
        </Button>
      </div>

      {/* Company Registration Tab */}
      {activeTab === "company" && (
        <div className="space-y-4">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Register a Company</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Company Name"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                />
                <Input
                  placeholder="Company Email"
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                />
                <Input
                  placeholder="Industry"
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                />
                <Input
                  placeholder="Company Description"
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  className="col-span-full"
                />
                <Button onClick={registerCompany} className="col-span-full">
                  Register Company
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Post a Job</h2>
              
              {/* Company Selection */}
              <div className="mb-4">
                <label className="block mb-2 font-medium">Select Company</label>
                <select 
                  className="border rounded px-3 py-2 w-full"
                  value={selectedCompany || ""}
                  onChange={(e) => setSelectedCompany(Number(e.target.value) || null)}
                >
                  <option value="">-- Select Company --</option>
                  {companies.map((company) => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Job Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Job Title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                />
                <Input
                  placeholder="Salary Package"
                  value={jobForm.salary_package}
                  onChange={(e) => setJobForm({ ...jobForm, salary_package: e.target.value })}
                />
                <Input
                  placeholder="Job Description"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="col-span-full"
                />
                <Button onClick={postJob} className="col-span-full">
                  Post Job
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <Card>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Application Tracking</h2>
              
              {/* Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm">Filter by:</span>
                <select 
                  className="border rounded px-2 py-1"
                  value={applicationFilter}
                  onChange={(e) => setApplicationFilter(e.target.value)}
                >
                  <option value="all">All Applications</option>
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {/* Applications List */}
            {filteredApplications.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No applications found</p>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div key={app.application_id} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{app.student_name}</h3>
                        <p className="text-sm">Applied for: {app.job_title}</p>
                        <p className="text-xs text-gray-500">Application Date: {app.application_date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs 
                          ${app.status === 'selected' ? 'bg-green-100 text-green-800' : 
                           app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                           app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                           app.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                           'bg-gray-100 text-gray-800'}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Update Buttons */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button 
                        className="py-1 px-2 text-xs bg-blue-600"
                        onClick={() => updateApplicationStatus(app.application_id, "shortlisted")}
                      >
                        Shortlist
                      </Button>
                      <Button 
                        className="py-1 px-2 text-xs bg-purple-600"
                        onClick={() => updateApplicationStatus(app.application_id, "interview")}
                      >
                        Schedule Interview
                      </Button>
                      <Button 
                        className="py-1 px-2 text-xs bg-green-600"
                        onClick={() => updateApplicationStatus(app.application_id, "selected")}
                      >
                        Select
                      </Button>
                      <Button 
                        className="py-1 px-2 text-xs bg-red-600"
                        onClick={() => updateApplicationStatus(app.application_id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}