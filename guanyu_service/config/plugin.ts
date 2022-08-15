import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  mysql:{
    enable:true,
    package:'egg-mysql'
  },
  cors:{
    enable:true,
    package:'egg-cors'
  },
  multipart:{
    enable:true,
    package:'egg-multipart'
  }
};

export default plugin;
