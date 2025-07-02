import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/ApiService';

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
    isHost: boolean;
    hourlyRate?: number;
    rating?: number;
  };
  type: 'image' | 'video' | 'carousel';
  content: string[];
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  timestamp: Date;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  isTrending?: boolean;
}

const FeedScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await ApiService.getFeed(pageNum);
      
      if (refresh || pageNum === 1) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      
      setPage(pageNum);
    } catch (error) {
      Alert.alert('Error', 'Failed to load feed');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadFeed(1, true);
  };

  const handleLike = async (postId: string) => {
    try {
      await ApiService.likePost(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleSave = async (postId: string) => {
    try {
      await ApiService.savePost(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isSaved: !post.isSaved,
              saves: post.isSaved ? post.saves - 1 : post.saves + 1
            }
          : post
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to save post');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return 'now';
  };

  const renderPost = (post: Post) => (
    <View key={post.id} style={[styles.postContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.userInfo}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={[styles.displayName, { color: theme.colors.text }]}>
                {post.user.displayName}
              </Text>
              {post.user.isVerified && (
                <Icon name="check-circle" size={16} color={theme.colors.primary} />
              )}
              {post.isTrending && (
                <View style={[styles.trendingBadge, { backgroundColor: '#FF6B35' }]}>
                  <Icon name="trending-up" size={12} color="#FFFFFF" />
                  <Text style={styles.trendingText}>HOT</Text>
                </View>
              )}
            </View>
            <View style={styles.postMeta}>
              <Text style={[styles.username, { color: theme.colors.textSecondary }]}>
                @{post.user.username}
              </Text>
              <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
                • {getTimeAgo(post.timestamp)}
              </Text>
              {post.user.isHost && post.user.hourlyRate && (
                <Text style={[styles.rate, { color: theme.colors.textSecondary }]}>
                  • ${post.user.hourlyRate}/hr
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-horizontal" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Image source={{ uri: post.content[0] }} style={styles.postImage} />
        {post.type === 'carousel' && (
          <View style={styles.carouselIndicator}>
            <Text style={styles.carouselText}>1/{post.content.length}</Text>
          </View>
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleLike(post.id)}
            style={styles.actionButton}
          >
            <Icon
              name="heart"
              size={24}
              color={post.isLiked ? theme.colors.primary : theme.colors.textSecondary}
              style={post.isLiked ? { transform: [{ scale: 1.1 }] } : {}}
            />
            <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
              {formatNumber(post.likes)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="message-circle" size={24} color={theme.colors.textSecondary} />
            <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
              {formatNumber(post.comments)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={24} color={theme.colors.textSecondary} />
            <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
              {formatNumber(post.shares)}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => handleSave(post.id)}>
          <Icon
            name="bookmark"
            size={24}
            color={post.isSaved ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Post Caption */}
      <View style={styles.postCaption}>
        <Text style={[styles.captionText, { color: theme.colors.text }]}>
          <Text style={styles.captionUsername}>{post.user.displayName}</Text>
          {' '}
          {post.caption}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#000000', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuButton}>
              <Icon name="menu" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <Icon name="heart" size={32} color={theme.colors.primary} />
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              The Club
            </Text>
          </View>
          <TouchableOpacity style={styles.chatButton}>
            <Icon name="message-circle" size={24} color={theme.colors.textSecondary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Stories Section */}
        <View style={styles.storiesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.addStoryButton}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.addStoryGradient}
              >
                <Icon name="plus" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.storyLabel, { color: theme.colors.textSecondary }]}>
                Your Story
              </Text>
            </TouchableOpacity>
            
            {/* Mock stories */}
            {[1, 2, 3, 4, 5].map((index) => (
              <TouchableOpacity key={index} style={styles.storyItem}>
                <LinearGradient
                  colors={['#8B5CF6', '#A855F7']}
                  style={styles.storyGradient}
                >
                  <Image
                    source={{ uri: `https://picsum.photos/60/60?random=${index}` }}
                    style={styles.storyImage}
                  />
                </LinearGradient>
                <Text style={[styles.storyLabel, { color: theme.colors.textSecondary }]}>
                  User {index}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Posts */}
        <View style={styles.postsContainer}>
          {posts.map(renderPost)}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chatButton: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  scrollView: {
    flex: 1,
  },
  storiesContainer: {
    paddingVertical: 16,
  },
  addStoryButton: {
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 12,
  },
  addStoryGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  storyGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000000',
  },
  storyLabel: {
    fontSize: 12,
    fontWeight: '500',
    width: 64,
    textAlign: 'center',
  },
  postsContainer: {
    paddingHorizontal: 16,
  },
  postContainer: {
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  trendingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 14,
  },
  rate: {
    fontSize: 14,
  },
  moreButton: {
    padding: 8,
  },
  postContent: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: width * 1.25,
    resizeMode: 'cover',
  },
  carouselIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  carouselText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  postCaption: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
  },
});

export default FeedScreen;