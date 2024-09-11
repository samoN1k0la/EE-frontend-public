/*** 
 *  
 * Description: Registration page - Finish your account
 * Issues: React redux isn't integrated into FinishAccount at all
 * 
 * Last revision: Nikola Lukic, 03-Jan-2024
 * 
***/


// Libraries
import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity, Button } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database"
import { auth, database } from "../config/firebase";

// Backend URL
import server from '../Server'


const FinishAccount = ({ email, pass }) => {
    // Stack navigator
    const navigation = useNavigation()
    
    // Data that the user inputs into the text fields (first name and last name)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    // Submiting user data to the backend (creating a user in MongoDB and Firebase)
    const submitInfo = async () => {
        try {
          const payload = {
            ime: firstName,
            prezime: lastName,
            profile_img: '',
            email: email,
            password: pass,
            lokacija: '',
            expert: false,
            opis: '',
            portfolio: '',
            rating: 0,
            zanimanje: '',
            godine: 0
          }

          const response = await axios.post(`${server}/expert_post`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
          })

          if(response.status >= 200 && response.status < 300) {
            // Success upon adding the user into MongoDB
            if(response.data && response.data._id) {
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                    const user = userCredential.user;
                    const userRef = ref(database, 'users/' + user.uid)
                    set(userRef, {
                        username: firstName + ' ' + lastName,
                        email: email
                    })

                    // Success upon adding the user into Firebase
                    navigation.navigate("Login");
                } catch (err) {
                    console.log("Error adding the user into Firebase", err.message)
                }
            }
          }

        } catch (error) {
          console.error("Error creating new account:", error);
        }
    }

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
                    <Text style={styles.naslov}>UNESITE PODATKE</Text>
                    <TextInput 
                        placeholder='ime'
                        defaultValue={firstName}
                        onChangeText={ime => setFirstName(ime)}
                        required
                        style={styles.inputField}
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput 
                            placeholder='prezime'
                            defaultValue={lastName}
                            onChangeText={prezime => setLastName(prezime)}
                            required
                            style={styles.passwordField}
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.buttonNext} 
                        onPress={submitInfo}
                    >
                        <Text style={styles.buttonText}>ZAVRŠI</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.routerHeader}>Već imate nalog ?</Text>
                        <TouchableOpacity onPress={() => {
                                navigation.navigate("Login")
                            }}>
                            <Text style={styles.routerHandler}>Prijavite se</Text>
                        </TouchableOpacity>
                    </View>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00a9ff',
        opacity: 0.85,
        letterSpacing: 1.15,
        alignSelf: 'center',
        fontFamily: 'Ubuntu-Regular'
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
        marginTop: 6
    },

    routerHeader: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#00a9ff',
        opacity: 0.9,
        alignSelf: 'center',
        marginTop: 120
    },

    routerHandler: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#5cc4f9',
        opacity: 0.9,
        alignSelf: 'center',
        textDecorationLine: 'underline',
    }
})

export default FinishAccount