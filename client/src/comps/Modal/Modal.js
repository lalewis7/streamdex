import React from 'react';
import {Modal as BootstrapModal} from 'bootstrap';

class Modal extends React.PureComponent {

    componentDidMount(){
        this.modal = new BootstrapModal(document.getElementById(this.props.id), {keyboard: false});
        document.getElementById(this.props.id).addEventListener('hidden.bs.modal', (event) => {
            this.props.setVisible(false);
        });
    }

    componentDidUpdate(prevProps){
        if (this.props.show === prevProps.show)
            return;
        if (this.props.show)
            this.modal.show();
        else
            setTimeout(() => {this.modal.hide()}, 100); // TODO: There has to be a better way to do this. Look into Framer Motion and don't use bs fade
    }

    render(){
        return <>
            <div class="modal fade" id={this.props.id}>
                {this.props.children}
            </div>
        </>
    }

}

export default Modal;