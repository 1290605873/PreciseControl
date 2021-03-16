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
            tablelist: [],
            Conditionlist: [], //设置条件里的列表
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
                Score: 0, //顺序
                EditingConditions: '', //编辑条件
                Editingvalue: '',
                EditingList: [], //编辑条件列表
                conditioninput: 0, //编辑条件里的输入内容
                condition: 1,
                Id: '',
                state: true, //状态
            },
            title: '添加',
        }
    },
    created: function() {
        this.getOperateInfo();
    },
    mounted: function() {

    },
    methods: {
        handleClick(tab, event) {
            this.operationlist.code = tab.paneName;
            this.getTaskTyp();
        },
        taskTabsClick(tab, event) {
            this.inspectionlist.code = tab.name;
            this.getBasicOptionList();
        },
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
            this.gridParam.EditingConditions = this.gridParam.EditingList[0].Id;
            this.gridParam.Editingvalue = this.gridParam.EditingList[0].Text;
            this.gridParam.Id = this.tablelist[row].Id;
            this.gridParam.conditioninput = 0;
            this.gridParam.condition = 1;
            this.getInspectResultCondition();
        },
        //添加检查结果列表
        addTitle() {

            if (this.gridParam.Text != '') {
                let data = {
                    "StoreTypeId": this.operationlist.code,
                    "TaskTypeId": this.inspectionlist.code,
                    "Id": this.gridParam.Id,
                    "Text": this.gridParam.Text,
                    "Score": Number(this.gridParam.Score),
                    "IsDefault": this.gridParam.state,
                    "ProcessType": 0,
                    "Type": 2
                }
                this.$api.SaveBasicOption(data).then(
                    res => {
                        if (res.IsSuccess) {
                            this.gridParam.isviewAdd = false;
                            this.message(res.Message, 1);
                            this.getBasicOptionList();
                        } else {
                            this.message(res.Message, -1)
                        }

                    }
                )
            } else {
                this.message("请输入内容", 2)
            }
        },
        //获取检查结果列表
        getBasicOptionList() {
            let data = {
                "StoreTypeId": this.operationlist.code,
                "TaskTypeId": this.inspectionlist.code,
                "ProcessType": 0,
                "Type": 2,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.tablelist = res.Content;
                        if (res.Content && res.Content.length > 0) {
                            this.total = res.Content.length;
                        } else {
                            this.total = 0;
                        }
                    }
                }
            )
            let datas = {
                "StoreTypeId": this.operationlist.code,
                "TaskTypeId": this.inspectionlist.code,
                "ProcessType": 0,
                "Type": 7,
            }
            this.$api.GetBasicOptionList(datas).then(
                res => {
                    if (res.IsSuccess) {
                        this.gridParam.EditingList = res.Content;
                        if (res.Content > 0) {
                            this.gridParam.EditingConditions = res.Content[0].Id;
                            this.gridParam.Editingvalue = res.Content[0].Text;
                        }
                    }
                }
            )
        },
        //删除检查结果列表
        DelEByIds(rows) {
            let data = {
                "Id": this.tablelist[rows].Id
            }
            this.$confirm('删除后影响已经配置的业务，确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.DelBasicOption(data).then(res => {
                    if (res.IsSuccess) {
                        this.message(res.Message == null || res.Message == '' ? '删除成功' : res.Message, 1)
                        this.getBasicOptionList();
                    } else {
                        this.message(res.Message == null || res.Message == '' ? '删除失败' : res.Message, -
                            1)
                    }
                }).catch(error => {});

            }).catch(() => {

            });
        },
        //修改检查结果列表
        modifylist(rows) {
            this.gridParam.isviewAdd = true;
            this.gridParam.Text = this.tablelist[rows].Text;
            this.gridParam.Score = this.tablelist[rows].Score;
            this.gridParam.Id = this.tablelist[rows].Id;
            this.gridParam.state = this.tablelist[rows].IsDefault;
            this.title = '修改';
        },
        selectGet(vId) {
            let Editing;
            for (let i = 0; i < this.gridParam.EditingList.length; i++) {
                if (this.gridParam.EditingList[i].Id == vId) {
                    Editing = this.gridParam.EditingList[i]
                }
            }
            this.gridParam.Editingvalue = Editing.Text;
        },
        //保存设置条件
        Preservationcondition() {
            let conditionvalue;
            if (this.gridParam.condition == 1) {
                conditionvalue = "大于等于"
            } else {
                conditionvalue = "大于"
            }

                let data = {
                    "MinCount": Number(this.gridParam.conditioninput),
                    "InspectResultId": this.gridParam.Id,
                    "InspectOptionLevelId": this.gridParam.EditingConditions,
                    "Operatorin": this.gridParam.condition,
                    "Remark": this.gridParam.Editingvalue + conditionvalue + parseInt(this.gridParam.conditioninput),
                }
                this.$api.SetInspectResultCondition(data).then(
                    res => {
                        if (res.IsSuccess) {
                            this.message("保存成功", 1);
                            this.getInspectResultCondition()
                        }
                    }
                )
        },
        getInspectResultCondition() {
            let data = {
                "InspectResultId": this.gridParam.Id
            }
            this.$api.GetInspectResultCondition(data).then(
                res => {
                    this.Conditionlist = res.Content;
                }
            )
        },
        DelCondition(rows) {
            let data = {
                "Id": this.Conditionlist[rows].Id
            }
            this.$confirm('删除后影响已经配置的业务，确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.DelInspectResultCondition(data).then(
                    res => {
                        this.message(res.message == null || res.message == '' ? '删除成功' : res.message, 1)
                        this.getInspectResultCondition();
                    }
                ).catch(error => {
                    this.message(res.message == null || res.message == '' ? '删除成功' : res.message, -1)
                });

            }).catch(() => {

            });
        },
        //限制标题只能是汉字
        changeCode() {
            this.$nextTick(() => {
                if (this.gridParam.Text !== '') {
                    this.gridParam.Text = this.gridParam.Text.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g, '')
                }
            })
        },
        handleChange(value) {
            // console.log(value);
            this.gridParam.Score = value;
        },
        handleChanget(value) {
            // console.log(value);
            this.gridParam.conditioninput = value;
        }
    }
}
