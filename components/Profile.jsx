import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import server from '../Server'

const Profile = () => {
  const user = useSelector(state => state.user) // user.user._id
  const navigation = useNavigation()

  const [expert, setExpert] = useState(false)
  const [expertData, setExpertData] = useState([])

  const [imageURL, setImageURL] = useState(null)
  const [filename, setFilename] = useState(null)

  const fetchData = async () => {
    try {
      const response = await axios.get(`${server}/gather/onid/${user.user._id}`)
      const responseData = response.data
      setExpert(responseData['expert'])
      setExpertData(responseData)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchImage = async (profile_img) => {
    try {
      const imageRef = ref(storage, profile_img);
      const url = await getDownloadURL(imageRef);
      setImageURL(url);
    } catch (error) {
    }
};

const fetchImageURL = async () => {
    try {
        fetchData()
        const response = await axios.get(`${server}/gather/onid/${user.user._id}`)
        const responseData = response.data
        if(responseData['profile_img'] != 'default') {
          //console.log(responseData['profile_img'])  
          fetchImage(responseData['profile_img'])
        }
    } catch (err) {
        console.log("Error:", err)
    }
  }


  useEffect(() => {
    fetchData()

    if(expert) {
      fetchImageURL()
    }
  }, [])

  useEffect(() => {
    fetchImageURL()
  }, [navigation])

  if(!expert) {
    return (
      <View style={styles.container}>
          <StatusBar style='auto' />
          <View style={styles.statusBarPadding} />
          <View style={styles.contentContainer}>
              <Text style={styles.heading}>Pozdrav, {user.user.ime} {user.user.prezime}!</Text>
              <Text style={styles.warning}>Vaš nalog nema mogućnost pružanja usluga</Text>
              <TouchableOpacity 
                style={styles.postaniExpertContainer}
                onPress={() => {navigation.navigate("Profile2")}}
              >
                  <Text style={styles.postaniExpert}>POSTANI EXPERT</Text>
              </TouchableOpacity>
              <Text style={styles.emailHeader}>VAŠA TRENUTNA MAIL ADRESA NALOGA</Text>
              <Text style={styles.email}>{user.user.email}</Text>
          </View>
          <Nav style={styles.navBar} selected={3} />
      </View>
    )
  } else {
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
                        <Text style={[styles.boldText, styles.nameText]}>{expertData['ime']} {expertData['prezime']}</Text>
                        <View style={[styles.godineContainer, styles.razmak]}>
                            <Text style={{fontSize:15}}>Godine: </Text> 
                            <Text style={[styles.boldText, {fontSize: 15, paddingTop: 0.5}]}>{expertData['godine']}</Text>
                        </View>
                        <View style={styles.flexBox}>
                            <Text style={{fontSize:15}}>Mjesto: </Text>
                            <Text style={[styles.boldText, {fontSize: 15, paddingTop: 0.5}]}>{expertData['lokacija']}</Text>
                        </View>
                        <View style={styles.flexBox}>
                            <Text style={{fontSize:15}}>Ocjena: </Text>
                            <Text style={[styles.boldText, {fontSize: 15, paddingTop: 0.5}]}>{expertData['rating'] ? expertData['rating'].toFixed(2) : 0}</Text>
                        </View>
                        <View style={styles.flexBox}>
                            <Text style={{fontSize:15}}>Email: </Text>
                            <Text style={[styles.boldText, {fontSize: 15, paddingTop: 0.5}]}>{expertData['email']}</Text>
                        </View>
                        <View style={styles.flexBox}>
                            <Text style={{fontSize:15}}>Vaše zanimanje: </Text>
                            <Text style={[styles.boldText, {fontSize: 15, paddingTop: 0.5}]}>{expertData['zanimanje']}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.opisContainer}>
                    <Text style={{fontSize: 16}}>
                        {expertData['opis']}
                    </Text>
                </View>
                <View style={styles.portfolioContainer}>
                    <Text style={styles.portfolioHeader}>PORTFOLIO</Text>
                    <Text style={styles.portfolioContent}>{expertData['portfolio']}</Text>
                </View>
            </ScrollView>

            <Nav style={styles.navBar} selected={3} />
        </View>
      </View> 
    )
  }
  
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

    heading: {
      alignSelf: 'center',
      fontSize: 30,
      marginTop: 30,
      fontWeight: '600'
    },

    warning: {
      color: 'red',
      alignSelf: 'center',
      fontWeight: '600',
      fontSize: 22,
      textAlign: 'center',
      paddingHorizontal: 10,
      marginTop: '65%'
    },

    postaniExpertContainer: {
      backgroundColor: '#59bef2',
      marginHorizontal: 50,
      alignItems: 'center',
      paddingVertical: 11,
      borderRadius: 15,
      marginTop: '50%'
    },

    postaniExpert: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20
    },

    emailHeader: {
      alignSelf: 'center',
      marginTop: '13%',
      fontWeight: '600',
      fontSize: 16
    },

    email: {
      alignSelf: 'center',
      fontWeight: '600',
      fontSize: 16
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

export default Profile