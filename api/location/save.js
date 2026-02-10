import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

const API = "https://location-backend-five.vercel.app/api";

export default function App() {
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [registered, setRegistered] = useState(false);

  // Manual save state
  const [shopName, setShopName] = useState('');
  const [Dealername, setDealername] = useState('');
  const [phonenumber, setphonenumber] = useState('');
  const [saving, setSaving] = useState(false);

  // Auto-tracking state
  const [tracking, setTracking] = useState(false);

  // ---------------- INIT DEVICE ----------------
  useEffect(() => {
    initDevice();
  }, []);

  const initDevice = async () => {
    const id = await DeviceInfo.getUniqueId();
    setDeviceId(id);

    const savedName = await AsyncStorage.getItem('userName');
    if (savedName) {
      setName(savedName);
      setRegistered(true);
    }
  };

  // ---------------- REGISTER USER ----------------
  const registerUser = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Please enter your name');

    try {
      await axios.post(`${API}/device/register`, { deviceId, name });
      await AsyncStorage.setItem('userName', name);
      setRegistered(true);
    } catch (err) {
      Alert.alert('Error', 'Registration failed');
    }
  };

  // ---------------- PERMISSIONS ----------------
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      const bg = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
      );
      return fine === PermissionsAndroid.RESULTS.GRANTED && bg === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // ---------------- MANUAL SAVE ----------------
  const saveShopLocation = async () => {
    if (!shopName.trim()) return Alert.alert('Error', 'Please enter shop name');

    const perm = await requestLocationPermission();
    if (!perm) return;

    setSaving(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
      });

      await axios.post(`${API}/location/save`, {
        deviceId,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        shopName,
        timestamp: new Date().toISOString()
      });

      Alert.alert('Success', 'Shop location saved!');
      setShopName('');
    } catch (err) {
      Alert.alert('Error', 'Failed to save location');
    } finally {
      setSaving(false);
    }
  };

  const saveFarmerVisit = async () => {
    if (!Dealername.trim() || !phonenumber.trim())
      return Alert.alert('Error', 'Farmer name & phone required');

    const perm = await requestLocationPermission();
    if (!perm) return;

    setSaving(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
      });

      await axios.post(`${API}/location/save`, {
        deviceId,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        Dealername,
        phonenumber,
        timestamp: new Date().toISOString()
      });

      Alert.alert('Success', 'Farmer visit saved!');
      setDealername('');
      setphonenumber('');
    } catch (err) {
      Alert.alert('Error', 'Failed to save farmer visit');
    } finally {
      setSaving(false);
    }
  };

  // ---------------- BACKGROUND TRACKING ----------------
  const startTracking = async () => {
    const perm = await requestLocationPermission();
    if (!perm) return Alert.alert('Error', 'Background location permission required');

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 100, // Save every 100m
      notificationTitle: 'Tracking Active',
      notificationText: 'Your location is being tracked',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true, // stops when app killed
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
    });

    BackgroundGeolocation.on('location', async (location) => {
      try {
        await axios.post(`${API}/location/save`, {
          deviceId,
          lat: location.latitude,
          lng: location.longitude,
          speed: location.speed,
          timestamp: new Date().toISOString(),
          isAuto: true
        });
        console.log('Auto-saved:', location.latitude, location.longitude);
      } catch (err) {
        console.log('Auto-save failed', err.message);
      }
    });

    BackgroundGeolocation.start();
    setTracking(true);
  };

  const stopTracking = () => {
    BackgroundGeolocation.stop();
    BackgroundGeolocation.removeAllListeners();
    setTracking(false);
  };

  // ---------------- UI ----------------
  if (!registered) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Location Tracker</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={registerUser}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, {name}</Text>

      {/* Manual Save */}
      <Text style={styles.subtitle}>Shop Visit</Text>
      <TextInput
        value={shopName}
        onChangeText={setShopName}
        placeholder="Shop name"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={saveShopLocation} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Shop Visit</Text>}
      </TouchableOpacity>

      <Text style={styles.subtitle}>Farmer Visit</Text>
      <TextInput
        value={Dealername}
        onChangeText={setDealername}
        placeholder="Farmer Name"
        style={styles.input}
      />
      <TextInput
        value={phonenumber}
        onChangeText={setphonenumber}
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={saveFarmerVisit} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Farmer Visit</Text>}
      </TouchableOpacity>

      {/* Auto Tracking */}
      <Text style={styles.subtitle}>Auto Tracking</Text>
      {tracking ? (
        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={stopTracking}>
          <Text style={styles.buttonText}>Stop Tracking</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={startTracking}>
          <Text style={styles.buttonText}>Start Tracking</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    backgroundColor: '#fff',
    fontSize: 16
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
