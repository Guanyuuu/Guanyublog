import React,{FC, useEffect, useState} from "react";
import {List, Row, Col, Button, message, Popconfirm } from 'antd'
import { connect } from "react-redux"; 
import {ayGetSingle} from "../../redux/list/action"
import {requestArticles, requestDeleteArticle} from '../../util/requestMethod'
import './css.scss'

const Lists:FC = (props:any) => {
    const [list, setList] = useState([{id:0,title:'',type:'',time:'',count:''}])
    const [deleFlag, setDeleFlag] = useState('')
    useEffect(() => {
         (async () => {
             let res = await requestArticles()
             setList(res.data.res)
             setDeleFlag('0')
         })()
    },[deleFlag])

    const handleConfirm = async (id:number) => {
        let res = await requestDeleteArticle({id})
        console.log(res.config.data["id"]);
        
        if(res.data.data === "删除成功") {
            setDeleFlag('1')
            message.success('删除成功!!');
        }
    }

    const handleUpdate = async(id:number) => {
        props.getsinglearticle({id})
        props.history.push('/main/add')
    }

    return (
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
                        <Button type="primary" onClick={() => {handleUpdate(item.id)}}>更改</Button>
                        <Popconfirm 
                        title="是否确定要删除"
                        onConfirm={() => {handleConfirm(item.id)}}
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
    )
}

export default connect(
    state => ({data:state}),
    {
        getsinglearticle:ayGetSingle
    }
)(Lists)