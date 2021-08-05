const initState:[] = []

export default function listReducer(init = initState, action:any){
    const {type, data} = action
    
    switch(type){
        case "single":
            return data
        default:
            return ""
    }
}