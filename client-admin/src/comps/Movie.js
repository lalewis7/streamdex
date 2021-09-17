import React from 'react';
import isEqual from 'lodash/isEqual';

import TitleDetails from './TitleDetails.js';
import TitleCoverImage from './TitleCoverImage.js';
import TitleLinks from './TitleLinks.js';
import TitleGenres from './TitleGenres.js';
import HorizontalScrollable from '../HorizontalScrollable.js';
import LinkAvailability from './LinkAvailability.js';

const SVG = require('../svg.js');
const Config = require('../config.json');

class Movie extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            titleDetails: {},
            titleCoverImage: {},
            titleLinks: {},
            titleGenres: {},
            titleAvailability: {},

            rel_date: '',
            runtime: '',
            trailer: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.resetForms = this.resetForms.bind(this);
        this.getMovieContents = this.getMovieContents.bind(this);
    }

    componentDidMount(){
        if (this.props.title)
            this.resetForms();
    }

    componentDidUpdate(prevProps, prevState){
        if (!isEqual(this.props.title, prevProps.title) || (this.props.title && this.props.show !== prevProps.show))
            this.resetForms();
        const newTitleContents = {...this.state.titleDetails, ...this.state.titleCoverImage, ...this.state.titleGenres, ...this.state.titleLinks, ...this.state.titleAvailability, ...this.getMovieContents(this.state)};
        const oldTitleContents = {...prevState.titleDetails, ...prevState.titleCoverImage, ...prevState.titleGenres, ...prevState.titleLinks, ...prevState.titleAvailability, ...this.getMovieContents(prevState)};
        if (!isEqual(newTitleContents, oldTitleContents))
            this.props.updateContent(newTitleContents);
    }

    getMovieContents(state){
        return {rel_date: state.rel_date, runtime: !isNaN(parseInt(state.runtime)) ? parseInt(state.runtime) : null, trailer: state.trailer};
    }

    resetForms(){
        this.setState({
            rel_date: this.props.title.rel_date,
            runtime: this.props.title.runtime,
            trailer: this.props.title.trailer
        });
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    render(){
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
                                <button class="nav-link text-nowrap" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-movie"} type="button">Movie</button>
                            </li>
                            <li class="nav-item" role="button">
                                <button class="nav-link text-nowrap" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-availability"} type="button">Link Availability</button>
                            </li>
                            <div class="flex-grow-1"></div>
                        </ul>
                    </HorizontalScrollable>
                </div>
            </div>
            <div class="tab-content">
                <div class="tab-pane fade show active" id={this.props.htmlId+"-title"} role="tabpanel">
                    <TitleDetails content={this.props.title} show={this.props.show} updateContent={content => this.setState({titleDetails: content})} />
                </div>
                <div class="tab-pane fade" id={this.props.htmlId+"-cover-image"} role="tabpanel">
                    <TitleCoverImage content={this.props.title} show={this.props.show} updateContent={content => this.setState({titleCoverImage: content})} token={this.props.token} />
                </div>
                <div class="tab-pane fade" id={this.props.htmlId+"-links"} role="tabpanel">
                    <TitleLinks content={this.props.title} show={this.props.show} updateContent={content => this.setState({titleLinks: content})} />
                </div>
                <div class="tab-pane fade" id={this.props.htmlId+"-genres"} role="tabpanel">
                    <TitleGenres content={this.props.title} show={this.props.show} updateContent={content => this.setState({titleGenres: content})} />
                </div>
                <div class="tab-pane fade" id={this.props.htmlId+"-movie"} role="tabpanel">
                    <div class="row my-3">
                        <div class="col-12">
                            <div class="form-floating">
                                <input type="date" class="form-control" placeholder="Release Date" name="rel_date" value={this.state.rel_date} onChange={this.handleChange} />
                                <label>Release Date</label>
                            </div>
                        </div>
                    </div>
                    <div class="row my-3">
                        <div class="col-12">
                            <div class="form-floating">
                                <input type="number" class="form-control" placeholder="Runtime  (Minutes)" name="runtime" value={this.state.runtime} onChange={this.handleChange} />
                                <label>Runtime (Minutes)</label>
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
                <div class="tab-pane fade" id={this.props.htmlId+"-availability"} role="tabpanel">
                    <LinkAvailability content={this.props.title} show={this.props.show} updateContent={content => this.setState({titleAvailability: content})} links={this.state.titleLinks.links} />
                </div>
            </div>
        </>;
    }

}

export default Movie;