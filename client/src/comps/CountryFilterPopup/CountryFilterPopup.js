import React from 'react';
import './CountryFilterPopup.css';
import Modal from '../Modal/Modal.js';

const countryNames = require('../../util/countries.json');
const storage = require('../../util/storage.js');

class CountryFilterPopup extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            search: ''
        }

        this.search = this.search.bind(this);
        this.filter = this.filter.bind(this);
    }

    componentDidMount(){
        document.getElementById("country-filter-popup").addEventListener('show.bs.modal', (event) => {
            this.setState({search: ''});
        });
    }

    search(evt){
        this.setState({search: evt.target.value});
    }

    filter(country){
        if (storage.getFilterCountry() && storage.getFilterCountry().toLowerCase() === country.toLowerCase())
            storage.removeFilterCountry(); 
        else
            storage.setFilterCountry(country.toLowerCase());
        this.props.setVisible(false);
    }

    render(){
        let selectedCountry;
        if (storage.getFilterCountry())
            for (let country of countryNames)
                if (storage.getFilterCountry().toLowerCase() === country.code.toLowerCase()){
                    selectedCountry = country;
                    break;
                }
        
        return <>
            <Modal id="country-filter-popup" show={this.props.show} setVisible={this.props.setVisible}>
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content h-100">
                        <div class="modal-header">
                            <h3 class="ps-2 text-head">Filter Countries</h3>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body pt-1">
                            {selectedCountry ?  
                            <>
                            <div class="p-2 w-100 d-flex flex-row justify-content-start align-items-center">
                                <img src={"flags/"+selectedCountry.code.toLowerCase()+".png"} class="flag-icon rounded-2 m-1" />
                                <h4 class="m-0 ms-2">{selectedCountry.name}</h4>
                            </div>
                            <hr/>
                            </>
                            : <p>No Country selected.</p>}
                            <input class="form-control" type="search" placeholder="Search" value={this.state.search} onChange={this.search}/>
                            <ul class="d-flex flex-column p-0">
                                {countryNames.map((country) => {
                                    let filtered = '', selected = 'd-none';
                                    if (this.state.search && this.state.search.length > 0 && country.name.toLowerCase().indexOf(this.state.search.toLowerCase()) == -1)
                                        filtered = 'd-none';
                                    if (storage.getFilterCountry() && storage.getFilterCountry().toLowerCase() === country.code.toLowerCase())
                                        selected = '';
                                    return <li class={"d-flex flex-row justify-content-between rounded-3 align-items-center mt-2 settings-select " + filtered}>
                                                <button class="btn p-2 w-100 d-flex flex-row justify-content-between align-items-center" onClick={() => {this.filter(country.code)}}>
                                                    <div>
                                                        <img src={"flags/"+country.code.toLowerCase()+".png"} class="flag-icon rounded-2 m-1" />
                                                        <span class="ms-2 text-head">{country.name}</span>
                                                    </div>
                                                    <div class={selected}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                                        </svg>
                                                    </div>
                                                </button>
                                            </li>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    }

}

export default CountryFilterPopup;