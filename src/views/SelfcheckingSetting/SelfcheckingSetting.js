import Pagination from "@/components/Pagination";
export default {
    components: {
        Pagination,
    },
    data() {
        return {
            operationlist: { //业态列表
                //业态
                datas: [],
                Name: "", //当前业态值                
                code: "" //当前业态值id                
            },
            inspectionlist: { //检查类型列表
                datas: [],
                Name: "", //当前业态值                
                code: "" //当前业态值id                  
            },
            total: 0,
            searchValue: {
                TaskName: "", //任务名称
                Taskstatus: "", //任务状态
                licenNum: "",
                shopName: "", //门店名称
                companyName: "", //单位名称
                rows: 20,
                page: 1,
                notificationsnum: '', //通知次数
            },
            tablelist: [],
            gridParam: {
                settings: false,
                RoleByResponsible: '食品安全管理员', //责任人角色
                CompletionCriteria: '单人通知，指定人执行', //自查完成标准
                NoticeTime: '', //通知时间
                NoticeNum: '', //通知次数
                NoticeInterval: '', //通知间隔
                EditingConditions: '分钟',
                EditingList: [{
                        value: '分钟',
                        label: '分钟'
                    },
                    {
                        value: '小时',
                        label: '小时'
                    },
                ],
                EditingConditionshour: '08',
                hour: [{
                        value: '08',
                        label: '08'
                    },
                    {
                        value: '09',
                        label: '09'
                    },
                    {
                        value: '10',
                        label: '10'
                    },
                    {
                        value: '11',
                        label: '11'
                    },
                    {
                        value: '12',
                        label: '12'
                    },
                    {
                        value: '13',
                        label: '13'
                    },
                    {
                        value: '14',
                        label: '14'
                    },
                    {
                        value: '15',
                        label: '15'
                    },
                    {
                        value: '16',
                        label: '16'
                    },
                    {
                        value: '17',
                        label: '17'
                    },
                    {
                        value: '18',
                        label: '18'
                    },
                    {
                        value: '19',
                        label: '19'
                    },
                    {
                        value: '20',
                        label: '20'
                    },
                    {
                        value: '21',
                        label: '21'
                    },
                    {
                        value: '22',
                        label: '22'
                    },
                ],
                EditingConditionsMinute: '00',
                Minute: [{
                        value: '00',
                        label: '00'
                    },
                    {
                        value: '05',
                        label: '05'
                    },
                    {
                        value: '10',
                        label: '10'
                    },
                    {
                        value: '15',
                        label: '15'
                    },
                    {
                        value: '20',
                        label: '20'
                    },
                    {
                        value: '25',
                        label: '25'
                    },
                    {
                        value: '30',
                        label: '30'
                    },
                    {
                        value: '35',
                        label: '35'
                    },
                    {
                        value: '40',
                        label: '40'
                    },
                    {
                        value: '45',
                        label: '45'
                    },
                    {
                        value: '50',
                        label: '50'
                    },
                    {
                        value: '55',
                        label: '55'
                    },
                ],
            },
            UpdateId: "", //修改用的Id
            CheckResultl: true, //检查结果
            CheckResultr: false, //检查结果
            CheckResult: true,
            IsValid:0,
            classify: { //分类
                datas: [],
                code: '',
                currentIndex: 0
            },
            Loading:false,
        }
    },
    created: function() {
        this.getOperateInfo();
    },
    methods: {
        changeresult() {
            if (this.CheckResultr) {
                this.CheckResult = false;
            } else {
                this.CheckResult = true;
            }
        },
        handleClick() {
            this.getTaskTyp();
        },
        taskTabsClick(tab, event) {
            this.inspectionlist.code = tab.name;
            this.getInspectOptionSetListAsync();
        },
        classfifyClick(index) {
            this.classify.code = this.classify.datas[index].Id;
            this.classify.currentIndex = index;
            this.getInspectOptionSetListAsync();
        },
        getOperateInfo() { //获取一级业态
            this.$api.GetOperateInfo(1).then(res => {
                //                 if(res&&res.IsSuccess){
                this.operationlist.datas = res;
                this.operationlist.Name = res[0].Name;
                this.operationlist.code = res[0].Id;
                //                     console.log(this.operationlist.Name)
                //                 }
                this.getTaskTyp();
            }).catch(r => {

                // {
                //     "Content": [
                //     {
                //         "Id": "string",
                //         "StoreTypeName": "string"
                //     }
                // ],
                //     "Message": "string",
                //     "IsSuccess": true,
                //     "Code": "string",
                //     "Data": {},
                //     "Detail": "string"
                // }
            });
        },
        //获取二级任务
        getTaskTyp() {
            // console.log(this.operationlist.code)
            let data = {
                "StoreTypeId": this.operationlist.code,
                // "TaskTypeId":"08ae6494-07d3-41c4-a172-82da5f6556cc",
                "ProcessType": 1,
                "Type": 1,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.Content.length > 0) {
                        this.inspectionlist.datas = res.Content;
                        this.inspectionlist.Name = res.Content[0].Text;
                        this.inspectionlist.code = res.Content[0].Id;
                        this.getchecklist();
                        // this.getInspectOptionSetListAsync();
                    } else {
                        this.inspectionlist.datas = [];
                        this.tablelist = [];
                        this.classify.datas = [];
                        this.classify.code = '';
                        this.total = 0;
                    }
                }
            )
        },
        //获取检查项分类
        getchecklist() {
            let data = {
                "StoreTypeId": this.operationlist.code,
                "ProcessType": 1,
                "Type": 6,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.IsSuccess && res.Content.length > 0) {
                        this.classify.datas = res.Content;
                        this.classify.code = res.Content[0].Id;
                        this.classify.currentIndex = 0;
                    } else {
                        this.classify.datas = [];
                        this.classify.code = '';
                    }
                    this.getInspectOptionSetListAsync();
                }
            )
        },
        getInspectOptionSetListAsync() {
            this.Loading = true;
            let data = {
                "StoreTypeId": this.operationlist.code,
                // "StoreTypeId":"",
                // "ProcessType":"",
                "TaskTypeId": this.inspectionlist.code,
                "ClassificationId": this.classify.code,
                "SearchWord": "",
                "ProcessType": 1,
                "pageNo": this.searchValue.page,
                "pageSize": this.searchValue.rows,
                // "StoreTypeId":"","ProcessType":"","TaskTypeId":"","SearchWord":"","pageNo":1,"pageSize":20
            }
            this.$api.SearchInspectOptionSetListAsync(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.Loading = false;
                        this.tablelist = res.Content;
                        this.$refs.table.bodyWrapper.scrollTop =0;
                        if (res.Content.length > 0) {
                            this.total = res.Content.length;
                        } else {
                            this.total = 0;
                        }
                    }else{
                        this.Loading = false;
                    }
                }
            )
        },
        Update(Id) {
            if (this.gridParam.NoticeNum && this.searchValue.notificationsnum) {
                let data = {
                    "InspectOptionId": this.UpdateId,
                    "RoleByResponsible": this.gridParam.RoleByResponsible,
                    "CompletionCriteria": this.gridParam.CompletionCriteria,
                    "NoticeTime": this.gridParam.EditingConditionshour + ":" + this.gridParam.EditingConditionsMinute,
                    "NoticeNum": Number(this.gridParam.NoticeNum),
                    "CheckResult": this.CheckResult,
                    "TaskTypeId": this.inspectionlist.code,
                    "StoreTypeId": this.operationlist.code,
                    "NoticeInterval": this.searchValue.notificationsnum + this.gridParam.EditingConditions,
                    "IsValid":this.IsValid
                }
                this.$api.UpdateInspectOptionSetAsync(data).then(
                    res => {
                        if (res.IsSuccess) {
                            if (res.IsSuccess) {
                                this.gridParam.settings = false;
                                this.message(res.Message, 1);
                                this.getInspectOptionSetListAsync();
                            } else {
                                this.message(res.Message, -1)
                            }
                        }
                    }
                )
            } else {
                this.message("请输入内容", -1)
            }
        },
        SetupId(rows) {

            this.gridParam.settings = true;
            this.UpdateId = this.tablelist[rows].Id;
            this.gridParam.CompletionCriteria = this.tablelist[rows].CompletionCriteria;
            this.gridParam.RoleByResponsible = this.tablelist[rows].RoleByResponsible;
            this.IsValid = this.tablelist[rows].IsValid == null ? 0 : this.tablelist[rows].IsValid;
            if (this.tablelist[rows].NoticeTime) {
                let time = this.tablelist[rows].NoticeTime.split(":");
                this.gridParam.EditingConditionshour = time[0];
                this.gridParam.EditingConditionsMinute = time[1];
            } else {
                this.gridParam.EditingConditionshour = '08';
                this.gridParam.EditingConditionsMinute = '00';
            }
            this.gridParam.NoticeNum = this.tablelist[rows].NoticeNum;
            let intervalnum = parseInt(this.tablelist[rows].NoticeInterval);
            this.searchValue.notificationsnum = intervalnum;
            // this.CheckResultr = this.tablelist[rows].CheckResult==false ? true : false;
            if (this.tablelist[rows].CheckResult == false) {
                this.CheckResultr = true;
            } else {
                this.CheckResultr = false;
            }
            this.gridParam.EditingConditions = this.tablelist[rows].NoticeInterval.match(/[\u4e00-\u9fa5]/g).join("");
        },
        DelEByIds(Id) {
            let data = {
                "Id": Id
            }
            this.$api.DeleteInspectOptionSetAsync(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.message(res.Message)
                        this.getInspectOptionSetListAsync();
                    }
                }
            )
        },
        getThumbPic(url) {
            if (url != null && url != undefined && url.startsWith('http')) {
                //做缩略图处理
                let relaPath = this.getUrlParam(url, 'fileURL');
                if(this.$utils.isTestEvn()){
                    if (this.$utils.isHttpsProtal()) {
                        return 'https://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' +
                            relaPath + '&width=40&height=40';
                    } else {
                        return 'http://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' +
                            relaPath + '&width=40&height=40';
                    }
                } else {
                        if (this.$utils.isHttpsProtal()) {
                            return 'https://fileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' +
                                relaPath + '&width=40&height=40';
                        } else {
                            return 'http://fileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' +
                                relaPath + '&width=40&height=40';
                        }
                }
            }
        },
        getUrlParam(url, paraName) {
            var arrObj = url.split("?");

            if (arrObj.length > 1) {
                var arrPara = arrObj[1].split("&");
                var arr;

                for (var i = 0; i < arrPara.length; i++) {
                    arr = arrPara[i].split("=");

                    if (arr != null && arr[0] == paraName) {
                        return arr[1];
                    }
                }
                return "";
            } else {
                return "";
            }
        },
    }
}
