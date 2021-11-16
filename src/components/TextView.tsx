import React from 'react'

export default class TextView extends React.Component<{},{}> {

    constructor(props: any) {
        super(props);
    }

    render () {
        return (
        <>
            <p>TextView Component</p>
            <p>TextView Reload Test</p>
            <p>TextView Reload</p>
        </>
        )
    }
}
