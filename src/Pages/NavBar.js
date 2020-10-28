import React, {useContext, useState,lazy,Suspense} from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import {loginContext, userDetailsContext, disputeContext, memberSettlementContext} from "./service/Contexts";
import { Icon } from 'react-icons-kit';
import {plusCircle,userPlus,trashO,group,comments,user} from 'react-icons-kit/fa/'
import {useWindowSize} from "./service/useWindowSize";
import LoaderScreen from "./Model/LoaderScreen";



const ModalsForm = lazy(()=>import('./Model/CreateGroupModel'));
const AddMemberToGroup = lazy(()=>import('./Model/AddMemberToGroup'));
const AlertModal =lazy(()=>import('./Model/AlertModal'));
const DeletingModal =lazy(()=>import('./Model/DeletingModal'));
const ProfileManagementModal = lazy(()=>import('./Model/ProfileManagementModal'));
const NavBar =(props)=>{
    const cookiesData = useContext(loginContext);
    const userContext = useContext(userDetailsContext);
    const fetchDisputeContext = useContext(disputeContext);
    const memberSettlement = useContext(memberSettlementContext);
    const selectedUser = typeof userContext.userData.userDetails.fullName !=='undefined'?userContext.userData.userDetails:{fullName:"np"};
    const [modalShow, setModalShow] = useState({modalsForm:false,addMemberModal:false,alertPopUp:false,deleteModal:false,deleteType:null,editProfile:false});
    const windowSize = useWindowSize();

    const handleSelectedGroup=(selectedGroup)=>{
        sessionStorage.setItem("groupName",selectedGroup.groupName);
        sessionStorage.setItem("createdBy",selectedGroup.createdBy);
          // props.callBackFunction();
         // props.mainProps.history.push("/")
        callBackFetchingInformation();
    };

    const callBackFetchingInformation =()=>{

        memberSettlement.dispatch({type:"ADD",payload:cookiesData.stateData.jwt});
        console.log("asd",memberSettlement)
    };
    const handleLogout = ()=>{
        cookiesData.dispatch({type:'Logout'})
        props.mainProps.history.push("/SplitExpenses/");
    };

    return(
        <div>
            <ReactBootstrap.Navbar fixed="top"  collapseOnSelect expand="lg" variant="light">
                <ReactBootstrap.Navbar.Brand href="#home"><img className="logo-img" src={require('../img/logo2.png')} width="75px" height="75px"></img>Split Expenses</ReactBootstrap.Navbar.Brand>
                <ReactBootstrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <ReactBootstrap.Navbar.Collapse id="responsive-navbar-nav">
                    <ReactBootstrap.Nav className="mr-auto">

                        {/* -------Left side of navBar---------- */}
                        <ReactBootstrap.Nav.Link href="/home">Home</ReactBootstrap.Nav.Link>

                        <ReactBootstrap.NavDropdown title="Groups" id="collasible-nav-dropdown" >
                            {
                                userContext.userData.groupList.map((groups,index)=>{
                                    return <ReactBootstrap.NavDropdown.Item  active={false} onClick={()=>{handleSelectedGroup(groups)}} key={index}>

                                        <Icon icon={group} ></Icon> {groups.groupName}</ReactBootstrap.NavDropdown.Item>
                                })
                            }
                        </ReactBootstrap.NavDropdown>

                        <ReactBootstrap.NavDropdown title="Manage Group" id="collasible-nav-dropdown">
                            <ReactBootstrap.NavDropdown.Item href="#"  onClick={()=>{setModalShow({...modalShow,modalsForm:true})}}> <Icon icon={plusCircle}></Icon> Create Group</ReactBootstrap.NavDropdown.Item>
                            <ReactBootstrap.NavDropdown.Item href="#" onClick={()=>{setModalShow({...modalShow,deleteModal:true,deleteType:"group"})}}> <Icon icon={trashO}></Icon> Delete Group </ReactBootstrap.NavDropdown.Item>
                            <ReactBootstrap.Dropdown.Divider />
                            <ReactBootstrap.NavDropdown.Item href="#1"   onClick={()=>{setModalShow({...modalShow,addMemberModal:true})}}> <Icon icon={userPlus}></Icon>  Add Member </ReactBootstrap.NavDropdown.Item>
                            {parseInt(sessionStorage.getItem("createdBy")) === selectedUser.id && <ReactBootstrap.NavDropdown.Item href="#2" onClick={()=>{setModalShow({...modalShow,deleteModal:true,deleteType:"Member"})}} > <Icon icon={trashO}></Icon> Delete Member</ReactBootstrap.NavDropdown.Item>}
                        </ReactBootstrap.NavDropdown>

                        <ReactBootstrap.Nav.Link  href="/upload" >Upload Bill</ReactBootstrap.Nav.Link>
                    </ReactBootstrap.Nav>

                    {/* -------Right side of navBar---------- */}
                        <div className="dispute" data-toggle="tooltip" data-placement="bottom"  title="Disputes">
                        <a href="#" className={!props.isDisputeDisplay ? 'isDisabled':""}  onClick={props.loadDispute} >
                          { windowSize.width >768?<Icon icon={comments} size={30}/> :"Disputes"}
                            {fetchDisputeContext.disputeData.disputeArray.length !==0 &&<sup><span className="badge badge-pill badge-danger">{fetchDisputeContext.disputeData.disputeArray.length }</span></sup>}</a>
                        </div>

                        <ReactBootstrap.Nav>
                            <ReactBootstrap.NavDropdown   title={windowSize.width >768?<Icon className="navIcon" icon={user} size={30} style={{color:"#28a745"}}/>:selectedUser.fullName} id="collasible-nav-dropdown " alignRight>
                                <ReactBootstrap.NavDropdown.Item onClick={()=>setModalShow({...modalShow,editProfile:true})}>Edit Profile</ReactBootstrap.NavDropdown.Item>
                                <ReactBootstrap.NavDropdown.Item href="#" onClick={()=>setModalShow({...modalShow,alertPopUp:true})}>Log Out</ReactBootstrap.NavDropdown.Item>
                            </ReactBootstrap.NavDropdown>
                        </ReactBootstrap.Nav>
                </ReactBootstrap.Navbar.Collapse>
            </ReactBootstrap.Navbar>
            {modalShow.modalsForm? <Suspense fallback={<LoaderScreen/>}><ModalsForm callBack={callBackFetchingInformation} jwt={cookiesData.stateData.jwt} show={modalShow.modalsForm} toBeClosed={true} userName={selectedUser.fullName} hide={()=>{setModalShow({...modalShow,modalsForm:false})}}/></Suspense>:null}
            {modalShow.addMemberModal?<Suspense fallback={<LoaderScreen/>}><AddMemberToGroup callBack={callBackFetchingInformation} jwt={cookiesData.stateData.jwt} show={modalShow.addMemberModal} hide={()=>{setModalShow({...modalShow,addMemberModal:false})}} /></Suspense>:null}
                {modalShow.alertPopUp &&<Suspense fallback={<LoaderScreen/>}><AlertModal show={modalShow.alertPopUp} hide={()=>{setModalShow({...modalShow,alertPopUp:false})}} callBack={handleLogout} message={"Do you wanna logout?"} /></Suspense>}
                {modalShow.deleteModal &&<Suspense fallback={<LoaderScreen/>}> <DeletingModal show={modalShow.deleteModal} jwt={cookiesData.stateData.jwt} hide={()=>{setModalShow({...modalShow,deleteModal:false,deleteType:null})}} callBack={callBackFetchingInformation} groups={userContext.userData.groupList} user={userContext.userData.userDetails} selectedType={modalShow.deleteType}/></Suspense>}
                {modalShow.editProfile &&<Suspense fallback={<LoaderScreen/>}> <ProfileManagementModal show={modalShow.editProfile} hide={()=>setModalShow({...modalShow,editProfile:false})} jwt={cookiesData.stateData.jwt}/></Suspense>}
        </div>
    );

};

 export default NavBar;
