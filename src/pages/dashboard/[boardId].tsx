import AnalyticsPanel from '@/components/board/AnalyticsPanel';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContentCard from '@/components/cards/ContentCard';
import CardEditorModal from '@/components/cards/CardEditorModal';
import { Board, Card, CardFormData } from '@/types';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, rectSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import {
  Plus, Globe, GlobeLock, Settings, ArrowLeft, ExternalLink,
  LayoutGrid, List, Save, Check, Copy, Link2, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export default function BoardEditor() {
  const router = useRouter();
  const { boardId } = router.query;

  const [board, setBoard] = useState<Board | null>(null);
  const [savedBoard, setSavedBoard] = useState<Board | null>(null); // last saved snapshot
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Save/publish state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing'>('idle');
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const fetchBoard = useCallback(async () => {
    if (!boardId) return;
    try {
      const [boardRes, cardsRes] = await Promise.all([
        fetch(`/api/boards/${boardId}`),
        fetch(`/api/cards?board_id=${boardId}`),
      ]);
      const boardJson = await boardRes.json();
      const cardsJson = await cardsRes.json();
      if (boardJson.data) {
        setBoard(boardJson.data);
        setSavedBoard(boardJson.data);
      }
      if (cardsJson.data) setCards(cardsJson.data);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Track unsaved changes
  const hasUnsavedChanges = board && savedBoard && (
    board.title !== savedBoard.title ||
    board.description !== savedBoard.description ||
    board.slug !== savedBoard.slug ||
    JSON.stringify(board.settings) !== JSON.stringify(savedBoard.settings)
  );

  useEffect(() => {
    if (hasUnsavedChanges) {
      setSaveStatus('unsaved');
    }
  }, [hasUnsavedChanges]);

  // Save draft — persists all local changes without publishing
  const saveDraft = async () => {
    if (!board) return;
    setSaveStatus('saving');
    const res = await fetch(`/api/boards/${board.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: board.title,
        description: board.description,
        slug: board.slug,
        settings: board.settings,
      }),
    });
    const json = await res.json();
    if (json.data) {
      setBoard(json.data);
      setSavedBoard(json.data);
      setSaveStatus('saved');
    }
  };

  // Publish (or republish)
  const handlePublish = async () => {
    if (!board) return;
    setPublishStatus('publishing');
    // Save any pending changes first, then set is_published
    const res = await fetch(`/api/boards/${board.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: board.title,
        description: board.description,
        slug: board.slug,
        settings: board.settings,
        is_published: true,
      }),
    });
    const json = await res.json();
    if (json.data) {
      setBoard(json.data);
      setSavedBoard(json.data);
      setSaveStatus('saved');
    }
    setPublishStatus('idle');
  };

  // Unpublish
  const handleUnpublish = async () => {
    if (!board) return;
    const res = await fetch(`/api/boards/${board.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: false }),
    });
    const json = await res.json();
    if (json.data) {
      setBoard(json.data);
      setSavedBoard(json.data);
    }
  };

  // Save card (create or update)
  const handleSaveCard = async (formData: CardFormData) => {
    if (editingCard) {
      const res = await fetch(`/api/cards/${editingCard.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.data) {
        setCards((prev) => prev.map((c) => (c.id === editingCard.id ? json.data : c)));
      }
    } else {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, board_id: boardId }),
      });
      const json = await res.json();
      if (json.data) {
        setCards((prev) => [...prev, json.data]);
      }
    }
    setEditingCard(null);
  };

  // Delete card
  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Delete this card?')) return;
    await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  // Drag end — reorder
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cards.findIndex((c) => c.id === active.id);
    const newIndex = cards.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(cards, oldIndex, newIndex);
    setCards(reordered);

    await fetch('/api/cards/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board_id: boardId,
        card_ids: reordered.map((c) => c.id),
      }),
    });
  };

  // Update board locally (no auto-save)
  const updateBoardLocal = (updates: Partial<Board>) => {
    if (!board) return;
    setBoard({ ...board, ...updates });
  };

  // Update settings that should persist immediately (color picker, layout toggle)
  const updateBoardImmediate = async (updates: Partial<Board>) => {
    if (!board) return;
    const merged = { ...board, ...updates };
    setBoard(merged);
    const res = await fetch(`/api/boards/${board.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (json.data) {
      setBoard(json.data);
      setSavedBoard(json.data);
    }
  };

  // Copy short link
  const shortLink = board ? `flwb.io/${board.slug}` : '';
  const fullLink = board ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${board.slug}` : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-flow-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!board) {
    return (
      <DashboardLayout>
        <div className="text-center py-32">
          <p className="text-flow-muted">Board not found.</p>
          <Link href="/dashboard" className="text-flow-accent text-sm mt-2 inline-block">
            Back to dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{board.title} — Flowboard</title>
      </Head>

      <DashboardLayout>
        {/* Board header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-flow-muted hover:text-flow-ink 
                       transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            All boards
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={board.title}
                onChange={(e) => updateBoardLocal({ title: e.target.value })}
                className="font-display text-3xl text-flow-ink bg-transparent border-none 
                           outline-none w-full placeholder:text-flow-border"
                placeholder="Board title"
              />
              <input
                type="text"
                value={board.description || ''}
                onChange={(e) => updateBoardLocal({ description: e.target.value })}
                className="text-sm text-flow-muted bg-transparent border-none outline-none 
                           w-full mt-1 placeholder:text-flow-border"
                placeholder="Add a description..."
              />
            </div>

            {/* ─── Action buttons ─── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Save status + Save draft button */}
              <button
                onClick={saveDraft}
                disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                className={`btn-secondary text-xs gap-1.5 transition-all ${
                  saveStatus === 'unsaved'
                    ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : ''
                }`}
                title={saveStatus === 'saved' ? 'All changes saved' : 'Save draft'}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving…
                  </>
                ) : saveStatus === 'unsaved' ? (
                  <>
                    <Save size={13} />
                    Save draft
                  </>
                ) : (
                  <>
                    <Check size={13} className="text-green-500" />
                    Saved
                  </>
                )}
              </button>

              {/* Publish / Republish / Unpublish */}
              {board.is_published ? (
                <div className="flex items-center gap-1.5">
                  {/* Republish (if there are unsaved changes) */}
                  {hasUnsavedChanges && (
                    <button
                      onClick={handlePublish}
                      disabled={publishStatus === 'publishing'}
                      className="btn-accent text-xs gap-1.5"
                    >
                      {publishStatus === 'publishing' ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Publishing…
                        </>
                      ) : (
                        <>
                          <RefreshCw size={13} />
                          Republish
                        </>
                      )}
                    </button>
                  )}
                  {/* Published indicator + unpublish */}
                  <button
                    onClick={handleUnpublish}
                    className="btn-secondary text-xs gap-1.5"
                    title="Click to unpublish"
                  >
                    <Globe size={13} className="text-green-500" />
                    Published
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={publishStatus === 'publishing'}
                  className="btn-accent text-xs gap-1.5"
                >
                  {publishStatus === 'publishing' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <GlobeLock size={13} />
                      Publish
                    </>
                  )}
                </button>
              )}

              {/* View live + Copy short link */}
              {board.is_published && (
                <>
                  <Link
                    href={`/${board.slug}`}
                    target="_blank"
                    className="btn-secondary text-xs"
                    title="View live board"
                  >
                    <ExternalLink size={13} />
                  </Link>
                  <button
                    onClick={copyLink}
                    className="btn-secondary text-xs gap-1.5"
                    title={copied ? 'Copied!' : `Copy link: ${shortLink}`}
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Link2 size={13} />
                        {shortLink}
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Settings toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`btn-secondary text-xs ${showSettings ? 'bg-flow-warm border-flow-ink/20' : ''}`}
              >
                <Settings size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="card-base p-5 mb-8">
            <h3 className="font-display text-sm text-flow-ink mb-4">Board settings</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <label className="label-base">Slug</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-flow-muted">/</span>
                  <input
                    type="text"
                    className="input-base font-mono text-xs"
                    value={board.slug}
                    onChange={(e) => updateBoardLocal({ slug: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label-base">Accent color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={board.settings?.accent_color || '#e85d3a'}
                    onChange={(e) => {
                      const settings = { ...board.settings, accent_color: e.target.value };
                      updateBoardImmediate({ settings });
                    }}
                    className="w-8 h-8 rounded-lg border border-flow-border cursor-pointer"
                  />
                  <span className="text-xs text-flow-muted font-mono">
                    {board.settings?.accent_color || '#e85d3a'}
                  </span>
                </div>
              </div>
              <div>
                <label className="label-base">Layout</label>
                <div className="flex items-center gap-1">
                  {[
                    { value: 'grid', icon: LayoutGrid },
                    { value: 'list', icon: List },
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => {
                        const settings = { ...board.settings, layout: value as 'grid' | 'list' };
                        updateBoardImmediate({ settings });
                      }}
                      className={`p-2 rounded-md transition-colors ${
                        board.settings?.layout === value
                          ? 'bg-flow-ink text-flow-paper'
                          : 'text-flow-muted hover:bg-flow-warm'
                      }`}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-base">Columns</label>
                <div className="flex items-center gap-1">
                  {([1, 2, 3] as const).map((col) => (
                    <button
                      key={col}
                      onClick={() => {
                        const settings = { ...board.settings, columns: col };
                        updateBoardImmediate({ settings });
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        (board.settings?.columns || 3) === col
                          ? 'bg-flow-ink text-flow-paper'
                          : 'text-flow-muted hover:bg-flow-warm'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {board.is_published && <AnalyticsPanel boardId={board.id} />}

        {/* Cards grid */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
            <div
              className={
                board.settings?.layout === 'list'
                  ? 'space-y-4 max-w-2xl'
                  : `grid gap-4 ${
                      (board.settings?.columns || 3) === 1
                        ? 'grid-cols-1 max-w-2xl'
                        : (board.settings?.columns || 3) === 2
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`
              }
            >
              {cards.map((card) => (
                <ContentCard
                  key={card.id}
                  card={card}
                  onEdit={(c) => {
                    setEditingCard(c);
                    setShowCardEditor(true);
                  }}
                  onDelete={handleDeleteCard}
                />
              ))}

              {/* Add card button */}
              <button
                onClick={() => {
                  setEditingCard(null);
                  setShowCardEditor(true);
                }}
                className="border-2 border-dashed border-flow-border rounded-card 
                           flex flex-col items-center justify-center gap-2 py-12
                           text-flow-muted hover:text-flow-accent hover:border-flow-accent/30
                           transition-all duration-200 min-h-[160px]"
              >
                <Plus size={24} />
                <span className="text-sm font-medium">Add a card</span>
              </button>
            </div>
          </SortableContext>
        </DndContext>

        {/* Card editor modal */}
        <CardEditorModal
          isOpen={showCardEditor}
          onClose={() => {
            setShowCardEditor(false);
            setEditingCard(null);
          }}
          onSave={handleSaveCard}
          card={editingCard}
        />
      </DashboardLayout>
    </>
  );
}
