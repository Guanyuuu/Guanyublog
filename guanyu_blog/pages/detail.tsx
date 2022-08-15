import React,{FC, useEffect, useRef, useState} from 'react'
import Axios from 'axios'
import Link from 'next/link'
import {marked} from "marked-change-little"
import hljs from 'highlight.js';
import Header from './components/Header'
import Footer from './components/Footer'
import Ad from './components/Ad'
import urlPath from '../config/apiUrl'
import { styleType } from '../type/api'
import d from '../styles/detail.module.scss'
import 'highlight.js/styles/github-dark.css';


const Detail:FC = ({res, type, id}:any) => {
    const [changedHtmlValue, setChangedHtmlValue] = useState<string>("")
    useEffect(() => {
        marked.parse(res[0].content ,{
            renderer: new marked.Renderer(),
            highlight: function(code:any, lang:any) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            langPrefix: 'hljs language-',
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false,
            // custom property
            target:"_blank"
          }, function(err:any, html:any){
            setChangedHtmlValue(html)
          })
    },[res])

    // 处理滚动后头部动画
    const scrollTopRef = useRef<number>()
    const [toStyle, setToStyle] = useState<styleType>({
      transform:"none",
      transition:"none"
    })
    const handleScroll = (e:any):void => {
        const scrollTop = e.target.scrollTop
        // 保存已经滑动的距离，
        scrollTopRef.current = scrollTop
        if(scrollTop < 200 && navDetailScrollTop > 200) {
            setNavDetailScrollTop(scrollTop)
        }else if(scrollTop > 200 && navDetailScrollTop < 200) {
            setNavDetailScrollTop(scrollTop)
        }
        function headerSlide():void {
            if(scrollTop > 200) {
                let toStyles = {
                    transform:'translate(0,-3.75rem)',
                    transition:'transform 0.6s ease'
                }
                setToStyle(toStyles)
            }else if(scrollTop <= 200) {
                let toStyles = {
                    transform:"translate(0, 0)",
                    transition:"transform 0.6s ease"
                }
                setToStyle(toStyles)
            }
        }
        headerSlide()
    }

    // 处理navigation，hover的情况
    // state用于存储滚动的距离，用来判断是否应该触发,鼠标移入nav触发的动画
    const [navDetailScrollTop, setNavDetailScrollTop] = useState<number>(0)
    const hoverNavigationEnter = ():void => {
        if(navDetailScrollTop > 200) {
            let toStyles = {
                transform:"translate(0, 0)",
                transition:"transform 0.3s ease"
            }
            setToStyle(toStyles)
        }
    }

    const  hoverNavigationLeave = ():void => {
        if(navDetailScrollTop > 200) {
            let toStyles = {
                transform:'translate(0,-3.75rem)',
                transition:'transform 0.3s ease'
            }
            setToStyle(toStyles)
        }
    }

    const handleSearch = ():void => {}

    return(
        <div 
        className={d.guanyu}
        onScroll={handleScroll}
        >
            <header 
            className={d.top_header} 
            style={toStyle}
            onMouseEnter={hoverNavigationEnter}
            onMouseLeave={hoverNavigationLeave}
            >
                <Header 
                id={id}
                searchFunction={handleSearch}
                />
                <div 
                className={d.naviga}
                >
                    <div className={d.nav}>
                    <Link href={`#`} scroll shallow prefetch={false}><a>首页 &gt;</a></Link>
                    <Link href="#" scroll shallow prefetch={false}><a>{type}</a></Link>
                    </div>
                </div>
            </header>
            <div className={d.section}>
                <div 
                className={`${d.article} ${d.othercss}`} 
                dangerouslySetInnerHTML={{__html:changedHtmlValue}}
                ></div>
                <Ad />
            </div>
            <Footer />
        </div>
    )
}

export async function getServerSideProps(context:any) {
    let res = await Axios.get(`${urlPath.getArticleContent}/${context.query.aid}`)
      return {
          props:{
              res:res.data.res,
              type:context.query.type,
              id:context.query.aid
          }
      }
}

export default Detail