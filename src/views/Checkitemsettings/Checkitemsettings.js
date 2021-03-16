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
            tabPosition: 'left',
            tablelist: [], //列表集合
            searchValue: {
                shopName: "",
                companyName: "",
                licenNum: "",
                rows: 20,
                page: 1
            },
            total: 0, //总条数      
            TableHeight: 0,
            gridParam: {
                isviewDetails: false,
            },
            IsValid: 0, //是否启用
            CheckResultl:true,
            CheckResultr:false,
            CheckResult: true, //检查结果
            DefaultOpt: '0', //默认通过项
            modifyId: '', //修改用的ID
            classify: { //分类
                datas: [],
                code: '',
                currentIndex: 0
            },
            Loading:false,
        };
    },
    created: function() {
        this.getOperateInfo();
    },
    mounted: function() {
        this.$nextTick(function() {})
    },
    methods: {
        changeresult(){
            if(this.CheckResultr){
                this.CheckResult = false;
            }else{
                this.CheckResult = true;
            }
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
        handleClick(tab, event) {
            console.log(tab, event);
            this.operationlist.code = tab.name;
            this.getTaskTyp();
        },
        taskTabsClick(tab, event) {
            this.inspectionlist.code = tab.name;
            this.getchecklist();
        },
        classfifyClick(index) {
            this.classify.code = this.classify.datas[index].Id;
            this.classify.currentIndex = index;
            this.getInspectOptionList();
        },
        //获取一级业态
        getOperateInfo() { //获取一级业态
            this.$api.GetOperateInfo(1).then(res => {
                this.operationlist.datas = res;
                this.operationlist.Name = res[0].Name;
                this.operationlist.code = res[0].Id;
                this.getTaskTyp();
            }).catch(r => {});
        },
        //获取二级任务
        getTaskTyp() {
            let data = {
                "StoreTypeId": this.operationlist.code,
                "ProcessType": 0,
                "Type": 1,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.IsSuccess && res.Content.length > 0) {
                        this.inspectionlist.datas = res.Content;
                        this.inspectionlist.Name = res.Content[0].Text;
                        this.inspectionlist.code = res.Content[0].Id;
                        this.getchecklist();
                    } else {
                        this.inspectionlist.datas = [];
                        this.inspectionlist.Name = '';
                        this.inspectionlist.code = '';
                        this.classify.datas = [];
                        this.classify.code = '';  
                        this.tablelist = [];
                        this.total = 0;
                    }
                }
            )
        },
        //获取检查项分类
        getchecklist() {
            let data = {
                "StoreTypeId": this.operationlist.code,
                "ProcessType": 0,
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
                        this.total = 0;
                    }
                    this.getInspectOptionList();
                }
            )
        },
        //获取检查项内容列表
        getInspectOptionList() {
            if (this.classify.datas.length > 0) {
                this.Loading = true;
                let data = {
                    "StoreTypeId": this.operationlist.code,
                    "ProcessType": 0,
                    "ClassificationId": this.classify.code,
                    "TaskTypeId": this.inspectionlist.code,
                    "SearchWord": "",
                    "pageNo": this.searchValue.page,
                    "pageSize": this.searchValue.rows,
                }
                this.$api.GetInspectOptionSetListAsync(data).then(
                    res => {
                        if (res.IsSuccess) {
                            this.Loading = false;
                            this.tablelist = res.Content;
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
            } else {
                this.tablelist = [];
                this.total = 0;
            }
        },
        //修改
        //         modifyEById(rows){
        //             this.modifyId = this.tablelist[rows].Id;
        //         },
        //保存设置检查项业务属性
        Preservation() {
            let data = {
                "Id": this.modifyId,
                "IsValid": this.IsValid,
                "CheckResult": this.CheckResult,
                "StoreTypeId": this.operationlist.code,
                "TaskTypeId": this.inspectionlist.code,
                // "RoleId":"2222222222"
            }
            this.$api.SetInspectOptionAttrAsync(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.gridParam.isviewDetails = false;
                        this.getInspectOptionList();
                    }
                }
            )
        },
        //设置默认通过项
        SetDefaultOpt(rows) {
            this.gridParam.isviewDetails = true;
            if(this.tablelist[rows].CheckResult == false){
                this.CheckResultr = true;
            }else{
                this.CheckResultr = false;
            }
            this.modifyId = this.tablelist[rows].Id;
            this.IsValid = this.tablelist[rows].IsValid == null ? 0 : this.tablelist[rows].IsValid;
            //             let data = {
            //                 "Id":this.tablelist[rows].Id,
            //                 "IsValid":Number(this.IsValid),
            //                 "DefaultOpt":Number(this.DefaultOpt)
            //             }
            //             this.$api.SetInspectOptionAttrAsync(data).then(
            //                 res => {
            //                     if(res.IsSuccess){
            //                         this.getInspectOptionList();
            //                     }
            //                 }
            //             )
        },
    }
};
