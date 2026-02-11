// src/pages/Dashboard.tsx
import { useState, useMemo, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { 
  Search, Folder, Save, Edit3, Trash2, 
  Type, Code, Plus, Bold, Italic, X 
} from "lucide-react";
import { VaultContextType, ContentBlock } from "../types";

// --- SIMPLE MARKDOWN PARSER ---
// This component takes raw text (e.g., "Hello **World**") and renders it with bold/italics
const MarkdownText = ({ content }: { content: string }) => {
  if (!content) return <span className="text-zinc-500 italic">Empty block...</span>;

  // Split by bold (**) and italic (_) markers
  const parts = content.split(/(\*\*.*?\*\*)|(_.*?_)/g).filter(Boolean);

  return (
    <div className="text-zinc-300 leading-7 whitespace-pre-wrap break-words">
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("_") && part.endsWith("_")) {
          return <em key={index} className="text-zinc-400 italic">{part.slice(1, -1)}</em>;
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export default function Dashboard() {
  const { category } = useParams();
  const { items, handleUpdate, handleDelete } = useOutletContext<VaultContextType>();
  
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- EDIT MODE STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [editBlocks, setEditBlocks] = useState<ContentBlock[]>([]);

  // Filter Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const catMatch = category ? item.category.toLowerCase() === category.toLowerCase() : true;
      const searchMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [items, category, searchTerm]);

  const activeItem = items.find(i => i.id === selectedId);

  // Sync state when selection changes
  useEffect(() => {
    if (activeItem) {
      setEditBlocks(activeItem.blocks);
      setIsEditing(false);
    }
  }, [selectedId, activeItem]);

  // --- ACTIONS ---

  const saveChanges = () => {
    if (activeItem) {
      handleUpdate(activeItem.id, { blocks: editBlocks });
      setIsEditing(false);
    }
  };

  const updateBlock = (id: string, newContent: string) => {
    setEditBlocks(prev => prev.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const addBlock = (type: 'text' | 'code') => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: '',
      language: 'javascript'
    };
    setEditBlocks([...editBlocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setEditBlocks(prev => prev.filter(b => b.id !== id));
  };

  // --- TEXT FORMATTING HELPERS ---
  
  // Inserts markdown characters around selected text in a textarea
  const formatText = (id: string, wrapper: string) => {
    const textarea = document.getElementById(`textarea-${id}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    
    if (start === end) return; // No selection

    const selectedText = currentText.substring(start, end);
    const before = currentText.substring(0, start);
    const after = currentText.substring(end);

    const newText = `${before}${wrapper}${selectedText}${wrapper}${after}`;
    updateBlock(id, newText);
  };

  return (
    <>
      {/* --- Pane 2: List --- */}
      <div className="w-80 bg-zinc-900/50 border-r border-zinc-800/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-zinc-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-500" size={16} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-md py-2 pl-9 pr-4 focus:border-blue-500 outline-none placeholder:text-zinc-600"
              placeholder="Search vault..."
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => setSelectedId(item.id)}
              className={`p-4 border-b border-zinc-800/50 cursor-pointer transition-colors ${selectedId === item.id ? 'bg-zinc-800 border-l-2 border-blue-500' : 'hover:bg-zinc-800/30'}`}
            >
              <h3 className={`font-medium mb-1 ${selectedId === item.id ? 'text-white' : 'text-zinc-300'}`}>{item.title}</h3>
              <p className="text-xs text-zinc-500 line-clamp-1">
                {item.blocks[0]?.content || "Empty entry"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Pane 3: Main Canvas --- */}
      {/* min-w-0 prevents flex children from forcing overflow */}
      <main className="flex-1 bg-zinc-950 flex flex-col min-w-0">
        {activeItem ? (
           <>
            {/* Header */}
            <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 sticky top-0 bg-zinc-950/90 backdrop-blur z-10">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                  <Folder size={12} /><span>{activeItem.category}</span>
                </div>
                <h2 className="text-lg font-bold text-white truncate">{activeItem.title}</h2>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {isEditing ? (
                   <>
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                    <button onClick={saveChanges} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-sm font-medium shadow-lg shadow-green-900/20">
                      <Save size={14} /> Save
                    </button>
                   </>
                ) : (
                   <>
                     <button onClick={() => handleDelete(activeItem.id)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                     </button>
                     <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 px-3 py-1.5 rounded text-sm font-medium border border-blue-500/20 transition-colors">
                       <Edit3 size={14} /> Edit
                     </button>
                   </>
                )}
              </div>
            </header>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto w-full">
              <div className="max-w-4xl mx-auto p-8 pb-32 space-y-8">
                
                {/* BLOCKS LOOP */}
                {(isEditing ? editBlocks : activeItem.blocks).map((block, index) => (
                  <div key={block.id} className="group relative transition-all">
                    
                    {/* --- 1. EDIT MODE UI --- */}
                    {isEditing ? (
                      <div className="relative border border-zinc-800 bg-zinc-900/30 rounded-lg p-2 group-focus-within:border-blue-500/50 group-focus-within:ring-1 group-focus-within:ring-blue-500/50 transition-all">
                        
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800/50">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase px-2 tracking-wider">{block.type}</span>
                            
                            {/* Text Customization Tools */}
                            {block.type === 'text' && (
                              <div className="flex items-center gap-1 border-l border-zinc-800 pl-2 ml-2">
                                <button onClick={() => formatText(block.id, '**')} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white" title="Bold">
                                  <Bold size={12} />
                                </button>
                                <button onClick={() => formatText(block.id, '_')} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white" title="Italic">
                                  <Italic size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Delete Block Button */}
                          <button 
                            onClick={() => removeBlock(block.id)}
                            className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                            title="Delete Block"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Input Area */}
                        {block.type === 'text' ? (
                          <textarea
                            id={`textarea-${block.id}`}
                            value={block.content}
                            onChange={(e) => {
                              updateBlock(block.id, e.target.value);
                              // Auto-grow height
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            className="w-full bg-transparent text-zinc-200 text-base leading-7 outline-none resize-none min-h-[3rem]"
                            placeholder="Type text here... (Select text to format)"
                            rows={Math.max(2, block.content.split('\n').length)}
                          />
                        ) : (
                          <textarea
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, e.target.value)}
                            className="w-full bg-zinc-950 p-3 font-mono text-sm text-zinc-300 outline-none resize-none rounded min-h-[8rem]"
                            placeholder="// Paste code here..."
                            spellCheck={false}
                          />
                        )}
                      </div>
                    ) : (
                      
                      /* --- 2. VIEW MODE UI --- */
                      /* Overflow Handling: 'break-words' for text, 'overflow-x-auto' for code */
                      <div className="w-full min-w-0">
                        {block.type === 'text' ? (
                           <MarkdownText content={block.content} />
                        ) : (
                          <div className="rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 my-2">
                             <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/50 border-b border-zinc-800">
                               <span className="text-xs font-mono text-zinc-500">Code</span>
                             </div>
                             <div className="overflow-x-auto">
                               <pre className="p-4 font-mono text-sm text-zinc-300 w-full min-w-max">
                                 {block.content}
                               </pre>
                             </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* --- ADD BUTTONS --- */}
                {isEditing && (
                  <div className="pt-8 flex justify-center gap-3">
                    <button onClick={() => addBlock('text')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-sm">
                      <Plus size={14} /> Text
                    </button>
                    <button onClick={() => addBlock('code')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-sm">
                      <Code size={14} /> Code
                    </button>
                  </div>
                )}

              </div>
            </div>
           </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
             <p>Select an entry to view</p>
          </div>
        )}
      </main>
    </>
  );
}