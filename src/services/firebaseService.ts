import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  collection, 
  query, 
  onSnapshot,
  addDoc,
  setDoc,
  serverTimestamp,
  orderBy,
  limit,
  deleteDoc,
  getDocs,
  increment
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth();

// --- Types ---

export interface CrisisEvent {
  id?: string;
  crisisType: 'fire' | 'smoke' | 'intrusion' | 'panic';
  floor: number;
  roomNumber: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: any;
  status: 'active' | 'contained' | 'resolved';
  description?: string;
}

export interface RoomStatus {
  id?: string;
  roomNumber: string;
  floor: number;
  occupancyStatus: 'evacuated' | 'occupied' | 'unknown';
  hasAlert: boolean;
  lastCheckIn?: any;
}

export interface ResponderUnit {
  id?: string;
  unitId: string;
  commander: string;
  sectorId: string;
  status: 'standby' | 'patrol' | 'active' | 'evacuating';
  lastActive?: any;
}

export interface OperationalLog {
  id?: string;
  timestamp: any;
  event: string;
  source: string;
  status: string;
  category: 'system' | 'security' | 'alert' | 'hardware';
}

export interface FloorInventory {
  id?: string;
  floor: number;
  linens: number;
  safety: number;
  supplies: number;
  medical: number;
  water: number;
}

// --- Crisis Handlers ---

export const streamCrises = (callback: (crises: CrisisEvent[]) => void) => {
  const q = query(
    collection(db, 'crises'),
    orderBy('timestamp', 'desc'),
    limit(50)
  );
  return onSnapshot(q, (snapshot) => {
    const crises = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CrisisEvent));
    callback(crises);
  }, (error) => {
    console.error("Crises stream failed:", error);
  });
};

export const triggerCrisis = async (crisis: Omit<CrisisEvent, 'timestamp' | 'status'>) => {
  const docRef = await addDoc(collection(db, 'crises'), {
    ...crisis,
    timestamp: serverTimestamp(),
    status: 'active'
  });
  
  await addLog({
    event: `CRISIS ACTIVATED: ${crisis.crisisType.toUpperCase()}`,
    source: `Floor ${crisis.floor} Sensor`,
    status: 'warning',
    category: 'alert'
  });
  
  return docRef;
};

export const clearAllCrises = async () => {
  const q = query(collection(db, 'crises'));
  const snap = await getDocs(q);
  const deletePromises = snap.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);
  
  await addLog({
     event: 'SYSTEM RESET: ALL CRISES RESOLVED',
     source: 'Admin Override',
     status: 'success',
     category: 'system'
  });
};

// --- Room Handlers ---

export const streamRooms = (callback: (rooms: RoomStatus[]) => void) => {
  return onSnapshot(collection(db, 'rooms'), (snapshot) => {
    const rooms = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as RoomStatus));
    callback(rooms);
  }, (error) => {
    console.error("Rooms stream failed:", error);
  });
};

export const updateRoomStatus = async (roomId: string, status: Partial<RoomStatus>) => {
  return await setDoc(doc(db, 'rooms', roomId), status, { merge: true });
};

// --- Unit Handlers ---

export const streamUnits = (callback: (units: ResponderUnit[]) => void) => {
  return onSnapshot(collection(db, 'units'), (snapshot) => {
    const units = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ResponderUnit));
    callback(units);
  }, (error) => {
    console.error("Units stream failed:", error);
  });
};

// --- Log Handlers ---

export const streamLogs = (callback: (logs: OperationalLog[]) => void) => {
  const q = query(
    collection(db, 'logs'),
    orderBy('timestamp', 'desc'),
    limit(100)
  );
  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as OperationalLog));
    callback(logs);
  }, (error) => {
    console.error("Logs stream failed:", error);
  });
};

export const addLog = async (log: Omit<OperationalLog, 'timestamp'>) => {
  return await addDoc(collection(db, 'logs'), {
    ...log,
    timestamp: serverTimestamp()
  });
};

// --- Inventory Handlers ---

export const streamInventory = (callback: (inventory: FloorInventory[]) => void) => {
  const q = query(collection(db, 'inventory'), orderBy('floor', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const inv = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FloorInventory));
    callback(inv);
  }, (error) => {
    console.error("Inventory stream failed:", error);
  });
};

export const updateInventoryCount = async (floorId: string, resource: keyof Omit<FloorInventory, 'id' | 'floor'>, change: number) => {
  const docRef = doc(db, 'inventory', floorId);
  await setDoc(docRef, { [resource]: increment(change) }, { merge: true });
};

export const updateFloorInventory = async (floorId: string, data: Partial<FloorInventory>) => {
  const docRef = doc(db, 'inventory', floorId);
  await setDoc(docRef, data, { merge: true });
};

// --- Seed Data ---

