import React from 'react';

import Loading from '../Loading.js';

class ImagePreview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'loading',
        }
        this.loadImage = this.loadImage.bind(this);
    }

    componentDidMount() {
        this.loadImage();
    }

    loadImage(){
        this.setState({status: 'loading'});
        fetch(process.env.REACT_APP_API+"images/"+this.props.content.id,
        {
            method: 'GET',
            headers: {'token': this.props.token}
        })
        .then(res => res.blob())
        .then(image => {
            this.setState({image: URL.createObjectURL(image), status: 'loaded'});
        })
        .catch(err => {
            console.log(err);
            this.setState({status: 'error'});
        });
    }

    render(){
        return <>
            <div class="col-lg-auto col-md-3 col-sm-4 col-auto titlepreview-card-col">
                <div class="titlepreview-card card bg-secondary justify-content-center" role="button" onClick={this.props.open}>
                    <Loading status={this.state.status}>
                        <img src={this.state.image} class="card-img titlepreview-img" alt="..."/>
                    </Loading>
                </div>
            </div>
        </>;
    }

}

export default ImagePreview;