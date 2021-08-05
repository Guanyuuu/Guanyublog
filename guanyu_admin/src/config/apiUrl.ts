const baseUrl = 'http://127.0.0.1:7001'

// 接口注册
let urlPath = {
    getLoginAuth: `${baseUrl}/admin/loginAuth`, // 登录请求
    getIncreaseArticle: `${baseUrl}/admin/increaseArticle`, // 增加文章
    getArticles: `${baseUrl}/admin/getArticleList`, // 查询文章列表
    deleteArticle:`${baseUrl}/admin/deleteArticle`, // 删除文章
    getSingleArticle: `${baseUrl}/admin/getSingle`, // 查询单个文章
    updateArticle:`${baseUrl}/admin/updateArticle` //更新文章
}

export default urlPath 