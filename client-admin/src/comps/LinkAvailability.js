import React from 'react';
import isEqual from 'lodash/isEqual';
import {Collapse as BootstrapCollapse} from 'bootstrap';

import TextArray from '../TextArray.js';

const SVG = require('../svg.js');

class LinkAvailability extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            availability: []
        }
        this.collapseParentRef = React.createRef();
        this.updateContent = this.updateContent.bind(this);
        this.resetForms = this.resetForms.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.updateLinks = this.updateLinks.bind(this);
    }

    componentDidMount(){
        if (this.props.content)
            this.resetForms();
    }

    componentDidUpdate(prevProps, prevState){
        if (!isEqual(this.state, prevState))
            this.updateContent();
        if (!isEqual(this.props.content, prevProps.content) || (this.props.content && this.props.show !== prevProps.show)){
            this.resetForms();
        }
        if (!isEqual(this.props.links, prevProps.links))
            this.updateLinks();
    }

    updateContent(){
        let visibleAvailability = [];
        this.state.availability.map(available => {
            if (available.countries.length > 0)
                visibleAvailability.push(available);
        });
        this.props.updateContent({
            availability: visibleAvailability
        });
    }

    updateLinks(){
        let newAvailability = [...this.state.availability];
        newAvailability.map((available, i) => this.props.links.map(link => link.platform).indexOf(available.platform) === -1 ? newAvailability.splice(i, 1) : '');
        this.props.links.map(link => newAvailability.map(available => available.platform).indexOf(link.platform) === -1 ? newAvailability.push({platform: link.platform, countries: []}) : '');
        this.setState({availability: newAvailability}, () => this.updateContent());
    }

    resetForms(){
        this.setState({
            availability: [...this.props.content.availability]
        }, () => this.props.links ? this.updateLinks() : this.updateContent());
    }

    valueChange(link, index){
        let newValues = [...this.state.availability];
        newValues[index] = link;
        this.setState({availability: newValues});
    }

    render(){
        return <>
            <div class="accordion mt-3" ref={this.collapseParentRef}>
                {this.state.availability.map( (avail, i) => <Link avail={avail} parentRef={this.collapseParentRef} removeSelf={() => this.removeValue(i)} updateSelf={val => this.valueChange(val, i)} show={this.props.show} />)}
            </div>
        </>
    }

}

class Link extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            platform: '',
            countries: []
        }
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.collapseRef = React.createRef();
        this.headerRef = React.createRef();
    }

    componentDidMount(){
        this.setState({
            platform: this.props.avail.platform,
            countries: this.props.avail.countries
        });
        this.bsCollapse = new BootstrapCollapse(this.collapseRef.current, {parent: this.props.parentRef.current, toggle: false});
        this.collapseRef.current.addEventListener('show.bs.collapse', () => this.headerRef.current.classList.remove('collapsed'));
        this.collapseRef.current.addEventListener('hide.bs.collapse', () => this.headerRef.current.classList.add('collapsed'));
    }

    componentDidUpdate(prevProps, prevState) {
        if (!isEqual(this.props, prevProps))
            this.setState({
                platform: this.props.avail.platform,
                countries: this.props.avail.countries
            });
        if (!isEqual(this.state.countries, prevState.countries))
            this.props.updateSelf(this.state);
    }

    toggleCollapse(){
        this.bsCollapse.toggle();
    }

    render(){
        return <>
            <div class="accordion-item" key={this.props.platform}>
                <h2 class="accordion-header" >
                    <button class="accordion-button collapsed" type="button" ref={this.headerRef} onClick={() => this.toggleCollapse()}>
                        <span class="fw-bold">{this.state.platform}</span>
                    </button>
                </h2>
                <div class="accordion-collapse collapse" ref={this.collapseRef} >
                    <div class="p-3">
                        <div class="row">
                            <div class="col">
                                <h6>Countries</h6>
                            </div>
                        </div>
                        <TextArray values={this.state.countries} placeholder="US, CA, MX..." updateValues={vals => this.setState({countries: vals})} show={this.props.show} />
                    </div>
                </div>
            </div>
        </>
    }

}

export default LinkAvailability;