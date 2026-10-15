import { useEffect, useState } from "react";
import {
  initDatabase,
  getAllNotes,
  createNote as saveNoteToDatabase,
  updateNote as updateNoteInDatabase,
  deleteNote as deleteNoteFromDatabase,
  type Note,
} from "../../database/database";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [databaseError, setDatabaseError] = useState(false);
  const [databaseReady, setDatabaseReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  useEffect(() => {
    let isActive = true;
    async function setupDatabase() {
      try {
        await initDatabase();
        const savedNotes = await getAllNotes();
        if (isActive) {
          setNotes(savedNotes);
          setDatabaseReady(true);
          setDatabaseError(false);
        }
      } catch (error) {
        console.error("Database initialization failed:", error);
        if (isActive) {
          setDatabaseError(true);
        }
      }
    }
    setupDatabase();
    return () => {
      isActive = false;
    };
  }, []);
  async function loadNotes() {
    try {
      const savedNotes = await getAllNotes();
      setNotes(savedNotes);
    } catch (error) {
      console.error("Failed to load notes:", error);
      Alert.alert("Error", "Could not load your notes.");
    }
  }
  const filteredNotes = notes.filter((note) => {
    const query = search.trim().toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });
  async function handleCreateNote() {
    if (!title.trim() || !content.trim()) {
      Alert.alert(
        "Missing details",
        "Please enter both a title and note content.",
      );
      return;
    }
    if (!databaseReady || isSaving) {
      return;
    }
    setIsSaving(true);
    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    try {
      await saveNoteToDatabase(newNote);
      await loadNotes();
      setTitle("");
      setContent("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create note:", error);
      Alert.alert("Error", "Could not save your note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }
  function handleStartEdit(note: Note) {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setShowForm(false);
  }
  async function handleSaveEdit() {
    if (!editTitle.trim() || !editContent.trim()) {
      Alert.alert(
        "Missing details",
        "Please enter both a title and note content.",
      );
      return;
    }
    if (!databaseReady || isSaving || !editingNoteId) {
      return;
    }
    setIsSaving(true);
    try {
      await updateNoteInDatabase(
        editingNoteId,
        editTitle.trim(),
        editContent.trim(),
      );
      await loadNotes();
      handleCancelEdit();
    } catch (error) {
      console.error("Failed to update note:", error);
      Alert.alert("Error", "Could not update your note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }
  function handleCancelEdit() {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
  }
  function handleDeleteNote(noteId: string) {
    if (!databaseReady || isSaving || deletingNoteId) {
      return;
    }
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingNoteId(noteId);
            try {
              await deleteNoteFromDatabase(noteId);
              await loadNotes();
              if (editingNoteId === noteId) {
                handleCancelEdit();
              }
            } catch (error) {
              console.error("Failed to delete note:", error);
              Alert.alert(
                "Error",
                "Could not delete your note. Please try again.",
              );
            } finally {
              setDeletingNoteId(null);
            }
          },
        },
      ],
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Pocket Notes</Text>
          <Text style={styles.subtitle}>Your thoughts, all in one place.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>P</Text>
        </View>
      </View>
      <View style={styles.toolbar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search your notes..."
          placeholderTextColor="#8A8F98"
          value={search}
          onChangeText={setSearch}
        />
        <Pressable
          style={styles.newNoteButton}
          onPress={() => setShowForm((visible) => !visible)}
        >
          <Text style={styles.newNoteButtonText}>
            {showForm ? "Cancel" : "+ New Note"}
          </Text>
        </Pressable>
      </View>
      {databaseError && (
        <View style={styles.databaseError}>
          <Text style={styles.databaseErrorTitle}>
            Unable to load your notes
          </Text>
          <Text style={styles.databaseErrorText}>
            Please restart the app and try again.
          </Text>
        </View>
      )}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {showForm && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Create a new note</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Note title"
              placeholderTextColor="#8A8F98"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <TextInput
              style={styles.contentInput}
              placeholder="Write your thoughts here..."
              placeholderTextColor="#8A8F98"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
            <Pressable
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleCreateNote}
              disabled={isSaving || !databaseReady}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? "Saving..." : "Save Note"}
              </Text>
            </Pressable>
          </View>
        )}
        {!databaseReady && !databaseError ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Loading your notes...</Text>
          </View>
        ) : notes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✎</Text>
            <Text style={styles.emptyTitle}>Your space, your thoughts.</Text>
            <Text style={styles.emptyDescription}>
              You haven&apos;t created any notes yet. Start capturing your ideas,
              reminders, and thoughts in one place.
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => setShowForm(true)}
            >
              <Text style={styles.emptyButtonText}>Create your first note</Text>
            </Pressable>
          </View>
        ) : filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No notes found</Text>
            <Text style={styles.emptyDescription}>
              Try a different search term.
            </Text>
          </View>
        ) : (
          <View style={styles.notesGrid}>
            {filteredNotes.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                {editingNoteId === note.id ? (
                  <>
                    <Text style={styles.formTitle}>Edit note</Text>
                    <TextInput
                      style={styles.titleInput}
                      placeholder="Note title"
                      value={editTitle}
                      onChangeText={setEditTitle}
                      maxLength={100}
                    />
                    <TextInput
                      style={styles.contentInput}
                      placeholder="Write your thoughts here..."
                      value={editContent}
                      onChangeText={setEditContent}
                      multiline
                      textAlignVertical="top"
                    />
                    <View style={styles.noteActions}>
                      <Pressable
                        style={[
                          styles.saveButton,
                          isSaving && styles.disabledButton,
                        ]}
                        onPress={handleSaveEdit}
                        disabled={isSaving || !databaseReady}
                      >
                        <Text style={styles.saveButtonText}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.cancelButton}
                        onPress={handleCancelEdit}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.noteTitle}>{note.title}</Text>
                    <Text style={styles.noteContent}>{note.content}</Text>
                    <Text style={styles.noteDate}>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </Text>
                    <View style={styles.noteActions}>
                      <Pressable
                        style={styles.editButton}
                        onPress={() => handleStartEdit(note)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.deleteButton,
                          deletingNoteId === note.id && styles.disabledButton,
                        ]}
                        onPress={() => handleDeleteNote(note.id)}
                        disabled={
                          !databaseReady || isSaving || deletingNoteId !== null
                        }
                      >
                        <Text style={styles.deleteButtonText}>
                          {deletingNoteId === note.id
                            ? "Deleting..."
                            : "Delete"}
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <Text style={styles.footer}>MADE FOR YOUR EVERYDAY IDEAS</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    fontSize: 29,
    fontWeight: "800",
    color: "#202433",
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    color: "#7B8190",
    marginTop: 7,
    lineHeight: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#E7E9FF",
    borderWidth: 1,
    borderColor: "#DADDFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#5558D9",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  toolbar: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7F0",
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#202433",
  },
  newNoteButton: {
    backgroundColor: "#5558D9",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  newNoteButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E8EAF2",
    gap: 14,
  },
  formTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#202433",
    marginBottom: 4,
  },
  titleInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#E5E7F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#202433",
    fontSize: 15,
  },
  contentInput: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: "#E5E7F0",
    borderRadius: 12,
    padding: 14,
    color: "#202433",
    fontSize: 15,
    lineHeight: 23,
  },
  saveButton: {
    backgroundColor: "#5558D9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    color: "#5558D9",
    marginBottom: 20,
    backgroundColor: "#E7E9FF",
    overflow: "hidden",
    textAlign: "center",
    textAlignVertical: "center",
    width: 84,
    height: 84,
    borderRadius: 26,
    lineHeight: 84,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#202433",
    textAlign: "center",
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 23,
    color: "#7B8190",
    textAlign: "center",
    marginBottom: 26,
    maxWidth: 300,
  },
  emptyButton: {
    backgroundColor: "#5558D9",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 13,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  notesGrid: {
    gap: 14,
  },
  noteCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EAF2",
    borderRadius: 18,
    padding: 20,
    gap: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#202433",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 23,
    color: "#626979",
  },
  noteDate: {
    fontSize: 12,
    color: "#8A8F98",
    marginTop: 16,
  },
  noteActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F1F5",
  },
  editButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#E7E9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: "#5558D9",
    fontWeight: "600",
    fontSize: 13,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#FEECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#D93636",
    fontWeight: "600",
    fontSize: 13,
  },
  footer: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
    color: "#A0A5B2",
    textAlign: "center",
    paddingVertical: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#F0F1F5",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#555B68",
    fontWeight: "600",
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  databaseError: {
    backgroundColor: "#FEECEC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F5C2C2",
  },
  databaseErrorTitle: {
    color: "#B42318",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  databaseErrorText: {
    color: "#8A2C2C",
    fontSize: 13,
    lineHeight: 20,
  },
});
