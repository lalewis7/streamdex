import React from 'react';

import Movie from './Movie.js';
import Modal from '../Modal.js';
import Loading from '../Loading.js';

const Config = require('../config.json');
const SVG = require('../svg.js');

class Title extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "waiting",
            loading: false,
            title: null, 
            deleting: false,

            responseMsgVisible: false,
            responseMsg: "",
            responseMsgError: true
        }
        this.saveChanges = this.saveChanges.bind(this);
        this.changesMade = this.changesMade.bind(this);
        this.loadTitle = this.loadTitle.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount(){
        if (this.props.title)
            this.loadTitle();
    }

    componentDidUpdate(prevProps){
        if (prevProps.title !== this.props.title){
            this.loadTitle();
        }
    }

    saveChanges(evt){
        evt.preventDefault();
    }

    loadTitle(silent = false){
        if (this.props.title){
            if (!silent)
                this.setState({status: "loading"});
            fetch(Config.API+"titles/"+this.props.title,
            {
                method: 'GET',
                headers: {'token': this.props.token}
            })
            .then(res => res.json())
            .then(title => {
                if (!silent)
                    this.setState({status: 'loaded', title: title});
                else
                    this.setState({title: title});
            })
            .catch(err => {
                if (!silent)
                    this.setState({status: "error"});
                console.log(err);
            });
        }
    }

    delete(){
        if (window.confirm("Are you sure you want to delete this title?")){
            this.setState({deleting: true});
            fetch(Config.API+"titles/"+this.props.title,
            {
                method: 'DELETE',
                headers: {'token': this.props.token}
            })
            .then(res => {
                // successfully created user
                if (res.ok){
                    this.props.loadTitles();
                    this.props.setVisible(false);
                    this.props.toastMessage(<SVG.Check w="1.7em" h="1.7em" />, "text-success", "Title deleted.");
                    this.setState({deleting: false});
                }
                else {
                    this.props.setVisible(false);
                    this.props.toastMessage(<SVG.Exclamation w="1.7em" h="1.7em" />, "text-danger", "An error occured while deleting title.");
                    this.setState({deleting: false});
                }
            }, err => {
                this.props.setVisible(false);
                this.props.toastMessage(<SVG.Exclamation w="1.7em" h="1.7em" />, "text-danger", "An error occured while deleting title.");
                this.setState({deleting: false});
                console.log(err);
            })
        }
    }

    changesMade(){
        return false;
    }

    render(){

        let saveChangesBtn = <button type="submit" class="btn btn-primary">Save Changes</button>

        if (!this.changesMade())
            saveChangesBtn = <button type="submit" class="btn btn-primary" disabled>Save Changes</button>
        
        if (this.state.loading)
            saveChangesBtn = <button type="submit" class="btn btn-primary" >
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            </button>

        let deleteBtn = <button type="button" class="btn btn-danger" onClick={() => this.delete()}><SVG.Trash w="1.1em" h="1.1em"/></button>;
        if (this.state.deleting)
            deleteBtn = <button type="button" class="btn btn-danger" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            </button>;

        let responseMsgColor = "text-danger";
        if (!this.state.responseMsgError)
            responseMsgColor = "text-success";

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

        if (this.state.title && this.state.title.seasons)
            content = <></>
        else if (this.state.title && !this.state.title.seasons)
            content = <Movie id={this.props.title} title={this.state.title} show={this.props.show} statusChange={status => this.setState({status: status})} setLoading={loading => this.setState({loading: loading})} />

        return <>
            <form onSubmit={this.saveChanges}>
                <Modal show={this.props.show} id="title-edit-modal" setVisible={this.props.setVisible} >
                <div class="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
                     <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title">Edit Title</h2>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <Loading status={this.state.status}>
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

export default Title;