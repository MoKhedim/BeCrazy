import { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, TextInput, Image, TouchableOpacity, ImageBackground, useColorScheme, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { server } from '../constants/Server';
import UserInfo from '../interfaces/UserInfo';
import UserInfoFull from '../interfaces/media/UserInfoFull';
import Colors from '../constants/Colors';


export default function DiscoverScreen({ navigation }: RootTabScreenProps<'Discover'>) {
  const [searchString, setSearchString] = useState('')
  const [searchResults, setSearchResults] = useState(Array<UserInfoFull>)


  // state to determine if the user can reserach to prevent spamming
  const [canEdit, setCanEdit] = useState(true)

  async function fetchResults() {
      const res = await fetch(`${server}/searchUser/${searchString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await res.json();
      setSearchResults(data)
      console.log(searchResults)
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
           
            value={searchString}
            editable={canEdit}
            selectTextOnFocus={canEdit}
            onChangeText={(text) => setSearchString(text)}
          />
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() => console.log('search')}>
            <Text style={[styles.alignCenter ]} onPress={fetchResults} >Search</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.separator, { "backgroundColor": useColorScheme() === "light" ? "black" : "white" }]} />
        {searchResults.length > 0 && (
          <View style={[styles.listContainer]}>
            {searchResults.map((result: UserInfoFull) => {
              return (
                // list of users with their profile picture, username, and number of posts
                <View key={result.username} style={styles.list}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                      source={{ uri: result.profilePicture }}
                    /> 
                    <Text onPress={() => navigation.navigate ('ProfileScreen')} style={{ marginLeft: 10 }}>{result.username}</Text>
                    <Text style={{ marginLeft: 20 }}>{result.nbFollowers + " followers"}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        )}
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
