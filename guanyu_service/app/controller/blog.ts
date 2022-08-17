import { Controller } from 'egg';

export default class BlogController extends Controller {
  public async getArticle() {
    console.log("11")
    const { ctx, app } = this;     
    const sql = 'select * from article'
    let res = await app.mysql.query(sql)
    ctx.body = {res}
  }

  public async getArticleByLimit() {
    const { ctx, app } = this;     
    let params = ctx.params.limits
    let limits = JSON.parse(params)
    let {m, n, t} = limits
    if(t !== 'REC') {
      if(t === "JSTS") {
        t = "JS/TS"
      }
      const sql = `select * from article where type='${t}' limit ${m},${n}`
      let res = await app.mysql.query(sql)
      ctx.body = {res}
    }else {
      const sql = `select * from article limit ${m},${n}`
      let res = await app.mysql.query(sql)
      ctx.body = {res}
    }
  }
  
  public async getArticleContent() {
      const {ctx, app} = this
      let pid = ctx.params.id
      let sql = 'select content from article_content where aid='+pid
      let res = await app.mysql.query(sql)
      ctx.body = {res}
  }

  public async searchArticles() {
      const {ctx, app} = this
      let params = ctx.params.limits
      let limits = JSON.parse(params)
      let {m, n, keyWord} = limits
      let sql = `select * from article where concat(title, introduce) like '%${keyWord}%' limit ${m},${n}`
      let res = await app.mysql.query(sql)
      ctx.body = {res}
  }

  // 访问数据量
  public async increaseArticleAccess() {
      const {ctx, app} = this
      let iid = ctx.params.id
      try {
        let sql = `update article set count=count+1 where aid=${iid}`
        let res = await app.mysql.query(sql)
        ctx.body = {res}
      }catch(e) {
        console.log("失败：",e);
      }
  }
}
