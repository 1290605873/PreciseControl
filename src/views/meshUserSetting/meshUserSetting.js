import Pagination from '../../components/Pagination'
import setUser from '../../components/SetUser'
import BatchSetting from './BatchSetting.vue'
import GridTreeAreaChoose from '@/components/GridTreeAreaChoose'
export default {
	name: 'meshUserSetting',
	components: {
			Pagination,
			setUser,
			GridTreeAreaChoose,
			BatchSetting
	},
	data() {
			return {
				// 搜索表单
				userPhone:'', // 账号
				userName: '', // 姓名
				roles: { // 角色
					code: '',
						list: []
				},
				topTabs: {//顶部业态
					datas: [],
					code: "" //当前业态值
				},
				taskTabs: {//业态下的任务
					code: "", //当前值
					datas: []
				},
				tagTabs: {//业态下的任务
					id: "", //当前值
					datas: []
				},
				// 主体展示
				baseNode:{},
				currentNode:{}, //当前地址节点
				tableGrid: { // 表格数据
					Loading:true,
					column: {
						userName: '姓名',
						UserPhone:'账号',
						community: '管辖范围',
						role: '角色',
						yetai: '业态/标签/业务',
						oper: '操作',
					},
					datas: [],
				},
				pageNation: {//分页
					total: 0,
					pageNum: 1,//页数
					countPerPage: 20//每页数
				},
				// 添加人员
				defaultCheckuserId: [],
				addUserDialog: {
					show: false,
					title: "添加人员"
				},
				//设置业态
				batchSetting:{
					show:false,
					data:{
						ids: [], // 人员Id集合
						operate: [], // 业态数据表
						tag:[] //标签
					},
					topTab:[], // 业态列表
					taskTab:[], // 巡查自查列表
					baseNode:{}
				},
				//设置标签
				tagSetting:{
					data:{
						ids:[],//标签集合
						list:[]//标签数据表
					}
				},
				isSearchAll: true,
				isSelect:false
			}
		},
	created() {
		this.getLabelList()
		this.getRoleInfoByOrgId()
		this.getOperateInfo()
		this.getBasicOptionList()
		
	},
	methods: {
		// 获取角色列表
		getRoleInfoByOrgId() {
			this.$api.GetRoleInfoByOrgId().then(res => {
					if (res) {
						this.roles.list = res;
					}
			}).catch(r => {})
		},
		//获取一级业态列表
		getOperateInfo() {
			this.$api.GetOperateInfo(1).then(res => {
				if (res) {
						this.topTabs.datas = res;
					}
				}).catch(r => {});
		},
		// 获取业务列表
		getBasicOptionList() {
			let tempArr = [
				{Id: 0,Text: "巡查"},
				{Id: 1,Text: "自查"}
			]
			this.taskTabs.datas = this.$utils.deepCopy(tempArr)
		},
		getLabelList() {
			let data = {
				"appId": this.$utils.getUrlKey("appId"),
        		"type": 1
			}
			this.$api.GetLabelList(data).then(res => {
				if (res) {
					this.tagTabs.datas = res.labelList;
				}
			}).catch(r => {})

		},
		// 查询
		Search(){
			this.isSearchAll = true;
			this.initGrid()
		},
		// 加载下级节点
		getLoadNode(n,l){
			if((n.hasOwnProperty('data') && n.data == undefined) || !n.hasOwnProperty('data')){
				return
			}
			this.isSearchAll = false
			if(n.isBase){
				this.baseNode = n.data
				this.isSearchAll = true
			}
			this.currentNode = {//当前显示（选中）节点
					Code: n.data.id,
					IsChecked: n.data.IsChecked,
					Level: l,
					Name: n.data.name,
					ParentCode: n.data.pId,
			}
			this.initGrid()
		},
		// 获取本级结点
		getCurrentNode(n){
			this.currentNode = {
					Code: n.id,
					IsChecked: n.IsChecked,
					Level: n.level,
					Name: n.name,
					ParentCode: n.pId,
			}
			this.isSearchAll = false
			this.initGrid()
		},
		// 添加人员
		openAdduser() {
				if (this.currentNode.Code == undefined || this.currentNode.Code.length == 0 || this.currentNode.Code == '0-000000') {
						this.message('请指定一个区域', 2);
				} else {
						if (this.currentNode.IsChecked) {
								this.addUserDialog.show = true;
								this.defaultCheckuserId = [];
								this.addUserDialog.title = '添加人员' + '(' + this.currentNode.Name + ')';
						} else {
								this.message('抱歉，您没有该区域权限', 2);
						}

				}
		},
		// 批量设置
		openBatchSetting(id, o) {
				o = o ? o : []
				this.batchSetting.topTab = this.$utils.deepCopy(this.topTabs.datas)
				this.batchSetting.taskTab = this.$utils.deepCopy(this.taskTabs.datas)
				this.batchSetting.baseNode = this.$utils.deepCopy(this.baseNode)
				if (id) {
					let name = this.tableGrid.datas.find(i =>i.UserId == id).UserName
					this.batchSetting.data.ids = [
						{UserId:id,Name:name}
					];
					this.batchSetting.data.operate = this.$utils.deepCopy(o.OperateInfo)
					this.batchSetting.data.areas = [
						{
							AreaCode:o.AreaCode,
							AreaLevel:o.AreaLevel,
							AreaName:o.CommunityName
						}
					]
					if(o.LabelInfo && o.LabelInfo.length>0){
						this.batchSetting.data.tag = this.$utils.deepCopy(o.LabelInfo);
					}else{
						this.batchSetting.data.tag = []
					}
					
				} else {
					this.batchSetting.data.areas = []
					this.batchSetting.data.operate = []
					this.batchSetting.data.ids = []
					this.batchSetting.data.tag = []
				}
				this.batchSetting.show = true
		},
		// 批量删除
		batchDelUserInGrid() {
				if (this.$refs.meshgrid.store.states.selection.length == 0) {
						this.message('请选择要删除的人员', 2);
						return;
				}
				this.$confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
				}).then(() => {
						let userIds = [];
						for (let itt of this.$refs.meshgrid.store.states.selection) {
								userIds.push(itt.UserRealId);
						}
						this.$api.DelUserRole(userIds).then(res => {
								if (res && res.IsSuccess) {
										this.message('删除成功', 1);
										this.initGrid();
								} else {
										this.message('删除失败', -1);
								}

						}).catch(error => {
								this.message('删除失败', -1);
						});

				}).catch(() => {});
		},
		// 删除本条
		delGridItem(id) {
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let userIds = [];
				userIds.push(id);
				this.$api.DelUserRole(userIds).then(res => {
					if (res && res.IsSuccess) {
						this.message('删除成功', 1);
						this.initGrid();
					} else {
						this.message('删除失败', -1);
					}
				}).catch(error => {
					this.message('删除失败', -1);
				});
			}).catch(() => {});
		},
		// 添加用户弹框 -- 回调
		checkUserData(obj) {
				if (obj && obj.length > 0) {
					let userIds = obj.map(i=>{
						return {
							"UserId": i.UserId,
							"UserName": i.Name
						}
					})

					this.$api.SubUserPrivilege(userIds, this.currentNode.Level, this.currentNode.Code).then(res => {
						let _this = this;
						if (res && res.IsSuccess) {
							this.addUserDialog.show = false;
							this.initGrid();
							this.$refs.user.clearData();
						} else {
							this.message(res.Message,-1);
						}
					}).catch(r => {})
				} else {
					this.addUserDialog.show = false;
				}

		},
		// 关闭用户弹框
		closeUserDialog() {
			this.addUserDialog.show = false;
			this.$refs.user.clearData();
		},
		// 关闭批量设置
		CloseBatchSetting(v){
			this.batchSetting.show = false
			if(v[0]){
				this.initGrid()
			}
		},
		// 翻页
		onPageNation(page) {//翻页
			this.pageNation.pageNum = page.page
			this.pageNation.countPerPage = page.limit
			this.initGrid();
		},
		// 获取列表数据
		async initGrid() {
			this.tableGrid.Loading = true;
				let NewData = {
					"UserName": this.userName,
					"UserPhone": this.userPhone,
					"AreaLevel": this.currentNode.Level,
					"AreaCode": this.currentNode.Code,
					"OperateTypeId": this.topTabs.code,
					"BusinessId": this.taskTabs.code,
					"PageNo": this.pageNation.pageNum,
					"PageSize": this.pageNation.countPerPage,
					"RoleId": this.roles.code,
					"LabelId":this.tagTabs.id
				};
				let data = {
					"UserName": '',
					"UserPhone": '',
					"AreaLevel": this.currentNode.Level,
					"AreaCode": this.currentNode.Code,
					"OperateTypeId": '',
					"BusinessId": '',
					"PageNo": this.pageNation.pageNum,
					"PageSize": this.pageNation.countPerPage,
					"RoleId": '',
					"LabelId":this.tagTabs.id
				};
				let res;
				if(this.isSearchAll){

					res = await this.$api.GetUserRoleListNew(NewData)
				}else{
					this.$forceUpdate()
					this.userName = '';
					res = await this.$api.GetUserRoleList(data)
				}
				this.tableGrid.Loading = false;
				if (res && res.IsSuccess) {
					    
						this.pageNation.total = res.Total;
						this.tableGrid.datas = res.Data;
						this.$refs.meshgrid.bodyWrapper.scrollTop = 0;
				} else {
						this.pageNation.total = 0;
						this.tableGrid.datas = [];
						this.message("暂无数据",1);
				}
		},
		delUserRole() {
				this.$api.DelUserRole().then(res => {
						if (res && res.IsSuccess) {
								this.message("删除成功", 1);
						} else {
								this.message(res.Message == null || res.Message == '' ? '删除失败' : res.Message, -1);
						}
				}).catch(res => {
						this.message(res.Message == null || res.Message == '' ? '删除失败' : res.Message, -1);
				});
			},
		// 表格选项发生变化
		getSelectChange(a){
			this.isSelect = a.length > 0
		}
	},
}
