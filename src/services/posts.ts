import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import type { Post } from '../types';

const POSTS_COLLECTION = 'posts';

export const postsService = {
  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    console.log('[postsService] createPost called with:', JSON.stringify(post, null, 2));
    console.log('[postsService] db instance:', db);
    console.log('[postsService] POSTS_COLLECTION:', POSTS_COLLECTION);

    const now = new Date();
    const newPost = {
      ...post,
      createdAt: now,
      updatedAt: now,
    };

    console.log('[postsService] Final post object:', JSON.stringify(newPost, null, 2));

    try {
      const docRef = await addDoc(collection(db, POSTS_COLLECTION), newPost);
      console.log('[postsService] Document created with ID:', docRef.id);
      return {
        id: docRef.id,
        ...newPost,
      } as Post;
    } catch (error) {
      console.error('[postsService] Error creating post:', error);
      throw error;
    }
  },

  async getPostsByBusiness(businessId: string): Promise<Post[]> {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('businessId', '==', businessId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  },

  async getPostsByUser(userId: string): Promise<Post[]> {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  },

  async deletePost(postId: string): Promise<void> {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId));
  },

  async updatePost(postId: string, updates: Partial<Post>): Promise<void> {
    await updateDoc(doc(db, POSTS_COLLECTION, postId), {
      ...updates,
      updatedAt: new Date(),
    });
  },
};
