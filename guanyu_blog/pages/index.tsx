import React, {FC, useEffect, useState, useRef, useCallback} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
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
  const [scrollTopCompute, setScrollTopCompute] = useState<number>(0)  
  // 进行列表请求，每滚动一个160，则请求2个新的列表数据
  // 该值每次再tab栏切换后，需要进行重置
  const aidRef = useRef<number>(15)
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

  // 监控窗口的变化达到动态改变rem值
  const slideHederRef = useRef<any>()
  const [htmlFont, setHtmlFont] = useState<number>(0)
  const resizeChangeRem = (e:any) => {
    let clientWidth = e.target.innerWidth
    slideHederRef.current = clientWidth
    let rem = 1396 / 100
    let font = clientWidth / rem
    setHtmlFont(font)
    document.documentElement.style.fontSize = `${font}px`
  }
  useEffect(() => {
    // 执行第一次
    let clientWidth = document.documentElement.clientWidth
    slideHederRef.current = clientWidth
    let rem = 1396 / 100
    let font = clientWidth / rem
    setHtmlFont(font)
    document.documentElement.style.fontSize = `${font}px`
  },[])
  useEffect(() => {
    window.addEventListener('resize', resizeChangeRem)
    return () => {
      window.removeEventListener('resize', resizeChangeRem)
    }
  },[])
    
  const reload = async(sessionType:string) => {
    let limit:any = {
      m:0,
      n:15,
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
      let topD = lists.filter((value:any) => value.istop === 1)
      let botD = lists.filter((value:any) => value.istop !== 1)
      let res = [...topD, ...botD]
      // 恢复aid的排序
      aidRef.current = 15
      isLoading.current = true
      tabCurrentDataRef.current = lists
      setAllIndexData({
        renderData:res.slice(0, 15),
        containerHeight:lists.length * 1.6 + 2.38
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
        renderData:res.slice(0, 15),
        containerHeight:res.length * 1.6 + 2.38
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

  const isHandleScrollRef = useRef<any>(false)
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

      // 更新滚动的距离和容器滚动，容器滚动顶部会触发滚动事件，则需要取消事件
      isHandleScrollRef.current = true
      // 设置列表滚动为零
      setScrollTopCompute(0)
      guanyuRef.current.scrollTop = 0
      isHandleScrollRef.current = false
      // 根据tab栏进行请求
      let limit:any = {
        m:0,
        n:15,
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
        // 置顶排序
        let topD = lists.filter((value:any) => value.istop === 1)
        let botD = lists.filter((value:any) => value.istop !== 1)
        let res = [...topD, ...botD]
        // 恢复aid的排序
        aidRef.current = 15
        isLoading.current = true
        tabCurrentDataRef.current = lists
        setAllIndexData({
          renderData:res.slice(0, 15),
          containerHeight:lists.length * 1.6 + 2.38   
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
    if(slideHederRef.current > 830) {
      if(scrollTop > 200 && navIndexScrollTop <= 200) {
        let toStyles = {
          transform:'translate(0,-0.6rem)',
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
    }else {
      if(scrollTop > 200 && navIndexScrollTop <= 200) {
        let toStyles = {
          transform:'translate(0,-2.1834rem)',
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
  }
  // 数据预加载,包括区分搜索状态下的数据请求
  async function listScrollRequest(top:number) {
    if(isPrefetchLoadingRef.current) return
    if(((top / 160 >> 0) * 2) <= aidRef.current - 15) return
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
    let limit:any = {
      m:aidRef.current,
      n:2,
      t:tabTypeRef.current
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
    // 如果点击跳转顶部，不触发滚动事件
    if(isHandleScrollRef.current) return
    let font = slideHederRef.current / (1396 / 100)
    // 转为rem大小, 以及移动端和PC不同的样式上
    let articleHeight = slideHederRef.current > 830 ? 1.6 : 5.7272
    let start = Math.max((scrollTop - articleHeight * 2 * font) / (articleHeight * font) >> 0, 0)
    if(start > tabCurrentDataRef.current.length - 15) return
    if(virtualDataLengthRef.current === start) return
    virtualDataLengthRef.current = start
    let end = start + 15
    let newRenderData = tabCurrentDataRef.current.slice(start, end)
    let transform = scrollTop - articleHeight * 2 * font - scrollTop % (articleHeight * font)
    setScrollTopCompute(transform / font)
    setAllIndexData({
      renderData:newRenderData,
      containerHeight:tabCurrentDataRef.current.length * 1.6 + 2.38
    })
  } 

  // 处理navigation，hover的情况
  // state用于存储滚动的距离，用来判断是否应该触发,鼠标移入nav触发的动画
  const [navIndexScrollTop, setIndexNavScrollTop] = useState<number>(0)
  const hoverNavigationEnter = (e:any):void => {
      const element = e.target
      if(element.id !== "navright") return
      if(navIndexScrollTop > 200) {
          let toStyles = {
              transform:"translate(0, 0)",
              transition:"transform 0.3s ease"
          }
          setToStyle(toStyles)
      }
  }

  const  hoverNavigationLeave = ():void => {
      
      if(slideHederRef.current > 830) {
        if(navIndexScrollTop > 200) {
            let toStyles = {
                transform:'translate(0,-0.6rem)',
                transition:'transform 0.3s ease'
            }
            setToStyle(toStyles)
        }
      }else {
        if(navIndexScrollTop > 200) {
            let toStyles = {
                transform:'translate(0,-2.1834rem)',
                transition:'transform 0.3s ease'
            }
            setToStyle(toStyles)
        }
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
    // 设置预加载数据未完成
    isPrefetchLoadingRef.current = false
    // 设置初始10个数据
    aidRef.current = 15
    // 切换tab的类型
    tabTypeRef.current = "REC"
    setScrollTopCompute(0)
    setAllIndexData({
      renderData:data.slice(0, 15),
      containerHeight:data.length * 1.6 + 2.38
    })
  },[])


  // 处理一个content项跳转到detail
  const handleJumpDetail = async(id:string) => {
    let url = `/detail?aid=${id}&type=${tabTypeRef.current}`
    window.open(url, '_blank')
    try {
      await Axios.get(`${urlPath.increaseArticleAccess}/${id}`)
    }catch(e) {
      console.log("访问量增长出错：", e)
    }
  }

  useEffect(() => {
    console.log("index");
    
  })
  
  const guanyuRef = useRef<any>()
  return (
    <div 
    ref={guanyuRef}
    className={a.guanyu}
    onScroll={handleVirtual}
    >
      <Head>
        <title>guanyu</title>
        <meta name="viewport" content='width=device-width, height=device-height,initial-scale=1, user-scalable=no'/>
        <meta name="description" content="guanyu blog"/>
        <meta name="keywords" content="guanyu,blog,前端,ES规范"/>
        <link rel="icon" href="../static/kenan.jpg" type='image/jpg'/>
      </Head>
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
          id="nav"
          onClick={handleType}
          ref={navRef}
          >
            <Link href="#" prefetch={false} shallow scroll><a>REC</a></Link>
            <Link href="#" prefetch={false} shallow scroll><a>HTML</a></Link>
            <Link href="#" prefetch={false} shallow scroll><a>CSS</a></Link>
            <Link href="#" prefetch={false} shallow scroll><a>JS/TS</a></Link>
            <Link href="#" prefetch={false} shallow scroll><a>REST</a></Link>
          </div>
          <div
          className={a.navright}
          id="navright"
          ></div>
        </div>
      </header>
      <div 
      className={a.section}  
      >
        <div className={a.article}
         style={{transform:`translate(0, ${scrollTopCompute}rem)`}} 
        >
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
                        <Image src={typeimg} alt="" 
                        width={slideHederRef.current > 830 ? 0.16 * htmlFont : 0.48 * htmlFont} 
                        height={slideHederRef.current > 830 ? 0.16 * htmlFont : 0.48 * htmlFont}
                        /> 
                      </span>
                      <span className={a.literal}>{value.type}</span>
                      <span className={a.count}>
                        <Image src={countimg} alt="" 
                        width={slideHederRef.current > 830 ? 0.18 * htmlFont : 0.54 * htmlFont} 
                        height={slideHederRef.current > 830 ? 0.18 * htmlFont : 0.54 * htmlFont}
                        /> 
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
    n:15,
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
