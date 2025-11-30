import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserContextType {
    userId: string | null;
}

const UserContext = createContext<UserContextType>({ userId: null });

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Check for existing ID
        let storedId = localStorage.getItem('safeharbor_user_id');

        if (!storedId) {
            // Generate new ID (simple random string for now, UUID-like)
            storedId = crypto.randomUUID();
            localStorage.setItem('safeharbor_user_id', storedId);
        }

        setUserId(storedId);
    }, []);

    return (
        <UserContext.Provider value={{ userId }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
