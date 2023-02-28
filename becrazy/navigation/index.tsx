/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, Image, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import LoginScreen from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';
import ResetPasswordScreen from '../screens/auth/ResetPassword';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import FeedScreen from '../screens/FeedScreen';
import { MyContext } from '../App';
import CameraScreen from '../screens/camera/CameraScreen';
import SavePostScreen from '../screens/camera/SavePostScreen';
import { useContext } from 'react';

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
  const colorScheme = useColorScheme();
  const { token } = useContext(MyContext);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />

      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: 'Register' }} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ title: 'Reset Password' }} />

      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />

      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={({ navigation }) => ({
        title: "Profile",
        headerRight: () => (
          <Pressable
            onPress={() => navigation.navigate('CameraScreen')}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}>
            <FontAwesome
              name="plus-square-o"
              size={25}
              style={{ marginRight: 15, color: Colors[colorScheme].text }}
            />
          </Pressable>
        ),
      })} />

      <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ title: "Camera" }} />
      <Stack.Screen name="SavePostScreen" component={SavePostScreen} options={{ title: "Save Post" }} />


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
  const navigation = useNavigation();
  const { token, setToken } = React.useContext(MyContext)

  return (
    <BottomTab.Navigator
      initialRouteName="Feed"
      // style commun du header et du navbar
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: { height: '8%' },
        tabBarIconStyle: { marginTop: 10 },
        tabBarLabelStyle: { marginBottom: 10 },
        tabBarLabelPosition: 'below-icon',
        headerTitleStyle: { fontSize: 24, fontWeight: 'bold' },
        headerLeft: () => (
          <Image source={
            // app icon placeholder
            require('../assets/images/icon.png')} style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginStart: 10,
            }} />
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            {token && (
              <View>
                <Pressable style={{ marginEnd: 20 }} onPress={() => navigation.navigate('ProfileScreen', {})}>
                  <FontAwesome name='user' size={28} color={Colors[colorScheme].text} />
                </Pressable>
              </View>
            )}
            {token ? (
              <View>
                <Pressable style={{ marginEnd: 20 }} onPress={() => { navigation.reset({ routes: [{ name: 'LoginScreen' }] }), setToken(null) }}>
                  <MaterialIcons name='logout' size={28} color={Colors[colorScheme].text} />
                </Pressable>
              </View>
            ) : (
              <View>
                <Pressable style={{ marginEnd: 20 }} onPress={() => navigation.navigate('LoginScreen')}>
                  <MaterialIcons name='login' size={28} color={Colors[colorScheme].text} />
                </Pressable>
              </View>
            )}
          </View>
        ),
      }}>
      <BottomTab.Screen
        name="Leaderboard"
        // style unique à chaque tab
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Leaderboard'>) => ({
          title: 'Leaderboard',
          headerTitle: 'Leaderboard',
          tabBarIcon: ({ color }) => <MaterialIcons name="leaderboard" size={28} color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Feed"
        component={FeedScreen}
        options={({ navigation }: RootTabScreenProps<'Feed'>) => ({
          title: 'Feed',
          headerTitle: 'Feed',
          tabBarIcon: ({ color }) => <MaterialIcons name="dynamic-feed" size={28} color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: 'Discover',
          headerTitle: 'Discover',
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
