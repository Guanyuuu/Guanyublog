module.exports = (app) => {
    const {router, controller} = app
    router.get('/admin/getType', controller.admin.getType)
    router.post('/admin/loginAuth', controller.admin.loginAuth)
    router.post('/admin/increaseArticle', controller.admin.increaseArticle)
    router.get('/admin/getArticleList', controller.admin.getArticleList)
    router.post('/admin/deleteArticle', controller.admin.deleteArticle)
    router.post('/admin/getSingle', controller.admin.getSingle)
    router.post('/admin/updateArticle', controller.admin.updateArticle)
    router.post('/admin/uploadFile', controller.admin.upload)
    router.post('/admin/merge', controller.admin.merge)
    router.post('/admin/check', controller.admin.check)
}