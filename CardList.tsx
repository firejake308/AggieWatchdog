import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import CollapsibleCard from './CollapsibleCard';
import Course from './Course';

export default function CardList() {
    const [courses, setCourses] = React.useState([
        {cardId: 0, course: {department: 'BIOL', courseNum: '214'}},
        {cardId: 1, course: {department: 'CSCE', courseNum: '222'}},
        {cardId: 2, course: {department: 'PHYS', courseNum: '218'}},
    ]);

    function removeCourse(toRemove: number) {
        setCourses(courses.filter(({cardId}) => cardId !== toRemove));
    }

    return (
        <View>
            {courses.map(({cardId, course}) => <CollapsibleCard 
                course={course} 
                onRemoveCourse={() => removeCourse(cardId)}
                key={cardId} 
            />)}
        </View>
    )
}