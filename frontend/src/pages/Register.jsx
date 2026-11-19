import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 border">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="w-full mb-4 px-3 py-2 border rounded-lg" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full mb-4 px-3 py-2 border rounded-lg" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full mb-4 px-3 py-2 border rounded-lg" />
        
        <select name="role" onChange={handleChange} className="w-full mb-6 px-3 py-2 border rounded-lg bg-white">
          <option value="user">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold transition">Register</button>
        <p className="text-sm text-center mt-4">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
      </form>
    </div>
  );
}