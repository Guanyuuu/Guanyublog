import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1627278688714_2491';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.mysql = {
    // database configuration
    client: {
      // host
      host: 'localhost',
      // port
      port: '3306',
      // username
      user: 'root',
      // password
      password: 'guanyu',
      // database
      database: 'guanyu_blog',    
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };
  // 解决同源问题
  config.security = {
    csrf:false, // 关闭egg的CSRF防御， csrf token
    domainWhiteList: ['*'] // 解决响应头code403， 返回200
  };
  config.cors = {
    origin: 'http://localhost:3000',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
