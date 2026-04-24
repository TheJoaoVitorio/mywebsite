import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface ToolItem {
    id: string;
    title: string;
    link: string;
    html: string;
    css: string;
    spanDesktop: number;
    spanTablet: number;
    spanMobile: number;
    order: number;
}

const COLLECTION_NAME = "tools";

export const getTools = async (): Promise<ToolItem[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const tools: ToolItem[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tools.push({
                id: doc.id,
                title: data.title || "",
                link: data.link || "",
                html: data.html || "",
                css: data.css || "",
                spanDesktop: data.spanDesktop || 3,
                spanTablet: data.spanTablet || 6,
                spanMobile: data.spanMobile || 1,
                order: data.order || 0
            });
        });
        return tools;
    } catch (error) {
        console.error("Error fetching tools:", error);
        return [];
    }
};

export const subscribeToTools = (onUpdate: (tools: ToolItem[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
    return onSnapshot(q, (querySnapshot) => {
        const tools: ToolItem[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tools.push({
                id: doc.id,
                title: data.title || "",
                link: data.link || "",
                html: data.html || "",
                css: data.css || "",
                spanDesktop: data.spanDesktop || 3,
                spanTablet: data.spanTablet || 6,
                spanMobile: data.spanMobile || 1,
                order: data.order || 0
            });
        });
        onUpdate(tools);
    });
};

export const addTool = async (tool: Omit<ToolItem, 'id'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), tool);
        return docRef.id;
    } catch (error) {
        console.error("Error adding tool:", error);
        throw error;
    }
};

export const updateTool = async (id: string, tool: Partial<ToolItem>): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, { ...tool });
    } catch (error) {
        console.error("Error updating tool:", error);
        throw error;
    }
};

export const deleteTool = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting tool:", error);
        throw error;
    }
};
