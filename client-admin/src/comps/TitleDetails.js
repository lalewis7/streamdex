import React from 'react';
import isEqual from 'lodash/isEqual';

const SVG = require('../svg.js');

class TitleDetails extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: '',
            title: '',
            cover_image: '',
            maturity_rating: '',
            description: '',
            imdb_link: '',
            imdb_rating: '',
            rt_link: '',
            rt_rating: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.resetForms = this.resetForms.bind(this);
    }

    componentDidMount(){
        if (this.props.content)
            this.resetForms();
        else
            this.updateContent();
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
            streamdex_rating: this.props.content ? this.props.content.streamdex_rating : '',
            title: this.state.title,
            thumbnail: this.state.cover_image,
            maturity: this.state.maturity_rating,
            description: this.state.description,
            imdb_link: this.state.imdb_link,
            imdb_rating: this.state.imdb_rating,
            rotten_tomatoes_link: this.state.rt_link,
            rotten_tomatoes_rating: this.state.rt_rating,
        });
    }

    resetForms(){
        this.setState({
            id: this.props.content.id,
            title: this.props.content.title,
            cover_image: this.props.content.thumbnail,
            maturity_rating: this.props.content.maturity,
            description: this.props.content.description,
            imdb_link: this.props.content.imdb_link,
            imdb_rating: this.props.content.imdb_rating,
            rt_link: this.props.content.rotten_tomatoes_link,
            rt_rating: this.props.content.rotten_tomatoes_rating
        }, () => this.updateContent());
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    render(){
        return <>
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
                        <input type="text" class="form-control" placeholder="Title" name="title" value={this.state.title} onChange={this.handleChange} />
                        <label>Title</label>
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
                        <input type="text" class="form-control" placeholder="Maturity Rating" name="maturity_rating" value={this.state.maturity_rating} onChange={this.handleChange} />
                        <label>Maturity Rating</label>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="form-floating">
                        <input type="text" class="form-control" placeholder="IMDB Link" name="imdb_link" value={this.state.imdb_link} onChange={this.handleChange} />
                        <label>IMDB Link</label>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="form-floating">
                        <input type="text" class="form-control" placeholder="IMDB Rating" name="imdb_rating" value={this.state.imdb_rating} onChange={this.handleChange} />
                        <label>IMDB Rating</label>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="form-floating">
                        <input type="text" class="form-control" placeholder="Rotten Tomatoes Link" name="rt_link" value={this.state.rt_link} onChange={this.handleChange} />
                        <label>Rotten Tomatoes Link</label>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="form-floating">
                        <input type="text" class="form-control" placeholder="Rotten Tomatoes Rating" name="rt_rating" value={this.state.rt_rating} onChange={this.handleChange} />
                        <label>Rotten Tomatoes Rating</label>
                    </div>
                </div>
            </div>
        </>;
    }

}

export default TitleDetails;