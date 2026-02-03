// components/PropertyActions.tsx
import { useState } from "react";
// import {fetchProperties} from "../api/properties"

interface Props {
  onView: () => void;
  onEdit: () => void;
}

export const PropertyActions = ({ onView, onEdit }: Props) => {
  const [open, setOpen] = useState(false);
  console.log()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded hover:bg-gray-100"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded border z-10">
          <button
            onClick={onView}
            className="block w-full text-left px-4 py-2 hover:bg-gray-50"
          >
            View
          </button>
          <button
            onClick={onEdit}
            className="block w-full text-left px-4 py-2 hover:bg-gray-50"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};
