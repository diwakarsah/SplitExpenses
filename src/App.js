import React, {useEffect, useReducer,useState,Suspense,lazy} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route,BrowserRouter,Switch} from 'react-router-dom';
import {Modal} from 'react-bootstrap';
import LoginReducer from "./Pages/reducer/LoginReducer";
import {ProtectedRoute} from "./ProtectedRoute";
import {getSessionCookie} from "./Pages/service/CookiesHandler";
import {loginContext, userDetailsContext,memberSettlementContext,disputeContext} from "./Pages/service/Contexts";
import {
    DisputeReducer,
    MemberSettlementReducer,
    UserDetailsReducer
} from "./Pages/reducer/Reducers";
import './css/login.css';
import './css/NavBar.css';
import './css/CutsomCss.css';
import './css/Home.css';

import {RequestHandler} from "./Pages/service/RequestHandler";
import Home from "./Pages/Home";
import LoaderScreen from "./Pages/Model/LoaderScreen";


const LoginPage =lazy(()=> import('./Pages/loginPage'));
// const Home = lazy(()=>import('./Pages/Home'));
const Dispute = lazy(()=>import('./Pages/Dispute'));
const UploadBill = lazy(()=>import('./Pages/UploadBill'));
const Register = lazy(()=>import('./Pages/Register'));
const LoginLanding = lazy(()=>import('./Pages/LoginLandingPage'));

function App() {
    const initialState =getSessionCookie();
    const [loginState,dispatch] = useReducer(LoginReducer,initialState);
    const [user,userDisptach]= useReducer(UserDetailsReducer,{groupList:[],userDetails:{}});
    const [memberSettlement,memberSettlementDisptach]= useReducer(MemberSettlementReducer,{status:false,members:[]});
    const [dispute,disputeDispatch]= useReducer(DisputeReducer,{status:false,disputeArray:"",disputeCreated:""});
    const [fetchedData,setFetchedData] = useState(false);


    useEffect(()=>{
       if (loginState.isAuthenticated)
       {
           let tempJwt =loginState.jwt;
           let  username = loginState.username;
           RequestHandler('/getUser/'+username,"",'get',tempJwt)
               .then(userResult=>{
                   userDisptach({type:"ADD",payload:userResult});

               });
           console.log("Effect 1 +++++++");
       }
    },[loginState]);


    useEffect(()=>{
        if (loginState.isAuthenticated)
        {
            let jwt = loginState.jwt;
            if(sessionStorage.getItem("groupName") !== null && sessionStorage.getItem("count") !==null && !fetchedData )
            {
                memberSettlementDisptach({type:"ADD",payload:jwt});
                setFetchedData(true);
            }
            if (sessionStorage.getItem("groupName") !== null && typeof user.userDetails.fullName !== "undefined")
            {
                let requestData = user.userDetails.id  + "/"+ sessionStorage.getItem("groupName") + "/"+user.userDetails.fullName;
                RequestHandler("/getDispute",requestData,'get',jwt).then((result)=>{
                    if (typeof result === 'response')
                    {
                        return null;
                    }
                    if( result.disputeList.length !== 0 ||  result.razedDispute.length !== 0)
                    {
                        disputeDispatch({type:"ADD",payload:{status:true,disputeArray:result.disputeList,disputeCreated: result.razedDispute}});
                    }
                    else{
                        disputeDispatch({type:"ADD",payload:{status:false,disputeArray:[],disputeCreated:[]}});
                    };

                });
                console.log("Effect 3 +++++++");
            }

        }


    },[sessionStorage.getItem("groupName"),user]);

      return (
              <BrowserRouter>
                <div className="App">
                    <Suspense fallback={<LoaderScreen />}>
                    <Switch>
                        <Route exact path="/SplitExpenses/" component={Home} />
                        <Route path="/SignUp" component={Register} />
                        <loginContext.Provider value ={{stateData:loginState, dispatch: dispatch}}>
                            <Route path="/login" component={LoginPage} />
                            <userDetailsContext.Provider value ={{userData:user,dispatch:userDisptach}}>
                                <memberSettlementContext.Provider value ={{fetchData:memberSettlement,dispatch:memberSettlementDisptach}}>
                                    <disputeContext.Provider value={{disputeData:dispute,dispatch:disputeDispatch}} >

                                        <ProtectedRoute  path='/home' component={LoginLanding}/>
                                        <ProtectedRoute  path='/dispute' component={Dispute}/>
                                         <ProtectedRoute path="/upload" component={UploadBill}/>
                                    </disputeContext.Provider>
                                </memberSettlementContext.Provider>
                            </userDetailsContext.Provider>
                        </loginContext.Provider>
                        <Route path="*" component={()=>"404 Error"}/>
                    </Switch>
                    </Suspense>
                </div>
              </BrowserRouter>

      );}


export default App;
