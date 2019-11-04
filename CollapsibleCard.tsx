import * as React from 'react';
import { useState } from 'react';

import CollapsedCard from './CollapsedCard';
import ExpandedCard from './ExpandedCard';
import Course from './Course';

interface CollapsibleCardProps {
    course: Course; 
    onRemoveCourse: (e?: any) => any; 
    onChange: (c: Course) => any;
}

export default function CollapsibleCard(props: CollapsibleCardProps) {
    const {onRemoveCourse, onChange, course} = props;
    const [collapsed, setCollapsed] = useState(false);
    
    if (collapsed)
        return <CollapsedCard course={course} onExpand={() => setCollapsed(false)} onRemove={onRemoveCourse} />
    else
        return <ExpandedCard 
                    course={course} 
                    onCollapse={() => setCollapsed(true)}
                    onChangeCourse={(newCourse: Course) => onChange(newCourse)}
                    onRemove={onRemoveCourse} />
}