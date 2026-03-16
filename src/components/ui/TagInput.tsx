import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const cleaned = tag.trim().toLowerCase();
    if (cleaned && !value.includes(cleaned) && value.length < 5) {
      onChange([...value, cleaned]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 p-2 border border-flow-border rounded-lg
                      focus-within:ring-2 focus-within:ring-flow-accent/20 focus-within:border-flow-accent/40
                      transition-all duration-200 bg-flow-surface min-h-[42px]">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium 
                       rounded-full bg-flow-warm text-flow-ink"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-red-500 transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input) addTag(input); }}
          placeholder={value.length === 0 ? "Type a tag and press Enter" : value.length < 5 ? "Add more..." : ""}
          disabled={value.length >= 5}
          className="flex-1 min-w-[100px] border-none outline-none bg-transparent text-sm 
                     text-flow-ink placeholder:text-flow-muted"
        />
      </div>
      <p className="text-[10px] text-flow-muted mt-1">Up to 5 tags. Press Enter or comma to add.</p>
    </div>
  );
}

