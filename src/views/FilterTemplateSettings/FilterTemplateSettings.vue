<template>
	<div class="FilterTemplateSettings">
		<div class="main-header">
			<el-button type="primary" style="margin-bottom: 10px;" @click="NewTemplate">新增筛选模板</el-button>
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
			<el-table-column property="Name" align="" show-overflow-tooltip label="筛选模板名称">
			</el-table-column>
			<el-table-column property="MapStatusLst" align="" show-overflow-tooltip label="筛选规则条件">
				<template slot-scope="scope">
					<span v-for="item of scope.row.MapStatusLst">{{item.Name + ';'}}</span>
				</template>
			</el-table-column>
			<el-table-column property="Scenarios" align="" show-overflow-tooltip label="应用场景">
				<template slot-scope="scope">
					<span>{{scope.row.Scenarios == 1 ? '地图' : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column property="Remark" align="" show-overflow-tooltip label="备注">
			</el-table-column>
			<el-table-column property="Remark" align="" show-overflow-tooltip label="操作">
				<template slot-scope="scope">
					<el-button type="primary" style="margin-bottom: 10px;" @click="TemplateConfiguration(scope.row.Id)">模板配置</el-button>
					<el-button type="danger" style="margin-bottom: 10px;" @click="deleteTemplate(scope.row.Id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination 
			:total="searchValue.total" 
			:page.sync="searchValue.page"
		    :limit.sync="searchValue.rows" 
			@pagination="GetMapTemplatePage" 
			class="main-bottom">
		</pagination>
		<el-dialog
			top="10vh"
			:title="title"
			append-to-body
			:visible.sync="ScreeningTemplateViews"
			v-if="ScreeningTemplateViews"
			width="55%">
			<el-form
				:model="ruleForm"
				ref="ruleFormLabel"
				label-width="110px"
				:rules="rules"
				style="max-height: 500px;overflow: auto;"
				class="demo-ruleForm">
				<el-form-item label="筛选模板名称" prop="TemplateName">
					<el-input placeholder="请输入筛选模板名称" v-model="ruleForm.TemplateName" class="com-width" clearable maxlength="20" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="应用场景" prop="ApplicationScenario">
					<el-select class="com-width" size="small" placeholder="请选择应用场景" v-model="ruleForm.ApplicationScenario" @change="" clearable>
						<el-option :key="1" label="地图" :value="1">地图</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="">
					<el-input placeholder="请输入备注" v-model="ruleForm.Remark" class="com-width" clearable maxlength="50" show-word-limit></el-input>
				</el-form-item>				
			</el-form>
			<el-button type="primary" style="margin-bottom: 10px;" @click="SelectCriteria">选择筛选条件</el-button>
			<el-table
				:data="CriteriaList"
				v-loading="CriteriaLoading"
				border
				class="main-table"
				ref="table"
				:key="Math.random()"
				height="300">
				<el-table-column type="index" align="" label="序号" show-overflow-tooltip width="50">
				</el-table-column>
				<el-table-column property="Name" align="" show-overflow-tooltip label="规则条件">
				</el-table-column>
				<el-table-column property="MapDatas" align="" show-overflow-tooltip label="数据源">
					<template slot-scope="scope">
						<span v-for="item of scope.row.MapDatas">{{item.Name + ';'}}</span>
					</template>
				</el-table-column>
				<el-table-column property="" align="" show-overflow-tooltip label="筛选标题名称">
					<template slot-scope="scope">
						<span>{{scope.row.Title ? scope.row.Title : scope.row.Name}}</span>
					</template>
				</el-table-column>
				<el-table-column property="" align="" show-overflow-tooltip label="操作" width="300">
					<template slot-scope="scope">
						<el-button type="primary" plain size="mini"  @click="MoveUpward(scope.$index,scope.row)">上移</el-button>
						<el-button type="primary" plain size="mini" @click="MoveDown(scope.$index,scope.row)">下移</el-button>
						<el-button type="primary" plain size="mini" @click="EditByIds(scope.$index)">编辑</el-button>
						<el-button type="danger" plain size="mini" @click="DelEByIds(scope.row.MapStatusId)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="text-align: center;margin-top: 10px;">
				<el-button @click="resetForm('ruleFormLabel')">取消</el-button>
				<el-button type="primary" :disabled="disabledBtn" @click="RuleBtn('ruleFormLabel')">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog
			top="10vh"
			title="选择筛选条件"
			append-to-body
			:visible.sync="SelectFilterCriteria.show"
			v-if="SelectFilterCriteria.show"
			width="55%">
			<div class="main-header" style="margin-bottom: 10px;">
				<el-select
				 clearable
				 v-model="SelectFilterCriteria.SeeRule"
				 :filterable="SelectFilterCriteria.SeeRuleDatas.length > 7"
				 placeholder="请选择">
					<el-option v-for="item of SelectFilterCriteria.SeeRuleDatas" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
				</el-select>
				<el-button type="primary" style="margin-left: 10px;" @click="GetMapFilterCondition">搜索</el-button>
			</div>
			<el-table
				:data="SelectFilterCriteria.list"
				v-loading="SelectFilterCriteria.Loading"
				border
				class="main-table"
				ref="tableSelect"
				height="600"
				@selection-change="handleSelectionApp">
				<el-table-column type="index" align="" label="序号" show-overflow-tooltip width="50">
				</el-table-column>
				<el-table-column type="selection" reserve-selection align="center" width="55">
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
			</el-table>
			<pagination 
				:total="SelectFilterCriteria.total" 
				:page.sync="SelectFilterCriteria.page"
			    :limit.sync="SelectFilterCriteria.rows" 
				@pagination="GetMapFilterCondition" 
				class="main-bottom">
			</pagination>
			<div style="text-align: center;margin-top: 10px;">
				<el-button @click="SelectFilterCriteria.show = false">取消</el-button>
				<el-button type="primary" :disabled="disabledBtn" @click="RuleBtnCriteria">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog
			top="10vh"
			title="编辑"
			append-to-body
			:visible.sync="EditingConditions.show"
			width="55%">
			<el-form
				:model="EditingForm"
				ref="EditingFormLabel"
				label-width="110px"
				style="max-height: 500px;overflow: auto;"
				class="demo-ruleForm">
					<el-form-item label="筛选条件名称" prop="">
						<el-input placeholder="请输入筛选条件名称" v-model="EditingForm.FilterName" class="com-width" clearable show-word-limit maxlength="10"></el-input>
					</el-form-item>
					<el-form-item label="设置默认选择项" prop="">
						<el-select class="com-width" size="small" multiple :filterable="EditingForm.DefaultSelectionDatas.length > 7" placeholder="请选择默认选择项" v-model="EditingForm.DefaultSelection" @change="" clearable>
							<el-option v-for="item of EditingForm.DefaultSelectionDatas" :key="item.Key" :label="item.Value" :value="item.Key"></el-option>
						</el-select>
					</el-form-item>
			</el-form>
			<div style="text-align: center;margin-top: 10px;">
				<el-button @click="EditingConditions.show = false">取消</el-button>
				<el-button type="primary" :disabled="disabledBtn" @click="RuleBtnEditing">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script src="@/views/FilterTemplateSettings/FilterTemplateSettings.js">
</script>

<style scoped="scoped" lang="scss">
	.FilterTemplateSettings{
		padding: 0;
		.main-table{
			height: calc(100vh - 237px) !important;
		}
	}
</style>
