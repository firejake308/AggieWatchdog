import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// { Autocomplete } from 'native-base-autocomplete';
import Course from './Course';

export interface CardProps {
    course: Course
}

export default function Card(props: CardProps) {
    const {course} = props;
    return (
        <View style={styles.card}>
            <Text>hello {course.department} {course.courseNum}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'lightblue',
        borderRadius: 4,
        margin: 8,
    },
    autocompleteContainer: {
        position: 'absolute',
    }
});