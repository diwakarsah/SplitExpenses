import React, {useContext, useEffect, useState,lazy,Suspense} from 'react'
import {
    loginContext,
    userDetailsContext,
    memberSettlementContext,
    disputeContext,
} from "./service/Contexts";
import NavBar from "./NavBar"
import {RequestHandler} from "./service/RequestHandler";
import NewAddedBillList from './billingDetailList';
import * as ReactBootstrap from 'react-bootstrap';
import { Icon } from 'react-icons-kit';
import {plus,calculator,search,gear,mailReplyAll} from 'react-icons-kit/fa/'
import Footer from "./Footer";
import DisplayGroupModal from "./Model/DisplayGroupModal";
import CreateGroupModel from "./Model/CreateGroupModel";
import SettlementListDisplay from "./SettlementListDisplay";
import {Link} from "react-router-dom";
import {LightTooltip} from "./service/CustomTooltip";
import DisputeNotifcationModal from "./Model/DisputeNotifcationModal";
import {ReduceSettlementList} from "./service/ReduceSettlementList";
import LoaderScreen from "./Model/LoaderScreen";

const BillEntryForm =lazy(()=>import('./Model/BillEntryModel'));
const FinalSettlement =lazy(()=>import('./Model/DisplaySettlementModal'));
const DisputeModal =lazy(()=>import('./Model/AddDisputeModal'));
const DisputePage = lazy(()=>import('./Dispute'));

