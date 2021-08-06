import React from 'react';
import { withRouter } from "react-router";

import Header from '../Header.js';
import ImagePreview from './ImagePreview.js';
import Loading from '../Loading.js';
import NewImage from './NewImage.js';
import ImageEdit from './ImageEdit.js';
import Toasts from '../Toasts.js';

const SVG = require('../svg.js');
const Config = require('../config.json');

class ImagesTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            status: 'loading',
            toastMessage: null,
            toastMessageCounter: 0,
            selectedImage: undefined,
            showImage: false,
            showNewImage: false,
            query: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
        this.loadImages = this.loadImages.bind(this);
        this.viewImage = this.viewImage.bind(this);
        this.setImageVisible = this.setImageVisible.bind(this);
        this.toastMessage = this.toastMessage.bind(this);
    }

    componentDidMount() {
        this.loadImages();
        if (this.props.match.params.id)
            this.setState({selectedImage: this.props.match.params.id, showImage: true});
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    search(evt){
        evt.preventDefault();
        this.loadImages();
    }

    loadImages(){
        this.setState({status: 'loading'});
        let url = Config.API+"images";
        if (this.state.query.length > 0)
            url += "?q="+this.state.query;
        fetch(url,
        {
            method: 'GET',
            headers: {'token': this.props.token}
        })
        .then(res => res.json())
        .then(images => {
            console.log(images);
            this.setState({images: images, status: 'loaded'});
        })
        .catch(err => {
            console.log(err);
            this.setState({status: 'error'});
        });
    }

    viewImage(name){
        this.props.history.push("/images/"+name);
        this.setState({selectedImage: name, showImage: true});
    }

    setImageVisible(visible){
        if (!visible)
            this.props.history.push("/images");
        this.setState({showImage: visible});
    }

    toastMessage(icon, icon_color, msg){
        this.setState({toastMessage: <>
            <span class={icon_color}>
                {icon}
            </span> {msg}
        </>, toastMessageCounter: ++this.state.toastMessageCounter});
    }

    render(){
        return <>
            <Header setToken={this.props.setToken} deleteToken={this.props.deleteToken} token={this.props.token}/>
            <NewImage show={this.state.showNewImage} setVisible={(visible) => {this.setState({showNewImage: visible})}} loadImages={this.loadImages} token={this.props.token} toastMessage={this.toastMessage} viewImage={this.viewImage}/>
            <ImageEdit show={this.state.showImage} setVisible={(visible) => this.setImageVisible(visible)} loadImages={this.loadImages} token={this.props.token} image={this.state.selectedImage} toastMessage={this.toastMessage} />
            <div class="position-fixed p-3 bottom-0 end-0 toast-z">
                <Toasts id="image_toasts" message={this.state.toastMessage} counter={this.state.toastMessageCounter} />
            </div>
            <div class="container py-3">
                <div class="row">
                    <div class="col">
                        <form onSubmit={this.search}>
                            <div class="input-group">
                                <input id="header-searchbar" class="form-control" type="search" placeholder="Search" aria-label="Search" name="query" value={this.state.query} onChange={this.handleChange} />
                                <button class="btn btn-secondary d-flex align-items-center" type="submit">
                                    <SVG.Search w={'1em'} h={'1em'} />
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-secondary" onClick={() => {this.setState({showNewImage: true})}}>
                            <SVG.PlusSquare w="1.3em" h="1.3em"/>
                        </button>
                    </div>
                </div>
                <div class="row g-3 mt-2">
                    <Loading status={this.state.status}>
                        {this.state.images.map(img => <ImagePreview content={img} token={this.props.token} open={() => this.viewImage(img.id)}/>)}
                    </Loading>
                </div>
            </div>
        </>;
    }

}

export default withRouter(ImagesTable);