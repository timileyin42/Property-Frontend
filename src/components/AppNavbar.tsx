import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

interface AppNavbarProps {
  title: string;
  subtitle?: string;
  backLabel?: string;
  backTo?: string;
  rightSlot?: ReactNode; // optional custom content (future-proof)
}

const AppNavbar = ({
  title,
  subtitle,
  backLabel = "Back",
  backTo,
  rightSlot,
}: AppNavbarProps) => {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        
        {/* Left */}
        <Link to="/" className="flex items-center gap-3 text-2xl">
          {/* Logo */}
          <div className="h-9 w-9 text-5xl rounded-lg bg-primary text-white flex items-center justify-center font-bold">
            E
          </div>

          {/* Title */}
          <div className="leading-tight text-blue-900">
            <h1 className="text-2xl sm:text-base font-semibold texy-blue-600">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-500 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          {rightSlot}

          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="inline-flex items-center gap-2 rounded-md border border-blue-900 px-3 py-2 text-sm font-medium text-blue-900 hover:bg-gray-100 transition"
            >
              ← {backLabel}
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default AppNavbar;
