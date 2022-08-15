import React,{FC, useState, useEffect, Suspense} from "react"
import {Link, Route, Redirect, Switch} from 'react-router-dom'
import { Layout, Menu, Input, Select, Button, Checkbox, Modal, message, Spin } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {requestIncreaseArticle,requestUpdateArticle} from '../../util/requestMethod'
import { articleAction } from "../../redux/add/action";
import {connect} from 'react-redux'
import './css.scss'
// 懒加载
let Add = React.lazy(() => import(/* webpackChunkName: "add" */ '../../components/Add/Add'));
let List = React.lazy(() => import('../../components/Lists/Lists'));
let Mfile = React.lazy(() => import('../../components/Mfile/Mfile'));



const { Header, Sider, Content } = Layout;
const {Option} = Select

const Main:FC = (props:any) => {
    const [listSingle, setlistSingle] = useState() as any
    const [selectKey, setSelectKey] = useState<string>('')
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [showDatas, setShowDatas] = useState<any>({title:"", p1:"",p2:"",p3:""})
    const [collapsed, setCollapsed] = useState<boolean>(false)
    const [articleTitle, setArticleTitle] = useState<string>('')
    const [isTop, setIsTop] = useState<number>(0)
    const [articleType, setArticleType] = useState<string>('HTML')
    useEffect(() => {
        console.log("main.tsx")
    })
    // 判断是否登陆过，防止复制地址登录
    useEffect(() => {
        if(!sessionStorage.getItem('uniqueIdf')) {
            props.history.replace('/login')
        }
    },[])

    useEffect(() => {
        switch(props.location.pathname) {
            case "/main/add":
                setSelectKey('1')
                break
            case "/main/list":
                setSelectKey('2')
                break
            case "/main/mfile":
                setSelectKey("3")
        }
    },[props.location.pathname])
    // 更新进来的，redux的消息获取
    useEffect(() => {
        if(props.data.listReducer) {
            const {title,istop,type,content, introduce} = props.data.listReducer.data    
            setlistSingle(props.data.listReducer.value.id)
            setArticleTitle(title)
            setArticleType(type)
            setIsTop(istop)
            props.getArticleContent({
                content,
                introduce
            })
        }
    },[props.data.listReducer])

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
      
    const toggle = () => {
        setCollapsed(!collapsed);
    };

    const collectTitle = (values:any) => {
        setArticleTitle(values.target.value)        
    }

    const collectType = (values:string) => {   
        setArticleType(values)
    }

    const collectIsTop = (values:any) => {
        setIsTop(Number(values.target.checked))
    }

    const warning = () => {
        message.warning('标题不能空着！！');
    };

    const collectAllInfo = async() => {
        if(!articleTitle) {
            warning()
            return
        }
        
        // 先判断是不是更新
        if(listSingle) {
            let res = await requestUpdateArticle({
                id:listSingle,
                articleTitle,
                isTop,
                articleType,
                articleIntroduce:props.data.articleContent.introduce,
                articleContent:props.data.articleContent.content
            })
            if(res.data.msg === "更新成功") {
                message.success("更新成功")
                setArticleTitle('')
                setIsTop(0)
                props.getArticleContent({
                    content:"",
                    introduce:""
                })
                setlistSingle()
            }
            return
        }
        
        try {
            let id = String(+new Date())  
            let res = await requestIncreaseArticle({
                aid:id,
                articleTitle,
                isTop,
                articleType,
                articleIntroduce:props.data.articleContent.introduce,
                articleContent:props.data.articleContent.content
            })
            
            if(res.data.data === "添加成功") {
                setIsModalVisible(true);
                setShowDatas({
                    title:"发布成功",
                    p1:"今天的你很努力哦",
                    p2:"又又又多增加了一条博客",
                    p3:"我好崇拜你啊"
                })
                setArticleTitle('')
                setIsTop(0)
                props.getArticleContent({
                    content:"",
                    introduce:""
                })
            }else{
                setIsModalVisible(true);
                setShowDatas({
                    title:"搞错了",
                    p1:"看看你有什么没填写",
                    p2:"有内容是空着的",
                    p3:"别空着"
                })
            }
        }catch(e) {
            console.log("添加文章请求出错", e)
            message.warning("上传请求失败")
        }
        
    }



    return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" selectedKeys={[selectKey]}>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <Link to="/main/add">添加文章</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        <Link to="/main/list">文章管理</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        <Link to="/main/mfile">文件管理</Link>
                    </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                    })}
                    {
                        selectKey === '1' && <>
                            <Input style={{width:'12.5rem'}} value={articleTitle} placeholder="添加标题" required onChange={collectTitle}/>
                            <Select defaultValue={articleType} onChange={collectType} value={articleType}>
                                <Option value="HTML">HTML</Option>
                                <Option value="CSS">CSS</Option>
                                <Option value="JS/TS">JS/TS</Option>
                                <Option value="NODEJS">REST</Option>
                            </Select>
                            <Checkbox onChange={collectIsTop} checked={isTop?true:false} style={{marginLeft:'1.25rem'}}>置顶</Checkbox>
                            <Button type="primary" style={{marginLeft:'1.25rem'}} onClick={collectAllInfo}>发布</Button>
                        </>
                    }
                    </Header>
                    <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                    >   
                        <Suspense fallback={<Spin/>}>
                            <Switch>
                                <Route path="/main/add" component={Add}/>
                                <Route path="/main/list" component={List}/>
                                <Route path="/main/mfile" component={Mfile}/>
                                <Redirect to="/main/add" component={Add}/>
                            </Switch>
                        </Suspense>
                    </Content>
                </Layout>
                <Modal title={showDatas.title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <p>{showDatas.p1}</p>
                    <p>{showDatas.p2}</p>
                    <p>{showDatas.p3}</p>
                </Modal>
            </Layout>
            );
}

export default connect(
    state => ({data:state}),
    {
        getArticleContent:articleAction
    }
)(Main)