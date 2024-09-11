/*** 
 *  
 * Description: React redux - user state reducer
 * Issues: -
 * 
 * Last revision: Nikola Lukic, 30-Dec-2023
 * 
***/

import { combineReducers } from 'redux'

// Implemented actions aren't used. Should integrate them into the app funcionality ASAP
const userState = (state = {user: null}, action) => {
    switch (action.type) {
        case 'LOGIN'    :    return { ...state, user: action.payload }
        case 'LOGOUT'   :    return { ...state, user: null }
        default         :    return state
    }
}

const reducer = combineReducers({
  user: userState
})


export default reducer