import { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, TextInput, Image } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { server } from '../constants/Server';
import UserInfo from '../interfaces/UserInfo';


export default function DiscoverScreen({ navigation }: RootTabScreenProps<'Discover'>) {
  const [searchString, setSearchString] = useState('')
  const [searchResults, setSearchResults] = useState(Array<UserInfo>)

  // searchResults dummy data
  const results: Array<UserInfo> = [
    {
      username: "Jacky Chan",
      followers: 100,
      following: 200,
      posts: [
        {
          title: "Post 1",
          description: "This is the first post",
          image: "https://i.pravatar.cc/300",
          likes: 100,
          comments: 10,
          date: "2021-01-01",
        }
      ]
    },
    {
      username: "Leonardo DiCaprio",
      followers: 100,
      following: 200,
      posts: [
        {
          title: "Post 1",
          description: "This is the first post",
          image: "https://i.pravatar.cc/300",
          likes: 100,
          comments: 10,
          date: "2021-01-01",
        }
      ]
    }
  ]

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
        //setSearchResults(data)
      }
    }

    if (searchString.length > 0) {
      setSearchResults(results.filter((result: UserInfo) => result.username.includes(searchString)))
    } else {
      setSearchResults([])
    }
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
      {searchString.length > 0 && (
        <View style={styles.listContainer}>
          {searchResults.map((result: UserInfo) => {
            return (
              // list of users with their profile picture, username, and number of posts
              <View key={result.username} style={styles.list}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: 'https://i.pravatar.cc/300' }}
                  />
                  <Text style={{ marginLeft: 10 }}>{result.username}</Text>
                </View>
                <Text>{result.posts.length} posts</Text>
              </View>
            )
          })}
        </View>
      )}
      Random posts
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    marginTop: 20,
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
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  listContainer: {
    width: '90%',
    alignItems: 'center',
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    marginTop: 10,
  }
})
