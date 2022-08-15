import React, {FC, useEffect, useState, useRef, useCallback} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Axios from 'axios'
import Header from './components/Header'
import Footer from './components/Footer'
import Ad from './components/Ad'
import Loading from './components/Loading'
import urlPath  from '../config/apiUrl'
import { indexProps, styleType, op } from '../type/api'
import a from '../styles/index.module.scss'
import typeimg from '../static/type.svg'
import countimg from '../static/count.svg'

interface allData {
  renderData:any[]
  containerHeight:number
}


const Index:FC<indexProps> = ({res}:indexProps) => {
  // 总的同步渲染数据
  const [allIndexData, setAllIndexData] = useState<allData>({
    // 当前选项页面正在渲染的数据
    renderData:[],
    containerHeight:0
  })
  // transform的高度不应该有默认值，否则会导致位置闪烁
  const [scrollTopCompute, setScrollTopCompute] = useState<number>()  
  // 进行列表请求，每滚动一个160，则请求2个新的列表数据
  // 该值每次再tab栏切换后，需要进行重置
  const aidRef = useRef<number>(10)
  // 导航栏ref
  const navRef = useRef<any>()
  // 用于存储页面tab的总的数据，由于总的数据变化不一定需要页面进行渲染
  const tabCurrentDataRef = useRef<[]>([])
  // 记录tab栏type的变化
  const tabTypeRef = useRef<string>()
  // 记录当前是否是search状态
  const isSearchOptionsRef = useRef<op>({
    isSearch:false,
    keyWord:""
  })
  // 管理当前tab的数据是否预加载完，默认false
  const isPrefetchLoadingRef = useRef<boolean>(false)
  // 判断loading骨架屏
  const isLoading = useRef(true)
    
  const reload = async(sessionType:string) => {
    let limit:any = {
      m:0,
      n:10,
      t:sessionType
    }
    if(limit.t === "JS/TS") {
      limit.t = "JSTS"
    }
    limit = JSON.stringify(limit)
    try {
      // 每次请求时改变loading为false，让其加载骨架屏
      isLoading.current = false
      let data = await Axios.get(`${urlPath.getArticleByLimit}/${limit}`)
      let lists = data.data.res
      // 恢复aid的排序
      aidRef.current = 10
      isLoading.current = true
      tabCurrentDataRef.current = lists
      setAllIndexData({
        renderData:lists.slice(0, 8),
        containerHeight:lists.length * 10 + 14.875
      })
    }catch(e) {
      console.log("tab数据请求出错:", e)
    }
  }
  // 做推荐列表初次加载的数据jiequ 
  // 页面刷新type刷新
  useEffect(() => {
    let sessionType = sessionStorage.getItem("type")
    if(!sessionType) {
      // 页面首次加载
      tabCurrentDataRef.current = res
      tabTypeRef.current = "REC"
      setAllIndexData({
        renderData:res.slice(0, 8),
        containerHeight:res.length * 10 + 14.875
      })
    }else {
      // 页面进行刷新, 加载上次tab栏的数据
      tabTypeRef.current = sessionType
      let links = navRef.current
      links.childNodes.forEach((value:any) => {
        if(value.innerHTML === sessionType) {
          value.style.color = 'rgb(0, 127, 255)'
        }else {
          value.style.color = 'rgba(0, 0, 0, 0.8)'
        }
      })
      reload(sessionType)
    }
  },[res])

  // tab栏的切换动画
  // tab栏的各项数据点击加载
  const handleType = async(e:any) => {
    let childValue = ["REC","HTML","CSS","JS/TS","REST"]
    if(childValue.includes(e.target.innerHTML)) {
      let links = navRef.current
      links.childNodes.forEach((value:any) => {
        value.style.color = 'rgba(0, 0, 0, 0.8)'
      })
      e.target.style.color = 'rgb(0, 127, 255)'
      // 更新预加载标识
      isPrefetchLoadingRef.current = false
      // 更新不是搜索状态
      isSearchOptionsRef.current = {
        isSearch:false,
        keyWord:""
      }
      sessionStorage.setItem("type", e.target.innerHTML)
      // 根据tab栏进行请求
      let limit:any = {
        m:0,
        n:10,
        t:e.target.innerHTML
      }
      if(limit.t === "JS/TS") {
        limit.t = "JSTS"
      }
      tabTypeRef.current = limit.t
      limit = JSON.stringify(limit)
      try {
        // 每次请求时改变loading为false，让其加载骨架屏
        isLoading.current = false
        let data = await Axios.get(`${urlPath.getArticleByLimit}/${limit}`)
        let lists = data.data.res
        // 恢复aid的排序
        aidRef.current = 10
        isLoading.current = true
        tabCurrentDataRef.current = lists
        setAllIndexData({
          renderData:lists.slice(0, 8),
          containerHeight:lists.length * 10 + 14.875
        })
      }catch(e) {
        console.log("tab数据请求出错:", e)
      }
    }
  }
  const [toStyle, setToStyle] = useState<styleType>({
    transform:"none",
    transition:"none"
  })

   // header动画
  function headerSlide(scrollTop:number):void {
    // 头部滚动触发动画只有那在哪一瞬间触发，其余的忽略
    if(scrollTop > 200 && navIndexScrollTop <= 200) {
      let toStyles = {
        transform:'translate(0,-3.75rem)',
        transition:'transform 0.6s ease'
      }
      setToStyle(toStyles)
    }else if(scrollTop <= 200 && navIndexScrollTop > 200) {
      let toStyles = {
        transform:"translate(0, 0)",
        transition:"transform 0.6s ease"
      }
      setToStyle(toStyles)
    }
  }
  // 数据预加载,包括区分搜索状态下的数据请求
  async function listScrollRequest(top:number) {
    if(isPrefetchLoadingRef.current) return
    if(((top / 160 >> 0) * 2) <= aidRef.current - 10) return
    let {isSearch, keyWord} = isSearchOptionsRef.current
    // 在搜索状态下，进行预加载数据
    if(isSearch) {
      try {
        let limit:any = {
            m:aidRef.current,
            n:2,
            keyWord:keyWord
        }
        limit = JSON.stringify(limit)
        let res = await Axios.get(`${urlPath.searchArticles}/${limit}`)
        let data = res.data.res
        // 没有数据后，进行标识，用于不再发送新的请求
        if(data.length === 0) {
          isPrefetchLoadingRef.current = true
          return
        }
        let newListData = [...tabCurrentDataRef.current, ...data] as []
        aidRef.current = aidRef.current + 2
        tabCurrentDataRef.current = newListData
        return

      }catch(e) {
          console.log("预加载搜索数据失败：",e)
      }
    }
    // 非搜索状态下
    let sessionType = sessionStorage.getItem("type")

    let limit:any = {
      m:aidRef.current,
      n:2,
      t:sessionType
    }
    if(limit.t === "JS/TS") {
      limit.t = "JSTS"
    }
    limit = JSON.stringify(limit)
    try {
      aidRef.current = aidRef.current + 2
      let data = await Axios.get(`${urlPath.getArticleByLimit}/${limit}`)
      let lists = data.data.res
       // 没有数据后，进行标识，用于不再发送新的请求
       if(lists.length === 0) {
        isPrefetchLoadingRef.current = true
        return
      }
      let newListData = [...tabCurrentDataRef.current, ...lists] as []
      // 如果没有数据了，则阻止刷新
      if(lists.length === 0) return
      tabCurrentDataRef.current = newListData
    }catch(e) {
      console.log("预加载数据请求出错:", e)
    }
  }
  // 进行虚拟列表滚动的计算
  // 并进行数据预加载
  const virtualDataLengthRef = useRef<any>(0)
  const handleVirtual = (e:any):void => {
    let scrollTop = e.target.scrollTop
    headerSlide(scrollTop)
    // 进行数据预加载
    listScrollRequest(scrollTop)
    if(scrollTop < 200 && navIndexScrollTop > 200) {
        setIndexNavScrollTop(scrollTop)
    }else if(scrollTop > 200 && navIndexScrollTop < 200) {
        setIndexNavScrollTop(scrollTop)
    }
    let start = Math.max((scrollTop - 320) / 160 >> 0, 0)
    if(start > tabCurrentDataRef.current.length - 8) return
    if(virtualDataLengthRef.current === start) return
    virtualDataLengthRef.current = start
    let end = start + 8
    let newRenderData = tabCurrentDataRef.current.slice(start, end)
    let transform = scrollTop - 320 - scrollTop % 160
    setScrollTopCompute(transform / 16)
    setAllIndexData({
      renderData:newRenderData,
      containerHeight:tabCurrentDataRef.current.length * 10 + 14.875
    })
  } 

  // 处理navigation，hover的情况
  // state用于存储滚动的距离，用来判断是否应该触发,鼠标移入nav触发的动画
  const [navIndexScrollTop, setIndexNavScrollTop] = useState<number>(0)
  const hoverNavigationEnter = ():void => {
      if(navIndexScrollTop > 200) {
          let toStyles = {
              transform:"translate(0, 0)",
              transition:"transform 0.3s ease"
          }
          setToStyle(toStyles)
      }
  }

  const  hoverNavigationLeave = ():void => {
      if(navIndexScrollTop > 200) {
          let toStyles = {
              transform:'translate(0,-3.75rem)',
              transition:'transform 0.3s ease'
          }
          setToStyle(toStyles)
      }
  }

  // 获取搜索后的结果列表
  const getSearchList = useCallback((data:[], options:any):void => {
    // 变化为搜索状态
    isSearchOptionsRef.current = options
    let links = navRef.current
    links.childNodes.forEach((value:any, index:number) => {
      if(index === 0) {
        value.style.color = 'rgb(0, 127, 255)'
      }else {
        value.style.color = 'rgba(0, 0, 0, 0.8)'
      }
    })
    tabCurrentDataRef.current = data
    setAllIndexData({
      renderData:data.slice(0, 8),
      containerHeight:data.length * 10 + 14.875
    })
  },[])

  // 处理点击量
  const handleIncreaseArticleAccess = async(e:any) => {
    if(e.target.id) {
      try {
        await Axios.get(`${urlPath.increaseArticleAccess}/${e.target.id}`)
      }catch(e) {
        console.log("访问量增长出错：", e)
      }
    }
  }

  // 处理一个content项跳转到detail
  const handleJumpDetail = (id:string):void => {
    let url = `/detail?aid=${id}&type=${tabTypeRef.current}`
    window.open(url, '_blank')
  }

  useEffect(() => {
    let width = document.documentElement.clientWidth
    console.log(width);
    
    
  })
  return (
    <div 
    className={a.guanyu}
    onScroll={handleVirtual}
    >
      <div
      className={a.space_height}
      style={{
        height:`${allIndexData.containerHeight}rem`
      }}
      ></div>
      <header 
      className={a.top_header} 
      style={toStyle}
      onMouseEnter={hoverNavigationEnter}
      onMouseLeave={hoverNavigationLeave}
      >
        <Header
        searchFunction={getSearchList}
        />
        <div 
        className={a.navigation} 
        >
          <div 
          className={a.nav} 
          onClick={handleType}
          ref={navRef}
          >
            <Link href="#" prefetch={false} shallow><a>REC</a></Link>
            <Link href="#" prefetch={false} shallow><a>HTML</a></Link>
            <Link href="#" prefetch={false} shallow><a>CSS</a></Link>
            <Link href="#" prefetch={false} shallow><a>JS/TS</a></Link>
            <Link href="#" prefetch={false} shallow><a>REST</a></Link>
          </div>
        </div>
      </header>
      <div 
      className={a.section}  
      >
        <div className={a.article} style={
          scrollTopCompute ? {transform:`translate(0, ${scrollTopCompute}rem)`} : {}
        } onClick={handleIncreaseArticleAccess}>
          {
            isLoading.current ?
            allIndexData?.renderData.map((value:any) => {
              return(
                  <div className={a.arcontent} key={value.aid} 
                  onClick={() => {handleJumpDetail(value.aid)}}
                  id={value.aid}
                  >
                    <div className={a.title}>
                      <Link href="" prefetch={false}>
                        <a id={value.aid}>{value.title}</a>
                      </Link>
                    </div>
                    <div className={a.type}>
                      {value.istop ? <span className={a.top}>置顶</span> : ''}
                      <span className={a.time}>{value.time.substr(0,10)}</span>
                      <span className={a.artype}>
                        <Image src={typeimg} alt="" width={16} height={16}/> 
                      </span>
                      <span className={a.literal}>{value.type}</span>
                      <span className={a.count}>
                        <Image src={countimg} alt="" width={18} height={18}/> 
                      </span>
                      <span className={a.literal}>{value.count}</span>
                    </div> 
                    <div className={a.introduce}>{value.introduce}</div>
                    <div className={a.checkall}>
                      <Link href="" prefetch={false}><a>览全部 &gt;</a></Link>
                    </div>
                  </div>
              )
            })
            :<Loading/>
          }
        </div> 
        <Ad />
      </div>
      <Footer scrollTop={scrollTopCompute}/>
    </div>
  )
}

export async function getStaticProps() {
  let limit:any = {
    m:0,
    n:10,
    t:"REC"
  }
  limit = JSON.stringify(limit)
  let data = await Axios.get(`${urlPath.getArticleByLimit}/${limit}`)
  let topD = data.data.res.filter((value:any) => value.istop === 1)
  let botD = data.data.res.filter((value:any) => value.istop !== 1)
  let res = [...topD, ...botD]
  return {
    props:{res}
  }
}


export default Index
