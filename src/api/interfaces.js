import axios from './api'
import urlConfig from './apiServerConfig'
import utils from '../utils/index' //公共js方法
/* 将所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 */
// import store from './store'
// import store from '../store/index'
//
let appId = utils.getUrlKey("appId");
let userId = utils.getUrlKey("userId");
let orgId = utils.getUrlKey('curChangeOrg');
// userId='d2c91743-7c09-40de-8ed4-7b618fc8179e'
// orgId= '5f913c9c-20c6-4183-8f43-1143c733db07'
// appId= '128b85de-0f43-4aac-bed9-33541f84eedb'
// let appId = '22848900-c6ee-449b-b7dd-d43966230ab8';
// let userId = '93a56c98-03fc-4813-a6bf-403e49252ec8';
// let orgId = '42e53c7e-f8cb-45d9-a20a-d80da0d11c59';
// let appId = (appIdTmp == null || appIdTmp == "" || appIdTmp == undefined) ? store.state.AppId : appIdTmp;
// let userId = (userIdTmp == null || userIdTmp == "" || userIdTmp == undefined) ? store.state.UserId : userIdTmp;
// let orgId = (orgIdTmp == null || orgIdTmp == "" || orgIdTmp == undefined) ? store.state.OrgId : orgIdTmp;
let clientType = 0;//andorid 1  ;ios 2
let roleType = 0;//无要求、任意值都可；
// get 示例
export const get = () => {
    return axios({
        url: '/query',
        method: 'get'
    })
};

//post 示例
export const post = data => {
    return axios({
        url: '/upload',
        method: 'post',
        data
    })
};


/**
 * 追加默认参数
 * orgId
 * userId
 * appId
 */
function addDefaultParam(data) {
    data.AppId = appId == null ? '00000000-0000-0000-0000-000000000000' : appId;
    data.UserId = userId;
    data.OrgId = orgId;
    data.clientType = clientType;
    data.roleType = roleType
}

/**
 * 添加/修改基础配置
 * @param data
 *      Id              ID
 *      Text            文本
 *      IsDefault       是否默认值
 *      IsDeadline      是否有期限/是否执法项
 *      IsReform        是否启用整改
 *      StoreTypeId     业态ID
 *      TaskTypeId      任务ID 常规检查/全项检查/双随机检查
 *      ProcessType     任务流类型：0巡查、1自查、2双随机
 *      Score           严重程度顺序
 *      Type            类型 1任务类型 2检查结果3处理结果 4餐厅类型 5执法处理 6检查项分类 7检查项重要项和
 *      PreviousId      对应检查结果 （如：不符合/符合/基本符合）
 *      orgId           组织id
 *      appId           应用id
 *      userId          用户id
 *      clientType      客户端类型
 *      roleType        角色类型
 */
export const SaveBasicOption = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/SaveBasicOption',
        method: 'post',
        data
    })
};

/**
 * 获取一级业态
 * @param type 0获取一级二级，1获取一级，2获取二级
 */
export const GetOperateInfo = (type,isShowDisabled) => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetOperateInfo',
        method: 'post',
        data: {
            type: type,
            appId:appId,
            isShowDisabled:isShowDisabled
        }
    })
};
/**
 * 获取基础配置
 * @param data
 * @param type  1:StoreTypeId   业态ID
 *              2：TaskTypeId    任务类型 常规检查/全项检查/双随机检查
 *              3：ProcessType   任务流类型：0巡查、1自查、2双随机
 *              4：Type          类型 1任务类型 2检查结果3处理结果 4餐厅类型 5执法处理 6检查项分类 7检查项重要项和
 *              5：PreviousId    业务ID 巡查/自查
 *              6：orgId         组织id
 *              7：appId         应用id
 *              9：userId        用户id
 *              10:clientType    客户端类型
 *              11:roleType      角色类型
 *
 */
export const GetBasicOptionList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/GetBasicOptionList',
        method: 'post',
        data
    })
};
/**
 * 获取执法状态表格数据
 * @param data
 * {
  "StoreTypeId": "string",业态ID
  "TaskTypeId": "string",任务Id
  "EnforceResultId": "string",执法结果Id (如:限期整改/停业整顿/已通过)
  "OrgId": "string",组织id
  "AppId": "string",
  "UserId": "string",
  "ClientType": 0,
  "RoleType": 0,
  "RoleId": "string"角色ID
}
 * @constructor
 */
export const GetEnforceStatus = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/GetEnforceStatus',
        method: 'post',
        data
    })
};
/**
 * 获取检查项内容列表
 * @param data
 * @constructor
 */
export const GetInspectOptionListAsync = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/GetInspectOptionListAsync',
        method: 'post',
        data
    })
};

/**
 * 巡查任务详情
 * @param data
 */
export const GetInspectTaskDetail = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Inspect/GetInspectTaskDetail',
        method: 'post',
        data
    })
};

/**
 * 电子巡查列表
 * @param data
 */
export const GetElectGridDataInfo = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Inspect/GetElectGridDataInfo',
        method: 'post',
        data
    })
};

/**
 * 电子巡查 详情-日志
 * @param data
 */
export const GetElectInspectLog = (id) => {
    return axios({
        url: urlConfig.ripsBase + '/Inspect/GetElectInspectLog',
        method: 'post',
        data:{
            "ElectInspectId": id
        }
    })
};

/**
 * 电子巡查详情
 * @param data
 */
export const GetElectPatrolDataDetail = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Inspect/GetElectPatrolDataDetail',
        method: 'post',
        data
    })
};

/**
 * 电子巡查 通告
 * @param data
 */
export const UpdateStatus = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Inspect/UpdateStatus',
        method: 'post',
        data
    })
};

/**
 * 电子巡查 复查
 * @param data
 */
export const ReviewElectInspect = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Inspect/ReviewElectInspect',
        method: 'post',
        data
    })
};

/**
 * 执法任务详情
 * @param data
 */
export const GetInspectEnforceTaskDetail = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Inspect/GetInspectEnforceTaskDetail',
        method: 'post',
        data
    })
};

/**
 * 巡查详情检查项
 * @param data
 */
export const GetInspectTaskOptionsResult = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Inspect/GetInspectTaskOptionsResult',
        method: 'post',
        data
    })
};

/**
 * 执法详情检查项
 * @param data
 */
export const GetEnforceTaskOptionsResult = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Inspect/GetEnforceTaskOptionsResult',
        method: 'post',
        data
    })
};

/**
 * 人员管理列表
 * @param data
 */
export const GetUserRoleList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetUserRoleList',
        method: 'post',
        data
    })
};
/**
 * 人员管理列表-全
 * @param data
 */
export const GetUserRoleListNew = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetUserRoleListNew',
        method: 'post',
        data
    })
};

/**
 * 人员管理删除
 * @param data
 */
export const DelUserRole = (userRealIds) => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/DelUserRole',
        method: 'post',
        data: {
            userRealIds: userRealIds
        }
    })
};

/**
 * 通过组织Id获取职员信息
 * @param data
 */
export const GetEmployeeInfo = (OrgId, EmpName, PageNumber, PageSize) => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetEmployeeInfo',
        method: 'post',
        data: {
            "PageNumber": PageNumber,
            "PageSize": PageSize,
            "EmpName": EmpName,
            "OrgId": OrgId
        }
    })
};

/**
 * 人员管理添加
 * @param UserIds 选择用户id集合
 */
