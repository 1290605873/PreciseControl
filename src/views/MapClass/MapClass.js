import Pagination from '@/components/Pagination'
export default {
	components: {
		Pagination
	},
	data() {
		/*var validcodeName = (rule, value, callback) => {
			if (value.length <= 0) {
				callback(new Error('请选择事件'))
			} else {
				callback()
			}
		};*/
		var validMap = (rule, value, callback) => {
			console.log(value)
			if (value.length <= 0) {
				callback(new Error('请选择地图'))
			} else {
				callback()
			}
		};
		return {
			title: "",
			tableList: [],
			total: 0,
			pageSize:20,
            pageNo:1,
			addEditDialog: {
				show: false
			},
			update: {
				id: "",
				name: "",
				remark: "",
				subId: "",
				isEnable: ""
			},
			rules: {
				className: [
					{required: true, message: '请输入分类名称', trigger: 'blur'},
				],
				checkedMap: [
					{required: true, message: '请选择地图', trigger: 'blur'}
				]
			},
			map: {
				className: '',//分类名称
				classDefinition: '',//分类定义
				isIndeterminate: false,
				//mapOptions :['自查管理地图', '巡查管理地图', '品牌经营地图', '人员管理地图'],
				mapOptions: [],
				chooseMapAll: false,
				checkedMap: []
			},
			mapList: [],//备份接口取出的题图数据
			specialConfigDialog: {
				show: false
			},
			//特殊事件表单验证
			specialForm: {
				checkedCities: [],
				isIndeterminate: false,
				cityOptions: [],//特殊事件集合
				checkAll: false,
				cities: '',
				id: ''
			},
			/*rules2: {
				checkedCities: [
					{required: true, message: '请选择事件', trigger: 'blur'},
					{validator: validcodeName, trigger: 'blur'}
				]
			},*/
			arr: [],//存放地图id,
			currentSelectedId: '',//记录当前默认地图的Id
			currentHover: '',//当前滑过的地图
			specialId: '',//当前打开的特殊事件的Id\
			totalEvent: '',
			tempArr: [],
			loading:true
		}
	},
	created() {
		this.GetComboMapNameList();
		this.GetMapCategoryList();

	},
	methods: {
		handleCheckAllChange(val) {//全部选中时val=true，取消全选时val=false;
			let allCities = [];
			for (let item of this.specialForm.cityOptions) {
				allCities.push(item.Id);
			}
			this.specialForm.checkedCities = val ? allCities : [];
			this.specialForm.isIndeterminate = false;
		},
		handleCheckedCitiesChange(value) {//value是当前选中项的集合
			console.log(value)
			let checkedCount = value.length;
			this.specialForm.cities = this.specialForm.cityOptions;
			this.specialForm.checkAll = checkedCount === this.specialForm.cityOptions.length;
			this.specialForm.isIndeterminate = checkedCount > 0 && checkedCount < this.specialForm.cityOptions.length;
			if(value.length > 0){
				for(let itemi of this.specialForm.cityOptions){
					for(let item of value){
						if(itemi.Id == item){
							break
						}else{
							this.$set(itemi, 'setdef', false);
							this.$set(itemi, 'IsDefault', false);
						}
					}
				}
			}else{
				for(let item of this.specialForm.cityOptions){
					this.$set(item, 'setdef', false);
					this.$set(item, 'IsDefault', false);
				}
			}
		},
		hoverMapClass(obj, index){
			this.currentHover = index;
			for (let item of this.specialForm.cityOptions) {
				if (item == obj) {
					this.$set(item, 'def', true);
				} else {
					this.$set(item, 'def', false);
				}
			
				if (item.IsDefault) {
					this.$set(item, 'def', false);
				}
			}
			for (let i = 0; i < this.$refs.divDomTwo.length; i++) {
				if (i == index) {
					this.$refs.divDomTwo[i].style = "background:#F2F6FC";
				} else {
					this.$refs.divDomTwo[i].style = "none";
				}
			
			}
		},
		leaveMapClass(obj, index) {
			for (let item of this.specialForm.cityOptions) {
				if (item == obj) {
					this.$set(item, 'def', false);
				}
			}
			for (let i = 0; i < this.$refs.divDomTwo.length; i++) {
				if (i == index) {
					this.$refs.divDomTwo[i].style = "none";
				}
			}
		},
		
		/*
		**设置默认地图
		*/
		setDefMapClass(obj) {
			let currHasChoose = false;
			for (let item of this.specialForm.checkedCities) {
				if (item.Id == obj.Id) {
					currHasChoose = true;
					break;
				}
			}
			// if (!currHasChoose) {
			//     return;
			// }
			// if (this.specialForm.checkedCities && this.specialForm.checkedCities.length > 0) {
				for (var i = 0; i < this.specialForm.cityOptions.length; i++) {
					if (obj.Id == this.specialForm.cityOptions[i].Id) {
						this.$set(this.specialForm.cityOptions[i], 'def', false);
						this.$set(this.specialForm.cityOptions[i], 'setdef', true);
						this.$set(this.specialForm.cityOptions[i], 'IsDefault', true);
						this.specialForm.checkedCities.findIndex(item => item == this.specialForm.cityOptions[i].Id) == -1 ? this.specialForm.checkedCities.push(this.specialForm.cityOptions[i].Id) : '';
					}
				}
		 //    }else{
			// 	this.specialForm.checkedCities.push(obj.Id);
			// }
		},
		setDefMapClassTwo(obj){
			if (this.specialForm.checkedCities && this.specialForm.checkedCities.length > 0) {
				for (var i = 0; i < this.specialForm.cityOptions.length; i++) {
					if (obj.Id == this.specialForm.cityOptions[i].Id) {
						this.$set(this.specialForm.cityOptions[i], 'setdef', false);
						this.$set(this.specialForm.cityOptions[i], 'IsDefault', false);
					}
				}
			}
		},
		/*
		** 获取地图分类列表
		 */
		GetMapCategoryList() {
			let d = {
				pageNo:this.pageNo,
				pageSize:this.pageSize
			}
			this.$api.GetMapCategoryList(d).then(res => {
				this.loading = false;
				if (res && res.Content && res.Content.length > 0) {
					this.tableList = res.Content;
					this.total = res.Data;
					for (let item of res.Content) {
						if (!item.IsEnable) {
							this.$set(item, 'text', '启用');
						} else {
							this.$set(item, 'text', '禁用');
						}
					}
				}
			}).catch(error => {

			})

		},
		/*
		** 处理选择所有地图
		*/
		handleCheckAllMap(val) {
			let allMap = [];
			for (let item of this.map.mapOptions) {
				allMap.push(item.Id);
			}
			this.map.checkedMap = val ? allMap : [];
			this.map.isIndeterminate = false;
			if (!val) {
				for (var i = 0; i < this.map.mapOptions.length; i++) {
					this.$set(this.map.mapOptions[i], 'def', false);
					this.$set(this.map.mapOptions[i], 'setdef', false);
					this.$set(this.map.mapOptions[i], 'IsDefault', false);
				}
			}
		},
		/*
		** 处理选择的地图
		* 勾选数改变了
		*/
		handleCheckedMapChange(ids) {
			let temp = [];
			this.map.checkedMapCount = ids.length;
			//this.map.checkedMap = this.map.mapOptions;
			this.map.chooseMapAll = this.map.checkedMapCount === this.map.mapOptions.length;
			this.map.isIndeterminate = this.map.checkedMapCount > 0 && this.map.checkedMapCount < this.map.mapOptions.length;
			if (ids && ids.length > 0) {
				if (ids.length == 1) {
					for (let i = 0; i < this.map.mapOptions.length; i++) {
						if (this.map.mapOptions[i].Id == ids[0]) {
							this.$set(this.map.mapOptions[i], 'setdef', true);
							this.$set(this.map.mapOptions[i], 'IsDefault', true);
						}
					}
				}
				let unChoose = [];
				for (let i = 0; i < this.map.mapOptions.length; i++) {
					this.$set(this.map.mapOptions[i], 'def', false);
					//从所有的选项中，找出未选中的
					let has = false;
					for (let j = 0; j < ids.length; j++) {
						if (this.map.mapOptions[i].Id == ids[j]) {
							has = true;
						}
						if (ids[j] == this.currentSelectedId) {
							this.$set(this.map.mapOptions.filter(res => {
								return res.Id == this.currentSelectedId
							})[0], 'setdef', true);
							//this.$set(this.map.mapOptions.filter(res=>{return res.Id==this.currentSelectedId})[0], 'IsDefault', true);
						}
					}
					//循环完选中的，在push未选中的项
					if (!has) {
						unChoose.push(this.map.mapOptions[i]);
					}
				}
				//还原未选中的 default状态
				if (unChoose.length > 0) {
					for (let item of unChoose) {
						this.$set(item, 'c', true);
						this.$set(item, 'setdef', false);
					}
				}

			} else {
				for (let item of this.map.mapOptions) {
					this.$set(item, 'def', false);
					this.$set(item, 'setdef', false);
				}
			}
		},
		/*
		** 获取地图下拉列表数据
		 */
		GetComboMapNameList() {
			let data = {};
			this.$api.GetComboMapNameList(data).then(res => {
				if (res && res.Content && res.Content.length > 0) {
					this.map.mapOptions = res.Content;
				}
			}).catch(error => {

			})
		},

		/*
		** 获取某个地图分类信息
		 */
		GetMapCategoryInfo(id) {
			let data = {
				id: id
			}
			this.$api.GetMapCategoryInfo(data).then(res => {
				//let arr = [];
				if (res && res.Content) {
					this.map.classDefinition = res.Content.Remark;
					this.map.className = res.Content.Name;
					let that = this;
					for (let item of res.Content.MapNames) {
						if (item.IsChecked) {
							if (item.IsDefault) {
								//不能set返回的数据。
								//this.$set(item,"setdef",true);
								for (let i = 0; i < this.map.mapOptions.length; i++) {
									this.$set(this.map.mapOptions[i], "setdef", false);
									if (item.Id == this.map.mapOptions[i].Id) {
										this.$set(this.map.mapOptions[i], "setdef", true);
										this.$set(this.map.mapOptions[i], "IsDefault", true);
									}
								}
							}
							for (let key in item) {
								if (key == "Id") {
									this.map.checkedMap.push(item[key]);
								}
							}
						}
					}
					this.map.chooseMapAll = this.map.checkedMap.length === this.map.mapOptions.length;
					this.map.isIndeterminate = this.map.checkedMap.length > 0 && this.map.checkedMap.length < this.map.mapOptions.length;

				}

			}).catch(error => {

			})

		},
		/*
		** 创建地图分类
		 */
		CreateMapCategory() {
			//从所有选项中找出勾选的项。
			let objarr = [];
			for (let i = 0; i < this.map.mapOptions.length; i++) {
				for (let j = 0; j < this.map.checkedMap.length; j++) {
					let obj = {};
					if (this.map.mapOptions[i].Id == this.map.checkedMap[j]) {

						for (let key in this.map.mapOptions[i]) {
							if (key == 'Id' || key == "IsDefault") {
								obj[key] = this.map.mapOptions[i][key];
							}
						}
						objarr.push(obj);
					}
				}
			}

			let data = {
				"Name": this.map.className,
				"Remark": this.map.classDefinition,
				"MapIds": objarr,
				"SubBy": this.$utils.getUrlKey("userId")
			};
			this.$api.CreateMapCategory(data).then(res => {
				if (res && res.IsSuccess) {
					this.message(res.Message, 1);
					this.GetMapCategoryList();
				} else {
					this.message(res.Message, -1);
				}

			}).catch(error => {

			})
		},
		/*
		** 编辑保存某个地图分类信息
		 */
		UpdateMapCategory() {
			let ids = this.map.checkedMap;
			let isCheckArr = [];
			let objarr = [];

			for (let i = 0; i < this.map.mapOptions.length; i++) {
				for (let j = 0; j < ids.length; j++) {
					if (this.map.mapOptions[i].Id == ids[j]) {
						isCheckArr.push(this.map.mapOptions[i]);

					}
				}

			}
			for (let n = 0; n < isCheckArr.length; n++) {
				let obj = {}
				for (let key in isCheckArr[n]) {
					if (key == "Id" || key == "IsDefault") {
						obj[key] = isCheckArr[n][key];
					}

				}
				objarr.push(obj);
			}
			console.log(objarr)

			let date = new Date();
			let myDate = this.timestampToTime(date);
			let data = {
				"Id": this.update.id,
				"Name": this.map.className,
				"MapIds":
				objarr
				,
				"Remark": this.map.classDefinition,
				"IsEnable": this.update.isEnable,
				"SubBy": this.$utils.getUrlKey("userId"),
				"SubTime": myDate,
			}
			this.$api.UpdateMapCategory(data).then(res => {
				if (res && res.IsSuccess) {
					this.message(res.Message, 1);
					this.GetMapCategoryList();
				} else {
					this.message(res.Message, -1);
				}
			}).catch(error => {

			})

		},
		/*
		** 删除某个地图分类信息
		 */
		DeleteMapCategory(id) {

			this.$confirm('确认要删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					id: id
				}
				this.$api.DeleteMapCategory(data).then(res => {
					if (res) {//&& res.IsSuccess
						this.message(res.Message, 1);
						this.GetMapCategoryList();
					}
				}).catch(error => {

				})
			})

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
			return Y + M + D + " " + h + m + s;
		},

		/*
		** 添加或编辑设置
		 */
		addOrEdit(type, name, id, remark, isEnable, subId, MapNames) {
			for (let item of this.map.mapOptions) {
				this.$set(item, "setdef", false);
			}
			if (type == 1) {
				this.title = "新增分类";
				this.addEditDialog.show = true;
				this.map.classDefinition = '';
				this.map.className = '';
				this.map.checkedMap = [];
			} else {
				this.map.checkedMap = [];

				this.addEditDialog.show = true;
				this.update.id = id;
				this.update.isEnable = isEnable;
				this.GetMapCategoryInfo(id);
				this.title = "编辑分类";
			}

		},
		/*
		** 切换启用禁用状态
		*/
		changeIsEnable(Name, Id, Remark, IsEnable, SubId) {
			let data = {
				id: Id,
				isEnable: !IsEnable
			}
			this.$api.UpdateMapCategoryStatus(data).then(res => {
				if (res) {//&& res.IsSuccess
					this.message(res.Message, 1);
					this.GetMapCategoryList();
				}
			}).catch(error => {

			})
		},
		closeIcon(formName) {
			this.$refs[formName].resetFields();
		},
		/*
		** 重置表单
		 */
		closeAddEditDialog(formName) {
			this.addEditDialog.show = false;
			this.$refs[formName].resetFields();
		},
		/*
		** 保存添加或编辑
		 */
		saveDialog(formName, tit) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (tit == "新增分类") {
						this.CreateMapCategory()
					} else {
						this.UpdateMapCategory()
					}
					this.addEditDialog.show = false;

				} else {
					console.log('error submit!!');
					return false;
				}

			});
		},
		/*
		** 鼠标滑过显示设为默认
		 */
		hoverMap(obj, index) {
			this.currentHover = index;
			for (let item of this.map.mapOptions) {
				if (item == obj) {
					this.$set(item, 'def', true);
				} else {
					this.$set(item, 'def', false);
				}

				if (item.setdef) {
					this.$set(item, 'def', false);
				}
			}
			for (let i = 0; i < this.$refs.divDom.length; i++) {
				if (i == index) {
					this.$refs.divDom[i].style = "background:#F2F6FC";
				} else {
					this.$refs.divDom[i].style = "none";
				}

			}
		},
		/*
		** 鼠标移出隐藏设为默认
		 */
		leaveMap(obj, index) {
			for (let item of this.map.mapOptions) {
				if (item == obj) {
					this.$set(item, 'def', false);
				}
			}
			for (let i = 0; i < this.$refs.divDom.length; i++) {
				if (i == index) {
					this.$refs.divDom[i].style = "none";
				}
			}
		},

		/*
		** 获取特殊事件下拉列表数据
		 */
		GetEventByCategoryId() {
			console.log('111')
			let data = {
				id: this.specialForm.id
			};
			let that = this;
			this.tempArr = [];
			this.$api.GetEventByCategoryId(data).then(res => {
				if (res && res.Content && res.Content.length > 0) {
					this.specialForm.cityOptions = res.Content;
					for (let item of res.Content) {
						if (item.IsChecked) {
							this.tempArr.push(item.Id);
						}
					}
					console.log(this.tempArr);
					this.specialForm.checkedCities = this.tempArr;

				}
			}).catch(error => {

			})
		},
		/*
		**设置默认地图
		*/
		setDefMap(obj) {
			let currHasChoose = false;
			for (let item of this.map.checkedMap) {
				if (item == obj.Id) {
					currHasChoose = true;
					break;
				}
			}
			if (!currHasChoose) {
				return;
			}
			if (this.map.checkedMap && this.map.checkedMap.length > 0) {
				for (var i = 0; i < this.map.mapOptions.length; i++) {
					if (obj.Id == this.map.mapOptions[i].Id) {
						this.$set(this.map.mapOptions[i], 'def', false);
						this.$set(this.map.mapOptions[i], 'setdef', true);
						this.$set(this.map.mapOptions[i], 'IsDefault', true);
						this.currentSelectedId = obj.Id;
					} else {
						this.$set(this.map.mapOptions[i], 'setdef', false);
						this.$set(this.map.mapOptions[i], 'IsDefault', false);
					}

				}
			}
		},
		/*
		** 打开特殊事件
		 */
		specialConfig(id) {
			this.specialConfigDialog.show = true;
			this.specialId = id;
			//this.specialForm.id = id;
			let data = {
				id: id
			};
			this.tempArr = [];
			this.$api.GetEventByCategoryId(data).then(res => {
				if (res && res.Content && res.Content.length > 0) {
					this.specialForm.cityOptions = res.Content;
					for (let item of res.Content) {
						if (item.IsChecked) {
							this.tempArr.push(item.Id);
						}
					}
					let checkedCount = this.tempArr.length;
					this.specialForm.checkAll = checkedCount === res.Content.length;
					this.specialForm.isIndeterminate = checkedCount > 0 && checkedCount < res.Content.length;
					this.specialForm.checkedCities = this.tempArr;

				}
			}).catch(error => {

			})

		},
		/*
		** 特殊事件配置
		 */
		ConfigCategoryEvent() {
			let array = [];
			for (let item of this.specialForm.checkedCities) {
				for(let itemi of this.specialForm.cityOptions){
					if(item == itemi.Id){
						array.push(itemi);
					}
				}
			}
			console.log(array)
			// array = this.specialForm.cityOptions
			let data = {
				id: this.specialId,
				eventIds: array,
				subBy: this.$utils.getUrlKey("userId")
			}
			this.$api.ConfigCategoryEvent(data).then(res => {
				if (res && res.IsSuccess) {
					this.message(res.Message, 1);
				}else{
					this.message(res.Message, -1);
				}
			}).catch(error => {

			})
		},
		closeSpecialDia(formName) {
			this.resetForm(formName)
		},
		/*
		** 取消特殊事件
		 */
		resetForm(formName) {
			this.specialForm.id = this.specialId;
			//this.GetEventByCategoryId();
			this.specialForm.checkedCities = this.tempArr;
			this.specialConfigDialog.show = false;
			this.$refs[formName].resetFields();
		},
		/*
		** 保存特殊事件
		 */
		saveSpecialEvent(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					console.log("验证成功");
					this.ConfigCategoryEvent();
					this.specialConfigDialog.show = false;
				} else {
					console.log('error submit!!');
					return false;
				}

			});
		},
		// 翻页
        Pagination(v){
			this.pageNo=v.page
			this.pageSize=v.limit
			this.GetMapCategoryList()
		  }
	}
}