import { FC, useEffect, useState } from "react";
import "./css.scss"
import kenan1 from "../../assets/kenan1.jpg"
import kenan2 from "../../assets/kenan2.jpg"
import kenan3 from "../../assets/kenan3.jpg"

interface props {
    history:any
}

const Slide:FC<props> = (props) => {
    // 图片列表
    const [imageList] = useState<any[]>([kenan1, kenan2, kenan3])
    // 目标位置
    const [originPos, setOriginPos] = useState<number>(0)
    // 鼠标是否按下
    const [isDown, setIsDown] = useState<boolean>(false)
    // 鼠标移动的距离
    const [distance, setDistance] = useState<number>(0)
    // 鼠标down的最初位置
    const [slideOrigin, setSlideOrigin] = useState<number>(0)

    useEffect(() => {
        interface canT {
            width:number
            height:number
        }
        class CanvasVer {
            width:number
            height:number
            constructor({width, height}:canT) {
                this.width = width
                this.height = height
            }
            init(id:string):object {
                try {
                    let canvas:any = document.querySelector(id)
                    canvas.width = this.width
                    canvas.height = this.height
                    return canvas.getContext("2d")
                }catch(e) {
                    return {e}
                }
            }
            drawCanvas(callback:Function):number {
                return callback()
            }
        }

        function getRandom():number {
            return Math.random()*3 >> 0
        }
        
        function slideLogin() {
            let canvas1 = new CanvasVer({width:500, height:300})
            let canvas2 = new CanvasVer({width:500, height:300})
            let ctx1:any = canvas1.init("#image-canvas")
            let ctx2:any = canvas2.init("#image-canvas-top")
            let radomn:number = getRandom()
            // 绘制图片， 返回截取图片的位置
            let pos:number = canvas1.drawCanvas(() => {
                let img = new Image()
                img.src = imageList[radomn]
                img.onload = function() {
                    ctx1.drawImage(img, 0, 0, 500, 300)
                    ctx1.lineWidth = 2
                    ctx1.strokeStyle = "#fff"
                    ctx1.moveTo(375, 150)
                    ctx1.lineTo(375, 200)
                    ctx1.lineTo(425, 200)
                    ctx1.lineTo(425, 190)
                    ctx1.arc(430, 180, 10, 2*Math.PI/3, 4*Math.PI/3, true)
                    ctx1.lineTo(425, 150)
                    ctx1.lineTo(420, 150)
                    ctx1.arc(410, 155, 10, 11*Math.PI/6, 7*Math.PI/6)
                    ctx1.lineTo(375, 150)
                    ctx1.stroke()
                    ctx1.fillStyle = "rgba(255, 255, 255, 0.7)"
                    ctx1.fill()
                }
                return 350
            })
            canvas2.drawCanvas(() => {
                let img = new Image()
                img.src = imageList[radomn]
                img.onload = function() {
                    ctx2.lineWidth = 2
                    ctx2.strokeStyle = "#fff"
                    ctx2.moveTo(375, 150)
                    ctx2.lineTo(375, 200)
                    ctx2.lineTo(425, 200)
                    ctx2.lineTo(425, 190)
                    ctx2.arc(430, 180, 10, 2*Math.PI/3, 4*Math.PI/3, true)
                    ctx2.lineTo(425, 150)
                    ctx2.lineTo(420, 150)
                    ctx2.arc(410, 155, 10, 11*Math.PI/6, 7*Math.PI/6)
                    ctx2.lineTo(375, 150)
                    ctx2.stroke()
                    ctx2.clip()
                    ctx2.drawImage(img, 0, 0, 500, 300)
                }
                return 350
            })
            setOriginPos(pos)
        }
        slideLogin()
    }, [imageList])

    const mouseDownHandle = (e:any) => {
        const {button, screenX} = e
        
        if(!button) {
            setSlideOrigin(screenX)
            setIsDown(true)
        }
    }

    const mouseMoveHandle = (e:any) => {
        const {screenX} = e
        if(isDown) {
            if(screenX - slideOrigin > 0 && screenX - slideOrigin < 400) {
                setDistance(screenX - slideOrigin)
            } else if(screenX - slideOrigin < 0) {
                setDistance(0)
            } else if(screenX - slideOrigin >= 400) {
                setDistance(400)
            }
        }
    }

    const mouseUpHandle = async (e:any) => {
        const {button, screenX} = e

        if(!button) {
            setIsDown(false)
            if(Math.abs(screenX - slideOrigin - originPos) < 2) {
                props.history.replace('/main')
            }else {
                setDistance(0)
            }
        }
    }


    return (
        <div className="slide">
            <div className="slide-canvas">
                <canvas id="image-canvas"></canvas>
                <canvas 
                id="image-canvas-top" 
                style={{
                    transform:`translateX(${distance}px)`
                }}
                ></canvas>
            </div>
            <div className="slide-operate">向右滑动完成拼图
                <div 
                className="slide-block"
                onMouseDown={mouseDownHandle}
                onMouseMove={mouseMoveHandle}
                onMouseUp = {mouseUpHandle}
                style={{
                    transform:`translateX(${distance}px)`
                }}
                ></div>
            </div>
        </div>
    )
}

export default Slide