import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', description: '', requirements: '', salary: '', jobType: 'Full-time' });
  const [myJobs, setMyJobs] = useState([]);
  const [postMessage, setPostMessage] = useState('');
  const [editingId, setEditingId] = useState(null); // Track if we are editing

  const [profile, setProfile] = useState({ name: '', phone: '', bio: '', skills: '' });
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [profileMessage, setProfileMessage] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }

    if (user?.role === 'recruiter') {
      axios.get('http://localhost:5000/api/jobs')
        .then(res => {
          const filtered = res.data.filter(job => job.postedBy?._id === user.id || job.postedBy === user.id);
          setMyJobs(filtered);
          setLoading(false);
        }).catch(() => setLoading(false));
    } else {
      axios.get('http://localhost:5000/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setProfile({ name: res.data.user.name, phone: res.data.user.phone || '', bio: res.data.user.bio || '', skills: res.data.user.skills || '' });
          setAppliedJobs(res.data.appliedJobs);
          setLoading(false);
        }).catch(() => setLoading(false));
    }
  }, [token, navigate, user]);

  // ================= RECRUITER ACTIONS =================
  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing job
        const res = await axios.put(`http://localhost:5000/api/jobs/${editingId}`, jobForm, { headers: { Authorization: `Bearer ${token}` } });
        setMyJobs(myJobs.map(job => job._id === editingId ? res.data : job));
        setPostMessage('Job updated successfully! ✅');
        setEditingId(null);
      } else {
        // Create new job
        const res = await axios.post('http://localhost:5000/api/jobs', jobForm, { headers: { Authorization: `Bearer ${token}` } });
        setMyJobs([res.data, ...myJobs]);
        setPostMessage('Job posted successfully! 🎉');
      }
      setJobForm({ title: '', company: '', location: '', description: '', requirements: '', salary: '', jobType: 'Full-time' });
    } catch (error) { setPostMessage('Error saving job'); }
  };

  const handleEditClick = (job) => {
    setJobForm({ 
      title: job.title, company: job.company, location: job.location, 
      description: job.description, requirements: job.requirements || '', 
      salary: job.salary || '', jobType: job.jobType 
    });
    setEditingId(job._id);
    window.scrollTo(0, 0);
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMyJobs(myJobs.filter(job => job._id !== id));
    } catch (error) { alert('Error deleting job'); }
  };

  // ================= USER SEEKER ACTIONS =================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/users/profile', profile, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setProfileMessage('Profile updated successfully! ✅');
    } catch (error) { setProfileMessage('Error updating profile'); }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Dashboard...</div>;

  // ================= RENDER RECRUITER DASHBOARD =================
  if (user?.role === 'recruiter') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="bg-white p-6 rounded-lg shadow-md border h-fit">
          <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Job' : 'Post a New Job'}</h2>
          {postMessage && <p className="text-green-600 bg-green-50 p-2 rounded mb-4 text-center">{postMessage}</p>}
          <form onSubmit={handlePostJob} className="space-y-4">
            <input type="text" placeholder="Job Title" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required className="w-full p-2 border rounded" />
            <input type="text" placeholder="Company Name" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} required className="w-full p-2 border rounded" />
            <input type="text" placeholder="Location" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} required className="w-full p-2 border rounded" />
            <input type="text" placeholder="Salary" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} className="w-full p-2 border rounded" />
            <textarea placeholder="Description" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} required rows="3" className="w-full p-2 border rounded"></textarea>
            <textarea placeholder="Requirements" value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} rows="2" className="w-full p-2 border rounded"></textarea>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold w-full">{editingId ? 'Update Job' : 'Post Job'}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setJobForm({ title: '', company: '', location: '', description: '', requirements: '', salary: '', jobType: 'Full-time' }) }} className="bg-gray-400 text-white px-4 py-2 rounded font-bold">Cancel</button>}
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Your Posted Jobs</h2>
          {myJobs.length === 0 ? <p>You haven't posted any jobs yet.</p> : (
            <div className="space-y-4">
              {myJobs.map(job => (
                <div key={job._id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-gray-500 text-sm">{job.company} • {job.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(job)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 font-semibold text-sm">Edit</button>
                    <button onClick={() => handleDeleteJob(job._id)} className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 font-semibold text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= RENDER JOB SEEKER DASHBOARD =================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
      <div className="bg-white p-6 rounded-lg shadow-md border h-fit">
        <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
        {profileMessage && <p className="text-green-600 bg-green-50 p-2 rounded mb-4 text-center">{profileMessage}</p>}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Phone</label>
            <input type="text" placeholder="e.g. +880 123456789" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Skills (Comma separated)</label>
            <input type="text" placeholder="React, Node.js, MongoDB" value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Bio</label>
            <textarea placeholder="Tell us about yourself..." value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} rows="3" className="w-full p-2 border rounded"></textarea>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold w-full hover:bg-green-700">Save Profile</button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Jobs You Applied For</h2>
        {appliedJobs.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow border text-center text-gray-500">
            <p>You haven't applied for any jobs yet.</p>
            <Link to="/jobs" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appliedJobs.map(job => (
              <div key={job._id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <p className="text-gray-500 text-sm">{job.company} • {job.location}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">Applied</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}