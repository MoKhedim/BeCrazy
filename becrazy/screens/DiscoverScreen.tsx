import { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { server } from '../constants/Server';


export default function DiscoverScreen({ navigation }: RootTabScreenProps<'Discover'>) {
  const [searchString, setSearchString] = useState('')
  const [searchResults, setSearchResults] = useState([])

  // when the search string changes, fetch the results
  useEffect(() => {
    const search = async () => {
      if (searchString.length > 0) {
        const res = await fetch(`${server}/searchUser/${searchString}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            search: searchString
          })
        });
        const data = await res.json();
        setSearchResults(data)
      }
    }

    search()
  }, [searchString])


  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Entypo style={styles.searchIcon} name="magnifying-glass" size={20} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(searchString: string) => setSearchString(searchString)}
          value={searchString}
        />
      </View>
      {searchResults.map((result: any) => {
        return (
          <Text>{result.username}</Text>
        )
      })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '90%',
    height: 40,
    borderRadius: 20,
    borderColor: '#000',
    borderWidth: 1,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#424242',
    borderRadius: 20,
    height: 37,
    borderColor: '#E9E9EF',
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
})