function LoginLanding(props) {
    let todayDate = new Date();

    const cookiesData = useContext(loginContext);
    const userContext = useContext(userDetailsContext);
    const memberSettlement = useContext(memberSettlementContext);
    const fetchDisputeContext = useContext(disputeContext);

    const [isLoading,setLoading] = useState({mainBody:true,disputePage:false});
    const  [groupName,setGroupName]=useState("");
    const [user,setUser]=useState("");
    const [billingList,setBillingList] = useState([]);
    const [settlementList,setSettlementList] = useState({});
    const [groupList,setGroupList] = useState([]);
    const jwt=cookiesData.stateData.jwt;
    const [displayModals,setDisplayModals]=useState({"addingBillingModal":false,"creatingGroupModal":true,"disputeModal":false});
    const [groupMembers,setGroupMembers]= useState([]);
    const [checkChanges,setChanges]= useState(false);
    const [finalSettlement,setFinalSettlement]=useState({"value":null,isModalShown:false});
    const [selectedEditedBill,setSelectedEditedBill] = useState(null);
    const [searchedDate,setSearchedDate]= useState("");
    const [ filteredSettlements,setFilteredSettlements] = useState({});
    const [dispute,setDispute] = useState({status:false});


    const callBackAddBillingList = ()=>{
        setChanges(!checkChanges);
    };

    const callBackFetchingInformation =()=>{

        memberSettlement.dispatch({type:"ADD",payload:jwt});
    };

    const editBillList=(bill)=>{
        setSelectedEditedBill(bill);
        setDisplayModals({...displayModals,addingBillingModal:true});

    };

    const handleDispute=(bill)=>{
        setSelectedEditedBill(bill);
        setDisplayModals({...displayModals,disputeModal:true});
    };

    const handleSearchFilter = ()=>{

        setFilteredSettlements(Object.entries(settlementList).reduce((acc,cur) => {

            if (cur[0].includes( searchedDate))
            {
                acc[cur[0]] = cur[1];
            }
            return acc;
        },{}))};

    const handleSettlement = ()=>{
        RequestHandler('/calculate',groupName + "/" + user.id ,'get',jwt).then(result=>{
            if(typeof result.ok !== "undefined" &&  !result.ok)
            {
                setFinalSettlement({value:"Error While performing settlement.Please try again!!",isModalShown:true});
            }
            else {
                setFinalSettlement({value:result,isModalShown:true});
            }
        });
    };
    const fetchBillInfo=(newGroupName)=>{
        RequestHandler('/getBillList',newGroupName,'get',jwt).then(result=>{
            setBillingList(result);
        });
    };


    useEffect(()=>{
        if (searchedDate !=="")
        {
            handleSearchFilter();
        }
        if(groupName !=="" && searchedDate ==="")
        {
            fetchBillInfo(groupName);
        }
    },[searchedDate,checkChanges]);


    useEffect(()=>{

        if ( typeof userContext.userData.userDetails.fullName !=="undefined" )
        {
           if (isLoading.mainBody)
           {
               setUser(userContext.userData.userDetails);
               setGroupList(userContext.userData.groupList);
               setLoading({...isLoading,mainBody:false});
               console.log("userajsdh",userContext.userData);
           }
            if(sessionStorage.getItem("groupName") !== null && sessionStorage.getItem("IsMemberFetched") === "false") {
                memberSettlement.fetchData.then(e => {
                    console.log("E", e);
                    fetchBillInfo(sessionStorage.getItem("groupName"));
                    setGroupMembers(e.groupMemberList);
                    const reduceSettlement = ReduceSettlementList(e.settlementList);
                    setSettlementList(reduceSettlement);
                    setGroupName(sessionStorage.getItem("groupName"));
                    sessionStorage.setItem("IsMemberFetched","true");
                });
            }
        }
    },[userContext.userData,sessionStorage.getItem("groupName"),memberSettlement]);


    return(<div>
        <header>
            <NavBar
                mainProps={props}
                loadDispute={()=>setLoading({...isLoading,disputePage: true})}
                isDisputeDisplay={true}
                callBack = {callBackFetchingInformation}
            />
        </header>
        {isLoading.mainBody ?
            <LoaderScreen/> :
            <div className="container-fluid cus-padding" style={{overflow: "auto"}}>
                <section className="row">
                    <div className=" col hide-container">
                        <article>
                            <span>
                                <h4 className="cus-color">Hey {user.fullName} !!</h4>
                            </span>
                            <span className="d-inline cus-color">TODAY: {todayDate.toDateString()}</span>
                        </article>
                    </div>
                    <div className="col  cus-color">
                        <LightTooltip placement="top"  title="Your Group Name. Click to see the members">
                        <h4 className="row cus-memberName-dropDown justify-content-center">
                              <ReactBootstrap.NavDropdown
                                  title={sessionStorage.getItem("groupName")? sessionStorage.getItem("groupName"):"Group Name"}
                                  id="collasible-nav-dropdown dropdown-menu-align-right">
                                  {groupMembers.map((memberName,index)=>
                                  {return <ReactBootstrap.NavDropdown.Item active={false}  key={index}>
                                                {memberName.fullName}
                                            </ReactBootstrap.NavDropdown.Item>})}
                             </ReactBootstrap.NavDropdown>
                        </h4>
                        </LightTooltip>
                    </div>
                    <div className="col">
                        <button className="btn btn-success cus-btn" onClick={() => {
                            setDisplayModals({...displayModals, addingBillingModal: true});
                            setSelectedEditedBill(null);
                        }} style={{float: "right"}}><Icon icon={plus}></Icon> Add New Bills
                        </button>


                    </div>
                </section>

                <div className="row">
                    <div className="col-lg-6 col-md-6  ">
                        <div className="card border-left-primary shadow  py-2 ">
                            <div className="card-header ">
                                <div className="row ">
                                    <h4 className="col-md-8 col-lg-9 col-sm-9 col-7"> Latest Invoices</h4>
                                   <div className="col-md-4 col-lg-3 col-sm-3 col-5 justify-content-end d-flex" >
                                    <button className="btn btn-success cus-btn col-md-10 col-lg-10 col-sm-10 col-10"
                                            disabled={billingList.length === 0}
                                            onClick={handleSettlement}>
                                        <Icon icon={calculator}></Icon> Settle
                                    </button>
                                   </div>
                                </div>
                            </div>
                            <div className={`card-body ${billingList.length ===0 &&'align-items-center d-flex justify-content-center'}`} style={{overflow: "scroll"}}>
                                <NewAddedBillList
                                    props={billingList}
                                    user={user}
                                    addBilling={callBackAddBillingList}
                                    callBackEdit={editBillList}
                                    jwt={jwt}
                                    handleDispute={handleDispute}
                                    dispute = {fetchDisputeContext.disputeData}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6  ">
                        <div className="card border-left-primary shadow py-2 cus-card ">
                        {!isLoading.disputePage ?<> <div className="card-header ">
                                <div className="row" style={{marginBottom:"-18px"}}>
                                    <h4 className="col-md-8 col-lg-8 col-sm-7"> Previous Settlement</h4>
                                    <form className="form-inline col-md-4 col-lg-4 col-sm-5 cus-search-bar ">
                                        <LightTooltip placement="top"  title="Please enter the date or date range ">
                                        <div className="input-group mb-3">
                                            <input type="text"
                                                   className="form-control cus-border"
                                                   value={searchedDate}
                                                   onChange={(event => {setSearchedDate(event.target.value);
                                                   })} placeholder="Search..."/>
                                            <div className="input-group-append">
                                                <button type="button" className="btn btn-success" onClick={event =>  handleSearchFilter}><Icon icon={search}></Icon></button>
                                            </div>

                                        </div>
                                        </LightTooltip>
                                    </form>
                                </div>

                            </div>
                            <div className="card-body"  style={{overflow: "scroll"}}>
                                <SettlementListDisplay
                                    settlementList={Object.keys(filteredSettlements).length === 0 && searchedDate===""?settlementList:filteredSettlements}
                                    billingList={billingList}
                                    user={user}
                                    jwt={jwt}
                                    callBack={callBackFetchingInformation}
                                />
                            </div>
                                <div className="card-footer">
                                     <button
                                         type="button"
                                         className="btn btn-success  cus-btn"
                                         style={{float: "right"}}>
                                        <Icon icon={gear}></Icon> Manage Settlement
                                    </button>

                                </div>
                            </>:
                            <>
                            <div className=" card-body ">
                                <Suspense fallback={<LoaderScreen/>}> <DisputePage dispute={fetchDisputeContext.disputeData} jwt={jwt}  /></Suspense>
                            </div>
                                <div className="card-footer" >
                                    <LightTooltip placement="bottom" title="Back to previous settlement page">
                                        <button
                                            type="button"
                                            className="btn btn-success  cus-btn"
                                            onClick={()=>{setLoading({...isLoading,disputePage:false})}}
                                            style={{float: "right"}}>
                                            <Icon icon={mailReplyAll}></Icon> Previous Settlement
                                        </button>
                                    </LightTooltip>
                                </div>
                            </>}

                        </div>
                    </div>
                </div>
            {groupList.length === 0  ?
                <CreateGroupModel show={displayModals.creatingGroupModal} userName={user.fullName} jwt={jwt} toBeClosed={false} hide={()=>(setDisplayModals({...displayModals,creatingGroupModal: false}))}/> :
                <DisplayGroupModal props={groupList} callBack={callBackFetchingInformation}/>
            }

            {displayModals.addingBillingModal&&<Suspense fallback={<LoaderScreen/>}><BillEntryForm show={displayModals.addingBillingModal} selectedBill={selectedEditedBill} user={user} addBilling={callBackAddBillingList} jwt={jwt} groupMembers={groupMembers.map(member=>member.fullName)} hide = {()=>{setDisplayModals({...displayModals,addingBillingModal: false})}} /></Suspense>}
            {finalSettlement.isModalShown&&<Suspense fallback={<LoaderScreen/>}><FinalSettlement
                    show={finalSettlement.isModalShown}
                    jwt={jwt} billingDetails={billingList}
                    data={finalSettlement.value.calData}
                    totalSpending={finalSettlement.value.totalSpending}
                    members={groupMembers}
                    hide = {()=>{setFinalSettlement({...finalSettlement,isModalShown:false});callBackFetchingInformation(); }}
            /></Suspense>}
            {displayModals.disputeModal&&<Suspense fallback={<LoaderScreen/>}><DisputeModal show={displayModals.disputeModal} userID={user.fullName} bill={selectedEditedBill} jwt={jwt} hide = {()=>{setDisplayModals({...displayModals,disputeModal:false})}} /></Suspense>}
            {dispute.status&&<DisputeNotifcationModal dispute={fetchDisputeContext.disputeData} show={dispute.status} hide = {()=>{setDispute({...dispute,status:false})}} />}
                <Footer />
            </div>
            }
    </div>);
}
export default LoginLanding;


