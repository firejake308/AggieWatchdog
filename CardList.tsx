import * as React from 'react';
import { View, AppState, Alert } from 'react-native';
import Toast from 'react-native-simple-toast';

import CollapsibleCard from './CollapsibleCard';

let numCardsCreated = 0;
const CardList = React.forwardRef((props, ref) => {
    const [courses, setCourses] = React.useState([]);
    const [serverCourses, setServerCourses] = React.useState([]);
    // TODO empty card for initial state

    // fetch courses from server on initial load
    React.useEffect(() => {
        const res = [
            {cardId: 0, course: {department: 'BIOL', courseNum: '214'}},
            {cardId: 1, course: {department: 'CSCE', courseNum: '222'}},
            {cardId: 2, course: {department: 'PHYS', courseNum: '218'}},
        ];
        numCardsCreated = res.length;
        setCourses(res);
        setServerCourses(res);
    }, []);

    function removeCard(toRemove: number) {
        setCourses(courses.filter(({cardId}) => cardId !== toRemove));
    }

    function updateServerCourses() {
        if (JSON.stringify(serverCourses) !== JSON.stringify(courses)) {
            console.log('Local courses length: ' + courses.length)
            console.log('Server courses length: ' + serverCourses.length)
            // send update to server
            const body = courses;
            // save new server state
            setServerCourses(body);
        }
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
        },
        updateCourses: updateServerCourses
    }));

    // watch app state
    React.useEffect(() => {
        function handleAppStateChange(newState: string) {
            if (newState !== 'active') {
                updateServerCourses();
            }
        }
        AppState.addEventListener('change', handleAppStateChange);

        // cleanup listeners on unmount
        return () => AppState.removeEventListener('change', handleAppStateChange);
    });

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