export const SubUserPrivilege = (UserIds, AreaLevel, AreaCode) => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/SubUserPrivilege',
        method: 'post',
        data: {
            "AppId": appId,
            "AreaLevel": AreaLevel,
            "AreaCode": AreaCode,
            "Data": UserIds,
            "OrgId": orgId,
            "SubId": userId
        }
    })
};

/**
 * 根据组织找角色信息
 */
export const GetRoleInfoByOrgId = () => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetRoleInfoByOrgId',
        method: 'post',
        data: {
            "OrgId": orgId,
        }
    })
};

/**
 * 网格人员设置左侧区域列表
 * @param type 1为全部，0为权限
 */
export const GetAreaInfoList = (type,currentUserId) => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetAreaInfoList',
        method: 'post',
        data: {
            "type": type,
            "orgId": orgId,
            "appId": appId,
            "userId": currentUserId,
        }
    })
};

/**
 * 设置业务业态
 *@ item    "OperateTypeId": "string",
 "OperateTypeName": "string",
 "BusinessInfo": [
 {
                                    "BusinessId": "string",
                                    "BusinessName": "string"
                                 }
 ]
 */
export const SubOperateUser = (UserPrivilegeIds, OperateDatas) => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/SubOperateUser',
        method: 'post',
        data: {
            "UserPrivilegeId": UserPrivilegeIds,
            "OperateData": OperateDatas,
            "AppId":appId
        }
    })
};

export const SavePrivilegeAndOperate = (p) => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/SavePrivilegeAndOperate',
        method: 'post',
        data: {
            AppId:appId,
            OrgId:orgId,
            SubId:userId,
            ...p
        }
    })
};

/**
 * 判断app是否全国
 *@param
 */
export const GetAppPeropty = () => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetAppPeropty',
        method: 'post',
        data: {
            appId: appId
        }
    })
};

/**
 * 获取默认省市区
 *@param
 */
export const GetCityCode = () => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetCityCode',
        method: 'post',
        data: {
            appId: appId
        }
    })
};

/**
 * 获取区域列表
 * @param
 */
export const GetAreaListShow = () => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetAreaListShow',
        method: 'post',
        data: {
            appId: appId,
            userId:userId,
            orgId: orgId
        }
    })
}

/**
 * 获取检查项内容列表
 *@parm
 */
export const GetInspectOptionList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/GetInspectOptionList',
        method: 'post',
        data
    })
};

/**
 * 获取 设置业务属性检查项列表
 *@parm
 */
export const GetInspectSetInspectOptionListAsync = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/GetInspectSetInspectOptionListAsync',
        method: 'post',
        data
    })
};

/**
 *获取检查项内容详情
 *@parm
 */
export const GetInspectOptionDetailAsync = (Id, clientType, roleType) => {
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/GetInspectOptionDetailAsync',
        method: 'post',
        data: {
            "Id": Id,
            "orgId": orgId,
            "appId": appId,
            "userId": userId,
            "clientType": clientType,
            "roleType": roleType
        }
    })
};

/**
 *保存检查项
 *@parm
 */
export const SaveInspectOptionAsync = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/SaveInspectOptionAsync',
        method: 'post',
        data
    })
};

/**
 *检查项排序
 *@parm
 */
export const SortInspectOptionAsync = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/SortInspectOptionAsync',
        method: 'post',
        data
    })
};

/**
 *更新检查项
 *@parm
 */
export const UpdateInspectOptionAsync = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/UpdateInspectOptionAsync',
        method: 'post',
        data
    })
};

/**
 *删除检查项
 *@parm
 */
export const DelInspectOptionAsync = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/DelInspectOptionAsync',
        method: 'post',
        data
    })
};

/**
 *获取检查项业务属性
 *@parm
 */
export const GetInspectOptionAttr = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/GetInspectOptionAttr',
        method: 'post',
        data
    })
};

/**
 *删除基础配置
 *@parm
 *      Id              行id
 *      orgId           组织id
 *      appId           应用id
 *      userId          用户id
 *      clientType      客户端类型
 *      roleType        角色类型*
 */
export const DelBasicOption = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/DelBasicOption',
        method: 'post',
        data
    })
};

/**
 *业务属性权限设置获取
 */
export const GetTaskTypePrivilegescopeAsync = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/GetTaskTypePrivilegescopeAsync',
        method: 'post',
        data
    })
};

/**
 * 设置组织
 * @param {*} data
 */
export const SaveTaskTypePrivilegescopeAsync = (data) => {

    return axios({
        url: urlConfig.ripsBase + '/BasicOption/SaveTaskTypePrivilegescopeAsync',
        method: 'post',
        data
    })
};

/**
 * 获取部门列表
 * @param {*} data
 */
export const GetDepartmentlistAsync = (data) => {
    data.OrgId = orgId;
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/GetDepartmentlistAsync',
        method: 'post',
        data
    })
};

/**
 * 根据组织获取员工列表
 * @param {*} data
 */
export const GetEmployeeInfoByOrgId = (data) => {
    data.AppId = appId;
    data.UserId = userId;
    data.OrgId = orgId;
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/v3/GetEmployeeInfoByOrgId',
        method: 'post',
        data
    })
};
/**
 * 根据组织获取员工列表
 * @param {*} data
 */
export const GetEmployeeInfoByOrgIdPager = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/v3/GetEmployeeInfoByOrgIdPager',
        method: 'post',
        data
    })
};
/**
 * 根据区域获取组织
 * @param {*} data
 */
export const GetUserByAreaCode = (data) => {
    data.AppId = appId;
    data.OrgId = orgId;
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetUserByAreaCode',
        method: 'post',
        data
    })
};

/**
 *设置巡查结果条件
 *@parm
 *      MinCount            数量
 *      InspectResultId     检查结果Id
 *      InspectOptionLevelId    重要程度Id
 *      Operatorin          条件运算符 1:大于等于 2：大于
 *      Remark              描述 如：一般大于等于0个
 *      orgId           组织id
 *      appId           应用id
 *      userId          用户id
 *      clientType      客户端类型
 *      roleType        角色类型
 */
export const SetInspectResultCondition = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/SetInspectResultCondition',
        method: 'post',
        data
    })
};

//获取巡查结果设置条件里的列表
export const GetInspectResultCondition = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/GetInspectResultCondition',
        method: 'post',
        data
    })
};

/**
 * 获取巡查管理列表数据
 */
export const QueryList = (data) => {
    data.AppId = appId;
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/QueryList',
        method: 'post',
        data
    })
};

/**
 * 获取检查项业务属性设置列表
 */
export const GetInspectOptionSetListAsync = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/GetInspectOptionSetListAsync',
        method: 'post',
        data
    })
};

/**
 * 设置检查项业务属性
 */
export const SetInspectOptionAttrAsync = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/SetInspectOptionAttrAsync',
        method: 'post',
        data
    })
};

/**
 * 删除任务
 * @param {*} data
 */
export const DeletePatrolTaskByIds = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/DeletePatrolTaskByIds',
        method: 'post',
        data
    })
};

/**
 * 获取巡查管理-获取任务详情
 */
export const GetPatrolTaskDetail = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/GetPatrolTaskDetail',
        method: 'post',
        data
    })
};

/**
 * 发布任务
 * @param {*} data
 */
export const Publish = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PublishPatrolTask/Publish',
        method: 'post',
        data
    })
};

/**
 * 获取检查对象
 * @param {*} data
 */
export const ChoseStore = (data) => {
    data.AppId = appId;
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/ChoseStore',
        method: 'post',
        data
    })
};

/**
 * 巡查管理设置条件删除条件
 * @param {*} data
 */
