import React, { useState } from 'react';

class Footer extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <footer class="container-fluid">
                <div class="row p-3 justify-content-center">
                    <div class="col-auto navbar-dark">
                        <a class="" href="/">
                            <img src="/streamlogo.png" width="50" height="50" class="d-inline-block align-text-top"/>
                        </a>
                    </div>
                </div>
                <div class="row justify-content-center p-3 pt-0">
                    <div class="col-6 border-end border-1 border-light d-flex justify-content-end">
                        <a class="text-decoration-none text-light" href="#">Contact Us</a>
                    </div>
                    <div class="col-6">
                        <a class="text-decoration-none text-light" href="#">About</a>
                    </div>
                </div>
            </footer>
        );
    }

}

export default Footer;