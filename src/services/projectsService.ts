import { collection, getDocs, doc, getDoc, updateDoc, increment, addDoc, deleteDoc, type DocumentData, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Define the interface to match our UI needs
export interface Project {
    id: string; // Firestore IDs are strings
    title: string;
    description: string;
    imageUrl: string;
    likes: number;
    views: number;
    tags: string[];
    details: string[];
    photos: string[];
}

const COLLECTION_NAME = "projects";

// Fetch all projects for the Home page
// Fetch all projects for the Home page
export const getProjects = async (): Promise<Project[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const projects: Project[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            projects.push({
                id: doc.id,
                title: data.title || "",
                description: data.description || "",
                imageUrl: data.imageUrl || "",
                likes: data.likes || 0,
                views: data.views || 0,
                tags: data.tags || [],
                details: data.details || [],
                photos: data.photos || []
            });
        });
        return projects;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};

// Subscribe to projects for real-time updates
export const subscribeToProjects = (onUpdate: (projects: Project[]) => void) => {
    return onSnapshot(collection(db, COLLECTION_NAME), (querySnapshot) => {
        const projects: Project[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            projects.push({
                id: doc.id,
                title: data.title || "",
                description: data.description || "",
                imageUrl: data.imageUrl || "",
                likes: data.likes || 0,
                views: data.views || 0,
                tags: data.tags || [],
                details: data.details || [],
                photos: data.photos || []
            });
        });
        onUpdate(projects);
    }, (error) => {
        console.error("Error watching projects:", error);
    });
};

// Fetch a single project by ID
export const getProjectById = async (id: string): Promise<Project | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                title: data.title || "",
                description: data.description || "",
                imageUrl: data.imageUrl || "",
                likes: data.likes || 0,
                views: data.views || 0,
                tags: data.tags || [],
                details: data.details || [],
                photos: data.photos || []
            };
        } else {
            console.log("No such project!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching project:", error);
        return null;
    }
};

// Add a new project
export const addProject = async (project: Omit<Project, 'id' | 'likes' | 'views'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...project,
            likes: 0,
            views: 0
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding project:", error);
        throw error;
    }
};

// Update an existing project
export const updateProject = async (id: string, project: Partial<Project>): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, { ...project });
    } catch (error) {
        console.error("Error updating project:", error);
        throw error;
    }
};

// Delete a project
export const deleteProject = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};

// Increment view count atomically
export const incrementViewCount = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            views: increment(1)
        });
    } catch (error) {
        console.error("Error incrementing views:", error);
    }
};

// Increment like count atomically
export const incrementLikeCount = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            likes: increment(1)
        });
    } catch (error) {
        console.error("Error incrementing likes:", error);
    }
};
