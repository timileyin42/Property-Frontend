import React, { SVGProps } from "react";

// Extending SVGProps allows the component to accept all standard SVG attributes
export interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  color?: string;
}

const BuildingIcon: React.FC<IconProps> = ({
  className = "",
  size = 32,
  color = "#1E3A8A", // Defaulting to your original blue
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M8 29.3333V5.33333C8 4.62609 8.28095 3.94781 8.78105 3.44771C9.28115 2.94762 9.95942 2.66667 10.6667 2.66667H21.3333C22.0406 2.66667 22.7189 2.94762 23.219 3.44771C23.719 3.94781 24 4.62609 24 5.33333V29.3333H8Z"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16H5.33333C4.62609 16 3.94781 16.281 3.44771 16.781C2.94762 17.2811 2.66667 17.9594 2.66667 18.6667V26.6667C2.66667 27.3739 2.94762 28.0522 3.44771 28.5523C3.94781 29.0524 4.62609 29.3333 5.33333 29.3333H8"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 12H26.6667C27.3739 12 28.0522 12.281 28.5523 12.781C29.0524 13.2811 29.3333 13.9594 29.3333 14.6667V26.6667C29.3333 27.3739 29.0524 28.0522 28.5523 28.5523C28.0522 29.0524 27.3739 29.3333 26.6667 29.3333H24"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 8H18.6667"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 13.3333H18.6667"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 18.6667H18.6667"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 24H18.6667"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BuildingIcon;