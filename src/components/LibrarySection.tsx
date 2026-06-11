/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LibraryItem, CMSStatus, CMSVisibility } from '../types';
import { Book, Film, Music, Star, Search, Plus, Check, Edit, Trash2, EyeOff, Pin, ShieldAlert } from 'lucide-react';
import { UI_TRANSLATIONS } from '../utils/translations';

interface LibrarySectionProps {
  items: LibraryItem[];
  lang?: 'en' | 'zh';
  isAdminLoggedIn?: boolean;
  onSaveItems?: (items: LibraryItem[]) => void;
}

export default function LibrarySection({ items, lang = 'en', isAdminLoggedIn = false, onSaveItems }: LibrarySectionProps) {
  const [filterType, setFilterType] = useState<'all' | 'book' | 'movie' | 'music'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Editor states
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [formType, setFormType] = useState<'book' | 'movie' | 'music'>('book');
  const [formTitle, setFormTitle] = useState('');
  const [formCreator, setFormCreator] = useState('');
  const [formStatus, setFormStatus] = useState<'In Progress' | 'Completed' | 'Wishlist'>('Completed');
  const [formRating, setFormRating] = useState<number>(5);
  const [formDate, setFormDate] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formCoverColor, setFormCoverColor] = useState('#262626');
  const [formCmsStatus, setFormCmsStatus] = useState<CMSStatus>('Published');
  const [formVisibility, setFormVisibility] = useState<CMSVisibility>('Public');
  const [formPinned, setFormPinned] = useState(false);

  // Filter based on roles, types, search terms
  const filteredItems = items.filter(item => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesFilter || !matchesSearch) return false;

    if (isAdminLoggedIn) {
      return true;
    } else {
      const isDraftStatus = item.status_cms === 'Draft' || item.status_cms === 'Archived';
      const isPrivateStatus = item.visibility === 'Private';
      return !isDraftStatus && !isPrivateStatus;
    }
  });

  const t = UI_TRANSLATIONS[lang];

  const typeLabels: Record<string, string> = {
    'all': lang === 'en' ? 'All Mediums' : '所有媒介记录',
    'book': lang === 'en' ? 'Books' : '精选书籍',
    'movie': lang === 'en' ? 'Movies' : '经典电影',
    'music': lang === 'en' ? 'Music' : '独立音乐'
  };

  const singleTypeLabels: Record<string, string> = {
    'book': lang === 'en' ? 'Book' : '文献书籍',
    'movie': lang === 'en' ? 'Movie' : '电影感悟',
    'music': lang === 'en' ? 'Music' : '独立声频'
  };

  const statusLabels: Record<string, string> = {
    'Completed': lang === 'en' ? 'Completed' : '已研读完',
    'In Progress': lang === 'en' ? 'In Progress' : '正在研读',
    'To Read': lang === 'en' ? 'To Read' : '存架计划',
    'Wishlist': lang === 'en' ? 'Wishlist' : '研究计划'
  };

  // Open editor helpers
  const handleOpenEdit = (e: React.MouseEvent, item: LibraryItem) => {
    e.stopPropagation();
    setEditingItem(item);
    setIsAddingNew(false);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormCreator(item.creator);
    setFormStatus(item.status);
    setFormRating(item.rating);
    setFormDate(item.date);
    setFormNote(item.note || '');
    setFormCoverColor(item.coverColor || '#262626');
    setFormCmsStatus(item.status_cms || 'Published');
    setFormVisibility(item.visibility || 'Public');
    setFormPinned(item.pinned || false);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsAddingNew(true);
    setFormType('book');
    setFormTitle('');
    setFormCreator('');
    setFormStatus('Completed');
    setFormRating(5);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNote('');
    setFormCoverColor('#171717');
    setFormCmsStatus('Published');
    setFormVisibility('Public');
    setFormPinned(false);
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm(t.confirmDelete)) return;
    if (onSaveItems) {
      const updated = items.filter(item => item.id !== id);
      onSaveItems(updated);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCreator.trim()) return;

    if (isAddingNew) {
      const newItem: LibraryItem = {
        id: `lib-${Date.now()}`,
        type: formType,
        title: formTitle,
        creator: formCreator,
        status: formStatus,
        rating: formRating,
        date: formDate,
        note: formNote || undefined,
        coverColor: formCoverColor,
        status_cms: formCmsStatus,
        visibility: formVisibility,
        pinned: formPinned
      };
      if (onSaveItems) {
        onSaveItems([newItem, ...items]);
      }
    } else if (editingItem) {
      const updated = items.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            type: formType,
            title: formTitle,
            creator: formCreator,
            status: formStatus,
            rating: formRating,
            date: formDate,
            note: formNote || undefined,
            coverColor: formCoverColor,
            status_cms: formCmsStatus,
            visibility: formVisibility,
            pinned: formPinned
          };
        }
        return item;
      });
      if (onSaveItems) {
        onSaveItems(updated);
      }
    }

    setEditingItem(null);
    setIsAddingNew(false);
  };

  return (
    <div id="library-logs-wrapper" className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-4 gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-black mb-1">
            {lang === 'en' ? 'Media Logs //' : '学术与感官阅览记录 //'}
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-950 uppercase font-black">
            {t.libraryTitle}
          </h1>
        </div>
        
        {/* Genre Selector */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs items-center">
          {(['all', 'book', 'movie', 'music'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 border border-black font-semibold uppercase relative cursor-pointer ${
                filterType === type
                  ? 'bg-black text-white translate-x-[1px] translate-y-[1px]'
                  : 'bg-white text-black hover:bg-neutral-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}

          {isAdminLoggedIn && (
            <button
              onClick={handleOpenAdd}
              className="px-3 py-1 border border-dashed border-black bg-neutral-50 hover:bg-black hover:text-white text-black font-semibold uppercase flex items-center gap-1 cursor-pointer transition-all rounded shadow-xs"
              title="Add Library review"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'ADD REVIEW' : '新增评阅'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Searching controls */}
      <div className="flex items-center gap-3 border border-black bg-white px-3 py-2 shadow-sm rounded">
        <Search className="w-4 h-4 text-neutral-400 shrink-0" />
        <input
          type="text"
          placeholder={t.filteringLogs}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent outline-none font-mono text-xs text-black placeholder-neutral-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-neutral-400 hover:text-black font-mono text-xs cursor-pointer"
          >
            {lang === 'en' ? '[CLEAR]' : '[清空检索]'}
          </button>
        )}
      </div>

      {/* Index card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const isBook = item.type === 'book';
          const isMovie = item.type === 'movie';
          const Icon = isBook ? Book : isMovie ? Film : Music;
          
          return (
            <div
              key={item.id}
              id={`library-item-${item.id}`}
              className="group border border-black bg-white flex flex-col justify-between p-5 relative shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Decorative cover band simulation badge on the right side */}
              <div
                className="absolute top-0 right-0 w-3 h-full border-l border-black"
                style={{ backgroundColor: item.coverColor || '#171717' }}
              />

              <div className="space-y-4 pr-4">
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-500 font-extrabold uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5 text-black" />
                    {singleTypeLabels[item.type] || item.type}
                  </span>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1 select-none">
                    {item.pinned && (
                      <span className="p-0.5 bg-black text-white border border-black" title="Pinned to Homepage">
                        <Pin className="w-2.5 h-2.5" />
                      </span>
                    )}
                    {item.status_cms === 'Draft' && (
                      <span className="px-1 text-[7px] bg-neutral-800 text-white font-mono uppercase font-bold border border-black">
                        Draft
                      </span>
                    )}
                    {item.visibility === 'Private' && (
                      <span className="p-0.5 bg-neutral-800 text-white border border-neutral-700" title="Private">
                        <EyeOff className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <span className={`px-2 py-0.5 border border-black font-mono text-[8.5px] font-bold uppercase rounded-xs ${
                      item.status === 'Completed' ? 'bg-black text-white' : 'bg-neutral-50 text-neutral-600'
                    }`}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </div>
                </div>

                {/* Information */}
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-extrabold text-[#000000] tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-mono text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                    {lang === 'en' ? `by ${item.creator}` : `主创者: ${item.creator}`}
                  </p>
                </div>

                {/* Rating system */}
                <div className="flex gap-0.5 text-neutral-300">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-3.5 h-3.5 ${
                        index < item.rating ? 'text-black fill-black' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                  <span className="font-mono text-[9px] text-neutral-500 font-bold ml-2 self-center">
                    ({item.rating}.0)
                  </span>
                </div>

                {/* Review note in typography style */}
                {item.note && (
                  <p className="font-serif text-xs text-neutral-700 leading-relaxed pt-2 border-t border-dashed border-neutral-100 italic">
                    “ {item.note} ”
                  </p>
                )}
              </div>

              {/* Footer Date log and Admin Inline Editing on hover/view */}
              <div className="pt-3 flex justify-between items-center font-mono text-[9px] text-neutral-400 mt-4 border-t border-dashed border-neutral-200 pr-4">
                <span>{lang === 'en' ? 'LOG_DATE' : '归档日期'} : {item.date}</span>
                
                {isAdminLoggedIn ? (
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => handleOpenEdit(e, item)}
                      className="p-1 bg-white border border-black hover:bg-neutral-50 rounded text-black transition-all cursor-pointer"
                      title="Edit Log"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteItem(e, item.id)}
                      className="p-1 bg-black border border-black hover:bg-neutral-800 rounded text-white transition-all cursor-pointer"
                      title="Delete Log"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[8px] bg-neutral-100 text-neutral-400 px-1 border border-neutral-250 font-mono select-none">
                    {item.id}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full p-12 border border-dashed border-neutral-400 text-center rounded">
            <span className="font-mono text-xs text-neutral-500">
              {t.noLibraryItems}
            </span>
          </div>
        )}
      </div>

      {/* Library Editor Modal Overlay */}
      {(editingItem || isAddingNew) && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-2 border-black w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded">
            <div className="flex justify-between items-center border-b border-black pb-2">
              <h2 className="font-serif text-lg font-black uppercase">
                {isAddingNew ? (lang === 'en' ? 'ADD LIBRARY ENTRY / REVIEW' : '新增书籍影音评阅') : (lang === 'en' ? 'EDIT LIBRARY ENTRY' : '编辑书籍影音评阅')}
              </h2>
              <button
                onClick={() => { setEditingItem(null); setIsAddingNew(false); }}
                className="font-mono font-bold text-[10px] bg-black text-white border border-black px-2 py-1 hover:bg-neutral-800"
              >
                [CANCEL / CLOSE]
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">Medium Type</label>
                  <select
                    value={formType}
                    onChange={(e: any) => setFormType(e.target.value)}
                    className="w-full border border-black p-1 focus:bg-neutral-50 h-8 text-[11px] font-mono outline-none"
                  >
                    <option value="book">Book (文献书籍)</option>
                    <option value="movie">Movie (电影院线)</option>
                    <option value="music">Music (独立声频)</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">Log / Review Date</label>
                  <input
                    required
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="e.g. 2024-05-20"
                    className="w-full border border-black p-1.5 focus:bg-neutral-50 h-8 text-[11px] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">Item Title</label>
                <input
                  required
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Chungking Express"
                  className="w-full border border-black p-1.5 focus:bg-neutral-50 h-8 text-[11px] outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">Creator / Author / Producer</label>
                <input
                  required
                  type="text"
                  value={formCreator}
                  onChange={(e) => setFormCreator(e.target.value)}
                  placeholder="e.g. Wong Kar-wai"
                  className="w-full border border-black p-1.5 focus:bg-neutral-50 h-8 text-[11px] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full border border-black p-1 focus:bg-neutral-50 h-8 text-[11px] font-mono outline-none"
                  >
                    <option value="Completed">Completed (已阅读完)</option>
                    <option value="In Progress">In Progress (正研读中)</option>
                    <option value="Wishlist">Wishlist (存架计划)</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">Rating Rating</label>
                  <select
                    value={formRating}
                    onChange={(e: any) => setFormRating(Number(e.target.value))}
                    className="w-full border border-black p-1 focus:bg-neutral-50 h-8 text-[11px] font-mono outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0)</option>
                    <option value={3}>⭐⭐⭐ (3.0)</option>
                    <option value={2}>⭐⭐ (2.0)</option>
                    <option value={1}>⭐ (1.0)</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">Sidebar Hex Color</label>
                  <input
                    type="text"
                    value={formCoverColor}
                    onChange={(e) => setFormCoverColor(e.target.value)}
                    placeholder="e.g. #000000"
                    className="w-full border border-black p-1.5 h-8 text-[11px] font-mono focus:bg-neutral-50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">Review Statement / Memo Note</label>
                <textarea
                  rows={3}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Provide structured reviews about grids, narration, sound, aesthetics..."
                  className="w-full border border-black p-1.5 focus:bg-neutral-50 text-[11px] outline-none"
                />
              </div>

              {/* CMS Status and Visibility */}
              <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3">
                <div>
                  <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">CMS Status</label>
                  <select
                    value={formCmsStatus}
                    onChange={(e: any) => setFormCmsStatus(e.target.value)}
                    className="w-full border border-black p-1 focus:bg-neutral-50 h-8 text-[11px] font-mono outline-none"
                  >
                    <option value="Published">Published (公开网文)</option>
                    <option value="Draft">Draft (草稿设计)</option>
                    <option value="Archived">Archived (非公置档)</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">Access Visibility</label>
                  <select
                    value={formVisibility}
                    onChange={(e: any) => setFormVisibility(e.target.value)}
                    className="w-full border border-black p-1 focus:bg-neutral-50 h-8 text-[11px] font-mono outline-none"
                  >
                    <option value="Public">🌍 Public (所有人可见)</option>
                    <option value="Private">👀 Private (仅自己登录可见)</option>
                  </select>
                </div>
              </div>

              {/* Boolean Toggles */}
              <div className="flex items-center gap-6 py-2 border-y border-neutral-100">
                <label className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="w-4 h-4 border border-black rounded-none checked:bg-black accent-black"
                  />
                  <span>📌 Pin to Homepage (置顶至首页)</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-neutral-800 text-xs py-2 font-bold uppercase cursor-pointer border border-black transition-all flex items-center justify-center gap-1 shadow"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'en' ? 'SAVE LIBRARY LOG' : '保存书籍影音归档记录'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
