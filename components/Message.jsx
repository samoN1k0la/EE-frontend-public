/*** 
 *  
 * Description: List of all chats of the current user
 * Issues: -
 * 
 * Last revision: Nikola Lukic, 09-Jan-2024
 * 
***/


// Libraries
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import { database as db, storage } from '../config/firebase'
import { ref, push, set, onValue, off } from 'firebase/database'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { ref as ref2, getDownloadURL } from 'firebase/storage';

// Components
import Nav from './Nav'
import MessageItem from './MessageItem'

// Backend URL
import server from '../Server'


const Message = () => {
    const user = useSelector(state => state.user) // user.user._id
    const navigation = useNavigation()

    const [blackList, setBlackList] = useState([])

    const [chats, setChats] = useState([])

    const fetchUserInfo = async (userID, chat_content, blackList = 0) => {
      try {
        const response = await axios.get(`${server}/gather/onid/${userID}`)
        let responseData = response.data
        const newestMessage = Object.values(chat_content).reduce((max, obj) => (obj.timestamp > max.timestamp ? obj : max), { timestamp: 0 });
        //console.log(responseData)
        
        const newestMessageDate = new Date(newestMessage['timestamp'] * 1000)
        const hours = newestMessageDate.getHours()
        const minutes = newestMessageDate.getMinutes()

        responseData = {
          ...responseData,
          latestMessage: newestMessage['content'],
          timeMSG: `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`,
          timestamp: newestMessage['timestamp'] * 1000
        }

        //console.log(userID + ' ' + user.user._id)
        const checkBL = (userID.localeCompare(user.user._id) < 0 ? userID : user.user._id) + '_' + (userID.localeCompare(user.user._id) < 0 ? user.user._id : userID)
        if(blackList != 0) {
          if(!(Object.keys(blackList).includes(checkBL))) {
            setChats((prev) => [...prev, responseData])
          }
        } else {
          setChats((prev) => [...prev, responseData])
        }

        //console.log(newestMessage['content'])
        //console.log(chat_content)
      } catch (error) {
        console.log(error)
      }
    }

    const gatherBlackList = async (temp_key, chat_content) => {
      const blacklistRef = ref(db, 'blacklist/');
      const unsubscribe = onValue(blacklistRef, (snapshot) => {
        const data = snapshot.val()
        if(data) {
          fetchUserInfo(temp_key, chat_content, data)
        } else {
          fetchUserInfo(temp_key, chat_content)
        }
      })
    }

    useEffect(() => {
      return onValue(ref(db, 'messages/'), querySnapShot => {
        let data = querySnapShot.val() || {}
        let chats_temp = {...data}

        setChats([])
        Object.keys(chats_temp).map((key) => {
          if(key.includes(user.user._id)) {
            let temp_key = key.replace(user.user._id, "")
            temp_key = temp_key.replace("_", "")
            gatherBlackList(temp_key, chats_temp[key])
          }
        })
      });
    }, [])


    return (
      <View style={styles.container}>
        <StatusBar style='auto' />
        <View style={styles.statusBarPadding} />
        <Image
          style={styles.logo}
          source={require('../assets/logo.png')}
        />
        <ScrollView style={styles.contentContainer}>
        {
            chats.sort((a, b) => a.timestamp - b.timestamp).reverse().map((item) => (
              <MessageItem 
                key={item._id}
                item={item} 
              />
            ))
          }
        </ScrollView>
        <Nav style={styles.navBar} selected={2} />
      </View>
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
    paddingLeft: 40,
    paddingTop: 40
  },

  chatItemTimeContainer: {
    marginTop: -8,
  },

  logo: {
    height: 60,
    width: 250,
    alignSelf: 'center',
  },
})

export default Message