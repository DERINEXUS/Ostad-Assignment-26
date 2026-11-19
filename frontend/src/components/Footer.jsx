export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-6 mt-auto">
      <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
      <p className="text-sm text-gray-400 mt-2">Built for Module 26 Final Assignment</p>
    </footer>
  );
}