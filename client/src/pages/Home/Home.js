import React from 'react';
import ReactDOM from 'react-dom';

import Footer from '../../comps/Footer/Footer.js';

class Home extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <>
            <div class="bg-light h-100">
                <div class="container h-100">
                    <div class="row h-100">
                        <div class="col">
                            <div class="row mt-5 mb-4">
                                <div class="col-md-10">
                                    <h3 class="display-3">Discover new movies and shows from all your favorite streaming services</h3>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <a href="/discover">
                                        <button type="button" class="btn btn-lg btn-primary">Discover now</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            </>
        );
    }

}

export default Home;