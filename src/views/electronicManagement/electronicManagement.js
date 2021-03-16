import Pagination from "@/components/Pagination";
import Regionalism from '@/components/Regionalism.vue';
import {videoPlayer} from 'vue-video-player';
import PatrolDetails from '@/components/PatrolDetails.vue';

export default {
    components: {
        Pagination,
        Regionalism,
        videoPlayer,
        PatrolDetails
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
            topTabs: {//顶部业态
                //业态
                datas: [],
                code: "" //当前业态值
            },
            title: "添加任务类型",
            taskTabs: {//业态下的任务
                code: "0", //当前值
                datas: [
                    {
                        Id: "0",
                        Text: "电子管理",
                    },
                    {
                        Id: "1",
                        Text: "整改管理",
                    },
                ],
                currentCode: '0'//当前所在
            },
            tableGrid: [],
            tableGrid_refrom: [],
            tableGridId: '',
            pageNation: {//分页
                total: 0,
                pageNum: 1,//页数
                countPerPage: 20//每页数
            },
            pageNation_refrom: {//分页
                total: 0,
                pageNum: 1,//页数
                countPerPage: 20//每页数
            },
            businessName: '',
            centerDialogVisible: false,
            reformDetailDialog: {
                show: false,
                InspectOptionName: '',
                // ViolationPics:[],
                // ReformPics:[],
                OptionList: [],
                desc: '',
                reformTime: '',
                endTime: '',
                reformer: ''
            },
            partrolDetailsDialog: {
                show: false,
                // Name:'',
                // Address:'',
                // LocationName:'',
                // CommunityName:'',
                // InspectDate:'',
                // InspectType:'',
                // InspectUserName:'',
                // InspectResult:'',
                // ProcessResult:'',
                Content: {}
            },
            electronicInspectDialog: {
                show: false,
                pics: [],
                InspectUser: '',
                videos: '',
                InspectDate: '',
                StoreName: '',
                StoreAds: '',
                CheckResult: ''
            },
            electronicTable_loading: true,
            reformTable_loading: false,
            area: {},
            Rowcontentdetails:""
        }
    },
    created: function () {

    },
    methods: {
        startTimeChange(data){
          this.$utils.consoleObj(data);
          this.EndTime ='';
        },
        getHandType(type) {
            switch (type + "") {
                case "0":
                    return '不处理';
                case "1":
                    return '商家整改';
                case "2":
                    return '现场巡查';
                case "3":
                    return 'AI巡查';
                default:
                    break;

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
                    this.electronicInspectDialog.InspectDate = res.Data.SubDate;
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
        regionalismResult(area) {
            this.area = area;

        },
        initRegion(area) {
            this.$utils.consoleObj(area);
            this.area = area;
            this.getElectronicRecord();

        },
        //整改翻页
        onReformPageNation() {
            this.getReformList();
        },
        //电子翻页
        onPageNation() {
            this.getElectronicRecord();
        },
        getElectronicRecord() {

            /**
             *   "ReformStartTime": this.StartTime,
             "ReformEndTime": this.EndTime,
             "StoreName": this.storeName,
             "Province": this.area.provience.code.length>0?this.area.provience.code.split('-')[1]:this.area.provience.code,
             "City":  this.area.city.code.length>0?this.area.city.code.split('-')[1]:this.area.city.code,
             "Area":  this.area.town.code.length>0?this.area.town.code.split('-')[1]:this.area.town.code,
             "Street":  this.area.street.code,
             "Community": this.area.community.code,
             "PageIndex": this.pageNation_refrom.pageNum,
             "PageSize": this.pageNation_refrom.countPerPage,
             * @type {boolean}
             */
            this.electronicTable_loading = true;
            // let data ={
            //         "PageIndex": this.pageNation.pageNum,
            //         "PageSize": this.pageNation.countPerPage,
            //         "ByDays":0,
            //         "IsBackStage":true,
            //         "StoreName":this.storeName,
            //         "StreetCode":"",
            //         "DistrectCode":"",
            //         "StartTime":"",
            //         "EndTime":""
            //     };
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
        taskTabsClick(tab) {
            this.taskTabs.code = tab.name;
            if (this.taskTabs.code == 0) {
                this.getElectronicRecord();
            } else {
                this.getReformList();
            }

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
        getReformPics(str) {
            let arr = [];
            if (str == null || str.length == 0) {
                return arr;
            }else{
                if(str.indexOf(';')==-1){
                    arr.push(str);
                }else{
                    arr = arr.concat(str.split(";"))
                }
                return arr;
            }
        },
        Preservation() {
            if (this.businessName) {
                let data = {
                    "Id": this.tableGridId,
                    "StoreTypeId": this.topTabs.code,
                    "ProcessType": Number(this.taskTabs.code),
                    "Type": 1,
                    "Text": this.businessName
                };
                this.$api.SaveBasicOption(data).then(
                    res => {
                        if (res.IsSuccess) {
                            // this.tableGrid = [];
                            this.message("操作成功", 1);
                            this.centerDialogVisible = false;
                            this.getElectronicRecord();
                        } else {
                            this.message(res.Message, -1)
                        }
                    }
                )
            } else {
                this.message("名称不可为空", 2)
            }
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
            };
            this.$api.GetReformList(data).then(
                res => {
                    if (res.IsSuccess) {
                        this.tableGrid_refrom = res.Content;
                        this.pageNation_refrom.total = res.Data;
                    } else {
                        this.message(res.Message)
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
        modifyEById(rows) {
            this.centerDialogVisible = true;
            this.businessName = this.tableGrid[rows].Text;
            this.tableGridId = this.tableGrid[rows].Id;
            this.title = '修改任务类型';
        },
        //限制标题只能是汉字
        changeCode() {
            this.$nextTick(() => {
                if (this.businessName !== '') {
                    this.businessName = this.businessName.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g, '')
                }
            })
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

            // let data = {
            //     // "SubTaskId": this.Rowcontentdetails.Id,
            //     // "StoreId": this.Rowcontentdetails.StoreId,
            //     StoreId: row.StoreId,
            //     SubTaskId: row.Id
            // };
            // // this.$api.GetInspectEnforceTaskDetail(data).then(res=>{
            // this.$api.GetInspectTaskDetail(data).then(res => {
            //     this.partrolDetailsDialog.show = true;
            //     this.partrolDetailsDialog.Content = res.Content;
            // }).catch(r => {
            //
            // })
        }
    }
}