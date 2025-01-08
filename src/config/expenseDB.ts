import { FIREBASE_DB } from '../config/firebase';
import { 
  collection, 
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
  runTransaction
} from 'firebase/firestore';

interface Expense {
  id?: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  tripId: string;
  userId: string;
  createdAt?: any;
}

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

export const getTripExpenses = async (tripId: string) => {
  try {
    const expensesRef = collection(FIREBASE_DB, 'expenses');
    const q = query(expensesRef, where('tripId', '==', tripId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error: any) {
    throw new Error(`Failed to get expenses: ${error.message}`);
  }
};

export const deleteExpense = async (expenseId: string) => {
  try {
    console.log('Starting delete transaction for expense:', expenseId);
    await runTransaction(FIREBASE_DB, async (transaction) => {
      const expenseRef = doc(FIREBASE_DB, 'expenses', expenseId);
      transaction.delete(expenseRef);
    });
    console.log('Delete transaction completed successfully');
    return expenseId;
  } catch (error) {
    console.error('Delete transaction failed:', error);
    throw error;
  }
};