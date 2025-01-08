import { FIREBASE_DB } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { Expense } from '../types/expense';

// Types
interface Trip {
  id?: string;
  place: string;
  country: string;
  userId: string;
  createdAt?: any;
}

// Trips
export const addTrip = async (tripData: Omit<Trip, 'id' | 'createdAt'>) => {
  try {
    const tripsRef = collection(FIREBASE_DB, 'trips');
    const newTrip = {
      ...tripData,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(tripsRef, newTrip);
    console.log('Trip added with ID:', docRef.id);
    return { id: docRef.id, ...newTrip };
  } catch (error: any) {
    console.error('Error adding trip:', error);
    throw new Error(`Failed to add trip: ${error.message}`);
  }
};

export const getUserTrips = async (userId: string) => {
  try {
    const tripsRef = collection(FIREBASE_DB, 'trips');
    const q = query(tripsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error: any) {
    throw new Error(`Failed to get trips: ${error.message}`);
  }
};

export const deleteTrip = async (tripId: string) => {
  try {
    await deleteDoc(doc(FIREBASE_DB, 'trips', tripId));
  } catch (error: any) {
    throw new Error(`Failed to delete trip: ${error.message}`);
  }
};

// Expenses
export const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
  try {
    const expensesRef = collection(FIREBASE_DB, 'expenses');
    const newExpense = {
      ...expenseData,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(expensesRef, newExpense);
    return { id: docRef.id, ...newExpense };
  } catch (error: any) {
    throw new Error(`Failed to add expense: ${error.message}`);
  }
};

export const getTripExpenses = async (tripId: string): Promise<Expense[]> => {
  try {
    const expensesRef = collection(FIREBASE_DB, 'expenses');
    const q = query(expensesRef, where('tripId', '==', tripId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Expense[];
  } catch (error: any) {
    throw new Error(`Failed to get expenses: ${error.message}`);
  }
};

export const deleteExpense = async (expenseId: string) => {
  try {
    await deleteDoc(doc(FIREBASE_DB, 'expenses', expenseId));
  } catch (error: any) {
    throw new Error(`Failed to delete expense: ${error.message}`);
  }
};