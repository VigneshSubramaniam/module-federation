import React, {lazy} from 'react';
import {ComponentTwo, ComponentOne} from './MultipleComponents'

const Hello = () => {
    return (
        <>
            <h1>App 100</h1>
            <ComponentTwo/>
            <ComponentOne/>
        </>
    )
};

export default Hello;