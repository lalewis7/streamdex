import React from 'react';

import Footer from '../../comps/Footer/Footer.js';

class Home extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <>
            <div class="h-100 flex-grow-1">
                <div class="container my-5 mt-3">
                    <div class="row">
                        <div class="col-md-7 d-flex flex-column justify-content-center">
                            <h3 class="display-5 text-nunito-eb my-4 text-center text-md-start">The ultimate streaming serivce guide.</h3>
                            <h5 class="text-center text-md-start lh-base mb-4">Browse and search where your favorite films and shows are available online.</h5>
                            <div class="text-center text-md-start mb-4">
                                <a href="/browse">
                                    <button type="button" class="btn btn-lg btn-primary">Browse now</button>
                                </a>
                            </div>
                        </div>
                        <div class="col-md-5 text-center">
                            <img src="./phone.png" alt="..." style={{maxWidth: '300px'}} />
                        </div>
                    </div>
                </div>
                <div class="bg-darker">
                    <div class="container py-4">
                        <div class="row">
                            <div class="col-md-4 text-center">
                                <img class="streaming_services_img" src="./streaming_services.png" alt=""/>
                            </div>
                            <div class="col-md-8 d-flex flex-column justify-content-center px-3">
                                <h3 class="text-nunito-eb text-center text-md-start">Browse all your favorite streaming services from one spot.</h3>
                                <h5 class="text-center text-md-start">Browse and search Movies &#38; TV Shows from the top streaming services such as Netflix, Hulu, Disney+, Prime Video, and more!</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container my-5">
                    <div class="row">
                        <div class="col">
                            <h2 class="text-center display-6 text-nunito-eb fw-normal">Search globally for titles.</h2>
                            <h5 class="text-center lh-base">
                                Check which countries each streaming serivce offers their Movies &#38; TV Shows in. VPN users can connect through their VPN
                                to gain access to geo-blocked content.
                            </h5>
                        </div>
                    </div>
                    <div class="row pt-5">
                        <div class="col text-center">
                            <img style={{maxWidth: '800px'}} src="./world_map.svg" alt=""/>
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