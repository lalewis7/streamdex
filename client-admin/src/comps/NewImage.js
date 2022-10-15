import React from 'react';
import isEqual from 'lodash/isEqual';

import Modal from '../Modal.js';

class NewImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            file: null,
            file_url: null
        }
        this.createImage = this.createImage.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(this.props.image, prevProps.image) || (this.props.show != prevProps.show && this.props.show))
            this.resetForms();
    }

    resetForms(){
        this.setState({
            // form data
            file: null,
            file_url: null
        });
    }

    handleFile (evt) {
        console.log(evt.target.files[0]);
        this.setState({ [evt.target.name]: evt.target.files[0], [evt.target.name+"_url"]: URL.createObjectURL(evt.target.files[0]) });
    }

    createImage(evt){
        this.setState({loading: true, submitted: true});
        evt.preventDefault();

        if (!this.state.file){
            this.setState({loading: false});
            return;
        }

        const formData = new FormData();
        formData.append('file', this.state.file);

        fetch(process.env.REACT_APP_API+"images/", {
            method: 'POST', 
            headers: { 'token': this.props.token },
            body: formData
        })
            .then(res => res.text())
            .then(id => {
                // successfully created user
                this.props.setVisible(false);
                this.props.loadImages();
                this.props.viewImage(id);
            }, err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({loading: false});
            });
    }

    render(){

        let createBtn = <button type="submit" class="btn btn-primary">Create New Image</button>;
        if (this.state.loading)
            createBtn = <>
                    <button type="submit" class="btn btn-primary">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span class="visually-hidden">Loading...</span>
                    </button>
                </>
        else if (!this.state.file)
            createBtn = <button type="submit" class="btn btn-primary" disabled>Create New Image</button>;

        let imgPreview = <></>;
        if (this.state.file_url)
            imgPreview = <div class="row my-3">
                <div class="col-12">
                    <img src={this.state.file_url} class="w-100"/>
                </div>
            </div>

        let input = <input class="form-control form-control-lg" type="file" id="formFile" name="file" onChange={this.handleFile} />
        if (!this.state.file)
            input = <input class="form-control form-control-lg" type="file" id="formFile" name="file" onChange={this.handleFile} value={""} />

        return <>
            <form onSubmit={this.createImage}>
                <Modal show={this.props.show} id="new-image-modal" setVisible={this.props.setVisible} >
                    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2 class="modal-title">Create New Image</h2>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row my-3">
                                    <div class="col-12">
                                        {input}
                                    </div>
                                </div>
                                {imgPreview}
                            </div>
                            <div class="modal-footer">
                                {createBtn}
                            </div>
                        </div>
                    </div>
                </Modal>
            </form>
        </>;
    }

}

export default NewImage;