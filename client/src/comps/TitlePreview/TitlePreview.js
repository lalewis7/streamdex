import React from 'react';

import './TitlePreview.css';

const Config = require('../../util/config.js');

class TitlePreview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hovering: false
        }

        this.hover = this.hover.bind(this);

    }

    hover(){
        this.setState({hovering: !this.state.hovering});
    }

    render(){

        return (
            <a class="titlepreview-card card text-center bg-gradient-primary" onMouseEnter={this.hover} onMouseLeave={this.hover} href={"/title/"+this.props.title.id}>
                <div class="d-flex flex-row">
                    <div class={this.state.hovering ? 'showcase-gradient' : ''}>
                        <img src={Config.API+"images/"+this.props.title.thumbnail} class="card-img titlepreview-img" alt="..."/>
                    </div>
                    {this.state.hovering ? (
                        <div class="card-img-overlay d-flex align-items-end justify-content-center">
                            <h5 class="card-text p-1 bg-gradient-success text-white">{this.props.title.title}</h5>
                        </div>
                    ) : ''}
                </div>
            </a>
        );
    }

}

export default TitlePreview;