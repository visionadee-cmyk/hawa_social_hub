import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import type { Post } from '../types';

const POSTS_COLLECTION = 'posts';

export const postsService = {
  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const now = new Date();
    const newPost = {
      ...post,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, POSTS_COLLECTION), newPost);
    return {
      id: docRef.id,
      ...newPost,
    } as Post;
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
