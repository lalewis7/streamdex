import React from 'react';
import isEqual from 'lodash/isEqual';

import Modal from '../Modal.js';
import HorizontalScrollable from '../HorizontalScrollable.js';
import Loading from '../Loading.js';

const Config = require('../config.json');
const SVG = require('../svg.js');

class ImageEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 'Preview',
            status: 'loading',
            loading: false,
            deleting: false,
            image: null,
            imagePreview: null,

            // form
            description: '',
            public: false
        };
        this.saveChanges = this.saveChanges.bind(this);
        this.loadImage = this.loadImage.bind(this);
        this.changesMade = this.changesMade.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.resetTabs = this.resetTabs.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount(){
        if (this.props.image)
            this.loadImage();
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.image !== this.props.image)
            this.loadImage();
        if (!isEqual(this.state.image, prevState.image)){
            this.resetForms();
        }
        if (this.props.show != prevProps.show && this.props.show){
            this.resetForms();
            this.resetTabs();
        }
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    handleCheck (evt) {
        this.setState({ [evt.target.name]: evt.target.checked ? true : false });
    }

    resetForms(){
        if (this.state.image)
            this.setState({
                // form
                description: this.state.image.description ? this.state.image.description : '',
                public: this.state.image.public ? this.state.image.public : false,
            });
        else
            this.setState({
                // form
                description: '',
                public: false,
            });
    }

    resetTabs(){
        this.setState({
            tab: 'Preview'
        });
    }

    delete(){
        if (window.confirm("Are you sure you want to delete this image?")){
            this.setState({deleting: true});
            fetch(Config.API+"images/"+this.props.image,
            {
                method: 'DELETE',
                headers: {'token': this.props.token}
            })
            .then(res => {
                // successfully created user
                if (res.ok){
                    this.props.loadImages();
                    this.props.setVisible(false);
                    this.props.toastMessage(<SVG.Check w="1.7em" h="1.7em" />, "text-success", "Image deleted.");
                    this.setState({deleting: false});
                }
                else {
                    this.props.toastMessage(<SVG.Exclamation w="1.7em" h="1.7em" />, "text-danger", "An error occured while deleting image.");
                    this.setState({deleting: false});
                }
            }, err => {
                this.props.toastMessage(<SVG.Exclamation w="1.7em" h="1.7em" />, "text-danger", "An error occured while deleting image.");
                this.setState({deleting: false});
                console.log(err);
            })
        }
    }

    loadImage(silent = false){
        if (this.props.image){
            if (!silent)
                this.setState({status: "loading"});
            fetch(Config.API+"images/"+this.props.image+"/info",
            {
                method: 'GET',
                headers: {'token': this.props.token}
            })
            .then(res => res.json())
            .then(image => {
                this.setState({image: image});
                return fetch(Config.API+"images/"+this.props.image, {
                    method: 'GET',
                    headers: {'token': this.props.token}
                });
            })
            .then(res => res.blob())
            .then(imageBlob => {
                if (!silent)
                    this.setState({status: 'loaded', imagePreview: URL.createObjectURL(imageBlob)});
                else
                    this.setState({imagePreview: URL.createObjectURL(imageBlob)});
            })
            .catch(err => {
                if (!silent)
                    this.setState({status: "error"});
                console.log(err);
            });
        }
    }

    saveChanges(evt){
        this.setState({loading: true})
        evt.preventDefault();

        const body = {
            description: this.state.description,
            public: this.state.public
        };
        
        fetch(Config.API+"images/"+this.state.image.id, 
        {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', 'token': this.props.token },
            body: JSON.stringify(body)
        })
        .then(res => {
            // successfully created user
            if (res.ok){
                this.props.setVisible(false);
                this.props.toastMessage(<SVG.Check w="1.7em" h="1.7em" />, "text-success", "Changes saved.");
                this.setState({
                    image: {...this.state.image, ...body}
                });
            }
            else {
                this.props.toastMessage(<SVG.Exclamation w="1.7em" h="1.7em" />, "text-danger", "An error occured while saving changes.");
            }
        }, err => {
            this.props.toastMessage(<SVG.Exclamation w="1.7em" h="1.7em" />, "text-danger", "An error occured while saving changes.");
            console.log(err);
        })
        .finally(() => {
            this.setState({loading: false});
        });
    }

    changesMade(){
        return this.state.image && (this.state.description !== this.state.image.description || this.state.public !== this.state.image.public);
    }

    render(){

        let saveChangesBtn = <button type="submit" class="btn btn-primary">Save Changes</button>

        if (!this.changesMade())
            saveChangesBtn = <button type="submit" class="btn btn-primary" disabled>Save Changes</button>

        if (this.state.loading)
            saveChangesBtn = <button type="submit" class="btn btn-primary" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            </button>

        let deleteBtn = <button type="button" class="btn btn-danger" onClick={() => this.delete()}><SVG.Trash w="1.1em" h="1.1em"/></button>;
        if (this.state.deleting)
            deleteBtn = <button type="button" class="btn btn-danger" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            </button>;

        let footer = <></>;

        if (this.state.status === "loaded")
            footer = <>
                <div class="modal-footer">
                    <div class="w-100 d-flex flex-row justify-content-between">
                        {deleteBtn}
                        {saveChangesBtn}
                    </div>
                </div>
            </>;

        let content = <></>;

        if (this.state.tab === 'Preview'){
            content = <>
                <div class="row my-3">
                    <div class="col-12">
                        <img src={this.state.imagePreview} class="w-100" />
                    </div>
                </div>
            </>
        }
        else if (this.state.tab === "Details"){
            content = <>
                <div class="row my-3">
                    <div class="col-12">
                        <div class="input-group">
                            <span class="input-group-text border-0 bg-highlight text-head2 shadow-none" >
                                <SVG.Id w={'1.15em'} h={'1.15em'}/>
                            </span>
                            <input type="text" readOnly class="form-control border-0 bg-highlight text-head text-input disabled" placeholder="No ID. Image does not exist" value={this.state.image.id} onFocus={(evt) => evt.target.select()} />
                        </div>
                    </div>
                </div>
                <div class="row my-3">
                    <div class="col-12">
                        <div class="form-floating">
                            <input type="text" class="form-control" placeholder="Description" name="description" value={this.state.description} onChange={this.handleChange} />
                            <label>Description</label>
                        </div>
                    </div>
                </div>
                <div class="row my-3">
                    <div class="col d-flex">
                        <div class="form-check">
                            <input class="form-check-input" id="image-edit-public" type="checkbox" value="" name="public" checked={this.state.public} onChange={this.handleCheck} />
                            <label class="form-check-label text-light" for="image-edit-public" >
                                Publicily Visible
                            </label>
                        </div>
                    </div>
                </div>
            </>
        }
        else if (this.state.tab === "Titles"){
            content = <>
                <p class="m-3">TODO: This section</p>
            </>
        }

        return <>
            <form onSubmit={this.saveChanges}>
                <Modal show={this.props.show} id="edit-image-modal" setVisible={this.props.setVisible}>
                    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2 class="modal-title">Edit Image</h2>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <Loading status={this.state.status}>
                                    <div class="row">
                                        <div class="col-12">
                                            <HorizontalScrollable>
                                                <ul class="nav nav-tabs">
                                                    {["Preview", "Details", "Titles"].map(tab => 
                                                        <li class="nav-item" role="button" onClick={() => this.setState({tab: tab})}>
                                                            <span class={this.state.tab === tab ? "nav-link active" : "nav-link"}>{tab}</span>
                                                        </li>
                                                    )}
                                                    <div class="flex-grow-1"></div>
                                                </ul>
                                            </HorizontalScrollable>
                                        </div>
                                    </div>
                                    {content}
                                </Loading>
                            </div>
                            {footer}
                        </div>
                    </div>
                </Modal>
            </form>
        </>;
    }

}

export default ImageEdit;