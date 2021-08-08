import {Controller} from 'egg'

export default class AdminController extends Controller{
    public async getType() {
        const {ctx, app} = this
        const sql = 'select type from article'
        let res = await app.mysql.query(sql)
        ctx.body = {res}
    }

    public async loginAuth() {
        const {ctx, app} = this
        let userInfo = ctx.request.body
        const {
            username:userName,
            password:passWord
        } = userInfo
        
        let sql = "select id from admin_users where username='"+userName+"' and password='"+passWord+"'"
        let res = await app.mysql.query(sql)
        if(res.length > 0) {
            const timeStamp = new Date().getTime()
            ctx.session.uniqueIdf = timeStamp            
            ctx.body = {
                'data': '登录成功',
                'uniqueIdf': timeStamp
            }
        }else {
            ctx.status = 404
            ctx.body = {
                'data':'验证失败'
            }
        }
    }
    // 增加文章
    public async increaseArticle() {
        const {ctx, app} = this
        let articleInfo = ctx.request.body
        const {
            articleTitle,
            isTop,
            articleType,
            articleIntroduce,
            articleContent
        } = articleInfo


        let articleTime = (new Date()).toJSON().substr(0, 10)
        let sql1 = "insert into article(title,istop,time,type,count,introduce) "+
                    "values('"+articleTitle+"','"+isTop+"','"+articleTime+"','"+articleType+"',100,'"+articleIntroduce+"');"
        let res1 = await app.mysql.query(sql1)
        


        let sql2 = "insert into article_content(`content`) "+
                    "values('"+articleContent+"');"

        let res2 = await app.mysql.query(sql2)
        

        if(res1.affectedRows === 1 && res2.affectedRows === 1) {
            ctx.body = {"data": "添加成功"}
        }else {
            ctx.body = {"data": "添加失败"}
        }
    }
    // 查询所有文章
    public async getArticleList() {
        const {ctx, app} = this
        const sql = 'select id,title,type,time,count from article'
        const res = await app.mysql.query(sql)
        if(res.length > 0){
            ctx.body = {res}
        }else{
            ctx.body = {
                "data":"请求失败，没有文章"
            }
        }
    }
    // 删除文章
    public async deleteArticle(){
        const {ctx, app} = this
        const {id:did} = ctx.request.body
        
        const sql = "delete article,article_content from article left join article_content "+
                    "on article.id = article_content.id where "+
                    "article.id = "+did+";"
        let res = await app.mysql.query(sql)
        if(res.affectedRows === 2) {
            ctx.body = {
                "data":"删除成功"
            }
        }else {
            ctx.body = {
                "data":"删除失败"
            }
        }
    }
    // 获取单个文章内容
    public async getSingle(){
        const {ctx, app} = this
        const {id:sid} = ctx.request.body
        const sql = 'select title,istop,type,content from article join article_content on '+
                    'article.id = article_content.id where '+
                    'article.id = '+sid
        const res = await app.mysql.query(sql)
        ctx.body = {res}
    }
    // 修改文章内容
    public async updateArticle() {
        const {ctx, app} = this
        const {
            id:uid,
            articleTitle,
            isTop,
            articleType,
            articleIntroduce,
            articleContent
        } = ctx.request.body
        
        let articleTime = (new Date()).toJSON().substr(0, 10)
        const sql = "update article t1,article_content t2 set t1.title='"+articleTitle+"',"+
                    "t1.istop="+isTop+","+
                    "t1.type='"+articleType+"',"+
                    "t1.time='"+articleTime+"',"+
                    "t1.introduce='"+articleIntroduce+"',"+
                    "t2.content='"+articleContent+"' "+
                    "where t1.id=t2.id and t1.id="+uid+";"
        const res = app.mysql.query(sql)
        ctx.body = {
            "msg":"更新成功",
            res
        }
    }
}