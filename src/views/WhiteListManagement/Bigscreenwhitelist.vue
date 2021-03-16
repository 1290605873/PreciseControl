<template>
	<div class="Bigscreenwhitelist main-container">
        <el-form inline>
            <el-form-item>
                <el-input v-model="storeName" clearable placeholder="请输入馆名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="ConcurrentNumberone" oninput = "value=value.replace(/[^\d]/g,'')" clearable placeholder="请输入并发数"></el-input>
            </el-form-item>
            <el-form-item>
                至
            </el-form-item>
            <el-form-item>
                <el-input v-model="ConcurrentNumbertwo" oninput = "value=value.replace(/[^\d]/g,'')" clearable placeholder="请输入并发数"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryList">查 询</el-button>
            </el-form-item>
			<br>
            <el-form-item>
                <el-button type="primary" plain @click="addList">添加</el-button>
                <el-button type="primary" plain @click="privilegeList">特权用户</el-button>
				
            </el-form-item>
        </el-form>
		<el-table
		 class="main-table" 
		 :data="list" 
		 v-loading="Loading" 
		 border
		 highlight-current-row
		 ref="table" 
		 height="100" 
		 id="table" 
		 @selection-change="">
			<el-table-column type="index" align="" label="序号" show-overflow-tooltip width="50">
			</el-table-column>
			<el-table-column property="AppName" align="" show-overflow-tooltip label="馆名称" width="">
			</el-table-column>
			<el-table-column property="MaxConcurrent" align="" show-overflow-tooltip label="并发数" width="">
			</el-table-column>
			<el-table-column property="CameraMaxPlay" align="" show-overflow-tooltip label="最大播放路数" width="">
			</el-table-column>
			<el-table-column property="" align="" show-overflow-tooltip label="有效期" width="">
				<template slot-scope="scope">
					<span>{{scope.row.AuthorizedDate.substring(0,10) +' 至 '+ scope.row.ExpirationDate.substring(0,10)}}</span>
				</template>
			</el-table-column>
			<el-table-column property="UndertakingTitle" align="" show-overflow-tooltip label="操作" width="">
				<template slot-scope="scope">
					<el-button type='primary' plain size="mini" @click="modifylist(scope.$index)">修改</el-button>
					<el-button type='danger' size="mini" @click="DelEByIds(scope.$index)">删除</el-button>
				</template>  
			</el-table-column>
		</el-table>
		<pagination 
		 v-show="total>=0" 
		 :total="total" 
		 :page.sync="page" 
		 :limit.sync="rows"
		 @pagination="queryList"
		 class="main-bottom" id="main-bottom" />
		 <el-dialog
		  :title="title" 
		  :visible.sync="isviewAdd" 
		  :close-on-click-modal="false" 
		  class="dialogHeight"
		  width="400px" 
		  height="500">
			<div style="display: flex;">
				<p style="width: 90px;text-align: right;margin-right: 5px;">馆名称:</p>
				<!-- <el-input v-model="storeNameAdd" style="line-height: 44px;width: 250px;" clearable placeholder=""></el-input> -->
				<el-select clearable class="com-width" style="width: 250px;" :disabled="disabled" filterable v-model="storeNameAdd.code" placeholder="请选择馆名称" @change="selectGet">
					<el-option v-for="item in storeNameAdd.datas" :key="item.Id" :label="item.AppName" :value="item.Id"></el-option>
				</el-select>
			</div>
			<div style="display: flex;">
				<p style="width: 90px;text-align: right;margin-right: 5px;">并发数:</p>
				<el-input v-model="ConcurrentNumberoneAdd" style="line-height: 44px;width: 250px;" clearable placeholder="请输入并发数" oninput = "value=value.replace(/[^\d]/g,'')"></el-input>
			</div>
			<div style="display: flex;">
				<p style="width: 90px;text-align: right;margin-right: 5px;">最大播放路数:</p>
				<el-input v-model="MaxplayNum" style="line-height: 44px;width: 250px;" clearable placeholder="请输入最大播放路数" oninput = "value=value.replace(/[^\d]/g,'')"></el-input>
			</div>
			<div style="display: flex;">
				<p style="width: 90px;text-align: right;margin-right: 5px;">有效期:</p>
				<div style="width: 250px;">
					<el-date-picker value-format="yyyy-MM-dd" class="com-width" style="width: 250px;line-height: 44px;" placeholder="请选择开始时间" :picker-options="pickerOptions" v-model="StartTime"
						type="date" @change="startTimeChange" clearable>
					</el-date-picker>
					<el-date-picker placeholder="请选择结束时间" value-format="yyyy-MM-dd" style="width: 250px;line-height: 44px;" :picker-options="pickerOptions1" class="com-width"
						v-model="EndTime" type="date" clearable>
					</el-date-picker>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isviewAdd = false">取 消</el-button>
				<el-button type="primary" @click="PreservationAdd">保 存</el-button>
			</span>
		 </el-dialog>
		<el-dialog
		 title="特权用户"
		 :visible.sync="isviewprivilege"
		 :close-on-click-modal="false" 
		 class="dialogHeight"
		 width="400px">
			<div style="display: flex;padding-right: 40px;">
			 	<p style="width: 80px;text-align: right;margin-right: 5px;">手机号:</p>
			 	<el-input type="textarea" v-model="phonenumber" rows="5" ></el-input>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isviewprivilege = false">取 消</el-button>
				<el-button type="primary" @click="Preservationprivilege">保 存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
    components: {
        Pagination,
    },
	data() {
		return {
			storeName:'',
			ConcurrentNumberone:'',
			ConcurrentNumbertwo:'',
			list:[],
			Loading:false,
			total:0,
			page:1,
			rows:20,
			title:'',
			//添加修改dialog
			isviewAdd:false,
			storeNameAdd:{
				code:'',
				name:'',
				datas:[]
			},
			ConcurrentNumberoneAdd:'',
			//特权dialog
			isviewprivilege:false,
			phonenumber:'',
			phoneId:'',
            StartTime: "",
            EndTime: "",
			pickerOptions:{
				disabledDate(time) {
				return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
				}				
			},
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
			MaxplayNum:'',
			//修改id
			modifyId:'',
			//操作类型  0添加1修改2删除
			OperationType:0,
			disabled:false,
			getAppName:'',
		}
	},
	created: function(){
		this.queryList();
		this.GetAuthorizedApp();
	},
	methods:{
		//获取馆
		GetAuthorizedApp(){
			let data = {
			}
			this.$api.GetAppLst(data).then(
				res => {
					if(res && res.IsSuccess){
						this.storeNameAdd.datas = res.Data.ListInfo;
					}
				}
			)
		},
		selectGet(val){
			for(let item of this.storeNameAdd.datas){
				if(item.Id == val){
					this.getAppName = item.AppName;
				}
			}
		},
		//获取表格
		queryList(){
			if(this.ConcurrentNumberone != '' && this.ConcurrentNumbertwo != ''&& this.ConcurrentNumberone > this.ConcurrentNumbertwo){
				this.message('并发数输入有误，请重新输入',2);
				return
			}
			let data = {
				'AppName':this.storeName,
				'MinConcurrent':this.ConcurrentNumberone == '' ? '' : parseInt(this.ConcurrentNumberone),
				// 'MinConcurrent':0,
				'MaxConcurrent':this.ConcurrentNumbertwo == '' ? '' : parseInt(this.ConcurrentNumbertwo),
				// 'MaxConcurrent':0,
				'PageIndex':this.page,
				'PageSize':this.rows
			}
			this.$api.GetAuthorizedAppLst(data).then(
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
		//修改
		modifylist(rows){
			this.isviewAdd = true;
			this.disabled = true;
			this.title = '修改';
			this.modifyId = this.list[rows].Id;
			this.OperationType = 1;
			this.storeNameAdd.code = this.list[rows].AppId;
			this.ConcurrentNumberoneAdd = this.list[rows].MaxConcurrent;
			this.MaxplayNum = this.list[rows].CameraMaxPlay;
			this.StartTime = this.list[rows].AuthorizedDate;
			this.EndTime = this.list[rows].ExpirationDate;
			this.getAppName = this.list[rows].AppName;
		},
		//删除
		DelEByIds(rows){
			this.OperationType = 2;
			let data ={
				'Id':this.list[rows].Id,
				'OperationType':this.OperationType,
				// 'SubId':this.$utils.getUrlKey('userId'),
			}
			this.$confirm('是否确认删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$api.OperateAuthorizedApp(data).then(res => {
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
		},
		addList(){
			this.isviewAdd = true;
			this.title = '添加';
			this.OperationType = 0;
			this.storeNameAdd.code = '';
			this.ConcurrentNumberoneAdd = '';
			this.MaxplayNum = '';
			this.StartTime = '';
			this.EndTime = '';
			this.modifyId = '00000000-0000-0000-0000-000000000000';
			this.disabled = false;
		},
		privilegeList(){
			this.isviewprivilege = true;
			this.GetPrivilegedUser();
		},
		startTimeChange(){
			this.EndTime = '';
		},
		//添加修改保存
		PreservationAdd(){
			// if(this.storeNameAdd == '' || this.ConcurrentNumberoneAdd == '' || this.MaxplayNum == '' || this.StartTime =='' || this.EndTime ==''){
			// 	this.message('请输入内容',2)
			// }
			if(this.storeNameAdd.code == '' || this.storeNameAdd.code == null){
				this.message('请选择馆名称',2);
				return
			}
			if(this.ConcurrentNumberoneAdd.toString() == '' || this.ConcurrentNumberoneAdd == null){
				this.message('请输入并发数',2);
				return
			}
			if(this.MaxplayNum.toString() == '' || this.MaxplayNum == null){
				this.message('请输入最大播放路数',2);
				return
			}
			if(this.StartTime == '' || this.StartTime == null){
				this.message('请选择开始时间',2);
				return
			}
			if(this.EndTime == '' || this.EndTime == null){
				this.message('请选择结束时间',2);
				return
			}
			let data = {
				'Id':this.modifyId,
				'AppName':this.getAppName,
				'AppId':this.storeNameAdd.code,
				'SubId':this.$utils.getUrlKey('userId'),
				'CameraMaxPlay':this.MaxplayNum,
				'AuthorizedDate':this.StartTime,
				'ExpirationDate':this.EndTime,
				'MaxConcurrent':this.ConcurrentNumberoneAdd,
				'OperationType':this.OperationType,
			}
			this.$api.OperateAuthorizedApp(data).then(
				res => {
					if(res && res.IsSuccess){
						this.queryList();
						this.message(res.Message,1);
						this.isviewAdd = false;
					}else{
						this.message(res.Message,-1)
					}
				}
			)
		},
		//获取特权用户
		GetPrivilegedUser(){
			let data = {
			}
			this.$api.GetPrivilegedUser(data).then(
				res => {
					if(res && res.IsSuccess){
						this.phonenumber = res.Data.UserPhones;
						this.phoneId = res.Data.Id;
					}else{
						this.message(res.Message,-1)
					}
				}
			)
		},
		//特权用户保存
		Preservationprivilege(){
			this.isviewprivilege = false;
			let data = {
				'Id':this.phoneId,
				'SubId':this.$utils.getUrlKey('userId'),
				'UserPhones':this.phonenumber
			}
			this.$api.SetPrivilegedUser(data).then(
				res => {
					if(res && res.IsSuccess){
						this.queryList();
						this.message(res.Message,1);
						this.isviewprivilege = false;
					}else{
						this.message(res,Message,-1)
					}
				}
			)
		}
	}
}
</script>

<style scoped="scoped" lang="scss">
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding: 0 20px;
		padding-top: 10px;
        .com-width {
            width: 110px;
        }

        .com-width-time {
            width: 140px
        }
    }
</style>
<style scoped="scoped">
	.el-input{
	}
</style>
