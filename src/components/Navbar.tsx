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

  const roleDashboardLink = user ? "/investor/dashboard" : null;

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
      label: "My Portfolio",
      href: "/investor/portfolio",
      icon: <HomeIcon />,
    });
    userMenuItems.unshift({
      label: "Investor Dashboard",
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
    <header className="fixed top-0 left-0 w-full z-50 glass-panel border-x-0 border-t-0">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex flex-row items-center gap-2 font-display text-xl sm:text-2xl font-medium text-premium-gold tracking-tight min-w-0"
            >
              <BuildingIcon color="#c9a84c" />

              <span className="truncate max-w-[11rem] sm:max-w-none">{logoText}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isUserMenu &&
              links.map((link) => (
                <div key={link.href} className="">
                  <a
                    key={link.href}
                    href={link.href}
                    className="label-caps text-on-surface-variant hover:text-premium-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </div>
              ))}

            {isUserMenu && user?.role !== "ADMIN" && (
              <div className="flex items-center gap-8">
                <Link
                  to="/properties"
                  className="label-caps text-on-surface-variant hover:text-premium-gold transition-colors duration-300"
                >
                  Marketplace
                </Link>
                <Link
                  to="/about"
                  className="label-caps text-on-surface-variant hover:text-premium-gold transition-colors duration-300"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="label-caps text-on-surface-variant hover:text-premium-gold transition-colors duration-300"
                >
                  Contact
                </Link>
              </div>
            )}

            <div className="flex items-center gap-4">
              {!isAuthenticated && (
                <button
                  onClick={() => navigate("/signup")}
                  className="btn-gold px-6 py-2.5 text-[12px]"
                >
                  Invest Now
                </button>
              )}
              {isUserMenu ? (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center justify-center h-11 w-11 rounded-full border border-[rgba(248,246,241,0.15)] text-on-surface hover:border-premium-gold hover:text-premium-gold transition"
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
                className="flex gap-2 items-center text-base text-error px-4 py-1.5 rounded-full hover:bg-error-container/20 transition"
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
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-on-surface hover:bg-white/5 focus:outline-none"
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
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-premium-gold hover:bg-white/5 focus:outline-none"
              aria-label="Open menu"
            >
              {gridIcon}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block label-caps text-on-surface-variant hover:text-premium-gold"
              >
                {link.label}
              </a>
            ))}

            {!isAuthenticated ? (
              <button
                onClick={() => navigate("/signup")}
                className="btn-gold px-4 py-2 text-[12px]"
              >
                Sign Up
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className=" flex gap-2 items-center text-sm text-error px-4 py-1.5 rounded-full hover:bg-error-container/20 transition"
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
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside
            className={`fixed left-0 top-0 h-screen w-64 bg-surface-lowest text-on-surface px-4 py-6 z-50 border-r border-[rgba(248,246,241,0.15)] transform transition-transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Link
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2 font-display text-xl font-medium text-premium-gold"
            >
              <BuildingIcon color="#c9a84c" />
              <span>Elycapvest</span>
            </Link>

            <nav className="mt-10 flex flex-col gap-2">
              {userMenuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-white/5 hover:text-premium-gold transition"
                >
                  <span>{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
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
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error-container/20 transition"
                >
                  <LogoutIcon />
                  <span className="text-sm">Logout</span>
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
