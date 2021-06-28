import React from 'react';
import ReactDOM from 'react-dom';
import Config from '../util/config.js';
import TitlePreview from './TitlePreview.js';
import TitleDetails from './TitleDetails.js';

import platforms from '../util/platforms.json';
import sample_title from '../sample_data/title.json';

class Title extends React.Component{

    constructor(props){
        super(props);
        // use sample data for now
        this.state = sample_title;
    }

    componentDidMount(){
        if (!this.props.id)
            return;
        fetch(Config.API+"title/"+this.props.id).then(res => {
            if (res.ok)
                return res.json();
        }).then(data => {
            console.log(data);
            if (data)
                this.setState(data);
        })
    }

    render(){
        console.log(this.state);
        var details = <TitleDetails tags={this.state.tags} description={this.state.description} links={this.state.links} platforms={platforms}/>;
        if (this.props.hide_details)
            details = (
                <div class="row">
                    <div class="col col-12">
                    <div id="titleDetailsCollapse" class="collapse">
                        <TitleDetails tags={this.state.tags} description={this.state.description} links={this.state.links} platforms={platforms}/>
                    </div>
                    <div class="d-flex justify-content-center p-2 pb-0">
                        <button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#titleDetailsCollapse,#viewDetailsLess,#viewDetailsMore" aria-expanded="true" aria-controls="titleDetailsCollapse">
                            View <span id="viewDetailsMore" class="collapse show">More</span><span id="viewDetailsLess" class="collapse">Less</span>
                        </button>
                    </div>
                    </div>
                </div>
            );
        return (
            <>
            <div class="card bg-light w-100" style={{"max-width": "767.98px"}}>
            <div class="card-body">
                <div class="container-fluid p-0">
                    <TitlePreview title={this.state.title} trailer={this.state.trailer} year={this.state.year} runtime={this.state.runtime} mpaa={this.state.mpaa} />
                    {details}
                </div>
            </div>
            </div>
            </>
        );
    }
}

export default Title;