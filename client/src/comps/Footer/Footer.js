import React, { useState } from 'react';

class Footer extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <footer class="container-fluid p-0">
                <div class="container-sm">
                    <div class="row py-4 justify-content-center">
                        <div class="col-md-5 navbar-dark my-2">
                            <a class="navbar-brand" href="/">
                                <img src="/streamdex-icon.svg" width="48" height="48" class="d-inline-block align-text-top"/>
                                <span class="ps-2">
                                Streamdex
                                </span>
                            </a>
                            <p class="mt-2 mb-0">Helping users discover and watch their favorite titles from one convenient location.</p>
                        </div>
                        <div class="col-md-4 d-flex flex-column my-2">
                            <h5>Sitemap</h5>
                            <div class="row">
                                <div class="col-6 d-flex flex-column">
                                    <a class="text-decoration-none text-light mb-1" href="/">Home</a>
                                    <a class="text-decoration-none text-light mb-1" href="/new">New</a>
                                    <a class="text-decoration-none text-light" href="/about">About</a>
                                </div>
                                <div class="col-6 d-flex flex-column">
                                    <a class="text-decoration-none text-light mb-1" href="/browse">Browse</a>
                                    <a class="text-decoration-none text-light" href="/popular">Popular</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 d-flex flex-column my-2">
                            <h5>Contact</h5>
                            <a class="text-decoration-none text-light mb-1" href="mailto: steamdex1@gmail.com">steamdex1@gmail.com</a>
                            <a class="text-decoration-none text-light" href="https://www.linkedin.com/in/arthur-lewis/" target="blank" rel="noopener noreferrer">Developer LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

}

export default Footer;