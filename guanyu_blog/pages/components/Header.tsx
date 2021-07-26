import React,{useEffect} from 'react'
import Link from 'next/link'
import b from '../../styles/component/header.module.scss'

const Header = () => {
    return (
        <div className={b.header}> 
            <div className={b.content}>
                <ul>
                    <li>
                        <img src="/static/kenan.webp"/>
                        <span>  welcome!!!</span>
                    </li>
                    <li>
                        <input type="text" placeholder="你想搜索什么呢?"/>
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