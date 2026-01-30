const USERS_KEY = 'onboarding_app_users';

export const TEST_CREDENTIALS = {
    username: 'demo',
    password: 'demo123',
};

export interface StoredUser {
    username: string;
    password: string;
}

export const getUsers = (): StoredUser[] => {
    try {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const saveUser = (user: StoredUser): void => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const validateUser = (username: string, password: string): boolean => {
    if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
        return true;
    }
    const users = getUsers();
    return users.some(u => u.username === username && u.password === password);
};

export const userExists = (username: string): boolean => {
    const users = getUsers();
    return users.some(u => u.username === username);
};
