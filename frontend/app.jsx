import React from 'react';
import ReactDOM from 'react-dom';

function Root() {
    return (
        <div>
            Hello World in React
        </div>
    )
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Root />, document.getElementById('main-content'))
})
