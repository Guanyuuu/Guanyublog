// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdmin from '../../../app/controller/admin';
import ExportBlog from '../../../app/controller/blog';
import ExportHome from '../../../app/controller/home';

declare module 'egg' {
  interface IController {
    admin: ExportAdmin;
    blog: ExportBlog;
    home: ExportHome;
  }
}
