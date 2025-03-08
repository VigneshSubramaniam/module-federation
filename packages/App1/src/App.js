import React, {lazy, useEffect} from 'react';
const App = lazy(() => import("app2/app"));
// const App = lazy(() => import("viteapp/app"));
// const {SharedComponentOne, ComponentTwo, sharingFunction} = lazy(() => import("app2/sharedComponents").then((mod) => ({ SharedComponentOne: mod.ComponentOne, ComponentTwo: mod.ComponentTwo, sharingFunction })))
// const {SharedComponentOne} = lazy(() => import("app2/sharedComponents").then((mod) => {return {SharedComponentOne: mod.ComponentOne}})
// const AllComponents = lazy(() => import("app2/sharedComponents").then((mod) => {
//     console.log('mod::', mod)
//     return { default: mod.ComponentOne}
// }));

// console.log(AllComponents)

import {sharingFunction, ComponentOne} from "app2/sharedComponents"
// import {ComponentOne} from 'app2/MultipleComponents'


const Hello = () => {
    const [shown, setShown] = React.useState(false)
    useEffect(()=> {
        // sharingFunction()
        // console.log(allImports)
    }, [])
    return (
        <>
            <h1>App one Vignesh</h1>
            {!shown && <button onClick={()=> {setShown(true)}}>Show second app on click</button>}
            {shown && <React.Suspense fallback='loading...'>
                <App/>
            </React.Suspense>}
            <ComponentOne/>
            {/* <ComponentTwo/> */}
        </>
    )
};

export default Hello;