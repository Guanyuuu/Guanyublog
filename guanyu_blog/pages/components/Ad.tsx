import React,{FC} from "react";
import e from '../../styles/component/ad.module.scss'


const Ad:FC = () => {


    return (
        <div className={e.ad}>
          <div className={e.greet}>
            <div className={e.first}>
              <img src="/static/greet.svg"/>
              <span>晚上好！</span>
            </div>
          </div>
        </div>
    )
}


export default Ad