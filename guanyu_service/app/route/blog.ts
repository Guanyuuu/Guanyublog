import { Application } from "egg";

module.exports = (app:Application) => {
    const {router, controller} = app
    router.get('/getArticle',controller.blog.getArticle)
    router.get('/getArticleContent/:id', controller.blog.getArticleContent)
}