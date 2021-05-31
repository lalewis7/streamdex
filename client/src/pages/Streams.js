import React, { Profiler } from 'react';
import ReactDOM from 'react-dom';

import Settings from '../comps/Settings.js';
import Platforms from '../platforms.json';

class Streams extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
        Platforms.map(service => {
            this.state[service.id+"_enabled"] = localStorage.getItem(service.id+"_enabled") !== null ? localStorage.getItem(service.id+"_enabled") === 'true' : false;
        });
        this.streamPill = this.streamPill.bind(this);
        this.pillChanged = this.pillChanged.bind(this);
    }

    pillChanged(evt) {
        this.setState({[evt.target.name]: evt.target.checked});
        localStorage.setItem(evt.target.name, evt.target.checked);
    }

    streamPill(icon, name, id){
        return <li class="d-flex flex-row justify-content-between align-items-center p-2 border rounded-pill my-1">
                <div class="d-flex flex-row align-items-center">
                    <img class="rounded-circle" src={icon} style={{width: '40px', height: '40px'}}/>
                    <h5 class="m-0 ms-2">{name}</h5>
                </div>
                <label class="switch m-0">
                    <input type="checkbox" id={id+"_enabled"} name={id+"_enabled"} onChange={this.pillChanged} checked={this.state[id+"_enabled"]}/>
                    <span class="slider round"></span>
                </label>
            </li>
    }

    render(){
        var content = <div>
            <input type="text" placeholder="Search" class="form-control mb-2"/>
            <ul class="list-group">
                {Platforms.map(service => (
                    <div>{this.streamPill(service.icon, service.title, service.id)}</div>
                ))}
            </ul>
        </div>;
        return <Settings content={content}/>
    }

}

export default Streams;