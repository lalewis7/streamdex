import React from 'react';

// components
import WatchNow from '../WatchNow/WatchNow.js';
import TitleStreamPopup from '../TitleStreamPopup/TitleStreamPopup.js';
import CountryFilterPopup from '../CountryFilterPopup/CountryFilterPopup.js';
import HorizontalScrollable from '../HorizontalScrollable/HorizontalScrollable.js';

const Utils = require('../../util/utils.js');
const Platforms = require('../../util/platforms.json');
const SVG = require('../../util/svg.js');

class Series extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            stream: {
                countries: []
            },
            season: 1,
            showFilterModal: false,
            showStreamModal: false,
            thumbnailLoadFailed: false
        }
        this.open = false;

        this.openStream = this.openStream.bind(this);
        this.openFilter = this.openFilter.bind(this);
        this.switchSeason = this.switchSeason.bind(this);
        this.thumbnailFailedToLoad = this.thumbnailFailedToLoad.bind(this);
    }

    openStream(stream_id, availability){
        console.log(availability);
        let content = {platform: stream_id};
        for (let link of this.props.series.links)
            if (link.platform == stream_id)
                content.link = link.link;
        for (let platform of Platforms)
            if (platform.id == stream_id){
                content.title = platform.title;
                content.icon = platform.icon;
            }
        for (let available of availability)
            if (available.platform == stream_id)
                content.countries = available.countries;
        this.setState({stream: content, showStreamModal: true});
        this.open = true;
    }

    openFilter(){
        this.setState({showFilterModal: true});
    }

    switchSeason(season){
        this.setState({season: season});
    }

    thumbnailFailedToLoad(e){
        this.setState({thumbnailLoadFailed: true}); 
    }

    render(){
        let genres = this.props.series.genres;
        let season;
        if (this.props.series.seasons.length > 0)
            season = this.props.series.seasons[this.state.season-1];

        let likeBtn = <button class="btn btn-outline-light px-3 py-2 lh-1 m-1" onClick={() => {this.props.like()}}>
            <SVG.ThumbsUpFill />
        </button>
        if (this.props.liked)
            likeBtn = <button class="btn btn-success px-3 py-2 lh-1 m-1" onClick={() => {this.props.like()}}>
                <SVG.ThumbsUpFill />
            </button>

        let dislikeBtn = <button class="btn btn-outline-light px-3 py-2 lh-1 m-1" onClick={() => {this.props.dislike()}}>
            <SVG.ThumbsDownFill />
        </button>
        if (this.props.disliked)
            dislikeBtn = <button class="btn btn-danger px-3 py-2 lh-1 m-1" onClick={() => {this.props.dislike()}}>
                <SVG.ThumbsDownFill />
            </button>

        let rating = (logo, logo_width, logo_height, platform, link, rating) => 
            <div class="col d-flex flex-row align-items-center justify-content-between ps-1 pe-3 my-2">
                <div class="d-flex flex-row align-items-center">
                    <img src={logo} width={logo_width} height={logo_height} class="d-inline-block align-text-top"/>
                    <h6 class="m-0 ms-2">{platform}</h6>
                </div>
                {link ? <a target="_blank" rel="noopener noreferrer" href={link}class="d-flex flex-row align-items-center link-light">
                <h6 class="m-0 ms-1 d-flex align-items-center">{rating ? rating : 'N/A'}<span class="ms-1 d-flex align-content-center">
                    <SVG.BoxArrowUpRight /></span></h6></a> : rating ? <h6 class="m-0 ms-1">{rating}</h6> : ''}
            </div>;
        

        let genreText = "N/A"
        if (genres.length > 0)
            genreText = genres.map((genre, i) => {
                let val = genre.charAt(0).toUpperCase() + genre.slice(1) + ", ";
                if (genres.indexOf(genre) == genres.length-1)
                    val = val.slice(0, val.length-2);
                return val;
            });

        return <>
            <TitleStreamPopup stream={this.state.stream} title={this.props.series.title} show={this.state.showStreamModal} setVisible={(vis) => {this.setState({showStreamModal: vis})}} />
            <CountryFilterPopup show={this.state.showFilterModal} setVisible={(vis) => {this.setState({showFilterModal: vis})}} />
            <div class="container-fluid p-0">
                <div class="row p-2">
                    <div class="d-none d-lg-block col-lg-4 mb-5">
                        <div class="row">
                            <div class="col">
                                {this.state.thumbnailLoadFailed || !this.props.series.thumbnail ? 
                                    <div class="failed-thumbnail-page"><SVG.MovieReel w="80%" h="auto"/></div> :
                                        <img src={process.env.REACT_APP_API+"images/"+this.props.series.thumbnail} alt="..." class="w-100" 
                                        onError={this.thumbnailFailedToLoad}/>}
                            </div>
                        </div>
                        <h5 class="fw-bold mt-3 mb-0">RATINGS</h5>
                        <div class="row py-2 g-0 flex-column">
                            {rating("/streamdex-icon.svg", 28, 28, "Streamdex", null, this.props.series.streamdex_rating ? this.props.series.streamdex_rating+'%' : 'N/A')}
                            {/* <div class="col d-flex flex-row align-items-center justify-content-center">
                                <img src="/streamdex-icon.svg" width="28" height="28" class="d-inline-block align-text-top"/>
                                <h5 class="m-0 ms-1">{this.props.series.streamdex_rating ? this.props.series.streamdex_rating+'%' : '0%'}</h5>
                            </div> */}
                            {this.props.series.imdb_link ? rating("/imdblogo.png", 42, 18, "IMDb", 
                            this.props.series.imdb_link, this.props.series.imdb_rating) : ''}
                            {/* {this.props.series.imdb_link ?
                                <div class="col d-flex flex-row align-items-center justify-content-center">
                                    <h5 class="mb-0">
                                        <a href={this.props.series.imdb_link} class="d-flex flex-row align-items-center link-light">
                                            <img src="/imdblogo.png" width="42" height="18" class="d-inline-block align-text-top"/>
                                            {this.props.series.imdb_rating ? 
                                                <span class="ms-1">{this.props.series.imdb_rating}</span>
                                            : ''}
                                        </a>
                                    </h5>
                                </div>
                            : ''} */}
                            {this.props.series.rotten_tomatoes_link ? rating("/rottentomatoeslogo.png", 24, 24, "Rotten Tomatoes", 
                            this.props.series.rotten_tomatoes_link, this.props.series.rotten_tomatoes_rating) : ''}
                            {/* {this.props.series.rotten_tomatoes_link ?
                                <div class="col d-flex flex-row align-items-center justify-content-center">
                                    <h5 class="mb-0">
                                        <a href={this.props.series.rotten_tomatoes_link} class="d-flex flex-row align-items-center link-light">
                                            <img src="/rottentomatoeslogo.png" width="24" height="24" class="d-inline-block align-text-top"/>
                                            {this.props.series.rotten_tomatoes_rating ? 
                                                <span class="ms-1">{this.props.series.rotten_tomatoes_rating}</span>
                                            : ''}
                                        </a>
                                    </h5>
                                </div>
                            : ''} */}
                        </div>
                    </div>
                    <div class="col-12 col-lg-8">
                        <div class="row mb-3">
                            <div class="col d-flex flex-row justify-content-between align-items-center">
                                <h2 class="text-head m-0">{this.props.series.title}</h2>
                                <div class="d-flex flex-row">
                                    {likeBtn}
                                    {dislikeBtn}
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            {this.props.series.seasons.length > 0 ?
                            <div class="col">
                                <HorizontalScrollable>
                                    <ul class="nav nav-pills mb-1">
                                        {this.props.series.seasons.map(s => {
                                            return <>
                                                <li class="nav-item">
                                                    <a class={"btn nav-link text-nowrap " + (s.season_number === this.state.season ? 'active' : '')} onClick={() => {this.switchSeason(s.season_number)}}>Season {s.season_number}</a>
                                                </li>
                                            </>
                                        })}
                                        <div class="flex-grow-1"></div>
                                    </ul>
                                </HorizontalScrollable>
                                <WatchNow availability={season.availability} links={this.props.series.links} openStream={(stream_id) => {this.openStream(stream_id, season.availability)}} openFilter={this.openFilter}/>
                                <div class="rounded-bottom">
                                    {season.trailer && season.trailer.length > 0 ? 
                                        <div class="row my-3">
                                            <div class="col">
                                                <div class="ratio ratio-16x9">
                                                    <iframe src={"https://www.youtube.com/embed/"+season.trailer} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>
                                                </div>
                                            </div>
                                        </div> 
                                    : ''}
                                    <div class="row mt-3">
                                        <div class="col">
                                            <h5 class="text-head2 fw-bold">EPISODES</h5>
                                            <div class="accordion accordion-flush" id="episodes-accordion">
                                                {season.episodes.length === 0 ? <p>No episodes in this season.</p> : season.episodes.map(episode => {
                                                    return <>
                                                        <div class="accordion-item">
                                                            <h2 id={'#episode-'+episode.episode_number+'-header'} class="accordion-header">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={'#episode-'+episode.episode_number} aria-expanded="false" aria-controls={'episode-'+episode.episode_number}>
                                                                    <span class="fw-bold me-3">S{season.season_number}E{episode.episode_number} </span> {episode.name}
                                                                </button>
                                                            </h2>
                                                            <div id={'episode-'+episode.episode_number} class="accordion-collapse collapse" aria-labelledby={'episode-'+episode.episode_number+'-header'} data-bs-parent="#episodes-accordion">
                                                                <div class="accordion-body">
                                                                    <p>{episode.description}</p>
                                                                    <WatchNow availability={episode.availability} links={this.props.series.links} openStream={(stream_id) => {this.openStream(stream_id, episode.availability)}} openFilter={this.openFilter} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : <p>No seasons available for this series at the moment.</p>
                            }
                        </div>
                        <div class="row my-4 d-lg-none">
                            <div class="col">
                                <h5 class="fw-bold mt-3 mb-0">RATINGS</h5>
                                <div class="row rounded-bottom py-2 g-0 flex-column">
                                    {rating("/streamdex-icon.svg", 28, 28, "Streamdex", null, this.props.series.streamdex_rating ? this.props.series.streamdex_rating+'%' : 'N/A')}
                                    {this.props.series.imdb_link ? rating("/imdblogo.png", 42, 18, "IMDb", 
                                    this.props.series.imdb_link, this.props.series.imdb_rating) : ''}
                                    {this.props.series.rotten_tomatoes_link ? rating("/rottentomatoeslogo.png", 24, 24, "Rotten Tomatoes", 
                                    this.props.series.rotten_tomatoes_link, this.props.series.rotten_tomatoes_rating) : ''}
                                </div>
                            </div>
                        </div>
                        <div class="row my-4">
                            <div class="col">
                                <h5 class="text-head2 fw-bold">DESCRIPTION</h5>
                                <div>
                                    <p>{this.props.series.description && this.props.series.description.length > 0 ? this.props.series.description : 'No description available.'}</p>
                                </div>
                            </div>
                        </div>
                        <div class="row my-4 mb-5">
                            <div class="col">
                                <h5 class="text-head2 fw-bold">DETAILS</h5>
                                <div>
                                    <p class="text-main mb-2"><span class="fw-bold me-3">Genres</span>{genreText}</p>
                                    <p class="text-main"><span class="fw-bold me-3">Maturity</span>{this.props.series.maturity && this.props.series.maturity.length > 0 ? this.props.series.maturity : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        {/* <div class="row my-3 d-flex d-lg-none pedestal rounded-3 py-2 g-0">
                            <div class="col d-flex flex-row align-items-center justify-content-center">
                                <img src="/streamdex-icon.svg" width="28" height="28" class="d-inline-block align-text-top"/>
                                <h5 class="m-0 ms-1">{this.props.series.streamdex_rating ? this.props.series.streamdex_rating+'%' : '0%'}</h5>
                            </div>
                            {this.props.series.imdb_link ?
                                <div class="col d-flex flex-row align-items-center justify-content-center">
                                    <h5 class="mb-0">
                                        <a href={this.props.series.imdb_link} class="d-flex flex-row align-items-center link-light">
                                            <img src="/imdblogo.png" width="42" height="18" class="d-inline-block align-text-top"/>
                                            {this.props.series.imdb_rating ? 
                                                <span class="ms-1">{this.props.series.imdb_rating}</span>
                                            : ''}
                                        </a>
                                    </h5>
                                </div>
                            : ''}
                            {this.props.series.rotten_tomatoes_link ?
                                <div class="col d-flex flex-row align-items-center justify-content-center">
                                    <h5 class="mb-0">
                                        <a href={this.props.series.rotten_tomatoes_link} class="d-flex flex-row align-items-center link-light">
                                            <img src="/rottentomatoeslogo.png" width="24" height="24" class="d-inline-block align-text-top"/>
                                            {this.props.series.rotten_tomatoes_rating ? 
                                                <span class="ms-1">{this.props.series.rotten_tomatoes_rating}</span>
                                            : ''}
                                        </a>
                                    </h5>
                                </div>
                            : ''}
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    }

}

export default Series;