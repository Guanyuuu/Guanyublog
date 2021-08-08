import React,{useEffect, useState} from 'react'
import Link from 'next/link'
import Axios from 'axios'
import urlPath from '../config/apiUrl'
import b from '../../styles/component/header.module.scss'

const Header = () => {
    const [searchV, setSearchV] = useState('')
    const [searchRes, setSearchRes] = useState([{title:'',id:''}])
    const [listSearch, setListSearch] = useState([{title:'',id:''}])

    useEffect(() => {
        (async() => {
            let res = await Axios.get(urlPath.getArticle)
            let data = res.data.res.map((value:any) => {
                return {
                    title:value.title,
                    id:value.id
                }
            })
            setSearchRes(data)
        })()
    },[])

    useEffect(() => {
        let search = document.querySelector('.header_serach__4oeih') as HTMLDivElement
        let input = document.querySelector('.header_input__23zEB') as HTMLDivElement
        const focusI = async() => {
            search.style.display = "block"
        }

        const noFocus = () => {
            setTimeout(() => {
                search.style.display = "none"
            }, 300);
        }
        input.addEventListener('focus', focusI)
        input.addEventListener('blur', noFocus)
        return () => {
            removeEventListener("focus", focusI)
            removeEventListener('blur', noFocus)
        }
    })
    const collInput = (e:any) => {
        setSearchV(e.target.value)
        
        let dataArr = searchRes.filter((value:any) => {
            for(let i = 0;i < e.target.value?.length;i++) {
                if(value.title.indexOf(e.target.value?.charAt(i)) !== -1) {
                    return value
                }
            }
        })
        setListSearch(dataArr)
    }

    return (
        <div className={b.header}> 
            <div className={b.content}>
                <ul>
                    <li>
                        <Link href="/"><a>Guanyu</a></Link>
                        <span>  welcome!!!</span>
                    </li>
                    <li>
                        <input type="text" className={b.input} onChange={collInput} placeholder="你想搜索什么呢?"/>
                        <button><img src="/static/search.svg"/></button>
                        <div className={b.serach}>
                            {
                                listSearch.map((value:any) => {
                                    return(
                                        <div key={value.id}>
                                            <Link href={{pathname:"/detail", query:{"id":value.id,"type":"搜索"}}}><a>{value.title}</a></Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </li>
                    <li>
                        <Link href="/"><a> 首页</a></Link>
                    </li>
                </ul>
            </div>
      </div>
    )
}


export default Header