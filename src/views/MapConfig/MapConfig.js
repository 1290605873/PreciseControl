import Pagination from "@/components/Pagination";
export default {
    components: {
        Pagination,
    },
    data() {
        return {
            topTabs: {//顶部业态
                //业态
                datas: [],
                code: "" //当前业态值
            },
            title:"添加任务类型",
            taskTabs: {//业态下的任务
                code: "0", //当前值
                datas: [
                    {
                        Id: "0",
                        Text: "巡查执法",
                    },
                    {
                        Id: "1",
                        Text: "自改自查",
                    },
                ],
                currentCode:'0'//当前所在
            }, 
            tableGrid: [],  
            tableGridId:'',
            pageNation: {//分页
                total: 0,
                pageNum: 1,//页数
                countPerPage: 200//每页数
            },
            businessName:'',
            centerDialogVisible:false,
            
        }
    },
    created: function(){
      this.getOperateInfo();
      
    },
    methods: {
        topTabsClick(tab) {
            this.topTabs.code = tab.name;
            this.getBasicOptionList();
        },
        getOperateInfo() {//获取一级业态
                this.$api.GetOperateInfo(1).then(res => {
                    if (res) {
                        this.topTabs.datas = res;
                        if (res.length > 0) {
                            this.topTabs.code = res[0].Id;
                            this.getBasicOptionList();
                        }
                    }
                }).catch(r => {
                });
        },
        taskTabsClick(tab){
            this.taskTabs.code = tab.name;
            this.getBasicOptionList();
        },
        Preservation(){
            if(this.businessName){
                let data = {
                    "Id":this.tableGridId,
                    "StoreTypeId":this.topTabs.code,
                    "ProcessType":Number(this.taskTabs.code),
                    "Type":1,
                    "Text":this.businessName
                }
                this.$api.SaveBasicOption(data).then(
                    res => {
                        if(res.IsSuccess){
                            // this.tableGrid = [];
                            this.message("操作成功",1)
                            this.centerDialogVisible = false;
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
//         //获取二级任务
//         getTaskTyp() {
//             // console.log(this.operationlist.code)
//             let data = {
//                 "StoreTypeId":"91025d9d-733a-42fa-a8ae-93cddea3fc02",
//                 "TaskTypeId":"08ae6494-07d3-41c4-a172-82da5f6556cc",
//                 "ProcessType":0,
//                 "Type":1,
//                 // "PreviousId":"",
//             }            
//             this.$api.GetBasicOptionList(data).then(
//                 res => {
//                     this.taskTabs.datas = res.Content;
//                     this.taskTabs.Name = res.Content[0].Text;
//                     this.taskTabs.code = res.Content[0].Id;
//                     console.log(this.taskTabs.Name);
//                     // this.getchecklist();
//                 }
//             )
//         },     
        getBasicOptionList() {
            let data = {
                "StoreTypeId":this.topTabs.code,
                // "TaskTypeId":this.taskTabs.code,
                "ProcessType":Number(this.taskTabs.code),
                "Type":1,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if(res.IsSuccess){
                        this.tableGrid = res.Content;
                        // this.pageNation.total = res.Content.length;
                    }else{
                        this.message(res.Message)
                    }
                }
            )
        },
        modifyEById(rows){
            this.centerDialogVisible = true;
            this.businessName = this.tableGrid[rows].Text;
            this.tableGridId = this.tableGrid[rows].Id;
            this.title = '修改任务类型';
        },
        //限制标题只能是汉字
        changeCode(){
            this.$nextTick(() => {
                if(this.businessName !== ''){
                  this.businessName = this.businessName.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g,'')
                }
            })
        },          
    }
}