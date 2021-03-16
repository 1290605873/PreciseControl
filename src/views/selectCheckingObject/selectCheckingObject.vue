<template>
	<div class="selectObject paddingt ">
		<el-container>
			<el-header>
				<div class="item">
					<el-checkbox></el-checkbox>
					<label for="">按区域:</label>
					<el-select v-model="areaValue" multiple placeholder="上地街道" :filterable="area.length > 7">
						<el-option v-for="item in area" :key="item.id" :value="item.value">{{item.value}}</el-option>
					</el-select>
					<el-checkbox></el-checkbox>
					<label for="">按业态:</label>
					<el-select v-model="opertaionValue" placeholder="餐饮服务" :filterable="opertaion.length > 7">
						<el-option v-for="item in opertaion" :key="item.id" :value="item.value">{{item.value}}</el-option>
					</el-select>
				
					<el-checkbox></el-checkbox>
					<label for="">按自检次数:</label>
					<el-select v-model="seleCheckTimeValue" placeholder="巡检次数" :filterable="seleCheckTime.length > 7">
						<el-option v-for="item in seleCheckTime" :key="item.id" :value="item.value">{{item.value}}</el-option>
					</el-select>
				
					<el-checkbox></el-checkbox>
					<label for="">按巡检次数:</label>
					<el-select v-model="inspectionTimeValue" placeholder="自检次数" :filterable="inspectionTime.length > 7">
						<el-option v-for="item in inspectionTime" :key="item.id" :value="item.value">{{item.value}}</el-option>
					</el-select>
				</div>
				
			</el-header>
			<el-main>
				<div class="item">
					<el-checkbox></el-checkbox>
					<label for="">按店加入:</label>
					<el-button type="primary">添加</el-button>
					<el-button type="primary">删除</el-button>
				</div>
				<el-table
					height="auto"
				    border
				    style="width: 80%"
					highlight-current-row
				>
					<el-table-column type="index" width="40" align="center"></el-table-column>
				    <el-table-column :label="table.CompanyName" min-width="80px" show-overflow-tooltip>
						<template>
							<span>{{}}</span>
						</template>
				    </el-table-column>
				    <el-table-column :label="table.storeName" min-width="80px" show-overflow-tooltip>
						<template>
							<span>{{}}</span>
						</template>
				    </el-table-column>
				    <el-table-column :label="table.licence" min-width="80px" show-overflow-tooltip>
						<template>
							<span>{{}}</span>
						</template>
				    </el-table-column>
				    <el-table-column :label="table.TwoLevelFormat" min-width="80px" show-overflow-tooltip>
						<template>
							<span>{{}}</span>
						</template>
				    </el-table-column>
				    <el-table-column :label="table.storeAddress" min-width="80px" show-overflow-tooltip>
						<template>
							<span>{{}}</span>
						</template>
				    </el-table-column>
				    <el-table-column :label="table.operate" min-width="80px" show-overflow-tooltip>
						<template>
							<span>{{}}</span>
						</template>
				    </el-table-column>		
				</el-table>
				
			</el-main>
			<el-footer>
				
				<span class="totalNumber">合计<label v-model="totalNum"></label>家</span>
			
				<div class="item">
					<el-button type="primary">取消</el-button>
					<el-button type="primary">提交</el-button>
					<el-button type="primary">查询</el-button>
				</div>
			</el-footer>
		</el-container>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				table: {
					CompanyName:"单位名称",
					storeName:"门店名称",
					licence:"许可证",
					TwoLevelFormat:"二级业态",
					storeAddress:"门店地址",
					operate:"操作"
				},
				totalNum:"x",
				area:[
					{
						id:'1',
						value:'社区1'
					},
					{
						id:'2',
						value:'社区2'
					},
					{
						id:'3',
						value:'社区3'
					}

				],
				areaValue:'',
				opertaion:[
					{
						id:'1',
						value:'微型餐饮'
					},
					{
						id:'2',
						value:'中型餐饮'
					},
					{
						id:'3',
						value:'大型餐饮'
					}

				],
				opertaionValue:'',
				seleCheckTime:[
					{
						id:'1',
						value:'小于等于2次'
					},
					{
						id:'2',
						value:'大于等于2次'
					}
				],
				seleCheckTimeValue:"",
				inspectionTime:[
					{
						id:'1',
						value:'小于等于2次'
					},
					{
						id:'2',
						value:'大于等于2次'
					}
				],
				inspectionTimeValue:""
			}
		},
		methods:{

		}
	}
</script>
<style scoped lang="scss">
	.selectObject{
		width:100%;
		height:100%;
		font-size:14px;
	}
	.el-select{
		margin-right:10px;
	}
	.paddingt{
		padding-top:20px;
		padding-left:20px;
	}
	.el-header, .el-footer {
		color: #333;
	}
	.item label{
		display:inline-block;
		margin-right:10px;
	}
	.el-main {
		padding-top:0;
		color: #333;
		width:100%
	}
	.el-main .item{
		margin-bottom:10px;
	}
	.el-footer .item{
		text-align:center;
	}
	.totalNumber{
		display:inline-block;
		border:1px solid #cccccc;
		width:100px;
		height:30px;
		line-height:30px;
		margin:10px 0;
		text-align:center;
	}
</style>