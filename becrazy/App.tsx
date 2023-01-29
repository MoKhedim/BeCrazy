import { useState, createContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';


import { useAsyncStorage } from "./hooks/useAsyncStorage";
import ResetPassword from './screens/auth/ResetPassword';
export const MyContext = createContext({} as any);

export default function App() {
  // import the fucntion to use the async storage
  const { getItem, addItem, removeItem } = useAsyncStorage();
  const [token, setToken] = useState<string | null>(null);
  // create a context value to pass the token to the child component
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
          <ResetPassword />
          <StatusBar />
        </MyContext.Provider>
      </SafeAreaProvider>
    );
  }
}