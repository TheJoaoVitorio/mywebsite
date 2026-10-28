import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface AppItem {
    id: string;
    name: string;
    iconUrl: string;
    description: string;
    category: string;
    bannerUrl: string;
    fileSize: string;
    downloadUrl: string;
    platforms?: string[];
    screenshots?: string[];
    version?: string;
    developer?: string;
    order: number;
    createdAt?: any;
}

const COLLECTION_NAME = "apps";

export const getApps = async (): Promise<AppItem[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const apps: AppItem[] = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            apps.push({
                id: docSnap.id,
                name: data.name || "",
                iconUrl: data.iconUrl || "",
                description: data.description || "",
                category: data.category || "Geral",
                bannerUrl: data.bannerUrl || "",
                fileSize: data.fileSize || "",
                downloadUrl: data.downloadUrl || "",
                platforms: Array.isArray(data.platforms)
                    ? data.platforms
                    : (data.platform ? [data.platform] : ['Windows']),
                screenshots: Array.isArray(data.screenshots) ? data.screenshots : [],
                version: data.version || "1.0.0",
                developer: data.developer || "João Vitório",
                order: data.order !== undefined ? data.order : 0,
                createdAt: data.createdAt
            });
        });
        return apps;
    } catch (error) {
        console.error("Error fetching apps:", error);
        return [];
    }
};

export const subscribeToApps = (onUpdate: (apps: AppItem[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
    return onSnapshot(q, (querySnapshot) => {
        const apps: AppItem[] = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            apps.push({
                id: docSnap.id,
                name: data.name || "",
                iconUrl: data.iconUrl || "",
                description: data.description || "",
                category: data.category || "Geral",
                bannerUrl: data.bannerUrl || "",
                fileSize: data.fileSize || "",
                downloadUrl: data.downloadUrl || "",
                platforms: Array.isArray(data.platforms)
                    ? data.platforms
                    : (data.platform ? [data.platform] : ['Windows']),
                screenshots: Array.isArray(data.screenshots) ? data.screenshots : [],
                version: data.version || "1.0.0",
                developer: data.developer || "João Vitório",
                order: data.order !== undefined ? data.order : 0,
                createdAt: data.createdAt
            });
        });
        onUpdate(apps);
    }, (error) => {
        console.error("Error subscribing to apps:", error);
    });
};

export const addApp = async (app: Omit<AppItem, 'id'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...app,
            platforms: app.platforms || ['Windows'],
            screenshots: app.screenshots || [],
            version: app.version || "1.0.0",
            developer: app.developer || "João Vitório",
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding app:", error);
        throw error;
    }
};

export const updateApp = async (id: string, app: Partial<AppItem>): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, { ...app });
    } catch (error) {
        console.error("Error updating app:", error);
        throw error;
    }
};

export const deleteApp = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting app:", error);
        throw error;
    }
};
