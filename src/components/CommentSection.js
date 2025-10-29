'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MessageCircle, Send, User, Calendar, Reply, Shield, Heart } from 'lucide-react';
import Link from 'next/link';

export default function CommentSection({ blogId }) {
  // State management
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [userAuth, setUserAuth] = useState(null);

  // Auth context
  const { user, isAuthenticated } = useAuth();

  const checkAuthentication = useCallback(() => {
    try {
      // Check AuthContext first
      if (isAuthenticated && user) {
        setUserAuth(user);
        return;
      }

      // Check localStorage as fallback
      const storedUser = localStorage.getItem('user');
      const authToken = localStorage.getItem('token');

      if (storedUser && authToken) {
        const userData = JSON.parse(storedUser);
        setUserAuth(userData);
      } else {
        setUserAuth(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUserAuth(null);
    }
  }, [user, isAuthenticated]);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/comments?blog_id=${encodeURIComponent(blogId)}`);
      const data = await response.json();

      if (response.ok) {
        setComments(data.comments || []);
      } else {
        console.error('Error fetching comments:', data.error);
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Fetch comments on mount
  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId, fetchComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!userAuth) {
      alert('Please login to post a comment');
      return;
    }

    if (!newComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    if (newComment.length < 3 || newComment.length > 1000) {
      alert('Comment must be between 3 and 1000 characters');
      return;
    }

    try {
      setSubmitting(true);
      
      const commentData = {
        blog_id: blogId,
        user_name: userAuth.name || userAuth.email?.split('@')[0] || 'Anonymous User',
        user_email: userAuth.email || '',
        comment_text: newComment.trim(),
        user_id: userAuth.id || null,
        parent_id: replyTo || null
      };

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();

      if (response.ok) {
        setNewComment('');
        setReplyTo(null);
        setShowCommentForm(false);
        fetchComments(); // Refresh comments
        alert('Comment posted successfully!');
      } else {
        console.error('Error posting comment:', data);
        alert(data.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleReply = (commentId, userName) => {
    setReplyTo(commentId);
    setShowCommentForm(true);
    setNewComment(`@${userName} `);
  };

  const cancelReply = () => {
    setReplyTo(null);
    setNewComment('');
  };

  // Organize comments into threads
  const organizeComments = (comments) => {
    if (!Array.isArray(comments)) return [];
    
    const parentComments = comments.filter(comment => !comment.parent_id);
    const replies = comments.filter(comment => comment.parent_id);

    const threadedComments = parentComments.map(parent => ({
      ...parent,
      replies: replies.filter(reply => reply.parent_id === parent.id)
    }));

    return threadedComments;
  };

  const organizedComments = organizeComments(comments);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-[#6dc1c9]" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Comments ({comments.length})
          </h3>
        </div>
        
        {!showCommentForm && (
          <button
            onClick={() => setShowCommentForm(true)}
            className="bg-[#6dc1c9] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Add Comment
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl border-2 border-teal-100">
          {!userAuth ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Login Required
              </h4>
              <p className="text-gray-600 mb-6">
                Please login to post comments and engage with the community.
              </p>
              <div className="flex gap-3 justify-center">
                <Link 
                  href="/login" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Login to Comment
                </Link>
                <button
                  onClick={() => setShowCommentForm(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitComment} className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#6dc1c9]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {userAuth.name || userAuth.email?.split('@')[0] || 'Anonymous User'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {userAuth.email || ''}
                  </p>
                </div>
              </div>
              
              {/* Reply Info */}
              {replyTo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-700">
                    <Reply className="w-4 h-4 inline mr-1" />
                    Replying to: <span className="font-medium">
                      {comments.find(c => c.id === replyTo)?.user_name}
                    </span>
                  </p>
                  <button 
                    type="button" 
                    onClick={cancelReply} 
                    className="text-xs text-gray-500 hover:text-gray-700 mt-1"
                  >
                    Cancel Reply
                  </button>
                </div>
              )}

              {/* Comment Input */}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full text-black p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows="4"
                maxLength="1000"
                disabled={submitting}
              />
              
              {/* Form Footer */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{newComment.length}/1000 characters</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCommentForm(false);
                      setNewComment('');
                      setReplyTo(null);
                    }}
                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6dc1c9] text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={submitting || newComment.length < 3 || newComment.length > 1000}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comments...</p>
        </div>
      ) : organizedComments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            No comments yet
          </h4>
          <p className="text-gray-600 mb-6">
            Be the first to share your thoughts on this article!
          </p>
          {!showCommentForm && (
            <button
              onClick={() => setShowCommentForm(true)}
              className="bg-[#6dc1c9] text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Write First Comment
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {organizedComments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              {/* Main Comment */}
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  comment.is_admin_comment 
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300' 
                    : 'bg-gradient-to-br from-teal-100 to-blue-100'
                }`}>
                  {comment.is_admin_comment ? (
                    <Shield className="w-5 h-5 text-blue-600" />
                  ) : (
                    <User className="w-5 h-5 text-[#6dc1c9]" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className={`font-semibold ${
                      comment.is_admin_comment ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {comment.user_name}
                      {comment.is_admin_comment && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      )}
                    </h5>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(comment.created_at)}
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl mb-3 ${
                    comment.is_admin_comment 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <p className="text-gray-700 leading-relaxed">
                      {comment.comment_text}
                    </p>
                  </div>
                  
                  {userAuth && !comment.is_admin_comment && (
                    <button
                      onClick={() => handleReply(comment.id, comment.user_name)}
                      className="text-[#6dc1c9] hover:text-teal-700 text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </button>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-14 mt-4 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className={`flex gap-3 p-4 rounded-lg ${
                      reply.is_admin_comment 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        reply.is_admin_comment 
                          ? 'bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300' 
                          : 'bg-gradient-to-br from-blue-100 to-purple-100'
                      }`}>
                        {reply.is_admin_comment ? (
                          <Shield className="w-4 h-4 text-blue-600" />
                        ) : (
                          <User className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h6 className={`font-medium text-sm ${
                            reply.is_admin_comment ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {reply.user_name}
                            {reply.is_admin_comment && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Shield className="w-2.5 h-2.5 mr-1" />
                                Admin
                              </span>
                            )}
                          </h6>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(reply.created_at)}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {reply.comment_text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}