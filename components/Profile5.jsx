import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import Nav from './Nav'
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux'
import { storage } from '../config/firebase'
import { uploadBytes, ref } from 'firebase/storage'
import 'firebase/compat/storage';
import axios from 'axios'
import server from '../Server'

const Profile5 = () => {
    const route = useRoute()
    const {prop} = route.params
    const user = useSelector(state => state.user)
    const navigation = useNavigation()

    const [image, setImage] = useState(null);

  useEffect(() => {
    // Request permission when the component mounts
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  };

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadImage(result.uri)
      setImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, user.user._id + '.png');

      await uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded to firebase successfully')
      });

      console.log('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const finish = async () => {
    // patch
    try {
        axios.patch(`${server}/update/${user.user._id}`, {
          // JSON body
          expert: true,
          profile_img: user.user._id + '.png',
          lokacija: prop.grad,
          opis: prop.description,
          portfolio: prop.portfolio,
          zanimanje: prop.posao,
          godine: prop.godine,
          rating: 1,
          rating_cnt: 0
        })
        .then((response) =>{
          console.log(response.data)
          navigation.navigate("Message")
          navigation.navigate("Profile")
          navigation.navigate("Home")
          navigation.navigate("Profile")
        })
      } catch (err) {
        console.log("Error: ", err)
      }
  }

  return (
    <View style={styles.container}>
        <StatusBar style='auto' />
        <View style={styles.statusBarPadding} />
        <View style={styles.contentContainer}>
            <Image
                style={styles.logo}
                source={require('../assets/ikonica.png')}
            />
            <Text style={styles.heading}>Podesite sliku profila</Text>
            <View>
                {image && (<Image source={{ uri: image }} style={styles.image} />)}
                {
                    image ?

                    <TouchableOpacity 
                        onPress={finish}
                        style={styles.gotoNextContainer}
                    >
                        <Text style={styles.gotoNext}>ZAVRŠITE</Text>
                    </TouchableOpacity>

                    :

                    <TouchableOpacity 
                        onPress={chooseImage}
                        style={styles.gotoNextContainer}
                    >
                        <Text style={styles.gotoNext}>Izaberite sliku</Text>
                    </TouchableOpacity>

                }
                
            </View>
        </View>
        <Nav style={styles.navBar} selected={3} />
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
        width: 180,
        height: 180,
        alignSelf: 'center',
        marginTop: 20
    },

    heading: {
        alignSelf: 'center',
        fontSize: 25,
        color: '#00a9ff',
        fontWeight: '600'
    },

    image: {
        width: 200,
        height: 200,
        marginVertical: 20,
        alignSelf: 'center',
        borderRadius: 40
      },    

      gotoNextContainer: {
        backgroundColor: '#59bef2',
        marginHorizontal: 50,
        alignItems: 'center',
        paddingVertical: 11,
        borderRadius: 20,
        marginTop: '50%'
    },
  
    gotoNext: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
})

export default Profile5