import React from 'react';
import isEqual from 'lodash/isEqual';

import TextArray from '../TextArray.js';

class TitleGenres extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            genres: []
        }
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
        if (!isEqual(this.props.content, prevProps.content) || (this.props.genres && this.props.show !== prevProps.show))
            this.resetForms();
    }

    updateContent(){
        this.props.updateContent({
            genres: this.state.genres
        });
    }

    resetForms(){
        this.setState({
            genres: this.props.content.genres
        }, () => this.updateContent());
    }

    render(){
        return <>
            <div class="row mt-3">
                <div class="col-12">
                    <TextArray values={this.state.genres} placeholder="comedy, action, drama..." updateValues={vals => this.setState({genres: vals})} show={this.props.show} />
                </div>
            </div>
        </>
    }

}

export default TitleGenres;