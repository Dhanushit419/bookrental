import React, { useState } from 'react';
import { View, Text, Image, Alert, FlatList, StyleSheet, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import Slider from '@react-native-community/slider';

// Sample book data array
const bookData = [
    {
        id: '1',
        name: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 300,
        imageUrl: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fbookrental-8ce3005b-5bc6-4164-a3c0-a36b96fb7d81/ImagePicker/de2507ce-f4e1-476d-94d8-f5283d63c775.jpeg',
        owner: 'Library A',
    },
    {
        id: '2',
        name: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        price: 250,
        imageUrl: 'https://via.placeholder.com/150',
        owner: 'Library B',
    },
    {
        id: '3',
        name: '1984',
        author: 'George Orwell',
        price: 200,
        imageUrl: 'https://via.placeholder.com/150',
        owner: 'Library C',
    },
];

export default function Rent() {
    const [cart, setCart] = useState([]);
    const [negotiation, setNegotiation] = useState(null);
    const [negotiatedPrice, setNegotiatedPrice] = useState(0);
    const [animationValue] = useState(new Animated.Value(1)); // For button press animation

    const addToCart = (book) => {
        const finalPrice = book.negotiatedPrice || book.price;
        setCart([...cart, book.id]);

        Alert.alert(
            'Added to Cart',
            `${book.name} by ${book.author} added to your cart. Owner: ${book.owner} has been informed.`
        );

        // Call the function to send book details after renting
        sendRentDetails(book, finalPrice);
    };

    const openNegotiation = (book) => {
        setNegotiation(book);
        setNegotiatedPrice(book.price);
    };

    const submitNegotiation = () => {
        if (negotiation) {
            negotiation.negotiatedPrice = Math.round(negotiatedPrice);  // Update the book's negotiated price
            Alert.alert(
                'Negotiation Sent',
                `You offered ₹${negotiation.negotiatedPrice} for ${negotiation.name}.`
            );
            setNegotiation(null);
        }
    };

    const sendRentDetails = (book, finalPrice) => {
        //sendRentDetailsToServer(book, finalPrice) 
        //NOTIFY THE OWNER with the contect number of negotiator
        console.log("Renting Book Details:", {
            name: book.name,
            author: book.author,
            price: finalPrice,
            owner: book.owner
        });
    };

    const renderBookCard = ({ item }) => {
        const isRented = cart.includes(item.id);
        const displayPrice = item.negotiatedPrice || item.price;  // Show negotiated price if available
        return (
            <View style={styles.card}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.bookName}>{item.name}</Text>
                    <Text style={styles.bookAuthor}>Author: {item.author}</Text>
                    <Text style={styles.bookPrice}>Price: ₹{displayPrice}</Text>
                    <Text style={styles.bookOwner}>Owner: {item.owner}</Text>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, isRented && styles.buttonDisabled]}
                            onPress={() => {
                                if (!isRented) {
                                    Animated.timing(animationValue, {
                                        toValue: 0.8,
                                        duration: 100,
                                        useNativeDriver: true,
                                    }).start(() => {
                                        addToCart(item);
                                        Animated.timing(animationValue, {
                                            toValue: 1,
                                            duration: 100,
                                            useNativeDriver: true,
                                        }).start();
                                    });
                                }
                            }}
                            disabled={isRented}
                        >
                            <Animated.Text style={[styles.buttonText, { opacity: animationValue }]}>{isRented ? 'Rented' : 'Rent This Book'}</Animated.Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.negotiateButton}
                            onPress={() => openNegotiation(item)}
                        >
                            <Text style={styles.buttonText}>Negotiate</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rent A Book Which You Want</Text>
            <FlatList
                data={bookData}
                renderItem={renderBookCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />

            {/* Negotiation Modal */}
            {negotiation && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={!!negotiation}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Negotiate Price for {negotiation.name}</Text>
                            <Text style={styles.modalPrice}>Max Price: ₹{negotiation.price}</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={negotiation.price}
                                value={negotiatedPrice}
                                onValueChange={(value) => setNegotiatedPrice(value)}
                                step={10}
                                minimumTrackTintColor="#1E90FF"
                                maximumTrackTintColor="#000000"
                                thumbTintColor="#1E90FF"
                            />
                            <Text style={styles.selectedPrice}>Your Offer: ₹{Math.round(negotiatedPrice)}</Text>
                            <TouchableOpacity style={styles.submitButton} onPress={submitNegotiation}>
                                <Text style={styles.submitButtonText}>Submit Offer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setNegotiation(null)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#E8F0FE',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#164863',
        marginBottom: 20,
    },
    list: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
    },
    infoContainer: {
        alignItems: 'center',
    },
    bookName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    bookAuthor: {
        fontSize: 14,
        color: '#666',
    },
    bookPrice: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
        marginBottom: 5,
    },
    bookOwner: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: '#42A5F5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: '#888',
    },
    negotiateButton: {
        backgroundColor: '#FF8C00',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalPrice: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 20,
    },
    selectedPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#42A5F5',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#FF4500',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
