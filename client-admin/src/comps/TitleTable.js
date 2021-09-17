import React from 'react';
import { withRouter } from "react-router";

import Header from '../Header.js';
import NewMovie from './NewMovie.js';
import NewSeries from './NewSeries.js';
import Title from './Title.js';
import Toasts from '../Toasts.js';
import Loading from '../Loading.js';

const SVG = require('../svg.js');
const Config = require('../config.json');

class TitleTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            titles: [],
            status: 'loading',
            selectedTitle: undefined,
            showNewMovie: false,
            showNewSeries: false,
            showTitle: false,
            query: '',
            toastMessage: '',
            toastMessageCounter: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.viewTitle = this.viewTitle.bind(this);
        this.loadTitles = this.loadTitles.bind(this);
        this.search = this.search.bind(this);
        this.setTitleVisible = this.setTitleVisible.bind(this);
        this.toastMessage = this.toastMessage.bind(this);
    }

    componentDidMount(){
        this.loadTitles();
        if (this.props.match.params.id)
            this.setState({selectedTitle: this.props.match.params.id, showTitle: true});
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    search(evt){
        evt.preventDefault();
        this.loadTitles();
    }

    loadTitles(){
        this.setState({status: 'loading'});
        let url = Config.API+"titles";
        if (this.state.query.length > 0)
            url += "?q="+this.state.query;
        fetch(url,
        {
            method: 'GET',
            headers: {'token': this.props.token}
        })
        .then(res => res.json())
        .then(titles => {
            this.setState({titles: titles, status: 'loaded'});
        })
        .catch(err => {
            console.log(err);
            this.setState({status: 'error'});
        });
    }

    viewTitle(id) {
        this.props.history.push("/titles/"+id);
        this.setState({selectedTitle: id, showTitle: true});
    }

    setTitleVisible(visible) {
        if (!visible)
            this.props.history.push("/titles");
        this.setState({showTitle: visible});
    }

    toastMessage(icon, icon_color, msg){
        this.setState({toastMessage: <>
            <span class={icon_color}>
                {icon}
            </span> {msg}
        </>, toastMessageCounter: ++this.state.toastMessageCounter});
    }

    render(){

        const titleRow = (title) => <>
            <button type="button" class="list-group-item list-group-item-action d-flex align-items-start justify-content-start" onClick={() => this.viewTitle(title.id)}>
                <div class="d-flex flex-column">
                    <span class="fw-bold">{title.title}</span>
                    <span class="fs-7">{title.id}</span>
                </div>
            </button>
        </>

        return <>
            <Header setToken={this.props.setToken} deleteToken={this.props.deleteToken} token={this.props.token}/>
            <Title show={this.state.showTitle} setVisible={this.setTitleVisible} loadTitles={this.loadTitles} token={this.props.token} title={this.state.selectedTitle} toastMessage={this.toastMessage} />
            <NewMovie show={this.state.showNewMovie} setVisible={vis => this.setState({showNewMovie: vis})} loadTitles={this.loadTitles} token={this.props.token} toastMessage={this.toastMessage} />
            <NewSeries show={this.state.showNewSeries} setVisible={vis => this.setState({showNewSeries: vis})} loadTitles={this.loadTitles} token={this.props.token} toastMessage={this.toastMessage} />
            <div class="position-fixed p-3 bottom-0 end-0 toast-z">
                <Toasts id="title_toasts" message={this.state.toastMessage} counter={this.state.toastMessageCounter} />
            </div>
            <div class="container pt-3">
                <div class="row">
                    <div class="col">
                        <form onSubmit={this.search}>
                            <div class="input-group">
                                <input id="header-title-searchbar" class="form-control" type="search" placeholder="Search" aria-label="Search" name="query" value={this.state.query} onChange={this.handleChange} />
                                <button class="btn btn-secondary d-flex align-items-center" type="submit">
                                    <SVG.Search w={'1em'} h={'1em'} />
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-secondary dropdown-toggle d-flex align-items-center h-100" type="button" id="newTitleDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <SVG.PlusSquare w="1.2em" h="1.2em" />
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="newTitleDropdown">
                            <li role="button" class="dropdown-item" onClick={() => {this.setState({showNewMovie: true})}}>
                                <SVG.Movie w="1.3em" h="1.3em" /><span class="ms-2">New Movie</span>
                            </li>
                            <li role="button" class="dropdown-item" onClick={() => {this.setState({showNewSeries: true})}}>
                                <SVG.Show w="1.3em" h="1.3em" /><span class="ms-2">New Series</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <Loading status={this.state.status}>
                            <div class="list-group list-group-flush my-3">
                                {this.state.titles.map(title => titleRow(title))}
                            </div>
                        </Loading>
                    </div>
                </div>
            </div>
        </>;
    }

}

export default withRouter(TitleTable);