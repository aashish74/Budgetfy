import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import BackButton from '../components/backButton'
import IMAGES from '../assets/images'

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={{ paddingTop: 25, backgroundColor: '#fff', height: '100%' }}>
      <View style={{ position: 'absolute', zIndex: 1, paddingTop: 24, paddingLeft: 8 }}>
        <BackButton />
      </View>
      <View style={{ paddingTop: 4, marginBottom: 20 }}>
        <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 24 }}>Sign Up</Text>
      </View>
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <Image
          style={{ height: 400, width: 300 }}
          source={IMAGES.LOGIN} />
      </View>
      <View style={{ marginHorizontal: 25, marginBottom: 50 }}>
        <TextInput
          placeholder='Name'
          style={{ padding: 15, borderWidth: 0.2, borderRadius: 20, marginBottom: 25 }}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder='Email'
          style={{ padding: 15, borderWidth: 0.2, borderRadius: 20, marginBottom: 25 }}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder='Password'
          style={{ padding: 15, borderWidth: 0.2, borderRadius: 20, }}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View>
        <TouchableOpacity
          style={{
            marginTop:10 ,backgroundColor: '#90ee90', padding: 12, marginHorizontal: 25, borderRadius: 25, shadowColor: 'black',
            shadowOpacity: 0.26,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 22, fontWeight: "bold" }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})