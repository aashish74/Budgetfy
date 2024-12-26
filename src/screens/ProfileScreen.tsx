import { FlatList, Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import IMAGES from '../assets/images';

const DATA = [
    {
        id: 1,
        name: 'abc'
    },{
        id: 2,
        name: 'abc'
    },{
        id:3,
        name: 'abc'
    },
]

type Itemprops = {title : string};

const Item = ({title}: Itemprops) =>{
    return(
        <View>
        <Text>{title}</Text>
    </View>
    )
}

export default function ProfileScreen() {
  return (
    <View style = {{backgroundColor:'#fff', flex:1}}>
        <StatusBar backgroundColor={'#add8e6'} barStyle={'dark-content'}/>
        <View style = {styles.header}>
            <Text style = {{fontSize:25, fontWeight:'500', marginTop:10}}>Your Profile</Text>
            <Image source={IMAGES.PROFILE}
            style = {{ height:140, width:140, marginTop:35, borderRadius:70}}
            />
            <Text style = {{marginTop:10, fontSize:20}}>Aashish Bhardwaj</Text>
            <Text>abc@gmail.com</Text>
        </View>
        <FlatList 
        data={DATA}
        renderItem={({ item }) => <Item title={item.name} />}
        keyExtractor={item => item.id.toString()}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    header : {
        backgroundColor:'#add8e6',
        height:290,
        alignItems:'center',
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10
    }
})