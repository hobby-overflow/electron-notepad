import React from 'react'

export default class TextView extends React.Component<{},{}> {

    constructor(props: any) {
        super(props);
    }

    render () {
        return (
        <>
            <p>TextView Component</p>
            <p>Reload Test</p>
            <p>Reload ??</p>
        </>
        )
    }
}
