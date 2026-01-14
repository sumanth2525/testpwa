// Core types for Life Productivity Hub

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  HEALTH = 'health',
  LEARNING = 'learning',
  FINANCE = 'finance',
  OTHER = 'other'
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  color: NoteColor;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

export enum NoteCategory {
  IDEAS = 'ideas',
  MEETINGS = 'meetings',
  JOURNAL = 'journal',
  REFERENCE = 'reference',
  TODO = 'todo',
  OTHER = 'other'
}

export enum NoteColor {
  WHITE = '#ffffff',
  YELLOW = '#fef3c7',
  GREEN = '#d1fae5',
  BLUE = '#dbeafe',
  PURPLE = '#e9d5ff',
  PINK = '#fce7f3',
  RED = '#fee2e2',
  GRAY = '#f3f4f6'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: TransactionCategory;
  date: Date;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum TransactionCategory {
  // Income categories
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT = 'investment',
  BUSINESS = 'business',
  OTHER_INCOME = 'other_income',
  
  // Expense categories
  FOOD = 'food',
  TRANSPORTATION = 'transportation',
  HOUSING = 'housing',
  UTILITIES = 'utilities',
  HEALTHCARE = 'healthcare',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  EDUCATION = 'education',
  SUBSCRIPTIONS = 'subscriptions',
  OTHER_EXPENSE = 'other_expense'
}

export interface RecurringPattern {
  frequency: RecurringFrequency;
  interval: number; // Every X days/weeks/months
  endDate?: Date;
}

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface DashboardStats {
  tasksCompleted: number;
  tasksPending: number;
  overdueTasks: number;
  totalNotes: number;
  pinnedNotes: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netIncome: number;
  topExpenseCategories: CategorySpending[];
}

export interface CategorySpending {
  category: TransactionCategory;
  amount: number;
  percentage: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  taskReminders: boolean;
  dueDateAlerts: boolean;
  recurringTransactionAlerts: boolean;
  pushNotifications: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and search types
export interface TaskFilters {
  category?: TaskCategory;
  priority?: TaskPriority;
  completed?: boolean;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  tags?: string[];
}

export interface NoteFilters {
  category?: NoteCategory;
  color?: NoteColor;
  tags?: string[];
  isPinned?: boolean;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  amountRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
}

// Chart data types
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface CategoryData {
  category: string;
  value: number;
  color?: string;
}

// Export/Import types
export interface ExportData {
  tasks: Task[];
  notes: Note[];
  transactions: Transaction[];
  exportedAt: Date;
  version: string;
}

export interface ImportResult {
  success: boolean;
  imported: {
    tasks: number;
    notes: number;
    transactions: number;
  };
  errors: string[];
}
