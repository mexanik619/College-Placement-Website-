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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- effects ---------- */
  useEffect(() => {
    setIsLoading(true);
    
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
        setError("Failed to fetch companies. Please check the server connection.");
      })
      .finally(() => setIsLoading(false));

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
        setError("Failed to fetch applications. Please check the server connection.");
      });
  }, []);

  /* ---------- form validation ---------- */
  const validateCompanyForm = () => {
    if (!companyForm.name.trim()) return "Company Name is required";
    if (!companyForm.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyForm.email)) return "Valid email is required";
    if (!companyForm.industry.trim()) return "Industry is required";
    return null;
  };

  const validateJobForm = () => {
    if (!selectedCompany) return "Please select a company";
    if (!jobForm.title.trim()) return "Job Title is required";
    if (!jobForm.description.trim()) return "Job Description is required";
    if (!jobForm.salary_package.trim()) return "Salary Package is required";
    return null;
  };

  /* ---------- handlers ---------- */
  const registerCompany = async () => {
    const validationError = validateCompanyForm();
    if (validationError) {
      alert(validationError);
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:3001/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
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
      alert(`Failed to register company: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const postJob = async () => {
    const validationError = validateJobForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setIsLoading(true);
      // Debug log to check what's being sent
      const requestBody = {
        ...jobForm,
        company_id: selectedCompany
      };
      console.log("Sending job post request:", requestBody);
      
      const res = await fetch("http://localhost:3001/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      // Log the raw response if there's an error
      if (!res.ok) {
        const responseText = await res.text();
        console.error("Error response text:", responseText);
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
      setSelectedCompany(null);
    } catch (error) {
      console.error("Error posting job:", error);
      alert(`Failed to post job: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: number, newStatus: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:3001/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      // Update local state
      setApplications(applications.map(app => 
        app.application_id === applicationId ? {...app, status: newStatus} : app
      ));
      
      alert("Application status updated successfully!");
    } catch (error) {
      console.error("Error updating application status:", error);
      alert(`Failed to update application status: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter applications based on selected filter
  const filteredApplications = applicationFilter === "all" 
    ? applications 
    : applications.filter(app => app.status === applicationFilter);

  /* ---------- UI ---------- */
  return (
    <div className="p-4" style={{ backgroundColor: "#f8d7da", minHeight: "calc(100vh - 4rem)" }}>
      <h1 className="text-2xl font-bold mb-4 text-center" style={{ color: "#721c24" }}>Placement Portal Dashboard</h1>
      
      {/* Error Message Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <Button 
          className={activeTab === "company" ? "" : ""} 
          onClick={() => setActiveTab("company")}
          style={{ 
            backgroundColor: activeTab === "company" ? "#e84393" : "#fd79a8",
            color: "white",
            fontWeight: "bold",
            flex: 1
          }}
        >
          Company Registration
        </Button>
        <Button 
          className={activeTab === "applications" ? "" : ""} 
          onClick={() => setActiveTab("applications")}
          style={{ 
            backgroundColor: activeTab === "applications" ? "#e84393" : "#fd79a8",
            color: "white",
            fontWeight: "bold",
            flex: 1
          }}
        >
          Application Tracking
        </Button>
      </div>

      {/* Company Registration Tab */}
      {activeTab === "company" && (
        <div className="space-y-4">
          <Card style={{ backgroundColor: "#fab1a0", borderColor: "#e17055" }}>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4" style={{ color: "#d63031" }}>Register a Company</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Company Name *"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  style={{ backgroundColor: "#ffeaa7" }}
                />
                <Input
                  placeholder="Company Email *"
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  style={{ backgroundColor: "#ffeaa7" }}
                />
                <Input
                  placeholder="Industry *"
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                  style={{ backgroundColor: "#ffeaa7" }}
                />  
                <Input
                  placeholder="Company Description"
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  className="col-span-full"
                  style={{ backgroundColor: "#ffeaa7" }}
                />
                <Button 
                  onClick={registerCompany} 
                  className="col-span-full"
                  style={{ 
                    backgroundColor: "#ffeaa7", 
                    color: "#2d3436", 
                    fontWeight: "bold",
                    borderColor: "#e17055"
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Register Company"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#fab1a0", borderColor: "#e17055" }}>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4" style={{ color: "#d63031" }}>Post a Job</h2>
              
              {/* Company Selection */}
              <div className="mb-4">
                <label className="block mb-2 font-medium" style={{ color: "#000000" }}>Select Company </label>
                <select 
                  className="border rounded px-3 py-2 w-full"
                  value={selectedCompany || ""}
                  onChange={(e) => setSelectedCompany(Number(e.target.value) || null)}
                  style={{ backgroundColor: "#ffeaa7", borderColor: "#fdcb6e" }}
                >
                  <option value="" >-- Select Company --</option>
                  {companies.map((company) => (
                    <option key={company.company_id} value={company.company_id} >
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Job Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Job Title *"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  style={{ backgroundColor: "#000000" }}
                />
                <Input
                  placeholder="Salary Package *"
                  value={jobForm.salary_package}
                  onChange={(e) => setJobForm({ ...jobForm, salary_package: e.target.value })}
                  style={{ backgroundColor: "#ffeaa7" }}
                />
                <Input
                  placeholder="Job Description *"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="col-span-full"
                  style={{ backgroundColor: "#ffeaa7" }}
                />
                <Button 
                  onClick={postJob} 
                  className="col-span-full"
                  style={{ 
                    backgroundColor: "#fdcb6e", 
                    color: "#2d3436", 
                    fontWeight: "bold",
                    borderColor: "#e17055"
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Post Job"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <Card style={{ backgroundColor: "#fab1a0", borderColor: "#e17055" }}>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: "#d63031" }}>Application Tracking</h2>
              
              {/* Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: "#2d3436" }}>Filter by:</span>
                <select 
                  className="border rounded px-2 py-1"
                  value={applicationFilter}
                  onChange={(e) => setApplicationFilter(e.target.value)}
                  style={{ backgroundColor: "#ffeaa7", borderColor: "#fdcb6e" }}
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
            {isLoading ? (
              <p className="text-center py-4" style={{ color: "#6c5ce7" }}>Loading applications...</p>
            ) : filteredApplications.length === 0 ? (
              <p className="text-center py-4" style={{ color: "#6c5ce7" }}>No applications found</p>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div 
                    key={app.application_id} 
                    className="border rounded-lg p-4 shadow-sm"
                    style={{ backgroundColor: "#ffffff", borderColor: "#fdcb6e" }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold" style={{ color: "#2d3436" }}>{app.student_name}</h3>
                        <p className="text-sm" style={{ color: "#636e72" }}>Applied for: {app.job_title}</p>
                        <p className="text-xs text-gray-500">Application Date: {app.application_date}</p>
                      </div>
                      <div className="text-right">
                        <span 
                          className={`inline-block px-2 py-1 rounded text-xs`}
                          style={{ 
                            backgroundColor: 
                              app.status === 'selected' ? '#55efc4' : 
                              app.status === 'rejected' ? '#ff7675' :
                              app.status === 'shortlisted' ? '#74b9ff' :
                              app.status === 'interview' ? '#a29bfe' :
                              '#dfe6e9',
                            color: 
                              app.status === 'selected' ? '#00b894' : 
                              app.status === 'rejected' ? '#d63031' :
                              app.status === 'shortlisted' ? '#0984e3' :
                              app.status === 'interview' ? '#6c5ce7' :
                              '#2d3436'
                          }}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Update Buttons */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button 
                        className="py-1 px-2 text-xs"
                        onClick={() => updateApplicationStatus(app.application_id, "shortlisted")}
                        style={{ backgroundColor: "#74b9ff", color: "#2d3436" }}
                      >
                        Shortlist
                      </Button>
                      <Button 
                        className="py-1 px-2 text-xs"
                        onClick={() => updateApplicationStatus(app.application_id, "interview")}
                        style={{ backgroundColor: "#a29bfe", color: "#2d3436" }}
                      >
                        Schedule Interview
                      </Button>
                      <Button 
                        className="py-1 px-2 text-xs"
                        onClick={() => updateApplicationStatus(app.application_id, "selected")}
                        style={{ backgroundColor: "#55efc4", color: "#2d3436" }}
                      >
                        Select
                      </Button>
                      <Button 
                        className="py-1 px-2 text-xs"
                        onClick={() => updateApplicationStatus(app.application_id, "rejected")}
                        style={{ backgroundColor: "#ff7675", color: "#2d3436" }}
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