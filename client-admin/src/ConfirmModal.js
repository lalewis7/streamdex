import React from 'react';

import Modal from './Modal.js';

class ConfirmModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
        }
    }

    render(){
        return <>
            <Modal show={this.props.show} id={this.props.id} setVisible={this.props.setVisible}>
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{this.props.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{this.props.cancelText}</button>
                            <button type="button" class="btn btn-primary" onClick={() => {this.props.confirm()}}>{this.props.confirmText}</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    }

}

export default ConfirmModal;