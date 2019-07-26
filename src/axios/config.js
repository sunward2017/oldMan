/**
 * 接口地址配置文件
 */
export const host = (() => {
    switch (process.env.NODE_ENV) {
        //case "development": return { api: 'http://192.168.10.235:8080' };
        default: return { api: 'http://120.55.240.188:9803' };
    }

})();
/*params
 * fn:url
 * 接口
*/
export default {
    login: host.api + '/Login',
    //客户信息
    listCustomerInfo: host.api + '/listCustomerInfo',//客户信息列表
    saveCustomer: host.api + '/saveCustomer',        //增加客户信息
    updateCustomer: host.api + '/updateCustomer',    //修改客户信息
    deleteCustomer: host.api + '/deleteCustomer',     //删除用户信息
    systemIni: host.api + '/systemIni',//数据初始化
    
    //操作员信息
    listOperator: host.api + '/listOperator',//客户信息列表
    saveOperator: host.api + '/saveOperator',        //增加客户信息
    updateOperator: host.api + '/updateOperator',    //修改客户信息
    deleteOperator: host.api + '/deleteOperator' ,    //删除用户信息

    //权限管理
    getCustomerPermission: host.api + '/getCustomerPermission', //获取客户权限
    saveCustomerPermission: host.api + '/saveCustomerPermission',//保存客户权限

    //基础信息--系统参数
    listParam: host.api + '/listParam',              //系统基本参数列表
    deleteParam:host.api+ '/deleteParam',            //系统基本参数删除
    saveParam:host.api+'/saveParam',                 //系统基本参数增加
    updateParam:host.api+'/updateParam',              //系统基本参数

    //基础信息--药品信息
    listDrugInfoInfo:host.api + '/listDrugInfoInfo',  //药品库列表
    saveDrugInfo:host.api + '/saveDrugInfo',          //药品库增加
    updateDrugInfo:host.api + '/updateDrugInfo',      //药品库修改
    deleteDrugInfo:host.api + '/deleteDrugInfo',      //药品库删除
    
	//评估库
    listEstimateLib: host.api + '/listEestimateLib',           
    saveEstimateLib:host.api+'/saveEestimateLib',               
    deleteEstimateLib:host.api+ '/deleteEestimateLib',            
    updateEstimateLib:host.api+'/updateEestimateLib', 
    checkEestimateLib:host.api+'/checkEestimateLib',
    
    //评估库详情
    deleteEestimateLibDetail:host.api + '/deleteEestimateLibDetail',
    listEestimateLibDetail:host.api + '/listEestimateLibDetail',
    saveEestimateLibDetail:host.api + '/saveEestimateLibDetail',
    updateEestimateLibDetail:host.api + '/updateEestimateLibDetail',
    
    //评估等级
    listEstimateGrade:host.api + '/listEstimateGrade',           
    saveEstimateGrade:host.api+'/saveEstimateGrade',               
    deleteEstimateGrade:host.api+ '/deleteEstimateGrade',            
    updateEstimateGrade:host.api+'/updateEstimateGrade',
    
    //护士
    listNurseInfo: host.api + '/listNurseInfo',
    saveNurseInfo: host.api + '/saveNurseInfo',       
    updateNurseInfo: host.api + '/updateNurseInfo',    
    deleteNurseInfo: host.api + '/deleteNurseInfo' ,   

    //收费项信息
    getPayItemTree:host.api + '/getPayItemTree',
    savePayItem:host.api +'/savePayItem',
    savePayItemChild:host.api + '/savePayItemChild',
    lisPayItemChild:host.api + '/lisPayItemChild',
    updatePayItem:host.api + '/updatePayItem',
    updatePayItemChild:host.api + '/updatePayItemChild',
    deletePayItem:host.api + '/deletePayItem',
    deletePayItemChild:host.api + '/deletePayItemChild',
    //预交款操作
    saveMoneyDeposits:host.api +'/saveMoneyDeposits',
    getMoneyInfo:host.api + '/getMoneyInfo',
    listMoneyDeposits:host.api + '/listMoneyDeposits',
    getMyMoney:host.api+'/getMyMoney',

    //健康档案
    deleteHealthInfo:host.api + '/deleteHealthInfo',
    saveHealthInfo:host.api + '/saveHealthInfo',
    updateHealthInfo:host.api + '/updateHealthInfo',
    listHealthInfo:host.api+'/listHealthInfo',
    listElderlyUseDrugInfo:host.api + '/listElderlyUseDrugInfo',

    //体检记录
    listCheckRecoder:host.api + '/listCheckRecoder',
    saveCheckRecoder:host.api + '/saveCheckRecoder',
    // listOneElderlyCheckRecoder:host.api + '/listOneElderlyCheckRecoder',//多余接口
    updateCheckRecoder:host.api + '/updateCheckRecoder',
    deleteCheckRecoder:host.api + '/deleteCheckRecoder',
    listCheckItemInfo:host.api + '/listCheckItemInfo',
    listCheckRecoderMap:host.api + '/listCheckRecoderMap',

    //在院结算
    listNursingAndCheckItem:host.api +'/listNursingAndCheckItem',//检查护理项
    settlementNursingItem:host.api+'/settlementNursingItem',
    listMealFeeList:host.api + '/listMealFeeList',//结算:餐费
    saveSettlementMealFee:host.api + '/saveSettlementMealFee',
    listWaterRecoder:host.api + '/listWaterRecoder',//结算:水电费
    saveSettlementWaterFee:host.api + '/saveSettlementWaterFee',
    listRoomFeeList:host.api+'/listRoomFeeList',//结算:住宿费
    saveSettlementRoomFee:host.api + '/saveSettlementRoomFee',
    listDrugFeeList:host.api + '/listDrugFeeList',//结算:药费
    saveSettlementDrugFee:host.api+'/saveSettlementDrugFee',

    // 出院审核
    outHomeAudit:host.api + '/outHomeAudit',
    outHomeAuditList:host.api + '/outHomeAuditList',

    //告警查询
    listDefaultingFee:host.api + '/listDefaultingFee',
    listDrugShortage:host.api + '/listDrugShortage',
    listWaterKwhAbnormal:host.api + '/listWaterKwhAbnormal',

    //护工
    deleteWorkerInfo: host.api + '/deleteWorkerInfo',//护工信息删除
    listWorkerInfo: host.api + '/listWorkerInfo',    //护工信息列表
    saveWorkerInfo: host.api + '/saveWorkerInfo',    //护工信息增加
    updateWorkerInfo: host.api + '/updateWorkerInfo',//护工信息修改
     
    //护理等级类别
    listEstimateType:host.api + '/listEstimateType',
    saveEstimateType:host.api +'/saveEstimateType',
    updateEstimateType:host.api +'/updateEstimateType',
    deleteEstimateType:host.api +'/deleteEstimateType',
    
    //护理等级
    deleteNursingGrade: host.api + '/deleteNursingGrade',//护理等级删除
    listNursingGrade: host.api + '/listNursingGrade',    //护理等级列表
    saveNursingGrade: host.api + '/saveNursingGrade',    //护理等级增加
    updateNursingGrade: host.api + '/updateNursingGrade',//护理等级修改 

    //护理等级对应工作项
    deleteWorkeItemSet: host.api + '/deleteWorkeItemSet',//护理级别对应工作项设置删除
    listWorkeItemSet: host.api + '/listWorkeItemSet',    //护理级别对应工作项设置列表
    saveWorkeItemSet: host.api + '/saveWorkeItemSet',    //护理级别对应工作项设置增加
    updateWorkeItemSet: host.api + '/updateWorkeItemSet',//护理级别对应工作项设置修改 

    //减免月
    deleteDiscountMonth: host.api + '/deleteDiscountMonth',//减免月删除
    listDiscountMonth: host.api + '/listDiscountMonth',    //减免月列表
    saveDiscountMonth: host.api + '/saveDiscountMonth',    //减免月增加
    updateDiscountMonth: host.api + '/updateDiscountMonth',//减免月修改

    //病症库
    deleteDiseaseLibrary: host.api + '/deleteDiseaseLibrary',//病症库删除
    listDiseaseLibrary: host.api + '/listDiseaseLibrary',    //病症库列表
    saveDiseaseLibrary: host.api + '/saveDiseaseLibrary',    //病症库增加
    updateDiseaseLibrary: host.api + '/updateDiseaseLibrary',//病症库修改   
    
    //房间管理
    listRoomInfo: host.api + '/listRoomInfo',
    saveRoomInfo: host.api + '/saveRoomInfo',       
    updateRoomInfo: host.api + '/updateRoomInfo',    
    deleteRoomInfo: host.api + '/deleteRoomInfo' ,   
    saveBatchRoomInfo: host.api + '/saveBatchRoomInfo',
    getRoomTree: host.api + '/getRoomTree',//区域+房间
    listBedInfoByRoomId: host.api + '/listBedInfoByRoomId',//床位列表
    listBedInfoAll:host.api+'/listBedInfoAll',
    saveBedInfo:host.api+'/saveBedInfo',
    updateBedInfo:host.api+'/updateBedInfo',
    deleteBedInfo:host.api+'/deleteBedInfo',
    getRoomAndBedTree:host.api+'/getRoomAndBedTree',
   
    //区域管理
    listAreaInfo: host.api + '/listAreaTree',
    saveAreaInfo: host.api + '/saveAreaInfo',       
    deleteAreaInfo: host.api + '/deleteAreaInfo' ,   
    updateAreaInfo: host.api + '/updateAreaInfo',

    //部门信息
    deleteDeptInfo: host.api + '/deleteDeptInfo',      //部门删除
    getDeptInfoTree: host.api + '/getDeptInfoTree',    //部门Tree
    saveDeptInfo: host.api + '/saveDeptInfo',          //部门增加
    updateDeptInfo: host.api + '/updateDeptInfo',      //部门修改  

    
    //检查类别 
    deleteCheckItem:host.api+'/deleteCheckItem',
    saveCheckItem:host.api+'/saveCheckItem',
    updateCheckItem:host.api+'/updateCheckItem',
    listCheckItem:host.api+'/listCheckItem',
    
    //检查项
    deleteCheckItemChild:host.api+'/deleteCheckItemChild',
    listCheckItemChild:host.api+'/listCheckItemChild',
    updateCheckItemChild:host.api+'/updateCheckItemChild',
    saveCheckItemChild:host.api+'/saveCheckItemChild',

    deleteLeaveAuditSet:host.api+'/deleteLeaveAuditSet',   //审核部门删除
    listLeaveAuditSet:host.api+'/listLeaveAuditSet',       //审核部门列表
    saveLeaveAuditSet:host.api+'/saveLeaveAuditSet',       //审核部门增加
    updateLeaveAuditSet:host.api+'/updateLeaveAuditSet',   //审核部门修改
    
    //预约管理
    saveAppointmentInfo:host.api+'/saveAppintmentInfo',
    updateAppointmentInfo:host.api+'/updateAppintmentInfo',
    deleteAppointmentInfo:host.api+'/deleteAppintmentInfo',
    listAppointmentInfo:host.api+'/listAppintmentInfo',

    //入院评估
    getEvaluateDetail:host.api+'/getEvaluateDetail',  //获取老人评估信息
    listEvaluateList:host.api+'/listEvaluateList',    //获取评估参数
    saveEvaluateDetail:host.api+'/saveEvaluateDetail',//保存老人评估信息
    listOldManEvaluate:host.api+'/listOldManEvaluate',
    listEvaluateType:host.api+'/listEvaluateType',

    //入院合同
    listContractInfo:host.api+'/listContractInfo',
    saveContractInfo:host.api+'/saveContractInfo',
    updateContractInfo:host.api+'/updateContractInfo',
    deleteContractInfo:host.api+'/deleteContractInfo',
    
    //老人信息
    listElderlyInfo:host.api+'/listElderlyInfo',      //老人信息列表
    saveElderlyInfo:host.api+'/saveElderlyInfo',      //保存老人信息
    getOneElderlyInfo:host.api + '/getOneElderlyInfo',
    updateElderlyInfo:host.api+'/updateElderlyInfo',  //修改老人信息
    delElderlyInfo:host.api+'/delElderlyInfo',        //删除老人信息
    saveFamilyMember:host.api+'/saveFamilyMember',    //增加联系人信息（家庭成员）
    delFamilyMember:host.api+'/delFamilyMember',      //删除联系人信息（家庭成员）
    listFamilyMember:host.api+'/listFamilyMember',      //（家庭成员列表）
    selectPayItemChild:host.api+'/selectPayItemChild', //关联收费项目选取
    outHomeInfo:host.api+'/outHomeInfo', //老人出院发起申请
    cancelOutHomeInfo:host.api+'/cancelOutHomeInfo', //取消老人出院发起申请
    GetFamilyMemberRecvSms:host.api+'/GetFamilyMemberRecvSms', //（家庭成员中默认接收短信人员）
    GetFamilyMemberPayFee:host.api+'/GetFamilyMemberPayFee',//（家庭成员中默认交款人员）
    DispQRcode:host.api+'/DispQRcode',  //获取老人二维码
    
    //护理计划
    listNursingItemRecoder:host.api+'/listNursingItemRecoder',
    saveNursingItemRecoder:host.api+'/saveNursingItemRecoder',
   
    /****************************************/
   
   
    listNursingScheduled: host.api+'/listNursingScheduled',  //获取护理计划列表
    listCheckItemAll: host.api+'/listCheckItemAll',  //获取检查项
    saveEstimateSheet2: host.api+'/saveEstimateSheet2', 
    saveNursingScheduledSheet1 : host.api+'/saveNursingScheduledSheet1',  //增加sheet1身高体重
    updateNursingScheduledSheet1 : host.api+'/updateNursingScheduledSheet1',//修改sheet 1 身高体重.
    saveNursingScheduledSheet2: host.api+'/saveNursingScheduledSheet2', //增加sheet2 护理计划
    updateNursingScheduledSheet2: host.api+'/updateNursingScheduledSheet2', 
    saveNursingScheduledSheet3: host.api+'/saveNursingScheduledSheet3', //增加sheet2 护理计划
    updateNursingScheduledSheet3: host.api+'/updateNursingScheduledSheet3', 
    saveNursingScheduledSheet4: host.api+'/saveNursingScheduledSheet4', //增加sheet 4 工作计划
    updateNursingScheduledSheet4: host.api+'/updateNursingScheduledSheet4', //修改sheet 4 工作计划
    saveNursingScheduledSheet5: host.api+'/saveNursingScheduledSheet5', //增加sheet 4 工作计划
    updateNursingScheduledSheet5: host.api+'/updateNursingScheduledSheet5', 
    getNursingScheduledDetail: host.api+'/getNursingScheduledDetail', //获取护理计划详情
    
    //外出请假管理
    listAskForLeave: host.api+'/listAskForLeave',
    returnAskForLeave: host.api+'/returnAskForLeave',
    saveAskForLeave: host.api+'/saveAskForLeave',
    updateAskForLeave: host.api+'/updateAskForLeave',
    deleteAskForLeave: host.api+'/deleteAskForLeave',
    
    //护理记录
    deleteNursingItemRecoder:host.api+'/deleteNursingItemRecoder',
    deleteNursingRecoder:host.api+'/deleteNursingRecoder',
    listNursingRecoder:host.api+'/listNursingRecoder',
    saveNursingRecoder:host.api+'/saveNursingRecoder',
    updateNursingRecoder:host.api+'/updateNursingRecoder',
    
    //用药模板
    listDrugTemplate:host.api+'/listDrugTemplate',
    saveDrugTemplate:host.api+'/saveDrugTemplate',
    updateDrugTemplate:host.api+'/updateDrugTemplate',
    deleteDrugTemplate:host.api+'/deleteDrugTemplate',
    
    //用药计划
    listDrugScheduled:host.api+'/listDrugScheduled',
    saveDrugScheduled:host.api+'/saveDrugScheduled',
    updateDrugScheduled:host.api+'/updateDrugScheduled',
    deleteDrugScheduled:host.api+'/deleteDrugScheduled',
    
    //药品库存
    listDrugStockInfo:host.api+'/listDrugStockInfo',
    listDrugInAndOut:host.api+'/listDrugInAndOut',
    deleteDrugInAndOut:host.api+'/deleteDrugInAndOut',
    saveDrugStockInfo:host.api+'/saveDrugStockInfo',
    
    listRegWaterKwh:host.api+'/listRegWaterKwh',//水电抄表列表
    saveRegWaterKwh:host.api+'/saveRegWaterKwh',//水电抄表登记
    updateRegWaterKwh:host.api+'/updateRegWaterKwh',//水电抄表修改
    deleteRegWaterKwh:host.api+'/deleteRegWaterKwh',//水电抄表删除
 
    savechangeNursingGrade:host.api+'/savechangeNursingGrade',
    savechangeRoom:host.api+'/savechangeRoom',
    //查询统计
    listCurrentMonthBirthdayElderly:host.api+'/listCurrentMonthBirthdayElderly',//本月生日老人信息
    listCurrentMonthEnterElderly:host.api+'/listCurrentMonthEnterElderly',//本月入院老人信息信息

    //权限管理 GetOperateList  ModifyOperateInfo
    getCustomerTreeInfo:host.api+'/getCustomerTreeInfo',
    getSysMemuTree:host.api+'/GetSysMemuTree',
    addSysRoleList:host.api+'/AddSysRoleList',
    delSysRoleList:host.api+'/DelSysRoleList',
    getSysRoleList:host.api+'/GetSysRoleList',
    modifySysRoleList:host.api+'/ModifySysRoleList',
    saveSysMemuTree:host.api+'/SaveSysMemuTree',
    getDeptAndUserInfo:host.api+'/getDeptAndUserInfo',
    getUserRolesInfo:host.api+'/getUserRolesInfo',
    saveUserRolesInfo:host.api+'/saveUserRolesInfo',

    //系统全局变量
    getSysGlobalVariables:host.api+'/getSysGlobalVariables',//获取统全局变量定义
    updateSysGlobalVariables:host.api+'/updateSysGlobalVariables',//系统全局变量定义

    //首页显示接口
    countHomeData:host.api + '/countHomeData',//在院人数，本月入院人数，床位总数、空余数、占比
    countAgeMap:host.api + '/countAgeMap',//老人年龄分布图
    countInHome:host.api + '/countInHome',//每月入住老人
    countTaskAndWaring:host.api + '/countTaskAndWaring',//任务及告警统计
    countBirthdayElderly:host.api + '/countBirthdayElderly',//本月及下月生日老人
    
    //护理等级变更审核部门
    listCNGAuditSet:host.api+'/listCNGAuditSet',
    saveCNGAuditSet:host.api+'/saveCNGAuditSet',
    updateCNGAuditSet:host.api+'/updateCNGAuditSet',
    deleteCNGAuditSet:host.api+'/deleteCNGAuditSet',
    listAuditOperator:host.api+'/listAuditOperator',
    
    //护理等级变更审核
    listChangeNursingGradeAudit:host.api+'/listChangeNursingGradeAudit',
    saveNursingGradeAudit:host.api+'/savechangeNursingGradeAudit',
    listChangeNursingGrade:host.api+'/listChangeNursingGrade',

    //水电初始化
    listRoomWaterAndKwhIni:host.api+'/listRoomWaterAndKwhIni',
    setRoomWaterAndKwh:host.api+'/setRoomWaterAndKwh',

    //餐费结算初始化列表
    listOldManMealIni:host.api+'/listOldManMealIni',
    settOldManMealIni:host.api+'/settOldManMealIni',
    
    // 床位费初始化
     listOldManBedIni:host.api+'/listOldManBedIni',
     settOldManBedIni:host.api+'/settOldManBedIni',
    
    //护理费结算初始化列表
    listOldManNursingIni:host.api+'/listOldManNursingIni',
    setOldManNursingIni:host.api+'/setOldManNursingIni',
   
    changeRoomList:host.api+'/changeRoomList',
    //费用计算
    getSettlementInfo:host.api+"/getSettlementInfo",
    getSettlementInfoPrint:host.api+"/getSettlementInfoPrint",
    
    getSystemMsg:host.api+'/getSystemMsg',
    
    listImmediateFee:host.api+'/listImmediateFee',
    saveImmediateFee:host.api+'/saveImmediateFee',
    updateImmediateFee:host.api+'/updateImmediateFee',
    delImmediateFee:host.api+'/delImmediateFee',
    
    //日报
    listRecvReportDay:host.api+'/listRecvReportDay',
    
    //探访
    saveVisitOldMan:host.api+'/saveVisitOldMan',
    detailVisitOldMan:host.api+'/detailVisitOldMan',
    againInHomeInfo:host.api+'/againInHomeInfo',
    //月报
    listSettlementInfo:host.api+'/listSettlementInfo',
    
    listOldManDrugInfo:host.api+'/listOldManDrugInfo',
    listElderlyDrugScheduledInfo:host.api+'/listElderlyDrugScheduledInfo',  
    
    listEmployeeInfo:host.api+'/listEmployeeInfo',
    addEmployeeInfo:host.api+'/saveEmployeeInfo',
    updateEmployeeInfo:host.api+'/updateEmployeeInfo',
    deleteEmployeeInfo:host.api+'/deleteEmployeeInfo',
}