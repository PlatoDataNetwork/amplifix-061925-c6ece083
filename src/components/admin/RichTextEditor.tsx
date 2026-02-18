import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Code, Minus, Upload, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface RichTextEditorProps { content: string; onChange: (content: string) => void; placeholder?: string; }

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const [linkUrl, setLinkUrl] = useState(""); const [imageUrl, setImageUrl] = useState(""); const [isUploading, setIsUploading] = useState(false); const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({ extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } }), Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }), Image.configure({ HTMLAttributes: { class: "max-w-full rounded-lg my-4" } })], content, onUpdate: ({ editor }) => onChange(editor.getHTML()), editorProps: { attributes: { class: "prose prose-invert max-w-none min-h-[300px] p-4 focus:outline-none" } } });
  if (!editor) return null;

  const addLink = () => { if (linkUrl) { editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run(); setLinkUrl(""); } };
  const addImage = (url?: string) => { const u = url || imageUrl; if (u) { editor.chain().focus().setImage({ src: u }).run(); setImageUrl(""); } };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be < 5MB"); return; }
    setIsUploading(true);
    try { const ext = file.name.split(".").pop(); const path = `content/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`; const { error } = await supabase.storage.from("article-images").upload(path, file, { cacheControl: "3600", upsert: false }); if (error) throw error; const { data } = supabase.storage.from("article-images").getPublicUrl(path); addImage(data.publicUrl); toast.success("Image uploaded"); } catch (err: any) { toast.error(`Upload failed: ${err.message}`); } finally { setIsUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const TB = ({ onClick, isActive, children, title }: { onClick: () => void; isActive?: boolean; children: React.ReactNode; title: string }) => <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${isActive ? "bg-muted text-foreground" : "text-muted-foreground"}`} onClick={onClick} title={title}>{children}</Button>;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        <TB onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold"><Bold className="w-4 h-4" /></TB>
        <TB onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic"><Italic className="w-4 h-4" /></TB>
        <TB onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive("code")} title="Code"><Code className="w-4 h-4" /></TB>
        <div className="w-px h-6 bg-border mx-1" />
        <TB onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} title="H1"><Heading1 className="w-4 h-4" /></TB>
        <TB onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="H2"><Heading2 className="w-4 h-4" /></TB>
        <TB onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} title="H3"><Heading3 className="w-4 h-4" /></TB>
        <div className="w-px h-6 bg-border mx-1" />
        <TB onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet List"><List className="w-4 h-4" /></TB>
        <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Ordered List"><ListOrdered className="w-4 h-4" /></TB>
        <TB onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote"><Quote className="w-4 h-4" /></TB>
        <TB onClick={() => editor.chain().focus().setHorizontalRule().run()} title="HR"><Minus className="w-4 h-4" /></TB>
        <div className="w-px h-6 bg-border mx-1" />
        <Popover><PopoverTrigger asChild><Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive("link") ? "bg-muted text-foreground" : "text-muted-foreground"}`} title="Link"><LinkIcon className="w-4 h-4" /></Button></PopoverTrigger><PopoverContent className="w-80"><div className="flex gap-2"><Input placeholder="Enter URL..." value={linkUrl} onChange={e => setLinkUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && addLink()} /><Button size="sm" onClick={addLink}>Add</Button></div></PopoverContent></Popover>
        <Popover><PopoverTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Image">{isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}</Button></PopoverTrigger><PopoverContent className="w-80"><Tabs defaultValue="upload"><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="upload">Upload</TabsTrigger><TabsTrigger value="url">URL</TabsTrigger></TabsList><TabsContent value="upload" className="mt-3"><input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} /><Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>{isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4 mr-2" />Choose Image</>}</Button></TabsContent><TabsContent value="url" className="mt-3"><div className="flex gap-2"><Input placeholder="Enter image URL..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && addImage()} /><Button size="sm" onClick={() => addImage()}>Add</Button></div></TabsContent></Tabs></PopoverContent></Popover>
        <div className="flex-1" />
        <TB onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="w-4 h-4" /></TB>
        <TB onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="w-4 h-4" /></TB>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;