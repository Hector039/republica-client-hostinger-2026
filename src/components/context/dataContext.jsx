import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(undefined);

const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "token";

export const UserProvider = ({ children }) => {
	const [user, setUserState] = useState(() => {
		const storedUser = localStorage.getItem(USER_STORAGE_KEY);
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		return !!localStorage.getItem(TOKEN_STORAGE_KEY);
	});

	const setUser = (userData) => {
		if (userData) {
			localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
			setIsLoggedIn(true);
		} else {
			localStorage.removeItem(USER_STORAGE_KEY);
			localStorage.removeItem(TOKEN_STORAGE_KEY);
			setIsLoggedIn(false);
		}
		setUserState(userData);
	};

	const checkLoginStatus = async () => {
		try {
			const token = localStorage.getItem(TOKEN_STORAGE_KEY);
			if (!token) {
				setIsLoggedIn(false);
				return;
			}
			setIsLoggedIn(true);
		} catch (error) {
			console.error("Error validando token:", error);
			setIsLoggedIn(false);
		}
	};

	const logout = async () => {
		setUser(null);
	};

	useEffect(() => {
		checkLoginStatus();
	}, []);

	const value = {
		user,
		setUser,
		isLoggedIn,
		logout,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
	const context = useContext(UserContext);

	if (context === undefined) {
		throw new Error("useUser debe ser usado dentro de un UserProvider");
	}

	return context;
};
