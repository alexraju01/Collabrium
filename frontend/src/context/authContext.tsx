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
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	setUser: () => {},
	logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchCurrentUser = async () => {
			const data = await apiGet<User>("/user/me");
			if (data) setUser(data);
			else setUser(null);
		};

		fetchCurrentUser();
	}, []);
	const logout = async () => {
		await apiGet("/user/logout");
		setUser(null); // clear user data
	};

	return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
