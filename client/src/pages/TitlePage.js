import React from 'react';
import ReactDOM from 'react-dom';
import Title from '../comps/Title.js';

class TitlePage extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div class="bg-secondary flex-fill">
                <div class="container">
                    <div class="row py-4">
                        <div class="col d-flex justify-content-center flex-grow-1">
                        <Title id={this.props.match.params.id} hide_details={false}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default TitlePage;