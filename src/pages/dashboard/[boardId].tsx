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
  Plus, Globe, GlobeLock, Settings, ArrowLeft, ExternalLink,
  LayoutGrid, List,
} from 'lucide-react';
import Link from 'next/link';

export default function BoardEditor() {
  const router = useRouter();
  const { boardId } = router.query;

  const [board, setBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showSettings, setShowSettings] = useState(false);

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
      if (boardJson.data) setBoard(boardJson.data);
      if (cardsJson.data) setCards(cardsJson.data);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Toggle publish
  const togglePublish = async () => {
    if (!board) return;
    const res = await fetch(`/api/boards/${board.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !board.is_published }),
    });
    const json = await res.json();
    if (json.data) setBoard(json.data);
  };

  // Save card (create or update)
  const handleSaveCard = async (formData: CardFormData) => {
    if (editingCard) {
      // Update
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
      // Create
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

    // Persist order
    await fetch('/api/cards/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board_id: boardId,
        card_ids: reordered.map((c) => c.id),
      }),
    });
  };

  // Update board settings
  const updateBoard = async (updates: Partial<Board>) => {
    if (!board) return;
    const res = await fetch(`/api/boards/${board.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (json.data) setBoard(json.data);
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
                onChange={(e) => setBoard({ ...board, title: e.target.value })}
                onBlur={() => updateBoard({ title: board.title })}
                className="font-display text-3xl text-flow-ink bg-transparent border-none 
                           outline-none w-full placeholder:text-flow-border"
                placeholder="Board title"
              />
              <input
                type="text"
                value={board.description || ''}
                onChange={(e) => setBoard({ ...board, description: e.target.value })}
                onBlur={() => updateBoard({ description: board.description })}
                className="text-sm text-flow-muted bg-transparent border-none outline-none 
                           w-full mt-1 placeholder:text-flow-border"
                placeholder="Add a description..."
              />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={togglePublish}
                className={board.is_published ? 'btn-secondary' : 'btn-accent'}
              >
                {board.is_published ? (
                  <>
                    <Globe size={14} className="text-green-500" />
                    Published
                  </>
                ) : (
                  <>
                    <GlobeLock size={14} />
                    Publish
                  </>
                )}
              </button>

              {board.is_published && (
                <Link
                  href={`/${board.slug}`}
                  target="_blank"
                  className="btn-secondary"
                >
                  <ExternalLink size={14} />
                </Link>
              )}

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`btn-secondary ${showSettings ? 'bg-flow-warm border-flow-ink/20' : ''}`}
              >
                <Settings size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="card-base p-5 mb-8">
            <h3 className="font-display text-sm text-flow-ink mb-4">Board settings</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="label-base">Slug</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-flow-muted">/</span>
                  <input
                    type="text"
                    className="input-base font-mono text-xs"
                    value={board.slug}
                    onChange={(e) => setBoard({ ...board, slug: e.target.value })}
                    onBlur={() => updateBoard({ slug: board.slug })}
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
                      setBoard({ ...board, settings });
                      updateBoard({ settings });
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
                        setBoard({ ...board, settings });
                        updateBoard({ settings });
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
                  : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4'
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
