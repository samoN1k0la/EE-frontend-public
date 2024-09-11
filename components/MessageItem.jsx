import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ref as ref2, getDownloadURL } from 'firebase/storage';
import server from '../Server'
import { database as db, storage } from '../config/firebase'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'
import Constants from 'expo-constants'
import axios from 'axios'


const MessageItem = (props, key) => {
    const navigation = useNavigation()
    const user = useSelector(state => state.user) // user.user._id

    const [imageURL, setImageURL] = useState(null)
    const [filename, setFilename] = useState(null)
    const fetchImage = async (profile_img) => {
        const imageRef = ref2(storage, profile_img);
        try {
            const url = await getDownloadURL(imageRef);
            setImageURL(url);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const fetchImageURL = async () => {
        try {
            const response = await axios.get(`${server}/gather/onid/${props.item._id}`)
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
    <TouchableOpacity
        style={styles.chatItem}
        key={key}
        onPress={() => navigation.navigate("Chat", {
            sender: user.user._id, 
            receiver: props.item._id, 
            receiverName: props.item.ime + ' ' + props.item.prezime,
            zanimanje: props.item.zanimanje,
            image: '../assets/profilePic.png'
        })}
    >
        <View style={styles.chatProfileIconContainer}>
        {
            imageURL ?
            <Image 
                style={styles.chatProfileIcon}
                source={{ uri: imageURL }}
            /> :
            <Image 
                style={styles.chatProfileIcon}
                source={require('../assets/profilePic.png')}
            />
        }
        </View>
        <View>
        <Text style={styles.chatItemHeader}>{props.item.ime} {props.item.prezime}</Text>
        <Text style={styles.chatItemLM}>
            {props.item.latestMessage.slice(0, 50)}
            {props.item.latestMessage.length >= 50 ? '...' : ''}
        </Text>
        </View>
        <View style={styles.chatItemTimeContainer}>
          <Text style={styles.chatItemTime}>{props.item.timeMSG}</Text>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
    },
  
    statusBarPadding: {
      height: Constants.statusBarHeight,
      backgroundColor: '#fff8f3',
    },
  
    contentContainer: {
      height: Dimensions.get('window').height - 60,
      backgroundColor: '#fff8f3',
    },
  
    chatItem: {
      backgroundColor: "white",
      borderColor: "#b1b1b1",
      borderRadius: 20,
      borderWidth: 0.5,
      paddingVertical: 15,
      paddingLeft: 5,
      margin: 10,
      flex: 1,
      flexDirection: 'row',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
  
    chatItemHeader: {
      fontWeight: 'bold',
      fontSize: 20,
    },
  
    chatProfileIcon: {
      width: 32,
      height: 32
    },
  
    chatProfileIconContainer: {
      justifyContent: 'space-around',
      paddingHorizontal: 15
    },
  
    chatItemLM: {
      width: 210,
      fontSize: 12,
      fontWeight: '600',
    },
  
    navBar: {
      position: 'absolute',
    },
  
    chatItemTime: {
      fontSize: 12,
      color: 'gray',
      paddingTop: 40
    },
  
    chatItemTimeContainer: {
      marginTop: -8,
      alignItems: 'flex-start'
    },
  
    logo: {
      height: 60,
      width: 250,
      alignSelf: 'center',
    },
  })

export default MessageItem