export const seedDatabase = async () => {
  try {
    const units = [
      { unitId: 'ALPHA-01', commander: 'Vance R.', sectorId: 'Sector G', status: 'active' },
      { unitId: 'BRAVO-02', commander: 'Chen M.', sectorId: 'North Wing', status: 'patrol' },
      { unitId: 'CHARLIE-03', commander: 'Smith J.', sectorId: 'Main Lobby', status: 'standby' },
      { unitId: 'DELTA-04', commander: 'Lopez K.', sectorId: 'Sector B', status: 'evacuating' }
    ];
    for (const u of units) {
      await addDoc(collection(db, 'units'), { ...u, lastActive: serverTimestamp() });
    }

    const logs = [
      { event: 'Batch Inbound: 45 Guests', source: 'North Gate Hub', status: 'normal', category: 'system' },
      { event: 'Sensor Latency Detected', source: 'South Wing Exit B', status: 'warning', category: 'hardware' },
      { event: 'Roster Sync Complete', source: 'Automated Task', status: 'success', category: 'system' },
      { event: 'Zone Cleared: Pool Side', source: 'Manual Patrol', status: 'success', category: 'security' },
      { event: 'Hardware Self-Test', source: 'Routine Check', status: 'normal', category: 'hardware' },
      { event: 'Emergency Kit Audit', source: 'Inventory Bot', status: 'normal', category: 'security' },
      { event: 'Encryption Handshake', source: 'Main Bridge', status: 'success', category: 'system' },
      { event: 'Low Battery: Unit 04', source: 'Sector B Hub', status: 'warning', category: 'hardware' },
      { event: 'Vulnerability Scan Complete', source: 'Sentinel Core', status: 'success', category: 'security' },
      { event: 'Patrol Route Updated', source: 'Manual Admin', status: 'normal', category: 'security' },
      { event: 'Air Quality Nominal', source: 'Climate Control', status: 'success', category: 'system' },
      { event: 'CCTV Blindspot Warning', source: 'Visual Engine', status: 'warning', category: 'hardware' },
      { event: 'Resource Manifest Sync', source: 'Inventory Engine', status: 'success', category: 'system' },
      { event: 'Unauthorized Access Attempt', source: 'Server Room', status: 'warning', category: 'security' },
      { event: 'Cloud Backup Complete', source: 'Google Cloud Sync', status: 'success', category: 'system' }
    ];
    for (const l of logs) {
      await addDoc(collection(db, 'logs'), { ...l, timestamp: serverTimestamp() });
    }

    const initialRooms = [
      { id: '400', roomNumber: '400', floor: 4, occupancyStatus: 'unknown' },
      { id: '401', roomNumber: '401', floor: 4, occupancyStatus: 'unknown' },
      { id: '402', roomNumber: '402', floor: 4, occupancyStatus: 'unknown' },
      { id: '404', roomNumber: '404', floor: 4, occupancyStatus: 'unknown' },
      { id: '405', roomNumber: '405', floor: 4, occupancyStatus: 'unknown' },
      { id: '406', roomNumber: '406', floor: 4, occupancyStatus: 'unknown' },
      { id: '407', roomNumber: '407', floor: 4, occupancyStatus: 'unknown' },
      { id: '408', roomNumber: '408', floor: 4, occupancyStatus: 'unknown' },
      { id: '409', roomNumber: '409', floor: 4, occupancyStatus: 'unknown' },
      { id: '410', roomNumber: '410', floor: 4, occupancyStatus: 'unknown' },
      { id: '412', roomNumber: '412', floor: 4, occupancyStatus: 'occupied' },
      { id: '413', roomNumber: '413', floor: 4, occupancyStatus: 'unknown' },
      { id: '414', roomNumber: '414', floor: 4, occupancyStatus: 'unknown' },
      { id: '415', roomNumber: '415', floor: 4, occupancyStatus: 'unknown' },
    ];

    for (const r of initialRooms) {
      const { id, ...roomData } = r;
      await setDoc(doc(db, 'rooms', id), roomData);
    }

    const initialInventory = [
      { id: 'floor-1', floor: 1, linens: 85, safety: 15, supplies: 250, medical: 8, water: 160 },
      { id: 'floor-2', floor: 2, linens: 80, safety: 18, supplies: 240, medical: 9, water: 155 },
      { id: 'floor-3', floor: 3, linens: 90, safety: 16, supplies: 260, medical: 7, water: 170 },
      { id: 'floor-4', floor: 4, linens: 85, safety: 17, supplies: 245, medical: 10, water: 165 },
      { id: 'floor-5', floor: 5, linens: 80, safety: 19, supplies: 245, medical: 8, water: 150 }
    ];
    for (const inv of initialInventory) {
      const { id, ...invData } = inv;
      await setDoc(doc(db, 'inventory', id), invData);
    }

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Database seed failed:", error);
    throw error;
  }
};

// --- Auth Helpers ---

export const loginAdmin = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const registerAdmin = async (email: string, pass: string) => {
  return await createUserWithEmailAndPassword(auth, email, pass);
};

export const logoutUser = async () => {
  return await signOut(auth);
};
