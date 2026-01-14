// Finance page
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VictoryChart, VictoryLine, VictoryBar, VictoryPie, VictoryAxis } from 'victory';
import { useTransactionStore } from '../services/stores';
import { Transaction, TransactionType, TransactionCategory } from '../types';

export default function FinanceScreen() {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    getTotalIncome,
    getTotalExpenses,
    getMonthlyTransactions
  } = useTransactionStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');
  const [newTransaction, setNewTransaction] = useState({
    type: TransactionType.EXPENSE,
    amount: '',
    description: '',
    category: TransactionCategory.FOOD,
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyIncome = getTotalIncome(currentYear, currentMonth);
  const monthlyExpenses = getTotalExpenses(currentYear, currentMonth);
  const netIncome = monthlyIncome - monthlyExpenses;

  const filteredTransactions = selectedType === 'all' 
    ? transactions 
    : transactions.filter(transaction => transaction.type === selectedType);

  const recentTransactions = filteredTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    addTransaction({
      type: newTransaction.type,
      amount,
      description: newTransaction.description.trim(),
      category: newTransaction.category,
      date: new Date(newTransaction.date),
      isRecurring: newTransaction.isRecurring,
    });

    setNewTransaction({
      type: TransactionType.EXPENSE,
      amount: '',
      description: '',
      category: TransactionCategory.FOOD,
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
    });
    setShowAddModal(false);
  };

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) },
      ]
    );
  };

  const getCategoryIcon = (category: TransactionCategory) => {
    switch (category) {
      case TransactionCategory.FOOD:
        return 'restaurant-outline';
      case TransactionCategory.TRANSPORTATION:
        return 'car-outline';
      case TransactionCategory.HOUSING:
        return 'home-outline';
      case TransactionCategory.UTILITIES:
        return 'flash-outline';
      case TransactionCategory.HEALTHCARE:
        return 'medical-outline';
      case TransactionCategory.ENTERTAINMENT:
        return 'game-controller-outline';
      case TransactionCategory.SHOPPING:
        return 'bag-outline';
      case TransactionCategory.EDUCATION:
        return 'school-outline';
      case TransactionCategory.SUBSCRIPTIONS:
        return 'card-outline';
      case TransactionCategory.SALARY:
        return 'briefcase-outline';
      case TransactionCategory.FREELANCE:
        return 'laptop-outline';
      case TransactionCategory.INVESTMENT:
        return 'trending-up-outline';
      case TransactionCategory.BUSINESS:
        return 'business-outline';
      default:
        return 'cash-outline';
    }
  };

  const getTypeColor = (type: TransactionType) => {
    return type === TransactionType.INCOME ? '#10b981' : '#ef4444';
  };

  const typeFilters = [
    { key: 'all', label: 'All', icon: 'grid-outline' },
    { key: TransactionType.INCOME, label: 'Income', icon: 'trending-up-outline' },
    { key: TransactionType.EXPENSE, label: 'Expenses', icon: 'trending-down-outline' },
  ];

  // Chart data for expenses by category
  const expenseCategories = Object.values(TransactionCategory).filter(
    cat => !Object.values([
      TransactionCategory.SALARY,
      TransactionCategory.FREELANCE,
      TransactionCategory.INVESTMENT,
      TransactionCategory.BUSINESS,
      TransactionCategory.OTHER_INCOME
    ]).includes(cat)
  );

  const expenseData = expenseCategories.map(category => {
    const amount = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    return { x: category, y: amount };
  }).filter(item => item.y > 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <Ionicons name="trending-up-outline" size={20} color="#10b981" />
              <Text style={styles.summaryCardTitle}>Income</Text>
            </View>
            <Text style={[styles.summaryCardAmount, { color: '#10b981' }]}>
              ${monthlyIncome.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <Ionicons name="trending-down-outline" size={20} color="#ef4444" />
              <Text style={styles.summaryCardTitle}>Expenses</Text>
            </View>
            <Text style={[styles.summaryCardAmount, { color: '#ef4444' }]}>
              ${monthlyExpenses.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <Ionicons name="wallet-outline" size={20} color={netIncome >= 0 ? '#10b981' : '#ef4444'} />
              <Text style={styles.summaryCardTitle}>Net</Text>
            </View>
            <Text style={[styles.summaryCardAmount, { color: netIncome >= 0 ? '#10b981' : '#ef4444' }]}>
              ${netIncome.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Type Filter */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {typeFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedType === filter.key && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedType(filter.key as any)}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={16}
                  color={selectedType === filter.key ? 'white' : '#6b7280'}
                />
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedType === filter.key && styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chart Section */}
        {expenseData.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Expenses by Category</Text>
            <View style={styles.chartContainer}>
              <VictoryChart
                height={200}
                padding={{ left: 50, right: 20, top: 20, bottom: 40 }}
              >
                <VictoryBar
                  data={expenseData}
                  style={{
                    data: { fill: '#6366f1' }
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x: any) => `$${x}`}
                />
                <VictoryAxis
                  tickFormat={(x: any) => x.substring(0, 8)}
                />
              </VictoryChart>
            </View>
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cash-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyStateText}>No transactions found</Text>
              <Text style={styles.emptyStateSubtext}>
                Add your first transaction to get started
              </Text>
            </View>
          ) : (
            recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIcon}>
                    <Ionicons
                      name={getCategoryIcon(transaction.category)}
                      size={20}
                      color={getTypeColor(transaction.type)}
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionCategory}>
                      {transaction.category}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {transaction.date.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: getTypeColor(transaction.type) }
                    ]}
                  >
                    {transaction.type === TransactionType.INCOME ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTransaction(transaction.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Transaction</Text>
            <TouchableOpacity onPress={handleAddTransaction}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Type *</Text>
              <View style={styles.typeOptions}>
                {Object.values(TransactionType).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      newTransaction.type === type && styles.typeOptionActive,
                    ]}
                    onPress={() => setNewTransaction({ ...newTransaction, type })}
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        newTransaction.type === type && styles.typeOptionTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount *</Text>
              <TextInput
                style={styles.input}
                value={newTransaction.amount}
                onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={styles.input}
                value={newTransaction.description}
                onChangeText={(text) => setNewTransaction({ ...newTransaction, description: text })}
                placeholder="Enter description"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryOptions}>
                {Object.values(TransactionCategory).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newTransaction.category === category && styles.categoryOptionActive,
                    ]}
                    onPress={() => setNewTransaction({ ...newTransaction, category })}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        newTransaction.category === category && styles.categoryOptionTextActive,
                      ]}
                    >
                      {category.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                value={newTransaction.date}
                onChangeText={(text) => setNewTransaction({ ...newTransaction, date: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setNewTransaction({ ...newTransaction, isRecurring: !newTransaction.isRecurring })}
              >
                <View style={[
                  styles.checkbox,
                  newTransaction.isRecurring && styles.checkboxChecked
                ]}>
                  {newTransaction.isRecurring && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Recurring Transaction</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#6366f1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryCardTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  summaryCardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
  },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  chartSection: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  chartContainer: {
    alignItems: 'center',
  },
  transactionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deleteButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalSave: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  typeOptions: {
    flexDirection: 'row',
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f3f4f6',
  },
  typeOptionActive: {
    backgroundColor: '#6366f1',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  typeOptionTextActive: {
    color: 'white',
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  categoryOptionActive: {
    backgroundColor: '#6366f1',
  },
  categoryOptionText: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  categoryOptionTextActive: {
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#1f2937',
  },
});
