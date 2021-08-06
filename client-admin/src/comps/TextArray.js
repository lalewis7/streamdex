import React from 'react';
import isEqual from 'lodash/isEqual';

const SVG = require('../svg.js');

class TextArray extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            values: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.addValue = this.addValue.bind(this);
        this.removeValue = this.removeValue.bind(this);
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    valueChange(evt, index){
        let newValues = [...this.state.values];
        newValues[index] = evt.target.value;
        this.setState({values: newValues});
    }

    addValue(){
        let newValues = [...this.state.values];
        newValues.push('');
        this.setState({values: newValues});
    }

    removeValue(index){
        let newValues = [...this.state.values];
        newValues.splice(index, 1);
        this.setState({values: newValues});
    }

    componentDidMount() {
        if (this.props.values)
            this.setState({ values: [...this.props.values] });
    }

    componentDidUpdate(prevProps, prevState){
        if (!isEqual(this.state.values, prevState.values))
            this.props.updateValues(this.state.values);
        if (!isEqual(this.props.values, prevProps.values))
            this.setState({ values: [...this.props.values] });
    }

    render(){

        const input = (value, index) => {
            return <>
                <div class="col-12 mb-1">
                    <div class="input-group">
                        <input type="text" class="form-control border-0 bg-highlight text-head text-input" value={value} placeholder={this.props.placeholder} onChange={evt => this.valueChange(evt, index)}/>
                        <button class="btn btn-secondary d-flex align-items-center" onClick={evt => this.removeValue(index)}>
                            <SVG.Trash w={'1em'} h={'1em'} />
                        </button>
                    </div>
                </div>
            </>
        }

        return <>
            <div class="row mb-3">
                {this.state.values.map((val, i) => input(val, i))}
                <div class="col-12 d-grid">
                    <button type="button" class="btn btn-secondary" onClick={this.addValue}>
                        <SVG.Plus w=".9em" h=".9em" />
                    </button>
                </div>
            </div>
        </>
    }

}

export default TextArray;