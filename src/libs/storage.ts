import AsyncStorage from '@react-native-async-storage/async-storage'
import {format} from 'date-fns'

export interface PlantProps{
    name: string;
    photo: string;
    id:number;
    about:string;
    water_tips: string;
    environments: [string];
    frequency: {
      times:number;
      repeat_every:string;
    };
    dateTimeNotification: Date
}

interface StoragePlantProps {
  [id:string]:{
    data: PlantProps
  }
}
export async function savePlant(plant: PlantProps): Promise<void>{
  try{
    const data = await AsyncStorage.getItem('@plantmanager:plants')
    const oldPlants = data ? (JSON.parse(data) as StoragePlantProps): {}
    const newPlant = {
      [plant.id]:{
        data: plant
      }
    }
    console.log(oldPlants);
    console.log(newPlant);
    
    
    await AsyncStorage.setItem('@plantmanager:plants', JSON.stringify({...newPlant, ...oldPlants}))
  }catch(error){
    throw new Error(error)
  }
}
export async function loadPlants(): Promise<PlantProps[]>{
  try{
    const data = await AsyncStorage.getItem('@plantmanager:plants')
    const plants = data ? (JSON.parse(data) as StoragePlantProps): {}
    const plantsSorted = Object.keys(plants).map((plant) =>{
      return {
        ...plants[plant].data,
        hour: format(new Date(plants[plant].data.dateTimeNotification),'HH:mm')
      }
    }).sort((a, b) =>
      Math.floor(new Date(a.dateTimeNotification).getTime()/1000 - Math.floor(b.dateTimeNotification.getTime() / 1000))
    )
    return plantsSorted 
  }catch(error){
    throw new Error(error)
  }
}