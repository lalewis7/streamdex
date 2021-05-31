import React from 'react';
import ReactDOM from 'react-dom';

class TitleDetails extends React.Component {

    constructor(props){
        super(props);
        this.stream = this.stream.bind(this);
    }

    stream(data){
        var icon = "/baby.jpg";
        var title = data.platform;
        this.props.platforms.map(platform => {
            if (platform.id === data.platform){
                icon = platform.icon;
                title = platform.title;
            }
        })
        return (
            <div class="d-flex flex-row justify-content-between rounded-pill border p-1 px-2 mt-1 bg-white">
                <div class="d-flex flex-row align-items-center">
                    <img class="rounded-circle" src={icon} style={{width: '40px', height: '40px'}}/>
                    <div class="d-flex flex-column ms-2">
                        <div class="font-weight-boldd">{title}</div>
                        <div class="font-weight-light">Free</div>
                    </div>
                </div>
                <a href={data.link} class="m-1 align-self-center border rounded-pill align-items-center d-flex flex-row p-2 bg-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.75em" height="1.75em" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
                    </svg>
                    <div class="mx-1">Watch</div>
                </a>
            </div>
        );
    }

    render(){
        return (
            <>
            <div class="row m-0 mt-3">
                <h5>Available on</h5>
                <div class="d-flex justify-content-row w-100 flex-column" style={{borderRadius: '20px', overflowX: 'auto'}}>
                    {this.props.links.map(stream => (
                        <div>{this.stream(stream)}</div>
                    ))}
                </div>
            </div>
            <div class="row m-0 mt-3 d-flex flex-column">
                <h5>Movie Information</h5>
                <div>
                    {this.props.tags.map(tag => {
                        return <span class="badge rounded-pill bg-primary me-2">{tag}</span>
                    })}
                </div>
                <div class="mt-2">
                    <p class="m-0">{this.props.description}</p>
                </div>
            </div>
            </>
        );
    }

}

export default TitleDetails;