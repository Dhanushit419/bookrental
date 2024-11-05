import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Add() {
    const [bookName, setBookName] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === 'granted') {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
                Alert.alert('Image uploaded successfully');
            } else {
                Alert.alert('Camera was canceled');
            }
        } else {
            Alert.alert('Camera permission denied');
        }
    };

    const handleSave = () => {
        if (!bookName || !author || !price || !image) {
            Alert.alert('Please fill all fields and upload an image');
            return;
        }
        console.log(image)
        const newBook = {
            name: bookName,
            author: author,
            price: price,
            image: image,
        };

        Alert.alert('Book added successfully', `Name: ${newBook.name}`);
        //store image somewhere and get the url to store in database
        //SEND TO DATABASE FROM HERE

        setBookName('');
        setAuthor('');
        setPrice('');
        setImage(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Details of New Book</Text>
            <View style={styles.card}>
                <TextInput
                    placeholder="Book Name"
                    value={bookName}
                    onChangeText={setBookName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Author"
                    value={author}
                    onChangeText={setAuthor}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Price"
                    value={price}
                    onChangeText={setPrice}
                    style={styles.input}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
                    <MaterialCommunityIcons name="camera" size={24} color="#fff" />
                    <Text style={styles.cameraButtonText}> Open Camera</Text>
                </TouchableOpacity>
                {image && (
                    <Image
                        source={{ uri: image }}
                        style={styles.previewImage}
                    />
                )}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Book</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#E8F0FE', // Light blue background
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#164863', // Dark blue for title
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },
    input: {
        backgroundColor: '#F5F5F5', // Soft gray background
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderColor: '#BDBDBD',
        borderWidth: 1,
    },
    cameraButton: {
        flexDirection: 'row',
        backgroundColor: '#42A5F5', // Bright blue button
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
    },
    cameraButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 10,
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 15,
        resizeMode: 'contain',
        borderColor: '#BDBDBD',
        borderWidth: 1,
    },
    saveButton: {
        backgroundColor: '#66BB6A', // Green button
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
