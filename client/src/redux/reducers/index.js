import { combineReducers } from "redux";

import auth from "./auth.reducer";
import user from "./user.reducer";
import modal from "./modal.reducer";
import till from "./till.reducer";
import stock from "./stock.reducer";

const rootReducer = combineReducers({
    auth,
    user,
    modal,
    till,
    stock
});

export default rootReducer;
