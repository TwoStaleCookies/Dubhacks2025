import { db } from "@/firebase/firebaseConfig";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export type Task = { name: string; value: number };

/**
 * Ensures a Firestore document exists for the given user.
 * Should be called after registration (or first login).
 */
export async function ensureUserDoc(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      coins: 0,
      food: 0,
      tasks: [] as Task[],
      createdAt: new Date(),
    });
  }

  return ref;
}

/**
 * Set the user's coin balance to a specific value.
 * This replaces the previous increment-based behaviour.
 */
export async function addCoins(uid: string, value: number) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { coins: value });
}

/**
 * Set the user's food balance to a specific value.
 * This replaces the previous increment-based behaviour.
 */
export async function addFood(uid: string, value: number) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { food: value });
}

/**
 * Replace the entire tasks list with a new one.
 */
export async function setTasks(uid: string, tasks: Task[]) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { tasks });
}

/**
 * Add a new task to the list.
 */
export async function addTask(uid: string, task: Task) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { tasks: arrayUnion(task) });
}

/**
 * Remove a specific task from the list.
 * Must match both name and value exactly to remove.
 */
export async function removeTask(uid: string, task: Task) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { tasks: arrayRemove(task) });
}

/**
 * Get the user's current data (coins, food, tasks).
 */
export async function getUserData(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { coins: 0, food: 0, tasks: [] as Task[] };
  }

  return snap.data() as { coins: number; food: number; tasks: Task[] };
}