export const DelInspectResultCondition = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/DelInspectResultCondition',
        method: 'post',
        data
    })
};

/**
 * PC后台查询子任务
 * 巡查任务管理历史任务
 */
export const GetHistoryTasks = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/GetHistoryTasks',
        method: 'post',
        data
    })
};

/**
 * PC后台查询子任务
 * 督办
 */
export const Supervise = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/Supervise',
        method: 'post',
        data
    })
};

/**
 * 自查管理列表接口
 */
export const QuerySelfManageList = (data) => {
    data.AppId = appId;
    return axios({
        url: urlConfig.ripsBase + '/SelfTaskManage/QueryList',
        method: 'post',
        data
    })
};

/**
 * 自查管理发布
 * @param {*} data
 */
export const PublishSelf = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PublishPatrolTask/PublishSelf',
        method: 'post',
        data
    })
};

/**
 * 自查管理 取消任务
 * @param {*} data
 */
export const SelfTaskCancel = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/SelfTaskManage/SelfTaskCancel',
        method: 'post',
        data
    })
};

/**
 * 自查管理 异常结束
 * @param {*} data
 */
export const SelfTaskFailEnd = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/SelfTaskManage/SelfTaskFailEnd',
        method: 'post',
        data
    })
};

/**
 * 巡查导出
 * @param {*} data
 */
export const ExportSubTaskByQueryParam = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/ExportSubTaskByQueryParam',
        method: 'post',
        data
    })
};

/**
 * 自查导出
 * @param {*} data
 */
export const ExportQueryResult = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/SelfTaskManage/ExportQueryResult',
        method: 'post',
        data
    })
};

/**
 * PC后台查询子任务
 * @param
 *      TaskType        任务类型（0巡查任务 1自查任务 2双随机任务）
 *      TaskName        任务名称
 *      TaskState       任务状态
 *      TaskId          主任务Id
 *      StartTime       开始时间
 *      EndTime         结束时间
 *      AreaOne         行政区域一级
 *      AreaTwo            行政区域二级
 *      Areathree       行政区域三级
 *      Areafour        行政区域四级
 *      StoreName       门店名称
 *      StoreState      门店状态
 *      HandleResult    处理结果
 *      ImplementResult 执法结果
 *      PageIndex       当前页面
 *      PageSize        显示行数
 */
export const GetSubTaskByQueryParam = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/GetSubTaskByQueryParam',
        method: 'post',
        data
    })
};

// 门店颜色状态列表
export const GetStateColors = () => {
    return axios({
        url: urlConfig.ripsBase + '/Store/StoreStatusConfigs'+'?appId='+appId,
        method: 'get',
    })
};
/**
 * 获取门店信息
 * @constructor
 */
export const GetStoreInfo = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Store/GetStoreInfo',
        method: 'post',
        data
    })
};
/**
 * 获取门店摄像头信息
 * @constructor
 */
export const GetStoreEquipments = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Store/GetStoreEquipments',
        method: 'post',
        data
    })
};
// 更新门店颜色状态列表
export const UpdateStateColors = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Store/UpdateStoreStatusConfig',
        method: 'post',
        data
    })
};
// 更新门店颜色状态列表
export const SubTaskFailEnd = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/SubTaskFailEndUser',
        method: 'post',
        data
    })
};
// 更新门店颜色状态列表
export const UpdateInspectOptionSetAsync = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/UpdateInspectOptionSetAsync',
        method: 'post',
        data
    })
};
// 删除门店颜色状态列表
export const DeleteInspectOptionSetAsync = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/DeleteInspectOptionSetAsync',
        method: 'post',
        data
    })
};

/**
 * 设置执法状态颜色
 * @param data
 * @constructor
 */
export const SetColorEnforceStatus = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/SetColorEnforceStatus',
        method: 'post',
        data
    })
};

/**
 * 获取自检查项列表
 * @param data
 * @constructor
 */
export const SearchInspectOptionSetListAsync = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/SearchInspectOptionSetListAsync',
        method: 'post',
        data
    })
};
/**
 * 检查项导入
 * @param data
 * @constructor
 */
export const UploadInspect = (data,AppId,StoreTypeId,ProcessType) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOption/UploadInspect'+"?AppId="+AppId+'&StoreTypeId='+StoreTypeId+'&ProcessType='+ProcessType+'&TaskTypeId=',
        method: 'post',
        data
    })
};
/**
 * 取消任务
 * @param data
 * @constructor
 */
export const SubTaskCancel = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/SubTaskCancel',
        method: 'post',
        data
    })
};

/**
 * 获取商圈（带权限）按门店添加
 * @param data
 * @constructor
 */
export const GetBusinessAttrList = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskRule/GetBusinessAttrList',
        method: 'post',
        data
    })
};

/**
 * 获取餐厅规模
 * @param data
 * @constructor
 */
export const GetRestaurSizeList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskRule/GetRestaurSizeList',
        method: 'get',

    })
};

/**
 * 导入、获取门店
 * @param data
 * @constructor
 */
export const GetRuleStoreList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskRule/GetRuleStoreList',
        method: 'post',
        data

    })
};

/**
 * 上传图片
 */

export const UploadFile = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/File/UploadFile',
        method: 'post',
        data
    })
};

// 获取任务执行详情
export const GetSelfTaskDetail = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/SelfTaskManage/GetSelfTaskDetail',
        method: 'post',
        data
    })
};

/**
 *
 * 检查结果列表汇总
 */
export const CheckResultManage = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/CheckResultManage/SearchCheckResultResp',
        method: 'post',
        data
    })
};

/**
 *
 * 自查子任务执行详情
 */
export const SelfTaskExecutedDetail = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/SelfTaskManage/SelfTaskExecutedDetail',
        method: 'post',
        data
    })
};

/**
 *
 * 自查任务结果查询
 */
export const SelfTaskQueryResult = (data) => {
    data.AppId = appId;
    return axios({
        url: urlConfig.ripsBase + '/SelfTaskManage/QueryResult',
        method: 'post',
        data
    })
};

/**
 *
 * 取消子任务(自查)
 */
export const SelfCheckSubTaskCancel = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/SelfTaskManage/SubTaskCancel',
        method: 'post',
        data
    })
};

/**
 *
 * 异常结束子任务(自查)
 */
export const SelfCheckSubTaskFailEnd = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/SelfTaskManage/SubTaskFailEndUser',
        method: 'post',
        data
    })
};

/**
 *
 * 历史任务(自查)
 */
export const SubTaskQueryList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/SelfTaskManage/SubTaskQueryList',
        method: 'post',
        data
    })
};

/**
 *
 * 追加门店
 */
export const AppendStore = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/PatrolSubTask/AppendStoreForPatrolTask',
        method: 'post',
        data
    })
};

/**
 *
 * 子任务调整
 */
export const UpdatePatrolSubTask = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/PatrolSubTask/UpdatePatrolSubTask',
        method: 'post',
        data
    })
};

/**
 *
 * 获取检查项结果配置
 */
export const GetInspectOptionResult = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/GetInspectOptionResult',
        method: 'post',
        data
    })
};

/**
 *
 * 修改检查项结果配置
 */
export const SaveInspectOptionResult = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/SaveInspectOptionResult',
        method: 'post',
        data
    })
};
/**
 *
 * 获取二级业态
 */
export const GetOperateSubInfo = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetOperateSubInfo',
        method: 'post',
        data
    })
};
/**
 *
 * 获取检查结果图片汇总
 */
