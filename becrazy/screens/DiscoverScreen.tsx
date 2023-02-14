import { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, TextInput, Image, TouchableOpacity, ImageBackground, useColorScheme } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { server } from '../constants/Server';
import UserInfo from '../interfaces/UserInfo';


export default function DiscoverScreen({ navigation }: RootTabScreenProps<'Discover'>) {
  const [searchString, setSearchString] = useState('')
  const [searchResults, setSearchResults] = useState(Array<UserInfo>)

  // state to determine if the user can reserach to prevent spamming
  const [canEdit, setCanEdit] = useState(true)

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

  const userInfo: UserInfo = {
    username: "John Doe",
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
      },
      {
        title: "Post 2",
        description: "This is the second post",
        image: "https://i.pravatar.cc/300",
        likes: 200,
        comments: 20,
        date: "2021-01-02",
      },
      {
        title: "Post 3",
        description: "This is the third post",
        image: "https://i.pravatar.cc/300",
        likes: 300,
        comments: 30,
        date: "2021-01-03",
      },
      {
        title: "Post 4",
        description: "This is the fourth post",
        image: "https://i.pravatar.cc/300",
        likes: 400,
        comments: 40,
        date: "2021-01-04",
      }
    ]
  }

  // when the search string changes, fetch the results
  /*
    const search = async () => {
      if (searchString.length > 0) {
        setCanEdit(false)
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
        setCanEdit(true)
      }
    }
  */



  useEffect(() => {
    if (searchString.length > 0) {
      if (searchResults.length === 0) {
        setSearchResults([{
          username: "Notfound",
          followers: 0,
          following: 0,
          posts: []
        }])
      }
    }
  }, [searchResults])


  const searchUser = async (event: any) => {
    if (event.key !== 'Enter') return
    if (searchString.length > 0) {
      setSearchResults(results.filter((result: UserInfo) => result.username.toLowerCase()
        .includes(searchString.toLowerCase())))
    } else {
      setSearchResults([])
    }
  }




  return (
    <View style={styles.container}>
      <View style={styles.alignCenter}>
        <View style={styles.searchSection}>
          <Entypo
            style={styles.searchIcon}
            name={canEdit ? "magnifying-glass" : "back-in-time"}
            size={20}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onKeyPress={(e) => searchUser(e)}
            value={searchString}
            editable={canEdit}
            selectTextOnFocus={canEdit}
            onChangeText={(text) => setSearchString(text)}
          />
        </View>
        {searchResults.length > 0 && (
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
        <View style={[styles.separator, { "backgroundColor": useColorScheme() === "light" ? "black" : "white" }]} />
      </View>
      <View style={styles.columns}>
        {userInfo.posts.map((post, index) => (
          <View key={index} style={styles.column}>
            <TouchableOpacity onPress={() => console.log('navigation.navigate("PostScreen")')}>
              <ImageBackground
                style={styles.image}
                source={{ uri: post.image }}>
                <Text style={styles.likes}>♥ {post.likes}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  alignCenter: {
    alignItems: 'center',
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
  },



  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  column: {
    width: "33%",
    padding: 5,
  },
  image: {
    width: "100%",
    height: 175,
  },
  likes: {
    position: "absolute",
    bottom: 10,
    right: 10,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },


  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

})
