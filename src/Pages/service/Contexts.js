import React from "react";

export  const loginContext = React.createContext(
    {
        stateData:"",
        dispatch:""
    }
);
export const userDetailsContext = React.createContext({userData:"", dispatch:""});

export const memberSettlementContext = React.createContext({fetchData:"", dispatch:""});

export const disputeContext = React.createContext({disputeData:"", dispatch:""});

// export const settlementContext = React.createContext({settlementData:"", dispatch:""});
