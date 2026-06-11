/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);
  const [customAvatar, setCustomAvatar] = useState(() => localStorage.getItem('logo_avatar_b64') || '');

  useEffect(() => {
    const handleUpdate = () => {
      setCustomAvatar(localStorage.getItem('logo_avatar_b64') || '');
    };
    window.addEventListener('avatar-updated', handleUpdate);
    return () => window.removeEventListener('avatar-updated', handleUpdate);
  }, []);

  return (
    <div
      id="brand-logo-w-container"
      className="flex items-center gap-3 cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Editorial geometric frame centering 'W' or Custom Avatar */}
      <div className="relative w-10 h-10 border-2 border-black bg-black text-white flex items-center justify-center font-serif text-xl font-bold transition-all duration-300 transform hover:rotate-3 overflow-hidden">
        {customAvatar ? (
          <img
            src={customAvatar}
            alt="W"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <>
            {/* Helper geometric ticks mimicking blueprint grids */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-r border-b border-neutral-600" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-l border-b border-neutral-600" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-r border-t border-neutral-600" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-l border-t border-neutral-600" />

            <span className={`transition-all duration-300 font-mono tracking-tighter ${isHovered ? 'scale-110 text-neutral-300' : 'text-white'}`}>
              W
            </span>
          </>
        )}

        {/* Dynamic pixel indicator overlay in corner */}
        <div className={`absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full transition-all duration-300 ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`} />
      </div>

      <div className="leading-tight">
        <div className="font-mono text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
          <span>Wendy LU</span>
          <span className="text-[8px] bg-black text-white px-1 leading-none font-normal py-0.5 rounded">V.24</span>
        </div>
      </div>
    </div>
  );
}
