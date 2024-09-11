/*** 
 *  
 * Description: React redux - store creation
 * Issues: -
 * 
 * Last revision: Nikola Lukic, 01-Jan-2024
 * 
***/

import { createStore } from 'redux'
import reducer from './userReducer'

// Creating a redux store via the legacy way (not optimal but works)
const store = createStore(reducer)
export default store