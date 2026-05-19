import { LazyStore } from '@tauri-apps/plugin-store';

// This creates (or loads) a secure local file named data.json in the OS AppData folder.
const store = new LazyStore('data.json');

export interface MockUser {
  email: string;
  role: string;
}

export interface Delegation {
  internEmail: string;
  matterId: string;
}

export async function getUsers(): Promise<MockUser[]> {
  try {
    const users = await store.get<MockUser[]>('users');
    return users || [];
  } catch (error) {
    console.error("Failed to get users from local DB", error);
    return [];
  }
}

export async function addUser(email: string, role: string): Promise<void> {
  const users = await getUsers();
  if (!users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    users.push({ email, role });
    await store.set('users', users);
    await store.save();
  }
}

export async function getDelegations(lawyerEmail: string): Promise<Delegation[]> {
  try {
    const delegations = await store.get<Record<string, Delegation[]>>('delegations');
    return (delegations && delegations[lawyerEmail]) || [];
  } catch (error) {
    console.error("Failed to get delegations from local DB", error);
    return [];
  }
}

export async function getAllDelegations(): Promise<Record<string, Delegation[]>> {
  try {
    const delegations = await store.get<Record<string, Delegation[]>>('delegations');
    return delegations || {};
  } catch (error) {
    console.error("Failed to get all delegations from local DB", error);
    return {};
  }
}

export async function addDelegation(lawyerEmail: string, internEmail: string, matterId: string): Promise<void> {
  const delegations = await getAllDelegations();
  if (!delegations[lawyerEmail]) {
    delegations[lawyerEmail] = [];
  }
  
  if (!delegations[lawyerEmail].find(d => d.internEmail === internEmail && d.matterId === matterId)) {
    delegations[lawyerEmail].push({ internEmail, matterId });
    await store.set('delegations', delegations);
    await store.save();
  }
}
