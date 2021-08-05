import {combineReducers} from 'redux'
import getTypeReducer from './login/reducer'
import articleContent from './add/reducer'
import listReducer from './list/reducer'

let rootReducer = combineReducers({
    getTypeReducer,
    articleContent,
    listReducer
})

export default rootReducer