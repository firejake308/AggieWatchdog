import * as React from 'react';
import { View, AppState, Alert } from 'react-native';
import Toast from 'react-native-simple-toast';

import CollapsibleCard from './CollapsibleCard';
import { registerPushNotifications, SERVER_URL } from './util';
import { Notifications } from 'expo';
import Course from './Course';
import validDepartments from './depts_list.json';

let numCardsCreated = 0;
const CardList = React.forwardRef((_props, ref) => {
    const [courses, setCourses] = React.useState([]);
    const [serverCourses, setServerCourses] = React.useState([]);
    // TODO empty card for initial state

    // fetch courses from server on initial load
    React.useEffect(() => {
        Notifications.getExpoPushTokenAsync().then(token => {
            fetch(SERVER_URL + `/users/${token}/sections`).then(res => res.json()).then(({courses}) => {
                const builtCourses = courses.map((sec: Course) => ({cardId: numCardsCreated++, course: sec}))
                setCourses(builtCourses);
                setServerCourses(builtCourses);
            }).catch(err => console.log(err))
        });
    }, []);

    function removeCard(toRemove: number) {
        setCourses(courses.filter(({cardId}) => cardId !== toRemove));
    }

    function handleCourseChange(cardId: number, newCourse: Course) {
        setCourses(courses.map(course => course.cardId === cardId ?
            {cardId: cardId, course: newCourse} : course
        ));
    }

    function updateServerCourses() {
        console.log('updateServerCourses() called');
        if (JSON.stringify(serverCourses) !== JSON.stringify(courses)) {
            // validate departments
            if (courses.some(({course}) => !validDepartments.includes(course.department) || !course.courseNum)) {
                // at least one dept is invalid
                Alert.alert('Invalid Input', 'At least one of the courses you have entered appears to be invalid.'
                +' Please check for typos.');
            }

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
            console.log(JSON.stringify({
                sections: courses.map(({course: {department, courseNum, sections}}) => 
                    ({department, courseNum, sections})
                )
            }));
            Notifications.getExpoPushTokenAsync().then(token => {
                fetch(SERVER_URL+`/users/${token}/sections`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sections: courses.map(({course: {department, courseNum, sections}}) => 
                            ({department, courseNum, sections})
                        )
                    })
                }).then(res => console.log(res.status))
            });
            
            // save new server state
            setServerCourses(courses);
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
                    onChange={newCourse => handleCourseChange(cardId, newCourse)}
                    key={cardId} 
                />)}
        </View>
    )
});

export default CardList;
