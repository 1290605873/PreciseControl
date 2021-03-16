import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export const constantRouterMap = [
    {
        path: '/OperationManage',
        component: () => import('@/views/OperationManage/index.vue'),
        hidden: true,
        name: '运营管理',
    },
    {
        path: '/createTask',
        component: () => import('@/views/CreateTask/createTask.vue'),
        hidden: true,
        name: '发布巡检任务',
    },
    {
        path: '/patrolManagement',
        component: () => import('@/views/patrolManagement/patrolManagement.vue'),
        hidden: true,
        name: '巡查管理'
    },
    {
        path: '/checkItemLibrary',
        component: () => import('@/views/checkItemLibrary/checkItemLibrary.vue'),
        hidden: true,
        name: '检查项目库'
    },
    {
        path: '/CheckitemSettings',
        component: () => import('@/views/Checkitemsettings/Checkitemsettings.vue'),
        hidden: true,
        name: '检查项业务属性设置'
    },
    {
        path: '/ExaminationResult',
        component: () => import('@/views/ExaminationResult/ExaminationResult.vue'),
        hidden: true,
        name: '检查结果'
    },
    {
        path: '/EnforcementResult',
        component: () => import('@/views/EnforcementResult/EnforcementResult.vue'),
        hidden: true,
        name: '执法结果'
    },
    {
        path: '/ProcessingResult',
        component: () => import('@/views/ProcessingResult/ProcessingResult.vue'),
        hidden: true,
        name: '处理结果'
    },
    {
        path: '/colorPicker',
        component: () => import('@/views/colorPicker.vue'),
        hidden: true,
        name: '颜色选择'
    },
    {
        path: '/selfCheckManagement',
        component: () => import('@/views/selfCheckManagement/selfCheckManagement.vue'),
        hidden: true,
        name: '自改自查管理'
    },
    {
        path: '/PatrolResults',
        component: () => import('@/views/PatrolResults/PatrolResults.vue'),
        hidden: true,
        name: '巡查任务结果'
    },
    {
        path: '/SelfcheckingSetting',
        component: () => import('@/views/SelfcheckingSetting/SelfcheckingSetting.vue'),
        hidden: true,
        name: '自查项业务库设置'
    },
    {
        path: '/Statussettings',
        component: () => import('@/views/Statussettings/Statussettings.vue'),
        hidden: true,
        name: '门店警示状态'
    },
    {
        path: '/Menu',
        component: () => import('@/views/Menu/Menu.vue'),
        name:'菜单',
        meta: {
            title: '菜单'
        }
    },
    {
        path: '/CheckProSettings',
        component: () => import('@/views/CheckProSettings/CheckProSettings.vue'),
        name:'检查项目设置',
    },
    {
        path: '/TaskPerSetting',
        component: () => import('@/views/TaskPerSetting/TaskPerSetting.vue'),
        name: '业务指定权限管理',
    },
    {
        path: '/patrolStatusSetting',
        component: () => import('@/views/patrolStatusSetting/patrolStatusSetting.vue'),
        name: '执法状态',
    },
    {
        path: '/meshUserSetting',
        component: () => import('@/views/meshUserSetting/meshUserSetting.vue'),
        name: '网格人员权限管理',
    },
    {
        path: '/meshUserSettingAll',
        component: () => import('@/views/meshUserSettingAll/meshUserSettingAll.vue'),
        name: '网格人员权限管理（全国）',
    },
    {
        path: '/businessAuthSetting',
        component: () => import('@/views/businessAuthSetting/businessAuthSetting.vue'),
        name: '业务指定权限设置',
    },
    {
        path: '/businessType',
        component: () => import('@/views/businessType/businessType.vue'),
        hidden: true,
        name: '业务类型',
    }, {
        path: '/electronicManagement',
        component: () => import('@/views/electronicManagement/electronicManagement.vue'),
        hidden: true,
        name: '电子巡查',
    },
    {
        path: '/checkImportanceDegree',
        component: () => import('@/views/CheckImportanceDegree/checkImportanceDegree.vue'),
        hidden: true,
        name: '检查项重要程度',
    },
    {
        path: '/CheckResultsListManagement',
        component: () => import('@/views/CheckResultsListManagement/CheckResultsListManagement.vue'),
        hidden: true,
        name: '检查结果列表汇总',
    },
    {
        path: '/SelfCheckTaskResult',
        component: () => import('@/views/SelfCheckTaskResult/SelfCheckTaskResult.vue'),
        hidden: true,
        name: '自查任务结果',
    },
    {
        path: '/Checkitemresultsetting',
        component: () => import('@/views/Checkitemresultsetting/Checkitemresultsetting.vue'),
        hidden: true,
        name: '检查项结果',
    },
    {
        path: '/ElectronicPatrol',
        component: () => import('@/views/ElectronicPatrol/ElectronicPatrol.vue'),
        hidden: true,
        name: '电子巡查',
    },
    {
        path: '/DailyInspectionTasks',
        component: () => import('@/views/DailyInspectionTasks/DailyInspectionTasks.vue'),
        hidden: true,
        name: '日常检查任务',
    },
    {
        path: '/PCbackground',
        component: () => import('@/views/PCbackground/PCbackground.vue'),
        hidden: true,
        name: '关联表单项'
    },
    {
        path: '/',
        redirect:'/Menu',
        component: () => import('@/views/Main/Main.vue'),
        hidden: true,
        name: '业务基础设置',
        meta: { title: '业务基础设置', icon: '', noCache: true },
        //子路由由children表示
    },
    {
        path: '/BusinessSettings',
        component: () => import('@/views/BusinessSettings/BusinessSettings.vue'),
        hidden: true,
        name: '业务设置',
    },
    {
        path: '/Enablationdetails',
        component: () => import('@/views/Enablationdetails/Enablationdetails.vue'),
        hidden: true,
        name: '启用详情',
    },
    {
        path: '/AIpatrol',
        component: () => import('@/views/AIpatrol/AIpatrol.vue'),
        hidden: true,
        name: 'AI巡查管理',
        meta: {
            title: 'AI巡查管理'
        }
    },
    {
        path: '/Relatedirregularities',
        component: () => import('@/views/Relatedirregularities/Relatedirregularities.vue'),
        hidden: true,
        name: '关联违规项',
    },
    // {
    //     path: '/InspectionFiveSettings',
    //     component: () => import('@/views/InspectionFiveSettings.vue'),
    //     hidden: true,
    //     name: '巡查五定设置',
    // },
    {
        path: '/MapConfig',
        component: () => import('@/views/MapConfig/MapConfig.vue'),
        hidden: true,
        name: '地图配置',
        children:[
            {
                path: '/MapNameConfiguration',
                component: () => import('@/views/MapNameConfiguration/MapNameConfiguration.vue'),
                hidden: true,
                name: '地图名称配置',
            },
            {
                path: '/MapClass',
                component: () => import('@/views/MapClass/MapClass.vue'),
                hidden: true,
                name: '地图分类配置',
            },
            {
                path: '/SubjectStateChange',
                component: () => import('@/views/SubjectStateChange/SubjectStateChange.vue'),
                hidden: true,
                name: '主体状态变化设置',
            },
            {
                path: '/MapMain',
                component: () => import('@/views/MapMain/MapMain.vue'),
                hidden: true,
                name: '地图主体设置',
            },
            {
                path: '/SpecialEvent',
                component: () => import('@/views/SpecialEvent/SpecialEvent.vue'),
                hidden: true,
                name: '特殊事件',
            },
        ]
    },
    /*{
        path: '/MapNameConfiguration',
        component: () => import('@/views/MapNameConfiguration/MapNameConfiguration.vue'),
        hidden: true,
        name: '地图名称配置',
    },
    {
        path: '/MapClass',
        component: () => import('@/views/MapClass/MapClass.vue'),
        hidden: true,
        name: '地图分类配置',
    },
    {
        path: '/SubjectStateChange',
        component: () => import('@/views/SubjectStateChange/SubjectStateChange.vue'),
        hidden: true,
        name: '主体状态变化设置',
    },
    {
        path: '/MapMain',
        component: () => import('@/views/MapMain/MapMain.vue'),
        hidden: true,
        name: '地图主体设置',
    },
    {
        path: '/SpecialEvent',
        component: () => import('@/views/SpecialEvent/SpecialEvent.vue'),
        hidden: true,
        name: '特殊事件',
    },*/
    // {
    //     path: '/MapConfigPlat',
    //     component: () => import('@/views/MapConfigPlat/MapConfigPlat.vue'),
    //     hidden: true,
    //     name: '地图配置1',
    // },
    {
        path: '/FormTask',
        component: () => import('@/views/FormTask/FormTask.vue'),
        hidden: true,
        name: '表单任务',
    },
    {
        path: '/WhiteListManagement',
        component: () => import('@/views/WhiteListManagement/Index.vue'),
        hidden: true,
        name: '白名单管理',
    },
    {
        path: '/WhiteListManagement/Bigscreenwhitelist',
        component: () => import('@/views/WhiteListManagement/Bigscreenwhitelist.vue'),
        hidden: true,
        name: '大屏白名单',
    },
    {
        path: '/Largescreenpermission',
        component: () => import('@/views/Largescreenpermission/Largescreenpermission.vue'),
        hidden: true,
        name: '大屏使用权限',
    },
    {
        path: '/EnforcementVoucher',
        component: () => import('@/views/EnforcementVoucher/EnforcementVoucher.vue'),
        hidden: true,
        name: '执法凭证单',
    },
    {
        path: '/PatrolLawEnforcement',
        component: () => import('@/views/PatrolLawEnforcement/PatrolLawEnforcement.vue'),
        hidden: true,
        name: '巡查执法处理',
    },
    {
        path: '/LawEnforcementSealManagement',
        component: () => import('@/views/LawEnforcementSealManagement/LawEnforcementSealManagement.vue'),
        hidden: true,
        name: '执法章管理',
    },

    {
        path: '/FivePosition',
        component: () => import('@/views/FivePosition/FivePosition.vue'),
        hidden: true,
        name: '五定配置',
    },
    {
        path: '/CheckReportShare',
        component: () => import('@/views/CheckReportShare/CheckReportShare.vue'),
        hidden: true,
        name: '自查报告分享',
    },
    {
        path: '/ToDo',
        component: () => import('@/views/ToDo/ToDo.vue'),
        hidden: true,
        name: '代办页',
    },
    {
        path: '/patrolManagementSettings',
        component: () => import('@/views/patrolManagementSettings/patrolManagementSettings.vue'),
        hidden: true,
        name: '巡查管理设置',
    },
    {
        path: '/Riskjianguan',
        component: () => import('@/views/RiskJianguan/Riskjianguan.vue'),
        hidden: true,
        name: '风险监管',
    },
    {
        path: '/xuncha',
        component: () => import('@/views/RiskJianguan/xuncha.vue'),
        hidden: true,
        name: '风险监管',
    },
    {
        path: '/zicha',
        component: () => import('@/views/RiskJianguan/zicha.vue'),
        hidden: true,
        name: '风险监管',
    },
    {
        path: '/ApplicationComponent',
        component: (resolve) => require(['@/views/ApplicationComponent/ApplicationComponent.vue'],resolve),
        hidden: true,
        name: '应用组件配置',
        children:[
            {
                path: '/DataSourceRuleSettings',
                component: () => import('@/views/DataSourceRuleSettings/DataSourceRuleSettings.vue'),
                hidden: true,
                name: '数据规则源设置',
                children:[
                    {
                        path: '/DataSourceRule',
                        component: () => import('@/views/DataSourceRule/DataSourceRule.vue'),
                        hidden: true,
                        name: '数据源规则',
                    },
                    {
                        path: '/FilterTemplateSettings',
                        component: () => import('@/views/FilterTemplateSettings/FilterTemplateSettings.vue'),
                        hidden: true,
                        name: '筛选模板设置',
                    },
                ]
            },
            {
                path: '/MapConfigPlat',
                component: () => import('@/views/MapConfigPlat/MapConfigPlat.vue'),
                hidden: true,
                name: '地图配置1',
            },
            // {
            //     path: '/MapConfig',
            //     component: () => import('@/views/MapConfig/MapConfig.vue'),
            //     hidden: true,
            //     name: '地图配置',
            //     children:[
            //         {
            //             path: '/MapNameConfiguration',
            //             component: () => import('@/views/MapNameConfiguration/MapNameConfiguration.vue'),
            //             hidden: true,
            //             name: '地图名称配置',
            //         },
            //         {
            //             path: '/MapClass',
            //             component: () => import('@/views/MapClass/MapClass.vue'),
            //             hidden: true,
            //             name: '地图分类配置',
            //         },
            //         {
            //             path: '/SubjectStateChange',
            //             component: () => import('@/views/SubjectStateChange/SubjectStateChange.vue'),
            //             hidden: true,
            //             name: '主体状态变化设置',
            //         },
            //         {
            //             path: '/MapMain',
            //             component: () => import('@/views/MapMain/MapMain.vue'),
            //             hidden: true,
            //             name: '地图主体设置',
            //         },
            //         {
            //             path: '/SpecialEvent',
            //             component: () => import('@/views/SpecialEvent/SpecialEvent.vue'),
            //             hidden: true,
            //             name: '特殊事件',
            //         },
            //     ]
            // },
        ]
    },
    {
        path: '/manualAuditMag',
        component: () => import('@/views/manualAuditMag/manualAuditMag.vue'),
        hidden: true,
        name: '人工审核管理'
    },
    {
        path: '/AIoperationSelfExam',
        component: () => import('@/views/AIoperationSelfExam/AIoperationSelfExam.vue'),
        hidden: true,
        name: 'AI自查运营'
    },
    {
        path: '/AIFormSelfCheckImage',
        component: () => import('@/views/AIFormSelfCheckImage/AIFormSelfCheckImage.vue'),
        hidden: true,
        name: 'AI表单自查图片'
    },
    {
        path: '/AIFormSelfCheckVideo',
        component: () => import('@/views/AIFormSelfCheckVideo/AIFormSelfCheckVideo.vue'),
        hidden: true,
        name: 'AI表单自查视频'
    },
    {
        path: '/AICameraPhotograph',
        component: () => import('@/views/AICameraPhotograph/AICameraPhotograph.vue'),
        hidden: true,
        name: 'AI摄像头拍照'
    },
    {
        path: '/AIoperationRectificate',
        component: () => import('@/views/AIoperationRectificate/AIoperationRectificate.vue'),
        hidden: true,
        name: 'AI整改运营'
    },
    {
        path: '/AIServiceAuth',
        component: () => import('@/views/AIServiceAuth/AIServiceAuth.vue'),
        hidden: true,
        name: 'AI服务授权'
    },
    {
        path: '/SelfCheckFormDataMark',
        component: () => import('@/views/SelfCheckFormDataMark/SelfCheckFormDataMark.vue'),
        hidden: true,
        name: '自查表单标识'
    },
    {
        path: '/IOTManage',
        component: (resolve) => require(['@/views/IOTManage/Index.vue'], resolve),
        hidden: true,
        name: '物联管理',
        children: [
            // 该模块被砍了
            // {
            //     path: '/IOTEquipDictionary',
            //     component: (resolve) => require(['@/views/IOTManage/IOTEquipDictionary.vue'], resolve),
            //     hidden: true,
            //     name: '物联设备管理'
            // },
            {
                path: '/ThresholdSet',
                component: (resolve) => require(['@/views/IOTManage/ThresholdSet/ThresholdSet.vue'], resolve),
                hidden: true,
                name: '阈值设置'
            }
            // 该模块被砍了
            // {
            //     path: '/ViolationTriggerSet',
            //     component: (resolve) => require(['@/views/IOTManage/ViolationTriggerSet/ViolationTriggerSet.vue'], resolve),
            //     hidden: true,
            //     name: '违规触发条件设置'
            // }
        ]
    },
    {
        path: '/businessQuarySet',
        component: () => import('@/views/businessQuarySet/businessQuarySet.vue'),
        hidden: true,
        name: '企业查询设置'
    },
    {
        path: '/picGame',
        component: () => import('@/views/picGame/picGame.vue'),
        hidden: true,
        name: '找茬游戏参照图片配置'
    },
    {
        path: '/violations',
        component: () => import('@/views/picGame/violations.vue'),
        hidden: true,
        name: '新增问题点'
    },
    {
        path: '/operateButton',
        component: () => import('@/views/picGame/operateButton.vue'),
        hidden: true,
        name: 'button'
    },
    {
        path: '/rewardManagement',
        component: () => import('@/views/picGame/rewardManagement.vue'),
        hidden: true,
        name: '找茬奖励管理'
    },
    {
        path: '/faultDataSet',
        component: () => import('@/views/picGame/faultDataSet.vue'),
        hidden: true,
        name: '找茬数据设置'
    },
    {
        path: '/pickgameList',
        component: () => import('@/views/picGame/pickgameList.vue'),
        hidden: true,
        name: '找茬游戏运营监管'
    }
];


export default new Router({
    //mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})
