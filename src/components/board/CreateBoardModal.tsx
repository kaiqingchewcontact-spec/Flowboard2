import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { DEFAULT_BOARD_SETTINGS } from '@/types';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string) => Promise<void>;
}

export default function CreateBoardModal({ isOpen, onClose, onCreate }: CreateBoardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onCreate(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new board">
      <div className="space-y-4">
        <div>
          <label className="label-base">Board name</label>
          <input
            type="text"
            className="input-base"
            placeholder="e.g. The Undercurrent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <div>
          <label className="label-base">Description (optional)</label>
          <textarea
            className="input-base resize-none"
            rows={3}
            placeholder="What's this board about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={!title.trim() || loading}
          >
            {loading ? 'Creating...' : 'Create board'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
