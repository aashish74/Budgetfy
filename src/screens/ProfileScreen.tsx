import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, Modal, PermissionsAndroid, Platform, Linking, Alert } from 'react-native'
import React, { useMemo, useState } from 'react'
import IMAGES from '../assets/images'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { SafeAreaView } from 'react-native-safe-area-context'
import { launchCamera, launchImageLibrary, ImagePickerResponse, PhotoQuality, MediaType } from 'react-native-image-picker'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'types/navigation'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../hooks/useTheme'
import { setThemeMode } from '../store/themeSlice'
import type { ThemeMode } from '../store/themeSlice'

type Props = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const { targetCurrency } = useSelector((state: RootState) => state.currency);
  const trips = useSelector((state: RootState) => state.trips.trips);
  const expenses = useSelector((state: RootState) => state.expenses);
  const navigation = useNavigation<Props>();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { mode } = useSelector((state: RootState) => state.theme);

  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(IMAGES.PROFILE);


  const totalAmount = useMemo(() => {
    const total = Object.values(expenses).reduce((sum, tripExpenses) => {
      return sum + tripExpenses.reduce((tripSum, expense) => tripSum + expense.amount, 0);
    }, 0);
    return (total * targetCurrency.rate).toFixed(2);
  }, [expenses, targetCurrency.rate]);

  const handleCameraLaunch = async () => {
    try {
      if (Platform.OS === 'android') {
        // First check if permission is already granted
        const cameraGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        
        if (!cameraGranted) {
          const permissionStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Camera Permission",
              message: "App needs access to your camera",
              buttonPositive: "OK",
              buttonNegative: "Cancel",
            }
          );

          console.log('Camera permission status:', permissionStatus);

          if (permissionStatus === PermissionsAndroid.RESULTS.DENIED) {
            Alert.alert('Permission Denied', 'Camera permission is required to take photos');
            return;
          }

          if (permissionStatus === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
              "Permission Required",
              "Please enable camera permission in settings",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Open Settings", 
                  onPress: () => {
                    Linking.openSettings();
                    setModalVisible(false);
                  }
                }
              ]
            );
            return;
          }
        }

        // If we get here, we have permission
        const options = {
          mediaType: 'photo' as MediaType,
          quality: 1 as PhotoQuality,
          saveToPhotos: true,
        };

        launchCamera(options, (response: ImagePickerResponse) => {
          console.log('Camera response:', response);
          if (response.assets?.[0]?.uri) {
            setProfileImage({ uri: response.assets[0].uri });
            setModalVisible(false);
          }
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleGalleryLaunch = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      console.log('Gallery response:', response);
      
      if (response.didCancel) {
        console.log('User cancelled gallery picker');
        return;
      }
      
      if (response.errorCode) {
        console.log('Gallery Error:', response.errorMessage);
        return;
      }
      
      if (response.assets && response.assets[0]?.uri) {
        setProfileImage({ uri: response.assets[0].uri });
        setModalVisible(false);
      }
    });
  };

  const handleThemeChange = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(mode);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    dispatch(setThemeMode(nextTheme));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image 
            source={profileImage}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.userName}>Aashish</Text>
        <Text style={styles.userEmail}>abc@gmail.com</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Option</Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleCameraLaunch}
            >
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleGalleryLaunch}
            >
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statAmount}>{targetCurrency.symbol}{totalAmount}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statAmount}>{trips.length || 0}</Text>
          <Text style={styles.statLabel}>Total Trips</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={[styles.settingsContainer, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Settings</Text>
        
        {/* Currency Setting */}
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
          onPress={() => navigation.navigate('Currency')}
        >
          <Text style={[styles.settingText, { color: theme.colors.text }]}>Currency</Text>
          <View style={styles.currencyValue}>
            <Text style={[styles.settingValue, { color: theme.colors.grey }]}>
              {targetCurrency.symbol} {targetCurrency.id}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Theme Setting */}
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
          onPress={handleThemeChange}
        >
          <Text style={[styles.settingText, { color: theme.colors.text }]}>Theme</Text>
          <Text style={[styles.settingValue, { color: theme.colors.grey }]}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={[styles.settingText, { color: theme.colors.text }]}>Language</Text>
          <Text style={[styles.settingValue, { color: theme.colors.grey }]}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text style={[styles.settingText, { color: theme.colors.text }]}>Statistics</Text>
        </TouchableOpacity>

      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  profileCard: {
    backgroundColor: '#add8e6',
    margin: 15,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  statCard: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  statAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  settingsContainer: {
    margin: 15,
    marginTop: 25,
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    padding: 20,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    margin: 15,
    marginTop: 'auto',
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 20,
    borderWidth: 0.2,
    borderColor: 'grey',
  },
  logoutText: {
    textAlign: 'center',
    color: 'grey',
    fontSize: 16,
    fontWeight: '600',
  },
  currencyValue: {
    alignItems: 'flex-end',
  },
  changeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#add8e6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelText: {
    color: 'red',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 8,
  },
})