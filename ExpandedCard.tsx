import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { Form, Input, Item, Icon, CheckBox, ListItem, Button, Spinner } from 'native-base';

import Course from './Course';
import { Platform } from '@unimodules/core';
import Section from './Section';
import validDepartments from './depts_list.json';
import { SERVER_URL } from './util';

interface ExpandedCardProps { 
    course: Course; 
    onCollapse: Function; 
    onChangeCourse: Function; 
    onRemove: (e?: any) => any 
}

export default function ExpandedCard(props: ExpandedCardProps) {
    const {course, onCollapse, onChangeCourse, onRemove} = props;
    const {department, courseNum} = course;
    const [sections, setSections] = useState([]);
    const [isDeptValid, setDeptValid] = useState(true);
    const [loading, setLoading] = useState(false);

    function loadSections() {
        setLoading(true)
        fetch(SERVER_URL+'/sections?department='+department+'&courseNum='+courseNum).then(
            res => res.json()).then(res => {
            setSections(res);
            setLoading(false);
        }).catch(err => console.log(err));
    }

    function renderSection(section: Section) {
        const {sectionNum, professor, seatsOpen, seatsTotal} = section;
        return (<ListItem style={styles.flexRow} key={sectionNum}>
            <CheckBox 
                color="#500000"
                checked={course.sections.includes(sectionNum)} 
                onPress={() => updateSectionNums(sectionNum)} />
            <Text style={styles.morePadding}>{sectionNum}</Text>
            <Text style={styles.morePadding}>{professor}</Text>
            <Text style={styles.lastText}>{seatsOpen}/{seatsTotal} available</Text>
        </ListItem>);
    }

    function validateDepartment(input: string) {
        setDeptValid(validDepartments.includes(input));
    }

    function updateDepartment(newVal: string) {
        // notify parent
        onChangeCourse({ department: newVal, courseNum: '', sections: [] });
    }

    function updateCourseNum(newVal: string) {
        // notify parent
        onChangeCourse({...course, courseNum: newVal, sections: []});
    }

    function updateSectionNums(sectionNum: string) {
        let newSections = [];
        if (course.sections.includes(sectionNum))
            newSections = course.sections.filter(sec => sec != sectionNum)
        else
            newSections = course.sections.concat([sectionNum])
        onChangeCourse({...course, sections: newSections})
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
                            updateDepartment(text)
                        }}
                        onBlur={() => validateDepartment(department)}
                    />
                    {isDeptValid ? [] : <Icon name="error" type="MaterialIcons" color="red" /> }
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
                :   (loading ? <Spinner color="#500000" /> : 
                    (<View>
                        {course.sections.length ? 
                        <Text style={styles.cardPaddingFix}>
                            Currently watching sections {course.sections.reduce((acc, curr) => acc +", "+curr)}
                        </Text> 
                        : <Text style={styles.cardPaddingFix}>No sections selected</Text>}
                        <Button transparent onPress={loadSections} style={styles.loadSections}>
                            <Text style={styles.flatButton}>
                                {Platform.OS === 'android' ? 'LOAD SECTIONS' : 'Load Sections'}
                            </Text>
                        </Button>
                    </View>))
                
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