import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Footer from '../../comps/Footer/Footer.js';

import TitlePreview from '../../comps/TitlePreview/TitlePreview.js';

const queryString = require('query-string');

class Search extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            titles: []
        }
    }

    componentDidMount(){
        //let queries = queryString.parse(this.props.location.search);
        fetch(process.env.REACT_APP_API + 'titles/' + this.props.location.search).then((res) => {
            if (res.ok)
                return res.json();
        }).then((res) => {
            this.setState({titles: res});
        })
    }

    componentDidUpdate(previousProps, previousState){
        console.log(previousProps);
        if (previousProps.location.search != this.props.location.search){
            fetch(process.env.REACT_APP_API + 'titles/' + this.props.location.search).then((res) => {
                if (res.ok)
                    return res.json();
            }).then((res) => {
                this.setState({titles: res});
            })
        }
    }

    render(){
        return (
            <>
            <div class="h-100 flex-grow-1">
                <div class="container pt-3 h-100 d-flex flex-column">
                    <div class="row g-3">
                        {this.state.titles.map(t => (
                            <TitlePreview title={t} />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
            </>
        );
    }
}

export default Search;