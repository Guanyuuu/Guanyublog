import React,{FC, useEffect} from 'react'
import Axios from 'axios'
import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import Ad from './components/Ad'
import urlPath from './config/apiUrl'
import d from '../styles/detail.module.scss'

const marked = require('marked')
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code:any) {
      const hljs = require('highlight.js');
      return hljs.highlightAuto(code).value;
    },
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false
  });

const Detail:FC = ({res, type}:any) => {
    useEffect(() => {
        function handleScroll():void {
            let fixedLength:number  = window.pageYOffset
            let header = document.querySelector('.header_header__kPgJD') as HTMLDivElement
            let nav = document.querySelector('.detail_naviga__oEVCj') as HTMLDivElement  
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
        window.addEventListener("scroll", handleScroll)
        return () => {
          removeEventListener("scroll", handleScroll)
        }
      },[])

    return(
        <div className={d.container}>
            <Header />
            <div className={d.naviga}>
                <div className={d.nav}>
                <Link href="/"><a>首页 &gt;</a></Link>
                <Link href="#"><a>{type}</a></Link>
                </div>
            </div>
            <div className={d.section}>
                <div className={d.article} dangerouslySetInnerHTML={{__html:marked(res[0].content)}}></div>
                <Ad />
            </div>
            <Footer />
        </div>
    )
}

export async function getServerSideProps(context:any) {
    
    let res = await Axios.get(`${urlPath.getArticleContent}/${context.query.id}`)
    return {
        props:{
            res:res.data.res,
            type:context.query.type
        }
    }
}

export default Detail