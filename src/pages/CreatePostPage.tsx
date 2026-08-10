import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../contexts/BusinessContext';
import { useAuth } from '../contexts/AuthContext';
import { isDemoMode } from '../config';
import { validateCaption, validateHashtags } from '../utils/validators';
import { extractHashtags } from '../utils/formatters';
import { postsService } from '../services/posts';
import { Loader2, Upload, X, Calendar, Send, Eye, Hash, AtSign, Image as ImageIcon, Video, Check } from 'lucide-react';
import type { SocialPlatform, MediaItem } from '../types';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { socialAccounts } = useBusiness();
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<SocialPlatform | 'all'>('all');

  const availablePlatforms = socialAccounts.map(a => a.platform);

  const handlePlatformToggle = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSelectAll = () => {
    if (selectedPlatforms.length === availablePlatforms.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(availablePlatforms);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMedia: MediaItem = {
          id: `media-${Date.now()}-${Math.random()}`,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: event.target?.result as string,
          size: file.size,
          format: file.type.split('/')[1],
          order: media.length,
        };
        setMedia(prev => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (mediaId: string) => {
    setMedia(prev => prev.filter(m => m.id !== mediaId));
  };

  const handleCaptionChange = (value: string) => {
    setCaption(value);
    const extractedHashtags = extractHashtags(value);
    setHashtags(extractedHashtags);
  };

  const handlePublish = async () => {
    setError(null);

    if (media.length === 0) {
      setError('Please add at least one image or video');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    const captionValidation = validateCaption(caption);
    if (!captionValidation.valid) {
      setError(captionValidation.error || 'Invalid caption');
      return;
    }

    const hashtagValidation = validateHashtags(hashtags);
    if (!hashtagValidation.valid) {
      setError(hashtagValidation.error || 'Invalid hashtags');
      return;
    }

    if (isScheduling && (!scheduledDate || !scheduledTime)) {
      setError('Please select both date and time for scheduling');
      return;
    }

    setLoading(true);
    try {
      // In demo mode, simulate publishing and store post in localStorage
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create post object
        const newPost = {
          id: `demo-post-${Date.now()}`,
          businessId: 'demo-business-1',
          createdBy: 'demo-user-1',
          caption,
          hashtags,
          mentions,
          media: media.map(m => ({
            id: m.id,
            type: m.type as 'image' | 'video',
            url: m.url,
            thumbnailUrl: m.url,
            width: 800,
            height: 600,
            size: m.size,
            format: m.format,
            order: m.order,
          })),
          platforms: selectedPlatforms,
          status: (isScheduling ? 'scheduled' : 'published') as 'draft' | 'scheduled' | 'publishing' | 'published' | 'partially_published' | 'failed' | 'cancelled',
          publishedAt: isScheduling ? undefined : new Date(),
          scheduledAt: isScheduling ? new Date(`${scheduledDate!.toISOString().split('T')[0]}T${scheduledTime}`) : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Store in localStorage
        const existingPosts = JSON.parse(localStorage.getItem('demoPosts') || '[]');
        localStorage.setItem('demoPosts', JSON.stringify([newPost, ...existingPosts]));
        
        navigate('/posts');
      } else {
        // Production: Create post in Firestore
        if (!user) {
          setError('You must be logged in to create posts');
          return;
        }

        const postData: any = {
          businessId: user.id, // Using user ID as business ID for now
          createdBy: user.id,
          caption,
          hashtags: hashtags || [],
          mentions: mentions || [],
          media: media.map(m => ({
            id: m.id || '',
            type: m.type || 'image',
            url: m.url || '',
            thumbnailUrl: m.thumbnailUrl || m.url || '',
            width: m.width || 800,
            height: m.height || 600,
            size: m.size || 0,
            format: m.format || '',
            order: m.order || 0,
          })),
          platforms: selectedPlatforms || [],
          status: (isScheduling ? 'scheduled' : 'published') as 'draft' | 'scheduled' | 'publishing' | 'published' | 'partially_published' | 'failed' | 'cancelled',
        };

        if (isScheduling) {
          postData.publishedAt = null;
          postData.scheduledAt = new Date(`${scheduledDate!.toISOString().split('T')[0]}T${scheduledTime}`);
        } else {
          postData.publishedAt = new Date();
          // Don't include scheduledAt when not scheduling
        }

        const newPost = await postsService.createPost(postData);

        navigate('/posts');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90';
      case 'tiktok':
        return 'bg-black hover:bg-gray-800';
    }
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook':
        return 'f';
      case 'instagram':
        return 'IG';
      case 'tiktok':
        return 'TT';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-600">Create once, publish everywhere</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {isDemoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> Publishing is simulated. In production mode, your posts will be published to actual social media platforms.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Content */}
        <div className="space-y-6">
          {/* Platform Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Select Platforms</h2>
              <button
                onClick={handleSelectAll}
                className="text-sm text-hawa-blue hover:text-hawa-blue-dark"
              >
                {selectedPlatforms.length === availablePlatforms.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {availablePlatforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform);
                return (
                  <button
                    key={platform}
                    onClick={() => handlePlatformToggle(platform)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isSelected
                        ? getPlatformColor(platform) + ' text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="font-bold">{getPlatformIcon(platform)}</span>
                    <span className="capitalize">{platform}</span>
                    {isSelected && <Check className="w-4 h-4 ml-1" />}
                  </button>
                );
              })}
            </div>

            {availablePlatforms.length === 0 && (
              <p className="text-sm text-gray-500 mt-4">
                No social accounts connected.{' '}
                <button onClick={() => navigate('/social-accounts')} className="text-hawa-blue hover:underline">
                  Connect accounts
                </button>
              </p>
            )}
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Media</h2>

            {media.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop images or videos here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-hawa-blue text-white rounded-lg hover:bg-hawa-blue-dark transition cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Browse Files
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {media.map((item) => (
                  <div key={item.id} className="relative group">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt="Upload"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-48 object-cover rounded-lg"
                        controls
                      />
                    )}
                    <button
                      onClick={() => handleRemoveMedia(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {item.type === 'video' ? <Video className="w-3 h-3 inline" /> : <ImageIcon className="w-3 h-3 inline" />}
                    </div>
                  </div>
                ))}
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Add More</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Caption Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Caption</h2>
              <span className="text-sm text-gray-500">{caption.length}/2200</span>
            </div>

            <textarea
              value={caption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              placeholder="Write your caption here... Use # for hashtags and @ for mentions"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none resize-none"
            />

            <div className="flex items-center gap-2 mt-4">
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Hash className="w-4 h-4" />
                <span className="text-sm">Hashtags</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <AtSign className="w-4 h-4" />
                <span className="text-sm">Mentions</span>
              </button>
            </div>

            {hashtags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <span key={index} className="bg-hawa-blue/10 text-hawa-blue px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Scheduling */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="schedule"
                checked={isScheduling}
                onChange={(e) => setIsScheduling(e.target.checked)}
                className="w-4 h-4 text-hawa-blue rounded"
              />
              <label htmlFor="schedule" className="font-semibold text-gray-900">
                Schedule Post
              </label>
            </div>

            {isScheduling && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={scheduledDate ? scheduledDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setScheduledDate(new Date(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Preview</h2>
              <div className="flex gap-2">
                {selectedPlatforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setPreviewTab(platform)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      previewTab === platform
                        ? getPlatformColor(platform) + ' text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getPlatformIcon(platform)}
                  </button>
                ))}
              </div>
            </div>

            {media.length > 0 ? (
              <div className="space-y-4">
                {/* Media Preview */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {media[0].type === 'image' ? (
                    <img src={media[0].url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <video src={media[0].url} className="w-full h-full object-cover" controls />
                  )}
                </div>

                {/* Caption Preview */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{caption}</p>
                  {hashtags.length > 0 && (
                    <p className="text-hawa-blue mt-2">{hashtags.join(' ')}</p>
                  )}
                </div>

                {/* Platform Info */}
                <div className="text-sm text-gray-500">
                  Publishing to: {selectedPlatforms.map(p => p).join(', ')}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Add media to see preview</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePublish}
              disabled={loading || media.length === 0 || selectedPlatforms.length === 0}
              className="w-full bg-hawa-blue text-white py-3 rounded-lg font-medium hover:bg-hawa-blue-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isScheduling ? (
                <>
                  <Calendar className="w-5 h-5" />
                  Schedule Post
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Now
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
