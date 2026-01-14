// Main Dashboard/Home page
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTaskStore } from '../services/stores';
import { useNoteStore } from '../services/stores';
import { useTransactionStore } from '../services/stores';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, getOverdueTasks, getUpcomingTasks } = useTaskStore();
  const { notes, getPinnedNotes } = useNoteStore();
  const { getTotalIncome, getTotalExpenses } = useTransactionStore();

  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks();
  const pinnedNotes = getPinnedNotes();
  const monthlyIncome = getTotalIncome();
  const monthlyExpenses = getTotalExpenses();
  const netIncome = monthlyIncome - monthlyExpenses;

  const quickActions = [
    {
      title: 'Tasks',
      icon: 'checkmark-circle-outline',
      color: '#10b981',
      route: '/tasks',
      count: tasks.filter(t => !t.completed).length,
    },
    {
      title: 'Notes',
      icon: 'document-text-outline',
      color: '#3b82f6',
      route: '/notes',
      count: notes.length,
    },
    {
      title: 'Finance',
      icon: 'cash-outline',
      color: '#f59e0b',
      route: '/finance',
      count: monthlyIncome > 0 ? 1 : 0,
    },
    {
      title: 'Dashboard',
      icon: 'analytics-outline',
      color: '#8b5cf6',
      route: '/dashboard',
      count: 0,
    },
  ];

  const stats = [
    {
      title: 'Pending Tasks',
      value: tasks.filter(t => !t.completed).length,
      color: '#ef4444',
      icon: 'time-outline',
    },
    {
      title: 'Overdue',
      value: overdueTasks.length,
      color: '#dc2626',
      icon: 'warning-outline',
    },
    {
      title: 'Notes',
      value: notes.length,
      color: '#3b82f6',
      icon: 'document-outline',
    },
    {
      title: 'Net Income',
      value: `$${netIncome.toFixed(2)}`,
      color: netIncome >= 0 ? '#10b981' : '#ef4444',
      icon: 'trending-up-outline',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Life Productivity Hub</Text>
        <Text style={styles.headerSubtitle}>Stay organized and productive</Text>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionCard}
              onPress={() => router.push(action.route)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={24} color="white" />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionCount}>{action.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Ionicons name="calendar-outline" size={20} color="#6366f1" />
              <Text style={styles.activityTitle}>Upcoming Tasks</Text>
            </View>
            {upcomingTasks.slice(0, 3).map((task) => (
              <View key={task.id} style={styles.activityItem}>
                <Text style={styles.activityText}>{task.title}</Text>
                <Text style={styles.activityDate}>
                  {task.dueDate?.toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Ionicons name="pin-outline" size={20} color="#f59e0b" />
              <Text style={styles.activityTitle}>Pinned Notes</Text>
            </View>
            {pinnedNotes.slice(0, 3).map((note) => (
              <View key={note.id} style={styles.activityItem}>
                <Text style={styles.activityText}>{note.title}</Text>
                <Text style={styles.activityDate}>
                  {note.updatedAt.toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
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
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  quickActionCount: {
    fontSize: 14,
    color: '#6b7280',
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
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  activityCard: {
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
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 10,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  activityDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});
