import Pagination from "@/components/Pagination";
export default {
	components: {
		Pagination
	},
	data() {
		return {
			searchValue:{
				page:1,
				rows:20,
				total:0,
			},
			title:'',
			list:[],
			Loading:false,
			ScreeningTemplateViews:false,
			ruleForm:{
				TemplateName:'',
				ApplicationScenario:'',
				Remark:'',
			},
			rules:{
				TemplateName:[
					{
						required: true,message: '请输入筛选模板名称',trigger: 'blur'
					}
				],
				ApplicationScenario:[
					{
						required: true, message: '请选择应用场景', trigger: 'change'
					}
				]
			},
			CriteriaList:[],
			CriteriaLoading:false,
			disabledBtn:false,
			SelectFilterCriteria:{
				show:false,
				SeeRule:'',
				SeeRuleDatas:[],
				list:[],
				Loading:false,
				total:0,
				page:1,
				rows:20,
			},
			choseList:[],
			EditingConditions:{
				show:false,
				
			},
			EditingForm:{
				FilterName:'',
				DefaultSelection:[],
				DefaultSelectionDatas:[]
			},
			EditIndex:'',
			modifId:'',
		}
	},
	created(){
		this.GetMapTemplatePage();
	},
	methods:{
		//新建
		NewTemplate(){
			this.ScreeningTemplateViews = true;
			this.CriteriaList = [];
			this.ruleForm.TemplateName = '';
			this.ruleForm.ApplicationScenario = 1;
			this.ruleForm.Remark = '';
			this.modifId = '';
			this.SelectFilterCriteria.SeeRule = '';
			this.title = '新增筛选模板';
		},		
		//获取表格
		GetMapTemplatePage(){
			let data = {
				'PageNo':this.searchValue.page,
				'PageSize':this.searchValue.rows,
			}
			this.$api.GetMapTemplatePage(data).then(
				res => {
					if(res && res.IsSuccess){
						this.list = res.Content;
						this.searchValue.total = res.Data;
					}
				}
			)
		},
		//模板配置
		TemplateConfiguration(id){
			this.SelectFilterCriteria.SeeRule = '';
			this.ScreeningTemplateViews = true;
			this.title = '编辑筛选模板';
			let data = {
				'Id':id
			}
			this.$api.GetMapTemplateById(data).then(
				res => {
					if(res && res.IsSuccess){
						this.modifId = res.Content.Id;
						this.ruleForm.TemplateName = res.Content.Name;
						this.ruleForm.ApplicationScenario = res.Content.Scenarios;
						this.ruleForm.Remark = res.Content.Remark;
						this.CriteriaList = res.Content.MapStatusLst;
					}
				}
			)
		},
		//删除
		deleteTemplate(id){
			let data = {
				'Id':id
			}
			this.$confirm('确认删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$api.DeleteMapTemplate(data).then(res => {
					if (res && res.IsSuccess) {
						this.message(res.Message, 1);
						this.GetMapTemplatePage();
					} else {
						this.message(res.Message, -1);
					}
				}).catch(error => {

				});
			}).catch(() => {

			});
		},
		//根据Id查询地图模板
		// GetMapTemplateById(id){
		// 	this.ScreeningTemplateViews = true;
		// 	let data = {
		// 		'Id':id
		// 	}
		// 	this.$api.GetMapTemplateById(data).then(
		// 		res => {
		// 			if(res && res.IsSuccess){
		// 				this.modifId = res.Content.Id;
		// 				this.ruleForm.TemplateName = res.Content.Name;
		// 				this.ruleForm.ApplicationScenario = res.Content.Scenarios;
		// 				this.ruleForm.Remark = res.Content.Remark;
		// 				this.CriteriaList = res.Content.MapStatusLst;
		// 			}
		// 		}
		// 	)
		// },
		//选择筛选条件
		SelectCriteria(){
			this.SelectFilterCriteria.show = true;
			this.SelectFilterCriteria.page = 1;
			this.SelectFilterCriteria.rows = 20;
			this.GetMapFilterCondition();
			this.GetMapDataNames();
			this.choseList = [];
		},
		//上移
		MoveUpward(index,row){
			if(index > 0){
				let that = this;
				let upDate = that.CriteriaList[index - 1];
				that.CriteriaList.splice(index - 1, 1);
				that.CriteriaList.splice(index,0, upDate);
			}else{
				this.message('已经是第一条，不可上移',2)
			}
		},
		//下移
		MoveDown(index,row){
			let that = this;
			if ((index + 1) === that.CriteriaList.length){
				this.message('已经是最后一条，不可下移',2)
			} else {
				let downDate = that.CriteriaList[index + 1];
				that.CriteriaList.splice(index + 1, 1);
				that.CriteriaList.splice(index,0, downDate);
			}
		},
		//编辑
		EditByIds(row){
			this.EditingConditions.show = true;
			this.EditIndex = row;
			this.EditingForm.DefaultSelection = [];
			this.EditingForm.FilterName = this.CriteriaList[row].Title == null ? this.CriteriaList[row].Name : this.CriteriaList[row].Title;
			this.EditingForm.DefaultSelectionDatas = this.CriteriaList[row].FieldDataDefault;
			if(this.EditingForm.DefaultSelectionDatas.length > 0){
				for(let item of this.EditingForm.DefaultSelectionDatas){
					if(item.IsSelected == true){
						this.EditingForm.DefaultSelection.push(item.Key)
					}
				}
			}
		},
		//删除
		DelEByIds(id){
			this.$confirm('确认删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.CriteriaList.splice(this.CriteriaList.findIndex(item => item.MapStatusId == id),1);
				console.log(this.CriteriaList)
			}).catch(() => {
			
			});
			
		},
		resetForm(formName){
			// this.$nextTick(function() {
			//     this.$refs[formName].resetFields();
			// });
			if(this.$refs[formName] != undefined){
				this.$refs[formName].resetFields();
			}
			this.ScreeningTemplateViews = false;
		},
		RuleBtn(formName){
			this.$refs[formName].validate((valid) => {
				if(valid){
					if(this.CriteriaList.length <= 0){
						this.message('请选择筛选条件',2);
						return;
					}
					let CriteriaList = [];
					
					this.CriteriaList.forEach((item,i) => {
						CriteriaList.push(
							{
								'MapStatusId':item.Id == undefined ? item.MapStatusId : item.Id,
								'Sort':i,
								'Title':item.Title,
								'FieldDataDefault':item.FieldDataDefault
							}
						)
					})
					let data = {
						'Id':this.modifId,
						'Name':this.ruleForm.TemplateName,
						'Remark':this.ruleForm.Remark,
						'Scenarios':this.ruleForm.ApplicationScenario,
						'FilterConditions':CriteriaList
					}
					this.$api.SaveMapTemplate(data).then(
						res => {
							if(res && res.IsSuccess){
								this.ScreeningTemplateViews = false;
								this.message(res.Message,1);
								this.GetMapTemplatePage();
							}else{
								this.message(res.Message,-1);
							}
						}
					)
				}else{
					return false;
				}
			})
		},
		//选择筛选条件列表
		GetMapFilterCondition(){
			let data = {
				'MapDataType':this.SelectFilterCriteria.SeeRule,
				'PageNo':this.SelectFilterCriteria.page,
				'PageSize':this.SelectFilterCriteria.rows,
			}
			let _this = this;
			this.$api.GetMapFilterCondition(data).then(
				 res => {
					 if(res && res.IsSuccess){
						if(res.Content.length > 0){
							this.SelectFilterCriteria.list = res.Content;
							this.SelectFilterCriteria.total = res.Data;
							for(let item of res.Content){
								for(let itemi of _this.CriteriaList){
									if(item.Id == itemi.MapStatusId || item.Id == itemi.Id){
										this.$nextTick(() => {
											this.$refs.tableSelect.toggleRowSelection(item,true);
										})
									}
								}
							}
						}
						
					 }
				 }
			)
		},
		/*
		** 数据源
		 */
		GetMapDataNames(){
		    let data = {
		        'mapType':-1
		    }
		    this.$api.GetMapDataNames(data).then(res =>{
		        if(res && res.IsSuccess){
		            this.SelectFilterCriteria.SeeRuleDatas = res.Content;
		        }
		    }).catch(error =>{
		
		    })
		},
		handleSelectionApp(val){
			this.choseList = val;
			let hash = {}
			this.choseList = this.choseList.reduce((item, next) => {
				if (!hash[next.Id]) {
					hash[next.Id] = true
					item.push(next)
				}
				return item
			}, [])
		},
		RuleBtnCriteria(){
			this.CriteriaList = this.choseList;
			this.SelectFilterCriteria.show = false;
		},
		unique(arr){
			return Array.from(new Set(arr))
		},
		RuleBtnEditing(){
			this.EditingConditions.show = false;
			
			if(this.EditingForm.DefaultSelectionDatas.length > 0){
				for(let item of this.EditingForm.DefaultSelectionDatas){
					item.IsSelected = false;
				}
				if(this.EditingForm.DefaultSelection.length > 0){
					for(let item of this.EditingForm.DefaultSelection){
						for(let itemi of this.EditingForm.DefaultSelectionDatas){
							if(itemi.Key == item){
								itemi.IsSelected = true;
							}
						}
					}
				}
			}else{
				this.EditingForm.DefaultSelectionDatas = [];
			}
			this.CriteriaList[this.EditIndex].Title = this.EditingForm.FilterName;
			this.CriteriaList[this.EditIndex].FieldDataDefault = this.EditingForm.DefaultSelectionDatas;
		}
	},
}