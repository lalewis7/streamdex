import React from 'react';
import ReactDOM from 'react-dom';

var Utils = require('../util/utils.js');

class TitlePreview extends React.Component {

    constructor(props){
        super(props);
        console.log(this.props);
    }

    render(){
        return (
            <>
            <div class="row">
                <div class="col" style={{minWidth: '200px'}}>
                    <h2>{this.props.title}</h2>
                    <p><span class="badge bg-secondary">{this.props.mpaa.toUpperCase()}</span> | {this.props.year} | {Utils.runtime(this.props.runtime)}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="ratio ratio-16x9">
                        <iframe src={"https://www.youtube.com/embed/"+this.props.trailer} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
            </>
        );
    }

}

export default TitlePreview;