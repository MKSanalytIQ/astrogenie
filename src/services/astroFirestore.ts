import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { VedicKundli, ChatMessage, BirthDetails } from '../types/astrology';

export async function saveUserKundli(userId: string, kundli: VedicKundli): Promise<void> {
  const path = `users/${userId}/kundlis/${kundli.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'kundlis', kundli.id);
    await setDoc(docRef, {
      ...kundli,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserKundlis(userId: string): Promise<VedicKundli[]> {
  const path = `users/${userId}/kundlis`;
  try {
    const colRef = collection(db, 'users', userId, 'kundlis');
    const snapshot = await getDocs(colRef);
    const kundlis: VedicKundli[] = [];
    snapshot.forEach((d) => {
      kundlis.push(d.data() as VedicKundli);
    });
    return kundlis;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteUserKundli(userId: string, kundliId: string): Promise<void> {
  const path = `users/${userId}/kundlis/${kundliId}`;
  try {
    const docRef = doc(db, 'users', userId, 'kundlis', kundliId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveConsultationMessage(userId: string, message: ChatMessage, kundliId: string): Promise<void> {
  const path = `users/${userId}/consultations/${message.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'consultations', message.id);
    await setDoc(docRef, {
      ...message,
      userId,
      kundliId,
      createdAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserConsultations(userId: string): Promise<ChatMessage[]> {
  const path = `users/${userId}/consultations`;
  try {
    const colRef = collection(db, 'users', userId, 'consultations');
    const snapshot = await getDocs(colRef);
    const messages: ChatMessage[] = [];
    snapshot.forEach((d) => {
      messages.push(d.data() as ChatMessage);
    });
    return messages;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveUserProfile(
  userId: string,
  profile: {
    email: string;
    displayName: string;
    photoURL?: string;
    birthDetails?: BirthDetails;
    activeKundliId?: string;
  }
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      id: userId,
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(userId: string): Promise<any> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
