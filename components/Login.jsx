/*** 
 *  
 * Description: Login page
 * Issues: -
 * 
 * Last revision: Nikola Lukic, 02-Jan-2024
 * 
***/

// Libraries
import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";


// Components (not JSX)
import store from '../store/Store'
import server from '../Server'
import Loader from './Loader'


const Login = () => {
    // React navigation object
    const navigation = useNavigation()

    // useState objects
    const [email, setEmail] = useState('')                    // Email
    const [password, setPassword] = useState('')              // Password
    const [visible, setVisible] = useState(false)             // Is password field content stars or text
    const onSetVisible = () => setVisible(prev => !prev)      // Changing password field icon
    const [incorrect, setIncorrect] = useState(false)         // Handling error upon login
    const [clickedLogin, setClickedLogin] = useState(false)   // Handling whether LOGIN button has been clicked or not

    // This fixes a bug with hot-reloading (rest on line 42)
    const isInitialMount = useRef(true)

    useEffect(() => {

      // This fixes a bug with hot-reloading
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      // Fetching data from the input fields and checking whether an account with that data exists in the database
      // if YES: navigate the user to home and dispatch account's data for further use
      // if NO: show error message
      const fetchData = async () => {       
        try {         
          const response = await axios.get(`${server}/get/${email}`)
          
          if(response.data != "") {
            const user = response.data[0]
            const userPassword = user.password
            
            if(userPassword == password) {
              const userData = {
                email: email,
                password: password,
                _id: user._id,
                ime: user.ime,
                prezime: user.prezime
              };
              

              signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                  store.dispatch({ type: 'LOGIN', payload: userData })
                  navigation.navigate("Home")
                })
                .catch((err) => console.log("Login error:", err.message));

            } else {
              setIncorrect(true)
            }
          } else {
            setIncorrect(true)
          }
        } catch (error) {      
          console.error("Error logging in:", error)    
        }     
      }     
      fetchData()
    }, [clickedLogin])

    return (
      <View style={styles.container}>
          <StatusBar style='auto' />
          <View style={styles.statusBarPadding} />
          <View style={styles.contentContainer}>
            <View style={styles.formContainer}>
                  <Image
                      style={styles.logo}
                      source={require('../assets/ikonica.png')}
                  />
                  <Text style={styles.naslov}>LOGIN</Text>
                  <TextInput 
                      placeholder='email'
                      onChangeText={newEmail => setEmail(newEmail)}
                      defaultValue={email}
                      autoCapitalize='none'
                      required

                      style={styles.inputField}
                  />
                  
                  <View style={styles.passwordContainer}>
                      <TextInput 
                          placeholder='password'
                          onChangeText={pass => setPassword(pass)}
                          defaultValue={password}
                          autoCapitalize='none'
                          required
                          secureTextEntry={!visible}
                          style={styles.passwordField}
                      />
                      <TouchableOpacity onPress={onSetVisible}>
                          <Image
                              style={styles.showPass}
                              source={ !visible ? require('../assets/oko.png') : 
                                              require('../assets/neoko.png')}
                          />
                      </TouchableOpacity>
                  </View>
                  <TouchableOpacity 
                      style={styles.buttonNext} 
                      onPress={() => {
                        setClickedLogin(prev => !prev)

                    }}
                  >
                      <Text style={styles.buttonText}>LOGIN</Text>
                  </TouchableOpacity>
                  {
                    (clickedLogin && !incorrect) ? <Loader /> : null
                  }
                  {
                    incorrect ? <Text style={styles.incorrectData}>Pogrešan email ili šifra !</Text> :
                                 <Text style={styles.incorrectData}></Text>
                  }
                  {
                    (clickedLogin && !incorrect) ?
                    <View style={styles.routerHeaderContainer}>
                      <Text style={styles.routerHeader}>Nemate nalog ?</Text>
                      <TouchableOpacity onPress={() => {
                              navigation.navigate("Register")
                          }}>
                          <Text style={styles.routerHandler}>registrujte se</Text>
                      </TouchableOpacity>
                    </View> :
                    <View>
                      <Text style={styles.routerHeader}>Nemate nalog ?</Text>
                      <TouchableOpacity onPress={() => {
                              navigation.navigate("Register")
                          }}>
                          <Text style={styles.routerHandler}>registrujte se</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  
              </View>
          </View>
      </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#BEBDB8',
    },

    contentContainer: {
        backgroundColor: '#BEBDB8',
        height: Dimensions.get('window').height,
        paddingHorizontal: 25,
        paddingVertical: 30,
        
    },

    formContainer: {
        backgroundColor: '#DEDEDE',
        borderRadius: 30,
        paddingTop: 40,
        flex: 1,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        elevation: 5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 }
    },

    statusBarPadding: {
        height: Constants.statusBarHeight,
    },

    logo: {
        width: 63*1.5,
        height: 87*1.5,
        alignSelf: 'center'
    },

    naslov: {
        fontSize: 22,
        color: '#00a9ff',
        opacity: 0.85,
        letterSpacing: 1.15,
        alignSelf: 'center',
        fontFamily: 'Ubuntu-Bold'
    },

    inputField: {
        backgroundColor: '#cccccc',
        color: '#000000',
        paddingLeft: 10,
        paddingVertical: 6,
        borderRadius: 15,
        width: 270,
        fontSize: 18,
        marginTop: 34,
        paddingRight: 5,
        alignSelf: 'center',
        fontFamily: 'Ubuntu-Regular'
    },

    passwordField: {
        color: '#000000',
        paddingLeft: 10,
        fontSize: 18,
        paddingRight: 5,
        flex: 1,
        fontFamily: 'Ubuntu-Regular'
    },

    showPass: {
        width: 22,
        height: 22,
        marginRight: 10
    },

    passwordContainer: {
        backgroundColor: '#cccccc',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        width: 270,
        height: 40,
        marginTop: 24,
        alignSelf: 'center'
    },

    errorText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#ff0000',
        opacity: 0.85,
        marginBottom: -16,
        marginLeft: 28
    },

    buttonNext: {
        borderRadius: 15,
        backgroundColor: '#59bef2',
        height: 50,
        width: 270,
        alignSelf: 'center',
        marginTop: 100
    },

    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 25,
        alignSelf: 'center',
        marginTop: 6,
        fontFamily: 'Ubuntu-Regular'
    },

    routerHeader: {
      fontSize: 17,
      color: '#00a9ff',
      opacity: 0.9,
      alignSelf: 'center',
      marginTop: 80,
      fontFamily: 'UbuntuMono-Bold',
      paddingBottom: 5,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 3
  },

  routerHeaderContainer: {
    marginTop: -30
  },

  routerHandler: {
      fontSize: 16,
      color: '#5cc4f9',
      opacity: 0.9,
      alignSelf: 'center',
      textDecorationLine: 'underline',
      fontFamily: 'UbuntuMono-Bold'
  },

  incorrectData: {
    alignSelf: 'center',
    paddingTop: 12,
    fontFamily: 'Ubuntu-Bold',
    color: '#ff0000',
    fontSize: 15
  }
})

export default Login