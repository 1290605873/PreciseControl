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
                datas:[],
                Name: "", //当前业态值                
                code: "" //当前业态值id                  
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
                conditioninput:'',
                condition:'1',
                Id:'',
                IsDefault:true,
                IsDeadline:false,
                IsReform:false,
                IsEnforceVoucher:true,
            },
            title:'',
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
                "StoreTypeId":this.operationlist.code,
                "ProcessType":0,
                "Type":1,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if(res.IsSuccess&&res.Content.length>0){
                        this.inspectionlist.datas = res.Content;
                        this.inspectionlist.Name = res.Content[0].Text;
                        this.inspectionlist.code = res.Content[0].Id;
                    }else{
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
            console.log(row)
            this.gridParam.EditingList[row].value
        },
        //添加执法结果列表
        addTitle() {
            if(this.gridParam.Text != ''){
                let data = {
                    "StoreTypeId":this.operationlist.code,
                    "TaskTypeId":this.inspectionlist.code,                    
                    "Id":this.gridParam.Id,
                    "Text":this.gridParam.Text,
                    "IsDefault":this.gridParam.IsDefault,
                    "IsDeadline":this.gridParam.IsDeadline,
                    "IsReform":this.gridParam.IsReform,
                    "ProcessType":0,
                    "Type":5,
                    "IsAuto":this.gridParam.IsEnforceVoucher,
                }
                this.$api.SaveBasicOption(data).then(
                    res => {
                        if(res.IsSuccess){
                            this.gridParam.isviewAdd=false;
                            this.message(res.Message,1);
                            this.getBasicOptionList();
                        }else{
                            this.message(res.Message,-1)
                        }
                    }
                )
            }else{
                this.message("名称不可为空",2)
            }
        },
        //获取执法结果列表
        getBasicOptionList() {
            let data = {
                "StoreTypeId":this.operationlist.code,
                "TaskTypeId":this.inspectionlist.code,
                "ProcessType":0,
                "Type":5,
            }            
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if(res.IsSuccess){
                        this.tablelist = res.Content;
                        if(res.Content&&res.Content.length>0){
                            this.total = res.Content.length;
                        }else{
                            this.total = 0;
                        }
                    }
                }
            )
        },
        //删除执法结果列表
        DelEByIds(rows) {
            let data = {
                "Id":this.tablelist[rows].Id
            }
            this.$confirm('删除后影响已经配置的业务，确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.DelBasicOption(data).then(res => {
                    if(res.IsSuccess){
                        this.message(res.Message==null||res.Message==''?'删除成功':res.Message,1)
                        this.getBasicOptionList();
                    }else{
                        this.message(res.Message==null||res.Message==''?'删除成功':res.Message,-1)
                    }
                }).catch(error => {
                });

            }).catch(() => {

            });            
        },
        addview(){
            this.gridParam.isviewAdd=true;
            this.gridParam.Text='';
            this.gridParam.Id = '';
            this.gridParam.IsDefault=true;
            this.gridParam.IsDeadline=false;
            this.gridParam.IsReform=false;
            this.title = '添加';
        },
        //修改执法结果列表
        modifylist(rows){
            this.gridParam.isviewAdd=true;  
            this.gridParam.Text = this.tablelist[rows].Text;
            this.gridParam.Id = this.tablelist[rows].Id;
            this.gridParam.IsDefault = this.tablelist[rows].IsDefault;
            this.gridParam.IsDeadline = this.tablelist[rows].IsDeadline;
            this.gridParam.IsReform = this.tablelist[rows].IsReform;
            this.gridParam.IsAuto = this.tablelist[rows].IsAuto;
            this.title = '修改';
        },
        //保存设置条件
        Preservationcondition() {
            console.log(this.gridParam.condition)
        },
        //限制标题只能是汉字
        changeCode(){
            this.$nextTick(() => {
                if(this.gridParam.Text !== ''){
                  this.gridParam.Text = this.gridParam.Text.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g,'')
                }
            })
        },        
    }
}