export const GetInspectResultPicManageList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/GetInspectResultPicManageList',
        method: 'post',
        data
    })
};
/**
 *
 * 获取检查结果图片详情
 */
export const GetInspectResultPicDetailInfo = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/GetInspectResultPicDetailInfo',
        method: 'post',
        data
    })
};
/**
 *
 * 设置检查结果图片状态
 */
export const SetInspectResultPicStatus = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/SetInspectResultPicStatus',
        method: 'post',
        data
    })
};
/**
 *
 * 根据任务类型获取任务名称
 */
export const GetTaskNameLstByTaskTypeId = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/GetTaskNameLstByTaskTypeId',
        method: 'post',
        data
    })
};
/**
 *
 * 自查任务督办
 */
export const SendRemind = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/ComInspectTask/SendRemind',
        method: 'post',
        data
    })
};
/**
 *
 * 自查任务督办
 */
export const InspectNotice = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Notice/InspectNotice',
        method: 'post',
        data
    })
};

/**
 *  获取整改列表
 * @param {*} data
 */
export const GetReformList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Reform/GetReformList',
        method: 'post',
        data
    })
};

/**
 *  获取整改详情
 * @param {*} data
 */
export const GetReformDetail = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Reform/GetReformDetail',
        method: 'post',
        data
    })
};

/**
 *  获取整改详情
 * @param {*} data
 */
export const GetElectronicRecord = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Electronic/GetElectronicRecord',
        method: 'post',
        data
    })
};

/**
 * 自查删除任务
 */
export const DeleteTaskData = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolTaskManage/DeleteTaskData',
        method: 'post',
        data
    })
};

/**
 * 承诺书_ 分页查询_后台
 */
export const GetPageList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Undertaking/GetPageList',
        method: 'post',
        data
    })
};

/**
 * 承诺书(制度)_添加_后台
 */
export const Add = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Undertaking/Add',
        method: 'post',
        data
    })
};

/**
 * 承诺书(制度)_修改_后台
 */
export const Save = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Undertaking/Save',
        method: 'post',
        data
    })
};

/**
 * 承诺书(制度)_添加_后台
 */
export const GetById = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Undertaking/GetById',
        method: 'post',
        data
    })
};

/**
 * 获取电子管理详情
 */
export const GetElectronicDetail = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Electronic/GetElectronicDetail',
        method: 'post',
        data
    })
};

/**
 * 承诺书_ 启用详情_后台
 */
export const GetStoreUsePageList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Undertaking/GetStoreUsePageList',
        method: 'post',
        data
    })
};

/**
 * 承诺书(制度)_状态变更_后台
 */
export const SaveUndertakingStatus = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Undertaking/SaveUndertakingStatus',
        method: 'post',
        data
    })
};

/**
 * 获取违规项
 */
export const GetViolationOptionList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Electronic/GetViolationOptionList',
        method: 'post',
        data
    })
};

/**
 * 设置违规项关联关系
 */
export const SetViolationOption = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Electronic/SetViolationOption',
        method: 'post',
        data
    })
};

/**
 * 获取违规项、检查项 关联关系表
 */
export const GetInspectOptionToViolationOptionList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Electronic/GetInspectOptionToViolationOptionList',
        method: 'post',
        data
    })
};

/**
 * 删除违规项、检查项 关联关系表
 */
export const DelInspectOptionToViolationOption = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/Electronic/DelInspectOptionToViolationOption',
        method: 'post',
        data
    })
};

/**
 * 检查项列表接口
 */
export const GetInspectOptionBusinessFieldList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOptionBusiness/GetInspectOptionBusinessFieldList',
        method: 'post',
        data
    })
};

/**
 * 获取表单接口
 */
export const GetFormList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOptionBusiness/GetFormList',
        method: 'post',
        data
    })
};

/**
 * 获取表单接口
 */
export const GetFormFieldList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/InspectOptionBusiness/GetFormFieldList',
        method: 'post',
        data
    })
};

/**
 * 检查项修改接口
 */
export const UpdateInspectOptionBusinessField = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOptionBusiness/UpdateInspectOptionBusinessField',
        method: 'post',
        data
    })
};

/**
 * 检查项删除接口
 */
export const DeleteInspectOptionBusinessField = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/InspectOptionBusiness/DeleteInspectOptionBusinessField',
        method: 'post',
        data
    })
};

//美全加的表单的接口
/**
 * 初始化基础数据
 */
export const InitBasicOption = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/BasicOption/InitBasicOption',
        method: 'post',
        data
    })
};
//地图相关的接口
/**
 * 获取地图分类列表
 */
export const GetMapCategoryList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/GetMapCategoryList',
        method: 'post',
        data
    })
};

/**
 * 根据id获取某个地图分类信息
 */
export const GetMapCategoryInfo = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/GetMapCategoryInfo',
        method: 'post',
        data
    })
};

/**
 * 更新某个地图分类信息
 */
export const UpdateMapCategory = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/UpdateMapCategory',
        method: 'post',
        data
    })
};

/**
 * 根据id获删除某个地图
 */
export const DeleteMapCategory = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/DeleteMapCategory',
        method: 'post',
        data
    })
};

/**
 * 获取主体状态列表
 */
export const GetMapStatusList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapStatus/GetMapStatusList',
        method: 'post',
        data
    })
};

/**
 * 获取特殊事件数据源
 */
export const GetMapDataNames = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapStatus/GetMapDataNames',
        method: 'post',
        data
    })
};

/**
 * 新增特殊事件
 */
export const CreateMapEvent = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapEvent/CreateMapEvent',
        method: 'post',
        data
    })
};

/**
 * 上传图片
 */
export const Upload = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/File/UploadFile',
        method: 'post',
        data
    })
};

/**
 * 删除特殊事件
 */
export const DeleteMapEvent = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapEvent/DeleteMapEvent',
        method: 'post',
        data
    })
};

/**
 * 地图名称配置列表
 */
export const GetAllMap = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapNameConfiguration/GetAllMap',
        method: 'post',
        data
    })
};

/**
 * 地图名称配置列表-删除、启用
 */
export const ChangeIsEnuable = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapNameConfiguration/ChangeIsEnuable',
        method: 'post',
        data
    })
};

/**
 * 地图名称配置列表-添加、编辑
 */
export const MapNameConfigurationAdd = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapNameConfiguration/Add',
        method: 'post',
        data
    })
};

/**
 * 地图名称配置-获取布局列表
 */
export const GetAllLayoutList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapNameConfiguration/GetAllLayoutList',
        method: 'post',
        data
    })
};

/**
 * 地图名称配置-根据地图id获取业态数据
 */
export const GetAllStoreType = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapNameConfiguration/GetAllStoreType',
        method: 'post',
        data
    })
};

/**
 * 地图名称配置-获取数据源
 */
export const GetMapData = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapNameConfiguration/GetMapData',
        method: 'post',
        data
    })
};

/**
 * 地图名称配置-获取角色配置
 */
export const GetRoloConfigList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapNameConfiguration/GetRoloConfigList',
        method: 'post',
        data
    })
};

/**
*地图名称配置 - 获取地图分组列表
*/
export const GetMapGroupList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapGroup/GetMapGroupList',
        method: 'post',
        data
    })
};

/**
*地图名称配置 - 根据地图分组获取地图
*/
export const GetMapByGroupId = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapGroup/GetMapByGroupId',
        method: 'post',
        data
    })
};

/**
*地图名称配置 - 编辑地图分组
*/
export const SaveMapGroup = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapGroup/SaveMapGroup',
        method: 'post',
        data
    })
};

