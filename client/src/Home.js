import React from 'react';
import ReactDOM from 'react-dom';


class Home extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div class="bg-light">
                <div class="container">
                    <div class="row">
                        <div class="col-7">
                            <div class="row h-100 align-items-center">
                                <div class="col-12">
                                    <h3 class="display-3">Discover new movies and shows from all your favorite streaming services</h3>
                                </div>
                                <div class="col-12">
                                    <button type="button" class="btn btn-primary">Discover now</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div id="frpageCarousel" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                                    <div class="carousel-item active">
                                        <img src="/frozen.jpg" class="d-block w-100" alt="..."/>
                                    </div>
                                    <div class="carousel-item">
                                        <img src="/frozen2.jpg" class="d-block w-100" alt="..."/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Home;