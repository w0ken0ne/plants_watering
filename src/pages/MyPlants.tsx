import React, {useState, useEffect} from 'react'
import { Text,View, StyleSheet, Image, FlatList, Alert} from 'react-native'
import { Header } from '../components/Header'
import colors from '../styles/colors'
import waterdrop from '../assets/waterdrop.png'
import { loadPlants, PlantProps, removePlant, StoragePlantProps } from '../libs/storage'
import { formatDistance } from 'date-fns'
import { pt } from 'date-fns/locale'
import fonts from '../styles/fonts'
import { PlantCardSecondary } from '../components/PlantCardSecondary'
import { Load } from '../components/Load'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function MyPlants(){
  const [myPlants, setMyPlants] = useState<PlantProps[]>([])
  const [loading, setLoading] = useState(true)
  const [nextWatered, setNextWatered] = useState<string>()

  useEffect(() =>{
    async function loadStorageData(){
      const plantsStored = await loadPlants()
      const nextTime = formatDistance(new Date(plantsStored[0].dateTimeNotification).getTime(),new Date().getTime(), {locale: pt})
      setNextWatered(`Não esqueça de regar a ${plantsStored[0].name} em ${nextTime} `)
      setMyPlants(plantsStored)
      setLoading(false)

    }
    loadStorageData()
  })

  async function handleRemove(plant: PlantProps){
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [{
      text: 'Não 🙏🏼',
      style: 'cancel'
    },{
      text: 'Sim ✅',
      onPress: async () => {
        try{
          await removePlant(plant)
          setMyPlants((oldPlants) => (
            oldPlants.filter((item) => item.id !== plant.id)
          ))
        }catch(error){
          Alert.alert('Não foi possível remover a planta escolhida')
        }
      }
    }])
  }
  if(loading)
    return <Load/>
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.spotlight} >
        <Image source={waterdrop} style={styles.spotlightImage} />
        <Text style={styles.spotlightText} >{nextWatered}</Text>
      </View>
      <View style={styles.plants} >
        <Text style={styles.plantsTitle} >Proximas regadas</Text>
        <FlatList 
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({item}) => 
            (<PlantCardSecondary handleRemove={() => handleRemove(item)} data={item} />)
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flex: 1}}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal:20,
    borderRadius: 20,
    height:110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }, 
  spotlightImage: {
    height:60,
    width: 60,
  }, 
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
    textAlign: 'justify'
  },
  plants: {
    flex: 1,
    width: '100%'
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  }
})