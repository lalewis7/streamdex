import React from 'react';
import isEqual from 'lodash/isEqual';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {Carousel as BootstrapCarousel} from 'bootstrap';

import TitleDetails from './TitleDetails.js';
import TitleCoverImage from './TitleCoverImage.js';
import TitleLinks from './TitleLinks.js';
import TitleGenres from './TitleGenres.js';
import HorizontalScrollable from '../HorizontalScrollable.js';
import Season from './Season.js';
import Episode from './Episode.js';

const SVG = require('../svg.js');
const Config = require('../config.json');

class Series extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            seasons: [],
            currentSeasonIndex: -1,
            currentEpisodeIndex: -1
        }

        this.contents = {
            titleDetails: {},
            titleCoverImage: {},
            titleLinks: {},
            titleGenres: {},
            titleAvailability: {},
            seasonEdits: {},
            episodeEdits: {}
        }

        this.resetForms = this.resetForms.bind(this);
        this.getSeriesContent = this.getSeriesContent.bind(this);

        this.updateEpisode = this.updateEpisode.bind(this);
        this.updateSeason = this.updateSeason.bind(this);
        this.deleteEpisode = this.deleteEpisode.bind(this);
        this.deleteSeason = this.deleteSeason.bind(this);
        this.back = this.back.bind(this);
        this.openEpisode = this.openEpisode.bind(this);
        this.openSeason = this.openSeason.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.silentUpdateContent = this.silentUpdateContent.bind(this);

        this.newSeason = this.newSeason.bind(this);
        this.newEpisode = this.newEpisode.bind(this);
        // this.openSeason = this.openSeason.bind(this);
        // this.updateSeasons = this.updateSeasons.bind(this);
        // this.closeSeason = this.closeSeason.bind(this);
        this.sortSeasons = this.sortSeasons.bind(this);
        this.reorderSeasons = this.reorderSeasons.bind(this);
        // this.handleSeasonChange = this.handleSeasonChange.bind(this);
        // this.editCurrentSeason = this.editCurrentSeason.bind(this);

        // this.openEpisode = this.openEpisode.bind(this);
        // this.updateEpisodes = this.updateEpisodes.bind(this);
        // this.closeEpisode = this.closeEpisode.bind(this);
        // this.handleEpisodeChange = this.handleEpisodeChange.bind(this);
        // this.editCurrentEpisode = this.editCurrentEpisode.bind(this);
    }

    componentDidMount(){
        this.carousel = new BootstrapCarousel(document.getElementById(this.props.htmlId+"-carousel"), {interval: false, keyboard: false, touch: false});
        if (this.props.title)
            this.resetForms();
    }

    componentDidUpdate(prevProps){
        if (!isEqual(this.props.title, prevProps.title) || (this.props.show !== prevProps.show))
            this.resetForms();
        this.props.updateContent({...this.contents.titleDetails, ...this.contents.titleCoverImage, ...this.contents.titleGenres, ...this.contents.titleLinks, 
            ...this.contents.titleAvailability, ...this.getSeriesContent()});
    }

    updateContent(obj) {
        for (let name in obj)
            this.contents[name] = obj[name];
        this.props.updateContent({...this.contents.titleDetails, ...this.contents.titleCoverImage, ...this.contents.titleGenres, ...this.contents.titleLinks, 
            ...this.contents.titleAvailability, ...this.getSeriesContent()});
    }

    silentUpdateContent(obj){
        for (let name in obj)
            this.contents[name] = obj[name];
    }

    getSeriesContent(){
        let seasons = [...this.state.seasons];
        if (this.state.currentSeasonIndex !== -1){
            seasons[this.state.currentSeasonIndex] = {...this.contents.seasonEdits};
            if (this.state.currentEpisodeIndex !== -1){
                let episodes = [...seasons[this.state.currentSeasonIndex].episodes];
                episodes[this.state.currentEpisodeIndex] = {...this.contents.episodeEdits};
                seasons[this.state.currentSeasonIndex].episodes = episodes;
            }
        }
        return {seasons: seasons};
    }

    resetForms(){
        this.carousel.to(0);
        this.setState({
            seasons: [...this.props.title.seasons],
            currentSeasonIndex: -1,
            currentEpisodeIndex: -1
        });
    }

    updateEpisode(episode){
        if (this.state.currentEpisodeIndex !== -1){
            this.updateContent({episodeEdits: episode});
        }
    }

    updateSeason(season){
        if (this.state.currentSeasonIndex !== -1){
            this.updateContent({seasonEdits: season});
        }
    }

    deleteEpisode(){
        if (this.state.currentEpisodeIndex !== -1){
            let newSeasonEdits = {...this.contents.seasonEdits};
            let newEpisodes = [...newSeasonEdits.episodes];
            
            newEpisodes.splice(this.state.currentEpisodeIndex, 1);
            newEpisodes.map(episode => {
                if (episode.episode_number > this.state.currentEpisodeIndex)
                    episode.episode_number--;
            });
            newSeasonEdits.episodes = newEpisodes;

            let newSeasons = [...this.state.seasons];
            newSeasons[this.state.currentSeasonIndex] = newSeasonEdits;
            
            this.silentUpdateContent({seasonEdits: newSeasonEdits});
            this.setState({seasons: newSeasons, currentEpisodeIndex: -1});
            this.carousel.prev();
        }
    }
    
    deleteSeason(){
        if (this.state.currentSeasonIndex !== -1){
            let newSeasons = [...this.state.seasons];

            newSeasons.splice(this.state.currentSeasonIndex, 1);
            newSeasons.map(season => {
                if (season.season_number > this.state.currentSeasonIndex)
                    season.season_number--;
            });

            this.setState({seasons: newSeasons, currentSeasonIndex: -1});
            this.carousel.prev();
        }
    }

    back(){
        this.carousel.prev();
        if (this.state.currentEpisodeIndex !== -1){
            let newSeasonEdits = {...this.contents.seasonEdits};
            let newEpisodes = [...newSeasonEdits.episodes];
            newEpisodes[this.state.currentEpisodeIndex] = {...this.contents.episodeEdits};
            newSeasonEdits.episodes = newEpisodes;

            let newSeasons = [...this.state.seasons];
            newSeasons[this.state.currentSeasonIndex] = newSeasonEdits;

            this.silentUpdateContent({seasonEdits: newSeasonEdits});
            this.setState({seasons: newSeasons, currentEpisodeIndex: -1});
        }
        else if (this.state.currentSeasonIndex !== -1){
            let newSeasons = [...this.state.seasons];
            newSeasons[this.state.currentSeasonIndex] = this.contents.seasonEdits;
            this.setState({seasons: newSeasons, currentSeasonIndex: -1});
        }
    }

    openEpisode(index){
        this.setState({currentEpisodeIndex: index}, () => this.carousel.next());
    }

    openSeason(index){
        this.setState({currentSeasonIndex: index}, () => this.carousel.next());
    }

    newEpisode(){
        let newSeasonEdits = {...this.contents.seasonEdits};
        newSeasonEdits.episodes = [...this.contents.seasonEdits.episodes, {
            availability: [], 
            episode_number: this.contents.seasonEdits.episodes.length+1,
            name: '',
            description: '',
            runtime: null,
            rel_date: null
        }];
        let newSeasons = [...this.state.seasons];
        newSeasons[this.state.currentSeasonIndex] = newSeasonEdits;
        this.setState({seasons: newSeasons});
    }

    // old

    newSeason(){
        this.setState({seasons: [...this.state.seasons, {
            availability: [], 
            episodes: [], 
            season_number: this.state.seasons.length+1,
            trailer: ''
        }]});
    }

    // openSeason(season){
    //     this.setState({currentSeason: {...this.state.seasons[season]}, currentSeasonIndex: season});
    //     this.carousel.next();
    // }

    // updateSeasons(){
    //     if (this.state.currentSeasonIndex !== -1){
    //         let newSeasons = [...this.state.seasons];
    //         newSeasons[this.state.currentSeasonIndex] = this.state.currentSeason;
    //         this.setState({seasons: newSeasons});
    //     }
    // }

    // closeSeason(){
    //     if (this.state.currentSeasonIndex !== -1){
    //         let newSeasons = [...this.state.seasons];
    //         newSeasons[this.state.currentSeasonIndex] = this.state.currentSeason;
    //         this.setState({seasons: newSeasons, currentSeasonIndex: -1});
    //     }
    //     this.carousel.prev();
    // }

    sortSeasons(){
        let newSeasons = [...this.state.seasons];
        newSeasons.sort((a, b) => a.season_number - b.season_number);
        this.setState({seasons: newSeasons});
    }

    reorderSeasons(result){
        if (!result.destination)
            return;
        let src = result.source.index+1;
        let dest = result.destination.index+1;
        let newSeasons = [...this.state.seasons];
        for (let season of newSeasons){
            let num = season.season_number;
            if (num <= dest && num > src)
                season.season_number -= 1;
            else if (num >= dest && num < src)
                season.season_number += 1;
            else if (num === src)
                season.season_number = dest;
        }
        this.setState({seasons: newSeasons}, () => this.sortSeasons());
    }

    // handleSeasonChange (evt){
    //     this.setState({currentSeason: { ...this.state.currentSeason, [evt.target.name]: evt.target.value }}, () => this.updateSeasons());
    // }

    // editCurrentSeason(name, value, cb){
    //     if (cb)
    //         this.setState({currentSeason: { ...this.state.currentSeason, [name]: value }}, cb);
    //     else
    //         this.setState({currentSeason: { ...this.state.currentSeason, [name]: value }}, () => this.updateSeasons());
    // }

    // updateEpisodes(){
    //     if (this.state.currentEpisodeIndex !== -1){
    //         let newEpisodes = [...this.state.currentSeason.episodes];
    //         newEpisodes[this.state.currentEpisodeIndex] = this.state.currentEpisode;
    //         this.editCurrentSeason('episodes', newEpisodes);
    //     }
    // }

    // closeEpisode(){
    //     if (this.state.currentEpisodeIndex !== -1){
    //         let newEpisodes = [...this.state.currentSeason.episodes];
    //         newEpisodes[this.state.currentEpisodeIndex] = this.state.currentEpisode;
    //         this.editCurrentSeason('episodes', newEpisodes);
    //         this.setState({currentEpisodeIndex: -1});
    //     }
    //     this.carousel.prev();
    // }

    // handleEpisodeChange(evt){
    //     this.setState({currentEpisode: { ...this.state.currentEpisode, [evt.target.name]: evt.target.value }});
    // }

    // editCurrentEpisode(name, value){
    //     this.setState({currentEpisode: { ...this.state.currentEpisode, [name]: value }}, () => this.updateEpisodes());
    // }

    render() {

        const seasonRow = (season, draggableId, index) => <>
            <Draggable key={draggableId} draggableId={draggableId} index={index}>
                {provided => <>
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} class="list-group-item d-flex align-items-center justify-content-start">
                        <div class="pe-3">
                            <SVG.HorizontalDrag w="2em" h="2em" />
                        </div>
                        <button type="button" class="btn list-group-item-action" onClick={() => this.openSeason(index)}>
                            <div class="d-flex flex-column">
                                <span class="fw-bold">Season {season.season_number} ({season.episodes.length} episodes)</span>
                                <span class="fs-7">{season.id ? season.id : 'Season does not exist yet, save changes to create ID.'}</span>
                            </div>
                        </button>
                    </div>
                </>}
            </Draggable>
        </>

        return <>
            <div class="row">
                <div class="col-12">
                    <HorizontalScrollable>
                        <ul class="nav nav-tabs" role="tablist" >
                            <li class="nav-item" role="button">
                                <button class="nav-link text-nowrap active" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-title"} type="button">Title</button>
                            </li>
                            <li class="nav-item" role="button">
                                <button class="nav-link text-nowrap" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-cover-image"} type="button">Cover Image</button>
                            </li>
                            <li class="nav-item" role="button">
                                <button class="nav-link text-nowrap" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-links"} type="button">Links</button>
                            </li>
                            <li class="nav-item" role="button">
                                <button class="nav-link text-nowrap" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-genres"} type="button">Genres</button>
                            </li>
                            <li class="nav-item" role="button">
                                <button class="nav-link text-nowrap" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-seasons"} type="button">Seasons</button>
                            </li>
                            <div class="flex-grow-1"></div>
                        </ul>
                    </HorizontalScrollable>
                </div>
            </div>
            <div class="tab-content">
                <div class="tab-pane fade show active" id={this.props.htmlId+"-title"} role="tabpanel">
                    <TitleDetails content={this.props.title} show={this.props.show} updateContent={content => this.updateContent({'titleDetails': content})} />
                </div>
                <div class="tab-pane fade" id={this.props.htmlId+"-cover-image"} role="tabpanel">
                    <TitleCoverImage content={this.props.title} show={this.props.show} updateContent={content => this.updateContent({'titleCoverImage': content})} token={this.props.token} />
                </div>
                <div class="tab-pane fade" id={this.props.htmlId+"-links"} role="tabpanel">
                    <TitleLinks content={this.props.title} show={this.props.show} updateContent={content => this.updateContent({'titleLinks': content})} />
                </div>
                <div class="tab-pane fade" id={this.props.htmlId+"-genres"} role="tabpanel">
                    <TitleGenres content={this.props.title} show={this.props.show} updateContent={content => this.updateContent({'titleGenres': content})} />
                </div>
                <div class="tab-pane fade" id={this.props.htmlId+"-seasons"} role="tabpanel">
                    <div id={this.props.htmlId+"-carousel"} class="carousel slide">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <DragDropContext onDragEnd={this.reorderSeasons}>
                                    <Droppable droppableId="seasonsDnd">
                                        {provided => <>
                                            <div class="list-group list-group-flush mt-2" {...provided.droppableProps} ref={provided.innerRef}>
                                                {this.state.seasons.map((season, i) => seasonRow(season, 'season-'+season.season_number, i))}
                                            </div>
                                            {provided.placeholder}
                                        </>}
                                    </Droppable>
                                </DragDropContext>
                                <div class="d-grid">
                                    <button type="button" class="btn btn-secondary" onClick={() => this.newSeason()}>
                                        <SVG.Plus w=".9em" h=".9em" />
                                    </button>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <Season content={this.state.currentSeasonIndex !== -1 ? this.state.seasons[this.state.currentSeasonIndex] : {availability: [], episodes: []}} 
                                    show={this.props.show} updateContent={this.updateSeason} links={this.contents.titleLinks.links} back={this.back} openEpisode={this.openEpisode}
                                    htmlId={this.props.htmlId} deleteSeason={this.deleteSeason} newEpisode={this.newEpisode} />
                            </div>
                            <div class="carousel-item">
                                <Episode content={this.state.currentEpisodeIndex !== -1 ? this.contents.seasonEdits.episodes[this.state.currentEpisodeIndex] : 
                                    {availability: [], name: '', description: '', runtime: '', rel_date: ''}} show={this.props.show} updateContent={this.updateEpisode} links={this.contents.titleLinks.links} back={this.back} 
                                    htmlId={this.props.htmlId} deleteEpisode={this.deleteEpisode} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>;
    }

}

export default Series;