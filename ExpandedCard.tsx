import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { Form, Input, Item, Icon, CheckBox, ListItem, Button } from 'native-base';

import Course from './Course';
import { Platform } from '@unimodules/core';
import Section from './Section';
import validDepartments from './depts_list.json';

interface ExpandedCardProps { 
    course: Course; 
    onCollapse: Function; 
    onChangeCourse: Function; 
    onRemove: (e?: any) => any 
}

export default function ExpandedCard(props: ExpandedCardProps) {
    const {course, onCollapse, onChangeCourse, onRemove} = props;
    const [department, setDepartment] = useState(course.department);
    const [courseNum, setCourseNum] = useState(course.courseNum);
    const [sections, setSections] = useState([]);
    const [isDeptValid, setDeptValid] = useState(true);

    function loadSections() {
        // this will be replaced by a server call, so probably useEffects
        setSections([
            {course: 'ignore', sectionNum: '201', professor: 'Alan Pepper', seatsOpen: 20, seatsTotal: 22, watched: false},
            {course: 'ignore', sectionNum: '501', professor: 'Aakash Tyagi', seatsOpen: 0, seatsTotal: 18, watched: true},
            {course: 'ignore', sectionNum: '502', professor: 'Eun Kim', seatsOpen: 57, seatsTotal: 100, watched: false}]);
    }

    function renderSection(section: Section) {
        const {sectionNum, professor, seatsOpen, seatsTotal, watched} = section;
        return (<ListItem style={styles.flexRow} key={sectionNum}>
            <CheckBox checked={watched} onPress={() => setSections(sections.map(sec => 
                sec.sectionNum === sectionNum ? {...sec, watched: !sec.watched} : sec))} />
            <Text style={styles.morePadding}>{sectionNum}</Text>
            <Text style={styles.morePadding}>{professor}</Text>
            <Text style={styles.lastText}>{seatsOpen}/{seatsTotal} available</Text>
        </ListItem>);
    }

    function validateDepartment(input: string) {
        setDeptValid(validDepartments.includes(input));
    }

    function updateDepartment(newVal: string) {
        // control the input component
        setDepartment(newVal);
        // notify parent
        onChangeCourse({ department: newVal, courseNum: '' });
    }

    function updateCourseNum(newVal: string) {
        // control the input component
        setCourseNum(newVal);
        // notify parent
        onChangeCourse({...course, courseNum: newVal});
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <TouchableWithoutFeedback onPress={onRemove}>
                    <View style={styles.headerGroup}>
                        <Icon
                            name="remove"
                            type="MaterialIcons"
                            style={styles.white} />
                        <Text style={styles.headerActionStyle}>Remove</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => onCollapse()}>
                    <View style={styles.headerGroup}>
                        <Text style={styles.headerActionStyle}>Collapse</Text>
                        <Icon
                            name="keyboard-arrow-up" 
                            type="MaterialIcons" 
                            style={styles.white} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <Form style={styles.flexRow}>
                <Item style={styles.halfRow} error={!isDeptValid}>
                    <Input 
                        placeholder="Department" 
                        value={department}
                        autoCapitalize="characters"
                        onChangeText={text => {
                            setSections([])
                            setCourseNum('')
                            updateDepartment(text)
                        }}
                        onBlur={() => validateDepartment(department)}
                    />
                </Item>
                <Item style={styles.halfRow}>
                    <Input 
                        placeholder="Course Number"
                        value={courseNum} 
                        onChangeText={text => {
                            setSections([])
                            updateCourseNum(text)
                        }} 
                    />
                </Item>
            </Form>
            {
                sections.length ? (
                    <View>
                        <Text style={styles.cardPaddingFix}>Select sections to watch:</Text> 
                        {sections.map(sec => renderSection(sec))}
                    </View>) 
                :   <Button transparent onPress={loadSections} style={styles.loadSections}>
                        <Text style={styles.flatButton}>
                            {Platform.OS === 'android' ? 'LOAD SECTIONS' : 'Load Sections'}
                        </Text>
                    </Button>
                
            }
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
        paddingTop: 28,
        paddingLeft: 4
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    white: {
        color: 'white',
    },
    headerActionStyle: {
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
    morePadding: {
        paddingRight: 8,
        paddingLeft: 8
    },
    moreMargin: {
        marginRight: 8
    },
    lastText: {
        flexGrow: 1,
        textAlign: 'right'
    },
    cardPaddingFix: {
        paddingLeft: 16,
        marginTop: 8
    },
    loadSections: {
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    flatButton: {
        color: '#500000',
        fontWeight: 'bold'
    }
});