// Utility functions for the Life Productivity Hub
import { Task, Note, Transaction, ExportData, ImportResult } from '../types';

// Date utilities
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isOverdue = (date: Date): boolean => {
  const today = new Date();
  return date < today && !isToday(date);
};

export const getDaysUntilDue = (date: Date): number => {
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Task utilities
export const getTaskPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'urgent':
      return '#dc2626';
    case 'high':
      return '#ea580c';
    case 'medium':
      return '#d97706';
    case 'low':
      return '#16a34a';
    default:
      return '#6b7280';
  }
};

export const getTaskPriorityWeight = (priority: string): number => {
  switch (priority) {
    case 'urgent':
      return 4;
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    const priorityDiff = getTaskPriorityWeight(b.priority) - getTaskPriorityWeight(a.priority);
    if (priorityDiff !== 0) return priorityDiff;
    
    // If same priority, sort by due date
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    
    return 0;
  });
};

// Financial utilities
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const getMonthlyData = (transactions: Transaction[], year: number, month: number) => {
  const monthlyTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
  });

  const income = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    net: income - expenses,
    transactions: monthlyTransactions
  };
};

// Search utilities
export const searchTasks = (tasks: Task[], query: string): Task[] => {
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowercaseQuery) ||
    task.description?.toLowerCase().includes(lowercaseQuery) ||
    task.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const searchNotes = (notes: Note[], query: string): Note[] => {
  const lowercaseQuery = query.toLowerCase();
  return notes.filter(note =>
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.content.toLowerCase().includes(lowercaseQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const searchTransactions = (transactions: Transaction[], query: string): Transaction[] => {
  const lowercaseQuery = query.toLowerCase();
  return transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(lowercaseQuery) ||
    transaction.category.toLowerCase().includes(lowercaseQuery) ||
    transaction.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Export/Import utilities
export const exportData = (tasks: Task[], notes: Note[], transactions: Transaction[]): ExportData => {
  return {
    tasks,
    notes,
    transactions,
    exportedAt: new Date(),
    version: '1.0.0'
  };
};

export const importData = (data: ExportData): ImportResult => {
  const result: ImportResult = {
    success: true,
    imported: {
      tasks: 0,
      notes: 0,
      transactions: 0
    },
    errors: []
  };

  try {
    // Validate data structure
    if (!data.tasks || !Array.isArray(data.tasks)) {
      result.errors.push('Invalid tasks data');
    } else {
      result.imported.tasks = data.tasks.length;
    }

    if (!data.notes || !Array.isArray(data.notes)) {
      result.errors.push('Invalid notes data');
    } else {
      result.imported.notes = data.notes.length;
    }

    if (!data.transactions || !Array.isArray(data.transactions)) {
      result.errors.push('Invalid transactions data');
    } else {
      result.imported.transactions = data.transactions.length;
    }

    if (result.errors.length > 0) {
      result.success = false;
    }
  } catch (error) {
    result.success = false;
    result.errors.push(`Import failed: ${error}`);
  }

  return result;
};

// Validation utilities
export const validateTask = (task: Partial<Task>): string[] => {
  const errors: string[] = [];

  if (!task.title || task.title.trim().length === 0) {
    errors.push('Task title is required');
  }

  if (task.title && task.title.length > 100) {
    errors.push('Task title must be less than 100 characters');
  }

  if (task.description && task.description.length > 500) {
    errors.push('Task description must be less than 500 characters');
  }

  return errors;
};

export const validateNote = (note: Partial<Note>): string[] => {
  const errors: string[] = [];

  if (!note.title || note.title.trim().length === 0) {
    errors.push('Note title is required');
  }

  if (note.title && note.title.length > 100) {
    errors.push('Note title must be less than 100 characters');
  }

  if (note.content && note.content.length > 10000) {
    errors.push('Note content must be less than 10,000 characters');
  }

  return errors;
};

export const validateTransaction = (transaction: Partial<Transaction>): string[] => {
  const errors: string[] = [];

  if (!transaction.amount || transaction.amount <= 0) {
    errors.push('Transaction amount must be greater than 0');
  }

  if (!transaction.description || transaction.description.trim().length === 0) {
    errors.push('Transaction description is required');
  }

  if (transaction.description && transaction.description.length > 100) {
    errors.push('Transaction description must be less than 100 characters');
  }

  return errors;
};

// Storage utilities
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Chart utilities
export const prepareChartData = (data: any[], xKey: string, yKey: string) => {
  return data.map(item => ({
    x: item[xKey],
    y: item[yKey]
  }));
};

export const getChartColors = (count: number): string[] => {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#ef4444', '#3b82f6', '#06b6d4', '#84cc16', '#f97316'
  ];
  
  return colors.slice(0, count);
};

// Notification utilities
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/assets/icon-192.png',
      badge: '/assets/icon-192.png',
      ...options
    });
  }
};
