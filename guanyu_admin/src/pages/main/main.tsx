import React,{FC, useState, useEffect} from "react"
import {Link, Route, Redirect, Switch} from 'react-router-dom'
import { Layout, Menu, Input, Select, Button, Checkbox, Modal, message } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import Add from '../../components/Add/Add'
import List from '../../components/Lists/Lists'
import Comms from '../../components/Comms/Comms'
import {requestIncreaseArticle,requestUpdateArticle} from '../../util/requestMethod'
import { articleAction } from "../../redux/add/action";
import {connect} from 'react-redux'
import './css.scss'


const { Header, Sider, Content } = Layout;
const {Option} = Select

const Main:FC = (props:any) => {
    const [listSingle, setlistSingle] = useState() as any
    const [selectKey, setSelectKey] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showDatas, setShowDatas] = useState({title:"", p1:"",p2:"",p3:""})
    const [collapsed, setCollapsed] = useState(false)
    const [articleTitle, setArticleTitle] = useState('')
    const [isTop, setIsTop] = useState(0)
    const [articleType, setArticleType] = useState('HTML')
    // 判断是否登陆过，防止复制地址登录
    useEffect(() => {
        if(!sessionStorage.getItem('uniqueIdf')) {
            props.history.replace('/login')
        }
    })

    useEffect(() => {
        switch(props.location.pathname) {
            case "/main/add":
                setSelectKey('1')
                break
            case "/main/list":
                setSelectKey('2')
                break
            case "/main/comms":
                setSelectKey("3")
        }
    },[props.location.pathname])

    useEffect(() => {
        if(props.data.listReducer) {
            const {title,istop,type,content} = props.data.listReducer.data    
            setlistSingle(props.data.listReducer)
            setArticleTitle(title)
            setArticleType(type)
            setIsTop(istop)
            props.getArticleContent(content)
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
        

        if(listSingle) {
            let res = await requestUpdateArticle({
                id:listSingle?.value.id,
                articleTitle,
                isTop,
                articleType,
                articleIntroduce:props.data.articleContent.substr(0, 100),
                articleContent:props.data.articleContent
            })
            if(res.data.msg === "更新成功") {
                message.success("更新成功")
                setArticleTitle('')
                setArticleType('HTML')
                setIsTop(0)
                props.getArticleContent('')
                setlistSingle()
            }
            return
        }
        
        let res = await requestIncreaseArticle({
            articleTitle,
            isTop,
            articleType,
            articleIntroduce:props.data.articleContent.substr(0, 100),
            articleContent:props.data.articleContent
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
            setArticleType('HTML')
            setIsTop(0)
            props.getArticleContent('')
        }else{
            setIsModalVisible(true);
            setShowDatas({
                title:"搞错了",
                p1:"看看你有什么没填写",
                p2:"有内容是空着的",
                p3:"别空着"
            })
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
                        <Link to="/main/comms">评论管理</Link>
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
                            <Select defaultValue={articleType} onChange={collectType}>
                                <Option value="HTML">HTML</Option>
                                <Option value="CSS">CSS</Option>
                                <Option value="JS/TS">JS/TS</Option>
                                <Option value="NODEJS">NODEJS</Option>
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
                        <Switch>
                            <Route path="/main/add" component={Add}/>
                            <Route path="/main/list" component={List}/>
                            <Route path="/main/comms" component={Comms}/>
                            <Redirect to="/main/add" component={Add}/>
                        </Switch>
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