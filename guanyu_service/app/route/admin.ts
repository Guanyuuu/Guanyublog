import { Application } from "egg";

module.exports = (app:Application) => {
    const {router, controller} = app
    router.get('/admin/getType', controller.admin.getType)
    router.post('/admin/loginAuth', controller.admin.loginAuth)
    router.post('/admin/increaseArticle', controller.admin.increaseArticle)
    router.get('/admin/getArticleList', controller.admin.getArticleList)
    router.post('/admin/deleteArticle', controller.admin.deleteArticle)
    router.post('/admin/getSingle', controller.admin.getSingle)
    router.post('/admin/updateArticle', controller.admin.updateArticle)
}