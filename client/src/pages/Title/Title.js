import React from 'react';
import Movie from '../../comps/Movie/Movie.js';
import Series from '../../comps/Series/Series.js';
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
        this.loadRating = this.loadRating.bind(this);
    }

    componentDidMount(){
        fetch(process.env.REACT_APP_API + 'titles/' + this.props.match.params.id)
            .then(res => res.ok ? res : Promise.reject())
            .then(res => res.json())
            .then((res) => {
                this.setState({content: res, status: "loaded"});
                this.loadRating();
            })
            .catch((err) => {
                console.log(err);
                this.setState({status: 'error'});
            })
    }

    componentDidUpdate(prevProps){
        if (this.props.user && !prevProps.user)
            this.loadRating();
    }

    loadRating(){
        if (this.props.user && this.state.content.id) // logged in
            fetch(process.env.REACT_APP_API + "users/" + this.props.user.id + "/ratings/" + this.state.content.id, {
                method: 'GET',
                headers: {'token': this.props.token}
            })
                .then(res => res.ok ? res : Promise.reject())
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
            if (!this.props.user){
                this.setState({liked: this.state.rating.positive, disliked: !this.state.rating.positive});
                this.props.promptLogin();
                return;
            }
            let promise;
            if (positive === this.state.rating.positive){ // delete
                promise = fetch(process.env.REACT_APP_API + "users/" + this.props.user.id + "/ratings/" + this.state.content.id, {
                    method: 'DELETE',
                    headers: {'token': this.props.token}
                })
                .then(res => res.ok ? res : Promise.reject())
                .then(() => {
                    this.setState({rating: undefined});
                })
            }
            else { // edit
                promise = fetch(process.env.REACT_APP_API + "users/" + this.props.user.id + "/ratings/" + this.state.content.id, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json', 'token': this.props.token},
                    body: JSON.stringify({positive: positive})
                })
                .then(res => res.ok ? res : Promise.reject())
                .then(() => {
                    this.setState({rating: {positive: positive}});
                })
            }
            promise
                .catch(err => {
                    console.log(err);
                    this.setState({liked: this.state.rating.positive, disliked: !this.state.rating.positive});
                });
        }
        else { // create
            if (!this.props.user){
                this.setState({liked: false, disliked: false});
                this.props.promptLogin();
                return;
            }
            fetch(process.env.REACT_APP_API + "users/" + this.props.user.id + "/ratings/" + this.state.content.id, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'token': this.props.token},
                body: JSON.stringify({positive: positive})
            })
            .then(res => res.ok ? res : Promise.reject())
            .then(() => {
                this.setState({rating: {positive: positive}});
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
            content = <Series series={this.state.content} user={this.props.user} token={this.props.token} liked={this.state.liked} disliked={this.state.disliked} like={this.like} dislike={this.dislike} />
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