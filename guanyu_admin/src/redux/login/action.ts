import {requestLoginAuth} from '../../util/requestMethod'

export const getLoginAuthAction = (value:any) => ({type:'login', data: value})
export const axiosAuth = (value:any) => (dispatch:any) => {
    requestLoginAuth(value).then(res => {
        dispatch(getLoginAuthAction(res))
    })
}