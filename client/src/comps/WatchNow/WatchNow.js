import React from 'react';
import './WatchNow.css';

const Platforms = require('../../util/platforms.json');
const storage = require('../../util/storage.js');
const SVG = require('../../util/svg.js');

class WatchNow extends React.Component {

    render(){

        let links = [];

        const streamIcon = (link, platform) => {
            return <>
            <button type="button" class="btn p-0 m-2" onClick={() => {this.props.openStream(link.platform)}}>
                <img src={platform.icon} alt="..." class="stream-icon rounded-3"/>
            </button>
            </>
        }

        const noLinks = <>
            <p class="p-3">No streaming services are currently offering this title.</p>
        </>

        this.props.availability.map(available => {
            if (storage.getFilterCountry())
                for (let link of this.props.links)
                    if (available.platform === link.platform && available.countries.indexOf(storage.getFilterCountry().toUpperCase()) == -1)
                        return;
            for (let platform of Platforms){
                if (platform.id == available.platform){
                    links.push(streamIcon(available, platform));
                    return;
                }
            }
        })

        return <>
            <div class="row my-3">
                <div class="col">
                    <div class="d-flex flex-row justify-content-between align-items-top">
                        <h5 class="fw-bold">WHERE TO WATCH</h5>
                        <button type="button" class="btn p-1 pt-0 shadow-none filter-streams-button" onClick={() => {this.props.openFilter()}}>
                            <span class="fw-bold pe-1 h6 m-0">FILTER</span>
                            <SVG.FilterFunnelFill w={24} h={24} />
                        </button>
                    </div>
                    <div class="pedestal">
                        {links.length > 0 ? links : noLinks}
                    </div>
                </div>
            </div>
        </>
    }

}

export default WatchNow;