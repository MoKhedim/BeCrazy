import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('../assets/images/favicon.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    margin: 20,
  },
})