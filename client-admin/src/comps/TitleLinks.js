import React from 'react';
import isEqual from 'lodash/isEqual';

const SVG = require('../svg.js');

class TitleLinks extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            links: []
        }
        this.updateContent = this.updateContent.bind(this);
        this.resetForms = this.resetForms.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.addValue = this.addValue.bind(this);
        this.removeValue = this.removeValue.bind(this);
    }

    componentDidMount(){
        if (this.props.content)
            this.resetForms();
        else
            this.updateContent();
    }

    componentDidUpdate(prevProps, prevState){
        if (!isEqual(this.state, prevState))
            this.updateContent();
        if (!isEqual(this.props.content, prevProps.content) || (this.props.content && this.props.show !== prevProps.show))
            this.resetForms();
    }

    updateContent(){
        this.props.updateContent({
            links: this.state.links
        });
    }

    resetForms(){
        this.setState({
            links: this.props.content.links
        }, () => this.updateContent());
    }

    valueChange(link, index){
        let newValues = [...this.state.links];
        newValues[index] = link;
        this.setState({links: newValues});
    }

    addValue(){
        let newValues = [...this.state.links];
        newValues.push({platform: '', link: ''});
        this.setState({links: newValues});
    }

    removeValue(index){
        let newValues = [...this.state.links];
        newValues.splice(index, 1);
        this.setState({links: newValues});
    }

    render(){
        return <>
            <div class="row mt-3">
                {this.state.links.map((link, i) => <Link link={link} removeSelf={() => this.removeValue(i)} updateSelf={val => this.valueChange(val, i)} />)}
                <div class="col-12 d-grid">
                    <button type="button" class="btn btn-secondary" onClick={this.addValue}>
                        <SVG.Plus w=".9em" h=".9em" />
                    </button>
                </div>
            </div>
        </>
    }

}

class Link extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            platform: '',
            link: ''
        }
    }

    componentDidMount(){
        this.setState({
            platform: this.props.link.platform,
            link: this.props.link.link
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (!isEqual(this.props, prevProps))
            this.setState({
                platform: this.props.link.platform,
                link: this.props.link.link
            });
        if (this.state.platform !== prevState.platform || this.state.link !== prevState.link)
            this.props.updateSelf(this.state);
    }

    render(){
        return <>
            <div class="col-12 mb-1">
                <div class="input-group">
                    <span class="input-group-text">
                        <SVG.StreamingService w={'1em'} h={'1em'} />
                    </span>
                    <input type="text" class="form-control" value={this.state.platform} placeholder="Streaming Serivce" onChange={evt => this.setState({platform: evt.target.value})}/>
                    <span class="input-group-text p-1">
                        <SVG.Link w={'1.2em'} h={'1.2em'} />
                    </span>
                    <input type="text" class="form-control" value={this.state.link} placeholder="Link" onChange={evt => this.setState({link: evt.target.value})}/>
                    <button type="button" class="btn btn-secondary d-flex align-items-center" onClick={evt => this.props.removeSelf()}>
                        <SVG.Trash w={'1em'} h={'1em'} />
                    </button>
                </div>
            </div>
        </>
    }

}

export default TitleLinks;