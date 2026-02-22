import { useState } from 'react';
import { StickyNote, Plus, Trash2, Edit2, Save } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Binary Search Template',
    content: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
    language: 'Python',
    tags: ['Binary Search', 'Template'],
    createdAt: '2026-02-20',
    updatedAt: '2026-02-20'
  },
  {
    id: '2',
    title: 'DFS Tree Traversal',
    content: `void dfs(TreeNode* root) {
    if (!root) return;
    
    // Process current node
    cout << root->val << " ";
    
    // Recurse on children
    dfs(root->left);
    dfs(root->right);
}`,
    language: 'C++',
    tags: ['DFS', 'Tree', 'Recursion'],
    createdAt: '2026-02-19',
    updatedAt: '2026-02-21'
  },
  {
    id: '3',
    title: 'Two Pointer Technique',
    content: `public int[] twoSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) {
            return new int[]{left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return new int[]{-1, -1};
}`,
    language: 'Java',
    tags: ['Two Pointers', 'Array'],
    createdAt: '2026-02-18',
    updatedAt: '2026-02-18'
  },
];

export function CodeNotes() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    language: 'Python',
    tags: '',
  });

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      language: formData.language,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotes([newNote, ...notes]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditNote = () => {
    if (editingNote) {
      setNotes(notes.map(n => 
        n.id === editingNote.id
          ? {
              ...n,
              title: formData.title,
              content: formData.content,
              language: formData.language,
              tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : n
      ));
      setEditingNote(null);
      resetForm();
    }
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      language: note.language,
      tags: note.tags.join(', '),
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      language: 'Python',
      tags: '',
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingNote(null);
    resetForm();
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'Python': return 'bg-blue-500/10 text-blue-500';
      case 'C++': return 'bg-purple-500/10 text-purple-500';
      case 'Java': return 'bg-red-500/10 text-red-500';
      case 'C': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Code Snippets & Notes</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-1">{note.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(note.language)}`}>
                    {note.language}
                  </span>
                  <span className="text-xs text-gray-500">Updated {note.updatedAt}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditModal(note)}
                  className="p-2 bg-zinc-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-2 bg-zinc-800 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-black border border-zinc-800 rounded-lg p-4 mb-3 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                {note.content}
              </pre>
            </div>

            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-zinc-800 text-gray-400 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <StickyNote className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No notes yet. Create your first code snippet!</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingNote) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingNote ? 'Edit Note' : 'Add New Note'}
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                  placeholder="e.g., Binary Search Template"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-zinc-600"
                >
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="C">C</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Code Snippet</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                  placeholder="Paste your code here..."
                  style={{ lineHeight: '1.6' }}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                  placeholder="e.g., Binary Search, Array, Template"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={editingNote ? handleEditNote : handleAddNote}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingNote ? 'Save Changes' : 'Add Note'}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-zinc-800 text-gray-400 py-3 rounded-lg font-medium hover:text-white hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
