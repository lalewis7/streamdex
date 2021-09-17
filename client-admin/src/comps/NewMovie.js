import React from 'react';
import isEqual from 'lodash/isEqual';

import Movie from './Movie.js';
import Modal from '../Modal.js';

const Config = require('../config.json');
const SVG = require('../svg.js');

class NewMovie extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            titleEdits: {}
        }
        this.changesMade = this.changesMade.bind(this);
        this.emptyMovie = this.emptyMovie.bind(this);
        this.createMovie = this.createMovie.bind(this);
    }

    emptyMovie(){
        return {
            id: '',
            title: '',
            description: '',
            maturity: '',
            imdb_link: '',
            imdb_rating: '',
            rotten_tomatoes_link: '',
            rotten_tomatoes_rating: '',
            thumbnail: '',
            links: [],
            genres: [],
            rel_date: null,
            runtime: null,
            trailer: '',
            availability: [],
        };
    }

    createMovie(evt){
        this.setState({loading: true});
        evt.preventDefault();

        let edits = {...this.state.titleEdits, type: "movie"};
        delete edits.id;
        let links = edits.links;
        delete edits.links;
        let availability = edits.availability;
        delete edits.availability;

        fetch(Config.API+"titles/",
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'token': this.props.token},
            body: JSON.stringify(edits)
        })
            .then(res => res.ok ? res.text() : Promise.reject())
            .then(id => {
                let requests = [];
                if (links)
                    links.map(link => {
                        requests.push(
                            fetch(Config.API+"titles/"+id+"/links/"+link.platform,
                            {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json', 'token': this.props.token},
                                body: JSON.stringify({link: link.link})
                            })
                            .then(res => res.ok ? res : Promise.reject())
                        );
                    })
                
                if (availability)
                    availability.map(available => {
                        available.countries.map(country => {
                            requests.push(
                                fetch(Config.API+"titles/"+id+"/availability/"+available.platform,
                                {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json', 'token': this.props.token},
                                    body: JSON.stringify({country: country, available: true})
                                })
                                .then(res => res.ok ? res : Promise.reject())
                            );
                        })
                    })
                return Promise.all(requests);
            })
            .then(() => {
                this.props.setVisible(false);
                this.props.loadTitles();
                this.props.toastMessage(<SVG.Check w="1.7em" h="1.7em" />, "text-success", "Movie created.");
            })
            .catch(err => {
                this.props.setVisible(false);
                this.props.toastMessage(<SVG.Exclamation w="1.7em" h="1.7em" />, "text-danger", "An error occured while creating movie.");
                console.log(err);
            })
            .finally(() => {
                this.setState({loading: false});
            });
    }

    changesMade(){
        return !isEqual(this.emptyMovie(), this.state.titleEdits);
    }

    render(){

        let createBtn = <button type="submit" class="btn btn-primary">Create Movie</button>

        if (!this.changesMade() || (this.state.titleEdits.title !== undefined && this.state.titleEdits.title.length === 0))
            createBtn = <button type="submit" class="btn btn-primary" disabled>Create Movie</button>
        
        if (this.state.loading)
            createBtn = <button type="submit" class="btn btn-primary" >
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            </button>

        return <>
            <form onSubmit={this.createMovie}>
                <Modal show={this.props.show} id="movie-create-modal" setVisible={this.props.setVisible} >
                <div class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
                     <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title">Create Movie</h2>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <Movie htmlId="movie-create" token={this.props.token} title={this.emptyMovie()} show={this.props.show} updateContent={edits => this.setState({titleEdits: edits})} />
                        </div>
                        <div class="modal-footer">
                            <div class="w-100 d-flex flex-row justify-content-end">
                                {createBtn}
                            </div>
                        </div>
                    </div>
                    </div>
                </Modal>
            </form>
        </>;
    }

}

export default NewMovie;