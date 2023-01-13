import React from 'react';

import './TitlePreview.css';

const SVG = require('../../util/svg.js');

class TitlePreview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hovering: false,
            thumbnailLoadFailed: false
        }

        this.hover = this.hover.bind(this);
        this.thumbnailFailedToLoad = this.thumbnailFailedToLoad.bind(this);
    }

    hover(){
        this.setState({hovering: !this.state.hovering});
    }

    thumbnailFailedToLoad(e){
        this.setState({thumbnailLoadFailed: true}); 
    }

    render(){

        return (
            <div class="col-lg-auto col-md-3 col-sm-4 col-auto">
                <a class="card bg-gradient-primary bg-transparent border-0 overflow-hidden text-decoration-none" onMouseEnter={this.hover} onMouseLeave={this.hover} href={"/title/"+this.props.title.id}>
                    <div class={this.state.hovering ? 'showcase-gradient' : ''}>
                        {this.state.thumbnailLoadFailed || !this.props.title.thumbnail ? 
                                <div class="failed-thumbnail-preview" style={{width: '160px', height: '240px'}}><div style={{color: "rgba(16,9,9,.6)", margin: "auto", position: "absolute", width: "80%", bottom: "0", top: "0"}}><SVG.MovieReel w="100%" h="auto" /></div>
                                <h5 style={{position: "relative"}} class="w-100">{this.props.title.title}</h5></div> :
                                    <img src={process.env.REACT_APP_API+"images/"+this.props.title.thumbnail} class="rounded-3" style={{width: '160px', height: '240px'}} alt="..."
                                    onError={this.thumbnailFailedToLoad}/>}
                        {/* <img src={process.env.REACT_APP_API+"images/"+this.props.title.thumbnail} class="rounded-3" style={{width: '160px', height: '240px'}} alt="..."/> */}
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