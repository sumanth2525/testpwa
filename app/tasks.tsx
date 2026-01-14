// Tasks page
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
import { useTaskStore } from '../services/stores';
import { Task, TaskCategory, TaskPriority } from '../types';

export default function TasksScreen() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete } = useTaskStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    category: TaskCategory.PERSONAL,
    dueDate: '',
  });

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    addTask({
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      category: newTask.category,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      completed: false,
    });

    setNewTask({
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.PERSONAL,
      dueDate: '',
    });
    setShowAddModal(false);
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) },
      ]
    );
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return '#dc2626';
      case TaskPriority.HIGH:
        return '#ea580c';
      case TaskPriority.MEDIUM:
        return '#d97706';
      case TaskPriority.LOW:
        return '#16a34a';
      default:
        return '#6b7280';
    }
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case TaskCategory.WORK:
        return 'briefcase-outline';
      case TaskCategory.PERSONAL:
        return 'person-outline';
      case TaskCategory.HEALTH:
        return 'heart-outline';
      case TaskCategory.LEARNING:
        return 'book-outline';
      case TaskCategory.FINANCE:
        return 'cash-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const categories = [
    { key: 'all', label: 'All', icon: 'grid-outline' },
    { key: TaskCategory.WORK, label: 'Work', icon: 'briefcase-outline' },
    { key: TaskCategory.PERSONAL, label: 'Personal', icon: 'person-outline' },
    { key: TaskCategory.HEALTH, label: 'Health', icon: 'heart-outline' },
    { key: TaskCategory.LEARNING, label: 'Learning', icon: 'book-outline' },
    { key: TaskCategory.FINANCE, label: 'Finance', icon: 'cash-outline' },
    { key: TaskCategory.OTHER, label: 'Other', icon: 'ellipse-outline' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
        contentContainerStyle={styles.categoryFilterContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryButton,
              selectedCategory === category.key && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.key as any)}
          >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.key ? 'white' : '#6b7280'}
            />
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.key && styles.categoryButtonTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyStateText}>No tasks found</Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedCategory === 'all' 
                ? 'Create your first task to get started'
                : `No ${selectedCategory} tasks found`
              }
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <TouchableOpacity
                style={styles.taskContent}
                onPress={() => toggleTaskComplete(task.id)}
              >
                <View style={styles.taskLeft}>
                  <View
                    style={[
                      styles.checkbox,
                      task.completed && styles.checkboxCompleted,
                    ]}
                  >
                    {task.completed && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <View style={styles.taskInfo}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleCompleted,
                      ]}
                    >
                      {task.title}
                    </Text>
                    {task.description && (
                      <Text style={styles.taskDescription}>
                        {task.description}
                      </Text>
                    )}
                    <View style={styles.taskMeta}>
                      <View style={styles.taskCategory}>
                        <Ionicons
                          name={getCategoryIcon(task.category)}
                          size={12}
                          color="#6b7280"
                        />
                        <Text style={styles.taskCategoryText}>
                          {task.category}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.priorityBadge,
                          { backgroundColor: getPriorityColor(task.priority) },
                        ]}
                      >
                        <Text style={styles.priorityText}>
                          {task.priority}
                        </Text>
                      </View>
                      {task.dueDate && (
                        <Text style={styles.dueDate}>
                          Due: {task.dueDate.toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTask(task.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Task Modal */}
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
            <Text style={styles.modalTitle}>New Task</Text>
            <TouchableOpacity onPress={handleAddTask}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                value={newTask.title}
                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                placeholder="Enter task title"
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newTask.description}
                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                placeholder="Enter task description"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityOptions}>
                {Object.values(TaskPriority).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      newTask.priority === priority && styles.priorityOptionActive,
                    ]}
                    onPress={() => setNewTask({ ...newTask, priority })}
                  >
                    <Text
                      style={[
                        styles.priorityOptionText,
                        newTask.priority === priority && styles.priorityOptionTextActive,
                      ]}
                    >
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryOptions}>
                {Object.values(TaskCategory).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newTask.category === category && styles.categoryOptionActive,
                    ]}
                    onPress={() => setNewTask({ ...newTask, category })}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        newTask.category === category && styles.categoryOptionTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Due Date</Text>
              <TextInput
                style={styles.input}
                value={newTask.dueDate}
                onChangeText={(text) => setNewTask({ ...newTask, dueDate: text })}
                placeholder="YYYY-MM-DD (optional)"
              />
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
  categoryFilter: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f3f4f6',
  },
  categoryButtonActive: {
    backgroundColor: '#6366f1',
  },
  categoryButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  checkboxCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  taskCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  taskCategoryText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dueDate: {
    fontSize: 12,
    color: '#ef4444',
  },
  deleteButton: {
    padding: 8,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  priorityOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  priorityOptionActive: {
    backgroundColor: '#6366f1',
  },
  priorityOptionText: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  priorityOptionTextActive: {
    color: 'white',
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  categoryOptionActive: {
    backgroundColor: '#6366f1',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  categoryOptionTextActive: {
    color: 'white',
  },
});
