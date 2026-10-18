import type { JSX, SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

/** 1. Fluent Yellow Folder Icon (Matches Windows 11 Explorer folder) */
export function FluentFolderIcon({ size = 20, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.5 6.5C2.5 5.39543 3.39543 4.5 4.5 4.5H9.2C9.73043 4.5 10.2391 4.71071 10.6142 5.08579L11.9142 6.38579C12.2893 6.76086 12.7979 6.97157 13.3284 6.97157H19.5C20.6046 6.97157 21.5 7.86614 21.5 8.97157V17.5C21.5 18.6046 20.6046 19.5 19.5 19.5H4.5C3.39543 19.5 2.5 18.6046 2.5 17.5V6.5Z"
        fill="#E0A612"
      />
      <path
        d="M2.5 9C2.5 7.89543 3.39543 7 4.5 7H19.5C20.6046 7 21.5 7.89543 21.5 9V17.5C21.5 18.6046 20.6046 19.5 19.5 19.5H4.5C3.39543 19.5 2.5 18.6046 2.5 17.5V9Z"
        fill="url(#folderFrontGrad)"
      />
      <defs>
        <linearGradient id="folderFrontGrad" x1="12" y1="7" x2="12" y2="19.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD448" />
          <stop offset="1" stopColor="#FFB900" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** 2. Fluent Blue Document Icon (Word / Auth / Policy telemetry) */
export function FluentDocIcon({ size = 20, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 4.5C5 3.39543 5.89543 2.5 7 2.5H14.5L19 7V19.5C19 20.6046 18.1046 21.5 17 21.5H7C5.89543 21.5 5 20.6046 5 19.5V4.5Z"
        fill="#185ABD"
      />
      <path d="M14.5 2.5V7H19L14.5 2.5Z" fill="#60A5FA" />
      {/* Content lines */}
      <rect x="8" y="10" width="8" height="1.6" rx="0.8" fill="#ffffff" fillOpacity="0.9" />
      <rect x="8" y="13.2" width="8" height="1.6" rx="0.8" fill="#ffffff" fillOpacity="0.75" />
      <rect x="8" y="16.4" width="5.5" height="1.6" rx="0.8" fill="#ffffff" fillOpacity="0.6" />
    </svg>
  )
}

/** 3. Fluent Green Excel / Network Data Icon */
export function FluentSheetIcon({ size = 20, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 4.5C5 3.39543 5.89543 2.5 7 2.5H14.5L19 7V19.5C19 20.6046 18.1046 21.5 17 21.5H7C5.89543 21.5 5 20.6046 5 19.5V4.5Z"
        fill="#107C41"
      />
      <path d="M14.5 2.5V7H19L14.5 2.5Z" fill="#34D399" />
      {/* Grid pattern */}
      <rect x="8" y="10.5" width="3.5" height="2.5" rx="0.5" fill="#ffffff" fillOpacity="0.85" />
      <rect x="12.5" y="10.5" width="3.5" height="2.5" rx="0.5" fill="#ffffff" fillOpacity="0.85" />
      <rect x="8" y="14" width="3.5" height="2.5" rx="0.5" fill="#ffffff" fillOpacity="0.7" />
      <rect x="12.5" y="14" width="3.5" height="2.5" rx="0.5" fill="#ffffff" fillOpacity="0.7" />
    </svg>
  )
}

/** 4. Fluent Red / Critical Threat Document Icon */
export function FluentAlertDocIcon({ size = 20, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 4.5C5 3.39543 5.89543 2.5 7 2.5H14.5L19 7V19.5C19 20.6046 18.1046 21.5 17 21.5H7C5.89543 21.5 5 20.6046 5 19.5V4.5Z"
        fill="#D13438"
      />
      <path d="M14.5 2.5V7H19L14.5 2.5Z" fill="#F87171" />
      {/* Exclamation badge */}
      <circle cx="12" cy="14" r="3.2" fill="#ffffff" />
      <path d="M12 12V14.5M12 16H12.01" stroke="#D13438" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** 5. Fluent Grey / Neutral Syslog Log Document */
export function FluentSyslogDocIcon({ size = 20, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 4.5C5 3.39543 5.89543 2.5 7 2.5H14.5L19 7V19.5C19 20.6046 18.1046 21.5 17 21.5H7C5.89543 21.5 5 20.6046 5 19.5V4.5Z"
        fill="#5C6B73"
      />
      <path d="M14.5 2.5V7H19L14.5 2.5Z" fill="#9BA2A6" />
      <rect x="8" y="10.5" width="8" height="1.4" rx="0.7" fill="#ffffff" fillOpacity="0.8" />
      <rect x="8" y="13.2" width="7" height="1.4" rx="0.7" fill="#ffffff" fillOpacity="0.65" />
      <rect x="8" y="15.9" width="8" height="1.4" rx="0.7" fill="#ffffff" fillOpacity="0.65" />
    </svg>
  )
}

/** 6. Fluent Desktop / Workstation Icon (Matches Image 1 DESKTOP-WN12024 / PC icon) */
export function FluentDesktopIcon({ size = 24, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Screen Frame */}
      <rect x="2.5" y="3.5" width="19" height="13" rx="2" fill="url(#desktopScreenGrad)" stroke="#0078D4" strokeWidth="1.2" />
      {/* Desktop Wallpaper preview line */}
      <path d="M4 12.5C6.5 10 9 14 12 11C15 8 18 13.5 20 12.5" stroke="#60CDFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* Stand Neck */}
      <path d="M12 16.5V20" stroke="#005A9E" strokeWidth="2" strokeLinecap="round" />
      {/* Stand Base */}
      <path d="M8 20.5H16" stroke="#005A9E" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="desktopScreenGrad" x1="12" y1="3.5" x2="12" y2="16.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0078D4" />
          <stop offset="1" stopColor="#004E8C" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** 7. Fluent Security Shield Icon (EDR / Protection) */
export function FluentShieldIcon({ size = 20, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 2.5L4.5 5.5V11.5C4.5 16.2 7.7 20.5 12 21.5C16.3 20.5 19.5 16.2 19.5 11.5V5.5L12 2.5Z"
        fill="url(#shieldGrad)"
      />
      {/* Checkmark inside */}
      <path
        d="M8.5 11.5L11 14L15.5 9.5"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="shieldGrad" x1="12" y1="2.5" x2="12" y2="21.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0078D4" />
          <stop offset="1" stopColor="#004E8C" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** 8. Fluent Critical Shield Alert Icon */
export function FluentShieldAlertIcon({ size = 20, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 2.5L4.5 5.5V11.5C4.5 16.2 7.7 20.5 12 21.5C16.3 20.5 19.5 16.2 19.5 11.5V5.5L12 2.5Z"
        fill="url(#shieldAlertGrad)"
      />
      <path
        d="M12 8V12M12 15H12.01"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="shieldAlertGrad" x1="12" y1="2.5" x2="12" y2="21.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E81123" />
          <stop offset="1" stopColor="#A80000" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** 9. Fluent Microchip / CPU Icon (Matches Image 1 Processor row) */
export function FluentCpuIcon({ size = 18, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="5" y="5" width="14" height="14" rx="2.5" fill="#1F2937" stroke="#374151" strokeWidth="1" />
      <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" fill="#0078D4" />
      {/* Pins */}
      <path
        d="M8 2V5M12 2V5M16 2V5M8 19V22M12 19V22M16 19V22M2 8H5M2 12H5M2 16H5M19 8H22M19 12H22M19 16H22"
        stroke="#F59E0B"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 10. Fluent RAM / Memory Module Icon (Matches Image 1 Installed RAM row) */
export function FluentRamIcon({ size = 18, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* PCB Board */}
      <rect x="3" y="7" width="18" height="10" rx="1.5" fill="#059669" />
      {/* Chips */}
      <rect x="5.5" y="9" width="3" height="4" rx="0.5" fill="#1F2937" />
      <rect x="10.5" y="9" width="3" height="4" rx="0.5" fill="#1F2937" />
      <rect x="15.5" y="9" width="3" height="4" rx="0.5" fill="#1F2937" />
      {/* Golden Contacts */}
      <path
        d="M5 17V18M7.5 17V18M10 17V18M14 17V18M16.5 17V18M19 17V18"
        stroke="#F59E0B"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 11. Fluent Network Globe / Port Socket Icon */
export function FluentGlobeIcon({ size = 18, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" fill="url(#globeGrad)" />
      <ellipse cx="12" cy="12" rx="4" ry="8.8" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.8" />
      <line x1="3.2" y1="12" x2="20.8" y2="12" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
      <line x1="5.5" y1="7.5" x2="18.5" y2="7.5" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <line x1="5.5" y1="16.5" x2="18.5" y2="16.5" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <defs>
        <linearGradient id="globeGrad" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** 12. Fluent Gold Key Icon (SSH / Auth / Credentials) */
export function FluentKeyIcon({ size = 18, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M14.5 9.5C14.5 12.5376 12.0376 15 9 15C5.96243 15 3.5 12.5376 3.5 9.5C3.5 6.46243 5.96243 4 9 4C12.0376 4 14.5 6.46243 14.5 9.5Z"
        fill="#F59E0B"
      />
      <circle cx="8" cy="9.5" r="2" fill="#ffffff" />
      {/* Key Shaft & Teeth */}
      <path
        d="M13.5 10.5L20.5 17.5M18.5 15.5L20 17M16 18L18 20"
        stroke="#D97706"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 13. Fluent User Avatar Icon */
export function FluentUserIcon({ size = 18, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" fill="#008272" />
      <circle cx="12" cy="9" r="3.2" fill="#ffffff" />
      <path
        d="M6.5 18C7.5 15.2 9.5 14 12 14C14.5 14 16.5 15.2 17.5 18"
        fill="#ffffff"
        opacity="0.9"
      />
    </svg>
  )
}

/** 14. Fluent Lightning Bolt Icon (Response Actions & Remediation) */
export function FluentBoltIcon({ size = 18, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M13 2.5L4.5 13H11.5L10.5 21.5L19.5 10.5H12.5L13 2.5Z"
        fill="url(#boltGrad)"
        stroke="#D97706"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="boltGrad" x1="12" y1="2.5" x2="12" y2="21.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** 15. Fluent Stop / Kill Process Icon */
export function FluentStopIcon({ size = 18, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Octagon */}
      <path
        d="M7.8 3.5H16.2L21 8.3V16.7L16.2 21.5H7.8L3 16.7V8.3L7.8 3.5Z"
        fill="#DC2626"
      />
      <rect x="8" y="10.8" width="8" height="2.4" rx="1.2" fill="#ffffff" />
    </svg>
  )
}

/** 16. Fluent Quarantine / Archive Box Icon */
export function FluentBoxIcon({ size = 18, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3.5 7.5L12 3.5L20.5 7.5V17.5L12 21.5L3.5 17.5V7.5Z"
        fill="#92400E"
      />
      <path
        d="M3.5 7.5L12 11.5L20.5 7.5"
        stroke="#B45309"
        strokeWidth="1.2"
      />
      <path
        d="M12 11.5V21.5"
        stroke="#78350F"
        strokeWidth="1.2"
      />
      {/* Quarantine stamp tape */}
      <rect x="9.5" y="6.5" width="5" height="4.5" fill="#F59E0B" opacity="0.9" />
    </svg>
  )
}

/** 17. Fluent Gear / Settings Process Icon */
export function FluentGearIcon({ size = 18, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="8" fill="#4B5563" />
      <circle cx="12" cy="12" r="3.5" fill="#ffffff" />
      {/* Teeth */}
      <path
        d="M12 2V4.5M12 19.5V22M2 12H4.5M19.5 12H22M4.9 4.9L6.7 6.7M17.3 17.3L19.1 19.1M4.9 19.1L6.7 17.3M17.3 6.7L19.1 4.9"
        stroke="#4B5563"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 18. Fluent Refresh / Sync Icon */
export function FluentRefreshIcon({ size = 16, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C15.352 4.5 18.2144 6.70275 19.1673 9.75M19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C8.64799 19.5 5.78564 17.2972 4.83271 14.25"
        stroke="#0078D4"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M19.5 5.5V10H15M4.5 18.5V14H9" stroke="#0078D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** 19. Fluent Copy / Clipboard Icon */
export function FluentCopyIcon({ size = 16, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="8" y="8" width="11" height="13" rx="2" fill="#E5E7EB" stroke="#4B5563" strokeWidth="1.4" />
      <rect x="5" y="3" width="11" height="13" rx="2" fill="#ffffff" stroke="#0078D4" strokeWidth="1.4" />
    </svg>
  )
}

/** 20. Fluent Cloud / Storage Buffer Icon (Matches Image 2 OneDrive usage card) */
export function FluentCloudIcon({ size = 18, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M7.5 18H17.5C19.7 18 21.5 16.2 21.5 14C21.5 11.9 19.9 10.2 17.8 10C17.3 6.6 14.4 4 11 4C8.2 4 5.8 5.8 4.9 8.3C2.7 9 1 11.1 1 13.5C1 16 3 18 5.5 18H7.5Z"
        fill="url(#cloudGrad)"
      />
      <defs>
        <linearGradient id="cloudGrad" x1="12" y1="4" x2="12" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** 21. Fluent Search Magnifying Glass Icon */
export function FluentSearchIcon({ size = 15, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="10.5" cy="10.5" r="6.5" stroke="#64748B" strokeWidth="2.2" />
      <path d="M15.5 15.5L20.5 20.5" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/** 22. Fluent Info Badge Icon */
export function FluentInfoIcon({ size = 16, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" fill="#0078D4" />
      <path d="M12 11V16M12 8H12.01" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/** 23. Fluent Check Circle Icon */
export function FluentCheckCircleIcon({ size = 16, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" fill="#107C41" />
      <path d="M8 12.2L10.8 15L16 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** 24. Fluent Warning Amber Badge Icon */
export function FluentWarningIcon({ size = 16, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 3.5L21.5 20H2.5L12 3.5Z"
        fill="#F59E0B"
      />
      <path d="M12 10V14.5M12 17H12.01" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** 25. Fluent Close "X" Cross Icon */
export function FluentCloseIcon({ size = 12, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/** 26. Fluent Chevron Up / Down Icon */
export function FluentChevronIcon({
  size = 12,
  direction = 'down',
  className,
  ...props
}: IconProps & { direction?: 'up' | 'down' | 'left' | 'right' }): JSX.Element {
  const rotation =
    direction === 'up'
      ? 'rotate(180deg)'
      : direction === 'left'
      ? 'rotate(90deg)'
      : direction === 'right'
      ? 'rotate(-90deg)'
      : 'none'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: rotation, transformOrigin: 'center', transition: 'transform 0.15s ease' }}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** 27. Fluent Severity Pill Dot */
export function SeverityDot({ severity }: { severity: string }): JSX.Element {
  const color =
    severity === 'Crítica'
      ? '#D13438'
      : severity === 'Alta'
      ? '#CA5010'
      : severity === 'Media'
      ? '#F59E0B'
      : '#0078D4'

  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: severity === 'Crítica' ? '0 0 0 2px rgba(209, 52, 56, 0.25)' : 'none',
        flexShrink: 0,
      }}
    />
  )
}
