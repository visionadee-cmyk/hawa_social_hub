import { useState, useEffect } from 'react';
import { isDemoMode } from '../config';
import { demoPosts } from '../services/demo';
import { postsService } from '../services/posts';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Eye, MessageCircle, Share2, Heart, Trash2, Edit } from 'lucide-react';
import type { Post } from '../types';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      if (isDemoMode) {
        // Load posts from localStorage or use demo posts
        const storedPosts = JSON.parse(localStorage.getItem('demoPosts') || '[]');
        if (storedPosts.length > 0) {
          setPosts(storedPosts as Post[]);
        } else {
          setPosts(demoPosts as Post[]);
        }
      } else {
        // In production, load from Firestore
        try {
          if (user) {
            const userPosts = await postsService.getPostsByUser(user.uid);
            setPosts(userPosts);
          }
        } catch (error) {
          console.error('Error loading posts:', error);
          setPosts([]);
        }
      }
      setLoading(false);
    };

    loadPosts();
  }, [user]);

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const handleDeletePost = async (postId: string) => {
    if (isDemoMode) {
      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('demoPosts', JSON.stringify(updatedPosts));
    } else {
      try {
        await postsService.deletePost(postId);
        setPosts(posts.filter(p => p.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const getPostMetrics = (post: Post) => {
    // In demo mode, return simulated metrics
    return {
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 50) + 5,
      shares: Math.floor(Math.random() * 30) + 2,
      views: Math.floor(Math.random() * 5000) + 500,
    };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600">Manage your social media posts</p>
        </div>
      </div>

      {isDemoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> Posts are stored in your browser's local storage.
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['all', 'published', 'scheduled', 'draft'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 font-medium transition ${
              filter === tab
                ? 'border-b-2 border-hawa-blue text-hawa-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const metrics = getPostMetrics(post);
            const media = post.media[0];

            return (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Media Preview */}
                <div className="aspect-square bg-gray-100 relative">
                  {media?.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  ) : media?.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" controls />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No media
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : post.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </div>

                  {/* Platform Badges */}
                  <div className="absolute top-3 right-3 flex gap-1">
                    {post.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-xs font-bold"
                      >
                        {platform === 'facebook' ? 'f' : platform === 'instagram' ? 'IG' : 'TT'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Post Details */}
                <div className="p-4">
                  <p className="text-gray-900 text-sm line-clamp-2 mb-3">{post.caption}</p>

                  {/* Metrics */}
                  {post.status === 'published' && (
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {metrics.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {metrics.comments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {metrics.shares}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {metrics.views}
                      </div>
                    </div>
                  )}

                  {/* Scheduled Date */}
                  {post.status === 'scheduled' && post.scheduledAt && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.scheduledAt).toLocaleDateString()} at{' '}
                      {new Date(post.scheduledAt).toLocaleTimeString()}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-hawa-blue transition">
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 transition ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
