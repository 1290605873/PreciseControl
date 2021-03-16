import Pagination from "@/components/Pagination";

export default {
    components: {
        Pagination,
    },
	data(){
		return{
			NameofEmployee:'',
			phonenumber:'',
			list:[],
			Loading:false,
			total:0,
			page:1,
			rows:20,
			isviewAdd:false,
			NameofEmployeeAdd:{
				code:'',
				datas:[]
			},
			phonenumberAdd:'',
			OperationType:0,
			EmpName:'',
			EmpPhone:'',
			dialogallEmployeesVisible:false,
			selectedEmployees:[],
			searchOneUserName:'',
			employeesLoading:false,
			allEmployees:{
				Datas:[]
			},
			employeesPagination: {
				currentPage: 1,
				pageSizes: [10, 20, 30, 40],
				pagesize: 10,
				layout: "total, sizes, prev, pager, next, jumper",
				total: 0,
				dialogPagerCount: 5
			},
			deepCopyData:[],
			MaxConcurrent:0,
			Termofvalidity:''
		}
	},
	created:function(){
		this.queryList();
		this.GetAuthorizedApp();
	},
	methods:{
		//实现对象的深度拷贝
		deepCopy(target){
			 if(typeof target !== 'object') return ;//判断目标类型，来创建返回值
			 var newObj = target instanceof Array ? [] : {};
			 for(var item in target){  //只复制元素自身的属性，不复制原型链上的
				 if(target.hasOwnProperty(item)){
					newObj[item] = typeof target[item] == 'object' ? this.deepCopy(target[item]) : target[item] //遍历判断属性值类型
				 }
			 }
			 return newObj
		},
		queryList(){
			let data = {
				'AppId':this.$utils.getUrlKey('appId'),
				// 'AppId':'22acb585-3c7e-405b-8bd8-753eae8c308e',
				'EmpName':this.NameofEmployee,
				'EmpPhone':this.phonenumber,
				'PageIndex':this.page,
				'PageSize':this.rows
			}
			this.$api.GetAuthorizedAppUserLst(data).then(
				res => {
					if(res && res.IsSuccess){
						this.list = res.Data.Item1;
						this.total = res.Data.Item2;
					}else{
						this.message(res.Message,-1)
					}
				}
			)
		},
		addList(){
			this.dialogallEmployeesVisible = true;
			this.OperationType = 0;
			this.selectedEmployees = [];
			// if(this.selectedEmployees.length > 0){
			this.searchOneUserName = '';
			this.$nextTick(() => {
				this.$refs.eleEmployees.clearSelection();
			});
			this.GetAppUsers();
			// }
		},
		DelEByIds(rows){
			this.OperationType = 2;
			let data = {
				'PaaLst':[this.list[rows]],
				'OperationType':this.OperationType
			}
			this.$confirm('是否确认删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$api.OperateAuthorizedAppUser(data).then(res => {
					if(res && res.IsSuccess){
						this.message(res.Message==null||res.Message==''?'删除成功':res.Message,1)
						this.queryList();
					}else{
						this.message(res.Message==null||res.Message==''?'删除失败':res.Message,-1)
					}
				}).catch(error => {
				});
			}).catch(() => {
			});  
			// this.$api.aaa(data).then(
			// 	res => {
			// 		if(res && res.IsSuccess){
			// 			this.message(res.Message,1)
			// 		}else{
			// 			this.message(res.Message,-1)
			// 		}
			// 	}
			// )
		},
		PreservationAdd(){
			let data = {
				'AppId':this.$utils.getUrlKey('appId'),
				// 'AppId':'22acb585-3c7e-405b-8bd8-753eae8c308e',
				'SubId':this.$utils.getUrlKey('userId'),
				'UserId':this.NameofEmployeeAdd.code,
				'EmpName':this.EmpName,
				'EmpPhone':this.EmpPhone,
				// NameofEmployeeAdd:this.NameofEmployeeAdd,
				// phonenumberAdd:this.phonenumberAdd,
				'OperationType':this.OperationType
			}
			this.$api.OperateAuthorizedAppUser(data).then(
				res =>{
					if(res && res.IsSuccess){
						this.message(res.Message,1)
						this.isviewAdd = false;
						this.queryList();
					}else{
						this.message(res.Message,-1)
					}
				}
			)
		},
		GetAppUsers(){
			this.employeesLoading = true;
			let data = {
				'AppId':this.$utils.getUrlKey('appId'),
			}
			this.$api.GetAppUsers(data).then(
				res => {
					if(res && res.IsSuccess){
						this.employeesLoading = false;
						for(let item of res.Data){
							item.EmpName = item.Name;
							item.EmpPhone = item.Phone;
							item.AppId = this.$utils.getUrlKey('appId');
						}
						this.allEmployees.Datas = this.deepCopy(res.Data);
						this.deepCopyData = this.deepCopy(res.Data);
					  for (var i = 0; i < this.allEmployees.Datas.length; i++) {
						this.$set(this.allEmployees.Datas[i], "deleteBtn", false);
					  }
					}
				}
			)
		},
		handleselectedEmployees(val){
			this.selectedEmployees = val;
		},
		userSearch(){
			if(this.searchOneUserName == ''){
				this.GetAppUsers();
			}else{
				this.allEmployees.Datas = this.deepCopyData.filter(item => item.Name.match(this.searchOneUserName))
			}
		},
		//职员
		deleteSelectedEmployees(id) {
		  for (var i = 0; i < this.selectedEmployees.length; i++) {
			var cur = this.selectedEmployees[i];
			if (cur.UserId == id) {
			  this.selectedEmployees.splice(i, 1);
			  cur.deleteBtn = false;
			  this.$refs.eleEmployees.toggleRowSelection(cur);
			  break;
			}
		  }
		},
		deleteEmployeesBtnOver(id) {
		  for (var i = 0; i < this.selectedEmployees.length; i++) {
			var cur = this.selectedEmployees[i];
			if (cur.UserId == id) {
			  this.selectedEmployees[i].deleteBtn = true;
			}
		  }
		},
		deleteEmployeesBtnOut(id) {
		  for (var i = 0; i < this.selectedEmployees.length; i++) {
			var cur = this.selectedEmployees[i];
			if (cur.UserId == id) {
			  this.selectedEmployees[i].deleteBtn = false;
			}
		  }
		},
		employeesListpageSize(){
			
		},
		employeesListpageCurrent(){},
		selectUsersCommit(){
			console.log(this.selectedEmployees)
			if(this.selectedEmployees.length > 0){
				let data = {
					'OperationType':this.OperationType,
					'PaaLst':this.selectedEmployees
				}
				this.$api.OperateAuthorizedAppUser(data).then(
					res =>{
						if(res && res.IsSuccess){
							this.message(res.Message,1)
							this.dialogallEmployeesVisible = false;
							this.queryList();
						}else{
							this.message(res.Message,-1)
						}
					}
				)
			}else{
				this.message('请选择员工',2)
			}
		},
		GetAuthorizedApp(){
			let data = {
				'AppId':this.$utils.getUrlKey('appId'),
			}
			this.$api.GetAuthorizedApp(data).then(
				res => {
					if(res && res.IsSuccess){
						this.MaxConcurrent = res.Data.MaxConcurrent;
						this.Termofvalidity = res.Data.AuthorizedDate.substring(0,10) +' 至 '+ res.Data.ExpirationDate.substring(0,10);
						// console.log(res.Data)
					}
				}
			)
		}
	}
}