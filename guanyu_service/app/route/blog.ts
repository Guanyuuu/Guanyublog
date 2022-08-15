module.exports = (app) => {
    const {router, controller} = app
    router.get('/getArticle',controller.blog.getArticle)
    router.get('/getArticleByLimit/:limits', controller.blog.getArticleByLimit)
    router.get('/getArticleContent/:id', controller.blog.getArticleContent)
    router.get('/searchArticles/:limits', controller.blog.searchArticles)
    router.get('/increaseArticleAccess/:id', controller.blog.increaseArticleAccess)
}