import { useState, createContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

// Ma partie 
import Login from './screens/Login';
import { useAsyncStorage } from "./hooks/useAsyncStorage";
export const MyContext = createContext({} as any);

export default function App() {
  const { getItem, addItem, removeItem } = useAsyncStorage();
  const [token, setToken] = useState<string | null>(null);
  const getterSetter = { token, setToken}

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const getToken = async () => {
      const token = await getItem('token');
      setToken(token);
    }
    getToken();
  }, []);

  useEffect(() => {
    if (token) addItem('token', token)
  }, [token]);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <MyContext.Provider value={getterSetter}>
          {token && <Navigation colorScheme={colorScheme} />}
          {!token && <Login />}
          <StatusBar />
        </MyContext.Provider>
      </SafeAreaProvider>
    );
  }
}