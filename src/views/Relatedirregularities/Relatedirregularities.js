import Pagination from '../../components/Pagination';

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
            tableGrid:{
                Loading:false,
                datas:[]
            },
            pageNation:{
                total:0,
                pageNum:1,
                countPerPage:200
            },
            title:'添加',
            gridParam:{
                isviewAdd:false,
                EditingConditions:'',
                EditingList:[]
            },
            //检查项分类
            classify:{
                datas:[],
                code:''
            },
            Checkpoints:{
                datas:[],
                code:''
            },
            //违规项名称
            ViolationOptionName:'',
            //检查项名称
            InspectOptionName:'',
        }
    },
    created: function(){
        this.getOperateInfo();
        this.GetViolationOptionList();
    },
    methods:{
        getOperateInfo() {//获取一级业态
            this.$api.GetOperateInfo(1).then(res => {
                if (res) {
                    this.topTabs.datas = res;
                    if (res.length > 0) {
                        this.topTabs.code = res[0].Id;
                    }
                    this.GetInspectOptionToViolationOptionList();
                    this.GetBasicOptionList();
                }
            }).catch(r => {
            });
        },
        topTabsClick(e) {
            this.GetInspectOptionToViolationOptionList();
            this.classify.code = e.name;
            this.GetBasicOptionList();
        },
        onPageNation(){},
        add(){
            this.gridParam.isviewAdd = true;
            this.gridParam.EditingConditions = '';
            this.classify.code = '';
            this.Checkpoints.code = '';
            this.title = '添加'
        },
        Preservation(){
            if(this.gridParam.EditingConditions && this.Checkpoints.code){
                let data = {
                    "StoreTypeId": this.topTabs.code,
                    'ViolationOptionCode':this.gridParam.EditingConditions,
                    'InspectOptionId':this.Checkpoints.code,
                    'ViolationOptionName':this.ViolationOptionName,
                    'InspectOptionName':this.InspectOptionName
                }
                this.$api.SetViolationOption(data).then(
                    res => {
                        if(res.IsSuccess){
                            this.gridParam.isviewAdd = false;
                            this.message(res.Message,1);
                            this.GetInspectOptionToViolationOptionList();
                        }else{
                            this.message(res.Message,-1);
                        }
                    }
                )
            }else{
                this.message('请选择内容',2)
            }
        },
        GetBasicOptionList(){
            let data = {
                "StoreTypeId": this.topTabs.code,
                "TaskTypeId": "",
                "ProcessType": 0,
                "Type": 6,
                "PreviousId": "",
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if(res && res.IsSuccess && res.Content.length > 0){
                        this.classify.datas = res.Content;
                    }
                }
            )
        },
        choseclassify(id){
            this.Checkpoints.code = '';
            let data = {
                    "StoreTypeId": this.topTabs.code,
                    "ProcessType": 0,
                    "ClassificationId": id,
                    "TaskTypeId": "",
                    "SearchWord": '',
                    "pageNo": this.pageNation.pageNum,
                    "pageSize": this.pageNation.countPerPage
            }
            this.$api.GetInspectOptionListAsync(data).then(
                res => {
                    if(res && res.Content){
                        this.Checkpoints.datas = res.Content;
                    }
                }
            )
        },
        //违规项选择
        choseEditingList(id){
            this.gridParam.EditingList.find((item) => {
                if(item.ViolationOptionCode == id){
                    this.ViolationOptionName = item.ViolationOptionName;
                }
            })
        },
        //检查项选择
        choseCheckpoints(id){
            this.Checkpoints.datas.find((item) => {
                if(item.Id == id){
                    this.InspectOptionName = item.Text;
                }
            })

        },
        //修改
        modifylist(rows){

        },
        //删除
        DelEByIds(rows){
            let data = {
                'Id':this.tableGrid.datas[rows].Id
            }
            this.$api.DelInspectOptionToViolationOption(data).then(
                res => {
                    if(res.IsSuccess){
                        this.message(res.Message,1);
                        this.GetInspectOptionToViolationOptionList();
                    }
                }
            )
        },
        GetViolationOptionList(){
            let data = {}
            this.$api.GetViolationOptionList(data).then(
                res => {
                    if(res.IsSuccess && res.Content.length > 0){
                        this.gridParam.EditingList = res.Content;
                    }
                }
            )
        },
        GetInspectOptionToViolationOptionList(){
            let data = {
                'StoreTypeId':this.topTabs.code,
            }
            this.$api.GetInspectOptionToViolationOptionList(data).then(
                res => {
                    if(res && res.Content){
                        this.tableGrid.datas = res.Content;
                        this.pageNation.total = res.Content.length;
                    }else{
                        this.tableGrid.datas = [];
                        this.pageNation.total = 0;
                    }
                }
            )
        }
    }
}
