import React from 'react';
import {Modal} from "react-bootstrap";

const LoaderScreen =()=>{
    return(
        <Modal show={true} centered dialogClassName="Loader">
            <div className="justify-content-center row" >
                <div className="spinner-border"  role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="col-12 d-flex justify-content-center">
                    <h4>Loading... </h4>
                </div>
            </div>
        </Modal>
    );
};

export default LoaderScreen;
