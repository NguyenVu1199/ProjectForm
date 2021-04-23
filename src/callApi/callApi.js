import axios from 'axios';

export default function callApi(url,method,body){
    return axios({
        method:method,
        url:"https://606efb3f0c054f0017658138.mockapi.io/api/"+url,
        data:body
    }).catch(err=>{
        console.log(err);
    })
}