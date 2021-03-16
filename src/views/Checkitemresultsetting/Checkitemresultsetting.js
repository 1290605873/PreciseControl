export default {
    data() {
        return {
            operationlist: {//业态列表
                //业态
                datas: [],
                Name: "", //当前业态值                
                code: "" //当前业态值id                
            }, 
            inspectionlist: { //检查类型列表
                datas:[
                    {Text:"巡查执法",Id:"0"},
                    {Text:"自改自查",Id:"1"},
                ],
                Name: "巡查执法", //当前业态值                
                code: "0" //当前业态值id                  
            },
            tablelist: [],
            gridParam: {
                isviewCondition: false, //设置条件
                Text: '', //标题
                Score: '', //顺序
                EditingConditions: '', //编辑条件
                Editingvalue:'',
                EditingList: [],//编辑条件列表
                conditioninput:'',//编辑条件里的输入内容
                condition:'1',
                Id:'',
            },            
        }
    },
    created: function(){
        this.getOperateInfo();
    },
    methods: {
        handleClick(tab, event) {
            this.operationlist.code = tab.paneName;
            this.inspectionlist.code = "0"
            this.getInspectOptionResult();
        },
        taskTabsClick(tab, event) {
            this.inspectionlist.code = tab.name;
            this.getInspectOptionResult();
        }, 
        getOperateInfo() {//获取一级业态
            this.$api.GetOperateInfo(1).then(res => {
                    this.operationlist.datas = res;
                    this.operationlist.Name = res[0].Name;
                    this.operationlist.code = res[0].Id;
                this.getInspectOptionResult();
            }).catch(r => {
            });
        },    
        //获取二级任务
        getTaskTyp() {
            let data = {
                "StoreTypeId":this.operationlist.code,
                "ProcessType":0,
                "Type":1,
            };
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
                        // this.getBasicOptionList();
                }
            )
        }, 
        getInspectOptionResult(){
            let data = {
                "StoreTypeId":this.operationlist.code,
                "ProcessType":this.inspectionlist.code
            }
            this.$api.GetInspectOptionResult(data).then(
                res => {
                    if(res.IsSuccess){
                        this.tablelist = res.Content;
                    }else{
                        this.message(res.Message,-1)
                    }
                }
            )
        },
        modifylist(rows){
            this.gridParam.isviewCondition = true;
            this.gridParam.Id = this.tablelist[rows].OrigNameType;
            this.gridParam.Text = this.tablelist[rows].Alias;
        },
        addTitle(){
            if(this.gridParam.Text){
                let data = {
                    "StoreTypeId":this.operationlist.code,
                    "ProcessType":this.inspectionlist.code,
                    "OrigNameType":this.gridParam.Id,
                    "Alias":this.gridParam.Text
                };
                this.$api.SaveInspectOptionResult(data).then(
                    res => {
                        if(res.IsSuccess){
                            this.message(res.Message,1);
                            this.gridParam.isviewCondition = false;
                            this.getInspectOptionResult();
                        }else{
                            this.message(res.Message,-1)
                        }
                    }
                )            
            }else{
                this.message("名称不能为空",-1)
            }
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