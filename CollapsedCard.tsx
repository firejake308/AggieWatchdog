import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Form, Input, Item, Icon, CheckBox, ListItem, H3 } from 'native-base';

import Course from './Course';

export interface CardProps {
    course: Course
}

export default function CollapsedCard(props: CardProps) {
    const {course, onExpand} = props;
    const [department, setDepartment] = useState(course.department);
    const [courseNum, setCourseNum] = useState(course.courseNum);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Icon name="remove" type="MaterialIcons" style={styles.removeIcon} />
            <H3 style={styles.white}>{department} {courseNum}</H3>
            </View>
            <Icon 
                name="keyboard-arrow-down" 
                type="MaterialIcons" 
                style={styles.white}
                onPress={() => onExpand()} />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#500000',
        borderRadius: 4,
        padding: 16,
        width: 344,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 8
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    white: {
        color: 'white'
    },
    removeIcon: {
        color: 'white',
        paddingRight: 8
    }
});