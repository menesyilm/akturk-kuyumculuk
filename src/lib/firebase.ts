import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebaseApp';
import { db } from '@/lib/firebaseDb';

const auth = getAuth(app);

export { app, db, auth };
