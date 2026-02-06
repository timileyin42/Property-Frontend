import { useState } from "react";
import BuildingIcon from "./svgs/BuildingIcon";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HomeIcon, InterestIcon, LogoutIcon, UsersIcon } from "./svgs/ShieldIcon";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

// check user's state
const {isAuthenticated, logout, user} = useAuth();

  const isUserMenu = true;

  const roleDashboardLink =
    user?.role === "ADMIN"
      ? "/admindashboard"
      : user
        ? "/investor/dashboard"
        : null;

  const userMenuItems = [
    { label: "Properties", href: "/properties", icon: <HomeIcon /> },
    { label: "Updates", href: "/updates", icon: <InterestIcon /> },
  ];

  if (!isAuthenticated) {
    userMenuItems.push({
      label: "Sign Up",
      href: "/signup",
      icon: <UsersIcon />,
    });
    userMenuItems.push({
      label: "Partnership",
      href: "/partnership",
      icon: <InterestIcon />,
    });
  } else {
    userMenuItems.push({
      label: "Profile",
      href: "/profile",
      icon: <UsersIcon />,
    });
    userMenuItems.push({
      label: "Partnership",
      href: "/partnership",
      icon: <InterestIcon />,
    });
  }

  if (roleDashboardLink) {
    userMenuItems.unshift({
      label: user?.role === "ADMIN" ? "Admin Dashboard" : "Investor Dashboard",
      href: roleDashboardLink,
      icon: <HomeIcon />,
    });
  }


  const gridIcon = (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeDasharray="2 2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 5h6v6H5V5zm8 0h6v6h-6V5zM5 13h6v6H5v-6zm8 0h6v6h-6v-6z"
      />
    </svg>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex flex-row items-center gap-2 text-base sm:text-lg font-semibold font-inter text-blue-900 min-w-0"
            >
              <BuildingIcon />

              <span className="truncate max-w-[11rem] sm:max-w-none">{logoText}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {!isUserMenu &&
              links.map((link) => (
                <div key={link.href} className="">
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-base text-gray-700 hover:text-blue-600 transition"
                  >
                    {link.label}
                  </a>
                </div>
              ))}

            {isUserMenu && user?.role !== "ADMIN" && (
              <div className="flex items-center gap-4">
                <Link
                  to="/about"
                  className="text-base text-gray-700 hover:text-blue-600 transition"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-base text-gray-700 hover:text-blue-600 transition"
                >
                  Contact Us
                </Link>
              </div>
            )}

            <div className="flex items-center gap-3">
              {!isAuthenticated && (
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-blue-900 text-white font-sans px-5 py-2 rounded-md transition-all duration-500 hover:bg-blue-500 text-base"
                >
                  Join Us
                </button>
              )}
              {isUserMenu ? (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center justify-center h-11 w-11 rounded-md border border-blue-900 text-blue-900 hover:bg-blue-50 transition"
                  aria-label="Open menu"
                >
                  {gridIcon}
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                className="flex gap-2 items-center text-base text-red-600 px-4 py-1.5 rounded-md hover:bg-red-50 transition"
                >
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          {!isUserMenu ? (
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
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-blue-900 hover:bg-blue-50 focus:outline-none"
              aria-label="Open menu"
            >
              {gridIcon}
            </button>
          )}
        </div>

        {isUserMenu && user?.role !== "ADMIN" && (
          <div className="md:hidden flex flex-wrap items-center gap-3 pb-3">
            <Link
              to="/about"
              className="text-sm text-gray-700 hover:text-blue-600 transition"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-700 hover:text-blue-600 transition"
            >
              Contact Us
            </Link>
            {!isAuthenticated && (
              <button
                onClick={() => navigate("/signup")}
                className="text-sm border border-blue-600 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50 transition"
              >
                Join Us
              </button>
            )}
          </div>
        )}

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
                className=" flex gap-2 items-center text-sm text-red-600 px-4 py-1.5 rounded-md hover:bg-red-50 transition"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            )}

          </div>
        )}
      </nav>

      {isUserMenu && (
        <>
          <div
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside
            className={`fixed left-0 top-0 h-screen w-64 bg-blue-900 text-white px-4 py-6 z-50 transform transition-transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Link
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <BuildingIcon color="white" />
              <span>Elycapvest</span>
            </Link>

            <nav className="mt-8 flex flex-col gap-3">
              {userMenuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition"
                >
                  <span className="text-white">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {isAuthenticated && (
              <div className="absolute bottom-6 left-4 right-4">
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition"
                >
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </header>
  );
};

export default Navbar;
