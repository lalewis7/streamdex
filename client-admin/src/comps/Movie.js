import React from 'react';
import isEqual from 'lodash/isEqual';

import TitleDetails from './TitleDetails.js';
import HorizontalScrollable from '../HorizontalScrollable.js';

const SVG = require('../svg.js');
const Config = require('../config.json');

class Movie extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            movie: null,
            titleDetails: {},
            tab: "Title",

            rel_date: '',
            runtime: '',
            trailer: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.resetForms = this.resetForms.bind(this);
    }

    componentDidMount(){
        if (this.props.title)
            this.resetForms();
    }

    componentDidUpdate(prevProps){
        if (!isEqual(this.props.title, prevProps.title) || (this.props.title != prevProps.title && this.props.show))
            this.resetForms();
    }

    resetForms(){
        let newState = {
            rel_date: '',
            runtime: null,
            trailer: ''
        };
        if (this.props.title){
            newState.rel_date = this.props.title.rel_date;
            newState.runtime = this.props.title.runtime;
            newState.trailer = this.props.title.trailer;
        }
        this.setState(newState);
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    saveChanges(evt){
        evt.preventDefault();
    }

    render(){

        let content = <></>;

        if (this.state.tab === 'Title'){
            content = <TitleDetails content={this.props.title && this.props.show ? this.props.title : {}} updateDetails={details => this.setState({titleDetails: details})} />;
        }
        else if (this.state.tab === 'Movie'){
            content = <>
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
            </>
        }

        return <>
            <div class="row">
                <div class="col-12">
                    <HorizontalScrollable>
                        <ul class="nav nav-tabs">
                            {["Title", "Cover Image", "Links", "Movie"].map(tab => 
                                <li class="nav-item" role="button" onClick={() => this.setState({tab: tab})}>
                                    <span class={this.state.tab === tab ? "nav-link text-nowrap active" : "nav-link text-nowrap"}>{tab}</span>
                                </li>
                            )}
                            <div class="flex-grow-1"></div>
                        </ul>
                    </HorizontalScrollable>
                </div>
            </div>
            {content}
        </>;
    }

}

export default Movie;