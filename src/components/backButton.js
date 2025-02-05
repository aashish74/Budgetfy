import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import IMAGES from '../assets/images'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../hooks/useTheme'

export default function BackButton() {
    const navigation = useNavigation();
    const theme = useTheme();
    
    return (
        <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.button}
        >
            <Image 
                style={styles.icon}
                source={IMAGES.BACK}
                tintColor={theme.colors.text}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
    },
    icon: {
        height: 35,
        width: 25,
    }
})