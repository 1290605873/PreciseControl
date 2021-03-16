import Pagination from "@/components/Pagination";
import Regionalism from '@/components/Regionalism.vue';
import PatrolDetails from '@/components/PatrolDetails.vue';
import {videoPlayer} from 'vue-video-player';
export default {
    components: {
        Pagination,
        Regionalism,
        PatrolDetails,
        videoPlayer
    },
    data() {
        return {
            storeName:'',
            StartTime: "",
            EndTime: "",
            pickerOptions1: { //限制结束时间
                disabledDate: (time) => {
                    if (this.StartTime!=null&&this.StartTime != '' || this.StartTime != undefined) {
                        let timeStr = new Date(this.StartTime.replace(/-/g, '/'));
                        return time.getTime() < timeStr;
                    }else{
                        // this.EndTime =  '';
                    }

                }
            },

            taskTabs: {//业态下的任务
                code: "0", //当前值
                datas: [
                    {
                        Id: "0",
                        Text: "AI巡查",
                    },
                    {
                        Id: "1",
                        Text: "整改管理",
                    },
                ],
                currentCode: '0'//当前所在
            },
            tableGrid:[],
            electronicTable_loading:false,
            pageNation:{
                total:0,
                pageNum:1,
                countPerPage:20
            },
            pageNation_refrom:{
                total:0,
                pageNum:1,
                countPerPage:20
            },
            //整改详情
            reformDetailDialog:{
                show:false,
                OptionList:[],
            },
            Rowcontentdetails:'',
            electronicInspectDialog:{
                show:false,
                pics:[],
                videos:[]
            },
            partrolDetailsDialog:{
                show:false,
            },
            area:{},
            tableGrid_refrom:[],
            reformTable_loading:false,
            exportViews:false,

            ruleForm:{
                exportstoreName:'',
                exportStartTime:'',
                exportEndTime:'',
                EditingConditions:'',
            },
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的
                }
            },
            exportpickerOptions: { //限制结束时间
                disabledDate: (time) => {
                    if (this.ruleForm.exportStartTime!=null&&this.ruleForm.exportStartTime != '' || this.ruleForm.exportStartTime != undefined) {
                        let timeStr = new Date(this.ruleForm.exportStartTime.replace(/-/g, '/'));
                        let days = 10 * 24 * 3600 * 1000;
                        return time.getTime() < timeStr || time.getTime() > ( new Date(this.ruleForm.exportStartTime).getTime() + days) || time.getTime() > Date.now();
                    }else{
                        // this.EndTime =  '';
                    }

                }
            },
            fullscreenLoading:false,
            EditingList:[],
            ViolationOptionName:'',

            rules: {
                exportstoreName: [
                    { required: true, message: '请输入门店名称', trigger: 'blur' },
                ],
                exportStartTime: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],
                exportEndTime: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],
                EditingConditions: [
                    { required: true, message: '请选择违规项', trigger: 'change' }
                ],
            }
        }
    },
    created:function (){
        this.GetViolationOptionList();
    },
    methods:{
        regionalismResult(area) {
            this.area = area;
        },
        initRegion(area) {
            this.area = area;
            // this.areaDatas.community.hide = true;
            // this.areaDatas.provience.hide = true;
            // this.areaDatas.city.hide = true;
            // this.getInitTable();
            this.getElectronicRecord();
        },
        startTimeChange(data){
          this.EndTime ='';
        },
        exportstartTimeChange(data){
            // if(data){
            //     let days = 10 * 24 * 3600 * 1000;
            //     this.ruleForm.exportEndTime = this.formatDate(new Date(data).getTime() + days);
            // }else{
                this.ruleForm.exportEndTime = '';
            // }
        },
        //查询
        queryList() {
            let code = this.taskTabs.code;
            if (code == 0) {//电子管理
                this.pageNation.pageIndex = 1;
                this.getElectronicRecord();
            } else {
                this.pageNation_refrom.pageIndex = 1;
                this.getReformList();
            }
        },
        //导出
        exportData(){
            this.exportViews = true;
            this.ruleForm.exportstoreName = '';
            this.ruleForm.exportStartTime = this.GetDateStr(-10);
            this.ruleForm.exportEndTime = this.timestampToTime(new Date());
            this.ruleForm.EditingConditions = '';
        },
        formatDate (value) {
            let date = new Date(value);
            let y = date.getFullYear();
            let MM = date.getMonth() + 1;
            MM = MM < 10 ? ('0' + MM) : MM;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + MM + '-' + d;
        },
        GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
            var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
            return y+"-"+m+"-"+d;
        },
        timestampToTime(timestamp) {
            let date = timestamp;
            //let date = new Date(parseInt(timestamp.substring(6, 19)));//时间戳为10位需*1000，时间戳为13位的话不需乘1000? ?
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return Y + M + D;
        },
        exportBtn(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.fullscreenLoading = true;
                    let data = {
                        'StoreName':this.ruleForm.exportstoreName,
                        'StartTime':this.ruleForm.exportStartTime,
                        'EndTime':this.ruleForm.exportEndTime,
                        'AttrCode':this.ruleForm.EditingConditions
                    }
                    this.$api.ExportElectronicRecord(data).then(
                        res =>{
                            if(res && res.IsSuccess){
                                this.fullscreenLoading = false;
                                if(res.Code == '2'){
                                    this.message('门店无数据',-1)
                                }else{
                                    if(res.Data){
                                        window.location.href = res.Data;
                                        this.exportViews = false;
                                        this.message('导出成功',1)
                                    }
                                }
                            }else{
                                this.fullscreenLoading = false;
                                this.message('导出失败',-1)
                            }
                        }
                    ).catch(r => {
                        this.fullscreenLoading = false;
                    })
                } else {
                    // console.log('error submit!!');
                    // this.fullscreenLoading = false;
                    return false;
                }
            });



        },
        GetViolationOptionList(){
            let data = {}
            this.$api.GetViolationOptionList(data).then(
                res => {
                    if(res.IsSuccess && res.Content.length > 0){
                        this.EditingList = res.Content;
                    }
                }
            )
        },
        //违规项选择
        choseEditingList(id){
            this.EditingList.find((item) => {
                if(item.ViolationOptionCode == id){
                    this.ViolationOptionName = item.ViolationOptionName;
                }
            })
        },
        //整改翻页
        onReformPageNation() {
            this.getReformList();
        },
        onPageNation(){},
        //页签切换
        taskTabsClick(tab) {
            this.taskTabs.code = tab.name;
            if (this.taskTabs.code == 0) {
                this.getElectronicRecord();
                this.pageNation.pageNum = 1;
            } else {
                this.getReformList();
                this.pageNation_refrom.pageNum = 1;
            }

        },
        //获取AI巡查列表
        getElectronicRecord() {
            this.electronicTable_loading = true;
            let data = {
                "ByDays": 0,
                "IsBackStage": true,
                "PageIndex": this.pageNation.pageNum,
                "PageSize": this.pageNation.countPerPage,
                "StartTime": this.StartTime,
                "EndTime": this.EndTime,
                "StoreName": this.storeName,
                "ProvinceCode": this.area.provience.code.length > 0 ? this.area.provience.code.split('-')[1] : this.area.provience.code,
                "CityCode": this.area.city.code.length > 0 ? this.area.city.code.split('-')[1] : this.area.city.code,
                "DistrictCode": this.area.town.code.length > 0 ? this.area.town.code.split('-')[1] : this.area.town.code,
                "LocationId": this.area.street.code,
                "CommunityId": this.area.community.code,
                'EleSource':2,
                'IsAuthority':false
            };

            this.$api.GetElectronicRecord(data).then(res => {
                    if (res && res.IsSuccess) {
                        this.tableGrid = res.Content;
                        this.pageNation.total = parseInt(res.Detail);
                    }
                    this.electronicTable_loading = false;
                }
            ).catch(r => {
                this.message("获取数据失败", 2);
                this.electronicTable_loading = false;
            })
        },
        openReformDialog(id, status) {
            if (status != 2&&status != 4) {
                return;
            }
            let data = {
                "Id": id,
            };
            this.$api.GetReformDetail(data).then(res => {
                if (res && res.IsSuccess) {
                    this.reformDetailDialog.show = true;
                    if (res.Content != null) {
                        this.reformDetailDialog.reformer = res.Content.ExamineUserName;
                        this.reformDetailDialog.endTime = res.Content.ReformEndTime;
                        this.reformDetailDialog.reformTime = res.Content.ReformStartTime;
                        this.reformDetailDialog.desc = res.Content.ReformText;
                        if (res.Content.OptionList != null && res.Content.OptionList.length > 0) {
                            this.reformDetailDialog.OptionList = res.Content.OptionList;
                        }
                        this.reformDetailDialog.InspectOptionName = res.Content.ExamineUserName;
                        // this.reformDetailDialog.ReformPics = res.Content.ExamineUserName;
                        // this.reformDetailDialog.ViolationPics = res.Content.ExamineUserName;
                    }
                } else {
                    this.message('获取详情失败', -1);
                }
            }).catch(r => {
                this.message('获取详情失败', -1);
            });

        },
        getInspectEnforceTaskDetail(row) {
            if (row.HandleStatus != 2) {
                return;
            }
            this.Rowcontentdetails={
              Id:row.Id,
                StoreId:row.StoreId
            };
            this.partrolDetailsDialog.show = true;
        },
        getReformPics(str) {
            let arr = [];
            if (str == null || str.length == 0) {
                return arr;
            }else{
                if(str.indexOf(',')==-1){
                    arr.push(str);
                }else{
                    arr = arr.concat(str.split(","))
                }
                return arr;
            }
        },
        openElecDialog(id) {
            let data = {
                "EleId": id,
            };
            this.$api.GetElectronicDetail(data).then(res => {
                if (res && res.IsSuccess) {
                    let pics = [];
                    let videos = [];
                    if (res.Data.ResultLst != null && res.Data.ResultLst.length > 0) {
                        for (let item of res.Data.ResultLst) {
                            if (item.PicLst != null && item.PicLst.length > 0) {
                                for (let it of item.PicLst) {
                                    pics.push({
                                        url: this.$utils.dealHttpSrc(it.PicUrl),
                                        name: item.InspectOptionText
                                    })
                                }
                            }
                        }
                    }
                    this.electronicInspectDialog.pics = pics;
                    this.electronicInspectDialog.CheckResult = res.Data.CheckResult;
                    this.electronicInspectDialog.InspectDate = res.Data.InspectDate;
                    this.electronicInspectDialog.InspectUser = res.Data.InspectUser;
                    this.electronicInspectDialog.StoreAds = res.Data.StoreAds;
                    this.electronicInspectDialog.StoreName = res.Data.StoreName;
                    if (res.Data.VideoLst != null && res.Data.VideoLst.length > 0) {
                        for (let ite of res.Data.VideoLst) {
                            videos.push({
                                post: ite.PicUrl,
                                videoSrc: this.$utils.dealHttpSrc(ite.VideoSrc),
                                playerOptions: {
                                    height: '240',
                                    width: '300',
                                    autoplay: false,
                                    muted: true,
                                    language: 'zh-CN',
                                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                                    sources: [{
                                        type: "video/mp4",
                                        src: this.$utils.dealHttpSrc(ite.VideoSrc)
                                    }],
                                    poster: ite.PicUrl,
                                    notSupportedMessage: '播放源连接失败',
                                }
                            })
                        }
                    }

                    this.electronicInspectDialog.videos = videos;
                }
                this.electronicInspectDialog.show = true;
            }).catch(r => {

            });
        },
        getReformList() {
            this.reformTable_loading = true;
            let data = {
                "ReformStartTime": this.StartTime,
                "ReformEndTime": this.EndTime,
                "StoreName": this.storeName,
                "Province": this.area.provience.code.length > 0 ? this.area.provience.code.split('-')[1] : this.area.provience.code,
                "City": this.area.city.code.length > 0 ? this.area.city.code.split('-')[1] : this.area.city.code,
                "Area": this.area.town.code.length > 0 ? this.area.town.code.split('-')[1] : this.area.town.code,
                "Street": this.area.street.code,
                "Community": this.area.community.code,
                "PageIndex": this.pageNation_refrom.pageNum,
                "PageSize": this.pageNation_refrom.countPerPage,
                'HandleType':2,
                'IsAuthority':false
            };
            this.$api.GetReformList(data).then(
                res => {
                    if(res.IsSuccess){
                        this.tableGrid_refrom = res.Content;
                        this.pageNation_refrom.total = res.Data;
                    }else{
                        this.message(res.Message,-1);
                    }
                    this.reformTable_loading = false;
                }
            ).catch(r => {
                this.reformTable_loading = false;
            })
        },
        getReformStatus(status) {
            //整改状态 0 全部 1待整改 2已整改 3已超期 4 已整改（已重新整改）
            if (status == 0) {
                return "--";
            } else if (status == 1) {
                return "待整改";
            } else if (status == 2) {
                return "已整改";
            } else if (status == 3) {
                return "整改已超期";
            } else if (status == 4) {
                return "已整改";
            }
        },
    }
}