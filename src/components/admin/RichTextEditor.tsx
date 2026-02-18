import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Code,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('code')} onPressedChange={() => editor.chain().focus().toggleCode().run()}>
          <Code className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border self-center mx-1" />
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border self-center mx-1" />
        <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border self-center mx-1" />
        <Button variant="ghost" size="sm" onClick={addLink}><LinkIcon className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={addImage}><ImageIcon className="h-4 w-4" /></Button>
        <div className="w-px h-6 bg-border self-center mx-1" />
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
