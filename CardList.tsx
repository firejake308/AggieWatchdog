import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import ExpandedCard from './ExpandedCard';
import CollapsedCard from './CollapsedCard';

export default function CardList() {
    const courses = [
        {department: 'BIOL', courseNum: '214'},
        {department: 'CSCE', courseNum: '222'},
    ];

    const courseCards = [];
    for (let c of courses) {
        courseCards.push(<ExpandedCard course={c} key={c.department + c.courseNum} />)
    }

    return (
        <View>
            {courseCards}
            <CollapsedCard course={courses[0]} />
        </View>
    )
}