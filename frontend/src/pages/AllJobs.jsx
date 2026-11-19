import { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => { setJobs(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">All Job Openings</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border"><p className="text-xl text-gray-500">No jobs available right now.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      )}
    </div>
  );
}