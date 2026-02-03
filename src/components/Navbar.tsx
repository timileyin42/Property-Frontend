import { useState } from "react";
import BuildingIcon from "./svgs/BuildingIcon"
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import {LogoutIcon} from "./svgs/ShieldIcon"

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  logoText?: string;
  links?: NavbarLink[];
  // showAuthButton?: boolean;
  onAuthClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  logoText = "Elycapvest",
  links = [],
  // showAuthButton = true,
  // onAuthClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

// check user's state
const {isAuthenticated, logout} = useAuth();


  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex flex-row items-center gap-1 text-lg font-semibold font-inter text-blue-900 whitespace-nowrap "
          >
        	<BuildingIcon/>

            <span>{logoText}</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <div key={link.href} className="">
                <a
                key={link.href}
                href={link.href}
                className="text-md text-gray-700 hover:text-blue-600 transition"
              >
                {link.label}
              </a>
              </div>
            ))}

            {!isAuthenticated ? (
  <button
    onClick={() => navigate("/signup")}
    className="text-sm border border-blue-600 text-blue-600 px-4 py-1.5 rounded-md hover:bg-blue-50 transition"
  >
    Sign Up
  </button>
) : (
  <button
    onClick={() => {
      logout();
      navigate("/login");
    }}
    className="flex gap-2 items-center text-sm  text-red-600 px-4 py-1.5 rounded-md hover:bg-red-50 transition"
  >
    <LogoutIcon />
    <span>Logout</span>
  </button>
)}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm text-gray-700 hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}

            {!isAuthenticated ? (
  <button
    onClick={() => navigate("/signup")}
    className="text-sm border border-blue-600 text-blue-600 px-4 py-1.5 rounded-md hover:bg-blue-50 transition"
  >
    Sign Up
  </button>
) : (
  <button
    onClick={() => {
      logout();
      navigate("/login");
    }}
    className=" flex gap-2 items-center text-sm  text-red-600 px-4 py-1.5 rounded-md hover:bg-red-50 transition"
  >
    <LogoutIcon />
    <span>Logout</span>
  </button>
)}

          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
