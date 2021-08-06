import React from 'react';

import Movie from '../../comps/Movie/Movie.js';
import Series from '../../comps/Series/Series.js';
import TitlePreview from '../../comps/TitlePreview/TitlePreview.js';
import HorizontalScrollable from '../../comps/HorizontalScrollable/HorizontalScrollable.js';

const titles = require('./titles_data.json');
const movie = require('./movie_data.json');
const series = require('./series_data.json');
const discover = require('./discover_data.json');

class Test extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            titles: titles,
            movie: movie,
            discover: discover
        };

    }

    /*
    render(){
        return <>
            <div class="container pt-3">
                <Series series={series} />
            </div>
        </>;
    }
    */

    
    render(){
        console.log(this.state);
        return <>
            <div class="h-100">
                <div class="container-fluid px-5 h-100 d-flex flex-column">
                    {this.state.discover.map(cat => <>
                        <div class="row mt-4 mb-1">
                            <h2>{cat.name}</h2>
                        </div>
                        <div class="row g-3">
                                <HorizontalScrollable>
                                    <div class="d-flex">
                                    {cat.titles.map(title => <div class="mx-2"><TitlePreview title={title}/></div>)}
                                    </div>
                                </HorizontalScrollable>
                        </div>
                    </>)}
                </div>
            </div>
        </>;
    }
    

}

export default Test;