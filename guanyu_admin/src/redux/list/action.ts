import {requestSingleArticle} from '../../util/requestMethod'

export const singleAction = (value:any) => ({type:"single", data:value})
export const ayGetSingle = (value:any) => (dispatch:any) => {
    requestSingleArticle(value)
                    .then((res) => {
                        dispatch(singleAction({
                            data:res.data.res[0],
                            value
                        }))
                    })
}