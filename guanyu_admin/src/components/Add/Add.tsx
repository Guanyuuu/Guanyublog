import React,{FC, useState, useEffect, useRef} from "react";
import {Input} from 'antd'
import {connect} from 'react-redux'
import hljs from "highlight.js"
import {marked} from "marked"
import {articleAction} from '../../redux/add/action'
import './css.scss'
import 'highlight.js/styles/github-dark.css'


const {TextArea} = Input

const Add:FC = (props:any) => {
    const [textValue, setTextValue] = useState<string>('')

    const textRef = useRef<any>()

    const textareaChange = (e:any) => {
        // 提取介绍
        let html = e.target.value
        marked.parse(html,{
            renderer: new marked.Renderer(),
            highlight: function(code:any, lang:any) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            langPrefix: 'hljs language-',
                pedantic: false,
                gfm: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false
          },function(err, htmlblock) {
            let reg = /<.*?>|\n/g
            let r = htmlblock.replace(reg, "")        
            
            setTextValue(htmlblock)
            props.getArticleContent({
                content:html,
                introduce:r.slice(0, 100)
            })
          })
    }
    // 当不是更新时，内容为空
    useEffect(() => {
        if(props.data.articleContent.content === '') {
            setTextValue('')
        }else if(props.data.articleContent.content !== '') {
            setTextValue(props.data.articleContent.content)
        }
    },[props.data.articleContent.content])

    const handleSlide = (e:any):void => {
        let scrollTop = e.target.scrollTop
        textRef.current.scrollTop = scrollTop
    }
    
    
    return (
        <div className="text-con">
            <TextArea autoFocus 
            value={props.data.articleContent.content} 
            onChange={textareaChange} 
            onScroll={handleSlide}
            />
            <div 
            className="card" 
            ref={textRef} 
            dangerouslySetInnerHTML={{__html:textValue}}
            ></div>
        </div>
    )
}

export default connect(
    state => ({data: state}),
    {
        getArticleContent:articleAction,
    }
)(Add)