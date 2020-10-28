export function FetchingLoginInfo(urls,userData,method){
    const url = "https://splitexpenses2.herokuapp.com/billSplitter/api"+ urls;
    return new Promise(async (resolve,reject)=>{

        try {
            await fetch(url, {
                method: method,
                body: JSON.stringify(userData),
                headers: {'Content-Type': 'application/json',}
            }).then(response => {
                console.log("resposneLogin",response)
                if (response.ok) {
                    return response.json()

                }
                else if (response.status === 400) {resolve(response.json())}
                else {resolve(response)}
            }).then(responseJson => resolve(responseJson)).catch(error => reject(error));
        }
        catch (e) {
            reject(e);
        }

    })

}

