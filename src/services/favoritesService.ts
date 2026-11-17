import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const FAVORITE_TYPES = ['Favoritos', 'Skills', 'UI'] as const;
export type FavoriteType = string;
export type PreviewMode = 'live' | 'screenshot' | 'none';

export interface FavoriteItem {
    id: string;
    title: string;
    url: string;
    type: FavoriteType;
    description: string;
    previewMode: PreviewMode;
    order: number;
    createdAt?: any;
}

const COLLECTION_NAME = "favorites";

const mapDoc = (id: string, data: any): FavoriteItem => ({
    id,
    title: data.title || "",
    url: data.url || "",
    type: typeof data.type === 'string' && data.type.trim() ? data.type.trim() : 'Favoritos',
    description: data.description || "",
    previewMode: data.previewMode === 'screenshot' || data.previewMode === 'none' ? data.previewMode : 'live',
    order: data.order !== undefined ? data.order : 0,
    createdAt: data.createdAt
});

const orderedQuery = () => query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));

export const getFavorites = async (): Promise<FavoriteItem[]> => {
    try {
        const snap = await getDocs(orderedQuery());
        return snap.docs.map(d => mapDoc(d.id, d.data()));
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
};

export const subscribeToFavorites = (onUpdate: (items: FavoriteItem[]) => void) => {
    return onSnapshot(orderedQuery(), (snap) => {
        onUpdate(snap.docs.map(d => mapDoc(d.id, d.data())));
    }, (error) => {
        console.error("Error subscribing to favorites:", error);
    });
};

export const addFavorite = async (item: Omit<FavoriteItem, 'id' | 'createdAt'>): Promise<string> => {
    const ref = await addDoc(collection(db, COLLECTION_NAME), { ...item, createdAt: serverTimestamp() });
    return ref.id;
};

export const updateFavorite = async (id: string, item: Partial<FavoriteItem>): Promise<void> => {
    await updateDoc(doc(db, COLLECTION_NAME, id), { ...item });
};

export const deleteFavorite = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};

/** Default categories first, then custom ones in order of appearance. */
export const collectCategories = (items: FavoriteItem[]): string[] => {
    const all: string[] = [...FAVORITE_TYPES];
    items.forEach(i => { if (!all.includes(i.type)) all.push(i.type); });
    return all;
};

export const normalizeUrl = (raw: string): string => {
    const v = raw.trim();
    if (!v) return '';
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

export const getHostname = (url: string): string => {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
};
