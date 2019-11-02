import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import CollapsibleCard from './CollapsibleCard';
import Course from './Course';
import { Fab, Button, Icon, Card } from 'native-base';

let numCardsCreated = 3;
const CardList = React.forwardRef((props, ref) => {
    const [courses, setCourses] = React.useState([
        {cardId: 0, course: {department: 'BIOL', courseNum: '214'}},
        {cardId: 1, course: {department: 'CSCE', courseNum: '222'}},
        {cardId: 2, course: {department: 'PHYS', courseNum: '218'}},
    ]);

    function removeCard(toRemove: number) {
        setCourses(courses.filter(({cardId}) => cardId !== toRemove));
    }

    React.useImperativeHandle(ref, () => ({
        addCard() {
            setCourses([...courses, {
                cardId: numCardsCreated++,
                course: {
                    department: '',
                    courseNum: '',
                }
            }])
        }
    }));

    return (
        <View>
            {courses.map(({cardId, course}) => 
                <CollapsibleCard 
                    course={course} 
                    onRemoveCourse={() => removeCard(cardId)}
                    key={cardId} 
                />)}
        </View>
    )
});

export default CardList;
