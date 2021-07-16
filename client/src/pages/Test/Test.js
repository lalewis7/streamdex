import React from 'react';

import Movie from '../../comps/Movie/Movie.js';
import Series from '../../comps/Series/Series.js';

const titles = require('./titles_data.json');
const movie = require('./movie_data.json');
const series = require('./series_data.json');

class Test extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            titles: titles,
            movie: movie
        };

    }

    render(){
        return <>
            <div class="container pt-3">
                <Series series={series} />
            </div>
        </>;
    }

    /*
    render(){
        console.log(this.state);
        return <>
            <div class="h-100">
                <div class="container pt-3 h-100 d-flex flex-column">
                    <div class="row g-3">
                        {this.state.titles.map(movie => (
                            <div class="col-lg-auto col-md-3 col-sm-4 col-auto"><TitlePreview movie={movie}/></div>
                        ))}
                    </div>
                </div>
            </div>
        </>;
    }
    */

}

export default Test;