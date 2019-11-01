import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Form, Input, Item, Icon } from 'native-base';

import Course from './Course';

export interface CardProps {
    course: Course
}

export default function ExpandedCard(props: CardProps) {
    const {course} = props;
    const [department, setDepartment] = useState(course.department);
    const [courseNum, setCourseNum] = useState(course.courseNum);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.collapse}>Collapse</Text>
                <Icon name="keyboard-arrow-down" type="MaterialIcons" style={styles.white}/>
            </View>
            <Form style={styles.flexRow}>
                <Item style={styles.halfRow}>
                    <Input placeholder="Department" onChangeText={text => setDepartment(text)} />
                </Item>
                <Item style={styles.halfRow}>
                    <Input placeholder="Course Number" onChangeText={text => setCourseNum(text)} />
                </Item>
            </Form>
            <Text>Section list will go here for {department} {courseNum}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 16,
        width: 344,
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 8,
        paddingTop: 28
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flex: 1,
        zIndex: 1,
        backgroundColor: '#500000',
        height: 28,
        width: 344,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    white: {
        color: 'white',
    },
    collapse: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    flexRow: {
        flexDirection: 'row',
    },
    halfRow: {
        flex: 1,
    },
});