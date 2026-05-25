import { LazyStore } from '@tauri-apps/plugin-store';

// This creates (or loads) a secure local file named data.json in the OS AppData folder.
const store = new LazyStore('data.json');

export interface MockUser {
  email: string;
  role: string;
  permissions: string[];
}

export interface Delegation {
  internEmail: string;
  matterId: string;
}

export interface IntegrationConfig {
  googleWorkspace?: {
    apiKey: string;
    connected: boolean;
  };
  whatsapp?: {
    webhookUrl: string;
    connected: boolean;
  };
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

export async function addUser(email: string, role: string, permissions: string[] = []): Promise<void> {
  const users = await getUsers();
  if (!users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    users.push({ email, role, permissions });
    await store.set('users', users);
    await store.save();
  }
}

export async function updateUser(originalEmail: string, newEmail: string, role: string, permissions: string[] = []): Promise<void> {
  const users = await getUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === originalEmail.toLowerCase());
  if (index !== -1) {
    users[index] = { email: newEmail, role, permissions };
    await store.set('users', users);
    await store.save();
  }
}

export async function deleteUser(email: string): Promise<void> {
  const users = await getUsers();
  const filteredUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
  await store.set('users', filteredUsers);
  await store.save();
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

export async function getIntegrationConfig(): Promise<IntegrationConfig> {
  try {
    const config = await store.get<IntegrationConfig>('integrations');
    return config || {};
  } catch (error) {
    console.error("Failed to get integration config from local DB", error);
    return {};
  }
}

export async function setIntegrationConfig(config: IntegrationConfig): Promise<void> {
  await store.set('integrations', config);
  await store.save();
}
