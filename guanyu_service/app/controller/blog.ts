import { Controller } from 'egg';

export default class BlogController extends Controller {
  public async getArticle() {
    const { ctx, app } = this;
    const sql = 'select * from article'
    let res = await app.mysql.query(sql)
    ctx.body = {res}
  }
  
  public async getArticleContent() {
      const {ctx, app} = this
      let pid = ctx.params.id
      console.log(ctx.params);
      
      let sql = 'select content from article_content where id='+pid
      let res = await app.mysql.query(sql)

      ctx.body = {res}
  }
}
