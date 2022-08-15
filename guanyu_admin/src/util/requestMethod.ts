import Axios from 'axios'
import urlPath from "../config/apiUrl"


export const requestLoginAuth = (value:any) => Axios.post(urlPath.getLoginAuth,value) // 获取登录请求认证

export const requestIncreaseArticle = (value:any) => Axios.post(urlPath.getIncreaseArticle,value) // 增加文章

export const requestArticles = (value?:any) => Axios.get(urlPath.getArticles, value) //   请求文章列表

export const requestDeleteArticle = (value:any) => Axios.post(urlPath.deleteArticle,value) // 删除文章

export const requestSingleArticle = (value:any) => Axios.post(urlPath.getSingleArticle,value) //查询单个文章

export const requestUpdateArticle = (value:any) => Axios.post(urlPath.updateArticle,value)  //更新文章

export const requestUploadFile = (value:any, config:any) => Axios.post(urlPath.uploadFile, value, config) // 上传文件

export const requestMergeUpload = (value:any) => Axios.post(urlPath.mergeUploadFile, value) // 合并文件

export const requestCheckFile = (value:any) => Axios.post(urlPath.checkFile, value)  // 检查文件