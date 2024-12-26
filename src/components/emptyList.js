import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import IMAGES from '../assets/images'

export default function EmptyList() {
  return (
    <View style = {styles.view}>
        <Image 
        style = {styles.image}
        source={IMAGES.EMPTY}/>
      <Text style = {styles.text}>No Trips Found</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    view:{
        justifyContent:'center',
        alignItems:'center',
    },
    text:{
        fontSize:25,
        fontWeight:'600',
        color:'grey'
    },
    image:{
        height:240,
        width:240,
    }
})