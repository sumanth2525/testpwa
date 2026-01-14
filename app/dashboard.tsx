// Dashboard page with analytics
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { VictoryChart, VictoryLine, VictoryBar, VictoryPie, VictoryAxis, VictoryTheme } from 'victory';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore } from '../services/stores';
import { useNoteStore } from '../services/stores';
import { useTransactionStore } from '../services/stores';
import { TaskCategory, TransactionCategory } from '../types';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { tasks, getTasksByCategory, getOverdueTasks, getUpcomingTasks } = useTaskStore();
  const { notes, getPinnedNotes } = useNoteStore();
  const { 
    transactions, 
    getTotalIncome, 
    getTotalExpenses,
    getMonthlyTransactions 
  } = useTransactionStore();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Task analytics
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = getOverdueTasks().length;
  const upcomingTasks = getUpcomingTasks(7).length;

  // Task completion rate
  const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  // Tasks by category
  const tasksByCategory = Object.values(TaskCategory).map(category => ({
    x: category,
    y: getTasksByCategory(category).length
  })).filter(item => item.y > 0);

  // Financial analytics
  const monthlyIncome = getTotalIncome(currentYear, currentMonth);
  const monthlyExpenses = getTotalExpenses(currentYear, currentMonth);
  const netIncome = monthlyIncome - monthlyExpenses;

  // Monthly trend data (last 6 months)
  const monthlyTrendData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthIncome = getTotalIncome(date.getFullYear(), date.getMonth());
    const monthExpenses = getTotalExpenses(date.getFullYear(), date.getMonth());
    
    monthlyTrendData.push({
      x: date.toLocaleDateString('en-US', { month: 'short' }),
      income: monthIncome,
      expenses: monthExpenses,
      net: monthIncome - monthExpenses
    });
  }

  // Expenses by category
  const expenseCategories = Object.values(TransactionCategory).filter(
    cat => !Object.values([
      TransactionCategory.SALARY,
      TransactionCategory.FREELANCE,
      TransactionCategory.INVESTMENT,
      TransactionCategory.BUSINESS,
      TransactionCategory.OTHER_INCOME
    ]).includes(cat)
  );

  const expensesByCategory = expenseCategories.map(category => {
    const amount = transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    return { x: category.replace('_', ' '), y: amount };
  }).filter(item => item.y > 0);

  // Notes analytics
  const totalNotes = notes.length;
  const pinnedNotes = getPinnedNotes().length;

  const statsCards = [
    {
      title: 'Task Completion',
      value: `${taskCompletionRate.toFixed(1)}%`,
      icon: 'checkmark-circle-outline',
      color: '#10b981',
      subtitle: `${completedTasks}/${tasks.length} tasks`
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks.toString(),
      icon: 'warning-outline',
      color: '#ef4444',
      subtitle: 'Need attention'
    },
    {
      title: 'Net Income',
      value: `$${netIncome.toFixed(2)}`,
      icon: 'trending-up-outline',
      color: netIncome >= 0 ? '#10b981' : '#ef4444',
      subtitle: 'This month'
    },
    {
      title: 'Notes',
      value: totalNotes.toString(),
      icon: 'document-outline',
      color: '#3b82f6',
      subtitle: `${pinnedNotes} pinned`
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Your productivity overview</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {statsCards.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <Ionicons name={stat.icon as any} size={20} color="white" />
                </View>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Financial Trend Chart */}
      {monthlyTrendData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Financial Trend (6 Months)</Text>
          <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              height={250}
              padding={{ left: 50, right: 20, top: 20, bottom: 40 }}
            >
              <VictoryAxis
                dependentAxis
                tickFormat={(x: any) => `$${x}`}
              />
              <VictoryAxis
                tickFormat={(x: any) => x}
              />
              <VictoryLine
                data={monthlyTrendData}
                x="x"
                y="income"
                style={{
                  data: { stroke: '#10b981', strokeWidth: 3 }
                }}
              />
              <VictoryLine
                data={monthlyTrendData}
                x="x"
                y="expenses"
                style={{
                  data: { stroke: '#ef4444', strokeWidth: 3 }
                }}
              />
            </VictoryChart>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
                <Text style={styles.legendText}>Income</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.legendText}>Expenses</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Tasks by Category */}
      {tasksByCategory.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Tasks by Category</Text>
          <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              height={200}
              padding={{ left: 50, right: 20, top: 20, bottom: 40 }}
            >
              <VictoryBar
                data={tasksByCategory}
                style={{
                  data: { fill: '#6366f1' }
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(x: any) => `${x}`}
              />
              <VictoryAxis
                tickFormat={(x: any) => x.substring(0, 8)}
              />
            </VictoryChart>
          </View>
        </View>
      )}

      {/* Expenses by Category Pie Chart */}
      {expensesByCategory.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Expenses by Category</Text>
          <View style={styles.chartContainer}>
            <VictoryPie
              data={expensesByCategory}
              height={250}
              colorScale={['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#3b82f6']}
              labelRadius={80}
              labelComponent={<VictoryAxis />}
            />
          </View>
        </View>
      )}

      {/* Quick Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Quick Insights</Text>
        <View style={styles.insightsList}>
          {overdueTasks > 0 && (
            <View style={styles.insightItem}>
              <Ionicons name="warning-outline" size={20} color="#ef4444" />
              <Text style={styles.insightText}>
                You have {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''} that need attention
              </Text>
            </View>
          )}
          
          {upcomingTasks > 0 && (
            <View style={styles.insightItem}>
              <Ionicons name="calendar-outline" size={20} color="#f59e0b" />
              <Text style={styles.insightText}>
                {upcomingTasks} task{upcomingTasks > 1 ? 's' : ''} due in the next 7 days
              </Text>
            </View>
          )}
          
          {netIncome < 0 && (
            <View style={styles.insightItem}>
              <Ionicons name="trending-down-outline" size={20} color="#ef4444" />
              <Text style={styles.insightText}>
                You're spending more than you're earning this month
              </Text>
            </View>
          )}
          
          {taskCompletionRate > 70 && (
            <View style={styles.insightItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.insightText}>
                Great job! You've completed {taskCompletionRate.toFixed(1)}% of your tasks
              </Text>
            </View>
          )}
          
          {pinnedNotes > 0 && (
            <View style={styles.insightItem}>
              <Ionicons name="pin-outline" size={20} color="#3b82f6" />
              <Text style={styles.insightText}>
                You have {pinnedNotes} important note{pinnedNotes > 1 ? 's' : ''} pinned
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  chartSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  insightsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  insightsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  insightText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
});
