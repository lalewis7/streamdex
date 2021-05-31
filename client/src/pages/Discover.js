import React from 'react';
import ReactDOM from 'react-dom';
import Title from '../comps/Title.js';

class Discover extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div class="bg-secondary flex-fill">
                <div class="container">
                    <div class="row py-4 pb-2">
                        <div class="col d-flex justify-content-center">
                        <Title id={this.props.match.params.id} hide_details={true}/>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-center g-0">
                        <div class="col-6 d-flex justify-content-center g-0" style={{"max-width": "383.99px"}}>
                            <button class="btn btn-primary w-100 m-2">Back</button>
                        </div>
                        <div class="col-6 d-flex justify-content-center g-0" style={{"max-width": "383.99px"}}>
                            <button class="btn btn-primary w-100 m-2">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Discover;