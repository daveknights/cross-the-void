import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";

export default function Home({ navigation }) {
    const handlePlayPress = () => navigation.navigate('Game');

    return (
        <ImageBackground  source={require('../assets/home-screen.png')} resizeMode="cover" style={styles.imageBG}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={handlePlayPress}>
                    <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    imageBG: {
        flex: 1,
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 100,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#c57',
        borderRadius: 5,
        height: 60,
        justifyContent: 'center',
        width: 200,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',

    },
});