/**
*地图名称配置 - 删除地图分组
*/
export const DeleteMapGroup = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/MapGroup/DeleteMapGroup',
        method: 'post',
        data
    })
};

/**
 * 地图主体-获取列表
 */
export const GetMapMainSettingList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/GetMapMainSettingList',
        method: 'post',
        data
    })
};

/**
 * 地图主体-启用禁用
 */
export const EnableSetting = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/EnableSetting',
        method: 'post',
        data
    })
};

/**
 * 地图主体-删除
 */
export const DeleteMapBody = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/DeleteMapBody',
        method: 'post',
        data
    })
};

/**
 * 地图主体-获取地图和事件
 */
export const GetCategoryMapEventList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/GetCategoryMapEventList',
        method: 'post',
        data
    })
};

/**
 * 地图主体-创建
 */
export const SaveMapBody = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/SaveMapBody',
        method: 'post',
        data
    })
};

/**
 * 地图主体-获取基础设置
 */
export const GetMapBasicSettingByMapBodyId = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/GetMapBasicSettingByMapBodyId',
        method: 'post',
        data
    })
};

/**
 * 地图主体-保存基础设置
 */
export const SaveMapBasicSetting = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/SaveMapBasicSetting',
        method: 'post',
        data
    })
};

/**
 * 地图主体-获取数据设置运算符
 */
export const GetOperatorList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/GetOperatorList',
        method: 'post',
        data
    })
};

/**
 * 地图主体-获取数据设置弹框数据
 */
export const GetMapStatusDataSetting = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/GetMapStatusDataSetting',
        method: 'post',
        data
    })
};
/**
 * 地图主体-获取数据设置弹框数据 -----------新 20.09.22
 */
export const GetSelectedStoreType = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapNameConfiguration/GetSelectedStoreType',
        method: 'post',
        data
    })
};

/**
 * 地图主体-获取数据设置弹框数据
 */
export const MapStatusDataSetting = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/MapStatusDataSetting',
        method: 'post',
        data
    })
};

/**
 * 地图主体-数据设置-- 获取上报分类
 */
export const GetClassification = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/GetClassification',
        method: 'post',
        data
    })
};
/**
 * 编辑特殊事件
 */
export const UpdateMapEvent = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapEvent/UpdateMapEvent',
        method: 'post',
        data
    })
};

/**
 * 编辑特殊事件
 */
export const GetComboMapNameList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/GetComboMapNameList',
        method: 'post',
        data
    })
};

/**
 * 创建地图分类
 */
export const CreateMapCategory = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/CreateMapCategory',
        method: 'post',
        data
    })
};

/**
 * 获取特殊事件下拉数据
 */
export const GetEventByCategoryId = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/GetEventByCategoryId',
        method: 'post',
        data
    })
};

/**
 * 地图分类列表启用禁用
 */
export const UpdateMapCategoryStatus = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/UpdateMapCategoryStatus',
        method: 'post',
        data
    })
};

/**
 * 获取特殊事件列表
 */
export const GetMapEventList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapEvent/GetMapEventList',
        method: 'post',
        data
    })
};

/**
 * 特殊事件页面的启用禁用
 */
export const UpdateMapEventStatus = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapEvent/UpdateMapEventStatus',
        method: 'post',
        data
    })
};

/**
 * 特殊事件页面获取主体信息模板数据
 */
export const GetLayoutList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapEvent/GetLayoutList',
        method: 'post',
        data
    })
};

/**
 * 特殊事件配置
 */
export const ConfigCategoryEvent = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/ConfigCategoryEvent',
        method: 'post',
        data
    })
};

/**
 * 特殊事件配置
 */
export const GetMapInfoByCategoryId = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/MapCategory/GetMapInfoByCategoryId',
        method: 'post',
        data
    })
};

/**
 * 白名单管理 获取馆
 */
export const GetAuthorizedApp = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Presentation/GetAuthorizedApp',
        method: 'post',
        data
    })
};

/**
 * 白名单管理 获取特权用户
 */
export const GetPrivilegedUser = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Presentation/GetPrivilegedUser',
        method: 'post',
        data
    })
};

/**
 * 白名单管理 设置特权用户
 */
export const SetPrivilegedUser = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Presentation/SetPrivilegedUser',
        method: 'post',
        data
    })
};

/**
 * 白名单管理 设置馆列表
 */
export const GetAuthorizedAppLst = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Presentation/GetAuthorizedAppLst',
        method: 'post',
        data
    })
};

/**
 * 白名单管理 操作馆
 */
export const OperateAuthorizedApp = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Presentation/OperateAuthorizedApp',
        method: 'post',
        data
    })
};

/**
 * 白名单管理 获取馆下面用户
 */
export const GetAuthorizedAppUserLst = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Presentation/GetAuthorizedAppUserLst',
        method: 'post',
        data
    })
};

/**
 * 白名单管理 设置馆下面用户
 */
export const OperateAuthorizedAppUser = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Presentation/OperateAuthorizedAppUser',
        method: 'post',
        data
    })
};

/**
 * 白名单管理 根据appid获取可以登录该app的手机号
 */
export const GetLoginSettingLst = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Presentation/GetLoginSettingLst',
        method: 'post',
        data
    })
};

/**
 * 白名单管理 获取所有的app列表
 */
export const GetAppLst = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Presentation/GetAppLst',
        method: 'post',
        data
    })
};

/**
 * 根据AppId获取馆下面所有人 只用传AppId
 */
export const GetAppUsers = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Presentation/GetAppUsers',
        method: 'post',
        data
    })
};

//长兴项目接口
/**
 * 获取执法凭证单列表
 */
export const GetEnforceCertList = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/EnforceCert/GetEnforceCertList',
        method: 'post',
        data
    })
};

/**
 * 新增/修改执法凭证
 */
export const SaveEnforceCert = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/EnforceCert/SaveEnforceCert',
        method: 'post',
        data
    })
};

/**
 * 获取巡查执法处理配置 列表
 */
export const GetPatrolEnforceList = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolEnforce/GetPatrolEnforceList',
        method: 'post',
        data
    })
};

/**
 * 根据Id获取巡查执法处理配置
 */
export const GetPatrolEnforceById = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolEnforce/GetPatrolEnforceById',
        method: 'post',
        data
    })
};

/**
 * 上传图片
 */
export const UploadImage = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolEnforce/UploadImage',
        method: 'post',
        data
    })
};

/**
 * 获取角色列表
 */
export const GetRoleList = () => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolEnforce/GetRoleList',
        method: 'post',
        data:{}
    })
};

/**
 * 启用配置
 */
export const EnableConfig = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolEnforce/EnableConfig',
        method: 'post',
        data
    })
};

/**
 * 禁用配置
 */
export const DisableConfig = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolEnforce/DisableConfig',
        method: 'post',
        data
    })
};

/**
 * 获取执法整改单选项
 */
export const GetRectificationList = () => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolEnforce/GetRectificationList',
        method: 'post',
        data:{}
    })
};

/**
 * 保存巡查执法处理配置
 */
export const SavePatrolEnforce = (data) => {
    // addDefaultParam(data);
    return axios({
        // headers: {
        //     'Content-Type': 'application/json; charset=utf-8'
        // },
        url: urlConfig.ripsBase + '/PatrolEnforce/SavePatrolEnforce',
        method: 'post',
        data
    })
};

/**
 * 执法章保存
 */
export const SaveEnforceSeal = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/EnforceSeal/SaveEnforceSeal',
        method: 'post',
        data
    })
};

/**
 * 获取执法章列表 分页
 */
