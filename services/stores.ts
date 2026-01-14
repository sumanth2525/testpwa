// Zustand stores for state management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, TaskCategory, TaskPriority } from '../types';
import { Note, NoteCategory, NoteColor } from '../types';
import { Transaction, TransactionType, TransactionCategory } from '../types';
import { User, UserPreferences } from '../types';
import { tempStorage } from '../config/firebase';

// Custom storage adapter for Zustand
const customStorage = {
  getItem: (name: string) => {
    return tempStorage.getItem<string>(name);
  },
  setItem: (name: string, value: string) => {
    tempStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    tempStorage.removeItem(name);
  },
};

// Task Store
interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  getTasksByCategory: (category: TaskCategory) => Task[];
  getOverdueTasks: () => Task[];
  getUpcomingTasks: (days?: number) => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      toggleTaskComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: new Date() }
              : task
          ),
        }));
      },
      
      getTasksByCategory: (category) => {
        return get().tasks.filter((task) => task.category === category);
      },
      
      getOverdueTasks: () => {
        const now = new Date();
        return get().tasks.filter(
          (task) => !task.completed && task.dueDate && task.dueDate < now
        );
      },
      
      getUpcomingTasks: (days = 7) => {
        const now = new Date();
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return get().tasks.filter(
          (task) =>
            !task.completed &&
            task.dueDate &&
            task.dueDate >= now &&
            task.dueDate <= futureDate
        );
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);

// Note Store
interface NoteStore {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  getNotesByCategory: (category: NoteCategory) => Note[];
  getPinnedNotes: () => Note[];
  searchNotes: (query: string) => Note[];
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      
      addNote: (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          notes: [...state.notes, newNote],
        }));
      },
      
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        }));
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },
      
      togglePinNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() }
              : note
          ),
        }));
      },
      
      getNotesByCategory: (category) => {
        return get().notes.filter((note) => note.category === category);
      },
      
      getPinnedNotes: () => {
        return get().notes.filter((note) => note.isPinned);
      },
      
      searchNotes: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return get().notes.filter(
          (note) =>
            note.title.toLowerCase().includes(lowercaseQuery) ||
            note.content.toLowerCase().includes(lowercaseQuery) ||
            note.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
        );
      },
    }),
    {
      name: 'note-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);

// Transaction Store
interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByCategory: (category: TransactionCategory) => Transaction[];
  getMonthlyTransactions: (year: number, month: number) => Transaction[];
  getTotalIncome: (year?: number, month?: number) => number;
  getTotalExpenses: (year?: number, month?: number) => number;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              ? { ...transaction, ...updates, updatedAt: new Date() }
              : transaction
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        }));
      },
      
      getTransactionsByType: (type) => {
        return get().transactions.filter((transaction) => transaction.type === type);
      },
      
      getTransactionsByCategory: (category) => {
        return get().transactions.filter((transaction) => transaction.category === category);
      },
      
      getMonthlyTransactions: (year, month) => {
        return get().transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
        });
      },
      
      getTotalIncome: (year, month) => {
        let transactions = get().transactions.filter((t) => t.type === TransactionType.INCOME);
        
        if (year !== undefined && month !== undefined) {
          transactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
          });
        }
        
        return transactions.reduce((total, transaction) => total + transaction.amount, 0);
      },
      
      getTotalExpenses: (year, month) => {
        let transactions = get().transactions.filter((t) => t.type === TransactionType.EXPENSE);
        
        if (year !== undefined && month !== undefined) {
          transactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
          });
        }
        
        return transactions.reduce((total, transaction) => total + transaction.amount, 0);
      },
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);

// User Store
interface UserStore {
  user: User | null;
  preferences: UserPreferences;
  setUser: (user: User) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  logout: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  notifications: {
    taskReminders: true,
    dueDateAlerts: true,
    recurringTransactionAlerts: true,
    pushNotifications: true,
  },
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      preferences: defaultPreferences,
      
      setUser: (user) => {
        set({ user });
      },
      
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        }));
      },
      
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);
