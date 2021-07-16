import React from 'react';
import './TitleStreamPopup.css';
import Modal from '../Modal/Modal.js';

const countryNames = require('../../util/countries.json');

const SVG = require('../../util/svg.js');

class TitleStreamPopup extends React.Component {

    constructor(props) {
        super(props);

        this.getCountryName = this.getCountryName.bind(this);
    }

    getCountryName(code){
        for(let country of countryNames)
            if (country.code === code)
                return country.name;
    }

    render(){
        return <>
            <Modal id="title-stream-popup" show={this.props.show} setVisible={this.props.setVisible}>
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content bg-main">
                        <div class="modal-header flex-column align-items-stretch">
                            <div class="d-flex flex-row justify-content-between mb-3">
                                <div class="d-flex flex-row align-items-center">
                                    <img src={this.props.stream.icon} alt="..." class="stream-icon rounded-3"/>
                                    <h3 class="ps-2">{this.props.stream.title}</h3>
                                </div>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <a type="button" href={this.props.stream.link} class="btn btn-primary btn-lg text-head border-0 bg-highlight3 submit-btn">
                                <SVG.PlayCircle w={'2rem'} h={'2rem'} />
                            </a>
                        </div>
                        <div class="modal-body pt-0">
                            <h5>Countries</h5>
                            {this.props.stream.countries.map((country) => {
                                return <div class="my-3">
                                        <img src={"/flags/"+country.toLowerCase()+".png"} class="flag-icon rounded-2" />
                                        <span class="ms-2">{this.getCountryName(country)}</span>
                                    </div>;
                            })}
                        </div>
                    </div>
                </div>
            </Modal>
            </>
    }

}

export default TitleStreamPopup;