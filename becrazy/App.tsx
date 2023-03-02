import React, { useState, createContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";


import { useAsyncStorage } from "./hooks/useAsyncStorage";


// create the interface for the context value
interface IContext {
	token: string | null;
	setToken: React.Dispatch<React.SetStateAction<string | null>>;
}
export const MyContext = createContext({} as IContext);


export default function App() {
	// import the fucntion to use the async storage
	const { getItem, addItem } = useAsyncStorage();
	const [token, setToken] = useState<string | null>(null);
	// create a context value to pass the token to the child component
	const getterSetter = { token, setToken };

	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	useEffect(() => {
		const getToken = async () => {
			const token = await getItem("token");
			setToken(token);
		};
		void getToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (token) void addItem("token", token);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);



	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<SafeAreaProvider>
				<MyContext.Provider value={getterSetter}>
					<Navigation colorScheme={colorScheme} />
					<StatusBar />
				</MyContext.Provider>
			</SafeAreaProvider>
		);
	}
}