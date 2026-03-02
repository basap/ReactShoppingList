import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy, getDocs, } from 'firebase/firestore';
import { firestore } from './firebase/config';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

export default function App() {
  const [item, setItem] = useState('');
  const [items, setItems] = useState<ShoppingItem[]>([]);

  const itemsCollection = collection(firestore, 'shoppingItems');

  useEffect(() => {
    const q = query(itemsCollection, orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData: ShoppingItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ShoppingItem[];

      setItems(itemsData);
    });

    return unsubscribe;
  }, []);

  const addItem = async () => {
    if (item.trim() === '') return;

    await addDoc(itemsCollection, {
      name: item,
      completed: false,
      createdAt: new Date(),
    });

    setItem('');
  };

  const toggleItem = async (id: string, currentState: boolean) => {
    const itemDoc = doc(firestore, 'shoppingItems', id);
    await updateDoc(itemDoc, {
      completed: !currentState,
    });
  };

  const deleteItem = async (id: string) => {
    const itemDoc = doc(firestore, 'shoppingItems', id);
    await deleteDoc(itemDoc);
  };

  const clearList = async () => {
    const snapshot = await getDocs(itemsCollection);

    const deletePromises = snapshot.docs.map((document) =>
      deleteDoc(doc(firestore, 'shoppingItems', document.id))
    );

    await Promise.all(deletePromises);
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.itemTextContainer} onPress={() => toggleItem(item.id, item.completed)}>
        <Text style={[ styles.itemText, item.completed && styles.completedText, ]}>
          {item.name}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteItem(item.id)}>
        <Text style={styles.deleteText}>Poista</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ostoslista</Text>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Lisää tuote" value={item} onChangeText={setItem} />
        <TouchableOpacity onPress={addItem}>
          <Text style={styles.addTextButton}>Lisää</Text>
        </TouchableOpacity>
      </View>

      <FlatList data={items} keyExtractor={(item) => item.id} renderItem={renderItem} style={styles.list} />

      {items.length > 0 && (
        <TouchableOpacity onPress={clearList}>
          <Text style={styles.clearTextButton}>Tyhjennä lista</Text>
        </TouchableOpacity>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 60,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8
  },
  list: {
    flex: 1
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8
  },
  itemTextContainer: {
    flex: 1
  },
  itemText: {
    fontSize: 18
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray'
  },
  deleteText: {
    fontSize: 18,
    color: 'red'
  },
  addTextButton: {
    marginLeft: 12,
    fontSize: 18,
    color: '#007AFF'
  },
  clearTextButton: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'red'
  }
});
