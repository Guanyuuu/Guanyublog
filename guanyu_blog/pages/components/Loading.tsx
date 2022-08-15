import { FC, useState } from "react";
import l from "../../styles/component/loading.module.scss"

const Loading:FC = () => {
    const [content] = useState<number[]>([1, 2])

    return (
        <div className={l.screen}>
            {
                content.map((value:number) => {
                    return (
                        <div className={l.content} key={value}>
                            <div className={`${l.title} ${l.skeleton}`}></div>
                            <div className={`${l.type} ${l.skeleton}`}></div>
                            <div className={`${l.introduce} ${l.skeleton}`}></div>
                            <div className={`${l.checkall} ${l.skeleton}`}></div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Loading