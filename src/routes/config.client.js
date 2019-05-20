export const clientMenus = [
    { key: '/app/pension-agency/dashboard/index', title: '首页', icon: 'home', component: 'ClientDashboard' ,id:"2"},
    {
        key: '/app/pension-agency/appointments', title: '预约管理', icon: 'tag',id:"3",
        sub: [
            { key: '/app/pension-agency/appointments', title: '入院预约', component: 'Appointments',id:"4" },
        ],
    },
    {
        key: '/app/pension-agency/elderlyManage', title: '老人管理', icon: 'team',id:"5",
        sub: [
            { key: '/app/pension-agency/elderlyManage/oldManEvaluate', title: '入院评估', component: 'OldManEvaluate' ,id:"6"},
            { key: '/app/pension-agency/elderlyManage/entryContract', title: '入院合同', component: 'EntryContract' ,id:"7"},
            { key: '/app/pension-agency/elderlyManage/oldManAdmission', title: '在院管理', component: 'OldManAdmission' ,id:"8"},          
            { key: '/app/pension-agency/elderlyManage/oldManOutHome', title: '出院管理', component: 'OldManOutHome' ,id:"9"},
            { key: '/app/pension-agency/elderlyManage/leave', title: '外出管理', component: 'Leave' ,id:"10"},
            { key: '/app/pension-agency/elderlyManage/nursingGradeChange', title: '护理等级变更', component: 'ElderlyByRoom',id:"22" },
            { key: '/app/pension-agency/elderlyManage/changeRoom', title: '换房申请', component: 'ElderlyByRoom',id:"23" },
            { key: '/app/pension-agency/elderlyManage/changeProportion', title: '水电比例变更', component: 'ElderlyByRoom',id:"24" },
            { key: '/app/pension-agency/elderlyManage/regularEvaluate', title: '定期评估', component: 'OldManEvaluate',id:"11" },
            { key: '/app/pension-agency/elderlyManage/waterKwh', title: '水电记录', component: 'WaterKwh' ,id:"25"},
        ],
    },
    {
        key: '/app/pension-agency/medicalCare', title: '医护管理', icon: 'hdd',id:"26",
        sub: [
            { key: '/app/pension-agency/medicalCare/healthRecord', title: '健康档案', component: 'HealthRecord',id:"27"},
            { key: '/app/pension-agency/medicalCare/nursingScheduled', title: '护理计划', component: 'CarePlan',id:"28" },
            { key: '/app/pension-agency/medicalCare/caseNursing', title: '个案护理', component: 'CaseNursing' ,id:"29"},
            { key: '/app/pension-agency/medicalCare/healthExaminationMemo', title: '体检记录', component: 'HealthExMemo',id:"30"},
            { key: '/app/pension-agency/medicalCare/drugUsageInfo', title: '用药信息', component:'DrugUsageInfo',id:"31"},
        ],
    },
    {
        key: '/app/pension-agency/drugManage', title: '药品管理', icon: 'medicine-box',id:"32",
        sub: [
            { key: '/app/pension-agency/drugManage/drugInStock', title: '药品入库', component: 'DrugInStock',id:"33"},
            { key: '/app/pension-agency/drugManage/drugOutStock', title: '药品出库', component: 'DrugOutStock',id:"34"},
            { key: '/app/pension-agency/drugManage/drugStock', title: '药品库存', component: 'DrugStock',id:"35"},   
            { key: '/app/pension-agency/drugManage/drugUseTemplate', title: '用药模板', component: 'DrugUseTemplate',id:"36"},
            { key: '/app/pension-agency/drugManage/drugUsePlan', title: '用药计划', component: 'DrugUsePlan',id:"37"},
            { key: '/app/pension-agency/drugManage/drugInfo', title: '药品信息库', component: 'DrugInfo1',id:"38"},
        ],
    },
    {
        key: '/app/pension-agency/alarm', title: '告警信息', icon: 'alert',id:"39",
        sub: [
            { key: '/app/pension-agency/alarm/arrearageAlarm' ,title:'余额不足', component: 'ArrearageAlarm' ,id:"40"},
            { key: '/app/pension-agency/alarm/drugAlarm' ,title:'缺药告警', component: 'DrugAlarm' ,id:"41"},
            { key: '/app/pension-agency/alarm/waterKwhAlarm' ,title:'水电表异常', component: 'WaterKwhAlarm' ,id:"42"}
        ]
    },
    {
        key: '/app/pension-agency/processAudit', title: '审核管理', icon: 'audit',id:"43",
        sub: [
            { key: '/app/pension-agency/processAudit/leaveAudit', title: '出院审核', component: 'LeaveAudit' ,id:"44"},
            { key: '/app/pension-agency/processAudit/changeNusingGradeAudit', title: '护理等级变更', component: 'ChangeNursingGradeAudit' ,id:"71"},
        ]
    },
    {
        key: '/app/pension-agency/financial', title: '财务管理', icon: 'money-collect',id:"45",
        sub: [
            // { key: '/app/pension-agency/financial/payItem', title: '费用预交' },
            { key: '/app/pension-agency/financial/settleAccounts', title: '在院结算' , component: 'SettleAccounts',id:"46"},
            { key: '/app/pension-agency/financial/leaveSettle', title: '出院结算' , component: 'SettleAccounts',id:"47"},
            { key: '/app/pension-agency/financial/feeInOut', title: '费用收支' , component: 'FeeInOut',id:"48"},
            { key: '/app/pension-agency/financial/payItem', title: '收费项目', component: 'PayItem' ,id:"49"},
            { key: '/app/pension-agency/financial/daily', title: '日常收费', component: 'Daily' ,id:"78"},
            // { key: '/app/pension-agency/financial/payItem', title: '水电费结算' },
            // { key: '/app/pension-agency/financial/payItem', title: '药费清单' },
            // { key: '/app/pension-agency/financial/payItem', title: '出院审核' },
        ],
    },
    {
        key: '/app/pension-agency/viewStatistics', title: '查询统计', icon: 'search',id:"50",
        sub: [ 
            { key: '/app/pension-agency/viewStatistics/leavingNursingHome', title: '离院老人统计', component: 'LeavingNursingHome' ,id:"51"},
            { key: '/app/pension-agency/viewStatistics/monthBirthday', title: '本月生日人员', component: 'MonthBirthday',id:"52" },
            { key: '/app/pension-agency/viewStatistics/monthEnter', title: '本月入院人员', component: 'MonthEnter',id:"53" },
            { key: '/app/pension-agency/viewStatistics/bedInfo', title: '入住情况总览', component: 'BedInfo',id:"75" },
        ],
    },
    {
        key: '/app/pension-agency/basicInfo', title: '基础信息', icon: 'info-circle',id:"54",
        sub: [
            { key: '/app/pension-agency/basicInfo/nurseInfo', title: '护士信息', component: 'NurseInfo',id:"55" },
            { key: '/app/pension-agency/basicInfo/workerInfo', title: '护工信息', component: 'WorkerInfo',id:"56" },
            { key: '/app/pension-agency/basicInfo/examine', title: '收费护理项', component:'Examine',id:"57"},
            { key: '/app/pension-agency/basicInfo/nursingGrade', title: '护理等级', component: 'NursingGrade',id:"58" },
            { key: '/app/pension-agency/basicInfo/workProjects', title: '护理项目', component: 'WorkProjects' ,id:"59"},
            { key: '/app/pension-agency/basicInfo/room', title: '房间管理', component:'Room',id:"60"},
            { key: '/app/pension-agency/basicInfo/reductionMonth', title: '水电减免月', component: 'ReductionMonth' ,id:"61"},
            { key: '/app/pension-agency/basicInfo/diseaseLibrary', title: '病症库', component: 'DiseaseLibrary',id:"62" },
            { key: '/app/pension-agency/basicInfo/estimate', title: '评估库', component: 'EstimateLib' ,id:"63"},
            { key: '/app/pension-agency/basicInfo/estimateGrade', title: '评估等级', component: 'EstimateGrade',id:"64" },
            { key: '/app/pension-agency/basicInfo/leaveAuditSet', title: '审核部门配置', component: 'LeaveAuditSet',id:"65" },
            { key: '/app/pension-agency/basicInfo/waterKwhInit', title: '水电表初始化', component: 'WaterKwhInit' ,id:"72"},
            { key: '/app/pension-agency/basicInfo/mealInit', title: '餐费初始化', component: 'MealInit' ,id:"73"},
            { key: '/app/pension-agency/basicInfo/nursingFeeInit', title: '护理费初始化', component: 'NursingInit' ,id:"74"},
            { key: '/app/pension-agency/basicInfo/nursingBedInit', title: '床位费初始化', component: 'bedInit' ,id:"77"},
            { key: '/app/pension-agency/basicInfo/sysParams', title: '系统参数', component: 'SysParamsClient' ,id:"76"},
        ],
    },
    {
        key: '/app/pension-agency/systemManage', title: '系统管理', icon: 'tool',id:"66",
        sub: [
            { key: '/app/pension-agency/systemManage/deptInfo', title: '部门信息', component: 'DeptInfo',id:"67" },
            { key: '/app/pension-agency/systemManage/roleInfo', title: '角色信息', component: 'RoleInfo',id:"68" },
            { key: '/app/pension-agency/systemManage/permission', title: '角色权限', component: 'Permission' ,id:"69"},
            { key: '/app/pension-agency/systemManage/sysGlobalVariable', title: '全局变量', component: 'SysGlobalVariable' ,id:"70"},
        ]
    }
];