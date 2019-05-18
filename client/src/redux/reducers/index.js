import { combineReducers } from "redux";

import auth from "./auth.reducer";
import user from "./user.reducer";
import modal from "./modal.reducer";

const rootReducer = combineReducers({
    auth,
    user,
    modal
});

export default rootReducer;