export const GetEnforceSealList = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/EnforceSeal/GetEnforceSealList',
        method: 'post',
        data
    })
};

/**
 *
 删除单条执法章
 */
export const DeleteEnforceSealById = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/EnforceSeal/DeleteEnforceSealById',
        method: 'post',
        data
    })
};

//五定配置
/**
 * 获取五定项配置
 */
export const GetFivePositionByAppId = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/FivePosition/GetFivePositionByAppId',
        method: 'post',
        data
    })
};

/**
 * 保存五定配置
 */
export const SaveFivePosition = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/FivePosition/SaveFivePosition',
        method: 'post',
        data
    })
};

/**
 * 获取执法章分页列表
 */
export const GetEnforceSealListNew = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/EnforceSeal/GetEnforceSealList',
        method: 'post',
        data
    })
};

/**
 * 自查报告列表
 */
export const GetComInspectReportList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ComInspect/GetComInspectReportList',
        method: 'post',
        data
    })
};

/**
 * 查询全部模板
 */
export const GetMapTemplatAll = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/MapFiltrate/GetMapTemplatAll',
        method: 'post',
        data
    })
};

/**
 * 筛选条件过滤  数据源规则表格
 */
export const GetMapFilterCondition = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/MapFiltrate/GetMapFilterCondition',
        method: 'post',
        data
    })
};

/**
 * 查询模板分页
 */
export const GetMapTemplatePage = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/MapFiltrate/GetMapTemplatePage',
        method: 'post',
        data
    })
};

/**
 * 新增地图模板（包含编辑模板）
 */
export const SaveMapTemplate = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/MapFiltrate/SaveMapTemplate',
        method: 'post',
        data
    })
};

/**
 *删除模板
 */
export const DeleteMapTemplate = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/MapFiltrate/DeleteMapTemplate',
        method: 'post',
        data
    })
};

/**
 *根据Id查询地图模板
 */
export const GetMapTemplateById = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/MapFiltrate/GetMapTemplateById',
        method: 'post',
        data
    })
};

/**
 *查询地图数据源列表 地图V2.0新增
 */
export const GetDataTypeByMapId = (data) => {
    // addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/GetDataTypeByMapId',
        method: 'post',
        data
    })
};

/**
 *查询地图数据源列表 地图V2.0新增
 */
export const GetMapMainSettingListRevise = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/MapMainSetting/GetMapMainSettingListRevise',
        method: 'post',
        data
    })
};

/**
 *查询门店展示配置
 */
export const GetStoreNameConfig = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolManageRevise/GetStoreNameConfig',
        method: 'post',
        data
    })
};

/**
 *编辑门店展示配置
 */
export const SaveStoreNameConfig = (data) => {
    addDefaultParam(data);
    return axios({
        url: urlConfig.ripsBase + '/PatrolManageRevise/SaveStoreNameConfig',
        method: 'post',
        data
    })
};

/**
 * 根据父级区域获取子集区域  适用于省市区
 * @param data
 */
export const GetAreaByCode = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetAreaByCode',
        method: 'post',
        data
    })
};

/**
 * 获根据区获取街道 只有街道
 * @param data
 */
export const GetBusinessLocation = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetBusinessLocation',
        method: 'post',
        data
    })
};

/**
 * 获根据街道获取社区 只有社区
 * @param data
 */
export const GetBusinessCommunity = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/UserManage/GetBusinessCommunity',
        method: 'post',
        data
    })
};

/**
 * 根据街道获取示范街列表
 *@param data
 */
export const getDemoList = data => {
    return axios({
        url: urlConfig.storeBase + '/Jinher.AMP.Store.SV.BusinessLayOutDiodeSV.svc/getDemoList',
        method: 'post',
        data
    })
}

/**
 *保存示范街数据
 */
export const SubDemoMapDraw = data => {
    return axios({
        url:urlConfig.storeBase + '/Jinher.AMP.Store.BP.DictionaryManageBP.svc/SubDemoMapDraw',
        method: 'post',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data
    })
}

/**
 *高德地图提供的逆地理编码接口 根据经纬度以及 key值
 *
 */
export const amapRegeo = (location, key) => {
    return axios({
        url: 'https://restapi.amap.com/v3/geocode/regeo' + '?output=json&location=' + location + '&key=' + key + '&radius=0&extensions=base',
        method: 'get'
    })
};

/**
 *根据视频ID获取视频地址
 */
export const GetVideoUrl = (data) => {
    addDefaultParam(data);
    return axios({
        url: 'https://imv.iuoooo.com/api/FiveLocation/V2/Get',
        method: 'post',
        data
    })
};

/**
 * 人工审核管理列表
 */
export const GetStoreCommConfigList = data => {
    return axios({
        url: urlConfig.ripsBase + '/StoreCommonConfig/GetStoreCommConfigList',
        method: 'post',
        data
    })
};

/**
 * 批量设置开关
 */
export const SubCommonSwitch = data => {
    return axios({
        url: urlConfig.ripsBase + '/StoreCommonConfig/SubCommonSwitch',
        method: 'post',
        data
    })
};

/**
 * 获取整改审核图片列表
 */
export const GetReformAuditPicList = data => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/GetReformAuditPicList',
        method: 'post',
        data
    })
};

/**
 * 自查审核通过
 */
export const ComInspectAuditPic = data => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/AuditPic',
        method: 'post',
        data
    })
};

/**
 * 整改审核通过
 */
export const ReformAuditPic = data => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/AuditPic',
        method: 'post',
        data
    })
};

/**
 *AI管理 -- 获取违规项
 */
export const GetAttrList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/GetAttrList',
        method: 'post',
        data
    })
};

/**
 * AI管理 -- AI表单图片  -- 获取五定类型
 */
export const GetFiveLocationType = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/GetFiveLocationType',
        method: 'post',
        data
    })
};

/**
 * AI管理 -- AI表单图片/视频/摄像头 -- 获取资源列表
 */
export const GetPicList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/GetPicList',
        method: 'post',
        data
    })
};
/**
 * AI管理 -- AI表单图片/视频/摄像头 -- 批量提交
 */
export const BatchSubmit = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/BatchSubmit',
        method: 'post',
        data
    })
};
/**
 * AI管理 -- AI视频 -- 获取视频
 */
export const GetAIVideoUrl = (data) => {
    let url
    if(window.location.origin.indexOf('ripx-ui') > 0){
        url="https://imv.iuoooo.com/api"
    }else{
        url="https://testimv.iuoooo.com/api"
    }
    return axios({
        url: url + '/FiveLocation/Get',
        method: 'post',
        data:{
            OrgId: orgId,
            AppId: appId,
            UserId: userId,
            ...data
        }
    })
};
/**
 * AI管理 -- AI表单图片/视频/摄像头 -- 获取资源尺寸
 */
export const GetPictureInfo = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/GetPictureInfo',
        method: 'post',
        data
    })
};

/**
 * AI管理 -- AI表单图片/视频/摄像头 -- 单个提交
 */
export const SingleSubmit = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/SingleSubmit',
        method: 'post',
        data
    })
};

/**
 * AI管理 -- AI服务授权 -- 获取授权列表
 */
export const GetAuthorizeList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/GetAuthorizeList',
        method: 'post',
        data
    })
};

/**
 * AI管理 -- AI服务授权 -- 获取单条授权
 */
export const GetAuthorizeById = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/GetAuthorizeById',
        method: 'post',
        data
    })
};

/**
 * AI管理 -- AI服务授权 -- 删除授权信息
 */
