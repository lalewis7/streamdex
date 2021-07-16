import React from 'react';
import Movie from '../../comps/Movie/Movie.js';
import Series from '../../comps/Series/Series.js';
import Config from '../../util/config.js';

import Footer from '../../comps/Footer/Footer.js';

class Title extends React.Component {

    constructor(props){
        super(props);

        this.state = {}
    }

    componentDidMount(){
        fetch(Config.API + 'titles/' + this.props.match.params.id).then((res) => {
            if (res.ok)
                return res.json();
        }).then((res) => {
            this.setState({content: res});
        })
    }

    render(){
        console.log(this.state.content);
        return (
            <>
            <div class="container pt-3 flex-grow-1">
                {this.state.content ? 
                this.state.content.seasons ? <Series series={this.state.content} /> : <Movie movie={this.state.content} />
                 : ''}
            </div>
            <Footer />
            </>
        );
    }

}

export default Title;