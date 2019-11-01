import * as React from 'react';
import { useState } from 'react';

import CollapsedCard from './CollapsedCard';
import ExpandedCard from './ExpandedCard';

export default function CollapsibleCard(props) {
    const {course} = props;
    const [collapsed, setCollapsed] = useState(false);

    if (collapsed)
        return <CollapsedCard course={course} onExpand={() => setCollapsed(false)} />
    else
        return <ExpandedCard course={course} onCollapse={() => setCollapsed(true)} />
}