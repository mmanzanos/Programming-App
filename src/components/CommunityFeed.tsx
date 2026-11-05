import React, { useState } from 'react';
import { SocialPost, UserProfile, LanguageId, LeaderboardUser } from '../types';
import { sound } from '../services/sound';
import {
  Heart,
  MessageSquare,
  Share2,
  Code2,
  Copy,
  Check,
  Send,
  Sparkles,
  Trophy,
  Flame,
  Award,
  Filter
} from 'lucide-react';

interface CommunityFeedProps {
  posts: SocialPost[];
  profile: UserProfile;
  leaderboard: LeaderboardUser[];
  onAddPost: (content: string, codeSnippet?: string, languageId?: LanguageId) => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onOpenShareModal: () => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  profile,
  leaderboard,
  onAddPost,
  onToggleLike,
  onAddComment,
  onOpenShareModal
}) => {
  const [filterLang, setFilterLang] = useState<string>('all');
  const [newContent, setNewContent] = useState('');
  const [newCode, setNewCode] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageId>('python');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => {
    if (filterLang === 'all') return true;
    if (filterLang === 'my') return post.authorId === profile.id;
    return post.languageId === filterLang;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddPost(
      newContent.trim(),
      showCodeInput && newCode.trim() ? newCode.trim() : undefined,
      showCodeInput && newCode.trim() ? selectedLang : undefined
    );
    setNewContent('');
    setNewCode('');
    setShowCodeInput(false);
    sound.playSuccess();
  };

  const handleCopyCode = async (snippet: string, postId: string) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedSnippetId(postId);
      sound.playNotification();
      setTimeout(() => setCopiedSnippetId(null), 2000);
    } catch {
      // Ignored
    }
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    sound.playSuccess();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      {/* Main Feed Column (8 cols on lg) */}
      <div className="lg:col-span-8 space-y-4">
        {/* Creator Box */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <form onSubmit={handleCreatePost} className="space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover shrink-0"
              />
              <div className="flex-1 space-y-2">
                <textarea
                  rows={2}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Comparte tu solución, una duda o tu racha del día con Marc y amigos..."
                  className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {showCodeInput && (
                  <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-slate-400">Snippet de código:</span>
                      <select
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value as LanguageId)}
                        className="bg-slate-800 text-slate-200 text-[11px] rounded px-2 py-0.5 border border-slate-700 focus:outline-none"
                      >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="rust">Rust</option>
                        <option value="sql">SQL</option>
                        <option value="html_css">HTML/CSS</option>
                      </select>
                    </div>
                    <textarea
                      rows={3}
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="// Pega tu fragmento de código aquí..."
                      className="w-full bg-transparent text-emerald-400 font-mono text-xs focus:outline-none resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span>{showCodeInput ? 'Quitar código' : 'Adjuntar código'}</span>
              </button>

              <button
                type="submit"
                disabled={!newContent.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar</span>
              </button>
            </div>
          </form>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'python', label: 'Python' },
              { id: 'javascript', label: 'JavaScript' },
              { id: 'rust', label: 'Rust' },
              { id: 'my', label: 'Mis publicaciones' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterLang(tab.id)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterLang === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {filteredPosts.length} publicaciones
          </span>
        </div>

        {/* Feed Posts */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3"
            >
              {/* Post Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {post.authorName}
                      </span>
                      {post.isMarc && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          Mentor
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">@{post.authorHandle}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{post.createdAt}</span>
                  </div>
                </div>

                {/* Offline pending badge */}
                {post.pendingSync && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                    Guardado offline
                  </span>
                )}
              </div>

              {/* Achievement Badge if unlocked */}
              {post.achievementTitle && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Logro: {post.achievementTitle}</span>
                </div>
              )}

              {/* Post Content */}
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Code Snippet */}
              {post.codeSnippet && (
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 relative group">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] text-slate-400 font-mono">
                    <span>{post.languageId?.toUpperCase() || 'CÓDIGO'}</span>
                    <button
                      onClick={() => handleCopyCode(post.codeSnippet!, post.id)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                      title="Copiar código"
                    >
                      {copiedSnippetId === post.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                    {post.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <button
                  onClick={() => onToggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.hasLiked
                      ? 'text-rose-500 font-semibold'
                      : 'hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="tabular-nums">{post.likes}</span>
                </button>

                <button
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="tabular-nums">{post.comments.length} comentarios</span>
                </button>

                <button
                  onClick={onOpenShareModal}
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Compartir</span>
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentPostId === post.id && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {post.comments.length > 0 && (
                    <div className="space-y-2">
                      {post.comments.map(c => (
                        <div key={c.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                          <img
                            src={c.authorAvatar}
                            alt={c.authorName}
                            className="w-6 h-6 rounded-full shrink-0 object-cover mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {c.authorName}
                              </span>
                              <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 mt-0.5">{c.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Escribe una respuesta o felicitación..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                      className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Leaderboard / Amigos (4 cols on lg) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Mentor Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/avatar_marc_mentor_1793881715962.jpg"
              alt="Marc Tutor"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Marc</h3>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  Mentor
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Ingeniero de Software y Tutor</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            "Aprender a programar es una maratón de pequeños hábitos diarios. Comparte tus dudas en este muro y resuelve los retos paso a paso."
          </p>
        </div>

        {/* Leaderboard / Amigos Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Ranking Semanal
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">Actualizado</span>
          </div>

          <div className="space-y-2">
            {leaderboard.map(u => (
              <div
                key={u.id}
                className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                  u.isCurrentUser
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 font-medium'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 text-center text-xs font-bold tabular-nums ${
                    u.rank === 1 ? 'text-amber-500' : u.rank === 2 ? 'text-slate-400' : u.rank === 3 ? 'text-amber-700' : 'text-slate-500'
                  }`}>
                    #{u.rank}
                  </span>
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {u.name}
                    </p>
                    <span className="text-[10px] text-slate-400">@{u.handle}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {u.xp} XP
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium tabular-nums">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{u.streakDays}d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
