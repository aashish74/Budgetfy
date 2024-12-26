import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import IMAGES from '../assets/images'
import { useNavigation } from '@react-navigation/native'

export default function BackButton() {
    const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style = {{backgroundColor:'white',paddingLeft:8,}}>
        <Image 
        style = {{height: 35, width:25}}
        source={IMAGES.BACK}
        />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})