import React, { useState } from 'react';
import { ArrowLeft, Heart, Plus, MoreVertical, Edit3, Trash2, Folder, Image, X, Check } from 'lucide-react';

interface WishlistItem {
  id: string;
  type: 'post' | 'profile';
  content: {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    timestamp: Date;
  };
}

interface Album {
  id: string;
  name: string;
  items: WishlistItem[];
  createdAt: Date;
  coverImage?: string;
}

interface WishlistProps {
  onBack: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onBack }) => {
  const [activeView, setActiveView] = useState<'albums' | 'items' | 'create-album'>('albums');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Mock data
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: '1',
      name: 'Looks',
      items: [],
      createdAt: new Date(Date.now() - 86400000),
      coverImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Quotes',
      items: [],
      createdAt: new Date(Date.now() - 172800000),
      coverImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  ]);

  const [wishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      type: 'post',
      content: {
        id: 'post1',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
        title: 'Finding peace in the little moments ✨',
        subtitle: 'by @sophia_rose',
        timestamp: new Date(Date.now() - 3600000)
      }
    },
    {
      id: '2',
      type: 'post',
      content: {
        id: 'post2',
        image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
        title: 'Behind the scenes of my cozy reading corner 📚',
        subtitle: 'by @emma_night',
        timestamp: new Date(Date.now() - 7200000)
      }
    },
    {
      id: '3',
      type: 'profile',
      content: {
        id: 'user1',
        image: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
        title: 'Luna Star',
        subtitle: 'Creative soul & art enthusiast',
        timestamp: new Date(Date.now() - 10800000)
      }
    },
    {
      id: '4',
      type: 'post',
      content: {
        id: 'post3',
        image: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
        title: 'Late night art session 🎨',
        subtitle: 'by @luna_star',
        timestamp: new Date(Date.now() - 14400000)
      }
    },
    {
      id: '5',
      type: 'post',
      content: {
        id: 'post4',
        image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
        title: 'Morning motivation from my home office 💪',
        subtitle: 'by @marcus_moon',
        timestamp: new Date(Date.now() - 18000000)
      }
    },
    {
      id: '6',
      type: 'post',
      content: {
        id: 'post5',
        image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
        title: 'Yoga and meditation have changed my life 🧘‍♀️',
        subtitle: 'by @zara_dreams',
        timestamp: new Date(Date.now() - 21600000)
      }
    }
  ]);

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) return;
    
    const newAlbum: Album = {
      id: Date.now().toString(),
      name: newAlbumName.trim(),
      items: [],
      createdAt: new Date()
    };
    
    setAlbums(prev => [newAlbum, ...prev]);
    setNewAlbumName('');
    setShowCreateAlbum(false);
  };

  const handleRenameAlbum = (album: Album, newName: string) => {
    setAlbums(prev => prev.map(a => 
      a.id === album.id ? { ...a, name: newName } : a
    ));
    setEditingAlbum(null);
  };

  const handleDeleteAlbum = (albumId: string) => {
    setAlbums(prev => prev.filter(a => a.id !== albumId));
    if (selectedAlbum?.id === albumId) {
      setSelectedAlbum(null);
      setActiveView('albums');
    }
  };

  const handleMoveToAlbum = (albumId: string) => {
    if (selectedItems.size === 0) return;
    
    // In a real app, this would move items to the selected album
    console.log('Moving items to album:', albumId, Array.from(selectedItems));
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Albums View
  if (activeView === 'albums') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <h1 className="text-xl font-bold text-white">Wishlist</h1>
              <button
                onClick={() => setShowCreateAlbum(true)}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <Plus className="w-4 h-4 text-purple-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6">
          {/* All Items Album */}
          <button
            onClick={() => {
              setSelectedAlbum(null);
              setActiveView('items');
            }}
            className="w-full bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 mb-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white fill-current" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg">All Saved Items</h3>
                <p className="text-purple-200/80 text-sm">{wishlistItems.length} items</p>
              </div>
            </div>
          </button>

          {/* Custom Albums */}
          <div className="space-y-3">
            {albums.map((album) => (
              <div key={album.id} className="relative group">
                <button
                  onClick={() => {
                    setSelectedAlbum(album);
                    setActiveView('items');
                  }}
                  className="w-full bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-purple-500/30">
                      {album.coverImage ? (
                        <img
                          src={album.coverImage}
                          alt={album.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-600/20 flex items-center justify-center">
                          <Folder className="w-8 h-8 text-purple-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{album.name}</h3>
                      <p className="text-purple-200/80 text-sm">
                        {album.items.length} items • Created {formatDate(album.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Album Options */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <button className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                    {/* Dropdown would go here */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {albums.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-purple-300" />
              </div>
              <p className="text-purple-200/80 mb-2">No custom albums yet</p>
              <p className="text-purple-300/60 text-sm">Create albums to organize your saved items</p>
            </div>
          )}
        </div>

        {/* Create Album Modal */}
        {showCreateAlbum && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-sm">
              <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
                <h3 className="text-xl font-bold text-white">Create Album</h3>
                <button
                  onClick={() => setShowCreateAlbum(false)}
                  className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
                >
                  <X className="w-4 h-4 text-purple-300" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Album Name</label>
                    <input
                      type="text"
                      value={newAlbumName}
                      onChange={(e) => setNewAlbumName(e.target.value)}
                      placeholder="Enter album name..."
                      maxLength={30}
                      className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                    />
                    <p className="text-purple-300/60 text-xs mt-1">{newAlbumName.length}/30</p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateAlbum(false)}
                    className="flex-1 bg-black/40 border border-purple-500/30 text-purple-200 py-3 rounded-2xl font-medium hover:bg-black/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAlbum}
                    disabled={!newAlbumName.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Items View
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('albums')}
              className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold text-white">
              {selectedAlbum ? selectedAlbum.name : 'All Saved Items'}
            </h1>
            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className="text-purple-300 hover:text-purple-200 text-sm font-medium"
            >
              {isSelectionMode ? 'Done' : 'Select'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Selection Actions */}
        {isSelectionMode && selectedItems.size > 0 && (
          <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{selectedItems.size} selected</span>
              <div className="flex space-x-2">
                <button className="bg-purple-600/20 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-xl text-sm hover:bg-purple-600/30 transition-colors">
                  Move to Album
                </button>
                <button className="bg-red-600/20 border border-red-500/30 text-red-300 px-3 py-1.5 rounded-xl text-sm hover:bg-red-600/30 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-purple-300" />
            </div>
            <p className="text-purple-200/80 mb-2">No saved items yet</p>
            <p className="text-purple-300/60 text-sm">Items you like or bookmark will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 group"
              >
                {/* Selection Checkbox */}
                {isSelectionMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={() => toggleItemSelection(item.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedItems.has(item.id)
                          ? 'bg-purple-600 border-purple-600'
                          : 'bg-black/60 border-white/60 hover:border-purple-400'
                      }`}
                    >
                      {selectedItems.has(item.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </button>
                  </div>
                )}

                {/* Item Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.content.image}
                    alt={item.content.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Item Info */}
                <div className="p-3">
                  <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">
                    {item.content.title}
                  </h3>
                  {item.content.subtitle && (
                    <p className="text-purple-200/80 text-xs mb-2">{item.content.subtitle}</p>
                  )}
                  <p className="text-purple-300/60 text-xs">
                    Saved {formatDate(item.content.timestamp)}
                  </p>
                </div>

                {/* Item Type Badge */}
                <div className="absolute top-2 right-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    item.type === 'post' ? 'bg-purple-600/80' : 'bg-blue-600/80'
                  }`}>
                    {item.type === 'post' ? (
                      <Image className="w-3 h-3 text-white" />
                    ) : (
                      <Heart className="w-3 h-3 text-white fill-current" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;