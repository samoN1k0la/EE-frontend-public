import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Button,
  Modal,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Slider from '@react-native-community/slider'
import { Picker } from '@react-native-picker/picker'


// Components
import Nav from './Nav'
import Post from './Post'

import server from '../Server'
import { getStateFromPath } from '@react-navigation/native'


const Home = () => {
  const user = useSelector(state => state.user) // user.user._id

  const [searchQuery, setSearchQuery] = useState('')
  const [objects, setObjects] = useState([])
  const [map, setMap] = useState(0)
  const [fixer, setFixer] = useState(0)
  const [isModalVisible, setModalVisible] = useState(false)
  const [sliderValue, setSliderValue] = useState(1); // Initial slider value
  const [country, setCountry] = useState('BIH')
  const [city, setCity] = useState()
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [filterApplied, setFilterApplied] = useState(1)
  const [filters, setFilters] = useState(false)
  const [filteredObjects, setFilteredObjects] = useState([])

  const handleSliderChange = (value) => {
    setSliderValue(Math.round(value, 2));
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  }

  const fetchData = async () => {       
    try {         
      const response = await axios.get(`${server}/persons`);
      const responseData = response.data
      setObjects([])
      responseData.map((res) => {
        if(res.expert) {
          if(res._id != user.user._id) {
            setObjects(prevState => [...prevState, res])
            setFixer(prev => prev + 1)
          }
          //console.log(Object.keys(objects).length)
        }
      });
      
    } catch (error) {      
      console.error("Error:", error);      
    }     
  }; 

  // Loading all profiles
  useEffect(() => {
    fetchData();
    fetchSearched();
    setObjects([]);
    setFixer(0)
    fetchCountries()
  }, []);

  useEffect(() => {
    fetchCities(country)
  }, [country])

  const fetchFiltered = async () => {
    try {
      const response = await axios.get(`${server}/${city}/${sliderValue}`);
      const filtersZNJ = response.data;
      //setFilters(filters);
      setObjects(filtersZNJ);
      
      if(searchQuery == '') {
        setObjects(filtersZNJ);
      } else {
        setObjects(filtersZNJ.filter(item => item.zanimanje === searchQuery));
        /*
        setFilters(filters.filter(item => item.zanimanje === searchQuery));
        setFilteredObjects(filters);
        console.log(filters);*/
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  useEffect(() => {
    if(filterApplied % 2 == 0) {
      setFilters(true);
    } else {
      setFilters(false);
    }
    fetchFiltered()
  }, [filterApplied])

  const fetchSearched = async () => {
    try {         
      const response = await axios.get(`${server}/${searchQuery.toLowerCase()}`);
      const responseData = response.data
      setObjects([])
      if(searchQuery.length !== 0) {
        responseData.map((res) => {
          if(res.expert) {
            if(res._id != user.user._id) {
              setObjects(prevState => [...prevState, res])
            }
            //console.log(Object.keys(objects).length)
          }
        });
      } else {
        
        setFixer(0)
        fetchData()
      }
    } catch (error) {      
      console.error("Error:", error);      
    }  
  }

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

  const handlePress = () => {
    //setModalVisible(false)
    setFilterApplied(prev => prev + 1)
  }

  
  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.statusBarPadding} />
      <View style={styles.contentContainer}>
        {
          isModalVisible && <View style={styles.filterOverlay} />
        }
        <Image 
          style={styles.logo}
          source={require('../assets/logo.png')}
        />
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput 
                  placeholder='Pretraži'
                  onChangeText={query => setSearchQuery(query)}
                  onSubmitEditing={() => {
                    filters ?
                    fetchFiltered()
                    :
                    fetchSearched()
                  }}
                  defaultValue={searchQuery}
                  autoCapitalize='none'
                  style={styles.searchInput}
              />
              <TouchableOpacity
                style={styles.searchIcon}
                onPress={() => {
                  filters ?
                  fetchFiltered()
                  :
                  fetchSearched()
                }}
              >
                <Image
                  style={styles.searchButtonIcon}
                  source={require('../assets/searchIcon.png')}
                />
              </TouchableOpacity>
          </View>
          <View style={styles.filter}>
            <TouchableOpacity onPress={toggleModal}>
              <Image
                style={filterApplied % 2 == 0 ? styles.filterIcon : styles.filterIcon}
                source={require('../assets/filterIcon.png')}
              />
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={toggleModal}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#FFF8F3', padding: 20, width: 300, height: 320 }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{verticalAlign: 'middle', flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 26, paddingLeft: 25}}>Filteri</Text>
                    <TouchableOpacity onPress={toggleModal}>
                      <Image 
                        source={require('../assets/modalCloseIcon.png')}
                        style={{width: 32, height: 32}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>Minimalna ocjena:</Text>
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
                  </View>
                  <View style={styles.dropdowns}>
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
                  <TouchableOpacity 
                    style={styles.filterButton}
                      onPress={() => {
                        
                        handlePress()
                        setModalVisible(false)
                        //handlePress()
                      }}
                  >
                    <Text style={styles.filter1}>Primeni filtere</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                  style={styles.obrisiFilterButton}
                  onPress={() => {
                    setObjects([])
                    fetchData()
                    setModalVisible(false)
                  }}>
                    <Text style={styles.filter2}>Obriši filtere</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
              <ScrollView style={styles.background}>
              {
                  map !== objects.length ?
                    objects.map((object, key) => (
                      <Post object={object} key={key} />
                    ))
                  : setMap(prev => prev + 1)
              }
              </ScrollView>
      </View>
      <View style={styles.navBarContainer}>
        <Nav style={styles.navBar} selected={1}/>
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

  searchContainer: {
    marginTop: 14,
    flexDirection: 'row',
    paddingLeft: '3%',
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

  filterOpacity: {
    width: 24,
    height: 24,
    opacity: 1
  },

  background: {
    backgroundColor: '#d9d9d9',
    marginTop: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Dimensions.get('window').height,
    marginBottom: 60
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
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  }, 

  resultProfileOpisDugi: {
    fontSize: 12,
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

  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },

  sliderLabel: {
    fontSize: 18,
    marginBottom: 2,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 19,
    marginTop: 15
  },

  slider: {
    width: 250,
  },

  ratingLabels: {
    width: 210,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20
  },

  ratingLabel: {
    fontWeight: 'bold',
    fontSize: 17
  }, 

  picker: {
    width: 150,
    height: 50,
    marginLeft: -12
  },
  selectedValue: {
    marginTop: 20,
    fontSize: 16,
  },

  dropdowns: {
    flexDirection: 'row',
  },

  filterButton: {
    backgroundColor: '#007ebe',
    borderRadius: 20,
    marginTop: 30
  },

  filter1: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 3,
    fontSize: 19,
    paddingBottom: 3,
  },

  obrisiFilterButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    marginTop: 2
  },

  filter2: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 3,
    fontSize: 19,
    paddingBottom: 3,
  },

  searchIcon: {
    width: 10,
    height: 10
  }
})

export default Home