import React, {FC, SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  color?: string;
}

/* ====== SHIELD ICON ====== */
export const ShieldIcon: React.FC<IconProps> = ({
  className = "",
  size = 25,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M17 12.0004C17 17.0004 13.5 19.5005 9.34 20.9505C9.12216 21.0243 8.88554 21.0207 8.67 20.9405C4.5 19.5005 1 17.0004 1 12.0004V5.00045C1 4.73523 1.10536 4.48088 1.29289 4.29334C1.48043 4.10581 1.73478 4.00045 2 4.00045C4 4.00045 6.5 2.80045 8.24 1.28045C8.45185 1.09945 8.72135 1 9 1C9.27865 1 9.54815 1.09945 9.76 1.28045C11.51 2.81045 14 4.00045 16 4.00045C16.2652 4.00045 16.5196 4.10581 16.7071 4.29334C16.8946 4.48088 17 4.73523 17 5.00045V12.0004Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ====== TREND ICON ====== */
export const TrendUpIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 7L13.5 15.5L8.5 10.5L2 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 7H22V13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ====== USERS ICON ====== */
export const UsersIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ====== INTEREST ICON ====== */
export const InterestIcon: React.FC<IconProps> = ({
  size = 20,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18.3334 10H13.3334L11.6667 12.5H8.33341L6.66675 10H1.66675"
      stroke={color}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.54175 4.25834L1.66675 10V15C1.66675 15.442 1.84234 15.866 2.1549 16.1785C2.46746 16.4911 2.89139 16.6667 3.33341 16.6667H16.6667C17.1088 16.6667 17.5327 16.4911 17.8453 16.1785C18.1578 15.866 18.3334 15.442 18.3334 15V10L15.4584 4.25834C15.3204 3.98066 15.1077 3.74698 14.8442 3.58357C14.5807 3.42016 14.2768 3.3335 13.9667 3.33334H6.03341C5.72334 3.3335 5.41947 3.42016 5.15595 3.58357C4.89244 3.74698 4.67973 3.98066 4.54175 4.25834Z"
      stroke={color}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ====== HOME ICON ====== */
export const HomeIcon: React.FC<IconProps> = ({
  size = 18,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0.833252 7.49958C0.833194 7.25713 0.88603 7.0176 0.988075 6.79767C1.09012 6.57775 1.23892 6.38274 1.42409 6.22624L7.25742 1.22708C7.55824 0.972834 7.93938 0.833344 8.33325 0.833344C8.72712 0.833344 9.10826 0.972834 9.40909 1.22708L15.2424 6.22624C15.4276 6.38274 15.5764 6.57775 15.6784 6.79767C15.7805 7.0176 15.8333 7.25713 15.8333 7.49958V14.9996C15.8333 15.4416 15.6577 15.8655 15.3451 16.1781C15.0325 16.4906 14.6086 16.6662 14.1666 16.6662H2.49992C2.05789 16.6662 1.63397 16.4906 1.32141 16.1781C1.00885 15.8655 0.833252 15.4416 0.833252 14.9996V7.49958Z"
      stroke={color}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ====== LOGOUT ICON ====== */
export const LogoutIcon: React.FC<IconProps> = ({
  size = 20,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5"
      stroke={color}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.3333 14.1666L17.4999 9.99998L13.3333 5.83331"
      stroke={color}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 10H7.5"
      stroke={color}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ====== SUCCESS CHECK ICON ====== */
export const SuccessCheckIcon: React.FC<IconProps> = ({
  size = 12,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#success_check_clip)">
      <path
        d="M10.9003 4.99999C11.1287 6.12064 10.9659 7.28571 10.4392 8.30089C9.91255 9.31608 9.05375 10.12 8.00606 10.5787C6.95837 11.0373 5.78512 11.1229 4.68196 10.8212C3.57879 10.5195 2.6124 9.84869 1.94394 8.92071C1.27549 7.99272 0.945367 6.86361 1.00864 5.72169C1.07191 4.57976 1.52475 3.49404 2.29163 2.64558C3.05852 1.79712 4.0931 1.23721 5.22284 1.05922C6.35258 0.881233 7.5092 1.09592 8.49981 1.66749"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 5.5L6 7L11 2"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="success_check_clip">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/* ====== CLOCK ICON ====== */
export const ClockIcon: React.FC<IconProps> = ({
  size = 12,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clock_icon_clip)">
      <path
        d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 3V6L8 7"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clock_icon_clip">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// INTEREST SUCCESS ICON
export const InterestSuccessIcon: FC<IconProps> = ({
  size = 64,
  color = "#00A63E",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M58.1359 26.6666C59.3538 32.6434 58.4858 38.8571 55.6768 44.2714C52.8679 49.6857 48.2876 53.9734 42.6999 56.4195C37.1123 58.8655 30.8549 59.3221 24.9714 57.713C19.0878 56.1038 13.9337 52.5264 10.3686 47.5771C6.80353 42.6278 5.04289 36.6059 5.38034 30.5157C5.71778 24.4254 8.13291 18.6349 12.223 14.1098C16.313 9.58464 21.8308 6.59845 27.8561 5.64918C33.8814 4.69991 40.05 5.84493 45.3332 8.8933"
      stroke={color}
      strokeWidth={5.33333}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 29.3332L32 37.3332L58.6667 10.6665"
      stroke={color}
      strokeWidth={5.33333}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);