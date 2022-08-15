import { memo ,useEffect} from 'react'
import c from '../../styles/component/footer.module.scss'

interface footerType {
    scrollTop?:number | string
}
const Footer = ({scrollTop}:footerType) => {
    return (
        <footer 
        className={c.footer}
        style={{transform:`translate(0, ${scrollTop}rem)`}}
        >
            <div>
                <span>奋斗后实现的理想是给人永久快乐的<br />不断进取是实现理想的根本</span>
            </div>
        </footer>
    )
}

export default memo(Footer)