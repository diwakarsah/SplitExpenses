import {RequestHandler} from "../service/RequestHandler";



const fetchingUserInfo=  (jwt)=>{
    let groupName =  sessionStorage.getItem("groupName");
   const data=    RequestHandler('/homeDetails',groupName,'get',jwt).then(result=>{
      return result
    });
    sessionStorage.setItem("count","0");
    return data;
};

export const UserDetailsReducer = (state, action)=>{
    switch (action.type) {
        case 'ADD':
            return (action.payload);
        default:
            return state
    }
};

export const MemberSettlementReducer =  async (state, action)=>{
    switch (action.type) {
        case 'ADD':
            const data = fetchingUserInfo(action.payload);
            sessionStorage.setItem("IsMemberFetched","false");
            return  data;
        default:
            return state
    }
};

export const DisputeReducer = (state, action)=>{
    switch (action.type) {
        case 'ADD':
            return (action.payload);
        default:
            return state
    }
};

// export const SettlementReducer = (state, action)=> {
//     switch (action.type) {
//         case 'ADD':
//             return (action.payload);
//         default:
//             return state
//     }
// };
