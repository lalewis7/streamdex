import React from 'react';
import ReactDOM from 'react-dom';
import Config from './config.js';

import platforms from './platforms.json';

class Title extends React.Component{

    constructor(props){
        super(props);
        this.stream = this.stream.bind(this);
        this.runtime = this.runtime.bind(this);
        this.state = {
            title: {
                id: "1",
                img: "/frozen.jpg",
                title: "Frozen",
                trailer: "R-cdIvgBCWY",
                year: "2013",
                runtime: "132",
                mpaa: "pg",
                tags: ["family", "animation", "comedy", "adventure"],
                description: "When their kingdom becomes trapped in perpetual winter, fearless Anna (Kristen Bell) joins forces with mountaineer Kristoff (Jonathan Groff) and his reindeer sidekick to find Anna's sister, Snow Queen Elsa (Idina Menzel), and break her icy spell. Although their epic journey leads them to encounters with mystical trolls, a comedic snowman (Josh Gad), harsh conditions, and magic at every turn, Anna and Kristoff bravely push onward in a race to save their kingdom from winter's cold grip.",
                imdb_rating: "",
                links: [
                    {
                        "platform": "hulu",
                        "link": "https://www.hulu.com/watch/acf691ac-4339-4a0e-ab6e-b263799142bc",
                    },
                    {
                        "platform": "disney_plus",
                        "link": "https://www.disneyplus.com/video/8e06a8b7-d667-4e31-939d-f40a6dd78a88?pid=AssistantSearch"
                    },
                    {
                        "platform": "amazon_prime",
                        "link": "https://www.amazon.com/gp/video/detail/amzn1.dv.gti.5aa9f6f7-cb2a-37b4-277e-c31c18ab8cb4?autoplay=1&ref_=atv_cf_strg_wb"
                    }
                ],
            }
        }
    }

    componentDidMount(){
        fetch(Config.API+"title/"+this.props.match.params.id).then(res => {
            if (res.ok)
                return res.json();
        }).then(data => {
            console.log(data);
            if (data)
                this.setState({title: data});
        })
    }

    stream(data){
        var icon = "/baby.jpg";
        var title = data.platform;
        platforms.map(platform => {
            if (platform.id === data.platform){
                icon = platform.icon;
                title = platform.title;
            }
        })
        return (
            <div class="d-flex flex-row justify-content-between rounded-pill border p-1 pl-2 pr-2 mt-1 bg-white">
                <div class="d-flex flex-row align-items-center">
                    <img class="rounded-circle" src={icon} style={{width: '40px', height: '40px'}}/>
                    <div class="d-flex flex-column ml-2">
                        <div class="font-weight-boldd">{title}</div>
                        <div class="font-weight-light">Free</div>
                    </div>
                </div>
                <a href={data.link} class="m-1 align-self-center border rounded-pill align-items-center d-flex flex-row p-2 bg-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.75em" height="1.75em" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
                    </svg>
                    <div class="ml-1 mr-1">Watch</div>
                </a>
            </div>
        );
    }

    runtime(mins){
        var h = 0, m = mins;
        if (m > 60){
            h = Math.floor(m/60);
            m = m%60;
        }
        return h+"h "+m+"m";
    }

    render(){
        return (
            <div class="">
                <div class="card m-4 bg-light">
                    <div class="card-body">
                        <div class="container-fluid p-0">
                            {/* rows -> title, trailer, info, stream links, movie info */}
                            <div class="row">
                                {/*
                                <div class="col-md-auto">
                                    <img class="" src={this.state.title.img} style={{maxWidth: '200px'}} />
                                </div>
                                */}
                                <div class="col" style={{minWidth: '200px'}}>
                                    <h2>{this.state.title.title}</h2>
                                    <p><span class="badge badge-secondary">{this.state.title.mpaa.toUpperCase()}</span> | {this.state.title.year} | {this.runtime(this.state.title.runtime)}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div class="embed-responsive embed-responsive-16by9">
                                        <iframe class="embed-responsive-item" src={"https://www.youtube.com/embed/"+this.state.title.trailer}></iframe>
                                    </div>
                                </div>
                            </div>
                            <div class="row m-0 mt-3">
                                <h5>Available on</h5>
                                <div class="d-flex justify-content-row w-100 flex-column" style={{borderRadius: '20px', overflowX: 'auto'}}>
                                    {this.state.title.links.map(stream => (
                                        <div>{this.stream(stream)}</div>
                                    ))}
                                </div>
                            </div>
                            <div class="row m-0 mt-3 d-flex flex-column">
                                <h5>Movie Information</h5>
                                <div>
                                    {this.state.title.tags.map(tag => {
                                        return <span class="badge badge-pill badge-primary mr-2">{tag}</span>
                                    })}
                                </div>
                                <div class="mt-2">
                                    <p class="m-0">{this.state.title.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Title;