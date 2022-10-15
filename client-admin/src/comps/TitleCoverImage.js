import React from 'react';
import isEqual from 'lodash/isEqual';

import Loading from '../Loading.js';

class TitleCoverImage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            cover_image: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.resetForms = this.resetForms.bind(this);
    }

    componentDidMount(){
        if (this.props.content)
            this.resetForms();
        else
            this.updateContent();
    }

    componentDidUpdate(prevProps, prevState){
        if (!isEqual(this.state, prevState))
            this.updateContent();
        if (!isEqual(this.props.content, prevProps.content) || (this.props.content && this.props.show !== prevProps.show))
            this.resetForms();
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    updateContent(){
        this.props.updateContent({
            thumbnail: this.state.cover_image
        });
    }

    resetForms(){
        this.setState({
            cover_image: this.props.content.thumbnail
        });
    }

    render(){
        return <>
            <div class="row my-3">
                <div class="col-12">
                    <div class="form-floating">
                        <input type="text" class="form-control" placeholder="Cover Image" name="cover_image" value={this.state.cover_image} onChange={this.handleChange} />
                        <label>Cover Image</label>
                    </div>
                </div>
            </div>
            <TitleCoverImagePreview token={this.props.token} image={this.state.cover_image} />
        </>;
    }

}

class TitleCoverImagePreview extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            status: 'loading',
            image: null
        }
        this.loadImage = this.loadImage.bind(this);
    }

    componentDidMount(){
        this.loadImage();
    }

    componentDidUpdate(prevProps){
        if (this.props.image !== prevProps.image)
            this.loadImage();
    }

    loadImage(){
        fetch(process.env.REACT_APP_API+"images/"+this.props.image, {
            method: 'GET',
            headers: {'token': this.props.token}
        })
            .then(res => res.ok ? res : Promise.reject())
            .then(res => res.blob())
            .then(imageBlob => {
                this.setState({status: 'loaded', image: URL.createObjectURL(imageBlob)});
            })
            .catch(err => {
                this.setState({status: "error"});
            });
    }

    render(){
        return <>
            <div class="row my-3">
                <div class="col-12 d-flex justify-content-center">
                    <Loading status={this.state.status} >
                        <img src={this.state.image} alt="..." class="mw-100" style={{maxHeight: '700px'}} />
                    </Loading>
                </div>
            </div>
        </>
    }

}

export default TitleCoverImage;