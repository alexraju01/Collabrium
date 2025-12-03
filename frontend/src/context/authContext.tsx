// context/authContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

import { apiGet } from "@/lib/fetchAxios";

interface User {
	displayname: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchCurrentUser = async () => {
			const data = await apiGet<User>(`${import.meta.env.VITE_BASE_API}/user/me`); // call /api/users/me
			if (data) setUser(data);
			else setUser(null);
		};

		fetchCurrentUser();
	}, []);

	return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
