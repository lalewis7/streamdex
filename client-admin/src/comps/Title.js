import React from 'react';
import isEqual from 'lodash/isEqual';

import Movie from './Movie.js';
import Series from './Series.js';
import Modal from '../Modal.js';
import Loading from '../Loading.js';

const SVG = require('../svg.js');

class Title extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "loading",
            loading: false,
            title: null,
            changesMade: false,
            deleting: false
        }
        this.edits = {};
        this.saveChanges = this.saveChanges.bind(this);
        this.updateEdits = this.updateEdits.bind(this);
        this.updateChangesMade = this.updateChangesMade.bind(this);
        this.loadTitle = this.loadTitle.bind(this);
        this.delete = this.delete.bind(this);
        this.saveAvailabilityChanges = this.saveAvailabilityChanges.bind(this);
    }

    componentDidMount(){
        if (this.props.title)
            this.loadTitle();
    }

    componentDidUpdate(prevProps){
        this.updateChangesMade();
        if (prevProps.title !== this.props.title){
            this.loadTitle();
        }
    }

    saveAvailabilityChanges(oldAvails, newAvails, url, requests){
        newAvails.map(newAvail => {
            let newCountries = [];
            let removedCountries = [];

            // new (add all countries)
            if (oldAvails.map(avail => avail.platform).indexOf(newAvail.platform) === -1)
                newCountries.push(...newAvail.countries);

            // edits
            else
                oldAvails.map(oldAvail => {
                    if (newAvail.platform === oldAvail.platform) {
                        newCountries.push(...newAvail.countries.reduce((countries, newCountry) => {
                            if (oldAvail.countries.indexOf(newCountry) === -1) countries.push(newCountry);
                            return countries;
                        }, []));
                        removedCountries.push(...oldAvail.countries.reduce((countries, oldCountry) => {
                            if (newAvail.countries.indexOf(oldCountry) === -1) countries.push(oldCountry);
                            return countries;
                        }, []));
                    }
                });
            // add requests
            newCountries.map(country => {
                requests.push(
                    () => fetch(url+newAvail.platform,
                    {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'token': this.props.token},
                        body: JSON.stringify({country: country, available: true})
                    })
                    .then(res => res.ok ? res : Promise.reject())
                );
            });
            removedCountries.map(country => {
                requests.push(
                    () => fetch(url+newAvail.platform,
                    {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'token': this.props.token},
                        body: JSON.stringify({country: country, available: false})
                    })
                    .then(res => res.ok ? res : Promise.reject())
                );
            });
        });
        // delete
        oldAvails.map(oldAvail => {
            if (newAvails.map(avail => avail.platform).indexOf(oldAvail.platform) === -1)
                oldAvail.countries.map(country => {
                    requests.push(
                        () => fetch(url+oldAvail.platform,
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json', 'token': this.props.token},
                            body: JSON.stringify({country: country, available: false})
                        })
                        .then(res => res.ok ? res : Promise.reject())
                    );
                });
        });
    }

    async saveChanges(evt){
        this.setState({loading: true});
        evt.preventDefault();

        let requests = [];
        let edits = {...this.edits};
        let original = {...this.state.title};

        let newLinks = edits.links;
        let oldLinks = original.links;

        if (newLinks){

            delete edits.links;
            delete original.links;

            newLinks.map(newLink => {
                // new
                if (oldLinks.map(link => link.platform).indexOf(newLink.platform) === -1)
                    requests.push(
                        () => fetch(process.env.REACT_APP_API+"titles/"+this.props.title+"/links/"+newLink.platform,
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json', 'token': this.props.token},
                            body: JSON.stringify({link: newLink.link})
                        })
                        .then(res => res.ok ? res : Promise.reject())
                    );
                // edit
                else
                    oldLinks.map(oldLink => {
                        if (newLink.platform === oldLink.platform && !isEqual(newLink, oldLink))
                            requests.push(
                                () => fetch(process.env.REACT_APP_API+"titles/"+this.props.title+"/links/"+oldLink.platform,
                                {
                                    method: 'PUT',
                                    headers: {'Content-Type': 'application/json', 'token': this.props.token},
                                    body: JSON.stringify({link: newLink.link})
                                })
                                .then(res => res.ok ? res : Promise.reject())
                            );
                    });

            });
            // delete
            oldLinks.map(oldLink => {
                if (newLinks.map(link => link.platform).indexOf(oldLink.platform) === -1) 
                    requests.push(
                        () => fetch(process.env.REACT_APP_API+"titles/"+this.props.title+"/links/"+oldLink.platform,
                        {
                            method: 'DELETE',
                            headers: {'token': this.props.token}
                        })
                        .then(res => res.ok ? res : Promise.reject())
                    );
            })
        }

        let newAvails = edits.availability;
        let oldAvails = original.availability;

        if (newAvails){

            delete edits.availability;
            delete original.availability;

            this.saveAvailabilityChanges(oldAvails, newAvails, process.env.REACT_APP_API+"titles/"+this.props.title+"/availability/", requests);

        }

        if (edits.seasons){

            let newSeasons = [...edits.seasons];
            let oldSeasons = [...original.seasons];

            delete edits.seasons;
            delete original.seasons;

            newSeasons.map(newSeason => {
                let season = {...newSeason};
                let seasonID = season.id;
                let episodes = [...season.episodes];
                let availability = [...season.availability];
                delete season.availability;
                delete season.id;
                delete season.episodes;
                // new season
                if (seasonID === '' || seasonID === null || seasonID === undefined){
                    requests.push(
                        () => fetch(process.env.REACT_APP_API+"titles/"+this.props.title+"/seasons",
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json', 'token': this.props.token},
                            body: JSON.stringify(season)
                        })
                        .then(res => res.ok ? res : Promise.reject())
                        .then(res => res.text())
                        .then(id => {
                            this.saveAvailabilityChanges([], availability, process.env.REACT_APP_API+'seasons/'+id+'/availability/', requests);
                            let episodePromises = [];
                            episodes.map(e => {
                                let episode = {...e};
                                let episodeAvailability = [...episode.availability];
                                delete episode.id;
                                delete episode.availability;
                                episodePromises.push(
                                    fetch(process.env.REACT_APP_API+"seasons/"+id+"/episodes",
                                    {
                                        method: 'POST',
                                        headers: {'Content-Type': 'application/json', 'token': this.props.token},
                                        body: JSON.stringify(episode)
                                    })
                                    .then(res => res.ok ? res : Promise.reject())
                                    .then(res => res.text())
                                    .then(episodeID => {
                                        this.saveAvailabilityChanges([], episodeAvailability, process.env.REACT_APP_API+'episodes/'+episodeID+'/availability/', requests);
                                    })
                                )
                            })
                            return Promise.all(episodePromises);
                        })
                    );
                }
                // edit season
                else {
                    oldSeasons.map(os => {
                        let oldSeason = {...os};
                        let oldSeasonID = oldSeason.id;
                        let oldEpisodes = [...oldSeason.episodes];
                        let oldSeasonAvailability = [...oldSeason.availability];
                        delete oldSeason.id;
                        delete oldSeason.episodes;
                        delete oldSeason.availability;
                        if (seasonID === oldSeasonID){
                            this.saveAvailabilityChanges(oldSeasonAvailability, availability, process.env.REACT_APP_API+'seasons/'+seasonID+'/availability/', requests);
                            // season
                            if (!isEqual(season, oldSeason)){
                                requests.push(
                                    () => fetch(process.env.REACT_APP_API+'seasons/'+seasonID,
                                    {
                                        method: 'PUT',
                                        headers: {'Content-Type': 'application/json', 'token': this.props.token},
                                        body: JSON.stringify(season)
                                    })
                                    .then(res => res.ok ? res : Promise.reject())
                                );
                            }
                            // episodes
                            episodes.map(e => {
                                let episode = {...e};
                                let episodeID = episode.id;
                                let episodeAvailability = [...episode.availability];
                                delete episode.id;
                                delete episode.availability;
                                // new episode
                                if (episodeID === '' || episodeID === null || episodeID === undefined){
                                    requests.push(
                                        () => fetch(process.env.REACT_APP_API+'seasons/'+seasonID+'/episodes',
                                        {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json', 'token': this.props.token},
                                            body: JSON.stringify(episode)
                                        })
                                        .then(res => res.ok ? res : Promise.reject())
                                        .then(eID => {
                                            this.saveAvailabilityChanges([], episodeAvailability, process.env.REACT_APP_API+'episodes/'+eID+'/availability/', requests);
                                        })
                                    );
                                }
                                // edit episode
                                else {
                                    oldEpisodes.map(oe => {
                                        let oldEpisode = {...oe};
                                        let oldEpisodeID = oldEpisode.id;
                                        let oldEpisodeAvailability = [...oldEpisode.availability];
                                        delete oldEpisode.id;
                                        delete oldEpisode.availability;
                                        if (episodeID === oldEpisodeID){
                                            this.saveAvailabilityChanges(oldEpisodeAvailability, episodeAvailability, process.env.REACT_APP_API+'episodes/'+episodeID+'/availability/', requests);
                                            if (!isEqual(episode, oldEpisode)){
                                                requests.push(
                                                    () => fetch(process.env.REACT_APP_API+'episodes/'+episodeID,
                                                    {
                                                        method: 'PUT',
                                                        headers: {'Content-Type': 'application/json', 'token': this.props.token},
                                                        body: JSON.stringify(episode)
                                                    })
                                                    .then(res => res.ok ? res : Promise.reject())
                                                );
                                            }
                                        }
                                    });
                                }
                            });
                            // delete episodes not included
                            oldEpisodes.map(oe => {
                                let oldEpisode = {...oe};
                                if (episodes.map(ne => ne.id).indexOf(oldEpisode.id) === -1){
                                    requests.push(
                                        () => fetch(process.env.REACT_APP_API+'episodes/'+oldEpisode.id,
                                        {
                                            method: 'DELETE',
                                            headers: {'token': this.props.token}
                                        })
                                        .then(res => res.ok ? res : Promise.reject())
                                    );
                                }
                            })
                        }
                    });
                }
            });
            oldSeasons.map(os => {
                let oldSeason = {...os};
                if (newSeasons.map(s => s.id).indexOf(oldSeason.id) === -1){
                    requests.push(
                        () => fetch(process.env.REACT_APP_API+'seasons/'+oldSeason.id,
                        {
                            method: 'DELETE',
                            headers: {'token': this.props.token}
                        })
                        .then(res => res.ok ? res : Promise.reject())
                    );
                }
            });
        }
        
        delete edits.id;
        delete edits.streamdex_rating;
        delete original.id;

        if (!isEqual(edits, original))
            requests.push(
                () => fetch(process.env.REACT_APP_API+"titles/"+this.props.title,
                {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json', 'token': this.props.token},
                    body: JSON.stringify(edits)
                })
                .then(res => res.ok ? res : Promise.reject())
            );

        //let titleEdits = {...this.edits};

        let lm = null
        requests.map(req => {
            if (lm == null)
                lm = req();
            else
                lm.then(() => req());
        })

        lm.then(() => {
                this.props.setVisible(false);
                this.props.toastMessage(<SVG.Check w="1.7em" h="1.7em" />, "text-success", "Changes saved.");
                // this.setState({
                //     title: {...titleEdits}
                // });
                this.loadTitle();
            })
            .catch(err => {
                this.props.setVisible(false);
                this.props.toastMessage(<SVG.Exclamation w="1.7em" h="1.7em" />, "text-danger", "An error occured while saving changes.");
                console.log(err);
            })
            .finally(() => {
                this.setState({loading: false});
            });
    }

    loadTitle(){
        if (this.props.title){
            this.setState({status: "loading"});
            fetch(process.env.REACT_APP_API+"titles/"+this.props.title,
            {
                method: 'GET',
                headers: {'token': this.props.token}
            })
            .then(res => res.json())
            .then(title => {
                this.setState({status: 'loaded', title: title});
            })
            .catch(err => {
                this.setState({status: "error"});
                console.log(err);
            });
        }
    }

    delete(){
        if (window.confirm("Are you sure you want to delete this title?")){
            this.setState({deleting: true});
            fetch(process.env.REACT_APP_API+"titles/"+this.props.title,
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

    updateEdits(newEdits){
        console.log(newEdits)
        this.edits = newEdits;
        this.updateChangesMade();
    }

    updateChangesMade(){
        if (!isEqual(this.state.title, this.edits) !== this.state.changesMade)
            this.setState({changesMade: !this.state.changesMade});
    }

    render(){

        let saveChangesBtn = <button type="submit" class="btn btn-primary">Save Changes</button>

        if (!this.state.changesMade)
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
            content = <Series htmlId="title-view" id={this.props.title} token={this.props.token} title={this.state.title} show={this.props.show} updateContent={this.updateEdits} />;
        else if (this.state.title && !this.state.title.seasons)
            content = <Movie htmlId="title-view" id={this.props.title} token={this.props.token} title={this.state.title} show={this.props.show} updateContent={this.updateEdits} />

        return <>
            <form onSubmit={this.saveChanges}>
                <Modal show={this.props.show} id="title-edit-modal" setVisible={this.props.setVisible} >
                <div class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
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