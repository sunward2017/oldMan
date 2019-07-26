import Dashboard from '../components/dashboard/adminDashboard';
import ClientDashboard from '../components/dashboard/index';
import CustomerInfo from '../components/auth/CustomerInfo';
import Worker from '../components/user/worker';
import SysParams from '../components/basicSetting/Systemparameters';
import DrugInfo from '../components/basicSetting/DrugInfo';
import Estimate from '../components/basicSetting/Estimate';
import AuthManage from '../components/auth/AuthManage';

import PayItem from '../components/financial/payItem';
import FeeInOut from '../components/financial/feeInOut';
import SettleAccounts from '../components/financial/settleAccounts';
import Daily from '../components/financial/daily';
import HealthRecord from '../components/medicalCare/healthRecord';
import HealthExMemo from '../components/medicalCare/healthExaminationMemo';
import DrugUsageInfo from '../components/medicalCare/drugUsageInfo';
import LeaveAudit from '../components/processAudit/leaveAudit';
import ChangeNursingGradeAudit from '../components/processAudit/changeNursingGradeAudit';
import ArrearageAlarm from '../components/alarm/arrearageAlarm';
import DrugAlarm from '../components/alarm/drugAlarm';
import WaterKwhAlarm from '../components/alarm/waterKwhAlarm';

import DeptInfo from '../components/systemManage/deptInfo';
import Appointments from '../components/appointments';
import OldManEvaluate from '../components/elderlyManage/oldManEvaluate';
import EntryContract from '../components/elderlyManage/entryContract';
import CarePlan from '../components/elderlyManage/nursingScheduled';
import Leave from '../components/elderlyManage/leave';
import NursingRecord from '../components/elderlyManage/nursingRecord';
import CaseNursing from '../components/elderlyManage/caseNursing'
import OldManAdmission from '../components/elderlyManage/oldManAdmission';
import DrugUseTemplate from '../components/drugManage/drugUseTemplate';
import DrugInfo1 from '../components/drugManage/drugInfo'; 
import DrugUsePlan from '../components/drugManage/drugUsePlan';
import DrugStock from '../components/drugManage/drugStock';
import DrugInStock from '../components/drugManage/drugInStock';
import DrugOutStock from '../components/drugManage/drugOutStock';
import WaterKwh from '../components/elderlyManage/waterKwh';
import OldManOutHome from '../components/elderlyManage/oldManOutHome';
import ElderlyByRoom from '../common/elderlyByRoom';
import LeavingNursingHome from '../components/viewStatistics/leavingNursingHome';
import MonthBirthday from '../components/viewStatistics/monthBirthday';
import MonthEnter from '../components/viewStatistics/monthEnter';
import BedInfo  from '../components/viewStatistics/bedInfo';
import RoleInfo from '../components/systemManage/roleInfo';
import Permission from '../components/systemManage/permission';
import SysGlobalVariable from '../components/systemManage/sysGlobalVariable';

import WaterKwhInit from '../components/basicInfo/waterKwhInit';
import bedInit from '../components/basicInfo/bedInit';
import MealInit from '../components/basicInfo/mealInit';
import NursingInit from '../components/basicInfo/nursingFeeInit';
import SysParamsClient from '../components/basicInfo/sysParams';
import WorkerInfo from '../components/basicInfo/workerInfo';
import EstimateGrade from '../components/basicInfo/estimateGrade';
import NurseInfo from '../components/basicInfo/nurseInfo';
import NursingGrade from '../components/basicInfo/nursingGrade';
import WorkProjects from '../components/basicInfo/workProjects';
import Room from '../components/basicInfo/room';
import ReductionMonth from '../components/basicInfo/reductionMonth';
import DiseaseLibrary from '../components/basicInfo/diseaseLibrary';
import Examine from '../components/basicInfo/examine';
import LeaveAuditSet from '../components/basicInfo/leaveAuditSet';
import EstimateLib from '../components/basicInfo/estimate';
import StaffInfo from '../components/basicInfo/staffInfo';

export default {
    Dashboard,
    ClientDashboard,
    CustomerInfo,
    Worker,
    SysParams,
    DrugInfo,
    Estimate,
    EstimateGrade, 
    AuthManage,
    WorkerInfo,
    PayItem,
    FeeInOut,
    Daily,
    SettleAccounts,
    HealthRecord,
    HealthExMemo,
    DrugUsageInfo,
    LeaveAudit,
    ArrearageAlarm,
    DrugAlarm,
    WaterKwhAlarm,
    NurseInfo,
    NursingGrade,
    WorkProjects,
    Room,
    ReductionMonth,
    DiseaseLibrary,
    Examine,
    DeptInfo,
    LeaveAuditSet,
    Appointments,
    OldManEvaluate,
    EstimateLib,
    EntryContract,
    CarePlan,
    NursingRecord,
    Leave,
    OldManAdmission,
    DrugUseTemplate,
    DrugUsePlan,
    DrugStock,
    DrugInStock,
    DrugOutStock,
    WaterKwh,
    OldManOutHome,
    ElderlyByRoom,
    LeavingNursingHome,
    MonthBirthday,
    MonthEnter,
    RoleInfo,
    Permission,
    SysGlobalVariable,
    DrugInfo1,
    BedInfo,
    ChangeNursingGradeAudit,
    WaterKwhInit,
    MealInit,
    bedInit,
    NursingInit,
    SysParamsClient,
    CaseNursing,
    StaffInfo
}