import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProEffective } from "@/lib/entitlements";
import Link from "next/link";
import { Notebook, Plus, Search, Filter, Lock, Check, Edit, Trash2 } from "lucide-react";
import { NoteEditor } from "./NoteEditor";
import { NoteList } from "./NoteList";

export default async function NotesPage() {
  const userId = await getCurrentUserId();
  let isPro = false;
  let user = null;

  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        notes: {
          include: { lesson: true },
          orderBy: { updatedAt: 'desc' },
          take: 50
        }
      }
    });
    isPro = user ? isProEffective(user) : false;
  }

  const notes = user?.notes || [];
  const hasNotes = notes.length > 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Notebook className="w-8 h-8 text-[var(--purple-primary)]" />
              <h1 className="text-3xl sm:text-4xl font-black">Notes & Recaps</h1>
            </div>
            {isPro && hasNotes && (
              <Link
                href="/notes/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--purple-primary)] hover:bg-[var(--purple-dark)] text-white font-black transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Note
              </Link>
            )}
          </div>
          <p className="text-[var(--text-secondary)] text-lg">
            Save your insights, key takeaways, and personal reflections from lessons.
          </p>
        </div>

        {/* Pro Gate */}
        {!isPro ? (
          <div className="bg-gradient-to-br from-[var(--purple-primary)]/20 to-[var(--bg-card)] border border-[var(--purple-primary)]/30 rounded-2xl p-8 text-center mb-10">
            <Lock className="w-12 h-12 mx-auto mb-4 text-[var(--purple-primary)]" />
            <h2 className="text-2xl font-black mb-3">Pro Feature: Save Notes & Recaps</h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              Take notes on lessons, save key insights, and create personal recaps.
              Upgrade to Pro to unlock this feature and organize your learning.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--purple-primary)] hover:bg-[var(--purple-dark)] text-white font-black transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[var(--text-secondary)]">Total Notes</span>
                  <Notebook className="w-5 h-5 text-[var(--blue-primary)]" />
                </div>
                <div className="text-3xl font-black">{notes.length}</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Across all lessons</div>
              </div>
              
              <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[var(--text-secondary)]">Recent Activity</span>
                  <Edit className="w-5 h-5 text-[var(--green-primary)]" />
                </div>
                <div className="text-3xl font-black">
                  {notes.length > 0 ? new Date(notes[0].updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '--'}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Last updated</div>
              </div>
              
              <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[var(--text-secondary)]">With Lessons</span>
                  <Check className="w-5 h-5 text-[var(--orange-primary)]" />
                </div>
                <div className="text-3xl font-black">
                  {notes.filter(n => n.lessonId).length}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Linked to lessons</div>
              </div>
            </div>

            {/* Empty State */}
            {!hasNotes ? (
              <div className="bg-gradient-to-br from-[var(--green-primary)]/20 to-[var(--bg-card)] border border-[var(--green-primary)]/30 rounded-2xl p-12 text-center">
                <Notebook className="w-16 h-16 mx-auto mb-6 text-[var(--green-primary)]" />
                <h2 className="text-2xl font-black mb-3">Start Taking Notes</h2>
                <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                  Save your insights from lessons, interview prep, or AI explorations.
                  Your notes are private and only visible to you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/notes/new"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white font-black transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Note
                  </Link>
                  <Link
                    href="/learn"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-white font-black transition-colors"
                  >
                    Browse Lessons
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Search & Filter */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                      <input
                        type="text"
                        placeholder="Search notes..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-white placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--purple-primary)]"
                      />
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-white font-black hover:bg-[var(--border-color)] transition-colors">
                      <Filter className="w-5 h-5" />
                      Filter
                    </button>
                  </div>
                </div>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)] hover:border-[var(--purple-primary)]/50 transition-all hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-black mb-1 line-clamp-1">
                            {note.lesson?.title || 'General Note'}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                            {note.lesson && (
                              <>
                                <span>•</span>
                                <span className="px-2 py-0.5 rounded-full bg-[var(--purple-primary)]/20 text-[var(--purple-primary)] text-xs">
                                  Lesson
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-[var(--border-color)] transition-colors">
                            <Edit className="w-4 h-4 text-[var(--text-secondary)]" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-[var(--border-color)] transition-colors">
                            <Trash2 className="w-4 h-4 text-[var(--text-secondary)]" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-[var(--text-secondary)] line-clamp-3">
                          {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">
                          {Math.ceil(note.content.length / 100)} min read
                        </span>
                        <Link
                          href={`/notes/${note.id}`}
                          className="text-sm font-black text-[var(--purple-primary)] hover:text-[var(--purple-dark)] transition-colors"
                        >
                          View Note →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Create New Note Card */}
                <div className="mt-8">
                  <Link
                    href="/notes/new"
                    className="block bg-gradient-to-br from-[var(--purple-primary)]/10 to-[var(--bg-card)] border-2 border-dashed border-[var(--purple-primary)]/30 rounded-2xl p-8 text-center hover:border-[var(--purple-primary)]/50 hover:from-[var(--purple-primary)]/15 transition-all"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--purple-primary)]/20 mb-4">
                      <Plus className="w-6 h-6 text-[var(--purple-primary)]" />
                    </div>
                    <h3 className="text-xl font-black mb-2">Add New Note</h3>
                    <p className="text-[var(--text-secondary)]">
                      Capture insights from a lesson or write a general reflection
                    </p>
                  </Link>
                </div>
              </>
            )}
          </>
        )}

        {/* Features */}
        <div className="mt-12 bg-[var(--bg-card)] rounded-2xl p-8 border border-[var(--border-color)]">
          <h2 className="text-2xl font-black mb-6">Why Take Notes?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--green-primary)]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--green-primary)] text-sm font-black">1</span>
              </div>
              <div>
                <h3 className="font-black mb-1">Retain Knowledge</h3>
                <p className="text-sm text-[var(--text-secondary)]">Writing helps solidify learning and improve recall</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--blue-primary)]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--blue-primary)] text-sm font-black">2</span>
              </div>
              <div>
                <h3 className="font-black mb-1">Personal Insights</h3>
                <p className="text-sm text-[var(--text-secondary)]">Connect lessons to your own experiences and goals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--orange-primary)]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--orange-primary)] text-sm font-black">3</span>
              </div>
              <div>
                <h3 className="font-black mb-1">Interview Prep</h3>
                <p className="text-sm text-[var(--text-secondary)]">Build a personal knowledge base for PM interviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}