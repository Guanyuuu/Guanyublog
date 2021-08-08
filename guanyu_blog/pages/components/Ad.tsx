import React,{FC} from "react";
import e from '../../styles/component/ad.module.scss'


const Ad:FC = () => {


    return (
        <div className={e.ad}>
          <div className={e.profile}>
            <img src="/static/kenan.jpg" alt="" />
            <span>Guanyu</span>
            <div className={e.link}>
              <img src="/static/qq.svg" alt="" />
              <div></div>
              <a href="https://github.com/kjl1805772754"><img src="/static/github.svg" alt="" /></a>
            </div>
          </div>
          <div className={e.greet}>
            <div className={e.first}>
              <img src="/static/human-greeting.svg"/>
              <span>晚上好！</span>
            </div>
          </div>
          <div className={e.greet}>
            <div className={e.first}>
              <img src="/static/human-greeting.svg"/>
              <span>晚上好！</span>
            </div> 
          </div>
          <div className={e.greet}>
            <div className={e.first}>
              <img src="/static/human-greeting.svg"/>
              <span>晚上好！</span>
            </div>
          </div>
        </div>
    )
}


export default Ad