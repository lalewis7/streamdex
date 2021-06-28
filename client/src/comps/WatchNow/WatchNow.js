import React from 'react';
import './WatchNow.css';
import * as bootstrap from 'bootstrap';

const Platforms = require('../../util/platforms.json');

class WatchNow extends React.Component {

    constructor(props) {
        super(props);

        this.openFilter = this.openFilter.bind(this);
    }

    componentDidMount(){
        this.filterModal = new bootstrap.Modal(document.getElementById("country-filter-popup"), {keyboard: false});
    }

    openFilter(){
        this.filterModal.show();
    }

    render(){
        return <>
            <div class="row my-3">
                <div class="col">
                    <div class="d-flex flex-row justify-content-between align-items-top">
                        <h5 class="text-head2 fw-bold">WHERE TO WATCH</h5>
                        <button type="button" class="btn p-1 pt-0 shadow-none filter-streams-button text-head2" onClick={() => {this.openFilter()}}>
                            <span class="fw-bold pe-1">FILTER</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-funnel-fill" viewBox="0 0 16 16">
                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="bg-highlight">
                        {this.props.links.map(link => {
                            for (let platform of Platforms){
                                if (platform.id == link.platform){
                                    return <button type="button" class="btn p-0 m-2" onClick={() => {this.props.openStream(link.platform)}}>
                                        <img src={platform.icon} alt="..." class="stream-icon rounded-3"/>
                                        </button>
                                }
                            }
                        })}
                    </div>
                </div>
            </div>
        </>
    }

}

export default WatchNow;