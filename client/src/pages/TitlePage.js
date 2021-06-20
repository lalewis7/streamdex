import React from 'react';
import ReactDOM from 'react-dom';
import Title from '../comps/Title.js';

import Footer from '../comps/Footer.js';

class TitlePage extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <>
            <div class=" flex-fill">
                <div class="container">
                    <div class="row py-4">
                        <div class="col d-flex justify-content-center flex-grow-1">
                        <Title id={this.props.match.params.id} hide_details={false}/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            </>
        );
    }

}

export default TitlePage;