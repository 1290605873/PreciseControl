export default {
  components: {},
  data() {
    let iconValueTypeValid = (rule, value, callback) => {
      if (value==0 && !this.baseSetForm.selectIconValue) {
        callback(new Error('请上传自定义选中图标'));
      } else {
        callback();
      }
    };
    let checkNumber = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value && ( !reg.test(value) || value < 0 || value > 100)) {
        callback(new Error('请输入0-100 以内整数'));
      } else {
        callback();
      }
    };
    return {
      currentSort:'',             // 当前排序
      isShowSortInput:false,      // 是否展示输入弹窗
      currentSortIndex:0,         // 当前点击的排序index
      currentIsRemind:false,      // 当前点击的数据提醒开关

      dataSetloading:true,
      typeOfOperationLoading:true,
      dialogDeleteVisible: false,
      dialogDataSetVisible: false,
      dialogMainBaseSetVisible: false,
      dialoAddAndEditVisible: false,
      mapMainTableListLoading: false,
      mapRowId: "",
      mapTabActiveIndex: '0',
      MapOrEventId: "",
      dataTypeCurrent: "",
      mapDataTypeCurrent: "",
      mapMainTableListData: [],
      addAndEditTitle: "",
      addAndEditStatusForm: {
        mainStatus: "",
        property: ""
      },
      addOrEditType: 0,
      baseSetId: "",
      addAndEditStatusRules: {
        mainStatus: [
          {required: true, message: '请输入主体状态', trigger: 'blur'}
        ]
      },
      baseSetForm: {
        bigIconValue: "",
        smallIconValue: "",
        scaleValue: "",
        selectIconValue: "",
        topTimeValue: false,
        middleNumberValue: false,
        operateTypeValue:0,
        LogoBaseMap:'',
        NewPageType:"",
        PopType:'',
        iconValueType:0,            // 自定义选中图标类型
        isShowBtnLoading:false,     // 是否展示图标动效
      },
      scaleOptions: [
        {
          value: '500',
          label: '500'
        },
        {
          value: '1000',
          label: '1000'
        },
        {
          value: '1500',
          label: '1500'
        },
        {
          value: '2000',
          label: '2000'
        },
        {
          value: '3000',
          label: '3000'
        },
        {
          value: '4000',
          label: '4000'
        },
        {
          value: '5000',
          label: '5000'
        },
        {
          value: '6000',
          label: '6000'
        },{
          value: '7000',
          label: '7000'
        },{
          value: '8000',
          label: '8000'
        }
      ],
      baseSetRules: {
        bigIconValue: [
          {required: true, message: '请输上传大图标', trigger: 'blur'}
        ],
        scaleValue: [
          {required: true, message: '请输入比例尺数值', trigger: 'blur'}
        ],
        iconValueType: [
          {required: true, validator:iconValueTypeValid, trigger: 'blur'}
        ],
      },
      dataSetForm: {
        fieldDataValue: "",
        businessSelection: "",
        labelNameSelect: "",
        ruleDefinition: "",
        dataSetArrOne:[],//存放数据设置里的  多个下拉框数据对象
      },
      dataSetFormRules:{
        fieldDataValue:[
         { validator: checkNumber, trigger: 'blur' }
        ]
      },
      //业态
      dialogTypeOfOperationVisible: false,
      classificationFormatsData: [],
      mapDataList:[],
      mapCurrentIndex:0,
      //数据设置修改
      globalMapBodyId:'',  //存放数据设置里返回来的 MapBodyId 提交的时候需要给后台传过去
      formatShowFlag:false,  //标识业态是否存在
      formatMapStatusId:'',

      typeOfOperationSelectedList: [],
      storeTypeArray:[],
      storeTypeArrayBack:[],
      checked: true,
      operationlist: {//业态列表
        //业态
        datas: [],
        Name: "", //当前业态值
        code: "" //当前业态值id
      },
    }
  },
  created() {
    this.getMapList()
    // this.getTypeOfOperationData();
  },
  methods: {
    IsRemindHandler(val,row){        // 数据提醒开关
      this.currentIsRemind = val
      this.addOrEditType = 1
      this.addAndEditStatusForm.mainStatus = row.Name;
      this.addAndEditStatusForm.property = row.Mark;
      this.mapRowId = row.Id;
      this.saveMapBody(val)
    },
    isShowSortInputBox(i){           // 排序事件
      this.currentSort = ''
      this.isShowSortInput = true
      this.currentSortIndex = i
      this.$nextTick(() => {
        this.$refs.sortInput.focus()
      })
    },
    sortKeepHandler(row){               // 排序保存事件
        this.isShowSortInput = false
        this.addOrEditType = 1
        this.addAndEditStatusForm.mainStatus = row.Name;
        this.addAndEditStatusForm.property = row.Mark;
        this.mapRowId = row.Id;
        this.currentIsRemind = row.IsRemind
        this.saveMapBody()
        this.currentSort = ''
    },
    handleClick(tab, event) {
        // this.operationlist.code = tab.name;
        // this.getMapMainSettingListData(this.MapOrEventId);
        // this.getTaskTyp();
      this.mapDataTypeCurrent = Number(tab.paneName);
              this.GetMapMainSettingListRevise()
    },
    GetDataTypeByMapId(){
      let data = {
        'MapId':this.MapOrEventId,
      };
      this.$api.GetDataTypeByMapId(data).then(
        res => {
          if(res && res.IsSuccess){
            if(res.Content.length > 0){
              for(let item of res.Content){
                // if(item.Name == '巡查数据源'){
                  item.MapDataType = item.MapDataType.toString();
                // }
              }
              this.operationlist.datas = res.Content;
              this.operationlist.code = res.Content[0].MapDataType;
              this.mapDataTypeCurrent = Number(res.Content[0].MapDataType);
              this.GetMapMainSettingListRevise();
            }
          }
        }
      )
    },
    handleClose() {
        this.$router.push({path: "/MapConfig", query: {}});
    },
    //获取地图主体列表
    getMapMainSettingListData(id,index) {
      if(index!=undefined && index!=null){
          this.mapCurrentIndex=index;
      }
      this.MapOrEventId = id;
      for (let item of this.mapDataList) {
          if (this.MapOrEventId == item.Id) {
              // this.mapDataTypeCurrent = item.MapDataType;
              this.dataTypeCurrent = item.MapType;
              break;
          }
      }
      let data = {
          'objId': id
      };
      this.GetDataTypeByMapId();
      // this.$api.GetMapMainSettingList(data).then(res => {
      //     if (res && res.IsSuccess) {
      //         this.mapMainTableListData = res.Data;
      //     } else {
      //         this.mapMainTableListData = []
      //     }
      //     this.mapMainTableListLoading = false;
      // }).catch(r => {
      // });
      this.getTypeOfOperationData(id);
      this.getClassification(id)
    },
    GetMapMainSettingListRevise(){
      this.mapMainTableListLoading = true;
      let MapDataType = this.operationlist.datas.filter(val => val.MapDataType == this.operationlist.code)[0].MapDataType;
      let data = {
        'MapId':this.MapOrEventId,
        'MapDataType':Number(MapDataType),
      };
      this.$api.GetMapMainSettingListRevise(data).then(
        res => {
          if(res && res.IsSuccess){
            this.mapMainTableListData = res.Content;
          }else{
            this.mapMainTableListData = [];
          }
          this.mapMainTableListLoading = false;
        }
      )
    },
    //启用禁用
    isEnableChange(id) {
        let data = {
            'id': id
        }
        this.$api.EnableSetting(data).then(res => {
            if (res && res.IsSuccess) {
                this.message(res.Message, 1)
                // this.getMapMainSettingListData(this.MapOrEventId);
    this.GetMapMainSettingListRevise();
            } else {
                this.message(res.Message, -1)
            }
        }).catch(r => {
        });
    },
    //删除列表
    deleteBtn(id) {
        this.dialogDeleteVisible = true;
        this.mapRowId = id;
    },
    deleteCommit() {
        let data = {
            'id': this.mapRowId
        }
        this.$api.DeleteMapBody(data).then(res => {
            if (res && res.IsSuccess) {
                this.message(res.Message, 1)
                this.dialogDeleteVisible = false;
                // this.getMapMainSettingListData(this.MapOrEventId);
    this.GetMapMainSettingListRevise();
            } else {
                this.message(res.Message, -1)
            }
        }).catch(r => {});
    },
    //编辑
    editBtn(row) {
        this.addOrEditType = 1;
        this.addAndEditStatusForm.mainStatus = "";
        this.addAndEditStatusForm.property = "";
        this.addAndEditTitle = "编辑主体状态";
        this.addAndEditStatusForm.mainStatus = row.Name;
        this.addAndEditStatusForm.property = row.Mark;
        this.mapRowId = row.Id;
        this.dialoAddAndEditVisible = true;
        this.currentSort = row.Sort
        this.currentIsRemind = row.IsRemind
    },
    //添加
    addMainSataus() {
        this.addOrEditType = 0;
        this.addAndEditTitle = "添加主体状态";
        //清空添加表单里的数据
        this.addAndEditStatusForm.mainStatus = "";
        this.addAndEditStatusForm.property = "";
        this.dialoAddAndEditVisible = true;
    },
    addAndEditCommit(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.saveMapBody()
            }
        });
    },
    // 添加&编辑保存接口
    saveMapBody(IsRemind){
        //添加 或者编辑 this.addOrEditType=0/1  0添加  1编辑
        let addOrEditId = "00000000-0000-0000-0000-000000000000";
        let Sort;
        if (this.addOrEditType == 0) {
            addOrEditId = "00000000-0000-0000-0000-000000000000"
        } else {
            addOrEditId = this.mapRowId
            Sort = this.currentSort
        }
        let data = {
            "Id": addOrEditId,
            "MapId": this.MapOrEventId,
            "Name": this.addAndEditStatusForm.mainStatus,
            "MapDataType": this.mapDataTypeCurrent,
            // "MapDataType": 0,
            "Mark": this.addAndEditStatusForm.property,
            "IsEnable": true,
            "SubBy": this.$utils.getUrlKey("userId"),
            "MapType": this.dataTypeCurrent,
            'Sort':Sort,
            'IsRemind':IsRemind || false
        };
        this.$api.SaveMapBody(data).then(res => {
            if (res && res.IsSuccess) {
                this.message(res.Message, 1);
                this.dialoAddAndEditVisible = false;
                // this.getMapMainSettingListData(this.MapOrEventId);
                this.GetMapMainSettingListRevise();
            } else {
                this.message(res.Message, -1);
            }
        }).catch(r => {
        });
    },
    //取消/关闭  添加地图名称弹框
    cancelAddAndEditForm(formName) {
        this.$refs[formName].resetFields();
        this.dialoAddAndEditVisible = false;
    },
    //基础设置-上传图片
    handleBigPicSuccess(obj) {
        let fd = new FormData();
        fd.append('upload', obj.file);
        this.$api.UploadFile(fd).then(res => {
            if (res.data.IsSuccess) {
                this.baseSetForm.bigIconValue = res.data.Detail;
                this.message('上传成功', 1)
            } else {
                this.message('上传失败', -1)
            }
        }).catch(error => {

        })
    },
    handleSmallPicSuccess(obj) {
        let fd = new FormData();
        fd.append('upload', obj.file);
        this.$api.UploadFile(fd).then(res => {
            if (res.data.IsSuccess) {
                this.baseSetForm.smallIconValue = res.data.Detail;
                this.message('上传成功', 1)
            } else {
                this.message('上传失败', -1)
            }
        }).catch(error => {
        })
    },
    handleSelectPicSuccess(obj) {
        let fd = new FormData();
        fd.append('upload', obj.file);
        this.$api.UploadFile(fd).then(res => {
            if (res.data.IsSuccess) {
                this.baseSetForm.selectIconValue = res.data.Detail;
                this.message('上传成功', 1)
            } else {
                this.message('上传失败', -1)
            }
        }).catch(error => {

        })
    },
    handleLogoPicSuccess(obj) {
        let fd = new FormData();
        fd.append('upload', obj.file);
        this.$api.UploadFile(fd).then(res => {
            if (res.data.IsSuccess) {
                this.baseSetForm.LogoBaseMap = res.data.Detail;
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
            this.$message.error('图片格式：jpg，jpeg，gif，png');
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 1MB!');
        }
        return (isJPG || isJPG2 || isGIF || isPNG) && isLt2M;
    },
    //基础设置-获取
    baseSetBtn(id) {
      this.mapRowId = id;
      let data = {
          mapBodyId: id
      }
      this.$api.GetMapBasicSettingByMapBodyId(data).then(res => {
        if (res && res.IsSuccess) {
          this.baseSetForm.bigIconValue = res.Data.BigIcon;
          this.baseSetForm.smallIconValue = res.Data.SmallIcon;
          this.baseSetForm.scaleValue = res.Data.Proportion==0?'':res.Data.Proportion;
          this.baseSetForm.selectIconValue = res.Data.SelectIcon;
          this.baseSetForm.LogoBaseMap = res.Data.LogoBackImage;            /////logo底图
          this.baseSetForm.topTimeValue = res.Data.TopTime;
          this.baseSetForm.middleNumberValue = res.Data.MiddleNumber;
          this.baseSetForm.operateTypeValue=res.Data.OperateType;
          this.baseSetForm.NewPageType=res.Data.JumpPageType == 0 ? "" : res.Data.JumpPageType;
          this.baseSetForm.PopType = res.Data.PopType == 0 ? '' : res.Data.PopType
          this.baseSetForm.iconValueType = res.Data.SelectType || 0
          this.baseSetForm.isShowBtnLoading = res.Data.IsLoadEffect
          this.baseSetId = res.Data.Id;
          this.checked = res.Data.IsShowLogo;
        }
      }).catch(error => {

      })
      this.dialogMainBaseSetVisible = true;
    },
    //基础设置-保存
    baseSetCommit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            Id: this.baseSetId,
            MapBodyId: this.mapRowId,
            BigIcon: this.baseSetForm.bigIconValue,
            SmallIcon: this.baseSetForm.smallIconValue,
            SelectIcon: this.baseSetForm.selectIconValue,
            LogoBackImage: this.baseSetForm.LogoBaseMap,    ///////底图
            Proportion: this.baseSetForm.scaleValue,
            TopTime: this.baseSetForm.topTimeValue,
            MiddleNumber: this.baseSetForm.middleNumberValue,
            SubBy: this.$utils.getUrlKey("userId"),
            OperateType:this.baseSetForm.operateTypeValue,
            PopType: (this.baseSetForm.operateTypeValue == 1 || this.baseSetForm.PopType == '') ? 0 : this.baseSetForm.PopType,
            JumpPageType: (this.baseSetForm.operateTypeValue == 0 || this.baseSetForm.NewPageType == '') ? 0 : this.baseSetForm.NewPageType,
            IsShowLogo:this.checked,
            SelectType:this.baseSetForm.iconValueType, // 0 自定义 1 放大
            IsLoadEffect:this.baseSetForm.isShowBtnLoading // 是否显示加载动效
          }
          this.$api.SaveMapBasicSetting(data).then(res => {
            if (res.IsSuccess) {
              this.message(res.Message, 1)
              this.dialogMainBaseSetVisible = false;
              // this.getMapMainSettingListData(this.MapOrEventId);
              this.GetMapMainSettingListRevise();
            } else {
              this.message(res.Message, -1)
            }
          }).catch(error => {})
        }
      });
    },
    //取消/关闭  基础设置
    cancelbaseSet(formName) {
      this.$refs[formName].resetFields();
      this.dialogMainBaseSetVisible = false;
    },
    //打开数据设置
    dataSetBtn(id) {
      //先清空form表单里的数据
      this.dataSetForm.fieldDataValue = "";
      this.dataSetForm.businessSelection = "";
      this.dataSetForm.labelNameSelect = "";
      this.dataSetForm.ruleDefinition = "";
      this.dataSetForm.dataSetArrOne.length=0;
      this.formatShowFlag=false; //标识业态显示
      this.mapRowId = id;
      this.dialogDataSetVisible = true;
      for (let item of this.classificationFormatsData) {
        item.checkAllTypeOfValue=false;
        item.isIndeterminate=false;
        item.checkedTypeOfArr=[];
        item.TypeOfData=item.GetMapSecondary;
      }
      this.getMapStatusDataSettingData(id);
    },
    // 数据设置初始化
    getMapStatusDataSettingData(id) {
      this.dataSetloading=true;
      let data = {
        mapBodyId: id
      }
      this.$api.GetMapStatusDataSetting(data).then(res => {
        if (res && res.IsSuccess) {
          this.dataSetloading=false;
          this.globalMapBodyId=res.Data.MapBodyId;
          if(res.Data.MapStatusSetReturnDTOList.length==0 || res.Data.MapStatusSetReturnDTOList==null || res.Data.MapStatusSetReturnDTOList==undefined){
            return
          }
          res.Data.MapStatusSetReturnDTOList.forEach(currentItem=>{
            let dataSetArrItem={}
            dataSetArrItem.mapStatusSetId = currentItem.MapStatusId;
            if (currentItem.UiType == 1) { //uiType是1 页面显示的是下拉框
              dataSetArrItem.UiType = 1
              dataSetArrItem.fieldDataoptions = JSON.parse(currentItem.FieldData);
              dataSetArrItem.Id=currentItem.Id;
              dataSetArrItem.fieldDataValue='';
              if (currentItem.FieldDataType == 1) {
                dataSetArrItem.FieldDataType=1
                if (currentItem.IntData != null && currentItem.IntData != undefined && currentItem.IntData !== '') {
                  let tempItem = dataSetArrItem.fieldDataoptions.find(i => currentItem.IntData == i.key)
                  dataSetArrItem.fieldDataValue =tempItem ? tempItem.key : ''
                }
              }
              if (currentItem.FieldDataType == 2) {
                dataSetArrItem.FieldDataType=2
                if (currentItem.StringData != null && currentItem.StringData != undefined && currentItem.StringData != '') {
                  let tempItem = dataSetArrItem.fieldDataoptions.find(i => currentItem.StringData == i.key.toString())
                  dataSetArrItem.fieldDataValue = tempItem ? tempItem.key : ''
               }
              }
              dataSetArrItem.labelNameSelect = currentItem.MapStatusName;
              this.dataSetForm.dataSetArrOne.push(dataSetArrItem)
            } else if(currentItem.UiType == 2){ //UiType的值是2 页面显示业态
              this.dataSetForm.labelNameSelect = currentItem.MapStatusName;
              this.formatShowFlag=true; //标识业态显示
              this.formatMapStatusId=currentItem.MapStatusId;
              if (currentItem.StringData != null && currentItem.StringData != undefined && currentItem.StringData != '') {
                this.typeOfOperationSelectedList=JSON.parse(currentItem.StringData)
                for (let item of this.classificationFormatsData) {
                item.checkedTypeOfArr = [] //先清空里边的数据
                for (let selectedItem of JSON.parse(currentItem.StringData)) {
                  if (item.StoreTypeId == selectedItem.ParentTypeId) {
                    item.checkedTypeOfArr.push(selectedItem.StoreTypeName)
                  }
                }
                item.checkAllTypeOfValue = item.checkedTypeOfArr.length === item.TypeOfData.length;
                item.isIndeterminate = item.checkedTypeOfArr.length > 0 && item.checkedTypeOfArr.length < item.TypeOfData.length;
                }
                let businessSelectionArray=[]
                for(let item of JSON.parse(currentItem.StringData)){
                  businessSelectionArray.push(item.StoreTypeName)
                }
                this.dataSetForm.businessSelection = businessSelectionArray.toString();
              }
            }else if(currentItem.UiType == 0){
              dataSetArrItem.UiType = 0
              dataSetArrItem.Id=currentItem.Id
              dataSetArrItem.fieldDataValue = currentItem.FieldDataType == 2 ? currentItem.StringData : currentItem.IntData == -1 ?  null : currentItem.IntData
              dataSetArrItem.FieldDataType = currentItem.FieldDataType
              dataSetArrItem.labelNameSelect = currentItem.MapStatusName
              this.dataSetForm.dataSetArrOne.push(dataSetArrItem)
             }else if(currentItem.UiType == 5){
              dataSetArrItem.UiType = currentItem.UiType
              dataSetArrItem.Id=currentItem.Id
              dataSetArrItem.FieldDataType = currentItem.FieldDataType
              dataSetArrItem.fieldDataValue = currentItem.IntData == -1 ?  null : currentItem.IntData
              dataSetArrItem.labelNameSelect = currentItem.MapStatusName
              this.dataSetForm.dataSetArrOne.push(dataSetArrItem)
             }
          })
          this.dataSetForm.ruleDefinition = res.Data.Remark;
          //this.dataSetloading=false;
        }else{
          this.message(res.Message,-1)
          this.dataSetloading=false;
        }
      }).catch(error => {})
    },
    // 数据设置提交
    dataSetCommit() {
      this.$refs['dataSetDiv'].validate((valid) => {
        if(!valid){
          return false
        } else {
          let mapStatusSetInputList=[]
          if(this.dataSetForm.dataSetArrOne.length!=0){
            this.dataSetForm.dataSetArrOne.forEach( itemDataSet => {
              let mapStatusSetItem={}
              mapStatusSetItem.MapStatusId=itemDataSet.mapStatusSetId;
              mapStatusSetItem.MapStatusName=itemDataSet.labelNameSelect;
              if (itemDataSet.UiType == 1) {
                mapStatusSetItem.Condition = 1;
                if (itemDataSet.FieldDataType == 1) {
                  mapStatusSetItem.IntData = itemDataSet.fieldDataValue
                  let tempItem = itemDataSet.fieldDataoptions.find(i => i.key == mapStatusSetItem.IntData)
                  mapStatusSetItem.IntData = tempItem ? tempItem.key : -1
                }
                if (itemDataSet.FieldDataType == 2) {
                  mapStatusSetItem.StringData = itemDataSet.fieldDataValue
                  let tempItem = itemDataSet.fieldDataoptions.find(i =>i.key == mapStatusSetItem.StringData)
                  mapStatusSetItem.StringData = tempItem ? tempItem.key : null
                }
              }
              if(itemDataSet.UiType == 0) {
                mapStatusSetItem.Condition = 3
                if (itemDataSet.FieldDataType == 1) {
                  mapStatusSetItem.IntData =itemDataSet.fieldDataValue == null ? -1 : parseInt(itemDataSet.fieldDataValue)
                }else{
                  mapStatusSetItem.StringData = itemDataSet.fieldDataValue
                }
              }
              if(itemDataSet.UiType == 5) {
                mapStatusSetItem.Condition = 4
                mapStatusSetItem.IntData =itemDataSet.fieldDataValue == null ? -1 : parseInt(itemDataSet.fieldDataValue)
                
              }
              if(itemDataSet.fieldDataValue!=='' && itemDataSet.fieldDataValue!==undefined && itemDataSet.fieldDataValue!==null){
                mapStatusSetInputList.push(mapStatusSetItem)
              }
            })
          }
          if (this.formatShowFlag==true) {
            let formatItem={
              MapStatusId: this.formatMapStatusId,
              MapStatusName: this.dataSetForm.labelNameSelect,
              Condition: 0,
              ConditionLast: 0,
              IntData: 0,
              MaxIntData: 0,
              StringData: ""
            }
            formatItem.StringData = JSON.stringify(this.typeOfOperationSelectedList);
            if(formatItem.StringData!='' &&  formatItem.StringData!='null' && formatItem.StringData!='undefined'  && formatItem.StringData!='[]' ){
              mapStatusSetInputList.push(formatItem)
            }
          }
          let data = {
            "MapBodyId": this.mapRowId,
            "MapStatusSetInputDTOList":mapStatusSetInputList,
            "Remark": this.dataSetForm.ruleDefinition,
            "SubBy": this.$utils.getUrlKey("userId")
          }
          this.$api.MapStatusDataSetting(data).then(res => {
            if (res && res.IsSuccess) {
              this.message('设置成功', 1);
              this.dialogDataSetVisible = false;
              // this.getMapMainSettingListData(this.MapOrEventId);
              this.GetMapMainSettingListRevise();
            } else {
              this.message(res.Message, -1);
            }
          }).catch(error => {})
        }
      })
    },
    //取消/关闭  数据设置
    cancelDataSet(formName) {
      this.$refs[formName].resetFields();
      this.dialogDataSetVisible = false;
    },
    //业态
    ClassificationFormatsChange() {
        this.dialogTypeOfOperationVisible = true;
    },
    checkAllTypeOfChange(val, id) {
        for (let item of this.classificationFormatsData) {
            if (item.StoreTypeId == id) {
                let secondDataList = []
                item.GetMapSecondary.forEach((secondItem) => {
                    secondDataList.push(secondItem.StoreTypeName)
                })
                item.checkedTypeOfArr = val ? secondDataList : [];
                item.isIndeterminate = false
            }
        }
    },
    CheckedTypeOfChange(value, id) {
        for (let item of this.classificationFormatsData) {
            if (item.StoreTypeId == id) {
                let checkedTypeOfCount = value.length;
                item.checkAllTypeOfValue = checkedTypeOfCount === item.TypeOfData.length;
                item.isIndeterminate = checkedTypeOfCount > 0 && checkedTypeOfCount < item.TypeOfData.length;
            }
        }
    },
    //获取业态
    getTypeOfOperationData(id) {
        let data = {
            // 'mapId':"f9ed85b6-ca4b-4501-bc39-cc4ed1fce02b"
            'mapId':id
        }
        this.$api.GetSelectedStoreType(data).then(res => {
            if (res && res.IsSuccess) {
                this.classificationFormatsData = res.Content;
                this.typeOfOperationLoading = false;
                for (let item of this.classificationFormatsData) {
                    this.$set(item, 'checkAllTypeOfValue', false);
                    this.$set(item, 'isIndeterminate', false);
                    this.$set(item, 'checkedTypeOfArr', []);
                    this.$set(item, 'TypeOfData', item.GetMapSecondary); //子数组
                }
            }
        })
    },
    //选择业态后确定
    TypeOfOperationCommit() {
        this.typeOfOperationSelectedList = [];
        for (let item of this.classificationFormatsData) {
            if (item.checkedTypeOfArr.length != 0 && item.checkedTypeOfArr.length != []) {
                if(item.checkAllTypeOfValue==true){
                    this.typeOfOperationSelectedList.push({
                        "ParentTypeId": item.ParentTypeId,
                        "StoreTypeId": item.StoreTypeId,
                        "StoreTypeName": item.StoreTypeName
                    })
                }
                for (let name of item.checkedTypeOfArr) {
                    for (let secondItem of item.GetMapSecondary) {
                        if (name == secondItem.StoreTypeName) {
                            this.typeOfOperationSelectedList.push({
                                "ParentTypeId": secondItem.ParentTypeId,
                                "StoreTypeId": secondItem.StoreTypeId,
                                "StoreTypeName": secondItem.StoreTypeName
                            })
                        }
                    }
                }
            }
        }
        let businessSelectionArr=[]
        if(this.typeOfOperationSelectedList.length!=0){
            for(let item of this.typeOfOperationSelectedList){
                businessSelectionArr.push(item.StoreTypeName)
            }
            this.dataSetForm.businessSelection=businessSelectionArr.toString()
        }else{
            this.dataSetForm.businessSelection=''
        }
        this.dialogTypeOfOperationVisible = false
    },
    //获取地图列表
    getMapList() {
        this.$api.GetCategoryMapEventList({}).then(res => {
            if (res && res.IsSuccess) {
                this.mapDataList = res.Content;
                this.MapOrEventId=res.Content[0].Id
                this.getMapMainSettingListData(this.MapOrEventId,0)
                // this.getTypeOfOperationData(this.MapOrEventId);
            }
        })
    },
    // 获取上报分类
    getClassification(id){
      let data = {
        AppId: id
      }
      this.$api.GetClassification(data).then(res => {
        console.log(res)
      }).catch(() => {})
    }
  }

}
