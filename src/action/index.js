import * as type from './type';

export const receiveData = (data, category) => ({
    type: type.RECEIVE_DATA,
    data,
    category
});
export const authResolver = (myAuth) => ({
    type: type.AUTH_RESOLVER,
    myAuth
});
export const isLogin = (data) => ({
    type: type.ISLOGIN,
    data
});
export const healthRecords = (data) => ({
    type: type.HEALTH_RECORDS,
    data
});

export const drugElderlyInfo = (data)=>({
	type:type.DRUG_ELDERLY_INFO,
	data
})

 