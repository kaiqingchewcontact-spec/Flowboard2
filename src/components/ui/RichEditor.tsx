import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExt from '@tiptap/extension-image';
import LinkExt from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Image as ImageIcon, Link2, Minus, Loader2, Undo, Redo
} from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      ImageExt.configure({
        HTMLAttributes: { class: 'rich-editor-image' },
      }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'rich-editor-link' },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0 && files[0].type.startsWith('image/')) {
          event.preventDefault();
          handleImageUpload(files[0]);
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
              event.preventDefault();
              const file = items[i].getAsFile();
              if (file) handleImageUpload(file);
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value]);

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.url && editor) {
        editor.chain().focus().setImage({ src: json.url }).run();
      }
    } finally {
      setUploading(false);
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-flow-accent/10 text-flow-accent'
          : 'text-flow-muted hover:text-flow-ink hover:bg-flow-warm'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-flow-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-flow-accent/20 focus-within:border-flow-accent/40 transition-all duration-200">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-flow-border bg-flow-paper/50 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-flow-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-flow-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-flow-border mx-1" />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Insert image"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
        </ToolbarButton>
        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Add link">
          <Link2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-flow-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo size={15} />
        </ToolbarButton>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Styles */}
      <style jsx global>{`
        .rich-editor-content {
          min-height: 300px;
          padding: 16px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: #0a0a0a;
          outline: none;
        }
        .rich-editor-content:focus {
          outline: none;
        }
        .rich-editor-content h1 {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          margin: 24px 0 12px;
          line-height: 1.2;
        }
        .rich-editor-content h2 {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          margin: 20px 0 10px;
          line-height: 1.3;
        }
        .rich-editor-content h3 {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 18px;
          font-weight: 700;
          margin: 16px 0 8px;
          line-height: 1.4;
        }
        .rich-editor-content p {
          margin: 0 0 12px;
        }
        .rich-editor-content ul {
          list-style: disc;
          padding-left: 24px;
          margin: 8px 0;
        }
        .rich-editor-content ol {
          list-style: decimal;
          padding-left: 24px;
          margin: 8px 0;
        }
        .rich-editor-content li {
          margin: 4px 0;
        }
        .rich-editor-content blockquote {
          border-left: 3px solid #e85d3a;
          padding-left: 16px;
          margin: 16px 0;
          color: #9c9589;
          font-style: italic;
        }
        .rich-editor-content hr {
          border: none;
          border-top: 1px solid #e8e4de;
          margin: 24px 0;
        }
        .rich-editor-content strong {
          font-weight: 600;
        }
        .rich-editor-content em {
          font-style: italic;
        }
        .rich-editor-content u {
          text-decoration: underline;
        }
        .rich-editor-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
        }
        .rich-editor-link {
          color: #e85d3a;
          text-decoration: underline;
          cursor: pointer;
        }
        .rich-editor-content .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9c9589;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror {
          min-height: 300px;
          padding: 16px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9c9589;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}

