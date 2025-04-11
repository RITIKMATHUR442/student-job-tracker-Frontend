import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "Applied",
    dateOfApplication: "",
    link: ""
  });
  const [editingId, setEditingId] = useState(null);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  const fetchJobs = async () => {
    const res = await axios.get("https://student-job-tracker-backend-zwry.onrender.com/api/jobs");

    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`https://student-job-tracker-backend-zwry.onrender.com/api/jobs?date=2025-04-09/api/jobs/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post("https://student-job-tracker-backend-zwry.onrender.com/api/jobs?date=2025-04-09/api/jobs", form);
    }
    setForm({ company: "", role: "", status: "Applied", dateOfApplication: "", link: "" });
    fetchJobs();
  };

  const handleEdit = (job) => {
    setForm(job);
    setEditingId(job._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://student-job-tracker-backend-zwry.onrender.com/api/jobs?date=2025-04-09/api/jobs/${id}`);
    fetchJobs();
  };

  // Filtered jobs based on selected filters
  const filteredJobs = jobs.filter((job) => {
    const matchStatus = filterStatus === "All" || job.status === filterStatus;
    const matchDate = !filterDate || job.dateOfApplication.startsWith(filterDate);
    return matchStatus && matchDate;
  });

  return (
    <div className="app-container">
      <h1 className="title">Student Job Tracker</h1>

      {/* Filter Section */}
      <div className="filter-bar">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Job Form */}
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-grid">
          <input name="company" type="text" placeholder="Company" value={form.company} onChange={handleChange} required />
          <input name="role" type="text" placeholder="Role" value={form.role} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <input name="dateOfApplication" type="date" value={form.dateOfApplication} onChange={handleChange} required />
        </div>
        <input name="link" type="url" placeholder="Job Link" value={form.link} onChange={handleChange} />
        <button className="submit-btn">{editingId ? "Update" : "Add Job"}</button>
      </form>

      {/* Job List */}
      <div className="job-list">
        {filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-info">
              <h2>{job.role} @ {job.company}</h2>
              <p>Status: <strong>{job.status}</strong></p>
              <p>
                Applied on:{" "}
                {new Date(job.dateOfApplication).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true
                })}
              </p>
              <a href={job.link} target="_blank" rel="noreferrer">Job Link</a>
            </div>
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => handleEdit(job)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(job._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

