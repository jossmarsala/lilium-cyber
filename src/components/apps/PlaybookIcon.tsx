import type { JSX } from "react";

/** Minimalist Book / Compass / Shield line glyph for the Playbook */
export function PlaybookLineIcon({ size = 24 }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h10" />
      <path d="M6 14h6" />
      <circle cx="16" cy="15" r="2.5" />
    </svg>
  );
}

/** Windows 11 Fluent style icon for Playbook */
export function PlaybookFluentIcon({ size = 24 }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.25 3C4.45507 3 3 4.45507 3 6.25V19.75C3 20.9926 4.00736 22 5.25 22H18.75C19.9926 22 21 20.9926 21 19.75V6.25C21 4.45507 19.5449 3 17.75 3H6.25ZM6.25 4.5H17.75C18.7165 4.5 19.5 5.2835 19.5 6.25V17.5H5.25C4.83579 17.5 4.5 17.8358 4.5 18.25V6.25C4.5 5.2835 5.2835 4.5 6.25 4.5ZM5.25 19H19.5V19.75C19.5 20.1642 19.1642 20.5 18.75 20.5H5.25C4.83579 20.5 4.5 20.1642 4.5 19.75V19.25C4.70711 19.091 4.96564 19 5.25 19ZM7 7.75C7 7.33579 7.33579 7 7.75 7H16.25C16.6642 7 17 7.33579 17 7.75C17 8.16421 16.6642 8.5 16.25 8.5H7.75C7.33579 8.5 7 8.16421 7 7.75ZM7 11.75C7 11.3358 7.33579 11 7.75 11H13.25C13.6642 11 14 11.3358 14 11.75C14 12.1642 13.6642 12.5 13.25 12.5H7.75C7.33579 12.5 7 12.1642 7 11.75Z" />
    </svg>
  );
}

export default PlaybookLineIcon;
