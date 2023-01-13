import React from 'react';
import ReactDOM from 'react-dom';

class NotFound extends React.Component {

    render() {
        return <>
            <div class="d-flex flex-column align-items-center mt-5 w-100">
                <h1 class="mt-3 mb-2">404 Error</h1>
                <p class="mb-4">Sorry, page not found</p>
                <a href="/"><button class="btn btn-secondary">Back to home</button></a>
            </div>
        </>
    }

}

export default NotFound;