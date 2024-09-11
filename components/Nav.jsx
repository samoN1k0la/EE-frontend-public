import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'


const Nav = (props) => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.touchFix}
        onPress={() => {navigation.navigate("Home")}}
      >
        <View style={styles.homeIconContainer}>
            <Image
                style={styles.homeIcon}
                source={props.selected == 1 ? require('../assets/homeIconClicked.png') :
                                        require('../assets/homeIcon.png')}
            />
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.touchFix}
        onPress={() => {navigation.navigate("Message")}}
      >
        <View style={styles.chatIconContainer}>
            <Image
                style={styles.chatIcon}
                source={props.selected == 2 ? require('../assets/chatIconClicked.png') :
                                        require('../assets/chatIcon.png')}
            />
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.touchFix}
        onPress={() => {navigation.navigate("Profile")}}
      >
        <View style={styles.profileIconContainer}>
            <Image
                style={styles.profileIcon}
                source={props.selected == 3 ? require('../assets/profileIconClicked.png') :
                                        require('../assets/profileIcon.png')}
            />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#00a9ff',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get('window').width - 20,
        paddingTop: 11,
        borderRadius: 100,
        marginBottom: 10,
        marginHorizontal: 10,
    },

    homeIcon: {
        width: 35,
        height: 35,
        marginLeft: 17
    },

    touchFix: {
        width: 38,
        height: 38
    },

    chatIcon: {
        width: 32,
        height: 32
    },

    profileIcon: {
        width: 32,
        height: 32,
    },

    homeIconContainer: {
        marginTop: -5 
    },

    profileIconContainer: {
        marginLeft: -17,
        marginTop: -3
    },

    chatIconContainer: {
      marginTop: -3
    }
})

export default Nav