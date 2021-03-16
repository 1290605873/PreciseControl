<template>
	<div class="DataSourceRule main-container">
		<div class="main-header" style="margin-bottom: 10px;">
			<el-select
			 clearable
			 v-model="searchValue.SeeRule"
			 :filterable="searchValue.SeeRuleDatas.length > 7"
			 placeholder="按数据源查看">
				<el-option v-for="item of searchValue.SeeRuleDatas" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
			</el-select>
			<el-button type="primary" style="margin-left: 10px;" @click="GetMapFilterCondition">搜索</el-button>
		</div>
		<el-table
			:data="list"
			v-loading="Loading"
			border
			class="main-table"
			ref="table"
			height="600">
			<el-table-column type="index" align="" label="序号" show-overflow-tooltip width="50">
			</el-table-column>
			<el-table-column property="FieldName" align="" show-overflow-tooltip label="规则编码">
			</el-table-column>
			<el-table-column property="Name" align="" show-overflow-tooltip label="规则定义">
			</el-table-column>
			<el-table-column property="MapDatas" align="" show-overflow-tooltip label="数据源">
				<template slot-scope="scope">
					<span v-for="item of scope.row.MapDatas">{{item.Name + ';'}}</span>
				</template>
			</el-table-column>
			<el-table-column property="UseType" align="" show-overflow-tooltip label="是否可用作主体配置">
				<template slot-scope="scope">
					<span>{{scope.row.UseType == 0 ? '否' : '是'}}</span>
				</template>
			</el-table-column>
			<el-table-column property="Remark" align="" show-overflow-tooltip label="备注">
			</el-table-column>
		</el-table>
		<pagination 
			:total="searchValue.total" 
			:page.sync="searchValue.page"
		    :limit.sync="searchValue.rows" 
			@pagination="GetMapFilterCondition" 
			class="main-bottom">
		</pagination>
	</div>
</template>

<script src="@/views/DataSourceRule/DataSourceRule.js">
</script>

<style scoped="scoped" lang="scss">
    // .main-container {
    //     width: 100%;
    //     height: 100%;
    //     @include box(box);
    //     @include box-orient(vertical);
    //     padding: 0;
    //     .com-width {
    //         width: 170px;
    //     }
    // }
</style>
<style scoped="scoped" lang="scss">
	.DataSourceRule{
		padding: 0;
		.main-table{
			height: calc(100vh - 237px) !important;
		}
	}
</style>
