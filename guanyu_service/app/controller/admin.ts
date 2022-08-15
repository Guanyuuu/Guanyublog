import {Controller} from 'egg'

const path = require('path')
const fs = require('fs')
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
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
            aid,
            articleTitle,
            isTop,
            articleType,
            articleIntroduce,
            articleContent
        } = articleInfo
        let articleTime = (new Date()).toJSON().substr(0, 10)
        // 对文章内容进行过滤' 改为"
        let filterContent = articleContent.replace(/[']/g, '"')
        let filterIntroduce = articleIntroduce.replace(/[']/g, '"')
        let sql1 = `insert into article(aid,title,istop,time,type,count,introduce) values('${aid}','${articleTitle}','${isTop}','${articleTime}','${articleType}',0,'${filterIntroduce}');`
        let sql2 = `insert into article_content(aid,content) values('${aid}','${filterContent}');`
        try{
            let res1 = await app.mysql.query(sql1)
            let res2 = await app.mysql.query(sql2)
    
            if(res1.affectedRows === 1 && res2.affectedRows === 1) {
                ctx.body = {"data": "添加成功"}
            }else {
                ctx.body = {"data": "添加失败"}
            }
        }catch(e) {
            console.log(e)
        }
    }
    // 查询所有文章
    public async getArticleList() {
        const {ctx, app} = this
        const sql = 'select aid,title,type,time,count from article'
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
        
        const sql = `delete article,article_content from article left join article_content on article.aid = article_content.aid where article.aid = ${did};`
        try {
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
        }catch(e) {
            console.log("数据库删除失败", e)
        }
    }
    // 获取单个文章内容
    public async getSingle(){
        const {ctx, app} = this
        const {id:sid} = ctx.request.body
        const sql = 'select title,istop,type,introduce,content from article join article_content on '+
                    'article.aid = article_content.aid where '+
                    'article.aid = '+sid
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
                    "where t1.aid=t2.aid and t1.aid="+uid+";"
        try {
            const res = app.mysql.query(sql)
            ctx.body = {
                "msg":"更新成功",
                res
            }
        }catch(e) {
            console.log(e);
        }
    }

    // 上传文件区

    public async check() {
        const {ctx, config} = this
        const data = ctx.request.body
        
        if(fs.existsSync(path.join(config.baseDir, "app/public/files", data.filename))) {
            ctx.body = {
                msg: "文件存在",
                des:1
            }
            return
        }else {
            let target = path.join(config.baseDir, 'app/public/upload')
            let files = fs.readdirSync(target)
            
            ctx.body = {
                msg:"文件不存在",
                des:0,
                chunks:files
            }
        }         
    }

    public async upload() {
        const {ctx,config} = this

        let file = await ctx.getFileStream()

        // 判断本地是否有上传文件夹，没有则创建
        if(!fs.existsSync(path.join(config.baseDir, 'app/public/upload'))) {
            fs.mkdirSync(path.join(config.baseDir, 'app/public/upload'))
        }
        const target = path.join(config.baseDir, 'app/public/upload', file.fields.hash)
        const writeStream = fs.createWriteStream(target)
        try {
            await awaitWriteStream(file.pipe(writeStream))
        }catch{
            await sendToWormhole(file)
        }
        ctx.body = {
            msg:"分片上传成功"
        }
    } 

    public async merge() {
        const {ctx,  config} = this
        let {name} = ctx.request.body
        let target = path.join(config.baseDir, 'app/public/upload')
        let saveFilePath = path.join(config.baseDir, "app/public/files")
        let files = fs.readdirSync(target)
        files.forEach((value) => {
            let index = value.split("-")[0]
            fs.renameSync(path.join(target,value), path.join(target,`${index}`))
        })
        let file = fs.readdirSync(target)
        file.sort((a, b) => a-b).map(chunkpath => {
            fs.appendFileSync(
                path.join(saveFilePath,name),
                fs.readFileSync(`${target}/${chunkpath}`)
            )
            fs.rmSync(`${target}/${chunkpath}`)
        })
        ctx.body = {
            msg:"合并成功",
            url:`http://localhost:7001/public/upload/guanyu${name}`
        }
    }
}