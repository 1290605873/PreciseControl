<template>
	<div class="Largescreenpermission main-container">
		<el-form inline>
            <el-form-item>
                <el-input v-model="NameofEmployee" clearable placeholder="请输入员工姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="phonenumber" clearable placeholder="请输入手机号"  oninput = "value=value.replace(/[^\d]/g,'')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryList">查 询</el-button>
            </el-form-item>
			<br>
            <el-form-item>
                <el-button type="primary" plain @click="addList" style="margin-right: 10px;">添加</el-button>
				<span style="color: #606266;">提示:并发人数上线{{MaxConcurrent}}人,有限期{{Termofvalidity}}</span>
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
			<el-table-column property="EmpName" align="" show-overflow-tooltip label="员工姓名" width="">
			</el-table-column>
			<el-table-column property="EmpPhone" align="" show-overflow-tooltip label="手机号" width="">
			</el-table-column>
			<el-table-column property="" align="" show-overflow-tooltip label="操作" width="">
				<template slot-scope="scope">
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
		<!--选择职员列表-->
		<el-dialog title="选择员工" 
				   top="10vh" 
				   :visible.sync="dialogallEmployeesVisible" 
				   :close-on-click-modal="false"
				   width="700px">
		  <div class="maxDialog">
		  <div  v-if="selectedEmployees.length>0 && selectedEmployees!==undefined">
			<h6 class="usernametitle">您已选择的职员</h6>
			<div class="usernamebox" 
			v-for="item in selectedEmployees" 
			:key="item.UserId" 
			@mouseover="deleteEmployeesBtnOver(item.UserId)"
			@mouseleave="deleteEmployeesBtnOut(item.UserId)"
			>
			  <span class="usernamespan">{{item.Name}}</span>
			  <!-- <i v-if="item.deleteBtn" class="el-icon-close" @click="deleteSelectedEmployees(item.UserId)"></i> -->
			</div>
		  </div>
			<el-form inline>
				<el-form-item label-width="150px">
					<el-input  placeholder="搜索员工姓名" v-model="searchOneUserName"></el-input>
				</el-form-item>
				<el-form-item>
				<el-button type="primary" @click="userSearch">搜索</el-button>
				</el-form-item>
			 </el-form>  
			<el-table
									v-loading="employeesLoading"
									:data="allEmployees.Datas"
									ref="eleEmployees"
									border
									highlight-current-row
									style="width: 100%;"
									@selection-change="handleselectedEmployees"
									row-key="UserId"
									class="mb10"
									>
									<el-table-column
									type="index"
									label="序号"
									width="55"
									align="center"
									>
									</el-table-column>
									<el-table-column
									type="selection"
									:reserve-selection="true"
									width="55"
									align="center"
									>
									</el-table-column>
									<el-table-column
									prop="Name"
									label="员工姓名"
									width="180">
									</el-table-column>
									<el-table-column
									prop="Phone"
									label="手机号">
									</el-table-column>
								</el-table>
								<!-- <el-pagination
								  :pager-count="employeesPagination.dialogPagerCount"
								  @size-change="employeesListpageSize"
								  @current-change="employeesListpageCurrent"
								  :current-page.sync="employeesPagination.currentPage"
								  :page-sizes="employeesPagination.pageSizes"
								  :page-size.sync="employeesPagination.pagesize"
								  :layout="employeesPagination.layout"
								  :total="employeesPagination.total">
								</el-pagination> -->
		</div>
			<span slot="footer" class="dialog-footer">
			  <el-button @click="dialogallEmployeesVisible = false">取 消</el-button>
			  <el-button type="primary" @click="selectUsersCommit">确 定</el-button>
		  </span>   
		</el-dialog>
	</div>
</template>

<script src='@/views/Largescreenpermission/Largescreenpermission.js'>
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
.usernametitle {
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  margin: 0;
  color: #409eff;
}
.usernamebox {
  position: relative;
  display: inline-block;
  margin: 15px 0;
  .usernamespan {
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 5px;
    margin: 0 10px 10px 0;
  }
  .el-icon-close {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    position: absolute;
    right: 5px;
    top: -12px;
  }
}
</style>
