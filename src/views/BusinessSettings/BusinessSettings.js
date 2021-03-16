import Editor from "@/components/Editor";
import Pagination from "@/components/Pagination";
import Regionalism from '@/components/Regionalism.vue';
export default {
    components: {
        Editor,
        Pagination,
        Regionalism
    },
    data() {
        return {
            i: 0,
            // content: `<p></p><p><br></p><ol><li><strong><em>Or drag/paste an image here.</em></strong></li><li><strong><em>rerew</em></strong></li><li><strong><em>rtrete</em></strong></li><li><strong><em>tytrytr</em></strong></li><li><strong><em>uytu</em></strong></li></ol>`,
            searchValue: {
                Name: '',
                page: 1,
                rows: 20
            },
            //类别
            category: {
                code: '',
                name: '',
                datas: [{
                        value: '1',
                        label: '承诺书'
                    },
                    {
                        value: '2',
                        label: '制度'
                    }
                ]
            },
            //状态
            state: {
                code: '',
                name: '',
                datas: [{
                        value: '1',
                        label: '未发布'
                    },
                    {
                        value: '2',
                        label: '已发布'
                    },
                    {
                        value: '3',
                        label: '已下线'
                    }
                ]
            },
            list: [],
            Loading: false,
            total: 0,
            treeData: [],
            operateTypeProps:{
                children: 'children',
                label: 'Name'
            },
            defaultProps: null,
            selectOrg: {
                orgsid: []
            },
            addCheckItemDiaglog:{
                show:false,
                Name:'',
                category: {
                    code: '',
                    name: '',
                    datas: [{
                            value: '1',
                            label: '承诺书'
                        },
                        {
                            value: '2',
                            label: '制度'
                        }
                    ]
                },
            },
            Enablationdetails:{
                show:false,
            },
            //承诺书内容
            article: {
                content: ''
            },
            searchDetails:{
                storeName:'',
                companyName:'',
                page:1,
                rows:20,
            },
            Detailsstate:{
                code: '',
                name: '',
                datas: [{
                        value: '1',
                        label: '未启用'
                    },
                    {
                        value: '2',
                        label: '已启用'
                    },
                    {
                        value: '3',
                        label: '已停用'
                    },
                    {
                        value: '4',
                        label: '已下线'
                    }
                ]
            },
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
            Detailstotal:0,
            content:'',
            //默认展开
            openId:[],
            //默认选中
            choseId:[],
            StoreTypeId:'',
            ParentStoreTypeId:'',
            UndertakingStatus:'',
            //按钮显示隐藏
            btnShow:true,
            //是否添加或修改
            IsAddorSave:true,
            modifydata:'',
            //详情表格
            detailslist:[],
            checkId:'',
            title:'',
            Isinput:true,
            readonly:false,
            checkPicViews:false,
            checkUrl:[]
        }
    },
    created:function(){
        this.GetOperateInfo();
    },
    methods: {
        onEditorReady(editor) { // 准备编辑器
            
        },
        onEditorBlur() {}, // 失去焦点事件
        onEditorFocus() {}, // 获得焦点事件
        EditorChange(data) {
            // console.log(data)
            this.article.content = data;
        }, // 内容改变事件
        getBasicOptionList() {},
        regionalismResult(area) {
            this.areaDatas = area;
        },
        initRegion(area) {
            this.areaDatas = area;
            // this.areaDatas.community.hide = true;
            this.areaDatas.provience.hide = true;
            this.areaDatas.city.hide = true;
            // this.getInitTable();
            console.log(this.areaDatas)
            this.GetStoreUsePageList();
        },
        Timechange(){
            this.Enddate = ''
        },
        handleClick(data, checked, node) {
            this.StoreTypeId = data.Id;
            this.ParentStoreTypeId = data.ParentId;
            this.InitTable();
//             this.i++;
//             if (this.i % 2 === 0) {
//                 if (checked) {
//                     this.$refs.treeForm.setCheckedNodes([]);
//                     this.$refs.treeForm.setCheckedNodes([data]);
//                     //交叉点击节点
//                 } else {
//                     this.$refs.treeForm.setCheckedNodes([]);
//                     //点击已经选中的节点，置空
//                 }
//             }
        },
        check_num(){
            this.addCheckItemDiaglog.Name = this.addCheckItemDiaglog.Name.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
        },
        fixedOnInputChange(){
            this.$nextTick(() => {
                while (this.figureOutLen(this.addCheckItemDiaglog.Name) > 30) {
                    this.addCheckItemDiaglog.Name = this.addCheckItemDiaglog.Name.substr(0, this.addCheckItemDiaglog.Name.length - 1);
                }
            });
        },
        figureOutLen(text) {
            let len;
            let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
            let mat = text.match(cnReg);
            if (mat) {
                len = mat.length + (text.length - mat.length) * 0.5;
            } else {
                len = text.length * 0.5;
            }
            return len;
        },
        //添加
        openAddCheckItemDialog() {
            if(this.StoreTypeId == ''){
                this.message('请选择业态',2)
            }else{
                this.title = '添加';
                this.addCheckItemDiaglog.show = true;
                this.btnShow = true;
                this.Isinput = true;
                this.readonly = false;
                this.addCheckItemDiaglog.category.code = '';
                this.addCheckItemDiaglog.Name = '';
                this.article.content = '';
                this.IsAddorSave = true;
            }
        },
        //发布
        Release(){
            this.$confirm('点击确定，发布成功，将无法修改', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.UndertakingStatus = 2;
                this.AddUndertaking();
            }).catch(() => {

            });
        },
        cancel(){
            this.$confirm('取消后数据将不会保存，确认后退出', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.addCheckItemDiaglog.show = false;  
            }).catch(() => {

            });
        },
        //保存
        Preservation(){
            this.UndertakingStatus = 1;
            this.AddUndertaking();
        },
        //承诺书(制度)_添加
        AddUndertaking(){
            if(this.addCheckItemDiaglog.Name =='' || this.addCheckItemDiaglog.category.code == '' || this.article.content ==''){
                this.message('请输入内容',2)
            }else{
                let insertStr = (soure,start, newStr) => {
                    return soure.slice(0, start) + newStr + soure.slice(start)
                }
                let newstrs = '<head><style>img{max-width:100%}.ql-size-small{font-size:0.75em}.ql-size-large{font-size:1.5em}.ql-size-huge{font-size:2.5em}.ql-align-right{text-align: right;}.ql-indent-1{padding-left: 3em;}.ql-align-center{text-align: center;}</style></head>'
                this.article.content = insertStr(this.article.content,0,newstrs);
                if(this.IsAddorSave){
                    let data = {
                        'StoreTypeId':this.StoreTypeId,
                        'ParentStoreTypeId':this.ParentStoreTypeId,
                        'UndertakingTitle':this.addCheckItemDiaglog.Name,
                        'UndertakingType':this.addCheckItemDiaglog.category.code,
                        'UndertakingContent':this.article.content,
                        'UndertakingStatus':this.UndertakingStatus,
                        'UndertakingUserId':this.$utils.getUrlKey('userId')
                    }
                    this.$api.Add(data).then(
                        res =>　{
                            if(res.IsSuccess){
                                this.message(res.Message,1);
                                this.addCheckItemDiaglog.show = false;
                                this.InitTable();
                            }
                        }
                    )
                }else{
                    let datas = {
                        'Id':this.modifydata.Id,
                        'UndertakingTitle':this.addCheckItemDiaglog.Name,
                        'UndertakingType':this.modifydata.UndertakingType,
                        'UndertakingContent':this.article.content,
                        'UndertakingStatus':this.UndertakingStatus,
                        'UndertakingUserId':this.$utils.getUrlKey('userId')
                    }
                    this.$api.Save(datas).then(
                        res =>　{
                            if(res.IsSuccess){
                                this.message(res.Message,1);
                                this.addCheckItemDiaglog.show = false;
                                this.InitTable();
                            }
                        }
                    )
                }
            }
        },
        //获取业态
        GetOperateInfo(){
            this.$api.GetOperateInfo(0).then(
                res => {
                    for(let item of res){
                        item.children = [];
                        if(item.ParentId == '00000000-0000-0000-0000-000000000000'){
                            for(let itemt of res){
                                if(itemt.ParentId == item.Id){
                                    item.children.push(itemt)
                                    for(let items of res){
                                        if(items.ParentId == itemt.Id){
                                            itemt.children.push(items)
                                        }
                                    }
                                }
                            }
                            this.treeData.push(item);
                        }
                    }
//                     this.openId.push(this.treeData[0].Id);
//                     this.choseId.push(this.treeData[0].children[0].Id);
//                     this.StoreTypeId = this.treeData[0].children[0].Id;
//                     this.ParentStoreTypeId = this.treeData[0].children[0].ParentId;
//                     this.$nextTick(() => {
//                         this.$refs.treeForm.setCheckedKeys([this.treeData[0].children[0].Id]);
//                     })
//                     console.log(this.choseId)
                }
            )
        },
        //查询
        query(){
            this.searchValue.page = 1;
            this.InitTable();
        },
        //初始化
        InitTable(){
            let data = {
                // 'AppId':this.$utils.getUrlKey("appId"),
                // 'StoreTypeId':'b8bd1cf2-f769-4af2-8869-880da496a798',
                'StoreTypeId':this.StoreTypeId,
                'ParentStoreTypeId':this.ParentStoreTypeId,
                'UndertakingTitle':this.searchValue.Name,
                'UndertakingType':this.category.code,
                'UndertakingStatus':this.state.code,
                'PageIndex':this.searchValue.page,
                'PageSize':this.searchValue.rows
            }
            this.$api.GetPageList(data).then(
                res => {
                    if(res.IsSuccess){
                        this.list = res.Data.Datas;
                        this.total = res.Data.Count;
                    }else{
                        this.message(res.Message,2)
                    }
                }
            )
        },
        //查看详情
        showTaskInfo(id){
            let data = {
                'Id':id
            }
            this.$api.GetById(data).then(
                res => {
                    if(res.IsSuccess){
                        this.title = '查看';
                        this.addCheckItemDiaglog.category.code = res.Data.UndertakingTypeValue;
                        this.addCheckItemDiaglog.Name = res.Data.UndertakingTitle;
                        this.article.content = res.Data.UndertakingContent;
                        this.btnShow = false;
                        this.Isinput = false;
                        this.readonly = true;
                        this.addCheckItemDiaglog.show = true;
                    }
                }
            )
        },

        //修改
        modifyUnder(data){
            this.IsAddorSave = false;
            let datas = {
                'Id':data.Id
            }
            this.$api.GetById(datas).then(
                res => {
                    if(res.IsSuccess){
                        this.title = '修改';
                        this.addCheckItemDiaglog.category.code = res.Data.UndertakingTypeValue;
                        this.addCheckItemDiaglog.Name = res.Data.UndertakingTitle;
                        this.article.content = res.Data.UndertakingContent;
                        this.btnShow = true;
                        this.Isinput = true;
                        this.readonly = false;
                        this.addCheckItemDiaglog.show = true;
                    }
                }
            )
            this.modifydata = data;
//             let datas = {
//                 'Id':id,
//                 'UndertakingTitle':this.addCheckItemDiaglog.Name,
//                 'UndertakingType':this.addCheckItemDiaglog.category.code,
//                 'UndertakingContent':this.article.content,
//                 'UndertakingStatus':this.UndertakingStatus,
//                 'UndertakingUserId':this.$utils.getUrlKey('userId')
//             }
            
        },
        //下线
        Isoffline(id){
            let data = {
                'Id':id,
                'status':3,
                'undertakingUserId':this.$utils.getUrlKey('userId')
            }
            this.$api.SaveUndertakingStatus(data).then(
                res => {
                    if(res.IsSuccess){
                        this.message(res.Message,1);
                        this.InitTable();
                    }
                }
            )
        },
        Seedetails(id){
            this.checkId = id;
            this.searchDetails.storeName = '';
            this.searchDetails.companyName = '';
            this.Detailsstate.code = '';
            this.Startdate = '';
            this.Enddate = '';
            this.Detailstotal = 0;
            this.detailslist = [];
            this.Enablationdetails.show = true;
        },
        GetStoreUsePageList(){
            let data = {};
            if(this.ParentStoreTypeId == '00000000-0000-0000-0000-000000000000'){
                data = {
                    'Id':this.checkId,
                    'StoreName':this.searchDetails.storeName,
                    'StoreAliasName':this.searchDetails.companyName,
                    'StartUseDate':this.Startdate,
                    'EndUseDate':this.Enddate,
                    'UseStatus':this.Detailsstate.code,
                    'DistrictCode':this.areaDatas.town.code,
                    'LocationId':this.areaDatas.street.code,
                    'CommunityId':this.areaDatas.community.code,
                    'StoreTypeId':this.StoreTypeId,
                    'StoreSecTypeId':'',
                    'PageIndex':this.searchDetails.page,
                    'PageSize':this.searchDetails.rows,
                }
            }else{
                data = {
                    'Id':this.checkId,
                    'StoreName':this.searchDetails.storeName,
                    'StoreAliasName':this.searchDetails.companyName,
                    'StartUseDate':this.Startdate,
                    'EndUseDate':this.Enddate,
                    'UseStatus':this.Detailsstate.code,
                    'DistrictCode':this.areaDatas.town.code,
                    'LocationId':this.areaDatas.street.code,
                    'CommunityId':this.areaDatas.community.code,
                    'StoreTypeId':this.ParentStoreTypeId,
                    'StoreSecTypeId':this.StoreTypeId,
                    'PageIndex':this.searchDetails.page,
                    'PageSize':this.searchDetails.rows,
                }
            }
            this.$api.GetStoreUsePageList(data).then(
                res =>　{
                    if(res.IsSuccess){
                        this.Detailstotal = res.Data.Count;
                        this.detailslist = res.Data.Datas;
                    }
                }
            )
            
        },
        querydetails(){
            this.searchDetails.page = 1;
            this.GetStoreUsePageList();
        },
        checkPic(row){
            this.checkUrl = [];
            if(this.detailslist[row].JoinStorePicture){
                this.checkPicViews = true;
                // this.checkUrl = ;
                this.checkUrl.push(this.detailslist[row].JoinStorePicture);
            }else{
                this.message('此条记录签字时未启用五定拍照',2)
            }
        }
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    },
//     watch:{
//         'treeData'(){
//                     this.$nextTick(() => {
//                         this.$refs.treeForm.setCheckedKeys([this.treeData[0].children[0].Id]);
//                         // this.choseId.push(this.treeData[0].children[0].Id);
//                     })
//         }
//     },
}
