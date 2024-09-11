/*** 
 *  
 * Description: Registration page - first page and switching to the second page
 * Issues: Not long enough password error not working correctly
 * 
 * Last revision: Nikola Lukic, 01-Jan-2024
 * 
***/

// Libraries
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity, BackHandler } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

// Components (server - url of the backend)
import FinishAccount from './FinishAccount'
import server from '../Server'


const Register = () => {
    // Navigator
    const navigation = useNavigation()

    // useState objects
    const [email, setEmail] = useState('')
    const [emailTaken, setEmailTaken] = useState(false)
    const [emailCorrect, setEmailCorrect] = useState(true)
    const [passwordSafe, setPasswordSafe] = useState(true)
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)
    const onSetVisible = () => setVisible(prev => !prev)
    const [finishing, setFinishing] = useState(false)

    // Function that checks inputted data with the info in the backend and does regex-based validation
    const checkFields = async () => {
        try {
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          if(emailRegex.test(email)) {
            setEmailCorrect(true)
            const response = await axios.get(`${server}/get/${email}`);
            if (response.data.length === 0) {
              if(password.length >= 8) {
                  setEmailTaken(false)
                  setFinishing(true)
                  setPasswordSafe(true)
              } else {
                  setEmailTaken(false)
                  setFinishing(false)
                  setPasswordSafe(false)
              }
            } else {
              setFinishing(false)
              setEmailTaken(true)
            }
          } else {
            setEmailCorrect(false)
          }
        } catch (error) {
          console.error("Error checking email existence:", error);
        }
    }

      

    // Changes the functionality of the back button
    useEffect(() => {
        const backAction = () => {
            setFinishing(false)
            return true
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => backHandler.remove()
    }, [navigation])

    // If-case that is used to switch between the first screen and the second screen of the registration page
    if(!finishing) {
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
                        <Text style={styles.naslov}>NAPRAVITE NALOG</Text>
                        <TextInput 
                            placeholder='email'
                            onChangeText={newEmail => setEmail(newEmail)}
                            defaultValue={email}
                            autoCapitalize='none'
                            required

                            style={styles.inputField}
                        />
                        {
                            passwordSafe ? (
                                emailCorrect ? (
                                    emailTaken ? (<Text style={styles.errorText}>Email je zauzet.</Text>) : 
                                            (<Text style={styles.errorText}></Text>)
                                ) : (<Text style={styles.errorText}>Email nije u dobrom formatu !</Text>)
                            ) : (<Text style={styles.errorText}>Šifra mora da sadrži minimalno 8 karaktera !</Text>)
                            
                            
                        }
                        
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
                            onPress={checkFields}
                        >
                            <Text style={styles.buttonText}>DALJE</Text>
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.routerHeader}>Već imate nalog ?</Text>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("Login")
                            }}>
                                <Text style={styles.routerHandler}>prijavite se</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    } else {
        return <FinishAccount email={email} pass={password} />
    }
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
        marginTop: 120,
        fontFamily: 'UbuntuMono-Bold',
        paddingBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 3
    },

    routerHandler: {
        fontSize: 16,
        color: '#5cc4f9',
        opacity: 0.9,
        alignSelf: 'center',
        textDecorationLine: 'underline',
        fontFamily: 'UbuntuMono-Bold'
    }
})

export default Register