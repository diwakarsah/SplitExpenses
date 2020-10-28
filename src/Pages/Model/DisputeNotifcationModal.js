import React from 'react';
import Modal from 'react-bootstrap/Modal';

export function DisputeNotifcationModal (props){

    return (
        <Modal show={props.show} centered  onHide={props.hide}  >
            <Modal.Header closeButton>
                <Modal.Title className="txt-color "> Dispute Notification </Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <h4 className="text-danger"> You have dispute on these bills</h4>
                    <p>For the more detail click on upper right discussion icon</p>
                    {props.dispute.disputeArray.length !== 0 && props.dispute.disputeArray.map((dispute,index) =>{
                        return (<ul key={index}>
                            <li className="cust-dispute-li">Id : {dispute.billingDetails.transId}</li>
                           <li >Description: {dispute.billingDetails.description}</li>
                        </ul>)
                    })}

                </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={props.hide}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}
export default DisputeNotifcationModal;

