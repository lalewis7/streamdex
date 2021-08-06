import React from 'react';
import { withRouter } from "react-router";

import Header from '../Header.js';
import NewUser from './NewUser.js';
import User from './User.js';

const SVG = require('../svg.js');
const Config = require('../config.json');

class UsersTable extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            users: [], 
            selectedUser: undefined,
            showNewUser: false,
            showUser: false,
            query: ''
        };
        // bind this
        this.loadUsers = this.loadUsers.bind(this);
        this.viewUser = this.viewUser.bind(this);
        this.setUserVisible = this.setUserVisible.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount(){
        this.loadUsers();
        if (this.props.match.params.id)
            this.setState({selectedUser: this.props.match.params.id, showUser: true});
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    search(evt){
        evt.preventDefault();
        this.loadUsers();
    }

    loadUsers(){
        let url = Config.API+"users";
        if (this.state.query.length > 0)
            url += "?q="+this.state.query;
        fetch(url,
        {
            method: 'GET',
            headers: {'token': this.props.token}
        })
        .then(res => res.json())
        .then(users => {
            this.setState({users: users});
        })
        .catch(err => {
            console.log(err);
        });
    }

    viewUser(id) {
        this.props.history.push("/users/"+id);
        this.setState({selectedUser: id, showUser: true});
    }

    setUserVisible(visible) {
        if (!visible)
            this.props.history.push("/users");
        this.setState({showUser: visible})
    }

    render(){

        const userRow = (user) => {
            return <>
                <tr role="button" onClick={() => this.viewUser(user.id)}>
                <th scope="row">{user.id}</th>
                <td>{user.handle}</td>
                <td>{user.email}</td>
                </tr>
            </>
        }

        return <>
            <Header setToken={this.props.setToken} deleteToken={this.props.deleteToken} token={this.props.token}/>
            <NewUser show={this.state.showNewUser} setVisible={(visible) => {this.setState({showNewUser: visible})}} loadUsers={this.loadUsers} />
            <User show={this.state.showUser} setVisible={this.setUserVisible} loadUsers={this.loadUsers} token={this.props.token} user={this.state.selectedUser} />
            <div class="container pt-3">
                <div class="row">
                    <div class="col">
                        <form onSubmit={this.search}>
                            <div class="input-group">
                                <input id="header-searchbar" class="form-control" type="search" placeholder="Search" aria-label="Search" name="query" value={this.state.query} onChange={this.handleChange} />
                                <button class="btn btn-secondary d-flex align-items-center" type="submit">
                                    <SVG.Search w={'1em'} h={'1em'} />
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-secondary" onClick={() => {this.setState({showNewUser: true})}}>
                            <SVG.NewPerson w="1.3em" h="1.3em"/>
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Handle</th>
                                    <th scope="col">Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.users.map((user) => userRow(user))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>;
    }

}

export default withRouter(UsersTable);