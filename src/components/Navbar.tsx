/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, FolderOpen, Newspaper, Library, Clock, User, Send, Settings } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'en' | 'zh';
  setLang: (lang: 'en' | 'zh') => void;
}

export default function Navbar({ activeTab, setActiveTab, lang, setLang }: NavbarProps) {
  const navItems = [
    { id: 'home', label: lang === 'en' ? 'HOME' : '首页', icon: Home, fontStyle: 'font-mono' },
    { id: 'timeline', label: lang === 'en' ? 'TIMELINE' : '历程', icon: Clock, fontStyle: 'font-sans tracking-tight' },
    { id: 'works', label: lang === 'en' ? 'WORKS' : '作品', icon: FolderOpen, fontStyle: 'font-sans font-bold' },
    { id: 'notes', label: lang === 'en' ? 'NOTES' : '笔记', icon: Newspaper, fontStyle: 'font-serif italic' },
    { id: 'library', label: lang === 'en' ? 'LIBRARY' : '书房', icon: Library, fontStyle: 'font-mono tracking-widest' },
    { id: 'about', label: lang === 'en' ? 'ABOUT' : '关于', icon: User, fontStyle: 'font-serif' },
    { id: 'contact', label: lang === 'en' ? 'CONTACT' : '联系', icon: Send, fontStyle: 'font-mono uppercase' },
    { id: 'admin', label: lang === 'en' ? 'STUDIO ⚙️' : '工作台 ⚙️', icon: Settings, fontStyle: 'font-sans uppercase text-[10px]' },
  ];

  return (
    <>
      {/* Desktop Right Fixed Vertical Navigation Bar */}
      <nav
        id="right-fixed-navbar"
        className="hidden md:flex fixed right-0 top-12 bottom-0 w-20 bg-black text-white border-l-2 border-black z-40 flex-col items-center justify-between py-6 select-none"
      >
        <div className="flex flex-col items-center justify-center border-b border-white/10 w-full pb-4 gap-2.5">
          <div className="w-8 h-8 border border-white flex items-center justify-center font-mono text-[9px] font-black tracking-widest bg-neutral-900 animate-pulse text-white rounded-xs">
            W
          </div>
          
          {/* Top-aligned language switch module */}
          <div className="flex flex-row gap-0.5 justify-center items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded text-[8px] font-mono select-none w-16">
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 rounded-xs transition-colors cursor-pointer font-bold ${
                lang === 'en' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('zh')}
              className={`px-1.5 py-0.5 rounded-xs transition-colors cursor-pointer font-bold ${
                lang === 'zh' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              ZH
            </button>
          </div>
        </div>

        {/* Rotated layout item listings to conform with NewJeans aesthetic */}
        <div className="flex-1 flex flex-col justify-center items-center gap-5 py-6 w-full">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                id={`nav-item-${item.id}`}
                className={`w-full flex flex-col items-center justify-center py-2 transition-all duration-300 gap-1 cursor-pointer border-r-3 ${
                  isActive
                    ? 'text-white border-white bg-white/10 font-bold'
                    : 'text-neutral-400 border-transparent hover:text-white hover:bg-white/5'
                }`}
                title={item.label}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'scale-110 opacity-100' : 'opacity-70'}`} />
                <span
                  style={{ writingMode: 'vertical-rl' }}
                  className={`text-[9px] tracking-[0.2em] uppercase ${item.fontStyle} text-center`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="h-16 flex flex-col items-center justify-center border-t border-white/10 w-full gap-1">
          <span className="text-[9px] font-mono text-neutral-400">GZ.CN</span>
          <span className="text-[6.5px] text-neutral-100 animate-ping">●</span>
        </div>
      </nav>

      {/* Mobile/Tablet Bottom Horizontal Navigation Bar with dynamic float top-bar language block */}
      <div className="md:hidden fixed top-12 left-0 right-0 h-8 bg-zinc-950 font-mono text-[9px] z-40 flex items-center justify-between px-4 border-b border-black text-white select-none shadow-sm">
        <span className="text-zinc-400 font-bold tracking-widest uppercase">W. LU ARCHIVE</span>
        <div className="flex bg-zinc-900 border border-zinc-800 p-[1px] rounded text-[8px]">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer font-black ${
              lang === 'en' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            ENGLISH
          </button>
          <button
            onClick={() => setLang('zh')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer font-black ${
              lang === 'zh' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            中文
          </button>
        </div>
      </div>

      <nav
        id="mobile-bottom-navbar"
        className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-black border-t-2 border-black z-40 flex items-center justify-around px-2 font-mono"
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              id={`nav-item-mobile-${item.id}`}
              className={`flex flex-col items-center justify-center p-2 min-w-[36px] transition-all cursor-pointer ${
                isActive ? 'text-white font-bold scale-110' : 'text-neutral-500'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[7px] tracking-tighter mt-0.5 max-w-[40px] truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
