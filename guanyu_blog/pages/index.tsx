import React, {FC, useEffect, useState} from 'react'
import Link from 'next/link'
import Axios from 'axios'
import Header from './components/Header'
import Footer from './components/Footer'
import Ad from './components/Ad'
import urlPath  from './config/apiUrl'
import { indexProps } from './type/api'
import a from '../styles/index.module.scss'


const Index:FC<indexProps> = ({res}:indexProps) => {
  const [renderData, setRenderData] = useState(res)
  const [type, setType] = useState('推荐')

  // 做header的滑动效果
  useEffect(() => {
    window.onscroll = function handleScroll(e):void {
        let fixedLength:number  = window.pageYOffset
        let header = document.querySelector('.header_header__kPgJD') as HTMLDivElement
        let nav = document.querySelector('.styles_navigation__1r1vr') as HTMLDivElement  
        if(fixedLength > 200) {
            header.style.transform = 'translate(0,-3.75rem)'
            header.style.transition = 'transform 0.6s ease'
            nav.style.transform = 'translate(0,-3.75rem)'
        }else {
            header.style.transform = 'translate(0,0)'
            nav.style.transform = 'translate(0)'
            nav.style.transition = 'transform 0.6s ease'
        }
      }
  },[])
  
  const handleType = (e:any) => {
    let links = document.querySelector('.styles_nav__gcAIG') as any
    links.childNodes.forEach((value:any) => {
      value.style.color = '#ffffff'
    })
    e.target.style.color = 'red'
    setType(e.target.innerHTML)


    switch(e.target.innerHTML){
      case "推荐":
        setRenderData(res)
        break
      case "HTML":
        setRenderData(res.filter((value:any) => value.type == 'html'))
        break
      case "CSS":
        setRenderData(res.filter((value:any) => value.type == 'css'))
        break
      case "JS/TS":
        setRenderData(res.filter((value:any) => value.type == 'js/ts'))
        break
      case "NODE.JS":
        setRenderData(res.filter((value:any) => value.type == 'node'))
        break
    }
    
  }
  return (
    <div className={a.container}>
      <Header />
      <div className={a.navigation}>
        <div className={a.nav} onClick={handleType}>
          <Link href="#"><a>推荐</a></Link>
          <Link href="#"><a>HTML</a></Link>
          <Link href="#"><a>CSS</a></Link>
          <Link href="#"><a>JS/TS</a></Link>
          <Link href="#"><a>NODE.JS</a></Link>
        </div>
      </div>
      <div className={a.section}>
        <div className={a.article}>
          {
            renderData.map((value:any) => {
              return(
                <div className={a.arcontent} key={value.id}>
                  <div className={a.title}>
                    <Link href={{pathname:"/detail", query:{"id":value.id,"type":type}}}><a>{value.title}</a></Link>
                  </div>
                  <div className={a.type}>
                    {value.istop ? <span className={a.top}>置顶</span> : ''}
                    <span className={a.time}>{value.time.substr(0,10)}</span>
                    <span className={a.artype}>{value.type}</span>
                    <span className={a.count}>{value.count}</span>
                  </div>
                  <div className={a.introduce}>
                    {value.introduce}
                  </div>
                  <div className={a.checkall}>
                    <Link href={{pathname:"/detail", query:{"id":value.id}}}><a>览全部 &gt;</a></Link>
                  </div>
                </div>
              )
            })
          }
        </div>
        <Ad />
      </div>
      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  let data = await Axios.get(urlPath.getArticle)
  return {
    props:{res:data.data.res}
  }
  
}


export default Index
