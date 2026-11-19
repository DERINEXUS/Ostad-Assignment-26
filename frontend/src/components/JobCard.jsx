import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
      <p className="text-blue-600 font-semibold">{job.company}</p>
      <p className="text-gray-500 text-sm mb-2">{job.location} • {job.jobType}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-700 font-medium">{job.salary || 'Salary not disclosed'}</span>
        <Link to={`/jobs/${job._id}`} className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition text-sm font-semibold">
          View Details
        </Link>
      </div>
    </div>
  );
}