'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageSquare,
  Star,
  Send,
  ThumbsUp,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  Filter,
} from 'lucide-react';
import { ToolItem, ToolComment, ToolFeedbackData } from '@/lib/types';
import { useUser } from '../auth/UserContext';
import { getAnonymousId } from '@/lib/analytics/tracker';

interface ToolFeedbackSectionProps {
  tool: ToolItem;
  initialLikes?: number;
}

export function ToolFeedbackSection({ tool, initialLikes }: ToolFeedbackSectionProps) {
  const { user } = useUser();
  const [feedback, setFeedback] = useState<ToolFeedbackData>({
    toolSlug: tool.slug,
    likes: initialLikes || 120,
    userLiked: false,
    comments: [],
    averageRating: 5.0,
    totalComments: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [likedCommentIds, setLikedCommentIds] = useState<Record<string, boolean>>({});

  // Form state
  const [customAuthorName, setCustomAuthorName] = useState<string | null>(null);
  const authorName = customAuthorName !== null ? customAuthorName : (user?.name || '');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sorting
  const [sortBy, setSortBy] = useState<'newest' | 'helpful'>('newest');

  // Load initial feedback
  useEffect(() => {
    let isMounted = true;
    const anonId = getAnonymousId();
    const userId = user?.id || anonId;

    async function fetchFeedback() {
      try {
        const res = await fetch(`/api/feedback?toolSlug=${encodeURIComponent(tool.slug)}&userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && isMounted) {
            setFeedback({
              toolSlug: tool.slug,
              likes: data.likes,
              userLiked: data.userLiked,
              comments: data.comments || [],
              averageRating: data.averageRating || 5.0,
              totalComments: data.totalComments || (data.comments?.length ?? 0),
            });
          }
        }
      } catch (e) {
        console.error('Failed to load feedback:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchFeedback();

    return () => {
      isMounted = false;
    };
  }, [tool.slug, user?.id]);

  // Handle global like toggle
  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const anonId = getAnonymousId();
    const userId = user?.id || anonId;

    // Optimistic UI update
    const nextUserLiked = !feedback.userLiked;
    const nextLikes = nextUserLiked ? feedback.likes + 1 : Math.max(0, feedback.likes - 1);

    setFeedback((prev) => ({
      ...prev,
      likes: nextLikes,
      userLiked: nextUserLiked,
    }));

    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);

    try {
      const res = await fetch('/api/feedback/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolSlug: tool.slug, userId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setFeedback((prev) => ({
            ...prev,
            likes: data.likes,
            userLiked: data.userLiked,
          }));
        }
      }
    } catch (e) {
      console.error('Like toggle failed:', e);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle submitting new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const nameToUse = authorName.trim() || (user?.name ? user.name : 'Community User');

    try {
      const res = await fetch('/api/feedback/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug: tool.slug,
          authorName: nameToUse,
          text: commentText.trim(),
          rating,
          badge: user?.role === 'admin' ? 'Staff' : undefined,
          verified: Boolean(user),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback((prev) => ({
          ...prev,
          comments: [data.comment, ...prev.comments],
          totalComments: data.totalComments,
          averageRating: data.averageRating,
        }));

        setCommentText('');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(data.error || 'Failed to post comment. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Network error while posting comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upvote comment
  const handleLikeComment = async (commentId: string) => {
    if (likedCommentIds[commentId]) return;

    setLikedCommentIds((prev) => ({ ...prev, [commentId]: true }));
    setFeedback((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c.id === commentId ? { ...c, likesCount: (c.likesCount || 0) + 1 } : c
      ),
    }));

    try {
      await fetch('/api/feedback/comment/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, toolSlug: tool.slug }),
      });
    } catch {
      // Ignored
    }
  };

  // Quick chips
  const quickTags = [
    '⚡ Blazing fast',
    '🔒 100% private',
    '🎯 Highly accurate',
    '💼 Saved me hours',
    '📱 Great on mobile',
  ];

  const handleQuickTagClick = (tag: string) => {
    setCommentText((prev) => {
      const clean = prev.trim();
      return clean ? `${clean} • ${tag}` : tag;
    });
  };

  // Sorted comments
  const sortedComments = [...feedback.comments].sort((a, b) => {
    if (sortBy === 'helpful') {
      return (b.likesCount || 0) - (a.likesCount || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section
      id="tool-feedback"
      aria-label="Tool Comments and Global Likes"
      className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-7 md:p-8 shadow-xs space-y-6 sm:space-y-8"
    >
      {/* Header & Global Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Community Likes & Feedback</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            User Reviews & Global Popularity
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            See what engineers and creators think of {tool.name}. Vote and share your experience.
          </p>
        </div>

        {/* Global Like CTA Card */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-slate-50 dark:bg-[#14171F] p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800/90 shrink-0">
          <div className="text-left pr-2 border-r border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {feedback.likes.toLocaleString()}
              </span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Global Likes</p>
          </div>

          <button
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-xs cursor-pointer ${
              feedback.userLiked
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 ring-2 ring-rose-400/30'
                : 'bg-white hover:bg-rose-50 text-slate-800 dark:bg-[#1A1D26] dark:hover:bg-rose-500/20 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500/40'
            } ${likeAnim ? 'scale-110' : 'scale-100'}`}
            title={feedback.userLiked ? 'Unlike this tool' : 'Like this tool globally'}
            aria-label="Global Like Tool"
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                feedback.userLiked ? 'fill-white text-white' : 'text-rose-500'
              } ${likeAnim ? 'scale-125' : ''}`}
            />
            <span>{feedback.userLiked ? 'You Liked This!' : 'Like This Tool'}</span>
          </button>
        </div>
      </div>

      {/* Ratings & Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#14171F]/70 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-500">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{feedback.averageRating} / 5.0</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-normal">Rating</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Based on user reviews</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#14171F]/70 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {feedback.totalComments} Comments
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Developer discussions</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#14171F]/70 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Public & Global</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Live community counts</p>
          </div>
        </div>
      </div>

      {/* Leave a Comment Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-50/70 to-slate-100/40 dark:from-[#14171F]/80 dark:to-[#111318] border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Leave a Review or Comment</span>
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">No account required</span>
        </div>

        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Author Name */}
            <div>
              <label htmlFor="comment-author" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Name / Handle
              </label>
              <div className="relative">
                <input
                  id="comment-author"
                  type="text"
                  value={authorName}
                  onChange={(e) => setCustomAuthorName(e.target.value)}
                  placeholder={user?.name ? user.name : 'e.g. John Doe / Dev'}
                  maxLength={50}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#1A1D26] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Star Rating Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Rate this Tool
              </label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 hover:scale-120 transition-transform cursor-pointer focus:outline-hidden"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          active
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.4)]'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs text-slate-600 dark:text-slate-400 ml-2 font-medium">
                  {rating === 5
                    ? 'Excellent! ⭐'
                    : rating === 4
                    ? 'Very Good'
                    : rating === 3
                    ? 'Good'
                    : rating === 2
                    ? 'Fair'
                    : 'Needs Improvement'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Tag Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1">Quick feedback:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-[#1A1D26] border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:border-cyan-500 dark:hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Comment Textarea */}
          <div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Write your comment, question, or tips about ${tool.name}...`}
              rows={3}
              maxLength={1000}
              required
              className="w-full p-3.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#1A1D26] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 resize-y min-h-[80px]"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>Markdown not supported. Keep it friendly and technical.</span>
              <span>{commentText.length} / 1000</span>
            </div>
          </div>

          {submitError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Thank you! Your comment has been posted globally for everyone to see.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="min-h-[42px] px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white transition-all duration-200 flex items-center gap-2 shadow-xs cursor-pointer shadow-cyan-600/20"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Discussion List & Filters */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-500" />
            <span>Community Discussions ({sortedComments.length})</span>
          </h3>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center rounded-lg bg-slate-100 dark:bg-[#1A1D26] p-0.5 border border-slate-200 dark:border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setSortBy('newest')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  sortBy === 'newest'
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Newest
              </button>
              <button
                type="button"
                onClick={() => setSortBy('helpful')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  sortBy === 'helpful'
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Most Helpful
              </button>
            </div>
          </div>
        </div>

        {/* Comments Feed */}
        {sortedComments.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-400/80 stroke-1" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No comments yet for {tool.name}.
            </p>
            <p className="text-xs max-w-sm mx-auto">
              Be the first engineer to share feedback, tips, or ask a question using the form above!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedComments.map((comment) => {
              // Generate consistent initial colors
              const initials = comment.authorName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'U';

              const isLiked = likedCommentIds[comment.id];

              return (
                <div
                  key={comment.id}
                  className="p-4 sm:p-5 rounded-xl bg-slate-50/60 dark:bg-[#14171F]/60 border border-slate-200/90 dark:border-slate-800/80 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {initials}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {comment.authorName}
                          </h4>

                          {comment.badge && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20">
                              {comment.badge}
                            </span>
                          )}

                          {comment.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(comment.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    {comment.rating && comment.rating > 0 && (
                      <div className="flex items-center gap-0.5 shrink-0 bg-white dark:bg-[#1A1D26] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (comment.rating || 5)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Comment Body */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-1 sm:pl-12">
                    {comment.text}
                  </p>

                  {/* Actions bar (Helpful vote) */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 sm:pl-12 text-[11px]">
                    <span className="text-slate-400">Public Community Feedback</span>

                    <button
                      type="button"
                      onClick={() => handleLikeComment(comment.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        isLiked
                          ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                      }`}
                      title="Mark as helpful"
                    >
                      <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                      <span>Helpful ({comment.likesCount || 0})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
