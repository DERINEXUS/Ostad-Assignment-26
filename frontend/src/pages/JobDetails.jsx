import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/jobs/${id}`)
      .then(res => { setJob(res.data); setLoading(false); })
      .catch(err => { console.error(err); setError('Job not found.'); setLoading(false); });
  }, [id]);

  const handleApply = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      const res = await axios.post(`http://localhost:5000/api/jobs/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error applying for job');
      setMessage('');
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading...</div>;
  if (!job) return <div className="text-center mt-20 text-xl text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
      <p className="text-xl text-blue-600 font-semibold mb-4">{job.company}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6 text-gray-600 bg-gray-50 p-4 rounded-lg">
        <p><strong>📍 Location:</strong> {job.location}</p>
        <p><strong>💼 Job Type:</strong> {job.jobType}</p>
        <p><strong>💰 Salary:</strong> {job.salary || 'Not disclosed'}</p>
        <p><strong>👤 Posted by:</strong> {job.postedBy?.name || 'Recruiter'}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800 border-b pb-2">Job Description</h2>
        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{job.description}</p>
      </div>

      {job.requirements && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2 text-gray-800 border-b pb-2">Requirements</h2>
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{job.requirements}</p>
        </div>
      )}
      
      {message && <p className="text-green-600 bg-green-50 p-3 rounded font-bold mb-4 text-center border border-green-200">{message}</p>}
      {error && <p className="text-red-600 bg-red-50 p-3 rounded font-bold mb-4 text-center border border-red-200">{error}</p>}

      <button onClick={handleApply} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition w-full text-lg shadow-md">
        Apply Now
      </button>
    </div>
  );
}