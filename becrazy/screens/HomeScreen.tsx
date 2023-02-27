import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { server } from '../constants/Server';
import { allMedia } from '../interfaces/media/allMedia';

  const [sortedData, setSortedData] = useState<allMedia[]>([]);
  const [leaderboard, setLeaderboard] = useState<allMedia[]>([]);
  const [aiChallenge, setAiChallenge] = useState("Voler un sans-abris");
  const [placeholderCount, setPlaceholderCount] = useState(0);


  useEffect(() => {
    async function getTop10() {
      const urlTop10Media = `${server}/top10Media`;
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
        setLeaderboard([]);
        console.log("une erreur s'est produite");
      }
    }
    async function getAiChallenge() {
      const urlAiChallenge = `${server}/aiChallenge`;
      const resultAiChallenge = await fetch(urlAiChallenge, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
      if (resultAiChallenge.ok) {
        const data = await resultAiChallenge.json();
        console.log(data)
        setAiChallenge(data);
      } else {
        console.log("une erreur s'est produite");
      }
    }
    getTop10().then(() => console.log('done getTop10 Media'));
    getAiChallenge().then(() => console.log('done getAiChallenge'));
  }, []);

  useEffect(() => {
    const sorted = [...leaderboard]
      .sort((a, b) => b.nbLikes - a.nbLikes)
      .slice(0, 10);
    setSortedData(sorted);
    setPlaceholderCount(Math.max(10 - sorted.length, 0))
  }, [leaderboard]);


export default function HomeScreen({ navigation }: RootTabScreenProps<'Leaderboard'>) {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.challengeTitle}>Daily Challenge</Text>
        <View style={[styles.challenge]}>
          <Text style={styles.challengeDaily}> {aiChallenge} </Text>
        </View>
      </View>
      <View>
        <View>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <View style={styles.leaderboard}>
            <Text style={styles.leaderboardTitle}>Top 10 Daily Challenge</Text>
            <View style={styles.table}>
              <View style={[styles.row, styles.headerRow]}>
                <View style={[styles.cell, styles.rankCell]}><Text style={styles.headerText}>Rank</Text></View>
                <View style={[styles.cell, styles.nameCell]}><Text style={styles.headerText}>Username</Text></View>
                <View style={[styles.cell, styles.likesCell]}><Text style={styles.headerText}>Likes</Text></View>
              </View>
              {sortedData.map((user, index) => (
                <View key={index} style={[styles.row, index % 2 == 0 ? styles.evenRow : styles.oddRow]}>
                  <View style={[styles.cell, styles.rankCell]}><Text style={styles.headerText}>{index + 1}</Text></View>
                  <View style={[styles.cell, styles.nameCell]} ><Text onPress={() => navigation.navigate (`ProfileScreen`)}>{user.username}</Text></View>
                  <View style={[styles.cell, styles.likesCell]}><Text>{user.nbLikes}</Text></View>
                </View>
              ))}
              {Array.from({ length: placeholderCount }).map((_, index) => (
                <View key={index + sortedData.length} style={[styles.row, index % 2 == 0 ? styles.evenRow : styles.oddRow]}>
                  <View style={[styles.cell, styles.rankCell]}><Text style={styles.headerText}>{sortedData.length + index + 1}</Text></View>
                  <View style={[styles.cell, styles.nameCell]}><Text>--------------</Text></View>
                  <View style={[styles.cell, styles.likesCell]}><Text>---</Text></View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: width > 600 ? 24 : 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: width > 600 ? '80%' : '100%',
  },
  leaderboardTitle: {
    fontWeight: 'bold',
    fontSize: width > 600 ? 20 : 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: '90%',
    marginVertical: 10,
    boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)',
  },
  challenge: {
    borderWidth: 3,
    borderColor: '#ddd',
    textAlign: 'center',
    alignItems: 'center',
    padding: width > 600 ? 20 : 10,
    width: width > 600 ? '60%' : '100%',
    marginBottom: 10,
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  cell: {
    padding: 10,
  },
  rankCell: {
    width: width > 600 ? 200 : '28%',
  },
  nameCell: {
    flex: 1,
    width: width > 600 ? 290 : '44%',
  },
  likesCell: {
    width: width > 600 ? 240 : '28%',
  },
  headerText: {
    fontWeight: 'bold',
  },
  challengeTitle: {
    fontWeight: 'bold',
    fontSize: width > 600 ? 20 : 16,
    paddingBottom: 10,
    marginBottom: 5,
  },
  challengeDaily: {
    fontSize: width > 600 ? 18 : 14,
    textAlign: 'center',
    fontWeight: '500',
    paddingBottom: 10,
    margin: 5,
    maxWidth: width > 600 ? 450 : 300,
  },
  leaderboard: {  
    alignItems: 'center',
  },

});
