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
import RNFetchBlob from 'rn-fetch-blob'
import XLSX from 'xlsx'
import Share from 'react-native-share'
import { Expense } from '../types/expense'

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
  const [exportModalVisible, setExportModalVisible] = useState(false);
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

  const handleExportData = async (format: 'xlsx' | 'txt', tripId?: string) => {
    try {
      // Get expenses data to export
      let dataToExport: Expense[] = [];
      if (tripId) {
        // Export specific trip expenses
        dataToExport = expenses[tripId] || [];
      } else {
        // Export all expenses
        dataToExport = Object.values(expenses).flat();
      }

      if (dataToExport.length === 0) {
        Alert.alert('No Data', 'There are no expenses to export');
        return;
      }

      // Create filename with timestamp to avoid overwriting
      const timestamp = new Date().getTime();
      const tripName = tripId ? trips.find(t => t.id === tripId)?.place.replace(/\s+/g, '_').toLowerCase() : 'all';
      const fileName = `budgetfy_expenses_${tripName}_${timestamp}`;
      
      // Determine where to save the file
      let dirPath = '';
      let hasPermission = false;
      
      if (Platform.OS === 'android') {
        try {
          // For Android 11+ (API level 30+), we need to use the MediaStore API
          // For simplicity, we'll try the permission and fall back to app directory if denied
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "Storage Permission",
              message: "Budgetfy needs access to your storage to save exported files",
              buttonPositive: "OK",
              buttonNegative: "Cancel",
            }
          );
          
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
          console.log('Permission error:', error);
          hasPermission = false;
        }
        
        // Use Downloads directory if permission granted, otherwise use app directory
        dirPath = hasPermission 
          ? RNFetchBlob.fs.dirs.DownloadDir 
          : RNFetchBlob.fs.dirs.DocumentDir;
      } else {
        // For iOS, always use DocumentDir
        dirPath = RNFetchBlob.fs.dirs.DocumentDir;
      }
        
      let filePath = '';
      let mimeType = '';

      if (format === 'xlsx') {
        // Format data for Excel
        const worksheetData = dataToExport.map(expense => {
          const trip = trips.find(t => t.id === expense.tripId);
          return {
            'Title': expense.title,
            'Amount': expense.amount,
            'Currency': `${targetCurrency.symbol} (${targetCurrency.id})`,
            'Converted Amount': `${targetCurrency.symbol}${(expense.amount * targetCurrency.rate).toFixed(2)}`,
            'Category': expense.category,
            'Description': expense.description || '',
            'Trip': trip ? `${trip.place}, ${trip.country}` : 'Unknown',
            'Date': expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'
          };
        });

        // Create workbook
        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
        
        // Convert to base64 string
        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
        
        filePath = `${dirPath}/${fileName}.xlsx`;
        await RNFetchBlob.fs.writeFile(filePath, wbout, 'base64');
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else {
        // Format data for text file
        let fileContent = 'BUDGETFY EXPENSES REPORT\n';
        fileContent += `Generated: ${new Date().toLocaleString()}\n\n`;
        
        dataToExport.forEach((expense, index) => {
          const trip = trips.find(t => t.id === expense.tripId);
          fileContent += `EXPENSE #${index + 1}\n`;
          fileContent += `Title: ${expense.title}\n`;
          fileContent += `Amount: ${expense.amount}\n`;
          fileContent += `Converted: ${targetCurrency.symbol}${(expense.amount * targetCurrency.rate).toFixed(2)}\n`;
          fileContent += `Category: ${expense.category}\n`;
          fileContent += `Description: ${expense.description || 'N/A'}\n`;
          fileContent += `Trip: ${trip ? `${trip.place}, ${trip.country}` : 'Unknown'}\n`;
          fileContent += `Date: ${expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}\n`;
          fileContent += `----------------------------------------\n\n`;
        });
        
        filePath = `${dirPath}/${fileName}.txt`;
        await RNFetchBlob.fs.writeFile(filePath, fileContent, 'utf8');
        mimeType = 'text/plain';
      }

      console.log('File saved at:', filePath);

      // Share the file
      try {
        const shareOptions = {
          title: 'Share Expenses',
          message: 'Here are my exported expenses from Budgetfy',
          url: `file://${filePath}`,
          type: mimeType,
        };
        
        await Share.open(shareOptions);
        
        if (Platform.OS === 'android' && !hasPermission) {
          // If we didn't have permission, let the user know where the file was saved
          Alert.alert(
            'File Saved',
            'The file was saved to your app\'s private storage. Use the share option to save it elsewhere.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Success', 'File exported successfully');
        }
      } catch (shareError) {
        console.error('Share error:', shareError);
        Alert.alert('Success', `File exported successfully to ${filePath}`);
      }
      
      setExportModalVisible(false);
      
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'There was an error exporting your data. Please try again.');
    }
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

      {/* Image Picker Modal */}
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

      {/* Export Data Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={exportModalVisible}
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Export Expenses</Text>
            
            {/* Format Selection */}
            <View style={styles.exportSection}>
              <Text style={[styles.exportSectionTitle, { color: theme.colors.text }]}>Select Format:</Text>
              <View style={styles.exportButtonsRow}>
                <TouchableOpacity 
                  style={[styles.exportFormatButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleExportData('xlsx')}
                >
                  <Text style={styles.exportButtonText}>Excel (.xlsx)</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.exportFormatButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleExportData('txt')}
                >
                  <Text style={styles.exportButtonText}>Text (.txt)</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Trip Selection */}
            <View style={styles.exportSection}>
              <Text style={[styles.exportSectionTitle, { color: theme.colors.text }]}>Select Trip:</Text>
              <TouchableOpacity 
                style={[styles.exportTripButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => handleExportData('xlsx')}
              >
                <Text style={styles.exportButtonText}>All Trips</Text>
              </TouchableOpacity>
              
              <View style={styles.tripsList}>
                {trips.map(trip => (
                  <TouchableOpacity 
                    key={trip.id}
                    style={[styles.exportTripButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => handleExportData('xlsx', trip.id)}
                  >
                    <Text style={styles.exportButtonText}>{trip.place}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setExportModalVisible(false)}
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

        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
          onPress={() => setExportModalVisible(true)}
        >
          <Text style={[styles.settingText, { color: theme.colors.text }]}>Export Data</Text>
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
  exportSection: {
    marginBottom: 20,
  },
  exportSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  exportButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exportFormatButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  exportTripButton: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  tripsList: {
    maxHeight: 200,
  }
});