import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#D32F2F] text-white z-50 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        
        <Link to="/" className="flex items-center gap-2">
         
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
          >
          
            <path 
              d="M20 20 L50 80 L80 20 L65 20 L50 55 L35 20 Z" 
              fill="white" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <div className="flex items-center gap-4">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;