'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Mail,
  ExternalLink,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Reply,
  Send,
  Shield
} from 'lucide-react';

export default function CommentManagement() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, approved, pending
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchComments();
  }, [filter, searchTerm, currentPage]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filter,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm
      });

      const response = await fetch(`/api/admin/comments?${params}`);
      const data = await response.json();

      if (response.ok) {
        setComments(data.comments || []);
        setTotalComments(data.total || 0);
        setTotalPages(data.totalPages || 1);
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
  };

  const handleApprove = async (commentId, currentStatus) => {
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment_id: commentId,
          is_approved: !currentStatus
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchComments(); // Refresh the list
        alert(`Comment ${!currentStatus ? 'approved' : 'rejected'} successfully!`);
      } else {
        alert(data.error || 'Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment? This will also delete all replies.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/comments?comment_id=${commentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        fetchComments(); // Refresh the list
        alert('Comment deleted successfully!');
      } else {
        alert(data.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const handleAdminReply = async (commentId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply');
      return;
    }

    if (replyText.length < 3 || replyText.length > 1000) {
      alert('Reply must be between 3 and 1000 characters');
      return;
    }

    try {
      setSubmittingReply(true);
      
      const comment = comments.find(c => c.id === commentId);
      
      const response = await fetch('/api/admin/comments/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment_id: commentId,
          reply_text: replyText.trim(),
          admin_name: 'Admin',
          admin_email: 'admin@mohitcomputers.com',
          blog_id: comment.blog_id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setReplyText('');
        setReplyingTo(null);
        fetchComments(); // Refresh the list
        alert('Reply posted successfully!');
      } else {
        alert(data.error || 'Failed to post reply');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Failed to post reply');
    } finally {
      setSubmittingReply(false);
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

  const getStatusBadge = (comment) => {
    if (comment.is_admin_comment) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Shield className="w-3 h-3 mr-1" />
          Admin Comment
        </span>
      );
    }
    
    if (comment.is_approved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Eye className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comment Management</h1>
            <p className="text-gray-600">Manage and moderate user comments</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Total Comments: {totalComments}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              All Comments
            </button>
            <button
              onClick={() => {
                setFilter('approved');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Check className="w-4 h-4 inline mr-2" />
              Approved
            </button>
            <button
              onClick={() => {
                setFilter('pending');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Pending
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search comments..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Comments will appear here when users start engaging with your blog posts.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Comment Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {comment.is_admin_comment ? (
                          <Shield className="w-5 h-5 text-blue-600" />
                        ) : (
                          <User className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{comment.user_name}</h4>
                          {getStatusBadge(comment)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {comment.user_email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(comment.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            Blog ID: {comment.blog_id}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 leading-relaxed">{comment.comment_text}</p>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-blue-900 mb-3">Reply as Admin</h5>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your admin reply..."
                          className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows="3"
                          maxLength="1000"
                          disabled={submittingReply}
                        />
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-500">{replyText.length}/1000 characters</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              disabled={submittingReply}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAdminReply(comment.id)}
                              disabled={submittingReply || replyText.length < 3 || replyText.length > 1000}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {submittingReply ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Posting...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Post Reply
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    {!comment.is_admin_comment && (
                      <>
                        <button
                          onClick={() => handleApprove(comment.id, comment.is_approved)}
                          className={`p-2 rounded-lg transition-colors ${
                            comment.is_approved
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title={comment.is_approved ? 'Reject comment' : 'Approve comment'}
                        >
                          {comment.is_approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if (replyingTo === comment.id) {
                              setReplyingTo(null);
                              setReplyText('');
                            } else {
                              setReplyingTo(comment.id);
                              setReplyText('');
                            }
                          }}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Reply to comment"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalComments)} of {totalComments} comments
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}