function ComponentOne() {
    return (
        <div>
            Hello From other app!!
        <div>    Sharing component 1</div>
        </div>
    )
}

function ComponentTwo() {
    return (
        <div>Sharing component 2</div>
    )
}

export function sharingFunction() {
    console.log('shared function!!');
}

export {
    ComponentOne, ComponentTwo
}