import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert, FlatList, StyleSheet, TouchableOpacity, Modal, Animated, Easing, ActivityIndicator, Linking } from 'react-native';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Icon from 'react-native-vector-icons/FontAwesome';
import { firestore } from '../firebaseConfig';
import Slider from '@react-native-community/slider';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';

Geocoder.init("c8abd4acbd884cd3ab33e9ba8ec4b2b5");

var locationName = "Guindy, Chennai";

export default function Rent() {
    const [cart, setCart] = useState([]);
    const [negotiation, setNegotiation] = useState(null);
    const [negotiatedPrice, setNegotiatedPrice] = useState(0);
    const [animationValue] = useState(new Animated.Value(1));
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);

    const submitNegotiation = () => {
        if (negotiation) {
            negotiation.negotiatedPrice = Math.round(negotiatedPrice);
            Alert.alert(
                'Negotiation Sent',
                `You offered ₹${negotiation.negotiatedPrice} for ${negotiation.name}`
            );
            setNegotiation(null);
        }
    };

    const getBooksFromFirestore = async () => {
        const booksCollection = collection(firestore, "books");
        try {
            const querySnapshot = await getDocs(booksCollection);
            const booksList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return booksList;
        } catch (error) {
            console.error("Error retrieving books: ", error);
        }
    };

    useEffect(() => {
        async function setk() {
            const boo = await getBooksFromFirestore();
            setBooks(boo);
            setLoading(false);

            let locationResult = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = locationResult.coords;

            setLocation({ latitude, longitude });

            Geocoder.from(latitude, longitude)
                .then(json => {
                    const address = json.results[0].formatted_address;
                    setCurrentLocation(address);
                })
                .catch(error => console.warn(error));
        }
        setk();
    }, []);

    const addToCart = (book) => {
        const finalPrice = book.negotiatedPrice || book.price;
        setCart([...cart, book.id]);
        Alert.alert(
            'Added to Cart',
            `${book.name} by ${book.author} added to your cart. Owner: ${book.owner} has been informed.`
        );
        sendRentDetails(book, finalPrice);
    };

    const sendRentDetails = (book, finalPrice) => {
        console.log("Renting Book Details:", {
            name: book.name,
            author: book.author,
            price: finalPrice,
            owner: book.owner
        });
    };

    const openNegotiation = (book) => {
        setNegotiation(book);
        setNegotiatedPrice(book.price);
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;

        const R = 6371; // Radius of the Earth in km
        const lat1Rad = toRad(lat1);
        const lon1Rad = toRad(lon1);
        const lat2Rad = toRad(lat2);
        const lon2Rad = toRad(lon2);

        const dlat = lat2Rad - lat1Rad;
        const dlon = lon2Rad - lon1Rad;

        const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
                  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                  Math.sin(dlon / 2) * Math.sin(dlon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in km
        return distance;
    };

    const renderBookCard = ({ item }) => {
        const isRented = cart.includes(item.id);
        const displayPrice = item.negotiatedPrice || item.price;
        const dist = getDistance(location.latitude, location.longitude, item.lat, item.long).toFixed(2);

        return (
            <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.bookName}>{item.name}</Text>
                    <Text style={styles.bookAuthor}>{item.author}</Text>
                    <Text style={styles.bookPrice}>₹{displayPrice}</Text>
                    <Text style={styles.bookPrice}>Around {dist} km from yours</Text>
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
                            <Animated.Text style={[styles.buttonText, { opacity: animationValue }]}>{isRented ? 'Rented' : 'Rent'}</Animated.Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.callButton}
                            onPress={() => Linking.openURL(`tel:${item.contactNumber}`)}
                        >
                            <Icon name="phone" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity
                        style={[styles.negotiateButton, { marginTop: 10 }]}
                        onPress={() => openNegotiation(item)}
                    >
                        <Text style={styles.negotiateButtonText}>Negotiate</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.locationContainer}>
                <Text style={styles.locationText}>Current Location:</Text>
                <Text style={styles.locationText}>{currentLocation}</Text>
            </View>

            <Text style={styles.title}>Rent A Book Near by your location </Text>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#42A5F5" />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <FlatList
                    data={books}
                    renderItem={renderBookCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            )}

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
        backgroundColor: '#F4F8FB',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2A4B7C',
        marginBottom: 20,
    },
    list: {
        paddingHorizontal: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    infoContainer: {
        flexDirection: 'column',
    },
    bookName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    bookAuthor: {
        fontSize: 16,
        color: '#555',
        marginVertical: 5,
    },
    bookPrice: {
        fontSize: 16,
        color: '#1E90FF',
        fontWeight: 'bold',
    },
    locationContainer: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        marginBottom: 15,
    },
    locationText: {
        fontSize: 16,
        color: '#333',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        columnGap: 10
    },
    button: {
        backgroundColor: '#42A5F5',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#B0BEC5',
    },
    callButton: {
        backgroundColor: '#1E90FF',
        padding: 10,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    negotiateButton: {
        backgroundColor: '#FF7043',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    negotiateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalPrice: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    selectedPrice: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
    },
    submitButton: {
        backgroundColor: '#1E90FF',
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#FF7043',
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

button: {
    backgroundColor: '#42A5F5',  // Keep a blue color for general buttons
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,  // Ensure buttons take equal width
    marginHorizontal: 5,  // Add spacing between buttons
},

buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
},

buttonDisabled: {
    backgroundColor: '#B0BEC5',
},

callButton: {
    backgroundColor: '#1E90FF',  // Blue color for the call button
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,  // Add margin to separate from other buttons
},

negotiateButton: {
    backgroundColor: '#FF7043',  // Orange color for negotiate button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,  // To make it aligned with other buttons
    marginHorizontal: 5,
},

negotiateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
},

});
