import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, ScrollView } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { server } from '../constants/Server';

type User = {
  name: string;
  likes: number;
};

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const [sortedData, setSortedData] = useState<User[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);

  useEffect(() => {
    async function getTop10() {
        const urlTop10Media= `${server}/top10Media`;
        const resultTop10 = await fetch(urlTop10Media, {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });
        if (resultTop10.ok) {
            const data = await resultTop10.json();
            setLeaderboard(data);
            console.log(data)
        } else {
            console.log("une erreur s'est produite");
        }
    }
    getTop10().then(() => console.log('done getTop10 Media'));
}, []);

  useEffect(() => {
    const sorted = [...leaderboard]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);
    setSortedData(sorted);
  }, [leaderboard]);
  



  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View style={styles.container} />
        <Text style={styles.challengeTitle}>Daily Challenge</Text>
        <View style={[styles.challenge]}>
          <Text style={styles.challengeDaily}>Voler un sans-abris </Text>
        </View>
        <View>
          <View>
            <Text style={styles.leaderboardTitle}>Top 10 Daily Challenge</Text>
            <View style={styles.table}>
              <View style={[styles.row, styles.headerRow]}>
                <View style={[styles.cell, styles.rankCell]}><Text style={styles.headerText}>Rank</Text></View>
                <View style={[styles.cell, styles.nameCell]}><Text style={styles.headerText}>Username</Text></View>
                <View style={[styles.cell, styles.likesCell]}><Text style={styles.headerText}>Likes</Text></View>
              </View>
              {sortedData.map((user, index) => (
                <View key={index} style={[styles.row, index % 2 == 0 ? styles.evenRow : styles.oddRow]}>
                  <View style={[styles.cell, styles.rankCell]}><Text>{index + 1}</Text></View>
                  <View style={[styles.cell, styles.nameCell]}><Text>{user.name}</Text></View>
                  <View style={[styles.cell, styles.likesCell]}><Text>{user.likes}</Text></View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  leaderboardTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: 800,
    boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)'
  },
  challenge: {
    borderWidth: 3,
    borderColor: '#ddd',
    textAlign: 'center',
    alignItems: 'center',
    padding: 50,
    width: 500,
    marginBottom: 25,
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  headerRow: {
    backgroundColor: '#f0f0f0'
  },
  evenRow: {
    backgroundColor: '#f9f9f9'
  },
  oddRow: {
    backgroundColor: '#fff'
  },
  cell: {
    padding: 10,
    },
  rankCell: {
    width: 80
  },
  nameCell: {
    flex: 1,
    width: 200
  },
  likesCell: {
    width: 200
  },
  headerText: {
    fontWeight: 'bold'
  },
  challengeTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 10,
    marginBottom: 5
  },
  challengeDaily: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    paddingBottom: 10,
    margin: 5,
    maxwidth: 450
  }

});
