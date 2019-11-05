import * as React from 'react';
import { View, AppState, Alert } from 'react-native';
import {Toast, Spinner} from 'native-base';

import CollapsibleCard from './CollapsibleCard';
import { registerPushNotifications, SERVER_URL } from './util';
import { Notifications } from 'expo';
import Course from './Course';
import validDepartments from './depts_list.json';

let numCardsCreated = 0;
const CardList = React.forwardRef((_props, ref) => {
    const [courses, setCourses] = React.useState([]);
    const [serverCourses, setServerCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    // TODO empty card for initial state

    // fetch courses from server on initial load
    React.useEffect(() => {
        Notifications.getExpoPushTokenAsync().then(token => {
            fetch(SERVER_URL + `/users/${token}/sections`).then(res => res.json()).then(({courses}) => {
                let builtCourses = courses.map((sec: Course) => ({cardId: numCardsCreated++, course: sec}))

                // if server has no courses for this user, create an empty card
                if (courses.length === 0)
                    builtCourses = [emptyCard()]

                setCourses(builtCourses);
                setServerCourses(builtCourses);
                setLoading(false);
            }).catch(err => {
                console.log(err)
                Toast.show({
                    text: 'Error loading courses from server'
                })
                
                // show empty card for now
                const builtCourses = [emptyCard()];
                setCourses(builtCourses);
                setServerCourses(builtCourses);
                setLoading(false);
            })
        });
    }, []);

    function removeCard(toRemove: number) {
        setCourses(courses.filter(({cardId}) => cardId !== toRemove));
    }

    function emptyCard() {
        return {
            cardId: numCardsCreated++,
            course: {
                department: '',
                courseNum: '',
                sections: []
            }
        }
    }

    function handleCourseChange(cardId: number, newCourse: Course) {
        setCourses(courses.map(course => course.cardId === cardId ?
            {cardId: cardId, course: newCourse} : course
        ));
    }

    async function updateServerCourses() {
        console.log('updateServerCourses() called');
        if (JSON.stringify(serverCourses) !== JSON.stringify(courses)) {
            // filter out blank courses
            const filteredCourses = courses.filter(({course}) => course.department !== '')
            setCourses(filteredCourses); // erase empty cards to reflect server values

            // validate departments
            if (filteredCourses.some(({course}) => !validDepartments.includes(course.department) || !course.courseNum)) {
                // notify user and stop server push
                Alert.alert('Invalid Input', 'At least one of the courses you have entered appears to be invalid.'
                +' Please check for typos and blank fields.');
                return;
            }

            // initial registration if necessary
            if (serverCourses.length === 0)
                return registerPushNotifications().then(status => {
                    if (status)
                        console.log('Yes, I have permission to post notifications');
                    else
                        console.log('No, I do not have permission to post notifications')
                }).catch(() =>
                    Toast.show({text: 'Notifications don\'t seem to work on this device'})
                );
            // push new courses to server
            return Notifications.getExpoPushTokenAsync().then(token => {
                fetch(SERVER_URL+`/users/${token}/sections`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sections: filteredCourses.map(({course: {department, courseNum, sections}}) => 
                            ({department, courseNum, sections})
                        )
                    })
                }).then(res => {
                    if (res.status === 200) {
                        Toast.show({text: 'Saved changes successfully'})
                        
                        // save new server state
                        setServerCourses(filteredCourses);
                    }
                    else
                        Toast.show({text: 'Error ' + res.status})
                })
            });
        }
    }

    React.useImperativeHandle(ref, () => ({
        addCard() {
            setCourses([...courses, emptyCard()])
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
            {loading ? <Spinner color="#500000" />
            : courses.map(({cardId, course}) => 
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
