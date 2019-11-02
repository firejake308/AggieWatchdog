import * as React from 'react';
import { useState } from 'react';

import CollapsedCard from './CollapsedCard';
import ExpandedCard from './ExpandedCard';
import Course from './Course';

export default function CollapsibleCard(props: { course: Course; }) {
    const [collapsed, setCollapsed] = useState(false);
    const [course, setCourse] = useState(props.course);

    if (collapsed)
        return <CollapsedCard course={course} onExpand={() => setCollapsed(false)} />
    else
        return <ExpandedCard 
                    course={course} 
                    onCollapse={() => setCollapsed(true)}
                    onChangeCourse={async (newCourse: Course) => setCourse(newCourse)} />
}