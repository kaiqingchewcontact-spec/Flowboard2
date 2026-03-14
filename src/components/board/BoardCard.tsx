import Link from 'next/link';
import { Board } from '@/types';
import { ExternalLink, MoreHorizontal, Globe, GlobeLock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface BoardCardProps {
  board: Board;
  onDelete: (id: string) => void;
}

export default function BoardCard({ board, onDelete }: BoardCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="card-base group relative">
      {/* Color accent bar */}
      <div
        className="h-1.5 rounded-t-card"
        style={{ backgroundColor: board.settings?.accent_color || '#e85d3a' }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Link href={`/dashboard/${board.id}`} className="flex-1">
            <h3 className="font-display text-lg text-flow-ink group-hover:text-flow-accent transition-colors">
              {board.title}
            </h3>
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-flow-muted hover:text-flow-ink rounded-md 
                         hover:bg-flow-warm transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-flow-surface border border-flow-border 
                              rounded-lg shadow-panel py-1 z-10">
                <Link
                  href={`/${board.slug}`}
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-flow-ink 
                             hover:bg-flow-warm transition-colors"
                >
                  <ExternalLink size={14} />
                  View public page
                </Link>
                <button
                  onClick={() => {
                    onDelete(board.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 
                             hover:bg-red-50 transition-colors"
                >
                  Delete board
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {board.description && (
          <p className="text-sm text-flow-muted line-clamp-2 mb-4">{board.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-flow-border">
          <div className="flex items-center gap-1.5 text-xs text-flow-muted">
            {board.is_published ? (
              <>
                <Globe size={12} className="text-green-500" />
                <span>Published</span>
              </>
            ) : (
              <>
                <GlobeLock size={12} />
                <span>Draft</span>
              </>
            )}
          </div>
          <span className="text-xs text-flow-muted font-mono">
            /{board.slug}
          </span>
        </div>
      </div>
    </div>
  );
}
