import AsyncStorage from "@react-native-async-storage/async-storage";


// this is the hook responsible for using the async storage
export const useAsyncStorage = () => {
	// get the item from storage and return String or null
	const getItem = async (key: string): Promise<string | null> => {
		try {
			const value = await AsyncStorage.getItem(key);
			return value;
		} catch (e) {
			
			return null;
		}
	};

	// add the item to storage
	const addItem = async (key: string, value: string) => {
		try {
			await AsyncStorage.setItem(key, value);
		} catch (e) {
			
		}
	};

	// remove the item from storage
	const removeItem = async (key: string) => {
		try {
			const value = await AsyncStorage.removeItem(key);
			return value;
		} catch (e) {
			
			return null;
		}
	};

	return { getItem, addItem, removeItem };
};