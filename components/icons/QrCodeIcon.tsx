import React from 'react';

export const QrCodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5a.75.75 0 00-.75.75v13.5a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H3.75zM9 9H6v3h3V9zm6 0h-3v3h3V9zm-6 6H6v3h3v-3zm6 0h-3v3h3v-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75h.008v.008H12V3.75zm3.75 0h.008v.008h-.008V3.75zm0 3.75h.008v.008h-.008V7.5zm0 3.75h.008v.008h-.008v-3.75zm3.75-3.75h.008v.008h-.008V7.5zm0 3.75h.008v.008h-.008v-3.75zM3.75 12h.008v.008H3.75V12zm0 3.75h.008v.008H3.75v-3.75zm3.75 3.75h.008v.008H7.5v-3.75zm3.75 0h.008v.008H11.25v-3.75zm3.75 0h.008v.008h-.008v-3.75z" />
  </svg>
);
