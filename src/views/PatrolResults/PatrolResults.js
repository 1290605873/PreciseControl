import Pagination from "@/components/Pagination";
import Regionalism from '@/components/Regionalism.vue';
import PatrolDetails from '@/components/PatrolDetails.vue';
import EnforcementDetails from '@/components/EnforcementDetails.vue';
import HistoricalTask from '@/components/HistoricalTask.vue';
import ChooseStore from '../../components/ChooseStore/ChooseStore';
import SetUser from '../../components/SetUser';
export default {
    name: 'patrol-results',
    components: {
        Pagination,
        Regionalism,
        PatrolDetails,
        EnforcementDetails,
        HistoricalTask,
        ChooseStore,
        SetUser,
    },
    props:{
        operateId:{//一级业态ID
            type:String,
            default:''
        }
    },
    data() {
        return {
            AreaCode:'',
            PatrolId: "",
            taskInfo: this.$store.state.TaskInfo, //主任务数据
            total: 0, //数据条数
            searchValue: {
                TaskName: "", //任务名称
                Taskstatus: "", //任务状态
                licenNum: "",
                shopName: "", //门店名称
                companyName: "", //单位名称
                Dutyer: "",
                Responsible: "", //责任主体
                rows: 20,
                page: 1
            },
            Taskstatus: { //任务状态
                datas: [
//                     {
//                         value: '',
//                         label: '全部'
//                     },
                    {
                        value: 1,
                        label: '待办'
                    },
                    {
                        value: 2,
                        label: '进行中'
                    },
                    {
                        value: 3,
                        label: '已完成'
                    },
                    {
                        value: 4,
                        label: '未完成'
                    },
                    {
                        value: 5,
                        label: '异常结束'
                    },
                ],
                code: '',
                name: ''
            },
            //             Responsiblebody: { 
            //                 datas: [],
            //                 code: '',
            //                 name: ''
            //             },
            Inspectionresults: { //巡查结果
                datas: [],
                code: '',
                name: ''
            },
            Businessformat: { //经营业态
                datas: [],
                code: '',
                name: ''
            },
            Processingresult: { //处理结果
                datas: [],
                code: '',
                name: ''
            },
            Enforcementresult: { //执法结果
                datas: [],
                code: '',
                name: ''
            },
            adjustment: {
                isviewDetails: false,
                Startdate: this.$store.state.TaskInfo.StartTime,
                Enddate: this.$store.state.TaskInfo.EndTime,
            },
            StartTime:this.$store.state.TaskInfo.StartTime,
            EndTime:this.$store.state.TaskInfo.EndTime,
            Timelimits: { //限制开始时间
                disabledDate: (time) => {
                    if (this.EndTime != '' && this.EndTime) {
                        let timeStr = new Date(this.StartTime).getTime();
                        let timeStrE = new Date(this.EndTime).getTime();
                        return time.getTime() < timeStr || time.getTime() > timeStrE;
                    } else {
                        return ''
                    }
                }
            },
            Timelimite: { //限制结束时间
                disabledDate: (time) => {
                    if (this.StartTime != '' && this.StartTime) {
                        let timeStrS = new Date(this.StartTime.replace(/-/g, '/'));
                        let timeStr = new Date(this.EndTime).getTime();
                        return time.getTime() > timeStr || time.getTime() < timeStrS;
                    } else {
                        return ''
                    }
                }
            },
            Patroldetails: { //巡查任务详情
                isviewDetails: false,
            },
            lawEnforcementTasksDetails: { //执法任务详情
                islawEnforcementDetails: false,
            },
            //             Historylist: [],
            //             HistoricalsearchValue: { //历史任务搜索条件
            //                 code: "",
            //                 TaskName: "",
            //                 datas: [],
            //                 CheckResult: "",
            //                 Checker: "",
            //                 StartTime: "",
            //                 EndTime: "",
            //                 PageNo: 1,
            //                 PageSize: 20
            //             },
            HistoricalTask: { //历史任务
                isHistoryDetails: false,
            },
            Historytotal: 1,
            Auditstatus: 0,
            Generatingstate: 999,
            Startdate: '', //开始时间
            Enddate: '', //结束时间
            pickerOptions0: { //限制开始时间
                disabledDate: (time) => {
                    if (this.Enddate != '' && this.Enddate) {
                        let timeStr = new Date(this.Enddate.replace(/-/g, '/'));
                        return time.getTime() > timeStr;
                    } else {
                        return ''
                    }
                }
            },
            pickerOptions1: { //限制结束时间
                disabledDate: (time) => {
                    if (this.Startdate != '' && this.Startdate) {
                        let timeStr = new Date(this.Startdate.replace(/-/g, '/'));
                        return time.getTime() < timeStr;
                    } else {
                        return ''
                    }
                }
            },
            list: [],
            radio: '1',
            InspectingOfficer: "", //巡查人
            areaDatas: '',
            multipleSelection: '',
            AbnormalterminationIds: [],
            //选择门店
            Choosingstore: {
                isviewDetails: false,
            },
            StoreData: [],
            //添加人员页面
            addUserDialog: {
                show: false
            },
            //添加人员个数
            checkValue: 0,
            checkValuenum: '',
            defaultCheckuserId: [],
            //返回人员数据
            checkUser: '',
            Rowcontent: '',
            Rowcontentdetails: '',
            //调整用子任务Id
            adjustmentviewId: '',
            Loading:false,
        }
    },
    created: function() {
        this.getOperateInfo();
        this.getBasicOptionListInspection();
        this.getBasicOptionListProcessing();
        this.getBasicOptionListEnforcement();
    },
    methods: {
        getList() {

        },
        query() {
            this.searchValue.page = 1;
            this.getSubTaskByQueryParam();
        },
        selectGet() {

        },
        selectstate() {

        },
        provienceChange(code) {},
        cityChange(code) {},
        townChange(code) {},
        streetChange(code) {
            if (code == '') { //清空了
                this.gridParam.area.community.list = [];
                this.gridParam.area.community.code = '';
            } else {
                this.getBusinessCommunity(code);
            }
        },
        getInspectTaskDetail() {
            let data = {

            }
            this.$api.GetInspectTaskDetail(data).then(
                res => {
                    if (res && res.IsSuccess) {

                    }
                }
            )

        },
        // this.$emit('regionalismResult', this.area)
        regionalismResult(area) {
            this.areaDatas = area;

        },
        initRegion(area) {
            this.areaDatas = area;
            this.getSubTaskByQueryParam();
        },
        //设置内容行能否选中
        selectable(row, index) {
            if (row.TaskStatus == 3 ||row.TaskStatus == 5) {
                return false
            } else {
                return true
            }
        },
        getOperateInfo() { //获取业态类型
            this.$api.GetOperateInfo(1).then(res => {
                this.Businessformat.datas = res;
                // this.Businessformat.Name = res[0].Name;
                // this.Businessformat.code = res[0].Id;
//                 this.Businessformat.datas.unshift({
//                     "Name": "全部",
//                     "Id": ""
//                 })
            }).catch(r => {});
        },
        //获取巡查结果
        getBasicOptionListInspection() {
            let data = {
                "StoreTypeId": this.taskInfo.StoreTypeId, //业态id
                // "StoreTypeId": "91025d9d-733a-42fa-a8ae-93cddea3fc02", //业态id
                "TaskTypeId": this.taskInfo.TaskTypeId, //任务类型ID
                // "TaskTypeId": "08ae6494-07d3-41c4-a172-82da5f6556cc", //任务类型ID
                "ProcessType": 0,
                "Type": 2,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.Inspectionresults.datas = res.Content;
                        // this.Inspectionresults.code = res.Content[0].Id;
//                         this.Inspectionresults.datas.unshift({
//                             "Text": "全部",
//                             "Id": ""
//                         })
                    }
                }
            )
        },
        //获取处理结果
        getBasicOptionListProcessing() {
            let data = {
                "StoreTypeId": this.taskInfo.StoreTypeId, //业态id
                // "StoreTypeId": "91025d9d-733a-42fa-a8ae-93cddea3fc02", //业态id
                "TaskTypeId": this.taskInfo.TaskTypeId, //任务类型ID
                // "TaskTypeId": "08ae6494-07d3-41c4-a172-82da5f6556cc", //任务类型ID
                "ProcessType": 0,
                "Type": 3,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.Processingresult.datas = res.Content;
                        // this.Processingresult.code = res.Content[0].Id;
//                         this.Processingresult.datas.unshift({
//                             "Text": "全部",
//                             "Id": ""
//                         })
                    }
                }
            )
        },
        //获取执法结果
        getBasicOptionListEnforcement() {
            let data = {
                "StoreTypeId": this.taskInfo.StoreTypeId, //业态id
                "TaskTypeId": this.taskInfo.TaskTypeId, //任务类型ID
                "ProcessType": 0,
                "Type": 5,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.Enforcementresult.datas = res.Content;
                    }
                }
            )
        },
        getSubTaskByQueryParam() {
            this.Loading = true;
            let data = {
                "TaskType": 0,
                "TaskName": this.searchValue.TaskName,
                "TaskState": this.Taskstatus.code, //任务状态ID
                "TaskId": this.taskInfo.Id,
                "StartTime": this.Startdate,
                "EndTime": this.Enddate,
                "AreaOne": this.areaDatas.provience.code,
                "AreaTwo": this.areaDatas.city.code,
                "Areathree": this.areaDatas.town.code,
                "Areafour": this.areaDatas.street.code,
                "AreaFive": this.areaDatas.community.code,
                "StoreName": this.searchValue.shopName, //门店名称
                "UnitName": this.searchValue.companyName, //单位名称
                "DutyBody": this.searchValue.Responsible, //责任主体ID
                "Dutyer": this.searchValue.Dutyer, //  责任人  
                "PatrolResult": this.Inspectionresults.code, //巡查结果id   
                "StoreTypeId": this.Businessformat.code, //经营业态
                "HandleResult": this.Processingresult.code, //处理结果
                "ImplementResult": this.Enforcementresult.code, //执法结果ID
                "PageIndex": this.searchValue.page,
                "PageSize": this.searchValue.rows,
            }
            this.$api.GetSubTaskByQueryParam(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.Loading = false;
                        this.list = res.Content;
                        this.$refs.table.bodyWrapper.scrollTop =0;
                        if (res.Content && res.Content.length > 0) {
                            this.total = res.Data;
                        } else {
                            this.total = 0;
                        }
                    }else{
                        this.Loading = false;
                    }
                }
            )
        },
        //督办
        Supervise(rows) {
            let dataId = {};
            let appId = this.$utils.getUrlKey("appId");
            let userId = this.$utils.getUrlKey("userId");
                dataId.InputParamDTO = {
                    NoticeEventEnum:30,
                    InspectionType:0,
                    IsSubTask:1,
                    FromUserId:userId,
                    AppId:appId,
                    StoreId:this.list[rows].StoreId,//门店ID
                    TaskId:this.list[rows].Id,
                    //ClassificationId:'',//检查项分类
                };
//             let data = {
//                 "Id": this.list[rows].Id
//             }
            this.$api.InspectNotice(dataId).then(
                res => {
                    if (res.IsSuccess) {
                        this.message(res.Message,1);
                        this.getSubTaskByQueryParam();
                    }
                }
            )
        },
        //查看检查详情
        inspectiondetails(rows) {
            this.Patroldetails.isviewDetails = true;
            this.Rowcontentdetails = this.list[rows];
        },
        //查看执法详情
        enforcementdetails(rows) {
            this.lawEnforcementTasksDetails.islawEnforcementDetails = true;
            this.Rowcontentdetails = this.list[rows];
        },
        //历史任务
        HistoryView(rows) {
            this.HistoricalTask.isHistoryDetails = true;
            // console.log(this.list[rows])
            this.Rowcontent = this.list[rows]
        },
        //删除
        deleteDetail(rows) {

        },
        getRowKeys(row) {
            return row.Id;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            // console.log(this.multipleSelection)
            this.AbnormalterminationIds = [];
            for (let i = 0; i < this.multipleSelection.length; i++) {
                this.AbnormalterminationIds[i] = this.multipleSelection[i].Id;
            }
        },
        //异常结束
        Abnormaltermination() {
            if (this.AbnormalterminationIds.length > 0) {
                let data = {
                    "ids": this.AbnormalterminationIds,
                    "userid":this.$utils.getUrlKey("userId")
                }
                this.$confirm('任务结束后将不能再检查，确定结束该任务吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.SubTaskFailEnd(data).then(res => {
                        if(res.IsSuccess){
                            this.message(res.Message == null || res.Message == '' ? '操作成功' : res.Message, 1)
                            this.getSubTaskByQueryParam();
                        }else{
                            this.message(res.Message == null || res.Message == '' ? '操作失败' : res.Message, -1)
                        }
                    }).catch(error => {
                            
                    });

                }).catch(() => {

                });
            } else {
                this.message("请勾选任务", 2)
            }

        },
        //导出数据
        DerivedData(){
            let data = {
                "TaskType": 0,
                "TaskName": this.searchValue.TaskName,
                "TaskState": this.Taskstatus.code, //任务状态ID
                "TaskId": this.taskInfo.Id,
                "StartTime": this.Startdate,
                "EndTime": this.Enddate,
                "AreaOne": this.areaDatas.provience.code,
                "AreaTwo": this.areaDatas.city.code,
                "Areathree": this.areaDatas.town.code,
                "Areafour": this.areaDatas.street.code,
                "AreaFive": this.areaDatas.community.code,
                "StoreName": this.searchValue.shopName, //门店名称
                "UnitName": this.searchValue.companyName, //单位名称
                "DutyBody": this.searchValue.Responsible, //责任主体ID
                "Dutyer": this.searchValue.Dutyer, //  责任人
                "PatrolResult": this.Inspectionresults.code, //巡查结果id
                "StoreTypeId": this.Businessformat.code, //经营业态
                "HandleResult": this.Processingresult.code, //处理结果
                "ImplementResult": this.Enforcementresult.code, //执法结果ID
                "PageIndex": this.searchValue.page,
                "PageSize": this.searchValue.rows,
                "ids": this.AbnormalterminationIds
            }
            this.$api.ExportSubTaskByQueryParam(data).then(
                res => {
                    if(res && res.IsSuccess){
                        window.location.href = res.Data;
                    }else{
                        this.message(res.Message,-1)
                    }
                }
            )
        },
        //取消任务
        Canceltasks(Id) {
            for(let i=0;i<this.multipleSelection.length;i++){
                if(this.multipleSelection[i].TaskStatus==2||this.multipleSelection[i].TaskStatus==4){
                    this.message("该任务不可取消",2)
                    return
                }
            }
            let data;
            let dataId = [Id];
            if(Id){
                data = {
                    "ids": dataId
                }                    
            }else{
                if(this.AbnormalterminationIds.length > 0){
                    data = {
                        "ids": this.AbnormalterminationIds
                    }
                }else{
                    this.message("请勾选任务", 2);
                    return
                }
            }
            this.$confirm('确认取消任务?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.SubTaskCancel(data).then(res => {
                    this.message(res.message == null || res.message == '' ? '取消成功' : res.message, 1)
                    this.getSubTaskByQueryParam();
                }).catch(error => {
                    this.message(res.message == null || res.message == '' ? '取消失败' : res.message, -
                        1)
                });

            }).catch(() => {

            });                
        },
        //调整
        adjustmentview(Id,CommunityId) {
            this.adjustment.isviewDetails = true;
            this.adjustmentviewId = Id;
            this.AreaCode = CommunityId;
        },
        //调整保存
        addAdjustment() {
            let userIds = [];
            if (this.checkUser.length > 0) {
                this.checkUser.forEach((value, index) => {
                    userIds.push(value.UserId);
                });
            }
            if (userIds.length > 0 && this.adjustment.Startdate && this.adjustment.Enddate) {
                let data = {
                    TaskId: this.taskInfo.Id,
                    PatrolSubTaskId: this.adjustmentviewId,
                    StartTime: this.adjustment.Startdate,
                    EndTime: this.adjustment.Enddate,
                    ExecutorIdList: userIds
                }
                this.$api.UpdatePatrolSubTask(data).then(
                    res => {
                        this.message("调整成功", 1);
                        this.getSubTaskByQueryParam();
                        this.adjustment.isviewDetails = false;
                    }
                ).catch(error => {
                    this.message(res.message == null || res.message == '' ? '删除成功' : res.message, -1)
                });
            } else {
                this.message("请输入内容", 2)
            }
        },
        //追加门店
        Additionalstores() {
            if(this.taskInfo.TaskStatus == 2 || this.taskInfo.TaskStatus == 1){
                this.Choosingstore.isviewDetails = true;
            }else{
                this.message("该任务不可追加门店",2)
            }

        },
        //追加门店返回方法
        storesResult(stores) {
            this.Choosingstore.isviewDetails = false;
            if(stores==null){
                return;
            }
            if (stores.length > 0) {
                for (let i = 0; i < stores.length; i++) {
                    this.StoreData.push(stores[i].Id)
                }
                let data = {
                    TaskId: this.taskInfo.Id, //主任务id
                    StoreIdList: this.StoreData, //追加的门店id                    
                }
                this.$api.AppendStore(data).then(
                    res => {
                        if (res.IsSuccess) {
                            this.getSubTaskByQueryParam();
                        }
                    }
                )
            }
        },
        //添加人员确定返回方法
        checkUserData(obj) {
            this.checkUser = obj;
            this.addUserDialog.show = false;
            // console.log(this.checkUser)
            this.checkValue = obj.length;
            this.checkValuenum = '已选' + this.checkValue + '人';
        },
        //添加人员确定
        saveAddUsers() {
            let userIds = [];
            if (this.checkUser.length > 0) {
                this.checkUser.forEach((value, index) => {
                    userIds.push(value.UserId);
                });
            }
        },
        //时间清除时间
        Timechange() {
            this.Enddate = ''
        },
        Timechange1() {
            this.adjustment.Enddate = ''
        },

    },
    filters: {
        formatedate: function(d) {
            if (d != "") {
                var date = new Date(parseInt(d.substring(6, 19)));
                return date.toLocaleDateString();
            }
        }
    }
}