export const DeleteAuthorizeById = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/DeleteAuthorizeById',
        method: 'post',
        data
    })
};

/**
 * AI管理 -- AI服务授权 -- 编辑授权信息
 */
export const AddOrUpdateAuthorize = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/AddOrUpdateAuthorize',
        method: 'post',
        data
    })
};

/**
 * AI管理 -- AI服务授权 -- 获取部门信息
 */
export const GetDepartmentTreeData = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReformAuditPic/GetDepartmentTreeData',
        method: 'post',
        data
    })
};

/**
 * 运营管理页面 -- 查询门店标签展示配置
 */
export const GetStoreTagConfig = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/MapStatus/GetStoreTagConfig',
        method: 'post',
        data
    })
};

/**
 * 运营管理页面 -- 编辑门店标签展示配置
 */
export const SaveStoreTagConfig = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/MapStatus/SaveStoreTagConfig',
        method: 'post',
        data
    })
};

/**
 * 物联管理 -- 阈值设置 -- 获取设备类型
 */
export const GetIntelligentDeviceTypeList = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/ThresholdSetting/GetIntelligentDeviceTypeList',
        method: 'post',
        data
    })
};

/**
 * 物联管理 -- 阈值设置 -- 获取当前区域父级区域阈值预设值
 */
export const GetDefaultThresholdSetting = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/ThresholdSetting/GetDefaultThresholdSetting',
        method: 'post',
        data
    })
};

/**
 * 物联管理 -- 阈值设置 -- 根据区域获取阈值列表
 */
export const GetThresholdSettingList = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/ThresholdSetting/GetThresholdSettingList',
        method: 'post',
        data
    })
};

/**
 * 物联管理 -- 阈值设置 -- 根据Id获取阈值信息
 */
export const GetThresholdSettingById = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/ThresholdSetting/GetThresholdSettingById',
        method: 'post',
        data
    })
};

/**
 * 物联管理 -- 阈值设置 -- 保存或修改阈值信息
 */
export const AddOrUpdateThreshold = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/ThresholdSetting/AddOrUpdateThreshold',
        method: 'post',
        data
    })
};

/**
 * 物联管理 -- 阈值设置 -- 根据Id删除阈值信息
 */
export const DelThresholdSettingById = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/ThresholdSetting/DelThresholdSettingById',
        method: 'post',
        data
    })
};
/**
 * 物联管理 -- 阈值设置 -- 根据Id删除阈值信息
 */
export const ExportElectronicRecord = (data) => {
    addDefaultParam(data)
    return axios({
        url: urlConfig.ripsBase + '/Electronic/ExportElectronicRecord',
        method: 'post',
        data
    })
};
/**
 * 获取获取配置
 */
export const GetAppConfigValue = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/StoreCommonConfig/GetAppConfigValue',
        method: 'post',
        data
    })
};
/**
 * 保存配置
 */
export const SaveAppConfig = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/StoreCommonConfig/SaveAppConfig',
        method: 'post',
        data
    })
};
/**
 * 保存违规项
 */
export const SaveViolations = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Violations/SaveViolations',
        method: 'post',
        data
    })
};
/**
 * 获取违规项
 */
export const GetViolationsById = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Violations/GetViolationsById',
        method: 'post',
        data
    })
};
/**
 * 获取违规项列表(PC)
 */
export const GetViolationsList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Violations/GetViolationsList',
        method: 'post',
        data
    })
};
/**
 * 删除违规项(PC)
 */
export const DeleteViolations = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/Violations/DeleteViolations',
        method: 'post',
        data
    })
};
/**
 * 获取操作间列表
 */
export const GetOperateRoomList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReferenceImage/GetOperateRoomList',
        method: 'post',
        data
    })
};
/**
 * 获取参照图列表
 */
export const GetReferenceImageList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReferenceImage/GetReferenceImageList',
        method: 'post',
        data
    })
};
/**
 * 保存参照图
 */
export const SaveReferenceImage = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReferenceImage/SaveReferenceImage',
        method: 'post',
        data
    })
};
/**
 * 删除参照图
 */
export const DeleteReferenceImage = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReferenceImage/DeleteReferenceImage',
        method: 'post',
        data
    })
};

/**
 * 获取参照图
 */
export const GetReferenceImageById = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ReferenceImage/GetReferenceImageById',
        method: 'post',
        data
    })
};
/**
 * 重置组数
 */
export const ClearImageGroupInfo = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushReceive/ClearImageGroupInfo',
        method: 'post',
        data
    })
};
/**
 * 重置排序/更新排序
 */
export const InitImageSequence = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushReceive/InitImageSequence',
        method: 'post',
        data
    })
};
/**
 * 获取组数
 */
export const GetImageGroupNum = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushReceive/GetImageGroupNum',
        method: 'post',
        data
    }) 
};
/**
 * 获取图片总数
 */
export const GetImageTotalCount = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushReceive/GetImageTotalCount',
        method: 'post',
        data
    })
};

/**
 * 找茬奖励列表
 */
export const GetImageRewardManagePageList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImageRewardManage/GetImageRewardManagePageList',
        method: 'post',
        data
    })
};

/**
 * 获取PC端排行榜
 */
export const GetImageLeaderBoard = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePush/GetImageLeaderBoard',
        method: 'post',
        data
    })
};


/**
 * 获取最新的奖励设置
 */
export const GetImagePushRewardSet = () => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushRewardSet/GetImagePushRewardSet',
        method: 'post',
        
    })
};

/**
 * 保存奖励设置
 */
export const SaveImagePushRewardSet = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushRewardSet/SaveImagePushRewardSet',
        method: 'post',
        data
    })
};

/**
 * 查询详情页公示设置
 */
 export const GetImagePushStoreDetailsSet = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushRecovery/GetImagePushStoreDetailsSet',
        method: 'post',
        data
    })
};
/**
 * 编辑详情页公示设置
 */
 export const SaveImagePushStoreDetailsSet = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushRecovery/SaveImagePushStoreDetailsSet',
        method: 'post',
        data
    })
};
/**
 * 查看找茬纠错设置
 */
 export const GetImagePushRecoverySet = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushRecovery/GetImagePushRecoverySet',
        method: 'post',
        data
    })
};
/**
 * 编辑找茬纠错设置
 */
 export const SaveImagePushRecoverySet = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushRecovery/SaveImagePushRecoverySet',
        method: 'post',
        data
    })
};
/**
 * 获取图片审核管理列表
 */
export const GetImageAuditManageList = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushRecovery/GetImageAuditManageList',
        method: 'post',
        data
    })
};
/**
 * 提交图片审核通过以及驳回数据
 */
 export const SubmitImageAuditPassExcuseData = (data) => {
    return axios({
        url: urlConfig.ripsBase + '/ImagePushRecovery/SubmitImageAuditPassExcuseData',
        method: 'post',
        data
    })
};

