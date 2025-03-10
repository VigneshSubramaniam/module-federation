import React from 'react';

export function ComponentOne(): JSX.Element {
    return (
        <div>
            Hello From other app!!
            <div>Sharing component 1</div>
        </div>
    );
}

export function ComponentTwo(): JSX.Element {
    return (
        <div>Sharing component 2</div>
    );
}

export function sharingFunction(): void {
    console.log('shared function!!');
} 