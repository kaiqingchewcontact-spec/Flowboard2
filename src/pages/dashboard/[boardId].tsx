import AnalyticsPanel from '@/components/board/AnalyticsPanel';
import { useState, useEffect, useCallback } from 'react';
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
  Plus, Globe, GlobeLock, ArrowLeft, ExternalLink,
  LayoutGrid, List, Check, Link2, RefreshCw,
  PanelRightOpen, PanelRightClose, Copy, BarChart3,
  Palette, SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';

export default function BoardEditor() {
  const router = useRouter();
  const { boardId } = router.query;

  const [board, setBoard] = useState<Board | null>(null);
  const [savedBoard, setSavedBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  // Panel state
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<'settings' | 'analytics'>('settings');

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

  useEffect(() => { fetchBoard(); }, [fetchBoard]);

  // Track unsaved changes
  const hasUnsavedChanges = board && savedBoard && (
    board.title !== savedBoard.title ||
    board.description !== savedBoard.description ||
    board.slug !== savedBoard.slug ||
    JSON.stringify(board.settings) !== JSON.stringify(savedBoard.settings)
  );

  useEffect(() => {
    if (hasUnsavedChanges) setSaveStatus('unsaved');
  }, [hasUnsavedChanges]);

  // Save draft
  const saveDraft = async () => {
    if (!board) return;
    setSaveStatus('saving');
    const res = await fetch(`/api/boards/${board.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: board.title, description: board.description,
        slug: board.slug, settings: board.settings,
      }),
    });
    const json = await res.json();
    if (json.data) { setBoard(json.data); setSavedBoard(json.data); setSaveStatus('saved'); }
  };

  // Publish / republish
  const handlePublish = async () => {
    if (!board) return;
    setPublishStatus('publishing');
    const res = await fetch(`/api/boards/${board.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: board.title, description: board.description,
        slug: board.slug, settings: board.settings, is_published: true,
      }),
    });
    const json = await res.json();
    if (json.data) { setBoard(json.data); setSavedBoard(json.data); setSaveStatus('saved'); }
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
    if (json.data) { setBoard(json.data); setSavedBoard(json.data); }
  };

  // Card CRUD
  const handleSaveCard = async (formData: CardFormData) => {
    if (editingCard) {
      const res = await fetch(`/api/cards/${editingCard.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.data) setCards((prev) => prev.map((c) => (c.id === editingCard.id ? json.data : c)));
    } else {
      const res = await fetch('/api/cards', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, board_id: boardId }),
      });
      const json = await res.json();
      if (json.data) setCards((prev) => [...prev, json.data]);
    }
    setEditingCard(null);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Delete this card?')) return;
    await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = cards.findIndex((c) => c.id === active.id);
    const newIndex = cards.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(cards, oldIndex, newIndex);
    setCards(reordered);
    await fetch('/api/cards/reorder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board_id: boardId, card_ids: reordered.map((c) => c.id) }),
    });
  };

  // Local update (no auto-save)
  const updateLocal = (updates: Partial<Board>) => {
    if (!board) return;
    setBoard({ ...board, ...updates });
  };

  // Immediate update (for visual toggles)
  const updateImmediate = async (updates: Partial<Board>) => {
    if (!board) return;
    const merged = { ...board, ...updates };
    setBoard(merged);
    const res = await fetch(`/api/boards/${board.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (json.data) { setBoard(json.data); setSavedBoard(json.data); }
  };

  // Short link
  const shortLink = board ? `flwb.io/${board.slug}` : '';
  const fullLink = board ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${board.slug}` : '';
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(fullLink); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  // Grid class
  const gridClass = (cols: number) => {
    if (cols === 1) return 'grid-cols-1 max-w-2xl';
    if (cols === 2) return 'grid-cols-2';
    return 'grid-cols-2 lg:grid-cols-3';
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
          <Link href="/dashboard" className="text-flow-accent text-sm mt-2 inline-block">Back to dashboard</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head><title>{board.title} — Flowboard</title></Head>

      <DashboardLayout>
        <div className="flex gap-0">
          {/* ═══ MAIN CONTENT ═══ */}
          <div className={`flex-1 min-w-0 transition-all duration-300 ${panelOpen ? 'mr-80' : ''}`}>

            {/* ─── Top bar ─── */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-flow-muted hover:text-flow-ink transition-colors"
              >
                <ArrowLeft size={14} />
                All boards
              </Link>

              <div className="flex items-center gap-2">
                {/* Status pill */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                  board.is_published
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {board.is_published ? <Globe size={11} /> : <GlobeLock size={11} />}
                  {board.is_published ? 'Published' : 'Draft'}
                </div>

                {/* View live */}
                {board.is_published && (
                  <Link href={`/${board.slug}`} target="_blank"
                    className="p-1.5 rounded-md text-flow-muted hover:text-flow-ink hover:bg-flow-warm transition-colors"
                    title="View live">
                    <ExternalLink size={15} />
                  </Link>
                )}

                {/* Copy short link */}
                {board.is_published && (
                  <button onClick={copyLink}
                    className="p-1.5 rounded-md text-flow-muted hover:text-flow-ink hover:bg-flow-warm transition-colors"
                    title={copied ? 'Copied!' : shortLink}>
                    {copied ? <Check size={15} className="text-green-500" /> : <Link2 size={15} />}
                  </button>
                )}

                {/* Toggle panel */}
                <button
                  onClick={() => setPanelOpen(!panelOpen)}
                  className={`p-1.5 rounded-md transition-colors ${
                    panelOpen
                      ? 'bg-flow-ink text-flow-paper'
                      : 'text-flow-muted hover:text-flow-ink hover:bg-flow-warm'
                  }`}
                  title="Settings & Analytics"
                >
                  {panelOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
                </button>
              </div>
            </div>

            {/* ─── Inline title + description ─── */}
            <div className="mb-8">
              <input
                type="text"
                value={board.title}
                onChange={(e) => updateLocal({ title: e.target.value })}
                className="font-display text-3xl text-flow-ink bg-transparent border-none outline-none w-full placeholder:text-flow-border"
                placeholder="Board title"
              />
              <input
                type="text"
                value={board.description || ''}
                onChange={(e) => updateLocal({ description: e.target.value })}
                className="text-sm text-flow-muted bg-transparent border-none outline-none w-full mt-1 placeholder:text-flow-border"
                placeholder="Add a description..."
              />
            </div>

            {/* ─── Cards grid ─── */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
                <div className={
                  board.settings?.layout === 'list'
                    ? 'space-y-4 max-w-2xl'
                    : `grid gap-4 ${gridClass(board.settings?.columns || 3)}`
                }>
                  {cards.map((card) => (
                    <ContentCard
                      key={card.id}
                      card={card}
                      onEdit={(c) => { setEditingCard(c); setShowCardEditor(true); }}
                      onDelete={handleDeleteCard}
                    />
                  ))}

                  <button
                    onClick={() => { setEditingCard(null); setShowCardEditor(true); }}
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

            {/* Spacer for bottom bar */}
            <div className="h-20" />
          </div>

          {/* ═══ RIGHT SIDEBAR PANEL ═══ */}
          {panelOpen && (
            <div className="fixed right-0 top-16 bottom-0 w-80 bg-flow-surface border-l border-flow-border
                            overflow-y-auto z-30 shadow-lg animate-in slide-in-from-right">
              {/* Panel tabs */}
              <div className="sticky top-0 bg-flow-surface border-b border-flow-border px-4 pt-3 pb-0 z-10">
                <div className="flex gap-0">
                  {[
                    { key: 'settings' as const, label: 'Settings', icon: SlidersHorizontal },
                    { key: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setPanelTab(key)}
                      className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                        panelTab === key
                          ? 'border-flow-ink text-flow-ink'
                          : 'border-transparent text-flow-muted hover:text-flow-ink'
                      }`}
                    >
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4">
                {panelTab === 'settings' ? (
                  <div className="space-y-5">
                    {/* Slug */}
                    <div>
                      <label className="label-base">Slug</label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-flow-muted">/</span>
                        <input
                          type="text"
                          className="input-base font-mono text-xs"
                          value={board.slug}
                          onChange={(e) => updateLocal({ slug: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Accent color */}
                    <div>
                      <label className="label-base">Accent color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={board.settings?.accent_color || '#e85d3a'}
                          onChange={(e) => {
                            const settings = { ...board.settings, accent_color: e.target.value };
                            updateImmediate({ settings });
                          }}
                          className="w-8 h-8 rounded-lg border border-flow-border cursor-pointer"
                        />
                        <span className="text-xs text-flow-muted font-mono">
                          {board.settings?.accent_color || '#e85d3a'}
                        </span>
                      </div>
                    </div>

                    {/* Layout */}
                    <div>
                      <label className="label-base">Layout</label>
                      <div className="flex items-center gap-1">
                        {[
                          { value: 'grid', icon: LayoutGrid, label: 'Grid' },
                          { value: 'list', icon: List, label: 'List' },
                        ].map(({ value, icon: Icon, label }) => (
                          <button
                            key={value}
                            onClick={() => {
                              const settings = { ...board.settings, layout: value as 'grid' | 'list' };
                              updateImmediate({ settings });
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                              board.settings?.layout === value
                                ? 'bg-flow-ink text-flow-paper'
                                : 'text-flow-muted hover:bg-flow-warm'
                            }`}
                          >
                            <Icon size={13} />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Columns */}
                    {board.settings?.layout !== 'list' && (
                      <div>
                        <label className="label-base">Columns</label>
                        <div className="flex items-center gap-1">
                          {([1, 2, 3] as const).map((col) => (
                            <button
                              key={col}
                              onClick={() => {
                                const settings = { ...board.settings, columns: col };
                                updateImmediate({ settings });
                              }}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                (board.settings?.columns || 3) === col
                                  ? 'bg-flow-ink text-flow-paper'
                                  : 'text-flow-muted hover:bg-flow-warm'
                              }`}
                            >
                              {col} col
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Publish controls */}
                    <div className="pt-3 border-t border-flow-border">
                      <label className="label-base">Publishing</label>
                      {board.is_published ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-green-600">
                            <Globe size={12} />
                            <span>Board is live</span>
                          </div>
                          {hasUnsavedChanges && (
                            <button onClick={handlePublish} disabled={publishStatus === 'publishing'}
                              className="btn-accent w-full text-xs justify-center gap-1.5">
                              {publishStatus === 'publishing' ? (
                                <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing…</>
                              ) : (
                                <><RefreshCw size={12} /> Republish changes</>
                              )}
                            </button>
                          )}
                          <button onClick={handleUnpublish}
                            className="btn-secondary w-full text-xs justify-center">
                            Unpublish
                          </button>
                        </div>
                      ) : (
                        <button onClick={handlePublish} disabled={publishStatus === 'publishing'}
                          className="btn-accent w-full text-xs justify-center gap-1.5">
                          {publishStatus === 'publishing' ? (
                            <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing…</>
                          ) : (
                            <><Globe size={12} /> Publish board</>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Short link */}
                    {board.is_published && (
                      <div>
                        <label className="label-base">Short link</label>
                        <button onClick={copyLink}
                          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg
                                     bg-flow-warm text-xs font-mono text-flow-muted hover:text-flow-ink transition-colors">
                          <span>{shortLink}</span>
                          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Analytics tab */
                  <div>
                    {board.is_published ? (
                      <AnalyticsPanel boardId={board.id} />
                    ) : (
                      <div className="text-center py-12">
                        <BarChart3 size={24} className="mx-auto mb-2 text-flow-border" />
                        <p className="text-xs text-flow-muted">Publish your board to see analytics</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ═══ STICKY BOTTOM BAR ═══ */}
        {saveStatus === 'unsaved' && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-flow-surface/90 backdrop-blur-lg border-t border-flow-border">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>
              <div className="flex items-center gap-2">
                <button onClick={saveDraft}
                  className="btn-secondary text-xs gap-1.5">
                  Save draft
                </button>
                {board.is_published && (
                  <button onClick={handlePublish}
                    className="btn-accent text-xs gap-1.5">
                    <RefreshCw size={12} />
                    Save & republish
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Card editor modal */}
        <CardEditorModal
          isOpen={showCardEditor}
          onClose={() => { setShowCardEditor(false); setEditingCard(null); }}
          onSave={handleSaveCard}
          card={editingCard}
        />
      </DashboardLayout>
    </>
  );
}
