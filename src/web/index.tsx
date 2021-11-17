import React from 'react'
import ReactDOM from 'react-dom'
import TextView from '../components/TextView';

import './index.css';

const App = (): JSX.Element => {
    return (
    <div>
        <TextView />
    </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
