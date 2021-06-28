import React from 'react';
import './CountryFilterPopup.css';

const countryNames = require('../../util/countries.json');

class CountryFilterPopup extends React.Component {

    constructor(props){
        super(props);

        this.search = this.search.bind(this);
    }

    search(text){

    }

    render(){
        return <>
            <div class="modal fade" id="country-filter-popup">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content bg-main">
                        <div class="modal-body">
                            <div class="container-fluid">
                                <div class="row mb-3">
                                    <div class="col d-flex flex-row justify-content-between align-items-center">
                                        <h3 class="ps-2">Filter Countries</h3>
                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">

                                    </div>
                                    <div class="col-12" id="countries-filter-list">
                                        {countryNames.map((country) => {
                                            return  <li class="d-flex flex-row justify-content-between align-items-center stream-filter-item">
                                                        <label class="">
                                                            <img src={"flags/"+country.code.toLowerCase()+".png"} class="flag-icon rounded-2 m-2" />
                                                            <span class="">{country.name}</span>
                                                        </label>
                                                        <input class="form-check-input m-3" type="checkbox" />
                                                    </li>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

}

export default CountryFilterPopup;