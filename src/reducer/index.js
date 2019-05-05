import { combineReducers } from 'redux';
import * as type from '../action/type';

const handleData = (state = {isFetching: true, data: {}}, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
            return {...state, isFetching: true};
        case type.RECEIVE_DATA:
            return {...state, isFetching: false, data: action.data};
        default:
            return {...state};
    }
};
const httpData = (state = {}, action) => {
    switch (action.type) {
        case type.RECEIVE_DATA:
        case type.REQUEST_DATA:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            };
        default:
            return {...state};
    }
};
const myAuth = (state={},action)=>{
    switch(action.type){
        case type.AUTH_RESOLVER:
            return {...state,...action.myAuth};
        case type.ISLOGIN:
            return {...state,isLogin: action.data};
        default: return state
    }
};
const temporaryData = (state= {}, action) => {
    switch(action.type){
        case type.HEALTH_RECORDS:
            return {...state, healthRecord: action.data};
        default: return state
    }
};

const drugElderlyInfo = (state={},action)=>{
	switch(action.type){
		case type.DRUG_ELDERLY_INFO:
		    return {...state,...action.data};
		default: return state    
	}
}

export default combineReducers({
    httpData,
    myAuth,
    temporaryData,
    drugElderlyInfo,
});
