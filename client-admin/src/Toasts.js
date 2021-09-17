import React from 'react';
import {Toast as BootstrapToast} from 'bootstrap';

class Toasts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toasts: []
        }
        this.idx = 0;
        this.addMessage = this.addMessage.bind(this);
        this.addMessageListener = this.addMessageListener.bind(this);
    }

    componentDidMount(){
        if (this.props.message)
            this.addMessage();
    }

    componentDidUpdate(prevProps, prevState){
        if (this.props.counter > prevProps.counter){
            this.addMessage();
        }
        else if (this.state.toasts.length > prevState.toasts.length) {
            this.addMessageListener(this.props.id+"_"+this.idx);
        }
    }

    addMessage(){
        if (this.props.message){
            const toast = {
                msg: this.props.message,
                id: this.props.id+"_"+(++this.idx),
            };
            let toasts = [...this.state.toasts];
            toasts.push(toast);
            this.setState({toasts: toasts});
        }
    }

    addMessageListener(id){
        const toastDOM = document.getElementById(id);
        const toast = new BootstrapToast(toastDOM);
        toast.show();
        toastDOM.addEventListener('hidden.bs.toast', (event) => {
            let toasts = [...this.state.toasts];
            let index = toasts.map(t => t.id).indexOf(id);
            if (index > -1){
                toasts.splice(index, 1);
                this.setState({toasts: toasts});
            }
        });
    }

    render(){
        return <>
            <div class="toast-container">
                {this.state.toasts.map(toast => 
                    <div class="toast align-items-center" role="alert" aria-live="assertive" data-bs-delay="5000" data-bs-autohide="true" aria-atomic="true" key={toast.id} id={toast.id}>
                        <div class="d-flex">
                            <div class="toast-body align-item-center lh-1">
                                {toast.msg}
                            </div>
                            <button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                )}
            </div>
        </>
    }

}

export default Toasts;