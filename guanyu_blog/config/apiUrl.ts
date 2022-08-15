const baseurl = 'http://127.0.0.1:7001/'

const urlPath = {
    getArticle:`${baseurl}getArticle`,
    getArticleByLimit:`${baseurl}getArticleByLimit`,
    getArticleContent:`${baseurl}getArticleContent`,
    searchArticles:`${baseurl}searchArticles`,
    increaseArticleAccess:`${baseurl}increaseArticleAccess`
}

export default urlPath