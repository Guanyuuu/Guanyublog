import React,{useEffect, useState, useRef, memo, useCallback} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Axios from 'axios'
import urlPath from '../../config/apiUrl'
import {useDebounce} from "../../hooks"
import {op} from "../../type/api"
import b from '../../styles/component/header.module.scss'
import searchimg from '../../static/search.svg'



interface headerType {
    id?:number
    searchFunction:(data:[], options:op) => void
}
const Header = (props:headerType) => {
    // 防抖hook
    const [debounceAuto, getTimer] = useDebounce()
    const [debounceManual] = useDebounce()
    const keywordRef = useRef("")
    
    // 发起网络请求，请求关键词搜索
    async function _s() {
        if(keywordRef.current === "") {
            let limit:any = {
                m:0,
                n:10,
                t:"REC"
            }
            limit = JSON.stringify(limit)
            let data = await Axios.get(`${urlPath.getArticleByLimit}/${limit}`)
            let topD = data.data.res.filter((value:any) => value.istop === 1)
            let botD = data.data.res.filter((value:any) => value.istop !== 1)
            let res = [...topD, ...botD] as []
            props.searchFunction(res, {
                isSearch:false,
                keyWord:keywordRef.current
            })
            return
        }
        try {
            let limit:any = {
                m:0,
                n:10,
                keyWord:keywordRef.current
            }
            limit = JSON.stringify(limit)
            let res = await Axios.get(`${urlPath.searchArticles}/${limit}`)
            props.searchFunction(res.data.res, {
                isSearch:true,
                keyWord:keywordRef.current
            })
        }catch(e) {
            console.log("搜索失败：",e)
        }
    }
    const collInput = (e:any):void => {
        let value:string = e.target.value
        value = value.trim()
        // 进行转义，把%转义为\%
        let keywords:any = value.replace(/(?=[%\?\*])/g, "\\")
        keywordRef.current = keywords
        
        debounceAuto(_s, 1000)()
    }

    // 点击，取消自动搜索，直接进行搜索
    const handleManualSearch = async():Promise<any> => {
        if(keywordRef.current === "") return
        // 取消自动搜索
        clearTimeout(getTimer())
        try {
            let limit:any = {
                m:0,
                n:10,
                keyWord:keywordRef.current
            }
            limit = JSON.stringify(limit)
            let res = await Axios.get(`${urlPath.searchArticles}/${limit}`)
            props.searchFunction(res.data.res, {
                isSearch:true,
                keyWord:keywordRef.current
            })
        }catch(e) {
            console.log("搜索失败：",e)
        }
    }

    // 按回车键搜索
    const searchRef = useRef<any>()
    const handleEnterSearch = (e:any):void => {
        let code = e.keyCode
        if(code === 13) {
            searchRef.current.click()
        }
    }

    return (
        <div 
        className={b.header} 
        > 
            <div className={b.content}>
                <ul>
                    <li>
                        <Link href={`/`}><a>Guanyu</a></Link>
                        <span>  blooooog</span>
                    </li>
                    <li>
                        <input type="text" 
                        className={b.input} 
                        onChange={collInput} 
                        onKeyUp={handleEnterSearch}
                        placeholder="你想搜索什么标题呢?"
                        />
                        <button
                        ref={searchRef}
                        onClick={debounceManual(handleManualSearch, 300)}
                        >
                            <Image 
                            src={searchimg} 
                            alt=""
                            />
                        </button>
                        <div className={b.serach}>
                            
                        </div>
                    </li>
                    <li>
                        <Link href={`/${props.id ? "#" + props.id : ""}`}><a> 首页</a></Link>
                    </li>
                </ul>
            </div>
      </div>
    )
}


export default memo(Header)