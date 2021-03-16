<template>
	<div class="maxDialog main-container">
	    <div class="main-header">
	        <el-form :inline="true" class="demo-form-inline">
	            <regionalism v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion'></regionalism>
	            <el-form-item label="">
	                <el-input clearable placeholder="门店名称" v-model="searchDetails.storeName" class="com-width"></el-input>
	            </el-form-item>
	            <el-form-item label="">
	                <el-input clearable placeholder="单位名称" v-model="searchDetails.companyName" class="com-width"></el-input>
	            </el-form-item>
	            <el-form-item label="">
	                <el-select clearable class="com-width" v-model="Detailsstate.code" placeholder="状态" @change="" :filterable="Detailsstate.datas.length > 7">
	                    <el-option v-for="item in Detailsstate.datas" :key="item.value" :label="item.label" :value="item.value"></el-option>
	                </el-select>
	            </el-form-item>
	            <el-form-item label="">
	                <el-date-picker v-model="Startdate" type="date" class="com-width-time" placeholder="开始时间"
	                    value-format="yyyy-MM-dd" :picker-options="pickerOptions0" @change="Timechange()">
	                </el-date-picker>
	                <el-date-picker v-model="Enddate" type="date" class="com-width-time" placeholder="结束时间"
	                    value-format="yyyy-MM-dd" :picker-options="pickerOptions1">
	                </el-date-picker>
	                <el-button type="primary" @click="query()">查询</el-button>
	            </el-form-item>
	        </el-form>
	    </div>
	    <el-table
				class="main-table"
				:data="list"
				v-loading="Loading"
				border
				highlight-current-row
				ref="table"
				height="400"
				id="table"
				@selection-change="">
	        <el-table-column type="index" align="" label="序号" show-overflow-tooltip width="50">
	        </el-table-column>
	        <el-table-column property="StoreName" align="" show-overflow-tooltip label="门店名称" width="">
	            <template slot-scope="scope">
	                <span>{{scope.row.StoreName}}</span>
	            </template>
	        </el-table-column>
	        <el-table-column property="StoreAliasName" label="单位名称" show-overflow-tooltip align="" width="">
	            <template slot-scope="scope">
	                <span>{{scope.row.StoreAliasName}}</span>
	            </template>                
	        </el-table-column>
	        <el-table-column property="StoreAddress" label="门店地址" show-overflow-tooltip align="" width="">
	            <template slot-scope="scope">
	                <span>{{scope.row.StoreAddress}}</span>
	            </template>                
	        </el-table-column>
	        <el-table-column property="StoreName" label="门店图片" show-overflow-tooltip align="" width="">
	            <!-- <template slot-scope="scope">
	                <span>{{scope.row.cell[4]}}</span>
	            </template>                -->
	        </el-table-column>
	        <el-table-column property="UnitName" label="启用时间" show-overflow-tooltip align="" width="">
	            <!-- <template slot-scope="scope">
	                <span>{{scope.row.cell[5]}}</span>
	            </template>                -->
	        </el-table-column>
	        <el-table-column property="StoreType" show-overflow-tooltip label="状态" align="" min-width="180">
	            <!-- <template slot-scope="scope">
	                <el-button type="primary" size="mini" plain v-if="scope.row.cell[10] == '投诉中'" @click="ComplaintAudit(scope.row.id,2)">投诉成功</el-button>
	                <el-button type="primary" size="mini" plain v-if="scope.row.cell[10] == '投诉中'" @click="ComplaintAudit(scope.row.id,3)">投诉不成功</el-button>
	                <el-button type="primary" size="mini" plain v-if="scope.row.cell[10] == '投诉中'&& appId==null && scope.row.cell[11] =='0'" @click="ComplaintAudit(scope.row.id,4)">加入黑名单</el-button>
	                <el-button type="primary" size="mini" plain v-if="scope.row.cell[10] == '投诉成功'&&appId==null&&scope.row.cell[11] =='0'" @click="ComplaintAudit(scope.row.id,4)">加入黑名单</el-button>
	                <el-button type="primary" size="mini" plain v-if="scope.row.cell[10] == '投诉不成功'&&appId==null&&scope.row.cell[11] =='0'" @click="ComplaintAudit(scope.row.id,4)">加入黑名单</el-button>
	            </template> -->
	        </el-table-column>
	    </el-table>
	    <!--翻页-->
	    <pagination 
	     v-show="Detailstotal>=0" 
	     :total="Detailstotal" 
	     :page.sync="searchDetails.page" 
	     :limit.sync="searchDetails.rows"
	     @pagination="getInitTable()" 
	     class="main-bottom" />
	</div>
</template>

<script src='@/views/Enablationdetails/Enablationdetails.js'>
</script>

<style scoped lang="scss">
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding-top: 10px;

        .com-width {
            width: 170px;
        }

        .com-width-time {
            width: 170px;
            margin-right: 10px;
        }

        .el-form-item {
            margin-bottom: 5px;
        }
    }
</style>
