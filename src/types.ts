export type BlockType = 'text' | 'code';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  language?: string; // Optional: for code blocks (e.g., 'tsx', 'css')
}

export interface VaultItem {
  id: number;
  title: string;
  category: string;
  tags: string[];
  date: string;
  // INSTREAD OF description/content, we now have blocks:
  blocks: ContentBlock[]; 
}

export interface VaultContextType {
  items: VaultItem[];
  handleCreate: (title: string, category: string) => void;
  handleUpdate: (id: number, updatedFields: Partial<VaultItem>) => void;
  handleDelete: (id: number) => void;
}