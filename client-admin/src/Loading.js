import React from 'react';

const SVG = require('./svg.js');

class Loading extends React.Component {

    render(){
        let content = this.props.children;
        if (this.props.status === 'error')
            content = <>
                <div class="text-center text-light mt-4">
                    <SVG.ExclamationTriangle w="2.15em" h="2.15em"/>
                    <br/>
                    Error loading
                </div>
            </>
        else if (this.props.status === 'loading' || this.props.status === 'waiting'){
            content = <>
                <div class="text-center mt-4">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        }
        return <>
            {content}
        </>
    }

}

export default Loading;