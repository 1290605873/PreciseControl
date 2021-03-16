<template>
    <!-- 巡查执法处理 -->
    <div class="PatrolLawEnforcement" style="height: 100%;">
        <el-tabs style="height: 100%;" v-model="operationlist.code" @tab-click="handleClick" type="border-card">
            <el-tab-pane v-for="item in operationlist.datas" :label="item.Name" :name="item.Id" :value="item.Id"></el-tab-pane>
            <div class="secondlevel">
                <el-tabs v-model="inspectionlist.code" @tab-click="taskTabsClick">
                    <el-tab-pane v-for="item in inspectionlist.datas" :label="item.Text" :name="item.Id" :value="item.Id"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="table right">
                <!-- <div class="addbutton" style="margin-bottom: 10px;">
                    <el-button type="primary" plain @click="addview">添加</el-button>
                </div> -->
                <el-table
						:data="tablelist"
						border
						highlight-current-row
						class="main-table"
						ref="table"
						id="table"
						style="overflow: auto;"
                    @selection-change="">
                    <el-table-column type="index" align="" label="序号" width="50" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="TitleName" label="巡查执法处理" align="" width="" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="Description" label="说明注释" align="" width="" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="ImageUrl" label="图片上传" align="" width="" show-overflow-tooltip>
						<template slot-scope="scope">
							<img style="height: 40px;width: 40px;border-radius: 4px" v-show="scope.row.ImageUrl!=null&&scope.row.ImageUrl.startsWith('http')" :src="getThumbPic(scope.row.ImageUrl)">
						</template>
                    </el-table-column>
                    <el-table-column property="GroupName" label="分组" align="" width="" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="EnforceResult" label="执法结果" align="" width="" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{scope.row.EnforceResult == '' ? '无' : scope.row.EnforceResult}}</span>
						</template>
                    </el-table-column>
                    <el-table-column property="PermissionSet" label="权限设置" align="" width="" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="PatrolResult" label="关联的巡查处理结果" align="" width="" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="NextOperate" label="下一步操作" align="" width="" show-overflow-tooltip>
						<template slot-scope="scope">
							<span v-if="scope.row.NextOperate==0">否</span>
							<span v-if="scope.row.NextOperate==1">开具巡查整改单</span>
							<span v-if="scope.row.NextOperate==2">开具执法整改单</span>
						</template>
                    </el-table-column>
                    <el-table-column align="" label="设置" width="210" show-overflow-tooltip>
                        <!-- <template slot="header" slot-scope="scope">
                            <div style="text-align: right !important;width: 100%">
                                <el-button plain type="primary" @click="addview">添加</el-button>
                            </div>
                        </template> -->
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="Enable(scope.$index)" :disabled="scope.row.IsEnable">
                                启用
                            </el-button>
                            <el-button size="mini" type="danger" @click="Disable(scope.$index)" :disabled="scope.row.IsEnable == false">
                                禁用
                            </el-button>
                            <el-button size="mini" type="primary" @click="modifylist(scope.row)">
                                修改
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <pagination 
                 v-show="total>0" 
                 :total="total" 
                 :page.sync="searchValue.page" 
                 :limit.sync="searchValue.rows"
                 @pagination="getBasicOptionList"
                 class="main-bottom" id="main-bottom" /> -->
            </div>
            <el-dialog 
			:title="title" 
			:visible.sync="gridParam.isviewAdd" 
			:close-on-click-modal="false" 
			class="dialogHeight"
            width="1000px" 
			v-if="gridParam.isviewAdd" 
			height="500" 
			top="10vh" 
			@opened='getPatrolEnforceById'
			@close="cleanContent('gridParam')">
				<el-form :model="gridParam" :rules="rules" ref="gridParam" label-width="142px" class="demo-ruleForm">
					<el-form-item label="标题 :">
						<span>{{TitleName}}</span>
					</el-form-item>
					<el-form-item label="上传图片 :" prop="ImageUrl" ref="ImageUrl">
						<el-upload
								class="avatar-uploader"
								action=""
								:show-file-list="false"
								list-type="picture-card"
								:http-request="defaultPicUpload">
							<img v-if="gridParam.ImageUrl" 
							:src="gridParam.ImageUrl"
								 class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="说明注释 :" prop="ExplanatoryNotes">
						<el-input v-model="gridParam.ExplanatoryNotes" style="line-height: 44px;width: 750px;"></el-input>
					</el-form-item>
					<el-form-item label="分组 :" prop="Grouping">
						<el-radio v-model="gridParam.Grouping" :label="1" disabled style="line-height: 44px;">常规处理</el-radio>
						<el-radio v-model="gridParam.Grouping" :label="2" disabled style="line-height: 44px;">执法处理</el-radio>
					</el-form-item>
					<el-form-item label="执法结果显示 :" prop="EnforcementResult">
						<el-radio style="line-height: 44px;" v-for="item of gridParam.EnforcementResult.datas" :label="item.Id" v-model="gridParam.EnforcementResult.code">{{item.Text}}</el-radio>
					</el-form-item>
					<el-form-item label="权限设置 :" prop="PermissionSettings">
						<el-checkbox-group v-model="gridParam.PermissionSettings" style="line-height: 44px;">
							<el-checkbox v-for="item of gridParam.PermissionSettingsDatas" :label="item.Id" :key="item.Id">{{item.Name}}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="关联巡查处理结果 :" prop="ProcessingResult">
						<el-checkbox-group v-model="gridParam.ProcessingResult" style="line-height: 44px;">
							<el-checkbox v-for="item of gridParam.ProcessingResultDatas" :label="item.Id" :key="item.Id">{{item.Text}}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="下一步操作 :" prop="NextOperate">
						<el-radio v-model="gridParam.NextOperate" :label="0" style="line-height: 44px;">否</el-radio>
						<el-radio v-model="gridParam.NextOperate" :label="1" style="line-height: 44px;" v-if="gridParam.Grouping==1">巡查整改单</el-radio>
						<el-radio v-model="gridParam.NextOperate" :label="2" style="line-height: 44px;" v-if="gridParam.Grouping==2">执法整改单</el-radio>
					</el-form-item>
					<el-form-item label="" prop="RectificationSheet" v-if="gridParam.NextOperate==2">
						<el-checkbox-group v-model="gridParam.RectificationSheet" style="line-height: 44px;" v-if="">
							<el-checkbox v-for="item of gridParam.RectificationSheetDatas" :label="item.Id.toString()" :key="item.Id.toString()">{{item.Name}}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item>
						<el-button @click="resetForm('gridParam')">取消</el-button>
						<el-button type="primary" @click="RuleBtn('gridParam')">提交</el-button>						
					</el-form-item>
				</el-form>
                <!-- <div style="display: flex;padding-right: 40px;">
                    <p style="width: 120px;text-align: right;margin-right: 5px;">标题 :</p>
                </div>
                <div style="display: flex;padding-right: 40px;" prop="checkNum">
                    <p style="width: 120px;text-align: right;margin-right: 5px;">上传图片 :</p>
					<el-upload
							class="avatar-uploader"
							action="api/PatrolEnforce/UploadImage"
							:show-file-list="false"
							list-type="picture-card"
							:http-request="defaultPicUpload">
						<img v-if="gridParam.ImageUrl" :src="gridParam.ImageUrl"
							 class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
                </div>
                <div style="display: flex;padding-right: 40px;" prop="checkNum">
                    <p style="width: 120px;text-align: right;margin-right: 5px;">说明注释 :</p>
					<el-input v-model="gridParam.ExplanatoryNotes" style="line-height: 44px;width: 750px;"></el-input>
                </div>
                <div style="display: flex;padding-right: 40px;" prop="checkNum">
                    <p style="width: 120px;text-align: right;margin-right: 5px;">分组 :</p>
                    <el-radio v-model="gridParam.Grouping" :label="true" style="line-height: 44px;">常规处理</el-radio>
                    <el-radio v-model="gridParam.Grouping" :label="false" style="line-height: 44px;">执法处理</el-radio>

                </div>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 120px;text-align: right;margin-right: 5px;">执法结果显示 :</p>
					<div style="white-space: pre-wrap;width: 750px;">
						<el-radio style="line-height: 44px;" v-for="item of gridParam.EnforcementResult.datas" :label="item.Text" :key="item.Id" v-model="gridParam.EnforcementResult.code"></el-radio>
					</div>
                </div>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 120px;text-align: right;margin-right: 5px;">权限设置 :</p>
					<el-checkbox-group v-model="gridParam.PermissionSettings" style="line-height: 44px;">
						<el-checkbox v-for="item of gridParam.PermissionSettingsDatas" :label="item.Name" :key="item.Id"></el-checkbox>
					</el-checkbox-group>
                </div>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 120px;text-align: right;margin-right: 5px;">关联巡查处理结果 :</p>
					<el-checkbox-group v-model="gridParam.ProcessingResult" style="line-height: 44px;">
						<el-checkbox v-for="item of gridParam.ProcessingResultDatas" :label="item.Text" :key="item.Id"></el-checkbox>
					</el-checkbox-group>
                </div>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 120px;text-align: right;margin-right: 5px;">下一步操作 :</p>
                    <el-radio v-model="gridParam.NextOperate" :label="0" style="line-height: 44px;">否</el-radio>
                    <el-radio v-model="gridParam.NextOperate" :label="1" style="line-height: 44px;">巡查整改单</el-radio>
                    <el-radio v-model="gridParam.NextOperate" :label="2" style="line-height: 44px;">执法整改单</el-radio>
                </div>
				<div v-if="gridParam.NextOperate==2" style="padding-left: 120px;">
					<el-checkbox-group v-model="gridParam.RectificationSheet" style="line-height: 44px;" v-if="">
						<el-checkbox v-for="item of gridParam.RectificationSheetDatas" :label="item.Name" :key="item.Id"></el-checkbox>
					</el-checkbox-group>
				</div>
                <div style="text-align: center;margin-top: 10px;">
                    <el-button type="primary" style="margin-right: 20px;" @click="addTitle()">保存</el-button>
                    <el-button @click="gridParam.isviewAdd=false">取消</el-button>
                </div> -->
            </el-dialog>
        </el-tabs>
    </div>
</template>

<script src="@/views/PatrolLawEnforcement/PatrolLawEnforcement.js">
</script>

<style scoped lang="scss">
    .PatrolLawEnforcement {
        .right {
            width: 100%;
            height: calc(100vh - 124px);
            @include box(box);
            @include box-orient(vertical);
            padding: 0 20px;

            .main-table {
                height: 300px;
            }
        }

    }
</style>
<style lang="scss" type="text/scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }
	.PatrolLawEnforcement .avatar {
        width: 100%;
        height: 100%;
        display: block;
    }	
	.PatrolLawEnforcement .el-form-item{
		margin: 0;
	}
	.PatrolLawEnforcement{
		.el-form-item__error{
			position:relative;
		}
		.el-form-item__content{
			line-height: 44px;
		}
	}
</style>
