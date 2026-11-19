import { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs?limit=6')
      .then(res => { setFeaturedJobs(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="space-y-16 py-8">
      <section className="text-center bg-blue-50 py-16 px-4 rounded-xl border">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Find Your Dream Job Today</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Explore thousands of job opportunities with all the information you need. It's your future. Come find it.</p>
        <Link to="/jobs" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition text-lg">Browse All Jobs</Link>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Featured Jobs</h2>
          <Link to="/jobs" className="text-blue-600 font-semibold hover:underline">View All</Link>
        </div>
        
        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : featuredJobs.length === 0 ? (
          <p className="text-center text-gray-500">No jobs posted yet. Check back later!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </section>
    </div>
  );
}