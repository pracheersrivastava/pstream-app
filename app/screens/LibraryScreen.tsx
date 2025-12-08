import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LibraryScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Library Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});

export default LibraryScreen;
