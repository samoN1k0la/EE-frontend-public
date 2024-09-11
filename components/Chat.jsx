/*** 
 *  
 * Description: Chat screen between two users
 * Issues: -
 * 
 * Last revision: Nikola Lukic, 09-Jan-2024
 * 
***/


// Libraries
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  Keyboard, 
  Image, 
  Modal,
  TouchableWithoutFeedback
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { database as db } from '../config/firebase'
import { ref, push, set, onValue, off } from 'firebase/database'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import server from '../Server'
import axios from 'axios'
import { ref as ref2, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase'


const Chat = () => {
  // Gather SenderID and ReceiverID
  const route = useRoute()
  const navigation = useNavigation()
  const {sender, receiver, receiverName, zanimanje, profilePic} = route.params

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState(null)

  const [keyboardRaised, setKeyboardRaised] = useState(false)
  const scrollViewRef = useRef()

  // Master modal
  const [isModalVisible, setModalVisible] = useState(false)
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  }

  // Slave modal
  const [isSlaveVisible, setSlaveVisible] = useState(false)
  const toggleSlave = () => {
    setSlaveVisible(!isSlaveVisible)
  }

  // Block modal
  const [isBlockVisible, setBlockVisible] = useState(false)
  const toggleBlock = () => {
    setBlockVisible(!isBlockVisible)
  }

  // Seen latest message
  const [seen, setSeen] = useState(false)

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
          const response = await axios.get(`${server}/gather/onid/${receiver}`)
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


  const sendMessage = () => {
    if(newMessage) {
      // Create a timestamp
      const timestamp = Math.floor(new Date().getTime() / 1000)

      // Push the message into Firebase realtime database
      const messageStream = ref(db, 'messages/' + (sender.localeCompare(receiver) < 0 ? sender : receiver) + '_' + (sender.localeCompare(receiver) < 0 ? receiver : sender))
      const pushMessage = push(messageStream)
      set(pushMessage, {
        sender: sender,
        receiver: receiver,
        content: newMessage,
        timestamp: timestamp
      }).then(() => {
        setNewMessage(null)
      })
    }
  }

  useEffect(() => {
    return onValue(ref(db, 'messages/' + (sender.localeCompare(receiver) < 0 ? sender : receiver) + '_' + (sender.localeCompare(receiver) < 0 ? receiver : sender)), querySnapShot => {
      let data = querySnapShot.val() || {}
      let msgs = {...data}
      setMessages(msgs)
    });

  }, [])


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardRaised(true)
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardRaised(false)
      }
    )

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  
  const blockUser = () => {
      const blacklistStream = ref(db, 'blacklist/' + (sender.localeCompare(receiver) < 0 ? sender : receiver) + '_' + (sender.localeCompare(receiver) < 0 ? receiver : sender))
      const pushBlock = push(blacklistStream)
      set(pushBlock, {
        sender: sender,
        receiver: receiver,
      })
    }


  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.statusBarPadding} />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Message")}>
            <Image 
                source={require('../assets/goBack.png')}
                style={styles.goBack}
              />
          </TouchableOpacity>
          <View style={styles.mainInfo}>
            <View style={styles.profileImageContainer}>
              {
                imageURL ?
                <Image 
                    style={styles.profileImage}
                    source={{ uri: imageURL }}
                /> :
                <Image 
                    style={styles.profileImage}
                    source={require('../assets/profilePic.png')}
                />
              }
            </View>
            <Text style={styles.mainInfoText1}>{receiverName}</Text>
            <Text style={styles.mainInfoText2}>
              {zanimanje.slice(0, 16)}
              {zanimanje.length >= 16 ? '...' : ''}
            </Text>
          </View>
          <View style={styles.filter}>
            <TouchableOpacity style={styles.mainInfoText3Container} onPress={toggleModal}>
              <Image 
                source={require('../assets/moreIcon.png')}
                style={styles.moreIcon}
              />
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={toggleModal}
            >
              <TouchableWithoutFeedback onPress={toggleModal}>
                <View style={styles.modalOverlay} />
              </TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalInner}>
                  <TouchableOpacity 
                    style={styles.upperModalContent}
                    onPress={toggleSlave}
                  >
                    <Image 
                      source={require('../assets/reportIcon.png')}
                      style={styles.reportIcon}
                    />
                    <Text style={styles.modalText}>Report</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.lowerModalContent}
                    onPress={toggleBlock}
                  > 
                    <Image 
                      source={require('../assets/blockIcon.png')}
                      style={styles.blockIcon}
                    />
                    <Text style={styles.modalText}>Block</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {
              isSlaveVisible && 
              <Modal
                animationType="fade"
                transparent={true}
                visible={isSlaveVisible}
                onRequestClose={toggleSlave}
              >
                <TouchableWithoutFeedback onPress={toggleSlave}>
                  <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.slaveContent}>
                  <View style={styles.slaveInner}>
                    <View style={styles.lajna}>
                      <Text style={styles.uspijeh}>Uspješno ste prijavili nalog</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.ok}
                      onPress={() => {toggleSlave(); toggleModal();}}
                    >
                      <Text style={styles.okTEXT}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            }
            {
              isBlockVisible && 
              <Modal
                animationType="fade"
                transparent={true}
                visible={isBlockVisible}
                onRequestClose={toggleBlock}
              >
                <TouchableWithoutFeedback>
                  <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.slaveContent}>
                  <View style={styles.slaveInner}>
                    <View style={styles.lajna}>
                      <Text style={styles.uspijeh}>Uspješno ste blokirali nalog</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.ok}
                      onPress={() => {blockUser(); toggleBlock(); toggleModal(); navigation.navigate("Home"); navigation.navigate("Message")}}
                    >
                      <Text style={styles.okTEXT}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            }
          </View>
        </View>
        <ScrollView 
          style={keyboardRaised ? styles.allMessagesKB_raised : styles.allMessagesKB_NOT_raised}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {
            Object.keys(messages).map((key) => (
              messages[key]['sender'] == sender ? (
                <View key={key} style={styles.message1}>
                  <Text style={styles.message1Text}>{messages[key]['content']}</Text>
                </View>
              ) : (
                <View key={key} style={styles.message2}>
                  <Text style={styles.message2Text}>{messages[key]['content']}</Text>
                </View>
              )
            ))
          }
        </ScrollView>

        <View style={styles.messageFieldContainer}>
          <TextInput 
              placeholder='Type a new message...'
              onChangeText={content => setNewMessage(content)}
              defaultValue={newMessage}
              autoCapitalize='none'
              style={styles.messageField}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendMessageContainer}>
            <Text style={styles.sendMessage}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set your desired background color
  },
  statusBarPadding: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Set your desired border color
    paddingTop: 30,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  allMessagesKB_raised: {
    flex: 1,
    marginBottom: 60, // Adjust based on your input field and send button heights
  },
  allMessagesKB_NOT_raised: {
    flex: 1,
  },
  message1: {
    alignSelf: 'flex-end',
    backgroundColor: '#3498db', // Sender's message background color
    padding: 10,
    borderRadius: 8,
    margin: 5,
    maxWidth: '80%', // Adjust as needed
  },
  message1Text: {
    color: '#fff', // Sender's message text color
  },
  message2: {
    alignSelf: 'flex-start',
    backgroundColor: '#ecf0f1', // Receiver's message background color
    padding: 10,
    borderRadius: 8,
    margin: 5,
    maxWidth: '80%', // Adjust as needed
  },
  message2Text: {
    color: '#000', // Receiver's message text color
  },
  messageFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd', // Set your desired border color
    padding: 10,
  },
  messageField: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd', // Set your desired border color
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendMessageContainer: {
    backgroundColor: '#3498db', // Send button background color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendMessage: {
    color: '#fff', // Send button text color
    fontWeight: 'bold',
  },

  profileImage: {
    width: 40,
    height: 40,
  },

  profileImageContainer: {
    flex: 1,
    marginLeft: 50,
  },
  
  mainInfo: {
    width: Dimensions.get('window').width - 70,
  },

  mainInfoText1: {
    alignSelf: 'center'
  },

  mainInfoText2: {
    alignSelf: 'center',
    fontSize: 10,
    opacity: 0.5
  },

  goBack: {
    width: 15,
    height: 28,
    marginTop: 6
  },

  mainInfoText3Container: {
    width: 50,
    flexDirection: 'row',
    paddingRight: 30,
    flex: 1,
  },

  moreIcon: {
    width: 24,
    height: 24,
    alignSelf: 'center'
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0)',
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    top: 40,
    right: 20
  },

  modalInner: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 0.5,
    paddingLeft: 10,
    paddingVertical: 5,
    borderRadius: 24,
    borderTopRightRadius: 4
  },

  blockIcon: {
    width: 24,
    height: 24
  },

  reportIcon: {
    width: 24,
    height: 24
  },

  upperModalContent: {
    flexDirection: 'row',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    paddingRight: 40,
    marginBottom: 5
  },

  lowerModalContent: {
    flexDirection: 'row'
  },

  modalText: {
    color: 'red',
    fontWeight: '600',
    paddingTop: 1,
    marginLeft: 5,
    fontSize: 17
  },

  slaveContent: {
    flex: 0.24,
    width: 280,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: '100%',
    elevation: 5
  },

  slaveInner: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    height: '100%',
    flex: 1
  },

  okTEXT: {
    color: 'red',
    alignSelf: 'center',
    fontSize: 19
  },

  ok: {
    paddingTop: '2%',
  },

  uspijeh: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    paddingBottom: '5%'
  },

  lajna: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5
  }

});

export default Chat