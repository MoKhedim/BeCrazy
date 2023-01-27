/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, Image, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '../components/Themed';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import FeedPage from '../screens/FeedPage';
import DiscoverScreen from '../screens/DiscoverScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: { height: 60 },
        tabBarIconStyle: { marginTop: 10 },
        tabBarLabelStyle: { marginBottom: 10 },
        tabBarLabelPosition: 'below-icon',
        headerTitleStyle: { fontSize: 30, fontWeight: 'bold' },
        headerLeft: () => (
          <Image source={
            // app icon placeholder
            require('../assets/images/icon.png')} style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginStart: 60,
            }} />
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              onPress={() => alert('need to login to post!')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <MaterialIcons
                name="post-add"
                size={28}
                color={Colors[colorScheme].text}
                style={{ marginEnd: 20, paddingTop: 5 }}
              />
            </Pressable>
            <View style={{ width: 100, marginEnd: 10 }}>
              <Pressable style={[styles.button, { borderColor: Colors[colorScheme].text }]} onPress={() => alert('work in progress!')}>
                <Text lightColor="rgba(0,0,0,0.8)"
                  darkColor="rgba(255,255,255,0.8)" style={styles.text}>Sign up</Text>
              </Pressable>
            </View>
            <View style={{ width: 80, marginEnd: 60 }}>
              <Pressable style={[styles.button, { borderColor: Colors[colorScheme].text }]} onPress={() => alert('work in progress!')}>
                <Text lightColor="rgba(0,0,0,0.8)"
                  darkColor="rgba(255,255,255,0.8)" style={styles.text}>Login</Text>
              </Pressable>
            </View>
          </View>
        ),
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: 'Home',
          headerTitle: 'BeCrazy  |  Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />,
        })}
      />
      <BottomTab.Screen
        name="FeedPage"
        component={FeedPage}
        options={({ navigation }: RootTabScreenProps<'FeedPage'>) => ({
          title: 'Feed',
          headerTitle: 'BeCrazy  |  Feed',
          tabBarIcon: ({ color }) => <MaterialIcons name="dynamic-feed" size={28} color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: 'Discover',
          headerTitle: 'BeCrazy  |  Discover',
          tabBarIcon: ({ color }) => <MaterialIcons name="supervised-user-circle" size={28} color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 10,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Century Gothic',
    fontWeight: 'bold',
  }
});
