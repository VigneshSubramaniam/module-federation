import React, { lazy } from 'react';
import { useApp1Store } from './store/app1Store';

// Define types for the lazy-loaded components
type App2Type = React.ComponentType<any>;

// Lazy load the App component from app2
const App = lazy(() => import("app2/app") as Promise<{ default: App2Type }>);

// Import shared components
import { ComponentOne } from "app2/sharedComponents";

const Hello: React.FC = () => {
    // Use the store from App1
    const { shown, setShown } = useApp1Store();
    
    return (
        <>
            <h1>App one Vignesh</h1>
            {!shown && <button onClick={() => setShown(true)}>Show second app on click</button>}
            {shown && <React.Suspense fallback={<div>loading...</div>}>
                <App/>
            </React.Suspense>}
            <ComponentOne/>
            {/* <ComponentTwo/> */}
        </>
    );
};

export default Hello; 