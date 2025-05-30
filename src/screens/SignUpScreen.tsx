import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser, setError, setLoading } from '../store/userSlice'
import BackButton from '../components/backButton'
import IMAGES from '../assets/images';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { serializeUser } from '../store/userSerializer'

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLocalLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    if (loading) return;

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLocalLoading(true);
    dispatch(setLoading(true));

    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const serializedUser = serializeUser(userCredential.user);
      dispatch(setUser(serializedUser));
      navigation.goBack();
    } catch (error: any) {
      dispatch(setError(error.message));
      Alert.alert('Error', error.message);
    } finally {
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        onPress={handleSignUp}
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
    </SafeAreaView>
  )
}

export default SignUpScreen;
