import React,{FC, useEffect, useState} from "react";
import {List, Row, Col, Button, message, Popconfirm, Spin } from 'antd'
import { connect } from "react-redux"; 
import {ayGetSingle} from "../../redux/list/action"
import {requestArticles, requestDeleteArticle} from '../../util/requestMethod'
import './css.scss'

const Lists:FC = (props:any) => {
    const [list, setList] = useState([{aid:0,title:'',type:'',time:'',count:''}])
    const [spin, setSpin] = useState(true)
    const [deleFlag, setDeleFlag] = useState('')
    useEffect(() => {
         (async () => {
             try {
                let res = await requestArticles()
                setList(res.data.res)
                setDeleFlag('0')
             }catch(e) {
                console.log("文章列表请求出错", e)
             }
             setSpin(false)
         })()
    },[deleFlag])

    const handleConfirm = async (id:number) => {
        try {
            let res = await requestDeleteArticle({id})
            if(res.data.data === "删除成功") {
                setDeleFlag('1')
                message.success('删除成功!!');
            }
        }catch(e) {
            console.log("文章删除失败:", e)
            message.warning('删除失败')
        }
    }

    const handleUpdate = async(id:number) => {
        props.getsinglearticle({id})
        setTimeout(() => {
            props.history.push('/main')
        }, 0);
    }

    return (
        <>
        {
            spin ?
                <div className="spin">
                    <Spin spinning={spin} size="large" />
                </div>:
             <div className="article-list">
                <List
                bordered
                header={
                    <Row>
                        <Col span={8}>文章标题</Col>
                        <Col span={4}>类型</Col>
                        <Col span={4}>发布时间</Col>
                        <Col span={4}>浏览量</Col>
                        <Col span={4}>操作</Col>
                    </Row>
                }
                dataSource={list}
                renderItem={item => (
                    <Row className="list-style">
                        <Col span={8}>{item.title}</Col>
                        <Col span={4}>{item.type}</Col>
                        <Col span={4}>{item.time}</Col>
                        <Col span={4}>{item.count}</Col>
                        <Col span={4}>
                            <Button type="primary" onClick={() => {handleUpdate(item.aid)}}>更改</Button>
                            <Popconfirm 
                            title="是否确定要删除"
                            onConfirm={() => {handleConfirm(item.aid)}}
                            okText="确认"
                            cancelText="取消"
                            >
                                <Button type="primary" danger>删除</Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                )}
                ></List>
            </div>
        }
        </>
    )
}

export default connect(
    state => ({data:state}),
    {
        getsinglearticle:ayGetSingle
    }
)(Lists)