import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BoardCard from '@/components/board/BoardCard';
import CreateBoardModal from '@/components/board/CreateBoardModal';
import { Board } from '@/types';
import { Plus, Inbox } from 'lucide-react';

export default function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchBoards = async () => {
    try {
      const res = await fetch('/api/boards');
      const json = await res.json();
      if (json.data) setBoards(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreate = async (title: string, description: string) => {
    const res = await fetch('/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    const json = await res.json();
    if (json.data) {
      setBoards((prev) => [json.data, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this board? This cannot be undone.')) return;
    await fetch(`/api/boards/${id}`, { method: 'DELETE' });
    setBoards((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <>
      <Head>
        <title>Dashboard — Flowboard</title>
      </Head>

      <DashboardLayout
        title="Your boards"
        action={
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={16} />
            New board
          </button>
        }
      >
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-base h-48 animate-pulse">
                <div className="h-1.5 bg-flow-border rounded-t-card" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-flow-border rounded w-2/3" />
                  <div className="h-3 bg-flow-border rounded w-full" />
                  <div className="h-3 bg-flow-border rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-flow-warm flex items-center justify-center mb-5">
              <Inbox size={28} className="text-flow-muted" />
            </div>
            <h2 className="font-display text-xl text-flow-ink mb-2">No boards yet</h2>
            <p className="text-sm text-flow-muted mb-6 max-w-sm">
              Create your first board to start publishing content.
            </p>
            <button onClick={() => setShowCreate(true)} className="btn-accent">
              <Plus size={16} />
              Create your first board
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <CreateBoardModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      </DashboardLayout>
    </>
  );
}
