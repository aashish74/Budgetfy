import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import IMAGES from '../assets/images'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackNavigationProp<RootStackParamList>;


export default function WelcomeScreen() {
    const navigation = useNavigation<Props>()
    return (
        <View style = {{paddingTop:70, backgroundColor:'#fff', flex:1}}>
            <View style={{ alignItems: 'center', }}>
                <Image
                    style={{ height: 500, width: 400 }}
                    source={IMAGES.WELCOME} />
                <Text style={{ fontSize: 40, fontWeight: 'bold', paddingTop:20}}>Budgetfy</Text>
            </View>
            <View style = {{marginTop:60}}>
                <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                    style={{ marginBottom: 25, backgroundColor: '#90ee90', padding: 12, marginHorizontal: 25, borderRadius: 25, shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3, }}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 22, fontWeight: "bold" }}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}
                    style={{ marginBottom: 30, backgroundColor: 'white', padding: 12, marginHorizontal: 25, borderRadius: 25, shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 10,
                        elevation: 3,}}
                >
                    <Text style={{ textAlign: 'center', color: '#90ee90', fontSize: 22, fontWeight: "bold" }}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}