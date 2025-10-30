
import React from 'react';

export const PlantIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M12 10v10" />
    <path d="M14 10c-5.5-2.5-.8-6.4-3-10" />
    <path d="M18 8c.2-2.8-2.2-5-5-5" />
    <path d="M6 8c-.2-2.8 2.2-5 5-5" />
  </svg>
);
