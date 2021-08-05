import React,{FC, useState, useEffect} from "react";
import {Input} from 'antd'
import {connect} from 'react-redux'
import {articleAction} from '../../redux/add/action'
import './css.scss'

const {TextArea} = Input

const marked = require('marked')



const Add:FC = (props:any) => {
    const [textValue, setTextValue] = useState('')
    marked.setOptions({
        renderer: marked.Renderer(),
        pedantic: false,
        gfm: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      });

    const textareaChange = (e:any) => {
        let html = marked(e.target.value)
        setTextValue(html)
        props.getArticleContent(e.target.value)
    }

    useEffect(() => {
        if(props.data.articleContent === '') {
            setTextValue('')
        }
    },[props.data.articleContent])
    
    return (
        <div className="text-con">
            <TextArea autoFocus value={props.data.articleContent} onChange={textareaChange} />
            <div className="card" dangerouslySetInnerHTML={{__html:textValue}}></div>
        </div>
    )
}

export default connect(
    state => ({data: state}),
    {
        getArticleContent:articleAction
    }
)(Add)