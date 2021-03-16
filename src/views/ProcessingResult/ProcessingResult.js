import Pagination from "@/components/Pagination";

export default {
    components: {
        Pagination,
    },
    data() {
        return {
            operationlist: {//业态列表
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
            Inspectionresults: { //巡查结果
                datas: [],
                code: '',
                name: ''
            },
            tablelist: [],
            searchValue: {
                shopName: "",
                companyName: "",
                licenNum: "",
                rows: 200,
                page: 1
            },
            total: 0, //总条数      
            TableHeight: 0,
            gridParam: {
                isviewAdd: false, //添加标题
                isviewCondition: false, //设置条件
                Text: '', //标题
                order: '', //顺序
                EditingConditions: '', //编辑条件
                EditingList: [],//编辑条件列表
                conditioninput: '',
                condition: '1',
                Id: '',
                PreviousText: '',
                IsInspectItem: false,
                IsAuto: false,
                NextStep: []

            },
            title: '',
            index:'',
        }
    },
    created: function () {
        this.getOperateInfo();
    },
    mounted: function () {

    },
    watch: {
        'gridParam.IsAuto' :{
            handler(newName, oldName){
                if(newName){
                    this.gridParam.NextStep = ['1']
                }else{
                    if(this.tablelist.length>0){
                        // this.gridParam.NextStep = [];
                        this.gridParam.NextStep = this.tablelist[this.index].NextStep != null && this.tablelist[this.index].NextStep.length > 0 ? this.tablelist[this.index].NextStep.split(",") : [];
                    }
                }
            },
            deep: true,
            immediate: true
        },
//         'gridParam.NextStep': {
//             handler(newName, oldName){
//                 console.log(newName)
//                 if(newName.length<=0){
//                     this.message('该项为必选项',2);
//                     this.gridParam.NextStep = ['1']
//                 }
//             },
//             deep: true,
//             immediate: true
//         }
    },
    methods: {
        handleClick(tab, event) {
            this.operationlist.code = tab.paneName;
            this.getTaskTyp();
        },
        taskTabsClick(tab, event) {
            this.inspectionlist.code = tab.name;
            this.inspectionlist.Name = tab.label;
            this.getBasicOptionList();
        },
        getOperateInfo() {//获取一级业态
            this.$api.GetOperateInfo(1).then(res => {
                this.operationlist.datas = res;
                this.operationlist.Name = res[0].Name;
                this.operationlist.code = res[0].Id;
                this.getTaskTyp();
            }).catch(r => {
            });
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
                    // this.getinspection();
                    if (res.IsSuccess && res.Content.length > 0) {
                        this.inspectionlist.datas = res.Content;
                        this.inspectionlist.Name = res.Content[0].Text;
                        this.inspectionlist.code = res.Content[0].Id;
                    } else {
                        this.inspectionlist.datas = [];
                        this.inspectionlist.code = "";
                    }
                    this.getBasicOptionList();
                }
            )
        },
        //设置条件
        Settingconditions(row) {
            this.gridParam.isviewCondition = true;
            this.gridParam.EditingList[row].value
        },
        //添加执法结果列表
        addTitle() {
            if (this.gridParam.Text == '') {
                this.message('标题不可为空', 2)
                return
            }
            if (this.Inspectionresults.code == '') {
                this.message('请选择对应巡查结果', 2);
                return
            }
            if(this.gridParam.IsInspectItem&&this.gridParam.IsAuto){
                if(this.gridParam.NextStep.length==0){
                    this.message('请选择下一业务',2);
                    return;
                }
            }
//             if(!this.gridParam.IsInspectItem){
//                 this.gridParam.IsAuto = false;
//                 this.gridParam.NextStep = [];
//             }else{
//                 if(!this.gridParam.IsAuto){
//                     this.gridParam.NextStep = [];
//                 }
//             }

            let data = {
                "StoreTypeId": this.operationlist.code,
                "TaskTypeId": this.inspectionlist.code,
                "Id": this.gridParam.Id,
                "Text": this.gridParam.Text,
                "PreviousId": this.Inspectionresults.code,
                "IsDeadline": this.gridParam.IsInspectItem,
                "ProcessType": 0,
                "Type": 3,
                IsAuto: this.gridParam.IsAuto,//自动流转
                NextStep: this.gridParam.NextStep.length > 0 ? this.gridParam.NextStep.join(',') : '',//下一步
            };
            this.$api.SaveBasicOption(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.gridParam.isviewAdd = false;
                        this.message(res.Message, 1);
                        this.getBasicOptionList();
                    } else {
                        this.message(res.Message, -1);
                    }
                }
            )
        },
        //获取执法结果列表
        getBasicOptionList() {
            let data = {
                "StoreTypeId": this.operationlist.code,
                "TaskTypeId": this.inspectionlist.code,
                "ProcessType": 0,
                "Type": 3,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.tablelist = res.Content;
                        this.total = res.Content.length;
                    }
                }
            )
        },
        //获取检查结果----添加时用
        getinspection() {
            let data = {
                "StoreTypeId": this.operationlist.code,
                "TaskTypeId": this.inspectionlist.code,
                "ProcessType": 0,
                "Type": 2,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.gridParam.EditingList = res.Content;
                        if (res.Content.length > 0) {
                            this.gridParam.EditingConditions = res.Content[0].Id;
                        }
                    }
                }
            )
        },
        //获取巡查结果
        getBasicOptionListInspection() {
            let data = {
                "StoreTypeId": this.operationlist.code,      //业态id
                "TaskTypeId": this.inspectionlist.code,      //任务类型ID
                "ProcessType": 0,
                "Type": 2,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.Inspectionresults.datas = res.Content;
                    }
                }
            )
        },
        //删除执法结果列表
        DelEByIds(rows) {
            let data = {
                "Id": this.tablelist[rows].Id
            }
            this.$confirm('删除后影响已经配置的业务，确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.DelBasicOption(data).then(
                    res => {
                        if (res.IsSuccess) {
                            this.message(res.Message == null || res.Message == '' ? '删除成功' : res.Message, 1)
                            this.getBasicOptionList();
                        } else {
                            this.message(res.Message == null || res.Message == '' ? '删除成功' : res.Message, -1)
                        }
                    }
                ).catch(error => {
                });

            }).catch(() => {

            });
        },
        addview() {
            this.title = '添加';
            this.gridParam.IsAuto = true;
            this.gridParam.isviewAdd = true;
            this.gridParam.Text = '';
            this.gridParam.Id = '';
            this.gridParam.IsInspectItem = false;
            this.gridParam.NextStep = ['1'];
            this.Inspectionresults.code = '';
            this.getBasicOptionListInspection();
        },
        //修改执法结果列表
        modifylist(rows) {
            this.title = '修改';
            this.index = rows;
            this.getBasicOptionListInspection();
            this.gridParam.isviewAdd = true;
            this.gridParam.Text = this.tablelist[rows].Text;
            this.gridParam.Id = this.tablelist[rows].Id;
            this.Inspectionresults.code = this.tablelist[rows].PreviousText == '' ? '' : this.tablelist[rows].PreviousId;
            this.gridParam.IsInspectItem = this.tablelist[rows].IsDeadline;
            this.gridParam.IsAuto = this.tablelist[rows].IsAuto==null?false:this.tablelist[rows].IsAuto;
            this.gridParam.NextStep = this.tablelist[rows].NextStep != null && this.tablelist[rows].NextStep.length > 0 ? this.tablelist[rows].NextStep.split(",") : [];
        },
        //保存设置条件
//         Preservationcondition() {
//         },
        //限制标题只能是汉字
        changeCode() {
            this.$nextTick(() => {
                if (this.gridParam.Text !== '') {
                    this.gridParam.Text = this.gridParam.Text.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g, '')
                }
            })
        },
        getcheck(type){
            if(type){
                return false;
            }
        }
    }
}
