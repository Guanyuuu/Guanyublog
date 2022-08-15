import React,{FC, useEffect, useState, memo} from "react";
import Image from 'next/image'
import e from '../../styles/component/ad.module.scss'
import kenanimg from '../../static/kenan.jpg'
import qqimg from '../../static/qq.svg'
import githubimg from '../../static/github.svg'


const Ad:FC = () => {
    const [greeting, setGreeting] = useState<string>("Good morning")
    useEffect(() => {
      let d = new Date()
      let h = d.getHours()
      if(h >= 5 && h < 11) {
        setGreeting("Good morning!!")
      }else if(h >= 11 && h < 14) {
        setGreeting("Good noon!!")
      }else if(h >= 14 && h < 17) {
        setGreeting("Good afternoon!!")
      }else {
        setGreeting("Good evening!!")
      }
    },[])

    return (
        <div className={e.ad}>
          <div className={e.profile}>
            <Image alt="" src={kenanimg}/>
            <span>Guanyu</span>
            <div className={e.link}>
              <a href="#"><Image alt="" src={qqimg}/></a>
              <div className={e.g}></div>
              <a href="https://github.com/kjl1805772754"><Image alt="" src={githubimg}/></a>
            </div>
          </div>
          <div className={e.greet}>
            <div className={e.first}>
              <span>{greeting}</span>
            </div>
          </div>
          <div className={e.greet}>
            <div className={e.first}>
              <span>{greeting}</span>
            </div> 
          </div>
          <div className={e.greet}>
            <div className={e.first}>
              <span>{greeting}</span>
            </div>
          </div>
        </div>
    )
}


export default memo(Ad)