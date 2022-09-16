import React from 'react';

import './TitlePreview.css';

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
            <div class="col-lg-auto col-md-3 col-sm-4 col-auto">
                <a class="card bg-gradient-primary bg-transparent border-0 overflow-hidden" onMouseEnter={this.hover} onMouseLeave={this.hover} href={"/title/"+this.props.title.id}>
                    <div class={this.state.hovering ? 'showcase-gradient' : ''}>
                        <img src={process.env.REACT_APP_API+"images/"+this.props.title.thumbnail} class="rounded-3" style={{width: '160px', height: '240px'}} alt="..."/>
                    </div>
                    {/* {this.state.hovering ? (
                        <div class="card-img-overlay d-flex align-items-end justify-content-center">
                            <h5 class="card-text p-1 bg-gradient-success text-white">{this.props.title.title}</h5>
                        </div>
                    ) : ''} */}
                </a>
            </div>
        );
    }

}

export default TitlePreview;