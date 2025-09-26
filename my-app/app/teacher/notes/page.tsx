"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Dialog } from "@headlessui/react";
import { X, Edit3, Trash2, Plus, BookOpen, Search, Calendar } from "lucide-react";

interface Note {
  id: string;
  content: string;
  created_at: string;
}

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [viewNote, setViewNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const notesContainerRef = useRef<HTMLDivElement>(null);

  // Load current user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error.message);
        return;
      }
      setUserId(data.user?.id || null);
    };
    getUser();
  }, []);

  // Load notes
  useEffect(() => {
    if (userId) {
      loadNotes();
    }
  }, [userId]);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!input.trim() || !userId) return;
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ user_id: userId, content: input.trim() }])
        .select()
        .single();

      if (error) throw error;
      setNotes([data, ...notes]);
      setInput("");
      setSelectedNote(data);
      
      // Scroll to top after adding a new note
      if (notesContainerRef.current) {
        notesContainerRef.current.scrollTop = 0;
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const updateNote = async () => {
    if (!selectedNote || !userId) return;
    try {
      const { error } = await supabase
        .from("notes")
        .update({ content: selectedNote.content })
        .eq("id", selectedNote.id)
        .eq("user_id", userId);

      if (error) throw error;
      setNotes(
        notes.map((n) => (n.id === selectedNote.id ? selectedNote : n))
      );
      setSelectedNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", userId);

      if (error) throw error;
      setNotes(notes.filter((note) => note.id !== noteId));
      if (selectedNote?.id === noteId) setSelectedNote(null);
      if (viewNote?.id === noteId) setViewNote(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="animate-pulse bg-gradient-to-r from-purple-400 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="text-white w-8 h-8" />
        </div>
        <p className="text-purple-700 text-xl font-medium">Loading your journal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[90vh]">
        {/* Left editor panel */}
        <div className="w-full md:w-2/5 p-6 border-r border-purple-100 bg-gradient-to-b from-white to-purple-50 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Mindful Notes
            </h1>
          </div>
          
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            {selectedNote ? "Edit Note" : "New Note"}
          </h2>
          
          {selectedNote && (
            <div className="flex items-center text-indigo-500 text-sm mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(selectedNote.created_at)}
            </div>
          )}
          
          <div className="flex-grow mb-4">
            <textarea
              value={selectedNote ? selectedNote.content : input}
              onChange={(e) =>
                selectedNote
                  ? setSelectedNote({ ...selectedNote, content: e.target.value })
                  : setInput(e.target.value)
              }
              className="w-full h-full p-4 rounded-xl border border-purple-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none resize-none text-gray-700"
              placeholder="What's on your mind today?..."
            />
          </div>
          
          <div className="flex gap-3 mt-4">
            {selectedNote ? (
              <>
                <button
                  onClick={updateNote}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition shadow-md flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Update
                </button>
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-3 rounded-xl hover:from-red-500 hover:to-red-600 transition shadow-md flex items-center justify-center"
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-300 transition shadow-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={addNote}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition shadow-md flex items-center justify-center gap-2"
                disabled={!input.trim()}
              >
                <Plus className="w-5 h-5" />
                Add Note
              </button>
            )}
          </div>
        </div>

        {/* Right notes list panel */}
        <div className="w-full md:w-3/5 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-purple-800">Your Notes</h2>
            <div className="text-sm text-purple-500">
              {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
            </div>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none"
            />
          </div>
          
          <div 
            ref={notesContainerRef}
            className="flex-grow space-y-4 overflow-y-auto pr-2 mt-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {filteredNotes.length === 0 ? (
              <div className="text-center py-10">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-purple-500 w-8 h-8" />
                </div>
                <p className="text-purple-400">
                  {searchQuery ? "No matching notes found." : "No notes yet. Start writing!"}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                    selectedNote?.id === note.id
                      ? "bg-indigo-50 border-indigo-300 shadow-md"
                      : "bg-white border-purple-100 hover:bg-purple-50"
                  }`}
                  onClick={() => setViewNote(note)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-indigo-500 text-xs font-medium flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(note.created_at)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNote(note);
                        }}
                        className="text-indigo-400 hover:text-indigo-600 transition-colors p-1"
                        title="Edit note"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-3 text-sm">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Note Viewer Modal */}
      <Dialog open={!!viewNote} onClose={() => setViewNote(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-purple-100">
              <Dialog.Title className="text-xl font-semibold text-purple-800">
                Note Details
              </Dialog.Title>
              <button
                onClick={() => setViewNote(null)}
                className="text-purple-500 hover:text-purple-700 p-1 rounded-full hover:bg-purple-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {viewNote && (
              <div className="p-6 overflow-y-auto flex-grow">
                <div className="text-indigo-500 text-sm mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(viewNote.created_at)}
                </div>
                <p className="whitespace-pre-wrap text-gray-700">
                  {viewNote.content}
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 p-6 border-t border-purple-100">
              <button
                onClick={() => {
                  if (viewNote) setSelectedNote(viewNote);
                  setViewNote(null);
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Note
              </button>
              <button
                onClick={() => setViewNote(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default NotesPage;