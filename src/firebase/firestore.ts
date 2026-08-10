import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { getFirebaseFirestore } from './index';
import type { Business, TeamMember, SocialAccount, Post, PostVariant, PublishingJob, AnalyticsSnapshot, PostAnalytics } from '../types';

export const db = getFirebaseFirestore();

export const firestoreService = {
  // Business operations
  async getBusiness(businessId: string): Promise<Business | null> {
    const docRef = doc(db, 'businesses', businessId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Business) : null;
  },

  async createBusiness(business: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'businesses'), {
      ...business,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async updateBusiness(businessId: string, data: Partial<Business>): Promise<void> {
    const docRef = doc(db, 'businesses', businessId);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
  },

  async getUserBusinesses(userId: string): Promise<Business[]> {
    const q = query(
      collection(db, 'businesses'),
      where('ownerId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Business);
  },

  // Team member operations
  async getTeamMembers(businessId: string): Promise<TeamMember[]> {
    const q = query(
      collection(db, 'teamMembers'),
      where('businessId', '==', businessId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as TeamMember);
  },

  async addTeamMember(member: Omit<TeamMember, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'teamMembers'), {
      ...member,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async updateTeamMember(memberId: string, data: Partial<TeamMember>): Promise<void> {
    const docRef = doc(db, 'teamMembers', memberId);
    await updateDoc(docRef, data);
  },

  async removeTeamMember(memberId: string): Promise<void> {
    await deleteDoc(doc(db, 'teamMembers', memberId));
  },

  // Social account operations
  async getSocialAccounts(businessId: string): Promise<SocialAccount[]> {
    const q = query(
      collection(db, 'socialAccounts'),
      where('businessId', '==', businessId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as SocialAccount);
  },

  async getSocialAccount(accountId: string): Promise<SocialAccount | null> {
    const docRef = doc(db, 'socialAccounts', accountId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as SocialAccount) : null;
  },

  async createSocialAccount(account: Omit<SocialAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'socialAccounts'), {
      ...account,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async updateSocialAccount(accountId: string, data: Partial<SocialAccount>): Promise<void> {
    const docRef = doc(db, 'socialAccounts', accountId);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
  },

  async deleteSocialAccount(accountId: string): Promise<void> {
    await deleteDoc(doc(db, 'socialAccounts', accountId));
  },

  // Post operations
  async getPosts(businessId: string, constraints: QueryConstraint[] = []): Promise<Post[]> {
    const q = query(
      collection(db, 'posts'),
      where('businessId', '==', businessId),
      ...constraints
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Post);
  },

  async getPost(postId: string): Promise<Post | null> {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Post) : null;
  },

  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...post,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async updatePost(postId: string, data: Partial<Post>): Promise<void> {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
  },

  async deletePost(postId: string): Promise<void> {
    await deleteDoc(doc(db, 'posts', postId));
  },

  // Post variant operations
  async getPostVariants(postId: string): Promise<PostVariant[]> {
    const q = query(
      collection(db, 'postVariants'),
      where('postId', '==', postId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PostVariant);
  },

  async createPostVariant(variant: Omit<PostVariant, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'postVariants'), {
      ...variant,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async updatePostVariant(variantId: string, data: Partial<PostVariant>): Promise<void> {
    const docRef = doc(db, 'postVariants', variantId);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
  },

  // Publishing job operations
  async getPublishingJobs(businessId: string, constraints: QueryConstraint[] = []): Promise<PublishingJob[]> {
    const q = query(
      collection(db, 'publishingJobs'),
      where('businessId', '==', businessId),
      ...constraints
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PublishingJob);
  },

  async createPublishingJob(job: Omit<PublishingJob, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'publishingJobs'), {
      ...job,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async updatePublishingJob(jobId: string, data: Partial<PublishingJob>): Promise<void> {
    const docRef = doc(db, 'publishingJobs', jobId);
    await updateDoc(docRef, data);
  },

  // Analytics operations
  async getAnalyticsSnapshots(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsSnapshot[]> {
    const q = query(
      collection(db, 'analyticsSnapshots'),
      where('businessId', '==', businessId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as AnalyticsSnapshot);
  },

  async createAnalyticsSnapshot(snapshot: Omit<AnalyticsSnapshot, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'analyticsSnapshots'), {
      ...snapshot,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getPostAnalytics(postId: string): Promise<PostAnalytics[]> {
    const q = query(
      collection(db, 'postAnalytics'),
      where('postId', '==', postId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PostAnalytics);
  },

  async createPostAnalytics(analytics: Omit<PostAnalytics, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'postAnalytics'), {
      ...analytics,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async updatePostAnalytics(analyticsId: string, data: Partial<PostAnalytics>): Promise<void> {
    const docRef = doc(db, 'postAnalytics', analyticsId);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
  },

  // Real-time listeners
  subscribeToPosts(businessId: string, callback: (posts: Post[]) => void) {
    const q = query(
      collection(db, 'posts'),
      where('businessId', '==', businessId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => doc.data() as Post);
      callback(posts);
    });
  },

  subscribeToPublishingJobs(businessId: string, callback: (jobs: PublishingJob[]) => void) {
    const q = query(
      collection(db, 'publishingJobs'),
      where('businessId', '==', businessId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => doc.data() as PublishingJob);
      callback(jobs);
    });
  },
};
