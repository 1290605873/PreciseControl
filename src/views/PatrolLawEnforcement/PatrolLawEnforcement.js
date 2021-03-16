import Pagination from "@/components/Pagination";
export default {
    components: {
        Pagination,
    },
    data() {
		var EnforcementResult = (rule, value, callback) => {
			if(value.code == ''){
				return callback(new Error('请选择执法结果'));
			}else{
				callback();
			}
		}
		var _this = this;
		var RectificationSheet = (rule, value, callback) => {
			if(_this.gridParam.NextOperate == 2 && value.length <= 0){
				return callback(new Error('请选择执法结果'));
			}else{
				callback();
			}
		}
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
				ImageUrl:'',
				ExplanatoryNotes:'',
				Grouping:1,
				EnforcementResult:{
					datas:[],
					code:''
				},
				PermissionSettings:[],
				PermissionSettingsDatas:[],
				ProcessingResult:[],
				ProcessingResultDatas:[],
				NextOperate:0,
				RectificationSheet:[],
				RectificationSheetDatas:[],
				currentRow:''
            },
			rules:{
				ImageUrl:{required:true,message:'请上传图片',trigger:'change'},
				ExplanatoryNotes:{required:true,message:'请输入说明注释',trigger:'change'},
				Grouping:{required:true,message:'请选择分组',trigger:'blur'},
				EnforcementResult:{required:true,trigger:'blur'},
				PermissionSettings:{required:true,message:'请选择权限',trigger:'change'},
				ProcessingResult:{required:true,message:'请选择关联巡查处理结果',trigger:'change'},
				NextOperate:{required:true,message:'请选择下一步操作',trigger:'change'},
				RectificationSheet:{validator:RectificationSheet,trigger:'change'}
			},
            title:'修改',
			ModifyId:'',
			TitleId:'',
			TitleName:'',
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
			this.GetEnforcementResults();
			this.GetRoleList();
			this.GetProcessingResults();
			this.GetRectificationList();			
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
                        this.getBasicOptionList();
                        this.GetEnforcementResults();
                        this.GetRoleList();
                        this.GetProcessingResults();
                        this.GetRectificationList();
                    }else{
                        this.inspectionlist.datas = [];
                        this.inspectionlist.code = "";
                        this.tablelist = [];
                    }
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
        // addTitle() {
        //     if(this.gridParam.Text != ''){
        //         let data = {
        //             "StoreTypeId":this.operationlist.code,
        //             "TaskTypeId":this.inspectionlist.code,                    
        //             "Id":this.gridParam.Id,
        //             "Text":this.gridParam.Text,
        //             "IsDefault":this.gridParam.IsDefault,
        //             "IsDeadline":this.gridParam.IsDeadline,
        //             "IsReform":this.gridParam.IsReform,
        //             "ProcessType":0,
        //             "Type":5,
        //             "IsAuto":this.gridParam.IsEnforceVoucher,
        //         }
        //         this.$api.SaveBasicOption(data).then(
        //             res => {
        //                 if(res.IsSuccess){
        //                     this.gridParam.isviewAdd=false;
        //                     this.message(res.Message,1);
        //                     this.getBasicOptionList();
        //                 }else{
        //                     this.message(res.Message,-1)
        //                 }
        //             }
        //         )
        //     }else{
        //         this.message("名称不可为空",2)
        //     }
        // },
        //获取执法结果列表
        getBasicOptionList() {
            let data = {
                "storeTypeId":this.operationlist.code,
                "taskTypeId":this.inspectionlist.code,
				"appId":this.$utils.getUrlKey("appId"),
            }            
            this.$api.GetPatrolEnforceList(data).then(
                res => {
                    if(res.IsSuccess){
                        this.tablelist = res.Data;
                        if(res.Data&&res.Data.length>0){
                            this.total = res.Data.length;
                        }else{
                            this.total = 0;
                        }
                    }
                }
            )
        },
		//获取执法整改单
		GetRectificationList(){
			this.$api.GetRectificationList({}).then(
				res => {
					if(res && res.IsSuccess){
						this.gridParam.RectificationSheetDatas = res.Data;
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
		Enable(rows){
			let data = {
				'id':this.tablelist[rows].Id
			}
			this.$api.EnableConfig(data).then(
				res =>{
					if(res && res.IsSuccess){
						this.message(res.Message,1);
                        this.getBasicOptionList();
					}else{
						this.message(res.Message,-1);
					}
				}
			)
		},
		Disable(rows){
			let data = {
				'id':this.tablelist[rows].Id
			}
			this.$api.DisableConfig(data).then(
				res =>{
					if(res && res.IsSuccess){
						this.message(res.Message,1);
                        this.getBasicOptionList();
					}else{
						this.message(res.Message,-1);
					}
				}
			)
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
		
		getPatrolEnforceById(){
			this.title = '修改';
			this.ModifyId = this.gridParam.currentRow.Id;
			this.TitleId = this.gridParam.currentRow.TitleId;
			this.TitleName = this.gridParam.currentRow.TitleName;
			this.gridParam.Grouping = this.gridParam.currentRow.GroupId;
			let data = {
				'id':this.gridParam.currentRow.Id
			}
			this.$api.GetPatrolEnforceById(data).then(
				res => {
					if(res && res.IsSuccess){
						if(res.Data){
						
							this.gridParam.ImageUrl = res.Data.ImageUrl;
							this.gridParam.ExplanatoryNotes = res.Data.Description;
							this.gridParam.Grouping = res.Data.GroupId;
							this.gridParam.EnforcementResult.code = res.Data.EnforceResult;
							this.gridParam.PermissionSettings = res.Data.PermissionSetArr;
							this.gridParam.ProcessingResult = res.Data.PatrolResultArr;
							this.gridParam.NextOperate = res.Data.NextOperate;
							this.gridParam.RectificationSheet = res.Data.RectificationArr == null ? [] : res.Data.RectificationArr;
						}else{
                            this.gridParam.EnforcementResult.code = '';
							// this.gridParam.ImageUrl = "";
							// this.gridParam.ExplanatoryNotes = "";
							// this.gridParam.EnforcementResult.code = "";
							// this.gridParam.PermissionSettings = [];
							// this.gridParam.ProcessingResult = [];
							// this.gridParam.NextOperate = 0;
							// this.gridParam.RectificationSheet = [];
							// this.$refs.gridParam.resetFields();
						}
					}
				}
			)
		},
        //修改执法结果列表
        modifylist(row){
            this.gridParam.isviewAdd=true;  
			this.gridParam.currentRow = row;  
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
		//上传图片
		defaultPicUpload(obj) {
			let fd = new FormData();
			fd.append('upload', obj.file);
			this.$api.UploadImage(fd).then(res => {
				if (res.IsSuccess) {
					this.gridParam.ImageUrl = res.Data;
					this.message('上传成功', 1)
					this.$refs.ImageUrl.clearValidate();
				} else {
					this.message('上传失败', -1)
				}
			}).catch(error => {

			})
		},
		//获取执法结果
		GetEnforcementResults(){
            let data = {
                "StoreTypeId":this.operationlist.code,
                "TaskTypeId":this.inspectionlist.code,
                "ProcessType":0,
                "Type":5,
            }            
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if(res.IsSuccess){
						if(res.Content.length > 0){
							this.gridParam.EnforcementResult.datas = res.Content;
                            this.gridParam.EnforcementResult.datas.unshift(
                                {Id:'',Text:'无'}
                            )
                            this.gridParam.EnforcementResult.code = '';
                        }else{
							this.gridParam.EnforcementResult.code = '';
							this.gridParam.EnforcementResult.datas = [];
						}
                        // if(res.Content&&res.Content.length>0){
                        //     this.total = res.Content.length;
                        // }else{
                        //     this.total = 0;
                        // }
                    }
                }
            )
		},
		//获取处理结果
		GetProcessingResults(){
            let data = {
                "StoreTypeId": this.operationlist.code,
                "TaskTypeId": this.inspectionlist.code,
                "ProcessType": 0,
                "Type": 3,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    if (res.IsSuccess) {
						this.gridParam.ProcessingResultDatas = res.Content;
                        // this.tablelist = res.Content;
                        // this.total = res.Content.length;
                    }
                }
            )
		},
		//获取角色列表
		GetRoleList(){
			this.$api.GetRoleList().then(
				res => {
					if(res && res.IsSuccess){
						for(let item of res.Data){
							item.Id = item.Id.toString();
						}
						this.gridParam.PermissionSettingsDatas = res.Data;
					}
				}
			)
		},
		RuleBtn(formName){
			this.$refs[formName].validate((valid) => {
				if(valid){
					let data = {
						'Id':this.ModifyId,
						'AppId':this.$utils.getUrlKey("appId"),
						"StoreTypeId": this.operationlist.code,
						"TaskTypeId": this.inspectionlist.code,
						'TitleId':this.TitleId,
						'Description':this.gridParam.ExplanatoryNotes,
						'ImageUrl':this.gridParam.ImageUrl,
						'EnforceResult':this.gridParam.EnforcementResult.code,
						'PermissionSetArr':this.gridParam.PermissionSettings,
						'PatrolResultArr':this.gridParam.ProcessingResult,
						'NextOperate':this.gridParam.NextOperate,
						'RectificationArr':this.gridParam.RectificationSheet
					}
					this.$api.SavePatrolEnforce(data).then(
						res => {
							if(res && res.IsSuccess){
								this.message(res.Message,1);
								this.gridParam.isviewAdd = false;
								this.getBasicOptionList();
								this.$refs[formName].resetFields();
							}else{
								this.message(res.Message,-1)
							}
						}
					)
				}else{
					return false
				}
			});
		},
		//规则取消
		resetForm(formName){
			this.$nextTick(function() {
				this.$refs[formName].resetFields();
				// this.gridParam.ImageUrl = "";
				// this.gridParam.ExplanatoryNotes = "";
				// this.gridParam.EnforcementResult.code = "";
				// this.gridParam.PermissionSettings = [];
				// this.gridParam.ProcessingResult = [];
				// this.gridParam.NextOperate = 0;
				// this.gridParam.RectificationSheet = [];
			 })
			this.gridParam.isviewAdd=false;
		},
		cleanContent(formName){
			// this.$nextTick(function() {
				this.$refs[formName].resetFields();
				// this.gridParam.ImageUrl = "";
				// this.gridParam.ExplanatoryNotes = "";
				// this.gridParam.EnforcementResult.code = "";
				// this.gridParam.PermissionSettings = [];
				// this.gridParam.ProcessingResult = [];
				// this.gridParam.NextOperate = 0;
				// this.gridParam.RectificationSheet = [];
			 // })
		},
            getThumbPic(url) {
                if (url != null && url != undefined && url.startsWith('http')) {
                    //做缩略图处理
                    let relaPath = this.getUrlParam(url, 'fileURL');
                    if(this.$utils.isTestEvn()){
                        if (this.$utils.isHttpsProtal()) {
                            return 'https://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                        } else {
                            return 'http://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                        }

                    } else {
                            if (this.$utils.isHttpsProtal()) {
                                return 'https://fileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                            } else {
                                return 'http://fileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                            }
                    }
                }
            },
            getUrlParam(url, paraName) {
                var arrObj = url.split("?");

                if (arrObj.length > 1) {
                    var arrPara = arrObj[1].split("&");
                    var arr;

                    for (var i = 0; i < arrPara.length; i++) {
                        arr = arrPara[i].split("=");

                        if (arr != null && arr[0] == paraName) {
                            return arr[1];
                        }
                    }
                    return "";
                }
                else {
                    return "";
                }
            },
    }
}
