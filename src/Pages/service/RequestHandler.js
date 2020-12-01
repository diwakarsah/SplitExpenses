
export const RequestHandler = async (urls, userData, method,jwt) => {

    // "proxy": "http://localhost:8080/billSplitter/api/", "https://splitexpenses2.herokuapp.com/billSplitter/api"
    const token = "Bearer "+jwt;
    const header = new Headers({'Content-Type':'application/json','Authorization':token});
    console.log("url",urls)
    if(method ==='get' || method === 'delete') {
        const url =  urls + "/" + userData;
              const fetchResult =  await fetch(url, {
                    method: method,
                    headers: header
                }).then(response => {
                    console.log("error",response);
                    if (response.ok) {
                        return response.json()
                    }
                    else if (response.status === 400) {
                        console.log("res",response);
                        return response.json()
                    }
                    else {
                        return response
                    }
                }).catch(error => {return error});
              return  fetchResult;

    }
    else if (method === 'post' || method === 'put') {
        const url =   urls;

           const fetchResult =  await fetch(url, {
                    method: method,
                    body: JSON.stringify(userData),
                    headers: header
                }).then(response => {
                    console.log("re",response);
                   if (response.ok) {
                       return response.json()
                   }
                   else if (response.status === 400) {
                       return(response.json())}
                   else {
                       return (response)
                   }
                });
           return fetchResult;
    }
};