// 默认全部导出
export default {
    get,
    post,
    SaveBasicOption,
    SaveInspectOptionAsync,
    GetOperateInfo,
    GetBasicOptionList,
    GetInspectTaskDetail,
    GetInspectEnforceTaskDetail,
    GetEnforceTaskOptionsResult,
    GetInspectTaskOptionsResult,
    SetInspectOptionAttrAsync,
    GetUserRoleList,
    GetUserRoleListNew,
    DelUserRole,
    GetEmployeeInfo,
    GetAreaInfoList,
    SubOperateUser,
    SavePrivilegeAndOperate,
    GetInspectOptionList,
    GetInspectSetInspectOptionListAsync,
    GetInspectOptionDetailAsync,
    DelBasicOption,
    UploadInspect,
    GetInspectOptionListAsync,
    QueryList,
    UpdateInspectOptionAsync,
    SortInspectOptionAsync,
    DelInspectOptionAsync,
    GetInspectOptionSetListAsync,
    SetInspectResultCondition,
    GetInspectResultCondition,
    GetSubTaskByQueryParam,
    GetAppPeropty,
    GetCityCode,
    GetAreaListShow,
    DeletePatrolTaskByIds,
    GetPatrolTaskDetail,
    SubUserPrivilege,
    GetRoleInfoByOrgId,
    GetTaskTypePrivilegescopeAsync,
    SaveTaskTypePrivilegescopeAsync,
    GetEnforceStatus,
    DelInspectResultCondition,
    GetHistoryTasks,
    ChoseStore,
    GetDepartmentlistAsync,
    GetEmployeeInfoByOrgId,
    GetEmployeeInfoByOrgIdPager,
    Supervise,
    Publish,
    PublishSelf,
    SelfTaskCancel,
    SubTaskFailEnd,
    GetStateColors,
    UpdateStateColors,
    QuerySelfManageList,
    UpdateInspectOptionSetAsync,
    DeleteInspectOptionSetAsync,
    SetColorEnforceStatus,
    SearchInspectOptionSetListAsync,
    SubTaskCancel,
    UploadFile,
    GetSelfTaskDetail,
    CheckResultManage,
    SelfTaskQueryResult,
    SelfCheckSubTaskCancel,
    SelfCheckSubTaskFailEnd,
    SubTaskQueryList,
    AppendStore,
    UpdatePatrolSubTask,
    GetInspectOptionResult,
    SaveInspectOptionResult,
    GetOperateSubInfo,
    GetInspectResultPicManageList,
    GetInspectResultPicDetailInfo,
    SetInspectResultPicStatus,
    GetTaskNameLstByTaskTypeId,
    GetUserByAreaCode,
    SendRemind,
    SelfTaskExecutedDetail,
    InspectNotice,
    GetStoreInfo,
    GetStoreEquipments,
    ReviewElectInspect,
    UpdateStatus,
    GetElectPatrolDataDetail,
    GetElectGridDataInfo,
    GetElectInspectLog,
    GetBusinessAttrList,
    GetRestaurSizeList,
    GetRuleStoreList,
    GetReformList,
    GetReformDetail,
    GetElectronicRecord,
    DeleteTaskData,
    GetPageList,
    Add,
    Save,
    GetById,
    GetElectronicDetail,
    GetStoreUsePageList,
    SaveUndertakingStatus,
    GetViolationOptionList,
    SetViolationOption,
    GetInspectOptionToViolationOptionList,
    DelInspectOptionToViolationOption,
    GetInspectOptionBusinessFieldList,
    GetFormList,
    GetFormFieldList,
    UpdateInspectOptionBusinessField,
    DeleteInspectOptionBusinessField,
    InitBasicOption,
    //地图相关接口
    GetMapCategoryList,
    GetMapCategoryInfo,
    UpdateMapCategory,
    DeleteMapCategory,
    GetMapStatusList,
    GetMapDataNames,
    CreateMapEvent,
    Upload,
    DeleteMapEvent,
    GetAllMap,
    ChangeIsEnuable,
    UpdateMapEvent,
    GetComboMapNameList,
    CreateMapCategory,
    GetEventByCategoryId,
    UpdateMapCategoryStatus,
    GetMapEventList,
    UpdateMapEventStatus,
    ConfigCategoryEvent,
    GetMapInfoByCategoryId,
    MapNameConfigurationAdd,
    GetAllLayoutList,
    GetMapData,
    GetMapMainSettingList,
    EnableSetting,
    DeleteMapBody,
    SaveMapBody,
    GetCategoryMapEventList,
    GetMapBasicSettingByMapBodyId,
    SaveMapBasicSetting,
    GetOperatorList,
    GetMapStatusDataSetting,
    GetSelectedStoreType,
    MapStatusDataSetting,
    GetClassification,
    GetAllStoreType,
    GetAuthorizedApp,
    GetPrivilegedUser,
    SetPrivilegedUser,
    GetAuthorizedAppLst,
    OperateAuthorizedApp,
    GetAuthorizedAppUserLst,
    OperateAuthorizedAppUser,
    GetLoginSettingLst,
    GetAppLst,
    GetAppUsers,
    GetEnforceCertList,
    SaveEnforceCert,
    GetPatrolEnforceList,
    GetPatrolEnforceById,
    UploadImage,
    GetRoleList,
    EnableConfig,
    DisableConfig,
    GetRectificationList,
    SavePatrolEnforce,
    SaveEnforceSeal,
    GetEnforceSealList,
    DeleteEnforceSealById,
    GetRoloConfigList,
    GetMapGroupList,
    SaveMapGroup,
    DeleteMapGroup,
    GetMapByGroupId,
    GetLayoutList,
    //五定配置
    GetFivePositionByAppId,
    SaveFivePosition,
    GetEnforceSealListNew,
    GetComInspectReportList,
    GetMapTemplatAll,
    GetMapFilterCondition,
    GetMapTemplatePage,
    SaveMapTemplate,
    DeleteMapTemplate,
    GetMapTemplateById,
    GetDataTypeByMapId,
    GetMapMainSettingListRevise,
    GetStoreNameConfig,
    SaveStoreNameConfig,
    ExportSubTaskByQueryParam,
    ExportQueryResult,
    // 一张图
    GetAreaByCode,
    GetBusinessLocation,
    GetBusinessCommunity,
    getDemoList,
    SubDemoMapDraw,
    amapRegeo,
    GetVideoUrl,
    // AI人工审核
    GetStoreCommConfigList,
    SubCommonSwitch,
    // AI自查整改
    GetReformAuditPicList,
    ComInspectAuditPic,
    ReformAuditPic,
    GetAttrList,
    GetPicList,
    GetFiveLocationType,
    GetAIVideoUrl,
    BatchSubmit,
    SingleSubmit,
    GetPictureInfo,
    // 运营管理
    GetStoreTagConfig,
    SaveStoreTagConfig,
    // 物联管理
    GetIntelligentDeviceTypeList,
    GetDefaultThresholdSetting,
    GetThresholdSettingList,
    GetThresholdSettingById,
    AddOrUpdateThreshold,
    DelThresholdSettingById,
    // AI服务授权
    GetAuthorizeList,
    GetAuthorizeById,
    DeleteAuthorizeById,
    AddOrUpdateAuthorize,
    GetDepartmentTreeData,
    ExportElectronicRecord,
    GetAppConfigValue,
    SaveAppConfig,
    //图片游戏
    SaveViolations,
    GetViolationsById,
    GetViolationsList,
    DeleteViolations,
    GetOperateRoomList,
    GetReferenceImageList,
    SaveReferenceImage,
    DeleteReferenceImage,
    GetReferenceImageById,
    ClearImageGroupInfo,
    InitImageSequence,
    GetImageGroupNum,
    GetImageTotalCount,
    GetImageRewardManagePageList,
    GetImageLeaderBoard,
    GetImagePushRewardSet,
    SaveImagePushRewardSet,
    //游戏找茬
    GetImagePushStoreDetailsSet,
    SaveImagePushStoreDetailsSet,
    GetImagePushRecoverySet,
    SaveImagePushRecoverySet,
    GetImageAuditManageList,
    SubmitImageAuditPassExcuseData
}
