import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function Auth() {
    const [isRegister, setIsRegister] = useState(true);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');

    // Define IT department boundaries
    const itDepartmentZone = {
        latitudeRange: [13.0127887755, 13.0130829729],
        longitudeRange: [80.2358313919, 80.2362461123],
    };

    const handleRegister = () => {

        Alert.alert('Register', `Name: ${name}\nLocation: ${location}\nContact: ${contact}`);
        setName('');
        setLocation('');
        setContact('');
        setPassword('');
        //send to database from here
    };

    const handleLogin = () => {
        Alert.alert('Login', `Contact: ${contact}`);
        setContact('');
        setPassword('');
        //send to database from here
        //navigate after verification
    };

    const getLocationPermissionAndCoordinates = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Location permission is required to get your current position.');
            return;
        }

        let locationResult = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = locationResult.coords;

        if (
            latitude >= itDepartmentZone.latitudeRange[0] &&
            latitude <= itDepartmentZone.latitudeRange[1] &&
            longitude >= itDepartmentZone.longitudeRange[0] &&
            longitude <= itDepartmentZone.longitudeRange[1]
        ) {
            setLocation('IT');
        } else {
            setLocation('Non IT');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, isRegister && styles.activeToggle]}
                    onPress={() => setIsRegister(true)}
                >
                    <Text style={styles.toggleText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, !isRegister && styles.activeToggle]}
                    onPress={() => setIsRegister(false)}
                >
                    <Text style={styles.toggleText}>Login</Text>
                </TouchableOpacity>
            </View>

            {isRegister ? (
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Contact Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your contact number"
                        keyboardType="phone-pad"
                        value={contact}
                        onChangeText={setContact}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <Text style={styles.label}>Location</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Location (auto-filled)"
                        value={location}
                        editable={false}
                    />
                    <TouchableOpacity style={styles.locationButton} onPress={getLocationPermissionAndCoordinates}>
                        <Text style={styles.locationButtonText}>Get Current Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
                        <Text style={styles.submitText}>Register</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Contact Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your contact number"
                        keyboardType="phone-pad"
                        value={contact}
                        onChangeText={setContact}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
                        <Text style={styles.submitText}>Login</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F0F4FF',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    toggleButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeToggle: {
        backgroundColor: '#1E90FF',
    },
    toggleText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    locationButton: {
        backgroundColor: '#FFA500',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    locationButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#1E90FF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    submitText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});
