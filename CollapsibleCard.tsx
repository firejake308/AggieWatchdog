import * as React from 'react';
import { useState } from 'react';

import CollapsedCard from './CollapsedCard';
import ExpandedCard from './ExpandedCard';
import Course from './Course';

export default function CollapsibleCard(props: { course: Course; onRemoveCourse: (e?: any) => any;}) {
    const {onRemoveCourse} = props;
    const [collapsed, setCollapsed] = useState(false);
    const [course, setCourse] = useState(props.course);

    if (collapsed)
        return <CollapsedCard course={course} onExpand={() => setCollapsed(false)} onRemove={onRemoveCourse} />
    else
        return <ExpandedCard 
                    course={course} 
                    onCollapse={() => setCollapsed(true)}
                    onChangeCourse={async (newCourse: Course) => setCourse(newCourse)}
                    onRemove={onRemoveCourse} />
}