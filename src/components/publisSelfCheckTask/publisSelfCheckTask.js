import Pagination from '../../components/Pagination';
import Regionalism from '../../components/Regionalism';
import ChooseStore from '../../components/ChooseStore/ChooseStore';
import {watch} from 'fs';

/**
 * 发布自查任务
 */
export default {
    names: 'PublishSelfCheckTask',
    components: {
        Pagination,
        Regionalism,
        ChooseStore
    },
    props: {
        isShowButton: {
            type: Number,
            default: 1,
        },
        savaTaskInfo: {
            StoreTypeId: {
                type: String,
                default: ''
            },
            "TaskTypeId": {
                type: String,
                default: ''
            },
            "TaskName": {
                type: String,
                default: ''
            },
            "Explain": {
                type: String,
                default: ''
            },
            "StartTime": {
                type: String,
                default: ''
            },
            "EndTime": {
                type: String,
                default: ''
            },
            "ProcessType": {
                type: Number,
                default: 1
            },
            "TaskStatus": {
                type: Number,
                default: 1
            },
            "Frequency": {
                type: Number,
                default: 0
            },
            // "FrequencyCompary": {
            //     type: Number,
            //     default: 1
            // },
            "ByMethod": {
                type: Number,
                default: 1
            },
            "Times": {
                type: Number,
                default: 0
            },
            "TaskTargets": {
                type: Array,
                default: () => []
            },
            "Contents": {
                type: String,
                default: ''
            },
            "Checker": {
                type: String,
                default: ''
            },
            PatrolTaskRuleOptionInfoList: {
                type: Array,
                default: () => []
            },
            'IsOpen':{
                type:Number,
                default:0
            },
            "FrequencyCompary": {
                type: String,
                default: ''
            },
            "DayNum": {
                type: String,
                default: ''
            },
        },
    },
    data() {
        return {
			checkList:[],
            isShowButtonStore: false,
            //maxFrequency:10, //最大频次数
            Frequency: false,
            isDisable: false,//表单重复提交
            Times: true,
            selectedStores: [],
            //创建发布类型
            createTask: {
                //基础信息
                info: {
                    businessType: [],//业态类型
                    businessTypeValue: '',
                    checkType: [],//任务类型
                    checkTypeValue: '',
                    taskName: '',//任务名称
                    taskInfo: '',//任务说明

                },
                startTime: '',
                endTime: '',
                //任务执行设置
                rummagerValue1: '',//检查人
                rummagerValue2: '',//检查人

            },
            //检查内容
            checkingContent: {
                checkingContentDialog: {
                    show: false
                },
                Loading: true,
                checkingContentData: [],
                checkingContentTable: {
                    className: "分类名称",
                    checkName: "检查项名称",
                    explain: "说明",
                    img: "图片",
                    important: "重要性",
                    voice: "语音",
                    operationSteps: "操作步骤",
                    guidedImg: "引导图",
                    guidanceLang: "引导语",
                    isEnabled: "是否启用",
                    defaultPass: "默认通过",
                    operate: "操作"
                }
            },
            selectCheckingObject: {
                checkObjDialogList: false
            },

            listParam: {
                "StoreTypeId": "",
                "ProcessType": 1,
                "ClassifcationId": "",
                "TaskTypeId": "",
                "SearchWord": "",
                "pageNo": 1,
                "pageSize": 10000
            },
            StoreData: [],
            userDialog: false,
            userContentDialog: false,
            checkingData: [],
            checkingLeng: '',
            enableRule: false,
            rules: '',
            rule_operateStr:'',
            rule_businessStr:'',//商圈规则
            rule_area:'',
            rule_moreTypes:[],
            rule_permit:'',
            rule_storeName:'',
            rule_comName:'',
            rule_restsize:'',
            checkValue: '',
            isviewDetails: false,
            IsValid: '1',//是否启用
            DefaultOpt: '1',//默认通过项
            modifyId: '',//修改用的ID
            /**任务只能选择次日 */
            pickerOptions0: {//结束时间不能大于开始时间
                disabledDate: (time) => {
                    if (this.savaTaskInfo.EndTime) {
                        return time.getTime() > new Date(this.savaTaskInfo.EndTime).getTime() || time.getTime() < Date.now() - 8.64e7;
                    } else {//还没有选择结束时间的时候，让他只能选择今天之后的时间包括今天
                        return time.getTime() < Date.now() - 8.64e7
                    }

                }
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    if (this.savaTaskInfo.StartTime) {
                        return time.getTime() < new Date(this.savaTaskInfo.StartTime).getTime() - 1 * 24 * 60 * 60 * 1000;//可以选择同一天
                    } else {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                }
            },
            TaskTypeId: '',
            days: 0,
            FrequencyMax: 1,
            weekData:{
                datas:[
                    {label:'一',value:'1'},
                    {label:'二',value:'2'},
                    {label:'三',value:'3'},
                    {label:'四',value:'4'},
                    {label:'五',value:'5'},
                    {label:'六',value:'6'},
                    {label:'日',value:'7'},
                ],
                code:[]
            },
            weekInfo:'',
            monthData:{
                datas:[

                ],
                code:[]
            },
            monthInfo:'',
        }
    },
    methods: {
        //业态改变
        onOperateChange(val){
            //清除按类型的规则
            this.savaTaskInfo.PatrolTaskRuleOptionInfoList = [];
            // 清除相关显示
            this.rules = '';
            this.rule_operateStr = '';
            this.rule_area = '';
            this.rule_businessStr = '';
            this.rule_permit = '';
            this.rule_storeName = '';
            this.rule_comName = '';
            this.rule_restsize = '';
            this.savaTaskInfo.IsOpen = 0;
            //本地缓存也清理
            localStorage.removeItem('findStoreBytype' + this.$utils.getUrlKey('userId'));
            this.getBasicOptionList(val);
        },
        /**
         * 业务类型
         */
        getOperateInfo() {
            this.$api.GetOperateInfo(1).then(res => {
                this.createTask.info.businessType = res;
                this.getBasicOptionList();
            });

            this.TaskTypeId = this.savaTaskInfo.TaskTypeId;
        },
        /**
         * 任务类型
         */
        getBasicOptionList(val) {
            if (val != undefined) {
                this.TaskTypeId = '';
            }

            let dataInfo = {
                "StoreTypeId": this.savaTaskInfo.StoreTypeId,
                "TaskTypeId": "",
                "ProcessType": 1,
                "Type": 1,
                "PreviousId": ""
            };
            this.$api.GetBasicOptionList(dataInfo).then(res => {
                if (res.IsSuccess) {
                    this.createTask.info.checkType = res.Content;
                }
            });
        },
        reShowRule(){
            //回显服务器的规则
            if(this.savaTaskInfo.PatrolTaskRuleOptionInfoList!=null&&this.savaTaskInfo.PatrolTaskRuleOptionInfoList.length>0){
                for (let it of this.savaTaskInfo.PatrolTaskRuleOptionInfoList) {
                    if (it.Type == 1) {
                        let RuleOptionList = it.RuleOptionList;
                        if (RuleOptionList != null && RuleOptionList.length > 0) {
                            this.rules+='业态:';
                            for(let ite of RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_operateStr+=ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    } else if (it.Type == 2) {
                        let RuleOptionList = it.RuleOptionList;
                        if (RuleOptionList != null && RuleOptionList.length > 0) {
                            this.rules+=' 区域:';
                            for(let ite of RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_area += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    } else if (it.Type == 3) {
                        let RuleOptionList = it.RuleOptionList;
                        if (RuleOptionList != null && RuleOptionList.length > 0) {
                            this.rules+='商圈:';
                            for(let ite of RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_businessStr += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    } else if (it.Type == 4) {
                        let RuleOptionList = it.RuleOptionList;
                        if (RuleOptionList != null && RuleOptionList.length > 0) {
                            this.rules+=' 许可证号包含:';
                            for(let ite of RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_permit += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    } else if (it.Type == 5) {
                        let RuleOptionList = it.RuleOptionList;
                        if (RuleOptionList != null && RuleOptionList.length > 0) {
                            this.rules+=' 门店名称包含:';
                            for(let ite of RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_storeName += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    } else if (it.Type == 6) {
                        let RuleOptionList = it.RuleOptionList;
                        if (RuleOptionList != null && RuleOptionList.length > 0) {
                            this.rules+=' 单位名称包含:';
                            for(let ite of RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_comName += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    } else if (it.Type == 7) {
                        try {
                            let RuleOptionList = it.RuleOptionList;
                            if (RuleOptionList != null && RuleOptionList.length > 0) {
                                this.rules+=' 餐厅规模包含:';
                                for(let ite of RuleOptionList){
                                    this.rules+=ite.OptionName+'、';
                                    this.rule_restsize += ite.OptionName+'、';
                                }
                                if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                    this.rules = this.rules.substring(0,this.rules.length-1);
                                }
                            }
                        } catch (e) {

                        }

                    }
                }
                this.cutUnlessStr();
            }
        },
        /**检查对象弹框 */
        showCheckObjDialogList() {
            if (this.savaTaskInfo.StoreTypeId == '' || this.savaTaskInfo.StoreTypeId == undefined) {
                this.notice('请先选择业态类型');
                return;
            }
            this.selectCheckingObject.checkObjDialogList = true;
        },
        /**
         * 检查内容
         */
        showCheckingContentDialog() {
            if (this.savaTaskInfo.StoreTypeId == '' || this.savaTaskInfo.StoreTypeId == undefined) {
                this.notice('请先选择业态类型');
                return;
            }
            if (this.TaskTypeId == '' || this.TaskTypeId == undefined) {
                this.notice('请先选择任务类型');
                return;
            }
            this.checkingContent.checkingContentDialog.show = true;
            this.listParam.StoreTypeId = this.savaTaskInfo.StoreTypeId;
            this.listParam.TaskTypeId = this.TaskTypeId;
            this.$api.GetInspectOptionSetListAsync(this.listParam).then(res => {
                if (res.IsSuccess) {
                    this.checkingContent.checkingContentData = res.Content;
                    this.checkingContent.Loading = false;
                } else {
                    this.$message({
                        message: res.Message,
                        type: 'success',
                        duration: 1200,
                        center: true,
                    });
                    this.checkingContent.Loading = false;
                }
            });
        },
        /**
         * 检查内容设置
         */
        setDefaultOpt(row) {
            this.isviewDetails = true;
            this.checkingSetting = row;
        },
        FrequencyChange(val) {
            switch (val) {
                case 1:
                    this.FrequencyMax = Math.min(1, this.days);
                    break;
                case 2:
                    this.FrequencyMax = Math.min(7, this.days);
                    break;
                case 3:
                    this.FrequencyMax = Math.min(30, this.days);
                    break;
                case 4:
                    this.FrequencyMax = Math.min(90, this.days);
                    break;
                case 5:
                    this.FrequencyMax = Math.min(180, this.days);
                    break;
                case 6:
                    this.FrequencyMax = Math.min(365, this.days);
                    break;
                default:
                    this.FrequencyMax = 1;
            }
        },
        Preservation() {
            let data = {
                "Id": this.checkingSetting.Id,
                "IsValid": this.IsValid,
                "DefaultOpt": this.DefaultOpt,
                "StoreTypeId": this.checkingSetting.StoreTypeId,
                "TaskTypeId": this.checkingSetting.TaskTypeId,
            };
            this.$api.SetInspectOptionAttrAsync(data).then(
                res => {
                    if (res.IsSuccess) {
                        let _this = this;
                        this.$message({
                            message: res.Message,
                            type: 'success',
                            duration: 1200,
                            center: true,
                            onClose() {
                                _this.showCheckingContentDialog();
                                _this.isviewDetails = false;
                            }
                        });

                    }
                }
            )
        },
        //检查内容
        checkContent() {
            this.checkingContent.checkingContentDialog.show = true;
        },
        /**
         * 取消
         */
        cancel() {
            this.$emit('PublishSelf', true);
        },
        /**
         * 发布任务
         */
        publish() {
            this.savaTaskInfo.TaskStatus = 1;
            this.savaTaskInfo.ProcessType = 1;
            this.savaTaskInfo.TaskTypeId = this.TaskTypeId;
            if (this.savaTaskInfo.StoreTypeId == '' || this.savaTaskInfo.StoreTypeId == undefined) {
                this.notice('请选择业态类型');
                return;
            }
            if (this.TaskTypeId == '' || this.TaskTypeId == undefined) {
                this.notice('请选择任务类型');
                return;
            }
            if (this.savaTaskInfo.Name == '' || this.savaTaskInfo.Name == undefined) {
                this.notice('请填写任务名称');
                return;
            }
            if (this.savaTaskInfo.StartTime == '' || this.savaTaskInfo.StartTime == undefined) {
                this.notice('请选择开始日期');
                return;
            }
            if (this.savaTaskInfo.EndTime == '' || this.savaTaskInfo.EndTime == undefined) {
                this.notice('请选择结束日期');
                return;
            }
            if (this.savaTaskInfo.ByMethod == 1 && this.savaTaskInfo.FrequencyCompary == 1 && this.savaTaskInfo.Frequency > 1) {
                this.$message({
                    showClose: true,
                    message: '频次为每天时频次不得大于1',
                    type: 'info',
                    duration: 1500,
                    center: true,
                });
                return;
            }
            let days = this.DateDiff(this.savaTaskInfo.StartTime, this.savaTaskInfo.EndTime);

            if (this.savaTaskInfo.ByMethod == 2 && this.savaTaskInfo.Times > days) {
                this.$message({
                    showClose: true,
                    message: '次数不能大于任务周期的天数',
                    type: 'info',
                    duration: 1500,
                    center: true,
                });
                return;
            }
            if(this.savaTaskInfo.ByMethod == 3 && this.savaTaskInfo.FrequencyCompary == 2 && this.weekData.code.length <= 0){
                this.message('请选择星期',-1);
                return
            }
            if(this.savaTaskInfo.ByMethod == 3 && this.savaTaskInfo.FrequencyCompary == 3 && this.monthData.code.length <= 0){
                this.message('请选择天数',-1);
                return
            }
            if (this.checkValue == '' || this.checkValue == undefined) {
                this.notice('请选择检查对象');
                return;
            }
            if (this.checkingLeng == '' || this.checkingLeng == undefined) {
                this.notice('请选择检查内容');
                return;
            }
            this.getPublish('发布中');
        },
        getPublish(noticeText) {
            this.isDisable = true;
            const loading = this.$loading({
                lock: true,
                text: noticeText,
                spinner: 'el-icon-loading',
                background: 'rgba(255,255,255,0.5)'
            });
            window.console.log(this.savaTaskInfo)
            this.$api.PublishSelf(this.savaTaskInfo).then(res => {
                let _this = this;
                if (res.IsSuccess) {
                    loading.close();
                    this.$message({
                        showClose: true,
                        message: res.Message,
                        type: 'success',
                        duration: 1200,
                        center: true,
                        onClose() {
                            _this.$emit('PublishSelf', true);
                            _this.isDisable = false;
                        }
                    });
                } else {
                    loading.close();
                    this.$message({
                        showClose: true,
                        message: res.Message,
                        type: 'error',
                        duration: 1200,
                        center: true,
                        onClose() {
                            _this.isDisable = false;
                        }
                    });
                }
            }).catch(r => {
                loading.close();
                this.$message({
                    showClose: true,
                    message: '发布失败',
                    type: 'error',
                    duration: 1200,
                    center: true,
                    onClose() {

                    }
                });
            });
        },
        /**保存不发布 */
        savePublish() {
            this.savaTaskInfo.TaskStatus = 0;
            this.savaTaskInfo.ProcessType = 1;
            this.savaTaskInfo.TaskTypeId = this.TaskTypeId;
            this.getPublish('保存中');
        },
        /**
         * 选择门店
         */
        selectStore(selection) {
            this.selectStoreArr = selection;
        },
        /**
         * 选择门店保存
         */
        storesResult(data) {
            if (data) {
                this.StoreData = data;

                this.checkValue = data.length + '个门店';
                let ExecutorId = [];
                data.forEach((value, index) => {
                    let obj = {
                        "ExecutorId": "",
                        "Name": "",
                        "Id": value.Id,
                        "StoreName": value.StoreName,
                        "UnitName": '',
                        "License": value.License,
                        "StoreSecTypeId": '',
                        "StoreTypeSecond": value.StoreTypeSecond,
                        "StoreAddress": value.StoreAddress
                    };
                    ExecutorId.push(obj);
                });
                this.savaTaskInfo.TaskTargets = ExecutorId;
                this.hisStoreData = data;
                this.selectedStores = data;
            }
            this.selectCheckingObject.checkObjDialogList = false;
        },
        /**
         * 门店类型查询规则
         * @param rule
         */
        setRule(rule) {
            this.rules = '';
            this.rule_operateStr = '';
            this.rule_area = '';
            this.rule_businessStr = '';
            this.rule_storeName = '';
            this.rule_comName = '';
            this.rule_permit = '';
            this.rule_restsize = '';

            this.savaTaskInfo.PatrolTaskRuleOptionInfoList = rule;
            if (this.savaTaskInfo.PatrolTaskRuleOptionInfoList.length == 0) {
                //取保存的值
                let paramStr = localStorage.getItem('findStoreBytype' + this.$utils.getUrlKey('userId'));
                let param = JSON.parse(paramStr);
                if (param != null) {
                    if (param.operate.names != null && param.operate.names.length > 0) {
                        this.rules+='业态:';
                        this.rules+= param.operate.names.join('、');
                        this.rule_operateStr = param.operate.names.join('、');
                    }
                    if (param.areaZone.names != null && param.areaZone.names.length > 0) {
                        this.rules+=' ';
                        this.rules+='区域:';
                        this.rules+= param.areaZone.names.join('、');
                        this.rule_area = param.areaZone.names.join('、');
                    }
                    if (param.business.names != null && param.business.names.length > 0) {
                        this.rules+=' ';
                        this.rules+='商圈:';
                        this.rules+=param.business.names.join('、');
                        this.rule_businessStr = param.business.names.join('、');
                    }
                    let count = 0;
                    if (param.moreTaskTypes != null && param.moreTaskTypes.length > 0) {
                        for (let i of param.moreTaskTypes) {
                            if(i.typesCode == 'code_permit'){
                                if(count == 0){
                                    this.rules+=' 许可证号包含:';
                                }
                                this.rule_permit+=i.result+'、';
                                this.rules+=i.result+'、';
                            }else if(i.typesCode == "code_storeName"){
                                if(count == 0){
                                    this.rules+=' 门店名称包含:';
                                }
                                this.rule_storeName+=i.result+'、';
                                this.rules+=i.result+'、';
                            }else if(i.typesCode == "code_companyName"){
                                if(count == 0){
                                    this.rules+=' 单位名称包含:';
                                }
                                this.rule_comName+=i.result+'、';
                                this.rules+=i.result+'、';
                            }else if(i.typesCode == "code_restsize"){
                                for(let kk of param.restSize){
                                    if(kk.RestaurSizeId == i.result){
                                        if(count == 0){
                                            this.rules+=' 餐厅规模包含:';
                                        }
                                        this.rule_restsize+=kk.RestaurSizeName+'、';
                                        this.rules+=i.result+'、';
                                    }
                                }

                            }
                            count++;
                        }
                        //去掉多余、
                        if( this.rule_permit.length>0){
                            this.rule_permit = this.rule_permit.substring(0,this.rule_permit.length-1);
                        }
                        if( this.rule_storeName.length>0){
                            this.rule_storeName = this.rule_storeName.substring(0,this.rule_storeName.length-1);
                        }
                        if( this.rule_comName.length>0){
                            this.rule_comName = this.rule_comName.substring(0,this.rule_comName.length-1);
                        }
                        if( this.rule_restsize.length>0){
                            this.rule_restsize = this.rule_restsize.substring(0,this.rule_restsize.length-1);
                        }

                    }

                }
            } else {
                for (let item of  this.savaTaskInfo.PatrolTaskRuleOptionInfoList) {
                    if (item.Type == 1) {
                        if(item.RuleOptionList.length>0){
                            this.rules+='业态:';
                            for(let ite of item.RuleOptionList){
                                this.rules+= ite.OptionName+'、';
                                this.rule_operateStr+=ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    }else  if (item.Type == 2) {
                        if(item.RuleOptionList.length>0){
                            this.rules+=' 区域:';
                            for(let ite of item.RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_area += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    }else  if (item.Type == 3) {
                        if(item.RuleOptionList.length>0){
                            this.rules+='商圈:';
                            for(let ite of item.RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_businessStr += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    }else  if (item.Type == 4) {
                        if(item.RuleOptionList.length>0){
                            this.rules+=' 许可证号包含:';
                            for(let ite of item.RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_permit += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    }else  if (item.Type == 5) {
                        if(item.RuleOptionList.length>0){
                            this.rules+=' 门店名称包含:';
                            for(let ite of item.RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_storeName += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    }else  if (item.Type == 6) {
                        if(item.RuleOptionList.length>0){
                            this.rules+=' 单位名称包含:';
                            for(let ite of item.RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_comName += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    }else  if (item.Type == 7) {
                        if(item.RuleOptionList.length>0){
                            this.rules+=' 餐厅规模包含:';
                            for(let ite of item.RuleOptionList){
                                this.rules+=ite.OptionName+'、';
                                this.rule_restsize += ite.OptionName+'、';
                            }
                            if( this.rules.length>0&&this.rules.indexOf('、')!=-1){
                                this.rules = this.rules.substring(0,this.rules.length-1);
                            }
                        }
                    }
                }
                this.cutUnlessStr();
            }

        },
        cutUnlessStr(){
            //去掉多余、
            if( this.rule_operateStr.length>0){
                this.rule_operateStr = this.rule_operateStr.substring(0,this.rule_operateStr.length-1);
            }
            if( this.rule_area.length>0){
                this.rule_area = this.rule_area.substring(0,this.rule_area.length-1);
            }
            if( this.rule_businessStr.length>0){
                this.rule_businessStr = this.rule_businessStr.substring(0,this.rule_businessStr.length-1);
            }
            if( this.rule_permit.length>0){
                this.rule_permit = this.rule_permit.substring(0,this.rule_permit.length-1);
            }
            if( this.rule_storeName.length>0){
                this.rule_storeName = this.rule_storeName.substring(0,this.rule_storeName.length-1);
            }
            if( this.rule_comName.length>0){
                this.rule_comName = this.rule_comName.substring(0,this.rule_comName.length-1);
            }
            if( this.rule_restsize.length>0){
                this.rule_restsize = this.rule_restsize.substring(0,this.rule_restsize.length-1);
            }
        },
        /**
         * 指定到人
         */
        changeRummagerValue2() {
            //window.console.log(this.createTask.info.rummagerValue2);
            if (this.savaTaskInfo.CheckType == 2) {
                this.userDialog = true;

            }
        },
        /**
         * 添加人
         */
        appendUser() {
            this.userContentDialog = true;
            this.getAreaInfoList();
        },
        /**
         * 选择检查内容
         */
        selecChecking(selection) {
            //this.selectStoreArr = selection;
            // checkingData
            let arr = [];
            selection.forEach((value, index) => {
                arr.push(value.Id)
            });
            this.checkingData = arr;
        },
        /**
         *
         * 保存检查内容
         */
        saveChecking() {
            this.savaTaskInfo.Contents = this.checkingData;
            this.checkingContent.checkingContentDialog.show = false;
            this.checkingLeng = '已选' + this.checkingData.length + '项';
        },
        changeByMethod(v) {
            this.savaTaskInfo.ByMethod = v;
        },
        changeDayNum(){
            if(this.savaTaskInfo.FrequencyCompary == 2){
                this.savaTaskInfo.DayNum = this.weekData.code.toString();
            }else if(this.savaTaskInfo.FrequencyCompary == 3){
                this.savaTaskInfo.DayNum = this.monthData.code.toString();
            }
        },
        changeFrequencyCompary(){
            // this.savaTaskInfo.FrequencyCompary = this.savaTaskInfo.Custom;
            this.savaTaskInfo.DayNum = '';
        },
        changeFrequency(v) {
            // ;
            // if(this.savaTaskInfo.FrequencyCompary == 1){
            //     this.maxFrequency = 1;
            //     this.$message({
            //         showClose: true,
            //         message: '频次为每天时频次不得大于1',
            //         type: 'info',
            //         duration: 1500,
            //         center: true,
            //     });

            // }

        },
        notice(val) {
            this.$message({
                showClose: true,
                message: val,
                type: 'info',
                duration: 1300,
                center: true,
            });
        },
        /**
         * 计算两个日期相差的天数
         * sDate1和sDate2是2006-12-18格式
         */
        DateDiff(sDate1, sDate2) {
            var aDate, oDate1, oDate2, iDays
            aDate = sDate1.split("-")
            oDate1 = new Date(aDate)    //转换为12-18-2006格式
            //oDate1 = new Date(aDate[0], aDate[1], aDate[2])    //转换为12-18-2006格式
            aDate = sDate2.split("-")
            oDate2 = new Date(aDate)
            //oDate2 = new Date(aDate[0], aDate[1], aDate[2])
            iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数
            return iDays + 1;
        },
        changeTime() {
            if (this.savaTaskInfo.EndTime != '' && this.savaTaskInfo.EndTime != undefined && this.savaTaskInfo.StartTime != '' && this.savaTaskInfo.StartTime != undefined) {
                this.days = this.DateDiff(this.savaTaskInfo.StartTime, this.savaTaskInfo.EndTime);
            }
        }
    },
    created() {
        if (this.isShowButton == 0 || this.isShowButton == 1) {
            this.isShowButtonStore = true;
        }
        this.getOperateInfo();
        this.changeTime();
        this.reShowRule();
        //回显最大化控制
        if( this.savaTaskInfo.Frequency>1){
            this.FrequencyMax = this.savaTaskInfo.Frequency;
        }
        for(let i=1;i<32;i++){
            this.monthData.datas.push({value:i,label:i.toString()})
        }
        if(this.savaTaskInfo.DayNum != ''){
            if(this.savaTaskInfo.FrequencyCompary == 2){
                this.weekData.code = this.savaTaskInfo.DayNum.split(',');
            }else if(this.savaTaskInfo.FrequencyCompary == 3){
                this.monthData.code = this.savaTaskInfo.DayNum.split(',');
            }
        }
    },
    computed:{
        totalMarks:function(){
            let monthInfo = '';
            if(this.monthData.code.length > 0){
                monthInfo = this.monthData.code.sort(sortNumbers).toString();
            }
            return monthInfo;
        },
        totalweek:function(){
            let weekInfo = '';
            if(this.weekData.code.length > 0){
                this.weekData.code = this.weekData.code.sort(sortNumbers)
                // console.log(this.weekData.code)
                for(let item of this.weekData.code){
                    for(let itemi of this.weekData.datas){
                        if(item == itemi.value){
                            weekInfo += '周' + itemi.label + ','
                        }
                    }
                }
            }
            return weekInfo;
        }
    },
    mounted() {

    },
    watch: {
        'checkingContent.checkingContentData': {
            handler(newName, oldName) {
                this.$nextTick(() => {
                    //回显数据
                    // if (checkingContent.checkingContentData.length > 0) {
                    //     for(let item of  this.checkingContent.checkingContentData){
                    //         this.$refs.checkingTable.toggleRowSelection(item, true);
                    //     }
                    // } 
                    if (this.savaTaskInfo.Contents) {
                        if (this.savaTaskInfo.Contents.length > 0) {
                            this.checkingLeng = '已选' + this.savaTaskInfo.Contents.length + '条内容';
                            for (let item of  this.checkingContent.checkingContentData) {
                                if (this.savaTaskInfo.Contents.indexOf(item.Id) > -1) {
                                    this.$refs.checkingTable.toggleRowSelection(item, true);
                                }
                            }
                        } else {
                            this.checkingLeng = '';
                            for (let item of  this.checkingContent.checkingContentData) {
                                this.$refs.checkingTable.toggleRowSelection(item, true);
                            }
                        }
                    } else {
                        this.checkingLeng = '';
                        for (let item of  this.checkingContent.checkingContentData) {
                            this.$refs.checkingTable.toggleRowSelection(item, true);
                        }
                    }


                })
            },
            immediate: true
        },
        'savaTaskInfo.TaskTargets': {
            handler(newName, oldName) {
                this.$nextTick(() => {
                    if (this.savaTaskInfo.TaskTargets) {
                        if (this.savaTaskInfo.TaskTargets.length > 0) {
                            this.selectedStores = this.savaTaskInfo.TaskTargets;
                            this.checkValue = '已选' + this.savaTaskInfo.TaskTargets.length + '个门店';
                        } else {
                            this.checkValue = '';
                        }
                    }
                })
            },
            immediate: true
        },
        'savaTaskInfo.Contents': {
            handler(newName, oldName) {
                this.$nextTick(() => {
                    if (this.savaTaskInfo.Contents) {
                        if (this.savaTaskInfo.Contents.length > 0) {
                            this.checkingLeng = '已选' + this.savaTaskInfo.Contents.length + '条内容';

                        } else {
                            this.checkingLeng = '';
                        }
                    }

                })
            },
            immediate: true
        },
        'weekData.code':{
            handler(newName, oldName){
                this.$nextTick(() => {
                    // if(this.weekData.code.length > 0){
                    //     // this.savaTaskInfo.DayNum = this.weekData.code.toString();
                    //     // this.weekData.code = this.weekData.code.sort(sortNumbers);
                    //     // console.log(this.weekData.code)
                    //     this.weekInfo = ''
                    //     for(let item of this.weekData.code){
                    //         for(let itemi of this.weekData.datas){
                    //             if(item == itemi.value){
                    //                 this.weekInfo += '周' + itemi.label + ','
                    //             }
                    //         }
                    //     }
                    // }
                })
            }
        },
        'monthData.code':{
            handler(newName, oldName){
                this.$nextTick(() => {
                    if(this.monthData.code.length > 0){
                        // this.savaTaskInfo.DayNum = this.monthData.code.toString();
                    }
                })
            }
        },
        // 'savaTaskInfo.DayNum':{
        //     handler(newName, oldName){
        //         this.$nextTick(() => {
        //             if(this.savaTaskInfo.FrequencyCompary == 2){
        //                 this.weekData.code = this.savaTaskInfo.DayNum.split(',');
        //             }else if(this.savaTaskInfo.FrequencyCompary == 3){
        //                 this.monthData.code = this.savaTaskInfo.DayNum.split(',');
        //             }
        //         })
        //     }
        // }
    }
}
function sortNumbers(a,b){
    return a-b;
}