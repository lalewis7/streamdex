import React from 'react';
import './StreamSettings.css';

const Platforms = require('../../util/platforms.json');

class StreamSettings extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
        Platforms.map(service => {
            if (!this.props.user)
                this.state[service.id+"_enabled"] = localStorage.getItem(service.id+"_enabled") !== null ? localStorage.getItem(service.id+"_enabled") === 'true' : false;
            else
                this.state[service.id+"_enabled"] = this.props.user.streams.indexOf(service.id) != -1;
        });
        this.streamPill = this.streamPill.bind(this);
        this.pillChanged = this.pillChanged.bind(this);
    }

    pillChanged(evt) {
        let selectedStreams = [];
        for (let stream in this.state){
            if ((evt.target.checked && this.state[stream]) || (!evt.target.checked && this.state[stream] && stream !== evt.target.name))
                selectedStreams.push(stream.substring(0, stream.length-"_enabled".length));
        }
        if (evt.target.checked)
            selectedStreams.push(evt.target.name.substring(0, evt.target.name.length-"_enabled".length));
        
        this.setState({[evt.target.name]: evt.target.checked});
        if (!this.props.user)
            localStorage.setItem(evt.target.name, evt.target.checked);
        else
            fetch(process.env.REACT_APP_API+"users/"+this.props.user.id, 
            {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json', 'token': this.props.token },
                body: JSON.stringify({streams: selectedStreams})
            })
    }

    streamPill(icon, name, id){
        return <li>
            <label class="d-flex flex-row justify-content-between align-items-center p-2 rounded-3 my-1 settings-select stream-select-item">
                <div class="d-flex flex-row align-items-center">
                    <img class="rounded-circle" src={icon} style={{width: '40px', height: '40px'}}/>
                    <h5 class="m-0 ms-2 text-head">{name}</h5>
                </div>
                <div class="form-check me-2">
                    <input class="form-check-input" type="checkbox" id={id+"_enabled"} name={id+"_enabled"} onChange={this.pillChanged} checked={this.state[id+"_enabled"]}/>
                </div>
            </label>
            </li>
    }

    render(){
        return <>
            <div class="row">
                <div class="col pe-3">
                    <ul class="list-group list-unstyled">
                        {Platforms.map(service => (
                            <div>{this.streamPill(service.icon, service.title, service.id)}</div>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    }

}

export default StreamSettings;