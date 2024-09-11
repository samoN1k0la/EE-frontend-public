/*** 
 *  
 * Description: Main React file
 * Issues: -
 * 
 * Last revision: Nikola Lukic, 09-Jan-2024
 * 
***/

// Libraries
import * as React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useFonts } from 'expo-font'

// Custom components
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import PostProfile from './components/PostProfile'
import Chat from './components/Chat'
import Message from './components/Message'
import Profile from './components/Profile'
import Profile2 from './components/Profile2'
import Profile3 from './components/Profile3'
import Profile4 from './components/Profile4'
import Profile5 from './components/Profile5'

// React Redux Store & Provider
import { Provider } from 'react-redux'
import store from './store/Store'


// Stack navigator
const Stack = createNativeStackNavigator()


const App = () => {
  // Loading custom fonts
  let [fontsLoaded] = useFonts({
    'UbuntuMono-Regular': require('./assets/fonts/UbuntuMono-Regular.ttf'),
    'UbuntuMono-Italic': require('./assets/fonts/UbuntuMono-Italic.ttf'),
    'UbuntuMono-Bold': require('./assets/fonts/UbuntuMono-Bold.ttf'),
    'UbuntuMono-BoldItalic': require('./assets/fonts/UbuntuMono-BoldItalic.ttf'),
    'Ubuntu-Regular': require('./assets/fonts/Ubuntu-Regular.ttf'),
    'Ubuntu-Italic': require('./assets/fonts/Ubuntu-Italic.ttf'),
    'Ubuntu-Bold': require('./assets/fonts/Ubuntu-Bold.ttf'),
    'Ubuntu-BoldItalic': require('./assets/fonts/Ubuntu-BoldItalic.ttf'),
  })

  // Waiting for fonts to load
  if(!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>  
    )
  }

  // Navigation + Store provider
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Register" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="PostProfile" component={PostProfile} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="Message" component={Message} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Profile2" component={Profile2} />
          <Stack.Screen name="Profile3" component={Profile3} />
          <Stack.Screen name="Profile4" component={Profile4} />
          <Stack.Screen name="Profile5" component={Profile5} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App