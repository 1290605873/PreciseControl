import Pagination from '@/components/Pagination'
export default {
    components: {
      Pagination
    },
    data() {
        let guidVerify = (rule, value, callback) => {
            let reg = new RegExp(/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/);
            if (!reg.test(value)) {
                callback(new Error('布局id格式不正确'));
            } else {
                callback()
            }
        };
        return {
            BCTYPE: '',//B端C端业态页签
            mapGroup:{
              show: false,
              name: '',
              activeGroup: '',
              currentId: '',
              groupNameList:[],
            },
            classificationFormatsLoading: true,
            dialogDeleteVisible: false,
            dialogAddAndEditMapNameVisible: false,
            //dialogMapNameConfigVisible: true,
            mapNameConfigTableListLoading: false,
            mapNameConfigurationData: [], // 表格数据列表
            pages:{
              total: 0,
              pageSize:20,
              pageNo:1
            },
            listRowId: "",
            deleteAndIsEnableType: 0,
            addAndEditName: "",
            layoutList: {},
            dataOriginList: [],
            addOrEditType: 0,
            addAndEditNameRuleForm: [],
            isShowSortSelectBox:false,  // 控制 筛选和排序弹窗
            addAndEditNameForm: {
                IsShowFeel: "",//是否显示感知范围 0：不显示 1：显示
                IsShowNotice: "",//是否显示地图消息提醒 0：不显示 1：显示
                IsShowCenter: 1,//地图中心点配置 0：不启用 1：启用
                CenterPosition: 1,//1：用户所在区域为中心点 2：App所属区域为中心点
                DisplaySensingRange:0, //显示感知范围
                MapDataTypeList: [],//数据源
                MapDataTypeList_bottom: [],//数据源
                DataSourceRangeSettings:0,
                mapNameValue: "",
                defalutImgValue: "",
                selectImgValue: "",
                initializationDataValue: "",
                anonymityValue: true,
                roleSetValue: [],
                mapConfigValue: "",
                mapTopLeftValue: false,
                mapTopLeftChangeValue: false,
                mapTopCenterValue: '1',
                mapTopCenterKeyWord:'请输入搜索关键字',
                mapTopRightValue: [],
                mapRightValue: [],
                mapRightValueImg:{},
                mapRightIdValue: "",
                mapBottomMainValue: false,
                mapBottomStoreTemValue: "",
                checkdialPlateValue: false, //选择表盘
                checkdialPlateRadioValue: "",//选择表盘
                mapLeftValue: true,
                //数据列表
                commitList:[], // 推荐列表选中
                nearStoreType:'',
                demoStreet: false, // 显示示范街

                isCouponUrl: false, // 显示消费券领取入口
                couponUrl: '', // 消费券链接
                couponImgUrl: '', // 消费券图片
                advertisement: [],  // 显示广告
                IsShowRecommend: false, // 显示推荐列表
                ClockIn:false,      // 显示打卡信息
                isShowDataPromptBox:false, // 显示数据提示框
                isBusiness:false,       // B端业务
                FilterList:[],          // 筛选条件
                SortSelectFood:[],      // 美食 筛选 排序
                GroupId:'',
                EntranceConfig:[]
            },
            SortSelectKeepValue:[],     // 配置筛选和排序 保存数据
            roleSetList: [],
            mapTopLeftChangeValueShow: false,
            checkdialPlateRadiodisabled: true,
            PopupMainMessageDisabled: true,
            mapRightIdValueShow: false,
            SeeRuleDatas: [],//地图筛选模板数据
            SeeRuleDatas_model: '',
            mapRightRuleShow: false,
            addAndEditNameRules: {
                mapNameValue: [
                    {required: true, message: '请输入地图名称', trigger: 'blur'},
                    {min: 1, max: 30, message: '地图名称限30个汉字', trigger: 'blur'}
                ],
                defalutImgValue: [
                    {required: true, message: '请添加默认缩略图', trigger: 'blur'}
                ],
                selectImgValue: [
                    {required: true, message: '请添加选中略图', trigger: 'blur'}
                ],
                MapDataTypeList: [
                    {required: true, message: '请选择数据源', trigger: 'blur'}
                ],
                mapRightIdValue: [
                    {required: true, message: '请输入ID', trigger: 'blur'},
                    {validator: guidVerify, trigger: 'blur'}
                ]
            },
            tabNum: 0,
            //业态
            dialogTypeOfOperationVisible: false,
            typeOfOperationType: 0,
            classificationFormatsData: [],
            classificationFormatsData_B: [],
            typeOfOperationSelectedList: [],

            selectedTypeOfOperation: [],
            dataOriginMapDataType: "",
            dataOriginDisabled: false,
            MapId:'',
            url:'',
            iframeShow:false,
            EditData:{},
            // 显示附近列表
            nearList:[
              {label:'团餐列表',value:1},
              {label:'消费券列表',value:2},
              {label:'优惠券列表',value:3},
              {label:'老字号门店列表',value:4}
            ]
        }
    },
    created() {
        // this.getAllMapData();
        this.getMapData();
        this.getRoloConfigList();
        this.ClassificationFormatsChange(1);
        this.getBrowserType();
        this.getMapTemplatAll();
        let that = this;
        window.getFromIframe = function(value,type) {
            if(type){that.iframeShow = false;}
        }
        this.getGroupList()
    },
    methods: {
        chooseOrign(v, d) {
          // if(v){
          //   this.addAndEditNameForm.MapDataTypeList_bottom.push(
          //     this.dataOriginList.find(i => i.Id == d)
          //   )
          // }else{
          //     let i = this.dataOriginList.findIndex(i => i.Id == d)
          //     this.addAndEditNameForm.MapDataTypeList_bottom.splice(i,1)
          // }
            //重组一个对应的数组
            this.addAndEditNameForm.MapDataTypeList_bottom = [];
            for (let ii of this.addAndEditNameForm.MapDataTypeList) {
                this.addAndEditNameForm.MapDataTypeList_bottom.push(
                    this.dataOriginList.find(item => item.MapDataType == ii)
                )
            }
        },
        getLableName(it) {
            return (this.dataOriginList.filter((item) => {
                return it == item.Id
            }))[0].Name;
        },
        //获取当前时间
        getTime() {
            let time = new Date();
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            let day = time.getDate();
            //let w=time.getDay(),wStr="日一二三四五六";
            //let week=wStr.charAt(w);
            let hours = time.getHours();
            let minutes = time.getMinutes();
            let seconds = time.getSeconds();
            return year + "-" + this.zero(month) + "-" + this.zero(day) + " " + this.zero(hours) + ":" + this.zero(minutes) + ":" + this.zero(seconds);
        },
        zero(str) {
            return str < 10 ? "0" + str : str;
        },
        //获取列表
        getAllMapData() {
          let d = {
            pageNo:this.pages.pageNo,
            pageSize:this.pages.pageSize
          }
            this.$api.GetAllMap(d).then(res => {
                if (res && res.IsSuccess) {
                    this.mapNameConfigurationData = res.Content;
                    this.total = res.Data
                }
                this.mapNameConfigTableListLoading = false;
            }).catch(r => {
            });
        },
        //删除
        deleteBtn(id) {
            this.listRowId = id;
            this.deleteAndIsEnableType = 2;
            this.dialogDeleteVisible = true;
        },
        //启用禁用
        isEnableChange(row) {
            this.listRowId = row.Id;
            this.deleteAndIsEnableType = row.IsEnable ? 0 : 1;
            this.isEnuableAndDelete()
        },
        isEnuableAndDelete() {
            let data = {
                "Id": this.listRowId,
                "Type": this.deleteAndIsEnableType
            }
            this.$api.ChangeIsEnuable(data).then(res => {
                if (res && res.IsSuccess) {
                    if (data.Type == 2) {
                        this.dialogDeleteVisible = false;
                    }
                    this.message(res.Message, 1)
                    // this.getAllMapData()
                    this.getMapList()
                } else {
                    this.message(res.Message, -1)
                }
            }).catch(r => {
            });
        },
        //区域可切换
        mapTopLeftAreaChange() {
            if (this.addAndEditNameForm.mapTopLeftValue) {
                this.mapTopLeftChangeValueShow = true
            } else {
                this.mapTopLeftChangeValueShow = false
            }
        },
        guid() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0,
                v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        },
        //添加地图名称
        addBtn() {
            this.MapId = this.guid();
            //添加数据之前需要清空 编辑的时候的给表单的赋值
            this.addAndEditNameForm.mapNameValue = "";
            this.addAndEditNameForm.defalutImgValue = "";
            this.addAndEditNameForm.selectImgValue = "";
            this.addAndEditNameForm.initializationDataValue = "";
            this.addAndEditNameForm.MapDataTypeList = [];
            this.addAndEditNameForm.anonymityValue = true;
            this.addAndEditNameForm.roleSetValue = [];
            this.addAndEditNameForm.mapConfigValue = "";
            this.addAndEditNameForm.mapTopLeftValue = false;
            this.addAndEditNameForm.mapTopCenterValue = '';
            this.addAndEditNameForm.mapTopRightValue = [];
            this.addAndEditNameForm.mapRightValue = [];
            this.addAndEditNameForm.mapRightValueImg = {};
            this.addAndEditNameForm.mapRightIdValue = "";
            this.addAndEditNameForm.mapBottomMainValue = false;
            this.addAndEditNameForm.mapBottomStoreTemValue = "";
            this.addAndEditNameForm.checkdialPlateValue = false;//选择表盘功能
            this.addAndEditNameForm.checkdialPlateRadioValue = "";//选择表盘功能
            this.addAndEditNameForm.commitList = []; //推荐列表选中项为空
            this.addAndEditNameForm.nearStoreType = ''; // 附近列表 选中类型
            this.addAndEditNameForm.demoStreet = false;
            this.addAndEditNameForm.ClockIn = false;

            this.addAndEditNameForm.DataSourceRangeSettings = 0;//数据源范围设置
            this.addAndEditNameForm.DisplaySensingRange = 0;//显示感知范围
            this.addAndEditNameForm.isShowDataPromptBox = false;//显示数据提示框

            this.typeOfOperationSelectedList; //地图初始化数据//业态分类
            this.SeeRuleDatas_model ='';
            this.addAndEditNameForm.IsShowFeel = false;
            this.addAndEditNameForm.IsShowNotice = false;
            this.addAndEditNameForm.IsShowCenter = 1;
            this.addAndEditNameForm.CenterPosition = 1;
            this.addAndEditNameForm.mapTopCenterKeyWord = "请输入搜索关键字";

            this.addAndEditNameForm.isCouponUrl = false;
            this.addAndEditNameForm.couponImgUrl = '';
            this.addAndEditNameForm.couponUrl = '';
            this.addAndEditNameForm.IsShowRecommend = false;
            this.addAndEditNameForm.advertisement = [];

            this.addAndEditNameForm.mapLeftValue = true;
            //打开表单、重置布局切换、清空listRowId
            this.dialogAddAndEditMapNameVisible = true;
            this.addAndEditName = "添加地图名称";
            this.addOrEditType = 0;
            this.listRowId = "00000000-0000-0000-0000-000000000000";
            this.mapRightIdValueShow = false; //添加的时候默认隐藏布局id
            //添加的时候业态类型为0
            this.typeOfOperationType = 0;
            this.typeOfOperationSelectedList = [];  //提交的时候
            this.selectedTypeOfOperation = [];   //回显的时候

            this.tabNum = 0;
            this.dataOriginMapDataType = '00000000-0000-0000-0000-000000000000';
            this.dataOriginDisabled = false;
            if(window.urlsPath.statisticsUrl.indexOf('&id=') > -1){
              let u = window.urlsPath.statisticsUrl.split('&id=')[1]
              window.urlsPath.statisticsUrl = window.urlsPath.statisticsUrl.split('&id=')[0] +'&id='+ this.guid() +'&'+ u.split('&')[1]
            }else{
              window.urlsPath.statisticsUrl = window.urlsPath.statisticsUrl + '&id=' + this.guid();
            }
            this.addAndEditNameForm.GroupId = this.mapGroup.groupNameList[0].Id
            this.addAndEditNameForm.EntranceConfig = []
            //初始布局信息（无需数据源 ，拿并集）
            this.getLayoutList();
        },
        //编辑地图名称
        editBtn(row) {
            console.log(row)
            this.EditData = this.$utils.deepCopy(row)
            this.dialogAddAndEditMapNameVisible = true;
            this.addAndEditName = "编辑地图名称";
            this.addOrEditType = 1;
            this.listRowId = row.Id;
            this.mapRightIdValueShow = false;
            this.mapTopLeftChangeValueShow = false;
            this.addAndEditNameForm.mapTopLeftChangeValue = false;
            this.BCTYPE = row.StoreTypeUI == 1 ? "0" : "1";
            //添加的时候业态类型为0
            this.typeOfOperationType = 1;
            this.selectedTypeOfOperation = Array.isArray(row.StoreTypeList) ? row.StoreTypeList : [];
            this.typeOfOperationSelectedList = Array.isArray(row.StoreTypeList) ? row.StoreTypeList : [];
            this.dataOriginMapDataType = row.MapDataType;
            this.getLayoutList();//根据编辑这一行的MapDataType,获取组件布局列表
            this.dataOriginDisabled = true;
            this.tabNum = 1;
            let topLeftShow = false;
            this.SeeRuleDatas_model = row.LayoutConfig.MapTemplateId;
            if (row.LayoutConfig.TopLeft.length != 0) {
                topLeftShow = true;
                this.mapTopLeftChangeValueShow = true;
                if (row.LayoutConfig.TopLeft[0].Id == 2) {
                    this.addAndEditNameForm.mapTopLeftChangeValue = true
                }
            } else {
                topLeftShow = false;
                this.mapTopLeftChangeValueShow = false;
                this.addAndEditNameForm.mapTopLeftChangeValue = false
            }
            let topCenterShow = [];
            if (row.LayoutConfig.TopCenter.length != 0) {
                topCenterShow = row.LayoutConfig.TopCenter[0].Id;
                let o = row.LayoutConfig.TopCenter.find(i => i.Id == 1)
                this.addAndEditNameForm.mapTopCenterKeyWord = o == undefined ? '请输入搜索关键字' : (o.Code == "" || o.Code == null) ? '请输入搜索关键字' : o.Code
            }

            let topRightShow = [];
            if (row.LayoutConfig.TopRight.length != 0) {
                for (let item of row.LayoutConfig.TopRight) {
                    topRightShow.push(item.Name)
                    if(item.Id != 4){
                        this.addAndEditNameForm.isBusiness = true
                    }
                }
            }
            let middleRightShow = [];
            let middleRightImg = {};
            if (row.LayoutConfig.MiddleRight.length != 0) {
                for (let item of row.LayoutConfig.MiddleRight) {
                    if (item.Id == "3") {
                        this.mapRightIdValueShow = true
                    }
                    if (item.Id == "2") {
                        this.mapRightRuleShow = true
                    }
                    middleRightShow.push(item.Id)
                    // middleRightImg.push({
                    //     'Code':Number(item.Code),
                    //     'ImgUrl':item.ImgUrl
                    // })
                    // middleRightImg.Code = item.Code;
                }
                // middleRightImg.ImgUrl = item.ImgUrl;
                row.LayoutConfig.MiddleRight.forEach(item => {
                    if(item.Id == '1'){
                        this.addAndEditNameForm.mapRightValueImg.Code = item.Code;
                        this.addAndEditNameForm.mapRightValueImg.ImgUrl = item.ImgUrl;
                    }
                })
            }
            let bottomThemeVal = false;
            let bottomThemeShow = "";
            if (row.LayoutConfig.Bottom[0].Theme != null && row.LayoutConfig.Bottom[0].Theme != undefined) {
                if (row.LayoutConfig.Bottom[0].Theme.length != 0) {
                    this.PopupMainMessageDisabled = false;
                    bottomThemeShow = row.LayoutConfig.Bottom[0].Theme[0].Name;
                    bottomThemeVal = true;
                    for (let ii of row.LayoutConfig.Bottom[0].Theme) {
                        // ii.Name = ii.MapDataTypeName;
                        this.$set(ii, "Name", ii.MapDataTypeName);
                        // ii.template_bottom = ii.Id;
                        this.$set(ii, "template_bottom", ii.Id);
                        if (ii.Id.length > 0) {
                            // ii.checkedPop = true;
                            this.$set(ii, "checkedPop", true);
                        } else {
                            // ii.checkedPop = false;
                            this.$set(ii, "checkedPop", false);
                        }
                    }
                    this.addAndEditNameForm.MapDataTypeList_bottom = row.LayoutConfig.Bottom[0].Theme;
                } else {
                    bottomThemeVal = false
                }
            }

            let bottomClockDialVal = false;
            let bottomClockDialShow = "";
            if (row.LayoutConfig.Bottom[0].ClockDial != null && row.LayoutConfig.Bottom[0].ClockDial != undefined) {
                if (row.LayoutConfig.Bottom[0].ClockDial.length != 0) {

                    this.checkdialPlateRadiodisabled = false;
                    bottomClockDialShow = row.LayoutConfig.Bottom[0].ClockDial[0].Id;
                    bottomClockDialVal = true;
                } else {
                    bottomClockDialVal = false;
                }
            }
            let bottomIsShowStore = false;
            let bottomCommitList = [];
            let bottomNearStoreType = '';
            let bottomDemoStreet = row.LayoutConfig.Bottom[0].DemoStreet == null ? false : true
            let bottomClockIn= row.LayoutConfig.Bottom[0].ClockIn == null ? false : true

            if(row.LayoutConfig.Bottom[0].ShowStoreList && row.LayoutConfig.Bottom[0].ShowStoreList.length>0){
                bottomIsShowStore = true
                bottomCommitList = row.LayoutConfig.Bottom[0].ShowStoreList.map(i => {
                 if(i.ListType == 2){bottomNearStoreType = i.StoreListType}
                 return String(i.ListType)
                })
            }

            if(row.LayoutConfig.Bottom[0].ShowStore != null && row.LayoutConfig.Bottom[0].ShowStore != undefined){
            }
            let StoreTypeListArr = [];
            if (row.StoreTypeList != [] && row.StoreTypeList != "" && row.StoreTypeList != undefined && row.StoreTypeList != null) {
                for (let item of row.StoreTypeList) {
                    if (item.ParentTypeId != '00000000-0000-0000-0000-000000000000') {
                        StoreTypeListArr.push(item)
                    }
                }
            }

            // 配置筛选和排序 反选
            if(row.LayoutConfig.Bottom[0].FilterList){
                let data = row.LayoutConfig.Bottom[0].FilterList || []
                if(data.length){
                    this.addAndEditNameForm.SortSelectFood = data.map(v => {
                        if(v.Identify == "FILTER"){
                            this.addAndEditNameForm.FilterList = v.FilterList.map(list => list.Identify)
                        }else{
                            this.addAndEditNameForm.FilterList = []
                        }
                        return v.Identify
                    })
                }else{
                    this.addAndEditNameForm.SortSelectFood = []
                    this.addAndEditNameForm.FilterList = []
                }

            }

            this.addAndEditNameForm.mapNameValue = row.Name;
            this.addAndEditNameForm.defalutImgValue = row.ImgUrl;
            this.addAndEditNameForm.selectImgValue = row.SelectImgUrl;
            this.addAndEditNameForm.initializationDataValue = (row.StoreTypeList == null|| row.StoreTypeList.length == 0)? '' : '已选择' + StoreTypeListArr.length + '种业态';//需要修改 有可能返回来的是空null
            this.addAndEditNameForm.MapDataTypeList = row.mapDataName == null ? '' : row.MapDataTypeList;
            this.addAndEditNameForm.anonymityValue = row.IsAnonymity;
            this.addAndEditNameForm.roleSetValue = (row.RoleConfig == "" || row.RoleConfig == null || row.RoleConfig == undefined) ? [] : row.RoleConfig.split(",").map(Number);  //角色配置
            this.addAndEditNameForm.mapConfigValue = row.Remark;
            this.addAndEditNameForm.mapTopLeftValue = topLeftShow;
            this.addAndEditNameForm.mapTopCenterValue = topCenterShow;
            this.addAndEditNameForm.mapTopRightValue = topRightShow;
            this.addAndEditNameForm.mapRightValue = middleRightShow;
            // this.addAndEditNameForm.mapRightValueImg = middleRightImg;
            this.addAndEditNameForm.mapRightIdValue = row.LayoutConfig.LayoutId;
            this.addAndEditNameForm.mapBottomMainValue = bottomThemeVal;
            this.addAndEditNameForm.mapBottomStoreTemValue = bottomThemeShow;
            this.addAndEditNameForm.checkdialPlateValue = bottomClockDialVal;//选择表盘
            this.addAndEditNameForm.checkdialPlateRadioValue = bottomClockDialShow;//选择表盘
            this.addAndEditNameForm.mapLeftValue = row.LayoutConfig.MiddleLeft[0].Id == 1 ? true : false;
            this.addAndEditNameForm.IsShowFeel = row.IsShowFeel;
            this.addAndEditNameForm.IsShowNotice = row.IsShowNotice;
            this.addAndEditNameForm.IsShowCenter = row.IsShowCenter;
            this.addAndEditNameForm.CenterPosition = row.CenterPosition;
            this.addAndEditNameForm.DataSourceRangeSettings = row.MapDataRange;         //数据源范围
            this.addAndEditNameForm.DisplaySensingRange =
            row.FeelRange == 21 ? 2 : row.FeelRange;                //显示感知范围
            this.addAndEditNameForm.isShowDataPromptBox =
            row.FeelRange == 21 ? true : false;                //显示感知范围

            if(window.urlsPath.statisticsUrl.indexOf('&id=') > -1){
              let u = window.urlsPath.statisticsUrl.split('&id=')[1]
              window.urlsPath.statisticsUrl = window.urlsPath.statisticsUrl.split('&id=')[0] +'&id='+ row.Id +'&'+ u.split('&')[1]
            }else{
              window.urlsPath.statisticsUrl = window.urlsPath.statisticsUrl + '&id=' + row.Id
            }

            console.log(window.urlsPath.statisticsUrl)

            this.addAndEditNameForm.IsShowRecommend = bottomIsShowStore;       //显示数据列表
            this.addAndEditNameForm.commitList = bottomCommitList;  // 数据列表选中数组
            this.addAndEditNameForm.nearStoreType = bottomNearStoreType; // 数据列表选中的附近列表
            this.addAndEditNameForm.demoStreet = bottomDemoStreet;  // 示范街
            this.addAndEditNameForm.ClockIn = bottomClockIn;  // 显示人员信息

            this.addAndEditNameForm.isCouponUrl = row.IsShowConsumeTicket;     //显示消费券领取入口
            this.addAndEditNameForm.couponUrl = row.ConsumeTicketLink;      //消费券链接
            this.addAndEditNameForm.couponImgUrl = row.ConsumeTicketImg;      //消费券图片
            row.IsShowScreenAd && this.addAndEditNameForm.advertisement.push('1')
            row.IsShowPatchAd && this.addAndEditNameForm.advertisement.push('2')
            this.addAndEditNameForm.GroupId = row.GroupId
            this.addAndEditNameForm.EntranceConfig =row.EntranceConfig != null ? row.EntranceConfig.split(',').filter(i => i != '') : []
            this.reShowTypeB();
            this.reShowTypeC();
        },

        //获取布局列表
        getLayoutList() {

            let data = {
                // 'mapDataType':this.dataOriginMapDataType
            };
            this.$api.GetAllLayoutList(data).then(res => {
                if (res && res.IsSuccess) {
                    this.layoutList = res.Content;

                    // try {
                    //     this.recommendList = this.layoutList.Bottom[0].ShowStoreList
                    // } catch (error) {
                    //     console.error(error);

                    // }
                }
            }).catch(r => {});
        },
        getMapTemplatAll() {
            this.$api.GetMapTemplatAll({}).then(res => {
                if (res && res.IsSuccess) {
                    this.SeeRuleDatas = res.Content;
                }
            }).catch(res => {})
        },
        //获取数据源
        getMapData() {
            this.$api.GetMapData({MapDataType: -1}).then(res => {
                if (res && res.IsSuccess) {
                    // this.dataOriginList = res.Content;
                    for (let i of res.Content) {
                        i.checkedPop = false;//主体弹窗复选框
                        i.template_bottom = '';//底部模板
                        this.dataOriginList.push(i);
                    }
                }
            }).catch(r => {});
        },
        //数据源切换事件
        dataOriginChange(val) {
            this.dataOriginMapDataType = val;
            this.tabNum = 0;
            this.addAndEditNameForm.mapTopLeftValue = false;
            this.addAndEditNameForm.mapTopLeftChangeValue = false;
            this.addAndEditNameForm.mapTopCenterValue = '';
            this.addAndEditNameForm.mapTopRightValue = [];
            this.addAndEditNameForm.mapRightValue = [];
            this.addAndEditNameForm.mapRightValueImg = {};
            this.addAndEditNameForm.mapRightIdValue = "";
            this.addAndEditNameForm.mapBottomMainValue = false;
            this.addAndEditNameForm.mapBottomStoreTemValue = "";
            this.addAndEditNameForm.checkdialPlateValue = false;//选择表盘功能
            this.addAndEditNameForm.checkdialPlateRadioValue = "";//选择表盘功能
            this.addAndEditNameForm.mapLeftValue = true;
            this.mapTopLeftChangeValueShow = false;
            this.mapRightIdValueShow = false;
            this.checkdialPlateRadiodisabled = true;
            this.PopupMainMessageDisabled = true;
            //获取布局列表
            this.getLayoutList();
        },
        //添加地图名称提交
        submitAddAndEditNameForm(formName) {

            this.$refs[formName].validate((valid) => {

                if (this.addAndEditNameForm.mapRightValue.toString().indexOf('地图导航') > -1) {
                    if (this.addAndEditNameForm.mapRightIdValue == "" || this.addAndEditNameForm.mapRightIdValue == undefined || this.addAndEditNameForm.mapRightIdValue == null) {
                        this.message("请输入地图显示组件右侧-地图导航里的布局ID", 2);
                        return;
                    }
                    let reg = new RegExp(/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/);
                    if (!reg.test(this.addAndEditNameForm.mapRightIdValue)) {
                        this.message("地图显示组件右侧-地图导航里的布局id格式不正确", 2);
                        return;
                    }
                }
                // if (this.addAndEditNameForm.mapBottomMainValue) {
                //     if (this.addAndEditNameForm.mapBottomStoreTemValue == "" || this.addAndEditNameForm.mapBottomStoreTemValue == null || this.addAndEditNameForm.mapBottomStoreTemValue == undefined) {
                //         this.message("请选择地图显示组件底部的-底部门店模板", 2);
                //         return;
                //     }
                // }
                /*表盘*/
                if (this.addAndEditNameForm.checkdialPlateValue) {
                    if (this.addAndEditNameForm.checkdialPlateRadioValue == "" || this.addAndEditNameForm.checkdialPlateRadioValue == null || this.addAndEditNameForm.checkdialPlateRadioValue == undefined) {
                        this.message("请选择地图显示组件底部的-弹出表盘", 2);
                        return;
                    }
                }
                // 显示消费券链接
                if (this.addAndEditNameForm.isCouponUrl) {
                    if (this.addAndEditNameForm.couponUrl == "" || this.addAndEditNameForm.couponImgUrl == '') {
                        this.message("请输入消费券链接", 2);
                        return;
                    }
                }

    //   if(this.addAndEditNameForm.IsShowCenter && this.addAndEditNameForm.CenterPosition == ''){
    //     this.message('请选择地图中心点',2);
    //     return
    //   }
                if (valid) {
                    let leftTopSelect = [];
                    if (this.addAndEditNameForm.mapTopLeftValue) {
                        leftTopSelect = [{
                            "Id": 1,
                            "Name": '区域'
                        }];
                        if (this.addAndEditNameForm.mapTopLeftChangeValue) {
                            leftTopSelect = [{
                                "Id": 2,
                                "Name": '区域可切换'
                            }]
                        }
                    }
                    /*
                    if (this.addAndEditNameForm.mapTopLeftValue.length != 0) {
                        for (let val of this.addAndEditNameForm.mapTopLeftValue) {
                            for (let item of this.layoutList.TopLeft) {
                                if (val == item.Name) {
                                    leftTopSelect.push({
                                        "Id": item.Id,
                                        "Name": item.Name
                                    })
                                    break;
                                }
                            }
                        }
                    }*/

                    let topCenterSelect = [];
                    if (this.addAndEditNameForm.mapTopCenterValue != "" && this.addAndEditNameForm.mapTopCenterValue != undefined && this.addAndEditNameForm.mapTopCenterValue != null) {
                        for (let item of this.layoutList.TopCenter) {
                            if (this.addAndEditNameForm.mapTopCenterValue == item.Id) {
                                if(item.Id == 1){
                                    item.Code = this.addAndEditNameForm.mapTopCenterKeyWord == "" ? "请输入搜索关键字" : this.addAndEditNameForm.mapTopCenterKeyWord
                                }
                                topCenterSelect.push(item)
                                break;
                            }
                        }
                        
                    }
                    let topRightSelect = [];
                    if (this.addAndEditNameForm.mapTopRightValue.length != 0) {
                        for (let val of this.addAndEditNameForm.mapTopRightValue) {
                            for (let item of this.layoutList.TopRight) {
                                if (val == item.Name) {
                                    topRightSelect.push({
                                        "Id": item.Id,
                                        "Name": item.Name
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    let middleRightSelect = [];
                    if (this.addAndEditNameForm.mapRightValue.length != 0) {
                        for (let val of this.addAndEditNameForm.mapRightValue) {
                            for (let item of this.layoutList.MiddleRight) {
                                if (val == item.Id) {
                                    middleRightSelect.push({
                                        "Id": item.Id,
                                        "Name": item.Name,
                                        // "Code":item.Code,
                                        // "ImgUrl":item.ImgUrl
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    if(this.addAndEditNameForm.mapRightValueImg){
                        middleRightSelect.forEach(item => {
                            if(item.Id == '1'){
                                item.Code = this.addAndEditNameForm.mapRightValueImg.Code;
                                item.ImgUrl = this.addAndEditNameForm.mapRightValueImg.ImgUrl;
                            }
                        })
                        // middleRightSelect[0].Code = this.addAndEditNameForm.mapRightValueImg.Code;
                        // middleRightSelect[0].ImgUrl = this.addAndEditNameForm.mapRightValueImg.ImgUrl;
                    }
                    let bottomSelect = [
                        {
                            "Theme": [],
                            "ClockDial": [],
                            "ShowStore":{},
                            "ShowStoreList":[],
                            "DemoStreet": null,
                            "ClockIn":null,
                            "FilterList":null
                        }
                    ];
                    //组织底部数据
                    if (this.addAndEditNameForm.MapDataTypeList.length > 0) {//数据源有数据
                        if (this.addAndEditNameForm.MapDataTypeList_bottom.length > 0) {
                            for (let kk of this.addAndEditNameForm.MapDataTypeList_bottom) {

                                if(kk.checkedPop&&(kk.template_bottom==null||kk.template_bottom=="")){
                                    this.message("请选择底部门店模板",2);
                                    return;
                                }

                                bottomSelect[0].Theme.push({
                                    Id: kk.template_bottom,//模板Id
                                    Name: (this.layoutList.Bottom[0].Theme.filter((item) => {
                                        return item.Id = kk.template_bottom
                                    })).Name,//模板名称
                                    Code: '',
                                    ImgUrl: '',
                                    MapDataType: kk.MapDataType,//数据源
                                    MapDataTypeName: kk.Name//数据源名称
                                })
                            }
                        }
                    }

                    /*选择表盘功能  */
                    if (this.addAndEditNameForm.checkdialPlateValue) {
                        if (this.addAndEditNameForm.checkdialPlateRadioValue != "" && this.addAndEditNameForm.checkdialPlateRadioValue != null && this.addAndEditNameForm.checkdialPlateRadioValue != undefined) {
                            for (let item of this.layoutList.Bottom[0].ClockDial) {
                                if (item.Id == this.addAndEditNameForm.checkdialPlateRadioValue) {
                                    bottomSelect[0].ClockDial.push({
                                        "Id": item.Id,
                                        "Name": item.Name
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    /*选择数据列表 */
                    if(this.addAndEditNameForm.IsShowRecommend){
                        let t = this.addAndEditNameForm.commitList
                        if(t.length<1){
                            bottomSelect[0].ShowStoreList = []
                        }else{
                            bottomSelect[0].ShowStoreList = t.map(i => {
                                let tempobj = {}
                                if(i == 1){
                                    tempobj = {
                                        Name: '推荐餐厅',
                                        ListType:1,
                                        StoreListType: 0,
                                        IsShowStore: 1
                                    }
                                }
                                if(i == 2){
                                    tempobj = {
                                        Name: '附近餐厅',
                                        ListType:2,
                                        StoreListType: 0,
                                        IsShowStore: 0
                                    }
                                }
                                return tempobj
                            })
                            console.log(bottomSelect[0].ShowStoreList)
                        }
                    }
                    /*选择示范街 */
                    if(this.addAndEditNameForm.demoStreet){
                        bottomSelect[0].DemoStreet = {
                            Id: 1,
                            Name: '显示示范街'
                        }
                    }
                    /*选择人员信息列表*/
                    if(this.addAndEditNameForm.ClockIn){
                        bottomSelect[0].ClockIn = {
                            Id: 1,
                            Name: '是否显示打卡位置'
                        }
                    }
                    /*配置筛选和排序*/
                    bottomSelect[0].FilterList = this.SortSelectKeepValue

                    !this.addAndEditNameForm.IsShowFeel && (this.addAndEditNameForm.DisplaySensingRange = 0)
                    let data = {
                        "Id": this.listRowId,
                        "Name": this.addAndEditNameForm.mapNameValue,
                        "MapDataTypeList": this.addAndEditNameForm.MapDataTypeList,
                        "ImgUrl": this.addAndEditNameForm.defalutImgValue,
                        "SelectImgUrl": this.addAndEditNameForm.selectImgValue,
                        "IsAnonymity": this.addAndEditNameForm.anonymityValue,
                        "RoleConfig": this.addAndEditNameForm.roleSetValue == [] ? "" : this.addAndEditNameForm.roleSetValue.join(","),//角色配置
                        "Remark": this.addAndEditNameForm.mapConfigValue,
                        "IsEnable": true,
                        "LayoutConfig": {
                            "Id": "00000000-0000-0000-0000-000000000000",
                            "MiddleLeft": [
                                {
                                    "Id": this.addAndEditNameForm.mapLeftValue ? "1" : "0",
                                    "Name": "显示消息"
                                }
                            ],
                            "TopLeft": leftTopSelect,
                            "TopCenter": topCenterSelect,
                            "TopRight": topRightSelect,
                            "MiddleRight": middleRightSelect,
                            "LayoutId": this.addAndEditNameForm.mapRightIdValue,
                            "Bottom": bottomSelect,
                            "MapTemplateId": this.SeeRuleDatas_model
                        },
                        "SubBy": this.$utils.getUrlKey("userId"),//userId
                        "SubTime": this.getTime(),   //2019-08-28T05:45:35.853Z
                        "Type": this.addOrEditType,//0添加  1编辑
                        "TypeOfOperation": this.typeOfOperationSelectedList, //地图初始化数据//业态分类
                        "IsShowFeel": this.addAndEditNameForm.IsShowFeel,
                        "IsShowNotice": this.addAndEditNameForm.IsShowNotice,
                        "IsShowCenter": this.addAndEditNameForm.IsShowCenter ? 1 : 0,
                        "CenterPosition": this.addAndEditNameForm.CenterPosition,

                        "StoreTypeUI": this.BCTYPE == "0" ? 1 : 2,
                        "MapDataRange":this.addAndEditNameForm.DataSourceRangeSettings,
                        FeelRange:this.addAndEditNameForm.DisplaySensingRange != 2 ? this.addAndEditNameForm.DisplaySensingRange : this.addAndEditNameForm.isShowDataPromptBox ? 21 : this.addAndEditNameForm.DisplaySensingRange,
                        IsShowConsumeTicket: this.addAndEditNameForm.isCouponUrl, // 是否显示消费券
                        ConsumeTicketLink: this.addAndEditNameForm.couponUrl,	// 消费券链接
                        ConsumeTicketImg: this.addAndEditNameForm.couponImgUrl,	 //消费券图片
                        IsShowScreenAd: this.addAndEditNameForm.advertisement.indexOf('1')>-1 ? true : false,	// 是否显示插屏广告
                        IsShowPatchAd: this.addAndEditNameForm.advertisement.indexOf('2')>-1 ? true : false,	//是否显示贴片广告
                        GroupId: this.addAndEditNameForm.GroupId,
                        EntranceConfig: this.addAndEditNameForm.EntranceConfig.join()
                    };
                    // console.log(JSON.stringify(data, null, 2));
                    this.$api.MapNameConfigurationAdd(data).then(res => {
                        if (res && res.IsSuccess) {
                            this.message(res.Message, 1);
                            this.dialogAddAndEditMapNameVisible = false;
                            this.pages.pageNo = 1
                            // this.getAllMapData()
                            this.getMapList()
                        } else {
                            this.message(res.Message, -1)
                        }
                    }).catch(r => {});
                }
            });
        },
        //取消/关闭  添加地图名称弹框
        cancelAddAndEditNameForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogAddAndEditMapNameVisible = false;
            this.checkdialPlateRadiodisabled = true;
            this.mapTopLeftChangeValueShow = false;
            this.addAndEditNameForm.mapTopLeftChangeValue = false;
            this.tabNum = 1
        },
        //地图显示组件里的tab
        tabChange(num) {
            this.tabNum = num;
        },
        //弹出主体信息
        popupMainMessage(val, it) {
            if (!val) {
                it.template_bottom = "";
            }
        },
        // 地图底部 仪表盘 数据列表 示范街改变后数据重置
        mapBottomChange(v,it){
            // 1、弹出主体信息，示范街
            if(v == 1){
                if(it){
                    if(!it.checkedPop){
                        it.template_bottom = ''
                    }
                }
                // 数据列表重置 子项禁用
                // this.addAndEditNameForm.IsShowRecommend = false
                // this.addAndEditNameForm.commitList = []
                // this.addAndEditNameForm.nearStoreType = '';
                // 示范街重置
                // this.addAndEditNameForm.demoStreet = false;
                // 仪表盘子项启用
                // this.checkdialPlateRadiodisabled = false;
                // if(!this.addAndEditNameForm.checkdialPlateValue){
                //     this.addAndEditNameForm.checkdialPlateRadioValue = "";
                // }
            }
            // 2、弹出表盘
            if(v == 2){
                // 数据列表禁用
                this.addAndEditNameForm.IsShowRecommend = false
                // 数据列表子项禁用
                if(!this.addAndEditNameForm.IsShowRecommend){
                    this.addAndEditNameForm.commitList = []
                    this.addAndEditNameForm.nearStoreType = '';
                }
                // 仪表盘取消-子项 重置 禁用
                if(!this.addAndEditNameForm.checkdialPlateValue){
                    this.addAndEditNameForm.checkdialPlateRadioValue = ''
                }
                // // 仪表盘与数据源 重置
                // this.checkdialPlateRadiodisabled = true; // 仪表盘与数据源状态禁用
                // this.addAndEditNameForm.MapDataTypeList_bottom = this.addAndEditNameForm.MapDataTypeList_bottom.map(i => {
                //   i.checkedPop = false
                //   i.template_bottom = ''
                //   return i
                // })
                // this.addAndEditNameForm.checkdialPlateValue = false // 仪表盘清空
                // this.addAndEditNameForm.checkdialPlateRadioValue = ""; // 仪表盘子项清空
                // // 示范街重置
                // this.addAndEditNameForm.demoStreet = false;

            }
            // 3、显示数据列表
            if(v == 3){
                // 表盘禁用
                this.addAndEditNameForm.checkdialPlateValue = false
                // 表盘子项禁用
                this.addAndEditNameForm.checkdialPlateRadioValue = ''
                // 显示数据列表取消-子项 重置 禁用
                if(!this.addAndEditNameForm.IsShowRecommend){
                    this.addAndEditNameForm.commitList = []
                    this.addAndEditNameForm.nearStoreType = '';
                }
            //   // 仪表盘与数据源 重置
            //   this.checkdialPlateRadiodisabled = true; // 仪表盘与数据源状态禁用
            //   this.addAndEditNameForm.MapDataTypeList_bottom = this.addAndEditNameForm.MapDataTypeList_bottom.map(i => {
            //     i.checkedPop = false
            //     i.template_bottom = ''
            //     return i
            //   })
            //   this.addAndEditNameForm.checkdialPlateValue = false // 仪表盘清空
            //   this.addAndEditNameForm.checkdialPlateRadioValue = ""; // 仪表盘子项清空
            //     // 数据列表重置 子项禁用
            //     this.addAndEditNameForm.IsShowRecommend = false
            //     this.addAndEditNameForm.commitList = []
            //     this.addAndEditNameForm.nearStoreType = '';
            }
        },
        // 配置筛选和排序
        sortSelectFoodChange(val){
            if(val.indexOf('FILTER') == -1){
                this.addAndEditNameForm.FilterList = []
            }
        },
        // 配置筛选和排序 保存
        sortSelectFoodKeepHandler(){
            let sortSelectFoodValue = JSON.parse(JSON.stringify(this.layoutList.Bottom[0].FilterList))
            let data = sortSelectFoodValue.filter(v => {
                if(v.Identify == "FILTER"){
                    let list = v.FilterList.filter(list => {
                        return this.addAndEditNameForm.FilterList.indexOf(list.Identify) != -1
                    })
                    v.FilterList = list
                }
                return this.addAndEditNameForm.SortSelectFood.indexOf(v.Identify) != -1
            })
            if(data.length){
                for(let i = 0; i < data.length; i++){
                    if(data[i].Identify == 'FILTER'){
                        if(!data[i].FilterList || !data[i].FilterList.length){
                            this.$message.warning('至少选择一项筛选条件！')
                            return;
                        }
                    }
                }
            }
            this.SortSelectKeepValue = data
            this.isShowSortSelectBox = false

        },

        //地图右侧 输入ID
        mapRightChange(val) {
            if (this.addAndEditNameForm.mapRightValue.indexOf("3") >= 0) {
                this.mapRightIdValueShow = true;
            } else {
                this.mapRightIdValueShow = false;
                this.addAndEditNameForm.mapRightIdValue = "";
            }
            if (this.addAndEditNameForm.mapRightValue.indexOf("2") >= 0) {
                this.mapRightRuleShow = true;
            } else {
                this.mapRightRuleShow = false;
                this.SeeRuleDatas_model = "";
            }
        },
        checkAddType(){
            this.$forceUpdate();
        },
        // 地图顶部左侧
        mapTopRightChange(val){
            if(val.indexOf('用户积分') > -1){
                this.addAndEditNameForm.isBusiness = false
                this.addAndEditNameForm.mapTopRightValue = ["用户积分"]
            }
        },

        //上传图片
        defaultPicUpload(obj) {
            let fd = new FormData();
            fd.append('upload', obj.file);
            this.$api.UploadFile(fd).then(res => {
                if (res.data.IsSuccess) {
                    this.addAndEditNameForm.defalutImgValue = res.data.Detail;
                    this.message('上传成功', 1)
                } else {
                    this.message('上传失败', -1)
                }
            }).catch(error => {

            })
        },
        selectPicUpload(obj) {
            let fd = new FormData();
            fd.append('upload', obj.file);
            this.$api.UploadFile(fd).then(res => {
                if (res.data.IsSuccess) {
                    this.addAndEditNameForm.selectImgValue = res.data.Detail;
                    this.message('上传成功', 1)
                } else {
                    this.message('上传失败', -1)
                }
            }).catch(error => {

            })
        },
        couponPicUpload (obj) {
            let fd = new FormData();
            fd.append('upload', obj.file);
            this.$api.UploadFile(fd).then(res => {
                if (res.data.IsSuccess) {
                    this.addAndEditNameForm.couponImgUrl = res.data.Detail;
                    this.message('上传成功', 1)
                } else {
                    this.message('上传失败', -1)
                }
            }).catch(error => {

            })
        },
        mapRightImgUpload (obj) {
            let fd = new FormData();
            fd.append('upload', obj.file);
            this.$api.UploadFile(fd).then(res => {
                if (res.data.IsSuccess) {
                    this.addAndEditNameForm.mapRightValueImg.ImgUrl = res.data.Detail;
                    this.$forceUpdate();
                    this.message('上传成功', 1)
                } else {
                    this.message('上传失败', -1)
                }
            }).catch(error => {

            })
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/jpg';
            const isGIF = file.type === 'image/gif';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isJPG && !isJPG2 && !isGIF && !isPNG) {
                this.message('图片格式：jpg，jpeg，gif，png', -1);
            }
            if (!isLt2M) {
                this.message('上传头像图片大小不能超过 1MB!', -1);
            }
            return (isJPG || isJPG2 || isGIF || isPNG) && isLt2M;
        },
        openTypeDialog() {
            this.dialogTypeOfOperationVisible = true;
            if (this.addAndEditNameForm.initializationDataValue == "") {//没有选择数据
                this.BCTYPE = "0";
                this.clearTypeC();
                this.clearTypeB();
            }
        },
        clearTypeC() {
            for (let item of this.classificationFormatsData) {
                this.$set(item, 'checkAllTypeOfValue', false);
                this.$set(item, 'isIndeterminate', false);
                this.$set(item, 'checkedTypeOfArr', []);
                this.$set(item, 'TypeOfData', item.GetMapSecondary);
            }
        },
        reShowTypeC() {
            if (this.BCTYPE == "0") {
                //获取所有业态成功后 如果有已选中的数据开始回显
                if (this.selectedTypeOfOperation != [] && this.selectedTypeOfOperation.length != 0) {
                    for (let item of this.classificationFormatsData) {
                        item.checkedTypeOfArr = [];//先清空里边的数据
                        for (let selectedItem of this.selectedTypeOfOperation) {
                            if (item.StoreTypeId == selectedItem.ParentTypeId) {
                                item.checkedTypeOfArr.push(selectedItem.StoreTypeName)
                            }
                        }
                        if(item.TypeOfData.length > 0){

                            item.checkAllTypeOfValue = item.checkedTypeOfArr.length === item.TypeOfData.length;
                        }
                        item.isIndeterminate = item.checkedTypeOfArr.length > 0 && item.checkedTypeOfArr.length < item.TypeOfData.length;
                    }
                }
                this.clearTypeB();
            }

        },
        //业态
        //获取所有业态
        ClassificationFormatsChange(type) {
            this.$api.GetAllStoreType({storeTypeUI: type}).then(res => {
                if (res && res.IsSuccess) {
                    this.classificationFormatsData = res.Content;
                    this.classificationFormatsLoading = false;
                    this.clearTypeC();
                }
            }).catch(r => {
                this.classificationFormatsLoading = false;
                this.message("获取数据失败", 2);
            });
        },
        clearTypeB() {
            for (let item of this.classificationFormatsData_B) {
                this.$set(item, 'checkAllTypeOfValue', false);
                this.$set(item, 'isIndeterminate', false);
                this.$set(item, 'checkedTypeOfArr', []);
                this.$set(item, 'TypeOfData', item.GetMapSecondary);
            }
        },
        reShowTypeB() {
            if (this.BCTYPE == "1") {
                //获取所有业态成功后 如果有已选中的数据开始回显
                if (this.selectedTypeOfOperation != [] && this.selectedTypeOfOperation.length != 0) {
                    for (let item of this.classificationFormatsData_B) {
                        item.checkedTypeOfArr = [] //先清空里边的数据
                        for (let selectedItem of this.selectedTypeOfOperation) {
                            if (item.StoreTypeId == selectedItem.ParentTypeId) {
                                item.checkedTypeOfArr.push(selectedItem.StoreTypeName)
                            }
                        }
                        if(item.TypeOfData.length > 0){

                            item.checkAllTypeOfValue = item.checkedTypeOfArr.length === item.TypeOfData.length;
                        }
                        item.isIndeterminate = item.checkedTypeOfArr.length > 0 && item.checkedTypeOfArr.length < item.TypeOfData.length;
                    }
                }
                this.clearTypeC();
            }

        },
        getBrowserType() {
            this.$api.GetAllStoreType({storeTypeUI: 2}).then(res => {
                if (res && res.IsSuccess) {
                    this.classificationFormatsData_B = res.Content;
                    this.classificationFormatsLoading = false;
                    this.clearTypeB();
                }

            }).catch(r => {
                this.classificationFormatsLoading = false;
                this.message("获取数据失败", 2);
            });
        },
        checkAllTypeOfChange(val, id) {
            for (let item of this.classificationFormatsData) {
                if (item.StoreTypeId == id) {
                    let secondDataList = []
                    item.GetMapSecondary.forEach((secondItem) => {
                        secondDataList.push(secondItem.StoreTypeName)
                    });
                    item.checkedTypeOfArr = val ? secondDataList : [];
                    item.isIndeterminate = false
                }
            }
        },
        CheckedTypeOfChange(value, id) {
            for (let item of this.classificationFormatsData) {
                if (item.StoreTypeId == id) {
                    let checkedTypeOfCount = value.length;
                    if(item.TypeOfData.length > 0){
                        item.checkAllTypeOfValue = checkedTypeOfCount === item.TypeOfData.length;
                    }
                    item.isIndeterminate = checkedTypeOfCount > 0 && checkedTypeOfCount < item.TypeOfData.length;
                }
            }
        },
        checkAllTypeOfChange_B(val, id) {
            for (let item of this.classificationFormatsData_B) {
                if (item.StoreTypeId == id) {
                    let secondDataList = [];
                    item.GetMapSecondary.forEach((secondItem) => {
                        secondDataList.push(secondItem.StoreTypeName)
                    });
                    item.checkedTypeOfArr = val ? secondDataList : [];
                    item.isIndeterminate = false
                }
            }
        },
        CheckedTypeOfChange_B(value, id) {
            for (let item of this.classificationFormatsData_B) {
                if (item.StoreTypeId == id) {
                    let checkedTypeOfCount = value.length;
                    if(item.TypeOfData.length > 0){
                        item.checkAllTypeOfValue = checkedTypeOfCount === item.TypeOfData.length;
                    }
                    item.isIndeterminate = checkedTypeOfCount > 0 && checkedTypeOfCount < item.TypeOfData.length;
                }
            }
        },
        //选择业态后提交
        TypeOfOperationCommit() {
            let selectedCount = 0;
            this.typeOfOperationSelectedList = [];
            if (this.BCTYPE == "0")//c端
            {
                for (let item of this.classificationFormatsData) {
                    if (item.checkedTypeOfArr.length != 0 && item.checkedTypeOfArr.length != []) {
                        this.typeOfOperationSelectedList.push({
                            "ParentTypeId": item.ParentTypeId,
                            "StoreTypeId": item.StoreTypeId,
                            "StoreTypeName": item.StoreTypeName,
                            "OrderNum": item.OrderNum,
                        });
                        for (let name of item.checkedTypeOfArr) {
                            for (let secondItem of item.GetMapSecondary) {
                                if (name == secondItem.StoreTypeName) {
                                    this.typeOfOperationSelectedList.push({
                                        //"Id": "",
                                        // "MapId": this.listRowId,
                                        "StoreTypeId": secondItem.StoreTypeId,
                                        "StoreTypeName": secondItem.StoreTypeName,
                                        "ParentTypeId": secondItem.ParentTypeId,
                                        "ImageBigIconMap": secondItem.ImageBigIconMap,
                                        "ImageIcon": secondItem.ImageIcon,
                                        "ImageIconMapPixel": secondItem.ImageIconMapPixel,
                                        "ImageIconPixel": secondItem.ImageIconPixel,
                                        "ImageMapUrl": secondItem.ImageMapUrl,
                                        "ImageUrl": secondItem.ImageUrl,
                                        "OrderNum": secondItem.OrderNum,
                                        "Ishow": secondItem.Ishow,
                                        "SearchCode": secondItem.SearchCode,
                                        "Selected": secondItem.Selected,
                                        "Type": this.typeOfOperationType,//0为添加 1为修改
                                        "SubBy": this.$utils.getUrlKey("userId"),
                                        "SubTime": this.getTime()
                                    });
                                    selectedCount = selectedCount + 1
                                }
                            }
                        }
                    }
                }
            } else {
                for (let item of this.classificationFormatsData_B) {
                    if (item.checkedTypeOfArr.length != 0 && item.checkedTypeOfArr.length != []) {
                        this.typeOfOperationSelectedList.push({
                            "ParentTypeId": item.ParentTypeId,
                            "StoreTypeId": item.StoreTypeId,
                            "StoreTypeName": item.StoreTypeName,
                            "OrderNum": item.OrderNum,
                        });
                        for (let name of item.checkedTypeOfArr) {
                            for (let secondItem of item.GetMapSecondary) {
                                if (name == secondItem.StoreTypeName) {
                                    this.typeOfOperationSelectedList.push({
                                        //"Id": "",
                                        // "MapId": this.listRowId,
                                        "StoreTypeId": secondItem.StoreTypeId,
                                        "StoreTypeName": secondItem.StoreTypeName,
                                        "ParentTypeId": secondItem.ParentTypeId,
                                        "ImageBigIconMap": secondItem.ImageBigIconMap,
                                        "ImageIcon": secondItem.ImageIcon,
                                        "ImageIconMapPixel": secondItem.ImageIconMapPixel,
                                        "ImageIconPixel": secondItem.ImageIconPixel,
                                        "ImageMapUrl": secondItem.ImageMapUrl,
                                        "ImageUrl": secondItem.ImageUrl,
                                        "OrderNum": secondItem.OrderNum,
                                        "Ishow": secondItem.Ishow,
                                        "SearchCode": secondItem.SearchCode,
                                        "Selected": secondItem.Selected,
                                        "Type": this.typeOfOperationType,//0为添加 1为修改
                                        "SubBy": this.$utils.getUrlKey("userId"),
                                        "SubTime": this.getTime()
                                    });
                                    selectedCount = selectedCount + 1
                                }
                            }
                        }
                    }
                }
            }
            this.addAndEditNameForm.initializationDataValue = "已选择" + selectedCount + "种业态";
            this.dialogTypeOfOperationVisible = false
        },
        //角色设置状态改变触发事件
        roleSetChange() {
            if (this.addAndEditNameForm.roleSetValue.length != 0) {
                this.addAndEditNameForm.anonymityValue = false
            }
        },
        //是否可以匿名访问 状态改变触发事件
        anonymityChange() {
            if (this.addAndEditNameForm.anonymityValue) {
                this.addAndEditNameForm.roleSetValue = []
            }
        },
        //获取角色配置数据
        getRoloConfigList() {
            this.$api.GetRoloConfigList({}).then(res => {
                if (res && res.IsSuccess) {
                    this.roleSetList = res.Content
                }
            }).catch(r => {
            });
        },
        //选择门店
        choseStore(){
          this.iframeShow = true;
          this.url = window.urlsPath.statisticsUrl;
          // // let  obj = document.getElementById('mainIframe');
          // // obj.wpsData = '设置的数据'
          // this.$nextTick(() => {
          //     let mapFrame = this.$refs.mainIframe;
          //     mapFrame.contentWindow.postMessage('11111222222',window.urlsPath.statisticsUrl)
          //     // if (mapFrame.contentWindow){  //兼容浏览器判断
          //     //     mapFrame.contentWindow("onload", function(){
          //     //         let iframeWin = mapFrame.contentWindow
          //     //         iframeWin.postMessage(this.wpsData,window.urlsPath.statisticsUrl)
          //     //         //data传递的参数   *写成子页面的域名或者是ip
          //     //     })
          //     // } else {
          //     //     mapFrame.onload = function(){
          //     //         let iframeWin = mapFrame.contentWindow
          //     //         iframeWin.postMessage(this.wpsData,window.urlsPath.statisticsUrl)
          //     //     }
          //     // }
          // })
        },
        // 翻页
        Pagination(v){
          this.pages.pageNo=v.page
          this.pages.pageSize=v.limit
          // this.getAllMapData()
          this.getMapList()
        },
        // 获取地图分组列表
        getGroupList(){
          let data = {}
          this.$api.GetMapGroupList(data).then(res => {
            if(res && res.IsSuccess){
              this.mapGroup.groupNameList = res.Content
              this.mapGroup.activeGroup = this.mapGroup.groupNameList[0].Id
              this.getMapList()
            }else{
              this.message(res.Message, -1)
            }
          }).catch(()=>{
            this.message('网络错误', -1)
          })
        },
        // 添加分组
        addGroup(){
          this.mapGroup.show = true
          this.mapGroup.title = "添加分组"
          this.mapGroup.currentId="00000000-0000-0000-0000-000000000000"
          this.mapGroup.name = ''
        },
        // 编辑分组
        editGroup(){
          this.mapGroup.show = true
          this.mapGroup.title = "修改分组"
          this.mapGroup.currentId = this.mapGroup.activeGroup
          this.mapGroup.name = (this.mapGroup.groupNameList.find(i => i.Id == this.mapGroup.activeGroup)).GroupName
        },
        // 删除分组
        deleteGroup(){
          this.$confirm('删除后不可恢复，请慎重操作','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              GroupId: this.mapGroup.activeGroup,
              RoleId: "00000000-0000-0000-0000-000000000000",
              KeyWord: "",
              DeptName: ""
            }
            this.$api.DeleteMapGroup(data).then(res => {
              if(res && res.IsSuccess){
                this.message(res.Message, 1)
                this.getGroupList()
              }else{
                this.message(res.Message, -1)
              }
            }).catch(() => {
              this.message('网络错误', -1)
            })
          }).catch(()=>{})
        },
        // 切换分组
        changeGroup(id){
          this.mapGroup.activeGroup = id
          this.getMapList()
        },
        // 提交分组修改
        subGroupchange(){
          if(this.mapGroup.name.length < 1){
            this.message('请输入分组名称', -1)
            return
          }
          let data = {
            Id: this.mapGroup.currentId,
            GroupName: this.mapGroup.name,
            RoleId: "00000000-0000-0000-0000-000000000000",
            KeyWord: "",
            DeptName: ""
          }
          this.$api.SaveMapGroup(data).then(res => {
            if(res && res.IsSuccess){
              this.mapGroup.show = false
              this.getGroupList()
              this.message(res.Message, 1)
            }else{
              this.message(res.Message, -1)
            }
          }).catch(() => {
            this.message("网络错误",-1)
          })
        },
        // 根据分组获取地图列表
        getMapList(){
          this.mapNameConfigTableListLoading = true
          let data = {
            GroupId: this.mapGroup.activeGroup,
            pageNo:this.pages.pageNo,
            pageSize:this.pages.pageSize
          }
          this.$api.GetMapByGroupId(data).then(res => {
            this.mapNameConfigTableListLoading = false

            if(res && res.IsSuccess){
              this.mapNameConfigurationData = res.Content;
              this.pages.total = res.Data
            }else{
              this.message(res.Message, -1)
            }
          }).catch(() => {
            this.mapNameConfigTableListLoading = false
            this.message("网络错误", -1)
          })
        },
        changeTop(k){
            if(k != 1){
                this.addAndEditNameForm.mapTopCenterKeyWord = ''
            }else if(this.listRowId == '00000000-0000-0000-0000-000000000000'){
                this.addAndEditNameForm.mapTopCenterKeyWord = '请输入搜索关键字'
            }else{
                let o = this.EditData.LayoutConfig.TopCenter.find(i => i.Id == 1)
                this.addAndEditNameForm.mapTopCenterKeyWord = o == undefined ? '请输入搜索关键字' : (o.Code == "" || o.Code == null) ? '请输入搜索关键字' : o.Code
            }
        }
    },
    computed:{
      FilterListLayoutData(){
        let data = []
        if(this.layoutList.Bottom[0].FilterList){
          data = this.layoutList.Bottom[0].FilterList[2].FilterList
        }else{
          this.$message.error('获取筛选列表失败')
        }
        return data
      }
    }
}
