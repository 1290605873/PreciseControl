import Pagination from "@/components/Pagination";
import Regionalism from '@/components/Regionalism.vue';
import VideoView from './VideoView.vue'
var time = null;

export default {
    components: {
        Pagination,
        Regionalism,
        VideoView
    },
    data () {
        const self = this
        return {
            AppId:'',
            UserId:'',
            OrgId: '',
            state: '', // 单位名称
            AttrCode:'', // 违规项
            IsAudit: '-1', // 是否违规
            AuditStatus: 1, // 审核状态
            StartTime: '', // 开始时间
            EndTime: '', // 结束时间
            Auditor: '', //审核人
            pickerOptions1: { //限制结束时间
                disabledDate: (time) => {
                    if (this.StartTime != null && this.StartTime != '' || this.StartTime != undefined) {
                        let timeStr = new Date(this.StartTime).getTime();
                        // let timeStr = new Date(this.StartTime.replace(/-/g, '/'));
                        return time.getTime() <= timeStr - 86400000;
                    } else {
                        this.EndTime =  '';
                    }
                }
            },
            AuditedTotal:'0', // 已审核数量
            NotAuditedTotal:'0', //待审核数量
            FailedPicturesTotal:'0', //违规图片数量
            PicturesTotal:'0', //合格图片数量
            gridParam: {
                gridLoading: false,
                gridList: []
            },
            // 检查项列表
            violationsList:[], 
            // 违规项列表
            isViolationList:[
                {Id: '-1',Name: '全部'},
                {Id: '0',Name: '未违规'},
                {Id: '1',Name: '违规'}
            ],
            // 审核项列表
            isToexamineList:[
                {Id: 1,Name: '待审核'},
                {Id: 2,Name: '已审核'}
            ],
            disabled: true,
            allcheck: false,
            isSlide: false,
            // 翻页
            pages:{
                page: 1,
                limit: 20,
                total: 0,
                pageSizes:[10,20,30]
            },
            //上传资源信息集合
            checkedList: [],
            videoView:{
                show: false,
                data: {}
            }
        }
    },
    created () {
        this.AppId = this.$utils.getUrlKey("appId")
        this.UserId = this.$utils.getUrlKey("userId")
        this.OrgId = this.$utils.getUrlKey("curChangeOrg")
        this.StartTime = this.getNowFormatDate()
        this.getAttrList()
    },
    methods: {
        // 地址组件函数
        regionalismResult(area) {
            this.areaDatas = area;
        },
        // 地址组件函数
        initRegion(area) {
            this.disabled = false;
            this.areaDatas = area;
            this.GetPicList();
        },
        //查询
        queryList() {
            this.pages.page = 1;
            this.disabled = true;
            this.GetPicList();
        },
        // 全选
        Allelection() {
            this.allcheck = this.gridParam.gridList.every(i => i.checked)
            this.gridParam.gridList.map(i => {
                i.checked = !this.allcheck
                return i
            })
        },
        // 审核状态改变
        auditChange(v){
            if(v == 2){
                this.gridParam.gridList.map(i => {
                    i.checked = false
                    return i
                })
            }
        },
        // 违规标识
        goTask(){
            let u = window.location
            let o
            if(u.origin.indexOf('test') < 0){
                o = 'http://testtep-ui.iuoooo.com/ui/#/TaskManage?'
            } else{
                o = 'http://tep-ui.iuoooo.com/ui/#/TaskManage?'
            }
            window.location.href = o + u.href.split('?')[1]
        },
        // 展开收起
        slideToggle(){
            this.isSlide = !this.isSlide
        },
        //获取列表
        GetPicList() {
            this.gridParam.gridLoading = true
            if (new Date(this.EndTime).getTime() < new Date(this.StartTime).getTime() && new Date(this.EndTime).getTime() > 0) {
                this.message('请选择正确时间', 2);
                this.gridParam.gridLoading = false
                return;
            }
            let param = {
                ProvinceCode:''|| this.areaDatas.provience.code,//省编码
                CityCode: ''|| this.areaDatas.city.code,//市编码
                DistrictCode: this.areaDatas.town.code,//区编码
                LocationId: this.areaDatas.street.code || '00000000-0000-0000-0000-000000000000',//街道id
                CommunityId: this.areaDatas.community.code || '00000000-0000-0000-0000-000000000000',//社区ID
                CompanyName: this.state,//单位名称
                AttrCode:  this.AttrCode,//违规项
                IsAudit: this.IsAudit,//是否违规 -1全部 0未违规 1违规
                AuditStatus: this.AuditStatus,//审核状态：0-无 1-未审核 2-已审核
                SourceType: 3,//来源类型 0无 1自查 2 ai智能整改 3 表单 4 摄像头图片
                PicType: 2, // 1图片 2视频缩略图
                AuditUserName: this.Auditor,//审核人
                BeginTime: this.StartTime,//开始时间
                EndTime: this.EndTime,//结束时间
                PageNo: this.pages.page,//当前页数
                PageSize: this.pages.limit,//每页显示数
                OrgId: this.OrgId,//($uuid)组织id
                AppId: this.AppId,//($uuid)应用id
                UserId: this.UserId,//($uuid)用户id
            }

            this.$api.GetPicList(param).then(res => {
                    this.gridParam.gridLoading = false;
                    this.disabled = false;
                    this.allcheck = false;
                    this.pages.total = res.Total || 0
                    
                    this.AuditedTotal= res.AuditedTotal
                    this.NotAuditedTotal= res.NotAuditedTotal
                    this.FailedPicturesTotal = res.FailedPicturesTotal
                    this.PicturesTotal = res.PicturesTotal

                    if (res && res.IsSuccess && res.ListData) {
                        for (let item of res.ListData) {
                            item.checked = false;
                        }
                        this.gridParam.gridList = res.ListData.map(i => {
                            let tempArr = []
                            i.TextList = i.TextList == null ? [] : i.TextList
                            i.Coordinate = i.Coordinate == null ? [] : i.Coordinate
                            tempArr = i.TextList.map(k => {
                                k.AttrTxt = k.Text
                                k.AttrCode= "wrongText"
                                return k
                            })
                            i.wrongItem = i.Coordinate.concat(tempArr)
                            return i
                        })
                    } else {
                        this.gridParam.gridList = []
                    }
                }
            ).catch(error => {
                this.gridParam.gridLoading = false;
                this.disabled = false;
            })
        },
        // 多选切换
        change(index, flag) {
            if (flag) return 
            this.gridParam.gridList[index].checked = !this.gridParam.gridList[index].checked            
        },
        // 获取初始时间
        getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            month = month < 10 ?  "0" + month : month
            strDate = strDate < 10 ?  "0" + strDate : strDate
            var currentdate = year + seperator1 + month + seperator1 + strDate + ' 00:00:00';
            return currentdate;
        },
        // 双击图片
        dbcheck(val) {
            this.videoView.data.userName = this.Auditor
            this.videoView.data.val = val
            this.videoView.data.picType = 2
            this.videoView.data.AttrList = this.$utils.deepCopy(this.violationsList)
            let p = {
                PicturePath: val.OriginalPicture
            }
            console.log(val.InitHeight,val.InitWidth)
            if(val.InitHeight == 0 || val.InitWidth == 0 || val.InitHeight == null || val.InitWidth == null){
                this.$api.GetPictureInfo(p).then(res=>{
                    if(res && res.IsSuccess){
                        val.InitHeight = res.InitHeight
                        val.InitWidth = res.InitWidth
                        this.videoView.show = true
                    }
                }).catch(()=>{})
            }else{
                this.videoView.show = true
            }
        },
        // 获取违规属性列表
        async getAttrList () {
            const res = await this.$api.GetAttrList({})
            // console.log('违规项--->',res);
            if (res && res.Content) {
                this.violationsList = res.Content
            }
        },
        // 关闭审查图片
        CloseVideoView(){
            this.videoView.show = false
            this.GetPicList()
        },
        // 批量审核
        async comInspectAuditPic () { // 审核
            let isSelect = this.gridParam.gridList.some(i => i.checked)
            if (!isSelect) {
                this.message('请勾选视频', 2);
                return
            }  
            this.checkedList = this.gridParam.gridList.filter(i => i.checked)
            let p = {
                Id: this.checkedList.map(i =>i.Id),
                UserId: this.UserId,
                UserName: this.Auditor
            }
            const res = await this.$api.BatchSubmit(p)
            if (res.IsSuccess) {
                this.message(res.Message, 1)
                this.pages.page = 1;
                this.GetPicList()
            }else{
                this.message(res.Message, -1)
            }
        },
        // 翻页
        pageChange(v){
            this.pages.page = v.page
            this.pages.limit = v.limit
            this.GetPicList()
        }
    }
}
