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

    return(
        <div className={d.container}>
            <Header />
            <div className={d.navigation}>
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