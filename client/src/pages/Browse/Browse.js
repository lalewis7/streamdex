import React from 'react';

import Footer from '../../comps/Footer/Footer.js';
import List from '../../comps/List/List.js';
import Loading from '../../comps/Loading/Loading.js';

class Browse extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            lists: [],
            status: 'loading',
        }
    }

    componentDidMount(){
        this.setState({status: 'loading'});
        fetch(process.env.REACT_APP_API + 'pages/new')
            .then(res => res.ok ? res : Promise.reject())
            .then(res => res.json())
            .then((res) => {
                this.setState({lists: res, status: 'loaded'});
            })
            .catch(err => {
                console.log(err);
                this.setState({status: 'error'});
            })
    }

    render(){
        return <>
            <div class="h-100 flex-grow-1">
                <div class="container py-3">
                    <Loading status={this.state.status}>
                        {this.state.lists.map(list => <List name={list.name} titles={list.titles} />)}
                    </Loading>
                </div>
            </div>
            <Footer />
        </>
    }

}

export default Browse;