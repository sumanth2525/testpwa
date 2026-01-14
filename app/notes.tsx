// Notes page
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
import { useNoteStore } from '../services/stores';
import { Note, NoteCategory, NoteColor } from '../types';

export default function NotesScreen() {
  const { notes, addNote, updateNote, deleteNote, togglePinNote, searchNotes } = useNoteStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: NoteCategory.OTHER,
    color: NoteColor.WHITE,
    tags: '',
  });

  const filteredNotes = () => {
    let filtered = notes;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      filtered = searchNotes(searchQuery);
    }
    
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  };

  const handleAddNote = () => {
    if (!newNote.title.trim()) {
      Alert.alert('Error', 'Please enter a note title');
      return;
    }

    const tags = newNote.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    addNote({
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      category: newNote.category,
      color: newNote.color,
      tags,
      isPinned: false,
    });

    setNewNote({
      title: '',
      content: '',
      category: NoteCategory.OTHER,
      color: NoteColor.WHITE,
      tags: '',
    });
    setShowAddModal(false);
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) },
      ]
    );
  };

  const getCategoryIcon = (category: NoteCategory) => {
    switch (category) {
      case NoteCategory.IDEAS:
        return 'bulb-outline';
      case NoteCategory.MEETINGS:
        return 'people-outline';
      case NoteCategory.JOURNAL:
        return 'book-outline';
      case NoteCategory.REFERENCE:
        return 'library-outline';
      case NoteCategory.TODO:
        return 'checkmark-circle-outline';
      default:
        return 'document-outline';
    }
  };

  const categories = [
    { key: 'all', label: 'All', icon: 'grid-outline' },
    { key: NoteCategory.IDEAS, label: 'Ideas', icon: 'bulb-outline' },
    { key: NoteCategory.MEETINGS, label: 'Meetings', icon: 'people-outline' },
    { key: NoteCategory.JOURNAL, label: 'Journal', icon: 'book-outline' },
    { key: NoteCategory.REFERENCE, label: 'Reference', icon: 'library-outline' },
    { key: NoteCategory.TODO, label: 'Todo', icon: 'checkmark-circle-outline' },
    { key: NoteCategory.OTHER, label: 'Other', icon: 'document-outline' },
  ];

  const colorOptions = [
    { key: NoteColor.WHITE, label: 'White', color: '#ffffff' },
    { key: NoteColor.YELLOW, label: 'Yellow', color: '#fef3c7' },
    { key: NoteColor.GREEN, label: 'Green', color: '#d1fae5' },
    { key: NoteColor.BLUE, label: 'Blue', color: '#dbeafe' },
    { key: NoteColor.PURPLE, label: 'Purple', color: '#e9d5ff' },
    { key: NoteColor.PINK, label: 'Pink', color: '#fce7f3' },
    { key: NoteColor.RED, label: 'Red', color: '#fee2e2' },
    { key: NoteColor.GRAY, label: 'Gray', color: '#f3f4f6' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
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

      {/* Notes Grid */}
      <ScrollView style={styles.notesContainer} showsVerticalScrollIndicator={false}>
        {filteredNotes().length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyStateText}>No notes found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Create your first note to get started'}
            </Text>
          </View>
        ) : (
          <View style={styles.notesGrid}>
            {filteredNotes().map((note) => (
              <View key={note.id} style={styles.noteCard}>
                <View style={[styles.noteContent, { backgroundColor: note.color }]}>
                  <View style={styles.noteHeader}>
                    <View style={styles.noteCategory}>
                      <Ionicons
                        name={getCategoryIcon(note.category)}
                        size={14}
                        color="#6b7280"
                      />
                      <Text style={styles.noteCategoryText}>
                        {note.category}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => togglePinNote(note.id)}
                      style={styles.pinButton}
                    >
                      <Ionicons
                        name={note.isPinned ? "pin" : "pin-outline"}
                        size={16}
                        color={note.isPinned ? "#f59e0b" : "#6b7280"}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.noteTitle} numberOfLines={2}>
                    {note.title}
                  </Text>
                  
                  <Text style={styles.noteContentText} numberOfLines={4}>
                    {note.content}
                  </Text>
                  
                  {note.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                      {note.tags.length > 3 && (
                        <Text style={styles.moreTagsText}>
                          +{note.tags.length - 3} more
                        </Text>
                      )}
                    </View>
                  )}
                  
                  <Text style={styles.noteDate}>
                    {note.updatedAt.toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.noteActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      // TODO: Implement edit functionality
                      Alert.alert('Edit Note', 'Edit functionality coming soon!');
                    }}
                  >
                    <Ionicons name="pencil-outline" size={16} color="#6366f1" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteNote(note.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Note Modal */}
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
            <Text style={styles.modalTitle}>New Note</Text>
            <TouchableOpacity onPress={handleAddNote}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                value={newNote.title}
                onChangeText={(text) => setNewNote({ ...newNote, title: text })}
                placeholder="Enter note title"
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Content</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newNote.content}
                onChangeText={(text) => setNewNote({ ...newNote, content: text })}
                placeholder="Enter note content"
                multiline
                numberOfLines={6}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryOptions}>
                {Object.values(NoteCategory).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newNote.category === category && styles.categoryOptionActive,
                    ]}
                    onPress={() => setNewNote({ ...newNote, category })}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        newNote.category === category && styles.categoryOptionTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Color</Text>
              <View style={styles.colorOptions}>
                {colorOptions.map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption.key}
                    style={[
                      styles.colorOption,
                      { backgroundColor: colorOption.color },
                      newNote.color === colorOption.key && styles.colorOptionActive,
                    ]}
                    onPress={() => setNewNote({ ...newNote, color: colorOption.key })}
                  >
                    {newNote.color === colorOption.key && (
                      <Ionicons name="checkmark" size={16} color="#1f2937" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tags</Text>
              <TextInput
                style={styles.input}
                value={newNote.tags}
                onChangeText={(text) => setNewNote({ ...newNote, tags: text })}
                placeholder="Enter tags separated by commas"
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1f2937',
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
  notesContainer: {
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
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noteCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteContent: {
    padding: 15,
    borderRadius: 12,
    minHeight: 150,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteCategoryText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  pinButton: {
    padding: 4,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  noteContentText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  noteDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 'auto',
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
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
    height: 120,
    textAlignVertical: 'top',
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
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionActive: {
    borderColor: '#1f2937',
  },
});
