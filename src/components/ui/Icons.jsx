// Minimal stroke icons (24px grid). Decorative by default (aria-hidden).
const Svg = ({ children, size = 20, className = '', ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

export const IconLock = (p) => (
  <Svg {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
  </Svg>
);
export const IconUnlock = (p) => (
  <Svg {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
    <path d="M8 10.5V7.8a4 4 0 0 1 7.6-1.7" />
  </Svg>
);
export const IconDownload = (p) => (
  <Svg {...p}>
    <path d="M12 4v11" />
    <path d="m7.5 11 4.5 4.5 4.5-4.5" />
    <path d="M5 19.5h14" />
  </Svg>
);
export const IconPrint = (p) => (
  <Svg {...p}>
    <path d="M7 9V4.5h10V9" />
    <rect x="4" y="9" width="16" height="8" rx="2" />
    <rect x="7.5" y="14" width="9" height="6" rx="1" />
  </Svg>
);
export const IconImage = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m4 17 5-4.5 3.5 3 3-2.5 4.5 4" />
  </Svg>
);
export const IconFile = (p) => (
  <Svg {...p}>
    <path d="M6.5 3.5h7l4 4v13h-11z" />
    <path d="M13.5 3.5v4h4" />
    <path d="M9 13h6M9 16.5h6" />
  </Svg>
);
export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
export const IconTrash = (p) => (
  <Svg {...p}>
    <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l.8 12.5h9.4L17.5 7" />
    <path d="M10 11v5M14 11v5" />
  </Svg>
);
export const IconPlus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const IconX = (p) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
);
export const IconEye = (p) => (
  <Svg {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </Svg>
);
export const IconChevron = (p) => (
  <Svg {...p}>
    <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
  </Svg>
);
export const IconArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M19 12H5.5M11 6l-6 6 6 6" />
  </Svg>
);
export const IconArrowRight = (p) => (
  <Svg {...p}>
    <path d="M5 12h13.5M13 6l6 6-6 6" />
  </Svg>
);
export const IconUpload = (p) => (
  <Svg {...p}>
    <path d="M12 16.5V5" />
    <path d="m7.5 9 4.5-4.5L16.5 9" />
    <path d="M5 19.5h14" />
  </Svg>
);
export const IconCrop = (p) => (
  <Svg {...p}>
    <path d="M7 3.5v13.5h13.5" />
    <path d="M3.5 7H17v13.5" />
  </Svg>
);
export const IconRotate = (p) => (
  <Svg {...p}>
    <path d="M19.5 12a7.5 7.5 0 1 1-2.4-5.5" />
    <path d="M19.5 4.5v4h-4" />
  </Svg>
);
export const IconSpark = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.9L12 18.5l-1.8-5.8-5.7-1.9L10.2 9z" />
  </Svg>
);
export const IconAlert = (p) => (
  <Svg {...p}>
    <path d="M12 4 21 19.5H3z" />
    <path d="M12 10v4.5M12 17.2v.1" />
  </Svg>
);
