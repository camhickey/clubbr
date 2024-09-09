import { db } from '@db';
import { addDoc, collection } from 'firebase/firestore';

export async function submitSafetyReport(
  localuser: string,
  description: string,
  latitude: number,
  longitude: number,
) {
  addDoc(collection(db, 'safety'), {
    reportedBy: localuser,
    description,
    location: {
      latitude,
      longitude,
    },
    timestamp: new Date(),
  });
}
