import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import Card from './Card';

export default function CardList() {
    const courses = [
        {department: 'BIOL', courseNum: '214'},
        {department: 'CSCE', courseNum: '222'},
    ];

    const courseCards = [];
    for (let c of courses) {
        courseCards.push(<Card course={c} key={c.department + c.courseNum} />)
    }

    return (
        <View>
            {courseCards}
        </View>
    )
}