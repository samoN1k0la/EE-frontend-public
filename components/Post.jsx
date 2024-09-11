import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Modal, 
  TouchableWithoutFeedback,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import server from '../Server'
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase'
import Slider from '@react-native-community/slider'


const Post = (props, key) => {
  const navigation = useNavigation()

  const [sliderValue, setSliderValue] = useState(1);
  const handleSliderChange = (value) => {
    setSliderValue(Math.round(value, 2));
  };

  const [isModalVisible, setModalVisible] = useState(false)
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

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
            const response = await axios.get(`${server}/gather/onid/${props.object._id}`)
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

    /*
    {
  "ime": String,
  "prezime": String,
  "profile_img": String, // link od hostovane slike
  "lokacija": String,  // samo grad
  "password": String,
  "email": String,
  "expert": Boolean, // ako je expert true, ostala polja se popunjavaju, ako je false, po defaultu stavljas '' ili 0
  "opis": String,
  "portfolio": String,
  "rating": Number,
  "zanimanje": String,
}
    */

    const updateRating = async () => {
      try {
        axios.patch(`${server}/update/${props.object._id}`, {
          // JSON body
          rating: ((props.object.rating * props.object.rating_cnt) + (sliderValue)) / (props.object.rating_cnt + 1),
          rating_cnt: props.object.rating_cnt + 1
        })
        .then((response) =>{
          console.log(response.data)
        })
      } catch (err) {
        console.log("Error: ", err)
      }
    }

  return (
    <TouchableOpacity onPress={() => {
        navigation.navigate("PostProfile", {prop: props.object})
      }}>
      <View style={styles.resultProfile} key={key}>
            <View style={styles.resultProfileContainer1}>
            <View style={styles.resultProfilePic} >
              {
                imageURL ?
                <Image 
                    style={styles.resultImage}
                    source={{ uri: imageURL }}
                /> :
                <Image 
                    style={styles.resultImage}
                    source={require('../assets/profilePic.png')}
                />
              }
            </View>
            <Text style={styles.resultProfileRating}>{props.object.rating != null ? props.object.rating.toFixed(1) : 0}</Text>
            </View>
            <View style={styles.resultProfileContainer2}>
            <View style={styles.naslovContainer}>
            <Text style={styles.resultProfileNaslov}>
              {props.object.ime} {props.object.prezime}
            </Text>
            <TouchableOpacity 
              style={styles.ratingContainer}
              onPress={toggleModal}
              >
                <View style={styles.ratingInner}>
                    <Image 
                      source={require('../assets/star.png')}
                      style={styles.ratingIcon}
                    />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.resultProfileOpisKratki}>Opis</Text>
            <Text style={styles.resultProfileOpisDugi}>
                {props.object.opis.slice(0, 100)}
                {props.object.opis.length >= 100 ? '...' : ''}
            </Text>
            <View style={styles.resultProfileLokacija}>
                <Text style={styles.resultProfileLokacijaContent}>{props.object.lokacija}</Text>
            </View>
            </View>
    </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalInner}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalNaslov}>RATING</Text>
              <TouchableOpacity onPress={toggleModal} style={styles.closeModalContainer}>
                <Image 
                  style={styles.closeModal}
                  source={require('../assets/modalCloseIcon.png')}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                value={sliderValue}
                onValueChange={handleSliderChange}
                thumbTintColor='#000000'
                minimumTrackTintColor='#000000'
              />
              <View style={styles.ratingLabels}>
                <Text style={styles.ratingLabel}>1</Text>
                <Text style={{opacity: 0.6, fontSize: 15.5, paddingTop: 1.8, marginLeft: 7.5}}>{sliderValue}</Text>
                <Text style={styles.ratingLabel}>10</Text>
              </View>
              <TouchableOpacity 
                style={styles.ocijeniContainer}
                onPress={() => {
                  updateRating();
                  toggleModal();
                }}
              >
                <Text style={styles.ocijeni}>OCIJENI</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
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
  
    searchContainer: {
      marginTop: 14,
      flexDirection: 'row',
    },
  
    searchBar: {
      backgroundColor: '#dedede',
      padding: 2,
      paddingHorizontal: 15,
      borderRadius: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 300,
      marginLeft: 10
    },
  
    searchButtonIcon: {
      width: 22,
      height: 22,
      marginTop: 3
    },
  
    searchInput: {
      width: 235
    },
  
    filter: {
      backgroundColor: '#dedede',
      width: 29,
      height: 29,
      padding: 2,
      borderRadius: 15,
      marginLeft: 7,
      marginTop: 2
    },
  
    filterIcon: {
      width: 24,
      height: 24,
      opacity: 0.6
    },
  
    background: {
      backgroundColor: '#d9d9d9',
      marginTop: 32,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: Dimensions.get('window').height
    },
  
    resultProfile: {
      backgroundColor: 'white',
      marginTop: 17,
      marginHorizontal: 30,
      height: 187,
      borderRadius: 8,
      flexDirection: 'row'
    },
  
    resultProfilePic: {
      width: 90,
      height: 90,
      backgroundColor: 'gray',
      borderRadius: 100,
      margin: 10
    },
  
    resultProfileRating: {
      fontSize: 40,
      fontWeight: 'bold',
      alignSelf: 'center'
    },
  
    resultProfileContainer1: {
      width: 110
    },
  
    resultProfileContainer2: {
      width: 180
    },
  
    resultProfileNaslov: {
      fontSize: 19,
      fontWeight: 'bold',
      marginTop: 10,
    }, 
  
    resultProfileOpisDugi: {
      fontSize: 12,
      opacity: 0.65
    },
  
    resultProfileOpisKratki: {
      marginBottom: 7,
      marginTop: 7
    },
  
    resultProfileLokacija: {
      position: 'absolute',
      right: 10,
      bottom: 10,
      backgroundColor: '#48494b',
      paddingHorizontal: 12,
      paddingVertical: 3,
      borderRadius: 20
    }, 
  
    resultProfileLokacijaContent: {
      color: 'white',
      fontSize: 13
    },

    resultImage: {
      width: 90,
      height: 90,
      borderRadius: 100,
    },

    ratingIcon: {
      width: 32,
      height: 32
    },

    ratingContainer: {
    },

    ratingInner: {
      padding: 2,
      borderRadius: 10,
    },

    modalContent: {
      backgroundColor: '#dedede',
      height: 200,
      width: 300,
      top: 300,
      alignSelf: 'center',
      elevation: 5,
      padding: 10
    },

    closeModal: {
      width: 32,
      height: 32
    },

    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },

    modalNaslov: {
      fontSize: 20,
      marginTop: 1,
      marginLeft: '38%',
      fontWeight: '600'
    },

    slider: {
      width: 250,
      alignSelf: 'center',
      marginTop: '15%'
    },

    ratingLabels: {
      width: 250,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 25
    },
  
    ratingLabel: {
      fontWeight: 'bold',
      fontSize: 17
    }, 

    ocijeni: {
      fontWeight: '600',
      padding: 5,
      fontSize: 16,
      borderRadius: 15,
      paddingHorizontal: 15,
      borderColor: '#007ebe',
      backgroundColor: '#007ebe',
      borderWidth: 2,
      color: 'white'
    },

    ocijeniContainer: {
      alignSelf: 'center',
      marginTop: '8%'
    },

    naslovContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    }
  })

export default Post