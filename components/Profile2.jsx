import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import Nav from './Nav'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import server from '../Server'
import DateTimePicker from '@react-native-community/datetimepicker'


const Profile2 = () => {
    const navigation = useNavigation()

    const [countries, setCountries] = useState([])
    const [cities, setCities] = useState([])
    const [country, setCountry] = useState('BIH')
    const [city, setCity] = useState()
    const [poslovi, setPoslovi] = useState([])
    const [posao, setPosao] = useState('Advokat')
    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeNow, settimeNow] = useState(new Date())
    const [clickedOnDatePicker, setCODP] = useState(false)

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };   
    
    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const fetchCountries = async () => {
        try {
            const response = await axios.get(`${server}/cities/api/drzava`)
            const responseData = response.data
            setCountries(responseData)
        } catch (error) {
            console.log(error)
        }
    }
    
    const fetchCities = async (drzava) => {
        try {
            const response = await axios.get(`${server}/cities/api/cities/${drzava}`)
            const responseData = response.data
            setCities(responseData)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${server}/jobs/api/poslovi`)
            const responseData = response.data
            setPoslovi(responseData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCountries()
        fetchJobs()
    }, [])

    useEffect(() => {
        fetchCities(country)
    }, [country])

  return (
    <View style={styles.container}>
        <StatusBar style='auto' />
        <View style={styles.statusBarPadding} />
        <View style={styles.contentContainer}>
            <Image
                style={styles.logo}
                source={require('../assets/ikonica.png')}
            />
            <View style={styles.pickerContainer1}>
                <Picker
                    selectedValue={posao}
                    onValueChange={(itemValue) => setPosao(itemValue)}
                    style={styles.picker2}
                >
                    {
                        poslovi.map((job, key) => (
                            <Picker.Item label={job} value={job} key={key} />
                        ))
                    }
                </Picker>
            </View>
            <View style={styles.pickerContainer2}>
                <Picker
                    selectedValue={country}
                    onValueChange={(itemValue) => setCountry(itemValue)}
                    style={styles.picker}
                >
                    {
                        countries.map((country, key) => (
                            <Picker.Item label={country} value={country} key={key} />
                        ))
                    }
                </Picker>
                <Picker
                    selectedValue={city}
                    onValueChange={(itemValue) => setCity(itemValue)}
                    style={styles.picker}
                >
                    {
                        cities.map((citty, key) => (
                            <Picker.Item label={citty} value={citty} key={key} />
                        ))
                    }
                </Picker>
            </View>
            <View style={styles.pickerContainer3}>
                <TouchableOpacity 
                    onPress={() => {setShowDatePicker(true)}}
                    style={styles.datePickerButton}
                >
                    {
                        clickedOnDatePicker ?
                        <Text style={styles.datePickerText}>{Math.floor(((new Date().getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000)))}</Text>
                        :
                        <Text style={styles.datePickerText}>GODINE</Text>
                    }
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
                {(showDatePicker && !clickedOnDatePicker) && setCODP(true)}
            </View>
            <TouchableOpacity
                onPress={() => {navigation.navigate("Profile3", {prop: {
                    posao: posao,
                    drzava: country,
                    grad: city,
                    godine: Math.floor(((new Date().getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
                }})}}

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

    picker: {
        width: 150,
        height: 50,
        backgroundColor: '#dedede',
        margin: '5%'
    },

    pickerContainer2: {
        flexDirection: 'row',
    },

    picker2: {
        width: 335,
        backgroundColor: '#dedede',
        margin: '5%'
    },

    pickerContainer1: {
        marginTop: '20%'
    },

    gotoNextContainer: {
        backgroundColor: '#59bef2',
        marginHorizontal: 50,
        alignItems: 'center',
        paddingVertical: 11,
        borderRadius: 20,
        marginTop: '40%'
    },
  
    gotoNext: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },

    datePickerButton: {
        backgroundColor: '#dedede',
        marginHorizontal: 50,
        alignItems: 'center',
        paddingVertical: 11,
        marginTop: '5%'
    }
})

export default Profile2