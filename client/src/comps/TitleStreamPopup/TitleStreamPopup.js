import React from 'react';
import './TitleStreamPopup.css';

const countryNames = require('../../util/countries.json');

class TitleStreamPopup extends React.Component {

    constructor(props) {
        super(props);

        this.getCountryName = this.getCountryName.bind(this);
    }

    getCountryName(code){
        for(let country of countryNames)
            if (country.code == code)
                return country.name;
    }

    render(){
        console.log(countryNames);
        console.log(this.props);
        return <div class="modal fade" id="title-stream-popup">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-main">
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col d-flex flex-row justify-content-between align-items-center">
                                    <div class="d-flex flex-row align-items-center">
                                        <img src={this.props.stream.icon} alt="..." class="stream-icon rounded-3"/>
                                        <h3 class="ps-2">{this.props.stream.title}</h3>
                                    </div>
                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                            </div>
                            <div class="row my-3">
                                <div class="col d-grid">
                                    <button type="button" class="btn btn-lg btn-outline-light">
                                        Watch Now!
                                    </button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <h5>Countries</h5>
                                </div>
                                <div class="col-12" id="countries-list">
                                    {this.props.stream.countries.map((country) => {
                                        return <div class="my-3">
                                            <img src={"flags/"+country.toLowerCase()+".png"} class="flag-icon rounded-2" />
                                            <span class="ms-2">{this.getCountryName(country)}</span>
                                            </div>;
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

}

export default TitleStreamPopup;