import Pagination from '../../components/Pagination'
import setUser from '../../components/SetUser'
import TreeAreaChoose from '@/components/TreeAreaChoose'
export default {
	name: 'meshUserSetting',
	components: {
			Pagination,
			setUser,
			TreeAreaChoose
	},
	data() {
			return {
					// 搜索表单
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
					// 主体展示
					currentNode:{}, //当前地址节点
					tableGrid: { // 表格数据
						column: {
							userName: '姓名',
							community: '管辖范围',
							role: '角色',
							yetai: '业态/业务',
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
					// 设置业态
					battchsetting: {
							show: false,
							defaultOperId: '',//业态Id
							defaultTaskId: [],//巡查自查
							moreDatas: [],
							ids: [],
							opers: []
					},

					checkUser: [],
			}
		},
	created() {
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
			this.taskTabs.datas = this.taskTabs.datas.concat(tempArr)
		},
		// 查询
		Search(){
			this.initGrid(1)
		},
		// 加载下级节点
		getLoadNode(n,l){
			if(n.hasOwnProperty('data') && n.data == undefined){
				return
			}
			console.log(n)
			this.currentNode = {//当前显示（选中）节点
					Code: n.data.id,
					IsChecked: n.data.IsChecked || true,
					Level: l,
					Name: n.data.name,
					ParentCode: n.data.pId,
			}
			if(!this.currentNode.IsChecked){
				this.message('抱歉，您没有该区域权限', 2)
			}else{
				this.initGrid()
			}
		},
		// 获取本级结点
		getCurrentNode(n){
			this.currentNode = {
					Code: n.id,
					IsChecked: n.IsChecked || true,
					Level: n.level,
					Name: n.name,
					ParentCode: n.pId,
			}
			if(!this.currentNode.IsChecked){
				this.message('抱歉，您没有该区域权限', 2)
			}else{
				this.initGrid()
			}
		},
		// 添加人员
		openAdduser() {
				if (this.currentNode.Code == undefined || this.currentNode.Code.length == 0) {
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
		batchSetting(id, opers) {
				this.battchsetting.defaultOperId = '';
				this.battchsetting.defaultTaskId = [];
				this.battchsetting.moreDatas = [];
				if (opers) {
						this.battchsetting.opers = opers;
						if (opers.length > 0) {
								this.battchsetting.defaultOperId = opers[0].OperateTypeId;
								let idStrs = [];
								for (let i = 0; i < opers[0].BusinessInfo.length; i++) {
										idStrs.push(opers[0].BusinessInfo[i].BusinessId);
								}
								this.battchsetting.defaultTaskId = idStrs;
								let moreDatas = [];
								for (let i = 0; i < opers.length; i++) {
										if (i > 0) {
												// moreDatas.push(opers[i]);
												let chooses = [];
												for (let ktm of  opers[i].BusinessInfo) {
														chooses.push(ktm.BusinessId);
												}
												moreDatas.push({
														OperateTypeName: opers[i].OperateTypeName,
														OperateTypeId: opers[i].OperateTypeId,
														BusinessInfo: chooses
												});
										}
								}
								this.battchsetting.moreDatas = moreDatas;
						}
				}
				let ids = [];
				if (id) {
						ids.push(id);
						this.battchsetting.ids = ids;
				} else {
						if (this.$refs.meshgrid.store.states.selection.length == 0) {
								this.message('请选择要设置的人员', 2);
								return;
						} else {
								for (let itt of this.$refs.meshgrid.store.states.selection) {
										ids.push(itt.UserId);
								}
								this.battchsetting.ids = ids;
						}
				}
				this.battchsetting.show = true;
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

				}).catch(() => {

				});
		},

		// 添加更多业态
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
		// 业态弹框-确定
		setOperTask() {
				let OperateDatas = [];
				let businessInfo = [];
				let pass = true;
				if (this.battchsetting.defaultOperId == '' && this.battchsetting.defaultTaskId.length == 0) {
				} else {
						if (this.battchsetting.defaultOperId == '' && this.battchsetting.defaultTaskId.length > 0) {
								pass = false;
								this.message('请选择业态', 2);
								return;
						} else if (this.battchsetting.defaultOperId != '' && this.battchsetting.defaultTaskId.length == 0) {
								pass = false;
								this.message('请选择业务', 2);
								return;
						} else {
								for (let itt of this.battchsetting.defaultTaskId) {
										let na = '';
										if (itt == 0) {
												na = '巡查'
										} else if (itt == 1) {
												na = '自查'
										}
										businessInfo.push({
												BusinessId: itt,
												BusinessName: na
										});
								}
								OperateDatas.push({
										"OperateTypeId": this.battchsetting.defaultOperId,
										"OperateTypeName": this.topTabs.datas.find(item => {
												return item.Id == this.battchsetting.defaultOperId
										}).Name,
										"BusinessInfo": businessInfo
								});
						}
				}

				if (this.battchsetting.moreDatas.length > 0) {
						for (let ii = 0; ii < this.battchsetting.moreDatas.length; ii++) {
								let temp = [];
								if (this.battchsetting.moreDatas[ii].OperateTypeId == '') {
										this.message('请选择业态', 2);
										pass = false;
										return false;
								}
								if (this.battchsetting.moreDatas[ii].BusinessInfo.length == 0) {
										this.message('请选择业务', 2);
										pass = false;
										return false;
								}
								for (let iii = 0; iii < this.battchsetting.moreDatas[ii].BusinessInfo.length; iii++) {
										let na = '';
										if (this.battchsetting.moreDatas[ii].BusinessInfo[iii] == 0) {
												na = '巡查'
										} else if (this.battchsetting.moreDatas[ii].BusinessInfo[iii] == 1) {
												na = '自查'
										}
										temp.push({
												BusinessId: this.battchsetting.moreDatas[ii].BusinessInfo[iii],
												BusinessName: na
										});
								}
								OperateDatas.push({
										"OperateTypeId": this.battchsetting.moreDatas[ii].OperateTypeId,
										"OperateTypeName": this.topTabs.datas.find(item => {
												return item.Id == this.battchsetting.moreDatas[ii].OperateTypeId
										}).Name,
										"BusinessInfo": temp
								});
						}
				}
				if (pass) {
						let operIds = [];
						for (let ii of OperateDatas) {
								operIds.push(ii.OperateTypeId);
						}
						let allL = operIds.length;
						let newSet = new Set(operIds);
						let newL = newSet.size;
						if (allL != newL) {
								this.message('业态不能重复', 2);
								return;
						}
						this.$api.SubOperateUser(this.battchsetting.ids, OperateDatas).then(res => {
								if (res && res.IsSuccess) {
										this.message('添加成功', 1);
										this.battchsetting.show = false;
										this.initGrid();
								} else {
										this.message(res.Message == null || res.Message == '' ? '添加失败' : res.Message, -1);
								}
						}).catch(res => {
								this.message(res.Message == null || res.Message == '' ? '添加失败' : res.Message, -1);
						})
				}

		},
		// 添加用户弹框 -- 回调
		checkUserData(obj) {
				if (obj) {
						let userIds = [];
						if (obj.length > 0) {
								obj.forEach((value, index) => {
										userIds.push({
												"UserId": value.UserId,
												"UserName": value.Name
										});
								});
						}

						this.$api.SubUserPrivilege(userIds, this.currentNode.Level, this.currentNode.Code).then(res => {
								let _this = this;
								if (res && res.IsSuccess) {
										this.addUserDialog.show = false;
										this.initGrid();
										this.$refs.user.clearData();
								} else {
										this.$message({
												message: res.Message,
												type: 'error',
												duration: 1500,
												center: true,
												onClose() {}
										});
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

		addMoreSetting() {
				this.battchsetting.moreDatas.push(
						{
								id: new Date().getTime(),
								OperateTypeId: '',
								OperateTypeName: '',
								BusinessInfo: []
						}
				)
		},
		// 删除业态
		delMoreSetting(inx) {
				this.battchsetting.moreDatas.splice(inx, 1);
		},

			// 翻页
			onPageNation(page) {//翻页
				console.log(page)
				this.pageNation.pageNum = page.page
				this.pageNation.countPerPage = page.limit
				this.initGrid();
			},
			// 获取列表数据
				initGrid() {
						let data = {
							"UserName": this.userName,
							"UserPhone": this.UserPhone,
							"AreaLevel": this.currentNode.Level,
							"AreaCode": this.currentNode.Code,
							"OperateTypeId": this.topTabs.code,
							"BusinessId": this.taskTabs.code,
							"PageNo": this.pageNation.pageNum,
							"PageSize": this.pageNation.countPerPage,
							"RoleId": this.roles.code
						};
						this.$api.GetUserRoleList(data).then(res => {
								if (res && res.IsSuccess) {
										this.pageNation.total = res.Total;
										this.tableGrid.datas = res.Data;
										this.$refs.meshgrid.bodyWrapper.scrollTop = 0;
								} else {
										this.pageNation.total = 0;
										this.tableGrid.datas = [];
										this.message("暂无数据",1);
								}

						}).catch(r => {});
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
		},
}
