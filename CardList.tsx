import * as React from 'react';
import { View, AppState, Alert } from 'react-native';
import Toast from 'react-native-simple-toast';

import CollapsibleCard from './CollapsibleCard';
import { registerPushNotifications, SERVER_URL } from './util';
import { Notifications } from 'expo';

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
    }, []);

    function removeCard(toRemove: number) {
        setCourses(courses.filter(({cardId}) => cardId !== toRemove));
    }

    function updateServerCourses() {
        console.log('updateServerCourses() called');
        if (JSON.stringify(serverCourses) !== JSON.stringify(courses)) {
            console.log('Local courses length: ' + courses.length)
            console.log('Server courses length: ' + serverCourses.length)
            // send update to server
            const body = courses;
            // initial registration if necessary
            if (serverCourses.length === 0)
                registerPushNotifications().then(status => {
                    if (status)
                        console.log('Yes, I have permission to post notifications');
                    else
                        console.log('No, I do not have permission to post notifications')
                }).catch(() =>
                    Toast.show('Notifications don\'t seem to work on this device')
                );
            // push new courses to server
            Notifications.getExpoPushTokenAsync().then(token => {
                fetch(SERVER_URL+`/users/${token}/sections`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sections: courses.map(({course: {department, courseNum}}) => ({
                        department, courseNum
                    }))})
                }).then(res => console.log(res.status))
            });
            
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
