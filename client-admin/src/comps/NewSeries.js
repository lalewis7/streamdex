import React from 'react';
import isEqual from 'lodash/isEqual';

import Series from './Series.js';
import Modal from '../Modal.js';

const Config = require('../config.json');
const SVG = require('../svg.js');

class NewSeries extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            changesMade: false
        }
        this.edits = {};
        this.updateChangesMade = this.updateChangesMade.bind(this);
        this.updateEdits = this.updateEdits.bind(this);
        this.emptySeries = this.emptySeries.bind(this);
        this.createSeries = this.createSeries.bind(this);
    }

    createSeries(evt){
        this.setState({loading: true});
        evt.preventDefault();

        let edits = {...this.edits, type: "show"};
        delete edits.id;
        let links = edits.links;
        delete edits.links;
        let seasons = [...edits.seasons];
        delete edits.seasons;

        const postAvailability = (availability, url, requests) => {
            availability.map(available => {
                available.countries.map(country => {
                    requests.push(
                        fetch(url+available.platform,
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json', 'token': this.props.token},
                            body: JSON.stringify({country: country, available: true})
                        })
                        .then(res => res.ok ? res : Promise.reject())
                    );
                })
            })
        }

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
                
                if (seasons){
                    seasons.map(s => {
                        let season = {...s};
                        let seasonAvailability = [...season.availability];
                        let episodes = [...season.episodes];
                        delete season.id;
                        delete season.availability;
                        delete season.episodes;
                        requests.push(
                            fetch(Config.API+"titles/"+id+"/seasons",
                            {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json', 'token': this.props.token},
                                body: JSON.stringify(season)
                            })
                            .then(res => res.ok ? res : Promise.reject())
                            .then(res => res.text())
                            .then(sID => {
                                postAvailability(seasonAvailability, "seasons/" + sID + "/availability", requests);
                                let episodeRequests = []
                                episodes.map(e => {
                                    let episode = {...e};
                                    let episodeAvailability = [...episode.availability];
                                    delete episode.id;
                                    delete episode.availability;
                                    episodeRequests.push(
                                        fetch(Config.API+"seasons/"+sID+"/episodes",
                                        {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json', 'token': this.props.token},
                                            body: JSON.stringify(episode)
                                        })
                                        .then(res => res.ok ? res : Promise.reject())
                                        .then(res => res.text())
                                        .then(eID => {
                                            postAvailability(episodeAvailability, "episodes/" + eID + "/availability", requests);
                                        })
                                    )
                                })
                                return Promise.all(episodeRequests);
                            })
                        );
                    })
                }

                return Promise.all(requests);
            })
            .then(() => {
                this.props.setVisible(false);
                this.props.loadTitles();
                this.props.toastMessage(<SVG.Check w="1.7em" h="1.7em" />, "text-success", "Series created.");
            })
            .catch(err => {
                this.props.setVisible(false);
                this.props.toastMessage(<SVG.Exclamation w="1.7em" h="1.7em" />, "text-danger", "An error occured while creating series.");
                console.log(err);
            })
            .finally(() => {
                this.setState({loading: false});
            });
    }

    emptySeries(){
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
            seasons: [],
        };
    }

    updateEdits(newEdits){
        this.edits = newEdits;
        this.updateChangesMade();
    }

    updateChangesMade(){
        if (!this.state.changesMade && this.edits.title !== undefined && this.edits.title.length > 0)
            this.setState({changesMade: true});
        else if (this.state.changesMade && (this.edits.title !== undefined && this.edits.title.length === 0))
            this.setState({changesMade: false});
    }

    render(){
        let createBtn = <button type="submit" class="btn btn-primary">Create Series</button>

        if (!this.state.changesMade)
            createBtn = <button type="submit" class="btn btn-primary" disabled>Create Series</button>
        
        if (this.state.loading)
            createBtn = <button type="submit" class="btn btn-primary" >
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            </button>

        return <>
            <form onSubmit={this.createSeries}>
                <Modal show={this.props.show} id="series-create-modal" setVisible={this.props.setVisible} >
                <div class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
                     <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title">Create Series</h2>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <Series htmlId="series-create" token={this.props.token} title={this.emptySeries()} show={this.props.show} updateContent={this.updateEdits} />
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

export default NewSeries;