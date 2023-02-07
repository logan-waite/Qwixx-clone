import { initializeApp } from 'firebase/app';
import {
	DocumentReference,
	getFirestore,
	runTransaction,
	Transaction,
	Firestore
} from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBDOH4aj4bLXV5UnFCc_5JhOo7jNqjoH0w',
	authDomain: 'qwixx-clone.firebaseapp.com',
	projectId: 'qwixx-clone',
	storageBucket: 'qwixx-clone.appspot.com',
	messagingSenderId: '592784811174',
	appId: '1:592784811174:web:6872fd00ce7f5d561c4067'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Run Safe Transaction function
// function setupTransactions(db: Firestore) {
// 	return async function runSafeTransactionOn<T>(
// 		docRef: DocumentReference,
// 		updateFunction: (transaction: Transaction) => Promise<T>
// 	): Promise<T> {
// 		return await runTransaction(db, async (transaction) => {
// 			try{
// 				const doc = await transaction.get(docRef);
// 				if (!doc.exists()) {
// 					throw "Game doesn't exist!";
// 				} else {
// 					return updateFunction(transaction);
// 				}
// 			}
// 		});
// 	};
// }

// export const runTransactionOn = setupTransactions(db);
