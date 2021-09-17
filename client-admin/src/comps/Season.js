import React from 'react';
import isEqual from 'lodash/isEqual';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import HorizontalScrollable from '../HorizontalScrollable.js';
import LinkAvailability from './LinkAvailability.js';

const SVG = require('../svg.js');

class Season extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            season_number: '',
            trailer: '',
            availability: [], 
            episodes: []
        }
        this.updateContent = this.updateContent.bind(this);
        this.resetForms = this.resetForms.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.sortEpisodes = this.sortEpisodes.bind(this);
        this.reorderEpisodes = this.reorderEpisodes.bind(this);
    }

    componentDidMount(){
        if (this.props.content)
            this.resetForms();
    }

    componentDidUpdate(prevProps, prevState){
        if (!isEqual(this.state, prevState))
            this.updateContent();
        if (!isEqual(this.props.content, prevProps.content) || (this.props.content && this.props.show != prevProps.show))
            this.resetForms();
    }

    updateContent(){
        this.props.updateContent({
            id: this.props.content ? this.props.content.id : '',
            season_number: this.state.season_number,
            trailer: this.state.trailer,
            availability: this.state.availability,
            episodes: this.state.episodes
        });
    }

    resetForms(){
        this.setState({
            id: this.props.content.id,
            season_number: this.props.content.season_number,
            trailer: this.props.content.trailer,
            availability: this.props.content.availability,
            episodes: this.props.content.episodes
        }, () => this.updateContent());
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    sortEpisodes(){
        let newEpisodes = [...this.state.episodes];
        newEpisodes.sort((a, b) => a.episode_number - b.episode_number);
        this.setState({episodes: newEpisodes});
    }

    reorderEpisodes(result){
        if (!result.destination)
            return;
        let src = result.source.index+1;
        let dest = result.destination.index+1;
        let newEpisodes = [...this.state.episodes];
        // 1
        // |
        // |
        // 2
        // 1 -> 2 src < dest ==> -
        // 2 -> 1 src > dest ==> +
        for (let episode of newEpisodes){
            let num = episode.episode_number;
            if (num <= dest && num > src)
                episode.episode_number -= 1;
            else if (num >= dest && num < src)
                episode.episode_number += 1;
            else if (num === src)
                episode.episode_number = dest;
        }
        this.setState({episodes: newEpisodes}, () => this.sortEpisodes());
    }

    render(){

        const episodeRow = (episode, draggableId, index) => <>
            <Draggable key={draggableId} draggableId={draggableId} index={index}>
                {provided => <>
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} class="list-group-item d-flex align-items-center justify-content-start pe-0">
                        <div class="pe-3">
                            <SVG.HorizontalDrag w="2em" h="2em" />
                        </div>
                        <button type="button" class="btn list-group-item-action" onClick={() => this.props.openEpisode(index)}>
                            <div class="d-flex flex-column">
                                <span class="fw-bold">{episode.episode_number}. {episode.name} </span>
                                <span class="fs-7">{episode.id ? episode.id : '<Episode does not yet exist, save changes to create ID>'}</span>
                            </div>
                        </button>
                    </div>
                </>}
            </Draggable>
        </>

        return <>
            <div class="d-flex align-items-center justify-content-between pt-2">
                <div class="d-flex align-items-center">
                    <button type="button" class="btn btn-dark" onClick={() => this.props.back()}>
                        <SVG.LeftArrowShort w="2em" h="2em" />
                    </button>
                    <h3 class="m-0">Edit Season</h3>
                </div>
                <button type="button" class="btn btn-danger me-3" onClick={() => this.props.deleteSeason()}><SVG.Trash w="1.1em" h="1.1em"/></button>
            </div>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <HorizontalScrollable>
                            <ul class="nav nav-tabs" role="tablist" >
                                <li class="nav-item" role="button">
                                    <button class="nav-link text-nowrap active" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-season-season"} type="button">Season</button>
                                </li>
                                <li class="nav-item" role="button">
                                    <button class="nav-link text-nowrap" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-season-availability"} type="button">Link Availability</button>
                                </li>
                                <li class="nav-item" role="button">
                                    <button class="nav-link text-nowrap" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-season-episodes"} type="button">Episodes</button>
                                </li>
                                <div class="flex-grow-1"></div>
                            </ul>
                        </HorizontalScrollable>
                    </div>
                </div>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id={this.props.htmlId+"-season-season"} role="tabpanel">
                        <div class="row my-3">
                            <div class="col-12">
                                <div class="input-group">
                                    <span class="input-group-text shadow-none" >
                                        <SVG.Id w={'1.15em'} h={'1.15em'}/>
                                    </span>
                                    <input type="text" readOnly class="form-control" placeholder="No ID. Title does not exist" value={this.state.id} onFocus={(evt) => evt.target.select()} />
                                </div>
                            </div>
                        </div>
                        <div class="row my-3">
                            <div class="col-12">
                                <div class="form-floating">
                                    <input type="text" class="form-control" placeholder="Trailer" name="trailer" value={this.state.trailer} onChange={this.handleChange} />
                                    <label>Trailer</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id={this.props.htmlId+"-season-availability"} role="tabpanel">
                        <LinkAvailability content={{availability: this.state.availability}} show={this.props.show} updateContent={content => this.setState({availability: content.availability})} links={this.props.links} />
                    </div>
                    <div class="tab-pane fade" id={this.props.htmlId+"-season-episodes"} role="tabpanel">
                        <DragDropContext onDragEnd={this.reorderEpisodes}>
                            <Droppable droppableId="episodesDnd">
                                {provided => <>
                                    <div class="list-group list-group-flush mt-3" {...provided.droppableProps} ref={provided.innerRef}>
                                        {this.state.episodes.map((episode, i) => episodeRow(episode, 'episode-'+episode.episode_number, i))}
                                    </div>
                                    {provided.placeholder}
                                </>}
                            </Droppable>
                        </DragDropContext>
                        <div class="d-grid">
                            <button type="button" class="btn btn-secondary" onClick={() => this.props.newEpisode()}>
                                <SVG.Plus w=".9em" h=".9em" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

}

export default Season;