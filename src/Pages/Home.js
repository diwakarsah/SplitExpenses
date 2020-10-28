import React, {useState,useEffect} from 'react';
import * as ReactBootstrap from 'react-bootstrap';

import { Icon } from 'react-icons-kit';
import {ic_receipt,ic_find_in_page,ic_share} from 'react-icons-kit/md/';
import {calculator} from 'react-icons-kit/fa/calculator'
const Home = ()=>{
    let listner ="";
    const [status,setStatus]=useState("");

    useEffect(()=>{
        listner = document.addEventListener("scroll", e => {
            let scrolled = document.scrollingElement.scrollTop;
            if (scrolled >= 500) {
                if (status !== "bottom") {
                    setStatus("bottom");
                }
            } else {
                if (status !== "top") {
                   setStatus("top");
                }
            }
            // console.log("size",scrolled)
        });

    },[]);

    return (
        <div className="homePage">

            <ReactBootstrap.Navbar fixed="top" collapseOnSelect expand="lg" variant="light" id="mainNav" className={status === "bottom"&&"navbar-scrolled"}>
                <div className="container">
                <ReactBootstrap.Navbar.Brand href="#home"><img className="logo-img" src={require('../img/logo2.png')} width="85px" height="85px"></img>Split Expenses</ReactBootstrap.Navbar.Brand>
                <ReactBootstrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <ReactBootstrap.Navbar.Collapse id="responsive-navbar-nav">
                    <ReactBootstrap.Nav className="mr-auto">
                        {/*<ReactBootstrap.Nav.Link href="#features">Features</ReactBootstrap.Nav.Link>*/}
                        {/*<ReactBootstrap.Nav.Link href="#pricing">Pricing</ReactBootstrap.Nav.Link>*/}
                    </ReactBootstrap.Nav>
                    <ReactBootstrap.Nav>
                        <ReactBootstrap.Nav.Link href="#deets">About</ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="#">Services</ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="/signup">Register</ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link href="/login">Login</ReactBootstrap.Nav.Link>
                    </ReactBootstrap.Nav>
                </ReactBootstrap.Navbar.Collapse>
                </div>
            </ReactBootstrap.Navbar>

            {/*Masthead*/}
            <header className="masthead">
                <div className="container h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-10 align-self-end">
                            <h1 className="text-uppercase text-white font-weight-bold">Divide your bills</h1>
                            <hr className="divider my-4 " />
                        </div>
                        <div className="col-lg-8 align-self-baseline">
                            <p className="text-white-75 font-weight-light mb-5">Split bills using Bill Splitter. Built with ergonomic design and robust integrity that handle your bills and finance with the accuracy that goes to the dot and reliability that goes on until you do.</p>
                            <a className="btn btn-primary btn-xl js-scroll-trigger" href="#about">Get Started >>></a>
                        </div>
                    </div>
                </div>
            </header>

            {/*Services section*/}
            <section className="page-section bg-white" id="services">
                <div className="container">
                    <h2 className="text-center mt-0">At Your Service</h2>
                    <hr className="divider my-4" />
                    <div className="row">
                        <div className="col-lg-3 col-md-6 text-center">
                            <div className="mt-5">
                                <Icon icon={ic_find_in_page} size={80} style={{color:"#28a745"}}/>
                                <h3 className="h4 mb-2">Scan Bills</h3>
                                <p className="text-muted mb-0">Directly scan your bills from your phone to separate bill items with ease..</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                            <div className="mt-5">
                                <Icon icon={ic_receipt} size={80} style={{color:"#28a745"}}/>
                                <h3 className="h4 mb-2">Split Bills</h3>
                                <p className="text-muted mb-0">Divide your bills among your mates and create groups for segmentation.</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 text-center">
                            <div className="mt-5">
                                <Icon icon={ic_share} size={80} style={{color:"#28a745"}}/>
                                <h3 className="h4 mb-2 ">Share split amount</h3>
                                <p className="text-muted mb-0">Share the separated bill amounts with the group members individually via email.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                            <div className="mt-5">
                                <img width="80px" height="80px" src={require('../img/conflict.png')}/>
                                <h3 className="h4 mb-2 mt-2">Manage Conflict</h3>
                                <p className="text-muted mb-0">Ease of mind with managing bill conflicts by allowing users to store bill history and edit items and bill splitting as necessary. </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*About section*/}
            <section className="page-section bg-primary" id="about">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h2 className="text-white mt-0">We've got what you need!</h2>
                            <hr className="divider light my-4" />
                            <p className="text-white mb-4">Whether it is your housemates, or your friends in a restaurant, splitting bills have never been this easy. With Split Expenses, you can
                                add bill members as required and separate each items for dedicated users. Create an account to get started now. Split Expenses will always
                                tell you your share of the bill. Welcome to Split, your bill calculator.</p>
                            <a className="btn btn-light btn-xl js-scroll-trigger" href="/Login">Get Started!</a>
                        </div>
                    </div>
                </div>
            </section>




            <footer className="bg-footer py-5">
                <div className="container">
                    <div className="small text-center">Copyright © 2020 - Split Expenses Team</div>
                </div>
            </footer>
        </div>
    );
};
export default Home;
