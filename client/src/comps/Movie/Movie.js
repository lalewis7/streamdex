import React from 'react';
import * as bootstrap from 'bootstrap';

// css
import "./Movie.css";

// components
import WatchNow from '../WatchNow/WatchNow.js';
import TitleStreamPopup from '../TitleStreamPopup/TitleStreamPopup.js';
import CountryFilterPopup from '../CountryFilterPopup/CountryFilterPopup.js';

const Utils = require('../../util/utils.js');
const Platforms = require('../../util/platforms.json');

class Movie extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            stream: {
                countries: []
            }
        }
        this.open = false;

        this.openStream = this.openStream.bind(this);
    }

    componentDidMount(){
        this.streamModal = new bootstrap.Modal(document.getElementById("title-stream-popup"), {keyboard: false});
    }

    componentDidUpdate(){
        this.streamModal.show();
    }

    openStream(stream_id){
        let content = {platform: stream_id};
        for (let link of this.props.movie.links)
            if (link.platform == stream_id)
                content.link = link.link;
        for (let platform of Platforms)
            if (platform.id == stream_id){
                content.title = platform.title;
                content.icon = platform.icon;
            }
        for (let available of this.props.movie.availability)
            if (available.platform == stream_id)
                content.countries = available.countries;
        this.setState({stream: content});
        this.open = true;
    }

    render(){
        console.log(this.props.movie);
        let genres = this.props.movie.genres;
        return <>
            <TitleStreamPopup stream={this.state.stream}/>
            <CountryFilterPopup />
            <div class="container-fluid p-0">
                <div class="row p-2">
                    <civ class="d-none d-lg-block col-lg-4">
                        <div class="row">
                            <div class="col">
                                <img src={this.props.movie.thumbnail} alt="..." class="w-100 rounded-3"/>
                            </div>
                        </div>
                    </civ>
                    <div class="col-12 col-lg-8">
                        <div class="row mb-3">
                            <div class="col d-flex flex-row justify-content-between align-items-center">
                                <h2 class="text-head">{this.props.movie.title}</h2>
                                <button class="btn text-light">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16">
                                    <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="row my-3">
                            <div class="col">
                                <div class="ratio ratio-16x9">
                                    <iframe src={"https://www.youtube.com/embed/"+this.props.movie.trailer} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>
                        <WatchNow availability={this.props.movie.availability} links={this.props.movie.links} openStream={this.openStream}/>
                        <div class="row my-3">
                            <div class="col">
                                <h5 class="text-head2 fw-bold">DESCRIPTION</h5>
                                <div>
                                    <p class="text-main">{this.props.movie.description}</p>
                                </div>
                            </div>
                        </div>
                        <div class="row my-3">
                            <div class="col">
                                <h5 class="text-head2 fw-bold">DETAILS</h5>
                                <div>
                                    <p class="text-main"><span class="fw-bold me-3">Genres</span>{genres.map(genre => {
                                            let val = genre.charAt(0).toUpperCase() + genre.slice(1) + ", ";
                                            if (genres.indexOf(genre) == genres.length-1)
                                                val = val.slice(0, val.length-2);
                                            return val;
                                        })}</p>
                                    <p class="text-main"><span class="fw-bold me-3">Maturity</span>{this.props.movie.maturity}</p>
                                    <p class="text-main"><span class="fw-bold me-3">Runtime</span>{Utils.runtime(this.props.movie.runtime)}</p>
                                    <p class="text-main"><span class="fw-bold me-3">Runtime</span>{Utils.runtime(this.props.movie.runtime)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

}

export default Movie;