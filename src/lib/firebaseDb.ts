import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebaseApp';

const db = getFirestore(app);

export { db };
