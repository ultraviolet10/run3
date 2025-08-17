import React from "react";

type IconProps = {
  className?: string;
};

export function InfoIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LightningIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function DownTriangleIcon({ className = "w-3 h-3" }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 8L2 4h8L6 8z" />
    </svg>
  );
}

export function TwitterIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function FarcasterIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M15.32 12.72c-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44-.16-.48-.32-.96-.48-1.44z" />
    </svg>
  );
}

export function CopyIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
  );
}

export function CloseIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}
