const baseUrl = 'http://127.0.0.1:7001'
// const baseUrl = 'http://39.107.65.218:7001'

// 接口注册
let urlPath = {
    getLoginAuth: `${baseUrl}/admin/loginAuth`, // 登录请求
    getIncreaseArticle: `${baseUrl}/admin/increaseArticle`, // 增加文章
    getArticles: `${baseUrl}/admin/getArticleList`, // 查询文章列表
    deleteArticle:`${baseUrl}/admin/deleteArticle`, // 删除文章
    getSingleArticle: `${baseUrl}/admin/getSingle`, // 查询单个文章
    updateArticle:`${baseUrl}/admin/updateArticle`, //更新文章
    uploadFile:`${baseUrl}/admin/uploadFile`, // 上传文件
    mergeUploadFile:`${baseUrl}/admin/merge`, // 合并文件
    checkFile:`${baseUrl}/admin/check`, // 检查文件
}

export default urlPath 