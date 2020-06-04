import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { ApiConfig } from '../config/api.confing'

export class ApiResponse {
    status: 'ok' | 'error' | 'login';
    data: any;

    constructor(status: 'ok' | 'error' | 'login', data: any) {
        this.status = status;
        this.data = data;
    }
}
export default function api(
    path: string,
    method: 'get' | 'post' | 'patch' | 'delete',
    body?: any,): Promise<ApiResponse>{
    
    return new Promise<ApiResponse>((resolve) => {
        const requestConfig: AxiosRequestConfig = {
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(),
            }
       }
    
        axios(requestConfig).then(res => responseHandler(res, resolve))
        .catch(async err =>{

            if(err.response.status === 401) {      
                const newToken = await refreshToken();
    
                if(!newToken){
                    return resolve(new ApiResponse("login", null));
                }
    
                saveToken(newToken);
    
                requestConfig.headers['Authorization'] = getToken();
    
                return await repeatRequest(requestConfig, resolve);
            }
            return resolve(new ApiResponse("error", err));
        })
    })  
}

async function refreshToken(): Promise<string | null> {
    return new Promise(async resolve => {
        const body = {
            token: getRefreshToken(),
        };

        const rtrConfig: AxiosRequestConfig = {
            method: 'post',
            url: 'auth/user/refresh/',
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const response: any = await axios(rtrConfig);

        if (response && response.token) {
            return resolve(response.token);
        }

        return resolve(null);
    });
}

function getToken(): string {
    const token = localStorage.getItem('api_token');
    return 'Bearer ' + token;
}

function saveToken(token: string){
    localStorage.setItem('api_token', token)
}

function getRefreshToken() {
    return localStorage.getItem('api_refresh_token');
}


function saveRefreshToken(token: string) {
    localStorage.setItem('api_refresh_token', token);
}

function responseHandler(
    res: AxiosResponse<any>,
    resolve: (value: ApiResponse) => void
) {
    if (res.status < 200 || res.status >= 300) {
        return resolve(new ApiResponse("error", res.data));
    }

    if (res.data.statusCode < 0) {
        return resolve(new ApiResponse("error", res.data));
    }

    return resolve(new ApiResponse("ok", res.data));
}

// function saveRefreshToken(token: string){
//     localStorage.setItem('api_refresh_token', token)
// }



function repeatRequest(
    config: AxiosRequestConfig,
    resolve: (value: ApiResponse) => void
) {
    axios(config)
    .then(res => {
        if (res.data.statusCode < 0) {
            return resolve(new ApiResponse("error", res.data));
        }

        return resolve(new ApiResponse("ok", res.data));
    })
    .catch(err => {
        if (err.response.status === 401) {
            return resolve(new ApiResponse("login", null));
        }

        return resolve(new ApiResponse("error", err));
    });
}