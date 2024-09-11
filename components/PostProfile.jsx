/*** 
 *  
 * Description: User public profile
 * Issues: -
 * 
 * Last revision: Nikola Lukic, 12-Jan-2024
 * 
***/


import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import server from '../Server'


const PostProfile = () => {
    const route = useRoute()
    const {prop} = route.params
    const user = useSelector(state => state.user)
    const navigation = useNavigation()

    const [imageURL, setImageURL] = useState(null)
    const [filename, setFilename] = useState(null)
    const fetchImage = async (profile_img) => {
        const imageRef = ref(storage, profile_img);
        try {
          const url = await getDownloadURL(imageRef);
          setImageURL(url);
        } catch (error) {
          console.error('Error fetching image:', error);
        }
    };

    const fetchImageURL = async () => {
        try {
            const response = await axios.get(`${server}/gather/onid/${prop._id}`)
            const responseData = response.data
            if(responseData['profile_img'] != 'default') {
                fetchImage(responseData['profile_img'])
            }
        } catch (err) {
            console.log("Error:", err)
        }
    }

    useEffect(() => {
        fetchImageURL()
    }, [])

    return (
          <View style={styles.container}>
            <StatusBar style='auto' />
            <View style={styles.statusBarPadding} />
            <View style={styles.contentContainer}>
                <Image 
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />
                <ScrollView style={styles.background}>
                    <View style={styles.basicInfoContainer}>
                        <View style={styles.profilePicContainer}>
                            {
                                imageURL ?
                                <Image 
                                    style={styles.profilePic}
                                    source={{ uri: imageURL }}
                                /> :
                                <Image 
                                    style={styles.profilePic}
                                    source={require('../assets/profilePic.png')}
                                />
                            }
                        </View>
                        <View style={styles.profileInfoContainer}>
                            <Text style={[styles.boldText, styles.nameText]}>{prop.ime} {prop.prezime}</Text>
                            <View style={[styles.godineContainer, styles.razmak]}>
                                <Text style={{fontSize:15}}>Godine: </Text> 
                                <Text style={[styles.boldText, {fontSize: 15, paddingTop: 0.5}]}>{prop.godine}</Text>
                            </View>
                            <View style={styles.flexBox}>
                                <Text style={{fontSize:15}}>Mjesto: </Text>
                                <Text style={[styles.boldText, {fontSize: 15, paddingTop: 0.5}]}>{prop.lokacija}</Text>
                            </View>
                            <View style={styles.flexBox}>
                                <Text style={{fontSize:15}}>Ocjena: </Text>
                                <Text style={[styles.boldText, {fontSize: 15, paddingTop: 0.5}]}>{prop.rating.toFixed(1)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.opisContainer}>
                        <Text style={{fontSize: 16}}>
                            {prop.opis}
                        </Text>
                    </View>
                    <View style={styles.portfolioContainer}>
                        <Text style={styles.portfolioHeader}>PORTFOLIO</Text>
                        <Text style={styles.portfolioContent}>{prop.portfolio}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate("Chat", {
                            sender: user.user._id, 
                            receiver: prop._id, 
                            receiverName: prop.ime + ' ' + prop.prezime,
                            zanimanje: prop.zanimanje,
                            image: '../assets/profilePic.png'
                        })}
                    >
                        
                        <Text style={styles.messageContent}>Pošalji poruku</Text>
                    </TouchableOpacity>
                </ScrollView>

                <Nav style={styles.navBar} />
            </View>
          </View> 
      )
}


const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
    },
  
    statusBarPadding: {
      height: Constants.statusBarHeight,
    },
  
    contentContainer: {
      height: Dimensions.get('window').height,
    },
  
    navBar: {
      position: 'absolute',
    },
  
    logo: {
      height: 60,
      width: 250,
      alignSelf: 'center'
    },
  
    background: {
      backgroundColor: '#d9d9d9',
      marginTop: 4,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: Dimensions.get('window').height,
      marginBottom: 60
    },
    
    profilePicContainer: {
        backgroundColor: '#797979',
        width: 114,
        paddingRight: 3,
        paddingLeft: 1.5,
        marginLeft: 16,
        marginTop: 33,
        flexDirection: 'row',
        verticalAlign: 'bottom',
        paddingTop: 5
    },

    profilePic: {
        width: 110,
        height: 110,
        alignSelf: 'center',
        
    },

    boldText: {
        fontWeight: 'bold'
    },

    godineContainer: {
        flexDirection: 'row'
    },

    nameText: {
        fontSize: 25
    },

    basicInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    profileInfoContainer: {
        marginTop: 29,
        marginRight: 41
    },

    razmak: {
        marginTop: 14
    },

    flexBox: {
        flexDirection: 'row'
    },

    opisContainer: {
        marginLeft: 10,
        marginTop: 28,
    },

    portfolioHeader: {
        alignSelf: 'center',
        fontSize: 18,
        marginTop: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },

    portfolioContent: {
        marginLeft: 10,
        fontSize: 18,
        marginRight: 10
    },

    button: {
        marginLeft: 20,
        marginRight: 20,
        flex: 1,
        backgroundColor: '#00a9ff',
        opacity: 0.8,
        height: 30,
        marginTop: 20,
        borderRadius: 25
    },

    messageContent: {
        alignSelf: 'center', 
        verticalAlign: 'middle', 
        height: '100%', 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 17.5
    }
  })

export default PostProfile