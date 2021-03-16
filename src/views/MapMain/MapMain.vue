<template>
    <div class="main-container MapMain">
      <div v-if="mapDataList.length==0">暂无数据</div>
      <el-container>
        <el-aside width="200px">
          <div class="mapAsideBox">
            <div
              class="mapAsideItem"
              :class="{hover:ind==mapCurrentIndex}"
              v-for="(item,ind) in mapDataList"
              :key="item.Id"
              @click="getMapMainSettingListData(item.Id,ind)">
              {{item.Name}}
            </div>
          </div>
        </el-aside>
        <el-main>
  				<el-tabs
            style="height: 100%;"
            v-model="operationlist.code"
            @tab-click="handleClick"
            type="border-card">
  					<el-tab-pane
              v-for="(item,index) in operationlist.datas"
              :label="item.Name"
              :name="item.MapDataType"
              :value="item.MapDataType"
              :key='index'>
            </el-tab-pane>
  					<el-button
							style="margin-bottom:12px;"
							type="primary"
							@click="addMainSataus">
              添加
            </el-button>
  					<el-table
							v-loading="mapMainTableListLoading"
							:data="mapMainTableListData"
							border
							class="mapMainDataHeight">
  						<el-table-column
								type="index"
								label="序号"
								width="50"
								align="center">
  						</el-table-column>
  						<el-table-column
								prop="Name"
								label="主体状态"
								min-width="90px"
								show-overflow-tooltip>
  						</el-table-column>
  						<el-table-column
								prop="Mark"
								label="属性"
								min-width="90px"
								show-overflow-tooltip>
  						</el-table-column>
  						<el-table-column
								prop="MapRule"
								label="地图规则"
								min-width="90px"
								show-overflow-tooltip>
  						</el-table-column>
  						<el-table-column
								prop="RuleDefinition"
								label="规则定义"
								min-width="90px"
								show-overflow-tooltip>
  						</el-table-column>
              <el-table-column
								prop="Sort"
								label="数据提醒"
								width="100"
								align="center">
                <template slot-scope='scope'>
                  <el-switch
                    v-model="scope.row.IsRemind"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change='(val) => IsRemindHandler(val,scope.row)'>
                  </el-switch>
                </template>
  						</el-table-column>
              <el-table-column
								prop="Sort"
								label="排序"
								width="100"
								align="center">
                <template slot-scope='scope'>
                  <el-input
                    v-model.number="currentSort"
                    :placeholder="scope.row.Sort"
                    v-if='isShowSortInput && scope.$index == currentSortIndex'
                    ref='sortInput'
                    @blur="sortKeepHandler(scope.row)"
                    @keyup.enter.native='$event.target.blur'>
                  </el-input>
                  <span
                    class='sortNumber'
                    v-else
                    @click='isShowSortInputBox(scope.$index)'>
                    {{scope.row.Sort || 0}}
                  </span>
                </template>
  						</el-table-column>
  						<el-table-column
								label="操作"
								min-width="400px"
								show-overflow-tooltip>
  							<template slot-scope="scope">
  								<el-button
										size="mini"
										plain
										type="primary"
										@click="editBtn(scope.row)">
  									编辑
  								</el-button>
  								<el-button
										size="mini"
										plain
										type="primary"
										@click="baseSetBtn(scope.row.Id)">
  									基础设置
  								</el-button>
  								<el-button
										size="mini"
										plain
										type="primary"
										@click="dataSetBtn(scope.row.Id)">
  									数据设置
  								</el-button>
  								<el-button
										size="mini"
										plain
										type="primary"
										@click="deleteBtn(scope.row.Id)">
  									删除
  								</el-button>
  								<el-button
										size="mini"
										plain
										type="primary"
										@click="isEnableChange(scope.row.Id)">
  									{{scope.row.IsEnable==false?'启用':'禁用'}}
  								</el-button>
  							</template>
  						</el-table-column>
  					</el-table>
  				</el-tabs>
        </el-main>
      </el-container>

      <el-dialog
        :title="addAndEditTitle"
        :visible.sync="dialoAddAndEditVisible"
        width="30%"
        :append-to-body="true"
        @close="cancelAddAndEditForm('addAndEditStatusDiv')">
          <el-form
            :model="addAndEditStatusForm"
            :rules="addAndEditStatusRules"
            ref="addAndEditStatusDiv"
            label-width="120px"
            class="demo-ruleForm">
            <el-form-item label="主体状态" prop="mainStatus">
              <el-input
                clearable
                maxlength="30"
                show-word-limit
                v-model.trim="addAndEditStatusForm.mainStatus"
                placeholder="请输入主体状态">
              </el-input>
            </el-form-item>
            <el-form-item label="属性" prop="property">
              <el-input
                clearable
                v-model.trim="addAndEditStatusForm.property"
                placeholder="请输入属性"
                maxlength="30"
                show-word-limit>
              </el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="cancelAddAndEditForm('addAndEditStatusDiv')">取 消</el-button>
              <el-button type="primary" @click="addAndEditCommit('addAndEditStatusDiv')">确 定</el-button>
          </span>
      </el-dialog>
      <!-- 基础设置 -->
      <el-dialog
        top="10vh"
        title="主体基础设置"
        :visible.sync="dialogMainBaseSetVisible"
        width="50%"
        :append-to-body="true"
        @close="cancelbaseSet('baseSetDiv')">
          <div class="maxDialog">
            <el-form
              :model="baseSetForm"
              :rules="baseSetRules"
              ref="baseSetDiv"
              label-width="120px"
              class="demo-ruleForm mainBaseSetClass">
                <el-card class="box-card" shadow="hover">
                  <div slot="header" class="clearfix">
                    <span>基础设置</span>
                    <el-button
                      style="float: right; padding: 3px 0;color:red"
                      type="text">
                      图片格式：jpg，jpeg，gif，png，大小不能超过1MB
                    </el-button>
                  </div>
                  <div class="cardBody">
                    <el-form-item label="大图标设置" prop="bigIconValue">
                      <el-upload
                        class="avatar-uploader"
                        action=""
                        :show-file-list="false"
                        :http-request="handleBigPicSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img
                          v-if="baseSetForm.bigIconValue"
                          :src="baseSetForm.bigIconValue"
                          class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="小图标设置" prop="smallIconValue">
                      <el-upload
                        class="avatar-uploader"
                        action=""
                        :show-file-list="false"
                        :http-request="handleSmallPicSuccess"
                        :before-upload="beforeAvatarUpload">
                          <img
                            v-if="baseSetForm.smallIconValue"
                            :src="baseSetForm.smallIconValue"
                            class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="比例尺" prop="scaleValue">
                      <el-select
                        clearable
                        v-model="baseSetForm.scaleValue"
                        :filterable="scaleOptions.length > 7"
                        placeholder="请选择">
                        <el-option
                          v-for="item in scaleOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="选中效果图标" prop="iconValueType">
                      <el-radio-group v-model="baseSetForm.iconValueType">
                        <el-radio :label="0" class='customSelectedBtn'>
                          <span>自定义选中图标</span>
                          <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :http-request="handleSelectPicSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img
                              v-if="baseSetForm.selectIconValue"
                              :src="baseSetForm.selectIconValue"
                              class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                        </el-radio>
                        <el-radio :label="1">选中放大原始图标</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="显示主体logo">
                      <el-checkbox v-model="checked"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="上传logo底图" v-show="checked">
                      <el-upload
                        class="avatar-uploader"
                        action=""
                        :show-file-list="false"
                        :http-request="handleLogoPicSuccess"
                        :before-upload="beforeAvatarUpload">
                          <img
                            v-if="baseSetForm.LogoBaseMap"
                            :src="baseSetForm.LogoBaseMap"
                            class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </el-form-item>
                      <el-form-item label="图标加载动效">
                          <el-checkbox v-model="baseSetForm.isShowBtnLoading"></el-checkbox>
                      </el-form-item>
                  </div>
                </el-card>
                <el-card class="box-card" shadow="hover" style="margin-top: 15px">
                  <div slot="header" class="clearfix">
                      <span>图标行为配置</span>
                  </div>
                  <div>
                    <el-form-item prop="iconAreaSet" class="iconAreaSetClass" label-width="0px">
                      <el-radio-group v-model="baseSetForm.operateTypeValue">
                        <div class="">
                          <el-radio :label="0" style="width:150px;margin-top:15px">弹出主体信息</el-radio>
                          <el-select
                                  clearable
                                  v-model="baseSetForm.PopType"
                                  v-if="baseSetForm.operateTypeValue == 0"
                                  style="margin-top: 10px;width: 150px;"
                                  placeholder="请选择跳转页面">
                              <el-option label="弹出主体详情" :value="1"></el-option>
                              <el-option label="弹出主体列表" :value="2"></el-option>
                          </el-select>
                        </div>
                        <div style="display: flex">
                          <el-radio :label="1" style="width:150px;margin-left:0px;margin-top:15px;">跳转新页面</el-radio>
                          <el-select
                                  clearable
                                  v-model="baseSetForm.NewPageType"
                                  v-if="baseSetForm.operateTypeValue==1"
                                  style="margin-top: 10px;width: 150px;"
                                  placeholder="请选择跳转页面">
                              <el-option label="VR 显示页面" :value="1"></el-option>
                              <el-option label="主体详情页" :value="2"></el-option>
                          </el-select>
                        </div>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </el-card>
                <!-- <el-card class="box-card" shadow="hover" style="margin-top: 15px">
                    <div slot="header" class="clearfix">
                        <span>图标区域配置</span>
                    </div>
                    <div>
                        <el-form-item prop="iconAreaSet" class="iconAreaSetClass">
                            <el-checkbox
                                    style="width:100%;"
                                    label="顶部区域显示时间"
                                    v-model="baseSetForm.topTimeValue">
                            </el-checkbox>
                            <el-checkbox
                                    style="width:100%;margin-left:0px"
                                    label="内部区域显示数字"
                                    v-model="baseSetForm.middleNumberValue">
                            </el-checkbox>
                        </el-form-item>
                    </div>
                </el-card> -->
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelbaseSet('baseSetDiv')">取 消</el-button>
            <el-button type="primary" @click="baseSetCommit('baseSetDiv')">确 定</el-button>
          </span>
      </el-dialog>
      <!--数据设置-->
      <el-dialog
        top="10vh"
        title="数据设置"
        :visible.sync="dialogDataSetVisible"
        width="55%"
        :append-to-body="true"
        @close="cancelDataSet('dataSetDiv')">
        <el-form
          v-loading="dataSetloading"
          :model="dataSetForm"
          :rules="dataSetFormRules"
          ref="dataSetDiv"
          label-width="110px"
          class="demo-ruleForm dataSetClass">
          <div v-if="dataSetForm.dataSetArrOne.length != 0">
            <div v-for="(itemSelect,index) in dataSetForm.dataSetArrOne" :key='index'>
              <el-form-item
                v-if="itemSelect.UiType == 0"
                :label="itemSelect.labelNameSelect"
                :rules="dataSetFormRules.fieldDataValue"
                :prop="`dataSetArrOne.${index}.fieldDataValue`">
                <el-input
                  v-model="itemSelect.fieldDataValue"
                  type="number"
                  style="width:200px"
                  placeholder="请输入">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="itemSelect.UiType == 5"
                :label="itemSelect.labelNameSelect"
                :rules="dataSetFormRules.fieldDataValue"
                :prop="`dataSetArrOne.${index}.fieldDataValue`">
                <el-input
                  v-model="itemSelect.fieldDataValue"
                  type="number"
                  style="width:200px"
                  placeholder="请输入数字">
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="itemSelect.UiType == 1"
                :label="itemSelect.labelNameSelect"
                >
                <el-select
                  filterable
                  clearable
                  v-model="itemSelect.fieldDataValue"
                  placeholder="请选择">
                    <el-option
                      v-for="item in itemSelect.fieldDataoptions"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key">
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <el-form-item
            label="业态"
            v-if="formatShowFlag">
            <el-input v-model="dataSetForm.businessSelection" style="width:200px">
              <el-button
                slot="append"
                type="primary"
                plain
                @click="ClassificationFormatsChange">
                选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="规则定义">
            <el-input
              type="textarea"
              v-model.trim="dataSetForm.ruleDefinition"
              placeholder="请输入规则定义"
              maxlength="50"
              show-word-limit
              style="width:350px">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDataSet('dataSetDiv')">取 消</el-button>
          <el-button type="primary" @click="dataSetCommit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
              title="提示"
              :visible.sync="dialogDeleteVisible"
              width="30%"
              :append-to-body="true">
          <span>确定删除此条信息？</span>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogDeleteVisible = false">取 消</el-button>
              <el-button type="primary" @click="deleteCommit">确 定</el-button>
          </span>
      </el-dialog>
      <el-dialog
        title="选择经营类型"
        :visible.sync="dialogTypeOfOperationVisible"
        width="50%"
        :append-to-body="true"
        top="10vh"
        class="TypeOfOperationClass"
        :before-close="TypeOfOperationCommit">
      <div class="maxDialog" v-loading="typeOfOperationLoading">
          <el-card
            shadow="hover"
            class="box-card"
            style="margin-bottom:10px"
            v-for="item in classificationFormatsData"
            :key="item.StoreTypeId">
              <div slot="header" class="clearfix">
                <el-checkbox
                  :indeterminate="item.isIndeterminate"
                  v-model="item.checkAllTypeOfValue"
                  @change="((val) => { checkAllTypeOfChange(val, item.StoreTypeId) })">
                  {{item.StoreTypeName}}
                </el-checkbox>
                  <el-button style="float: right; padding: 3px 0" type="text">
                    {{item.checkedTypeOfArr.length}}/{{item.TypeOfData.length}}
                  </el-button>
              </div>
              <el-checkbox-group
                v-model="item.checkedTypeOfArr"
                @change="((val) => { CheckedTypeOfChange(val, item.StoreTypeId) })">
                  <el-checkbox
                    v-for="secondItem in item.GetMapSecondary"
                    style="margin-bottom:10px;margin-left:0px;margin-right:30px;font-weight:normal"
                    :label="secondItem.StoreTypeName"
                    :key="secondItem.StoreTypeId">
                    {{secondItem.StoreTypeName}}
                  </el-checkbox>
              </el-checkbox-group>
          </el-card>
      </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="TypeOfOperationCommit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script src="./MapMain.js"></script>

<style lang="scss" src="./MapMain.scss" scoped></style>
