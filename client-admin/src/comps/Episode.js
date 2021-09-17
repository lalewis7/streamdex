import React from 'react';
import isEqual from 'lodash/isEqual';

import HorizontalScrollable from '../HorizontalScrollable.js';
import LinkAvailability from './LinkAvailability.js';

const SVG = require('../svg.js');

class Episode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            episode_number: 0,
            name: '',
            runtime: '',
            description: '',
            rel_date: '',
            availability: []
        }
        this.updateContent = this.updateContent.bind(this);
        this.resetForms = this.resetForms.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
        console.log(this.state);
        this.props.updateContent({
            id: this.props.content ? this.props.content.id : '',
            episode_number: this.state.episode_number,
            name: this.state.name,
            runtime: !isNaN(parseInt(this.state.runtime)) ? parseInt(this.state.runtime) : null,
            description: this.state.description,
            rel_date: this.state.rel_date,
            availability: this.state.availability
        });
    }

    resetForms(){
        console.log(this.props.content);
        this.setState({
            id: this.props.content.id,
            episode_number: this.props.content.episode_number,
            name: this.props.content.name,
            runtime: this.props.content.runtime,
            description: this.props.content.description,
            rel_date: this.props.content.rel_date,
            availability: this.props.content.availability
        }, () => this.updateContent());
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    render(){
        console.log(this.state.runtime);
        return <>
            <div class="d-flex align-items-center justify-content-between pt-2">
                <div class="d-flex align-items-center">
                    <button type="button" class="btn btn-dark" onClick={() => this.props.back()}>
                        <SVG.LeftArrowShort w="2em" h="2em" />
                    </button>
                    <h3 class="m-0">Edit Episode</h3>
                </div>
                <button type="button" class="btn btn-danger me-3" onClick={() => this.props.deleteEpisode()}><SVG.Trash w="1.1em" h="1.1em"/></button>
            </div>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <HorizontalScrollable>
                            <ul class="nav nav-tabs" role="tablist" >
                                <li class="nav-item" role="button">
                                    <button class="nav-link text-nowrap active" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-episode-episode"} type="button">Episode</button>
                                </li>
                                <li class="nav-item" role="button">
                                    <button class="nav-link text-nowrap" data-bs-toggle="tab" data-bs-target={"#"+this.props.htmlId+"-episode-availability"} type="button">Link Availability</button>
                                </li>
                                <div class="flex-grow-1"></div>
                            </ul>
                        </HorizontalScrollable>
                    </div>
                </div>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id={this.props.htmlId+"-episode-episode"} role="tabpanel">
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
                                    <input type="text" class="form-control" placeholder="Name" name="name" value={this.state.name} onChange={this.handleChange} />
                                    <label>Name</label>
                                </div>
                            </div>
                        </div>
                        <div class="row my-3">
                            <div class="col-12">
                                <div class="form-floating">
                                    <textarea class="form-control textarea-form" placeholder="Description" name="description" value={this.state.description} onChange={this.handleChange} style={{height: "150px"}}></textarea>
                                    <label for="floatingTextarea">Description</label>
                                </div>
                            </div>
                        </div>
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
                    </div>
                    <div class="tab-pane fade" id={this.props.htmlId+"-episode-availability"} role="tabpanel">
                        <LinkAvailability content={{availability: this.state.availability}} show={this.props.show} updateContent={content => this.setState({availability: content.availability})} links={this.props.links} />
                    </div>
                </div>
            </div>
        </>
    }

}

export default Episode;