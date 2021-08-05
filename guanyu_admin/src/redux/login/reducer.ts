const initState:[] = []

export default function getTypeReducer(init = initState, action:any) {
    const {type, data} = action
    
    switch (type) {
        case "login":
            return data.data
        default:
            return null
    }
    
}