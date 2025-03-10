import React, { lazy, useEffect, useState } from 'react';

// Define types for the lazy-loaded components
type App2Type = React.ComponentType<any>;

// Lazy load the App component from app2
const App = lazy(() => import("app2/app") as Promise<{ default: App2Type }>);

// Import shared components
import { sharingFunction, ComponentOne } from "app2/sharedComponents";

const Hello: React.FC = () => {
    const [shown, setShown] = useState<boolean>(false);
    
    useEffect(() => {
        // sharingFunction()
        // console.log(allImports)
    }, []);
    
    return (
        <>
            <h1>App one Vignesh</h1>
            {!shown && <button onClick={() => {setShown(true)}}>Show second app on click</button>}
            {shown && <React.Suspense fallback={<div>loading...</div>}>
                <App/>
            </React.Suspense>}
            <ComponentOne/>
            {/* <ComponentTwo/> */}
        </>
    );
};

export default Hello; 