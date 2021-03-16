import Pagination from '../../components/Pagination';
import AreaOrUser from '@/components/AreaOrUser.vue';//添加人员
import ChooseStore from '../../components/ChooseStore/ChooseStore';//选择门店
import meshUserSetting from '@/views/meshUserSetting/meshUserSetting'
import TaskPerSetting from '@/views/TaskPerSetting/TaskPerSetting'

/**
 * 发布自查任务
 */
export default {
    names: 'publisPatrolTask',
    components: {
        Pagination,
        AreaOrUser,
        ChooseStore,
        meshUserSetting,
        TaskPerSetting
    },
    props: {
        isShowButton: {
            type: Number,
            default: 1,
        },
        savaTaskInfo: {
            Id: {
                type: String,
                default: ''
            },
            StoreTypeId: {
                type: String,
                default: ''
            },
            TaskType: {
                type: Number,
                default: 0
            },
            "TaskTypeId": {
                type: String,
                default: ''
            },
            "Name": {
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
            "TaskStatus": {
                type: Number,
                default: 1
            },
            "ProcessType": {
                type: Number,
                default: ''
            },
            "Frequency": {
                type: Number,
                default: 0
            },
            "FrequencyCompary": {
                type: Number,
                default: 1
            },
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
                default: ''
            },
            "Contents": {
                type: String,
                default: ''
            },
            "CheckerType": {
                type: Number,
                default: 1
            },
            "Checker": {
                type: String,
                default: ''
            }
            // PatrolTaskRuleOptionInfoList:{
            //     type:Array,
            //     default:[]
            // }
        },
    },
    data() {
        return {
            isShowButtonStore: false,
            isDisable: false,//表单重复提交
            Frequency: false,
            settingWg: false,
            settingTd: false,
            chakanData: [],
            selectedStores: [],
            defaultCheckuserId: [],
            Times: true,
            //创建发布类型
            checkValue: "",
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
            selectCheckingObject: {
                checkObjDialogList: false
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
            //检查人
            rummagerData1: [
                {
                    name: '网格（社区) 分工',
                    id: 0
                },
                {
                    name: '特定设置',
                    id: 1
                },
            ],
            rummagerData2: [],
            rummagerDataCheck: {
                0: [{
                    name: '任务共享',
                    id: 1
                }, {
                    name: '任务指定到人',
                    id: 2
                }],
                1: [{
                    name: '任务指定到特定部门',
                    id: 3
                }, {
                    name: '任务指定到特定人',
                    id: 4
                }],
            },
            listParam: {
                "StoreTypeId": "",
                "ProcessType": 0,
                "ClassifcationId": "",
                "TaskTypeId": "",
                "SearchWord": "",
                "pageNo": 1,
                "pageSize": 1000
            },
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

            StoreData: [],
            storeDialog: false,
            userDialog: false,
            userContentDialog: false,
            checkingData: [],
            checkingLeng: '',
            checkUserJsonData: [],
            checkingSetting: [],
            hisStoreData: [],//选择过的门店数据
            resetStoreData: [],
            currentId: null,
            IsValid: '1',//是否启用
            DefaultOpt: '1',//默认通过项
            modifyId: '',//修改用的ID
            isviewDetails: false,
            checkStroeId: [],
            saveChangeCheckerType: [],///存储切换检查人类型的数据
            TaskTypeId: '',
            CheckerType: '',
            allStoreData: [],
            oldSelectStore: [],
            allStoreDataDialog: false,
            resetSelectStore: '',
            days: 0,
            FrequencyMax:1
        }
    },

    methods: {
        /**
         * 业务类型
         */
        getOperateInfo() {
            this.$api.GetOperateInfo(1).then(res => {
                this.createTask.info.businessType = res;
                this.getBasicOptionList();
            });
            this.TaskTypeId = this.savaTaskInfo.TaskTypeId;
            this.CheckerType = this.savaTaskInfo.CheckerType;
        },
        /**
         * 任务类型
         */
        getBasicOptionList(val) {
            if (val != undefined) {
                this.TaskTypeId = '';
                this.savaTaskInfo.TaskTargets = [];
                this.selectedStores = [];
                this.checkValue = '';
            }
            let dataInfo = {
                "StoreTypeId": this.savaTaskInfo.StoreTypeId,
                "TaskTypeId": "",
                "ProcessType": '0',
                "Type": 1,
                "PreviousId": ""
            };
            this.$api.GetBasicOptionList(dataInfo).then(res => {
                if (res.IsSuccess) {
                    //this.createTask.info.checkTypeValue = res.Content[0].Id;
                    this.createTask.info.checkType = res.Content;
                }
            });
        },
        /**
         * 选择门店保存
         */
        storesResult(data) {
            if (data) {
                this.StoreData = data;

                if (data.length > 0) {
                    this.checkValue = '已选' + data.length + '个门店';
                }
                this.hisStoreData = data;
                this.selectedStores = data;
            }
            this.selectCheckingObject.checkObjDialogList = false;
        },
        /**
         * 门店类型查询规则
         * @param rule
         */
        setRule(rule){
            this.savaTaskInfo.PatrolTaskRuleOptionInfoList = rule;
        },
        appendUser() {
            this.userContentDialog = true;
            let idArr = [];
            this.checkUserJsonData.forEach((ele) => {
                // idArr.push(ele.UserId);
                idArr.push({
                    UserId:ele.UserId,
                    UserName:ele.UserName
                })
            });
            this.defaultCheckuserId = idArr;
            //this.$store.commit('SET_CHECKUSER_DATA',this.checkUserJson);
        },
        /**
         * 保存人员
         */
        checkUserData(obj) {
            //debugger;
           // window.console.log(this.checkUserJsonData);
            if (obj) {
                    obj.forEach((element) => {
                        this.$set(element, 'checkStoreJson', []);
                    });
                    let json = this.checkUserJsonData.concat(obj); //两个数组对象合并
                    let newJson = []; //盛放去重后数据的新数组
                    for(var item1 of json){  //循环json数组对象的内容
                        let flag = true;  //建立标记，判断数据是否重复，true为不重复
                        for(var item2 of newJson){  //循环新数组的内容
                            if(item1.UserId==item2.UserId){ //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                                flag = false;
                            }
                        }
                        if(flag){ //判断是否重复
                            newJson.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。
                        }
                    }
                    this.checkUserJsonData = newJson;
              

            }
            this.userContentDialog = false;
            this.$refs.areaOrUser.clearData();

        },
        /**
         * 设置门店到对应的人
         */
        settingStore(index, flag, lenData) {
            this.currentId = index;
            if (flag == 1) {
                this.allStoreDataDialog = true;
                const allStoreData = [];
                this.oldSelectStore = lenData;
                lenData.forEach((ele) => {
                    allStoreData.push(ele);
                });
                this.hisStoreData.forEach((ele) => {
                    allStoreData.push(ele);
                });

                this.allStoreData = allStoreData;

            } else {
                this.storeDialog = true;
            }
        },
        /**
         * 重新分配门店
         */
        handleSelectionStoreNew(sel) {
            this.resetSelectStore = sel;
        },
        resetStoreDataFnNew() {
            if (typeof this.resetSelectStore == 'object') {

                if (this.resetSelectStore.length > 0) {
                    this.checkUserJsonData[this.currentId]['checkStoreJson'] = this.resetSelectStore;
                    let arr = [];
                    this.resetSelectStore.forEach((item) => {
                        arr.push(item.Id);
                    });
                    let obj = [];
                    this.allStoreData.forEach((item) => {
                        if (arr.indexOf(item.Id) == -1) {
                            obj.push(item);
                        }
                    });
                    this.hisStoreData = obj;
                    // let hash = {}; 
                    // this.hisStoreData = this.hisStoreData.reduce(function (item, next) { 
                    //     hash[next.Id] ? '' : hash[next.Id] = true && item.push(next); 
                    //     return item 
                    // }, []);
                    // window.console.log(this.hisStoreData)
                } else {
                    let arr = [];
                    this.hisStoreData.forEach((item) => {
                        arr.push(item);
                    });
                    this.checkUserJsonData[this.currentId]['checkStoreJson'].forEach((ele) => {
                        arr.push(ele);
                    });

                    this.hisStoreData = arr;
                    this.checkUserJsonData[this.currentId]['checkStoreJson'] = [];
                }

            }
            this.allStoreDataDialog = false;
        },
        resetStoreDataFn() {
            if (this.checkStroeId.length > 0) {
                let arr = new Array();
                this.checkStroeId.forEach((element) => {
                    this.checkUserJsonData[this.currentId]['checkStoreJson'].push(element);
                    element.checkFlag = true;
                    arr.push(element.Id);
                });
                let newArr = [];
                this.hisStoreData.forEach((element) => {
                    if (arr.indexOf(element.Id) == -1) {
                        newArr.push(element);
                    }
                });
                this.hisStoreData = newArr;
                this.storeDialog = false;
            }
        },
        handleSelectionStore(row) {
            this.checkStroeId = row;
        },
        /**
         * 删除已选择的人员
         */
        removeUser(row, index) {
            this.checkUserJsonData.splice(index, 1);
            if (row.checkStoreJson != undefined) {
                row.checkStoreJson.forEach((element) => {
                    delete element.checkFlag;
                    this.hisStoreData.push(element);
                });
            }
        },
        /**保存任务指定到人**/
        saveStoreFn() {
            let arr = [];
            if (this.hisStoreData.length != 0) {
                this.$alert('剩余门店未分配', '消息提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    callback: action => {
                    }
                });
                return;
            }
            if (this.hisStoreData.length == 0) {
                this.checkUserJsonData.forEach((element) => {
                    if (element.checkStoreJson) {
                        if (element.checkStoreJson.length > 0) {
                            element.checkStoreJson.forEach((value) => {
                                let obj = {
                                    "ExecutorId": element.UserId,
                                    "Name": element.UserName,
                                    "Id": value.Id,
                                    "StoreName": value.StoreName,
                                    "UnitName": '',
                                    "License": value.License,
                                    "StoreSecTypeId": '',
                                    "StoreTypeSecond": value.StoreTypeSecond,
                                    "StoreAddress": value.StoreAddress
                                }
                                arr.push(obj);
                            });
                        }
                    }
                });
                this.savaTaskInfo.TaskTargets = arr;
                this.userDialog = false;
            }
        },
        /**
         * 关闭任务指定到人弹框
         */
        closeUserDialog() {
            this.userDialog = false;
            // if(this.savaTaskInfo.TaskStatus!=undefined){
            //     this.hisStoreData = this.StoreData;
            // }else{
            //     this.hisStoreData = this.selectedStores;
            // }

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
                    this.FrequencyMax = Math.min(1,this.days);
                    break;
                case 2:
                    this.FrequencyMax = Math.min(7,this.days);
                    break;
                case 3:
                    this.FrequencyMax = Math.min(30,this.days);
                    break;
                case 4:
                    this.FrequencyMax = Math.min(90,this.days);
                    break;
                case 5:
                    this.FrequencyMax = Math.min(180,this.days);
                    break;
                case 6:
                    this.FrequencyMax = Math.min(365,this.days);
                    break;
                default:
                    this.FrequencyMax =1;
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
        /**
         * 选择检查人
         */
        rummagerValueCheck(val) {

            if (this.checkValue == '' && this.savaTaskInfo.TaskStatus == undefined) {
                this.notice('请先选择检查对象');
                return;
            }

            this.rummagerData2 = this.rummagerDataCheck[this.createTask.info.rummagerValue2];
            if (val != undefined) {
                this.CheckerType = '';
            }
        },
        /**
         * 发布任务
         */
        publish() {
            if (this.savaTaskInfo.TaskTargets.length > 0) {
                this.savaTaskInfo.TaskTargets.forEach((ele) => {
                    if (ele.checkStoreJson) {
                        delete ele.checkStoreJson;
                    }
                });
            }
            window.console.log(this.savaTaskInfo)
            if (this.hisStoreData.length != 0 && this.savaTaskInfo.TaskStatus != 0 && this.CheckerType == 2) {
                if (this.checkUserJsonData.length == 0) {
                    this.$alert('请选择检查人', '消息提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        callback: action => {
                        }
                    });
                    return;
                } else {
                    this.$alert('剩余门店未分配', '消息提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        callback: action => {
                        }
                    });
                    return;
                }
            }
            this.savaTaskInfo.ProcessType = 0;
            this.savaTaskInfo.TaskStatus = 1;
            this.savaTaskInfo.TaskTypeId = this.TaskTypeId;
            this.savaTaskInfo.CheckerType = this.CheckerType;
            this.savaTaskInfo.TaskType = 0;
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
            if (this.savaTaskInfo.ByMethod == 1) {
                if (this.savaTaskInfo.EndTime == '' || this.savaTaskInfo.EndTime == undefined) {
                    this.notice('请选择结束日期');
                    return;
                }
            }
            if (this.savaTaskInfo.ByMethod == 2) {
                if (this.savaTaskInfo.Frequency == '' || this.savaTaskInfo.Frequency == undefined) {
                    this.notice('频次不能为空');
                    return;
                }
            }
            if (this.savaTaskInfo.Times == '' || this.savaTaskInfo.Times == undefined) {
                this.notice('次数不能为空');
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
            if (this.checkValue == '' || this.checkValue == undefined) {
                //if(this.StoreData.length==0){
                this.notice('请选择检查对象');
                return;
            }
            if (this.checkingLeng == '' || this.checkingLeng == undefined) {
                // if(this.checkingData.length == 0){
                this.notice('请选择检查内容');
                return;
            }
            if (this.CheckerType == undefined || this.CheckerType == '') {
                this.notice('请选择检查人');
                return;
            }
            this.$utils.consoleObj(this.savaTaskInfo);
            this.getPublish('发布中');
        },
        getPublish(noticeText) {
            if (this.CheckerType != 2 && this.saveChangeCheckerType.length > 0) {
                this.savaTaskInfo.TaskTargets = this.saveChangeCheckerType;
            }

            this.isDisable = true;
            const loading = this.$loading({
                lock: true,
                text: noticeText,
                spinner: 'el-icon-loading',
                background: 'rgba(255,255,255,0.5)'
            });
            this.$api.Publish(this.savaTaskInfo).then(res => {
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
                            _this.$emit('publish', true);
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
                let _this = this;
                loading.close();
                this.$message({
                    showClose: true,
                    message: '发布失败',
                    type: 'error',
                    duration: 1200,
                    center: true,
                    onClose() {
                        _this.isDisable = false;

                    }
                });
            });
        },
        /**
         * 保存不发布
         */
        savePublish() {
            if (this.hisStoreData.length != 0 && this.savaTaskInfo.TaskStatus != 0 && this.CheckerType == 2) {
                if (this.checkUserJsonData.length == 0) {
                    this.$alert('请选择检查人', '消息提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        callback: action => {
                        }
                    });
                    return;
                } else {
                    this.$alert('剩余门店未分配', '消息提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        callback: action => {
                        }
                    });
                    return;
                }

            }
            this.savaTaskInfo.ProcessType = 0;
            this.savaTaskInfo.TaskStatus = 0;
            this.savaTaskInfo.TaskTypeId = this.TaskTypeId;
            this.savaTaskInfo.CheckerType = this.CheckerType;
            this.savaTaskInfo.TaskType = 0;
            this.getPublish('保存中');
        },
        /**
         * 保存临时任务
         */
        saveTemporary() {
            this.savaTaskInfo.ProcessType = 0;
            this.savaTaskInfo.TaskStatus = 1;
            this.savaTaskInfo.TaskType = 1;
            this.savaTaskInfo.TaskTypeId = this.TaskTypeId;
            this.savaTaskInfo.CheckerType = this.CheckerType;
            this.getPublish('保存中');
        },
        /**
         * 指定到人
         */
        changeRummagerValue2() {
            if (this.CheckerType == 2) {
                this.userDialog = true;
            }
            if (this.CheckerType != 2) {
                let ExecutorId = [];
                this.selectedStores.forEach((value, index) => {
                    let obj = {
                        "ExecutorId": "",
                        "Name": "",
                        "Id": value.Id
                    };
                    ExecutorId.push(obj);
                });
                this.saveChangeCheckerType = ExecutorId;
            }
        },
        /**
         * 保存
         */
        savaStoreData() {
            this.selectCheckingObject.checkObjDialogList = false;
            this.checkValue = this.StoreData.length;
            let ExecutorId = [];
            this.StoreData.forEach((value, index) => {
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
        },
        cancel() {
            this.$emit('publish', true);
        },
        /**
         * 选择检查内容
         */
        selecChecking(selection) {
            let arr = [];
            selection.forEach((value, index) => {
                arr.push(value.Id)
            })
            this.checkingData = arr;
        },
        /**
         *
         * 保存检查内容
         */
        saveChecking() {
            this.savaTaskInfo.Contents = this.checkingData;
            this.checkingContent.checkingContentDialog.show = false;
            this.checkingLeng = '已选' + this.checkingData.length + '条内容';
        },
        changeByMethod(v) {
            this.savaTaskInfo.ByMethod = v;
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
        openSettingWg() {
            this.settingWg = true;
        },
        openSettingTd() {
            this.settingTd = true;
        },
        /**页面回显* */
        showSelectStore(obj) {
            this.storeDialog = true;
            this.hisStoreData = obj;
        },
        changeInputNum(num) {
            if (num == undefined) {
                this.notice('不能为空');
            }
        },
        /**
         * 计算两个日期相差的天数
         * sDate1和sDate2是2006-12-18格式
         */
        DateDiff(sDate1, sDate2) {
            var aDate, oDate1, oDate2, iDays
            aDate = sDate1.split("-")
            oDate1 = new Date(aDate)
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
        //回显最大化控制
        if( this.savaTaskInfo.Frequency>1){
            this.FrequencyMax = this.savaTaskInfo.Frequency;
        }
    },
    mounted() {

    },
    watch: {
        'allStoreData': {
            handler(newName, oldName) {
                this.$nextTick(() => {
                    for (let item of this.oldSelectStore) {
                        this.$refs.allStoreDataTable.toggleRowSelection(item, true);
                    }
                });
            },
            immediate: true
        },
        'checkingContent.checkingContentData': {
            handler(newName, oldName) {
                this.$nextTick(() => {
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
                    if (this.savaTaskInfo.TaskTargets && this.savaTaskInfo.TaskStatus != undefined) {
                        if (this.savaTaskInfo.TaskTargets.length > 0) {

                            this.selectedStores = this.savaTaskInfo.TaskTargets;
                            // ;
                            if (this.checkUserJsonData.length == 0) {

                                this.hisStoreData = this.savaTaskInfo.TaskTargets;
                            }

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
        'CheckerType': {
            handler(newName, oldName) {
                this.$nextTick(() => {

                    if (this.savaTaskInfo.CheckerType) {
                        if (this.savaTaskInfo.CheckerType == 2) {

                            let TaskTargets = this.savaTaskInfo.TaskTargets;

                            let hash = {};
                            let chakanData = TaskTargets.reduce(function (item, next) {
                                hash[next.ExecutorId] ? '' : hash[next.ExecutorId] = true && item.push(next);
                                return item
                            }, []);
                            let obj = {};
                            TaskTargets.forEach((value, index) => {

                                let dt = value.ExecutorId;
                                if (obj[dt]) {
                                    //存在了 
                                    //obj[dt]++; 
                                    obj[dt].push(value);
                                } else {
                                    //不存在 
                                    //temp.push(dt); 
                                    obj[dt] = [value];
                                }
                            });
                            //if(this.savaTaskInfo.TaskStatus != 0){
                            for (var i in obj) {
                                for (var value in chakanData) {
                                    if (i == chakanData[value].ExecutorId) {
                                        chakanData[value]['checkStoreJson'] = obj[i];


                                    }
                                }

                            }
                            this.chakanData = chakanData;
                            //}else {

                            if (this.savaTaskInfo.TaskStatus != undefined) {
                                this.checkUserJsonData = chakanData;
                            }

                            // }


                        }
                        if (this.CheckerType == 1 || this.CheckerType == 2) {
                            this.createTask.info.rummagerValue2 = 0;
                            this.rummagerValueCheck();
                            this.CheckerType = this.CheckerType;
                        } else {

                            this.createTask.info.rummagerValue2 = 1;
                            this.rummagerValueCheck();
                            this.CheckerType = this.CheckerType;
                        }
                    }

                })
            },
            immediate: true
        }

    }
}