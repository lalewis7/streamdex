import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Footer from '../comps/Footer.js';

class Search extends React.Component{

    constructor(props){
        super(props);
        console.log(this.props);
        this.state = {
            movies: [
                {id: '1', img: '/frozen.jpg', title: 'Frozen'},
                {id: '2', img: '/frozen2.jpg', title: 'Frozen 2'},
                {id: '3', img: '/moana.jpg', title: 'Moana'},
                {id: '3', img: '/moana.jpg', title: 'Moana'},
                {id: '3', img: '/moana.jpg', title: 'Moana'},
                {id: '3', img: '/moana.jpg', title: 'Moana'}
            ]
        }
    }

    renderMovie(movie){

        if (movie.hovering == undefined)
            movie.hovering = false;

        var hover = () => {
            const newMovies = [...this.state.movies];
            for (let q = 0; q < this.state.movies.length; q++){
                if (movie.id === this.state.movies[q].id)
                    newMovies[q].hovering = !newMovies[q].hovering;
            }
            this.setState({movies: newMovies});
        }

        return (
            <a class="card text-center bg-gradient-primary" style={{maxWidth: '160px'}} onMouseEnter={hover} onMouseLeave={hover} href="/title/1238910">
                <div class="d-flex flex-row">
                    <div class={movie.hovering ? 'showcase-gradient' : ''}>
                        <img src={movie.img} class="card-img" alt="..." style={{maxHeight: '400px', fitContent: 'cover'}}/>
                    </div>
                    {movie.hovering ? (
                        <div class="card-img-overlay d-flex align-items-end justify-content-center">
                            <h5 class="card-text p-1 bg-gradient-success text-white">{movie.title}</h5>
                        </div>
                    ) : ''}
                </div>
            </a>
        );
    }

    render(){
        return (
            <>
            <div class="h-100">
                <div class="container pt-3 h-100 d-flex flex-column">
                    <div class="row g-3">
                        {this.state.movies.map(movie => (
                            <div class="col-lg-auto col-md-3 col-sm-4 col-auto">{this.renderMovie(movie)}</div>
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