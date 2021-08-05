const initState = null

export default function articleContent(prestate=initState, action:any) {
    const {type, data} = action
    
    switch(type){
        case "content":
            return data
        default:
            return ''
    }
}