import React from 'react';
export function NotebookIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={12}
        d="M48 40h128v184a8 8 0 0 1-8 8H48zM176 40h32a8 8 0 0 1 8 8v168"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={12}
        d="M80 80h64M80 120h64M80 160h48"
      />
      <circle cx={52} cy={68} r={12} fill="currentColor" />
      <circle cx={52} cy={128} r={12} fill="currentColor" />
      <circle cx={52} cy={188} r={12} fill="currentColor" />
    </svg>
  );
}