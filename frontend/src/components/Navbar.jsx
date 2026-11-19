import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">JobPortal</Link>
        <div className="flex items-center space-x-6">
          <Link to="/jobs" className="hover:text-gray-200">All Jobs</Link>
          <Link to="/contact" className="hover:text-gray-200">Contact</Link>
          {token ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}