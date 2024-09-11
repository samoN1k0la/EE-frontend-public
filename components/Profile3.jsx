import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import Nav from './Nav'


const Profile3 = () => {
    const route = useRoute()
    const {prop} = route.params
    const navigation = useNavigation()

    const [description, setDescription] = useState('')

    const handleSubmit = () => {
        if (description.trim() === '') {
        } else {
           navigation.navigate("Profile4", {prop: {
            posao: prop.posao,
            drzava: prop.drzava,
            grad: prop.grad,
            description: description,
            godine: prop.godine
        }})
        }
      };

  return (
    <View style={styles.container}>
        <StatusBar style='auto' />
        <View style={styles.statusBarPadding} />
        <View style={styles.contentContainer}>
            <Image
                style={styles.logo}
                source={require('../assets/ikonica.png')}
            />
            <Text style={styles.heading}>Dodajte opis vašeg profila</Text>
            <View style={styles.textAreaContainer}>
                <TextInput
                    style={styles.textArea}
                    multiline={true}
                    numberOfLines={8}
                    placeholder="Unesite kratak opis o sebi..."
                    onChangeText={(value) => setDescription(value)}
                    value={description}
                />
            </View>
            <TouchableOpacity
                onPress={handleSubmit}

                style={styles.gotoNextContainer}
            >
                <Text style={styles.gotoNext}>DALJE</Text>
            </TouchableOpacity>
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

    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
        height: 300
    },

    textAreaContainer: {
        flex: 0.8,
        justifyContent: 'center',
        paddingHorizontal: 16,
        height: 300
    },

    gotoNextContainer: {
        backgroundColor: '#59bef2',
        marginHorizontal: 50,
        alignItems: 'center',
        paddingVertical: 11,
        borderRadius: 20,

    },
  
    gotoNext: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
})

export default Profile3