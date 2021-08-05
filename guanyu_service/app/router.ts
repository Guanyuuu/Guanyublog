import { Application } from 'egg';

export default (app: Application) => {
  require('./route/blog.ts')(app)
  require('./route/admin.ts')(app)
};
