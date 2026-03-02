import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface Message {
  id: string
  name: string
  content: string
  createdAt: Date
}

interface MessageDoc {
  name: string
  content: string
  createdAt: Timestamp
}

const messagesRef = collection(db, 'messages')

export async function getMessages(): Promise<Message[]> {
  const q = query(messagesRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => {
    const data = doc.data() as MessageDoc
    return {
      id: doc.id,
      name: data.name,
      content: data.content,
      createdAt: data.createdAt?.toDate() ?? new Date(),
    }
  })
}

export async function addMessage(name: string, content: string): Promise<void> {
  const trimmedName = name.trim()
  const trimmedContent = content.trim()

  if (!trimmedName || trimmedName.length > 50) {
    throw new Error('Tên không hợp lệ (1-50 ký tự)')
  }
  if (!trimmedContent || trimmedContent.length > 500) {
    throw new Error('Lời nhắn không hợp lệ (1-500 ký tự)')
  }

  await addDoc(messagesRef, {
    name: trimmedName,
    content: trimmedContent,
    createdAt: serverTimestamp(),
  })
}
