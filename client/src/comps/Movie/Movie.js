import React from 'react';

// css
import "./Movie.css";

// components
import WatchNow from '../WatchNow/WatchNow.js';
import TitleStreamPopup from '../TitleStreamPopup/TitleStreamPopup.js';
import CountryFilterPopup from '../CountryFilterPopup/CountryFilterPopup.js';

const Utils = require('../../util/utils.js');
const Platforms = require('../../util/platforms.json');
const SVG = require('../../util/svg.js');

class Movie extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            stream: {
                countries: []
            },
            showFilterModal: false,
            showStreamModal: false
        }
        this.open = false;

        this.openStream = this.openStream.bind(this);
        this.openFilter = this.openFilter.bind(this);
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
        this.setState({stream: content, showStreamModal: true});
        this.open = true;
    }

    openFilter(){
        this.setState({showFilterModal: true});
    }

    render(){
        console.log(this.props.movie);
        let genres = this.props.movie.genres;
        return <>
            <TitleStreamPopup stream={this.state.stream} show={this.state.showStreamModal} setVisible={(vis) => {this.setState({showStreamModal: vis})}} />
            <CountryFilterPopup show={this.state.showFilterModal} setVisible={(vis) => {this.setState({showFilterModal: vis})}} />
            <div class="container-fluid p-0">
                <div class="row p-2">
                    <civ class="d-none d-lg-block col-lg-4">
                        <div class="row">
                            <div class="col">
                                <img src={this.props.movie.thumbnail} alt="..." class="w-100 rounded-top"/>
                            </div>
                        </div>
                        <div class="row pedestal rounded-bottom py-2 g-0">
                        <div class="col d-flex flex-row align-items-center justify-content-center">
                                <img src="/streamlogo.png" width="32" height="32" class="d-inline-block align-text-top"/>
                                <h5 class="m-0">94%</h5>
                            </div>
                            {this.props.movie.imdb_link ?
                                <div class="col d-flex flex-row align-items-center justify-content-center">
                                    <h5 class="mb-0">
                                        <a href={this.props.movie.imdb_link} class="d-flex flex-row align-items-center link-light">
                                            <img src="/imdblogo.png" width="42" height="18" class="d-inline-block align-text-top"/>
                                            {this.props.movie.imdb_rating ? 
                                                <span class="ms-1">{this.props.movie.imdb_rating}</span>
                                            : ''}
                                        </a>
                                    </h5>
                                </div>
                            : ''}
                            {this.props.movie.rotten_tomatoes_link ?
                                <div class="col d-flex flex-row align-items-center justify-content-center">
                                    <h5 class="mb-0">
                                        <a href={this.props.movie.rotten_tomatoes_link} class="d-flex flex-row align-items-center link-light">
                                            <img src="/rottentomatoeslogo.png" width="24" height="24" class="d-inline-block align-text-top"/>
                                            {this.props.movie.rotten_tomatoes_rating ? 
                                                <span class="ms-1">{this.props.movie.rotten_tomatoes_rating}</span>
                                            : ''}
                                        </a>
                                    </h5>
                                </div>
                            : ''}
                        </div>
                    </civ>
                    <div class="col-12 col-lg-8">
                        <div class="row mb-3">
                            <div class="col d-flex flex-row justify-content-between align-items-center">
                                <h2 class="text-head">{this.props.movie.title}</h2>
                                <div class="d-flex flex-row">
                                    <button class="btn btn-outline-light px-3 py-2 lh-1 m-1">
                                        <SVG.ThumbsUpFill />
                                    </button>
                                    <button class="btn btn-outline-light px-3 py-2 lh-1 m-1">
                                        <SVG.ThumbsDownFill />
                                    </button>
                                    {/* <button class="btn">
                                        <SVG.ShareFill w={24} h={24} />
                                    </button> */}
                                </div>
                            </div>
                        </div>
                        <div class="row my-3">
                            <div class="col">
                                <div class="ratio ratio-16x9">
                                    <iframe src={"https://www.youtube.com/embed/"+this.props.movie.trailer} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>
                        <WatchNow availability={this.props.movie.availability} links={this.props.movie.links} openStream={this.openStream} openFilter={this.openFilter}/>
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