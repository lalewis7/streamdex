import React from 'react';
import Movie from '../../comps/Movie/Movie.js';
import Series from '../../comps/Series/Series.js';
import Config from '../../util/config.js';
import Loading from '../../comps/Loading/Loading.js';

import Footer from '../../comps/Footer/Footer.js';

class Title extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            status: 'loading',
            content: {},
            liked: false,
            disliked: false,
            rating: undefined
        }

        this.like = this.like.bind(this);
        this.dislike = this.dislike.bind(this);
        this.sendRating = this.sendRating.bind(this);
    }

    componentDidMount(){
        fetch(Config.API + 'titles/' + this.props.match.params.id)
            .then(res => res.json())
            .then((res) => {
                this.setState({content: res, status: "loaded"});
                if (this.props.user) // logged in
                    return fetch(Config.API + "users/" + this.props.user.id + "/ratings/" + res.id, {
                        method: 'GET',
                        headers: {'token': this.props.token}
                    })
                        .then(res => res.json())
                        .then(rating => {
                            console.log(rating);
                            if (rating.positive)
                                this.setState({rating: rating, liked: true});
                            else 
                                this.setState({rating: rating, disliked: true});
                        })
                        .catch(err => {
                            console.log(err);
                        })
            })
            .catch((err) => {
                console.log(err);
                this.setState({status: 'error'});
            })
    }

    like(){
        this.setState({liked: !this.state.liked, disliked: false});
        this.sendRating(true);
    }

    dislike(){
        this.setState({liked: false, disliked: !this.state.disliked});
        this.sendRating(false);
    }

    sendRating(positive){
        if (this.state.rating){ // edit / delete
            let promise;
            if (positive === this.state.rating.positive){ // delete
                promise = fetch(Config.API + "users/" + this.props.user.id + "/ratings/" + this.state.content.id, {
                    method: 'DELETE',
                    headers: {'token': this.props.token}
                })
                .then(res => {
                    if (res.ok){
                        this.setState({rating: undefined});
                    }
                    else
                        throw new Error(res.message);
                })
            }
            else { // edit
                promise = fetch(Config.API + "users/" + this.props.user.id + "/ratings/" + this.state.content.id, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json', 'token': this.props.token},
                    body: JSON.stringify({positive: positive})
                })
                .then(res => {
                    if (res.ok){
                        this.setState({rating: {positive: positive}});
                    }
                    else
                        throw new Error(res.message);
                })
            }
            promise
                .catch(err => {
                    console.log(err);
                    this.setState({liked: this.state.rating.positive, disliked: !this.state.rating.positive});
                });
        }
        else { // create
            fetch(Config.API + "users/" + this.props.user.id + "/ratings/" + this.state.content.id, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'token': this.props.token},
                body: JSON.stringify({positive: positive})
            })
            .then(res => {
                if (res.ok){
                    this.setState({rating: {positive: positive}});
                }
                else
                    throw new Error(res.message);
            })
            .catch(err => {
                console.log(err);
                this.setState({liked: false, disliked: false});
            });
        }
    }

    render(){
        console.log(this.props);
        let content = <></>;
        if (this.state.content && this.state.content.seasons)
            content = <Series series={this.state.content} user={this.props.user} token={this.props.token} />
        else if (this.state.content)
            content = <Movie movie={this.state.content} user={this.props.user} token={this.props.token} liked={this.state.liked} disliked={this.state.disliked} like={this.like} dislike={this.dislike}/>
        return (
            <>
            <div class="container pt-3 flex-grow-1">
                <Loading status={this.state.status}>
                    {content}
                </Loading>
            </div>
            <Footer />
            </>
        );
    }

}

export default Title;