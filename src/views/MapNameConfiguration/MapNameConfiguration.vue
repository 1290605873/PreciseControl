<template>
  <div class="main-container mapNameConfiguration">
    <el-container>
      <el-aside width="200px">
        <el-button-group>
          <el-button type="primary" size="mini" @click="addGroup">新增</el-button>
          <el-button type="primary" size="mini" @click="editGroup">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteGroup">删除</el-button>
        </el-button-group>
        <el-scrollbar>
          <span
            class="map-name-items"
            v-for="(i, j) in mapGroup.groupNameList"
            :class="mapGroup.activeGroup == i.Id ? 'active' : '' "
            :key="j"
            :data-id="i.Id"
            @click="changeGroup(i.Id)">
            {{i.GroupName}}</span>
        </el-scrollbar>
      </el-aside>
      <el-main>

      <!--
       <el-dialog :close-on-click-modal="false"
              title="地图名称配置"
              :visible.sync="dialogMapNameConfigVisible"
              width="100%"
              height="100%"
              @close="handleClose"
              fullscreen
      >
      -->
        <el-button type="primary" @click="addBtn()">添加</el-button>
        <el-table
          v-loading="mapNameConfigTableListLoading"
          :data="mapNameConfigurationData"
          border
          class="mapNameConfigDataHeight">
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center">
          </el-table-column>
          <el-table-column
            prop="Name"
            label="地图名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="StoreTypeList"
            label="初始化数据"
            show-overflow-tooltip
            min-width="260">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.StoreTypeList" :key="index">
                {{item.StoreTypeName}}<span v-if="index!=scope.row.StoreTypeList.length-1">、</span>
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="Remark"
            label="定义"
            align="center"
            show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column
            prop="mapDataName"
            label="分组数据源"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="是否需要登录"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.IsAnonymity==false?"是":"否"}}
            </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            label="数据源范围"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.MapDataRange==1">不限</span>
              <span v-if="scope.row.MapDataRange==2">本馆</span>
              <span v-if="scope.row.MapDataRange==3">本馆和兄弟馆</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="显示感知范围"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.FeelRange==1">显示感知区域</span>
              <span v-if="scope.row.FeelRange==2">显示雷达扫描</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            show-overflow-tooltip
            min-width="220">
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
                  @click="deleteBtn(scope.row.Id)">
                    删除
                </el-button>
                <el-button
                  :disabled="scope.row.IsRelated==true?false:true"
                  size="mini"
                  plain
                  type="primary"
                  @click="isEnableChange(scope.row)">
                  {{scope.row.IsEnable==false?'启用':'禁用'}}
                </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          v-show="pages.total>0"
          :total="pages.total"
          :page.sync="pages.pageNo"
          :limit.sync="pages.pageSize"
           @pagination="Pagination">
         </Pagination>
      </el-main>
    </el-container>
    <!--</el-dialog>-->
    <el-dialog
      :close-on-click-modal="false"
      top="10vh"
      :title="addAndEditName"
      :visible.sync="dialogAddAndEditMapNameVisible"
      :append-to-body="true"
      width="70%"
      @close="cancelAddAndEditNameForm('addAndEditNameDiv')">
        <div class="maxDialog">
          <el-form
            :model="addAndEditNameForm"
            :rules="addAndEditNameRules"
            ref="addAndEditNameDiv"
            label-width="130px"
            class="addAndEditNameClass">
            <el-form-item label="地图名称" prop="mapNameValue">
              <el-input
                clearable
                type="text"
                maxlength="30"
                show-word-limit
                placeholder="请输入地图名称"
                v-model.trim="addAndEditNameForm.mapNameValue"
                style="width:460px"></el-input>
            </el-form-item>
            <el-form-item label="地图分组" required>
              <el-select
                v-model="addAndEditNameForm.GroupId"
                placeholder="请选择地图分组">
                <el-option
                  v-for="(i, j) in mapGroup.groupNameList"
                  :key="j"
                  :label="i.GroupName"
                  :value="i.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="默认缩略图" prop="defalutImgValue">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :http-request="defaultPicUpload"
                :before-upload="beforeAvatarUpload">
                <img v-if="addAndEditNameForm.defalutImgValue" :src="addAndEditNameForm.defalutImgValue"
                     class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="position:absolute;top:10px;left:50px;">图片格式：jpg，jpeg，gif，png，大小不能超过1MB</span>
            </el-form-item>
            <el-form-item label="选中缩略图" prop="selectImgValue">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :http-request="selectPicUpload"
                :before-upload="beforeAvatarUpload">
                <img v-if="addAndEditNameForm.selectImgValue" :src="addAndEditNameForm.selectImgValue"
                 class="avatar">
                 <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="position:absolute;top:10px;left:50px;">图片格式：jpg，jpeg，gif，png，大小不能超过1MB</span>
            </el-form-item>
            <el-form-item label="地图初始化数据" prop="initializationDataValue">
              <el-input v-model.trim="addAndEditNameForm.initializationDataValue" style="width:200px">
                <el-button
                  slot="append"
                  type="primary"
                  plain
                  @click="openTypeDialog()"
                  style='border-radius:0'>
                  选择
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="数据源" prop="MapDataTypeList" v-if="dataOriginList.length!=0">
              <el-checkbox-group v-model="addAndEditNameForm.MapDataTypeList" :disabled="addOrEditType==1">
                <el-checkbox
                  v-for="item in dataOriginList"
                  :key="item.Id"
                  :label="item.MapDataType"
                  @change="chooseOrign($event,item.Id)"
                  style="margin-right: 10px;margin-left: 0">
                  {{item.Name}}
                </el-checkbox>
              </el-checkbox-group>
                <!--                        <el-select-->
                <!--                                clearable-->
                <!--                                :disabled="dataOriginDisabled"-->
                <!--                                filterable-->
                <!--                                v-model="addAndEditNameForm.dataOriginValue"-->
                <!--                                placeholder="请选择数据源"-->
                <!--                                style="width:200px"-->
                <!--                                @change="dataOriginChange(addAndEditNameForm.dataOriginValue)">-->
                <!--                            <el-option-->
                <!--                                    v-for="item in dataOriginList"-->
                <!--                                    :key="item.Id"-->
                <!--                                    :label="item.Name"-->
                <!--                                    :value="item.MapDataType"-->
                <!--                                   >-->
                <!--                            </el-option>-->
                <!--                        </el-select>-->
            </el-form-item>
            <el-form-item label="数据源范围设置">
              <el-radio-group v-model="addAndEditNameForm.DataSourceRangeSettings">
                <el-radio :label="1">不限</el-radio>
                <el-radio :label="2">本馆</el-radio>
                <el-radio :label="3">本馆和兄弟馆</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="地图显示组件">
              <div class="mapModuleBox">
                <div class="mapModuleBox_layer" v-if="addAndEditNameForm.MapDataTypeList.length == 0">
                    <p>请先选择数据源</p>
                </div>
                <h3 class="mapCenter"><i class="el-icon-location"></i>地图</h3>
                <ul class="mapUl">
                  <li :class="{hover:tabNum == 1}" class="mapTopLeft" @click="tabChange(1)">顶左</li>
                  <li :class="{hover:tabNum == 2}" class="mapTopCenter" @click="tabChange(2)">顶中</li>
                  <li :class="{hover:tabNum == 3}" class="mapTopRight" @click="tabChange(3)">顶右</li>
                  <li :class="{hover:tabNum == 4}" class="mapRight" @click="tabChange(4)">右<br/>侧</li>
                  <li :class="{hover:tabNum == 5}" class="mapBottom" @click="tabChange(5)">底部</li>
                  <li :class="{hover:tabNum == 6}" class="mapMessage" @click="tabChange(6)">
                      <i class="el-icon-message"></i>
                  </li>
                </ul>
                <div class="mapContainer" v-if="layoutList.Bottom">
                    <div v-show="tabNum == 1">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>地图顶部左侧</span>
                            </div>
                            <div>
                                <el-form-item prop="mapTopLeftValue">
                                    <el-checkbox
                                            v-model="addAndEditNameForm.mapTopLeftValue"
                                            @change="mapTopLeftAreaChange"
                                    >区域
                                    </el-checkbox>
                                    <span style="float:right" v-if="mapTopLeftChangeValueShow">
                                        是否切换
                                       <el-switch

                                               v-model="addAndEditNameForm.mapTopLeftChangeValue"
                                               active-color="#13ce66"
                                               inactive-color="#ff4949">
                                       </el-switch>
                                   </span>
                                    <!--
                                   <el-checkbox-group v-model="addAndEditNameForm.mapTopLeftValue">
                                       <el-checkbox
                                               v-for="item in layoutList.TopLeft"
                                               :key="item.Id"
                                               :label="item.Name"
                                               style="width:100%">
                                       </el-checkbox>
                                   </el-checkbox-group>
                                    -->
                                </el-form-item>
                            </div>
                        </el-card>
                    </div>
                    <div v-show="tabNum == 2">
                        <el-card class="box-card mapTopCenter" shadow="hover">
                            <div slot="header" class="clearfix">
                              <span>地图顶部中间</span>
                            </div>
                            <div>
                              <el-form-item prop="mapTopCenterValue">
                                <el-radio-group v-model="addAndEditNameForm.mapTopCenterValue" @change="changeTop">
                                  <el-radio
                                    v-for="item in layoutList.TopCenter"
                                    :key="item.Id"
                                    :label="item.Id"
                                    style="width:100%;margin-bottom:10px;margin-left:0px">
                                    {{item.Name}}
                                  </el-radio>
                                </el-radio-group>
                                <el-input
                                  :disabled="addAndEditNameForm.mapTopCenterValue != 1"
                                  v-model.trim="addAndEditNameForm.mapTopCenterKeyWord"
                                  placeholder="请输入搜索关键字"
                                  maxlength="20"
                                  show-word-limit
                                  size="mini"
                                  class="keyWord">
                                </el-input>
                              </el-form-item>
                            </div>
                        </el-card>
                    </div>
                    <div v-show="tabNum == 3">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>地图顶部右侧</span>
                            </div>
                            <div>
                                <el-form-item prop="mapTopRightValue">
                                    <el-checkbox
                                    v-model="addAndEditNameForm.isBusiness"
                                    @change='addAndEditNameForm.mapTopRightValue = []'>
                                    B端业务
                                    </el-checkbox>
                                    <el-checkbox-group
                                    v-model="addAndEditNameForm.mapTopRightValue"
                                    @change='mapTopRightChange'>

                                        <el-checkbox
                                        v-for="item in layoutList.TopRight"
                                        :key="item.Id"
                                        :label="item.Name"
                                        :class='{isIntegral:item.Id == 4}'
                                        class='mapTopRightItem'
                                        :disabled="!addAndEditNameForm.isBusiness && item.Id != 4"
                                        >
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </div>
                        </el-card>
                    </div>
                    <div v-show="tabNum == 4" style="height: 312px;overflow-y: scroll">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>地图右侧</span>
                            </div>
                            <div style="display: flex;">
                                <el-form-item prop="mapRightValue" style="width: 100px;">
                                    <el-checkbox-group v-model="addAndEditNameForm.mapRightValue"
                                                       @change="mapRightChange">
                                        <el-checkbox v-for="item in layoutList.MiddleRight" :key="item.Id"
                                                     :label="item.Id" style="width:100%;margin-left:0px">{{item.Name}}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <div style="height: 30px;line-height: 30px;display: flex;">
                                    <el-radio-group :disabled="addAndEditNameForm.mapRightValue.indexOf('1') == -1" v-model="addAndEditNameForm.mapRightValueImg.Code" @change="checkAddType">
                                        <el-radio style="line-height: 30px;" label="1">小图标</el-radio>
                                        <el-radio style="line-height: 30px;margin-right: 10px;" label="2">大图标</el-radio>
                                    </el-radio-group>
                                    <el-upload
                                            :disabled="addAndEditNameForm.mapRightValue.indexOf('1') == -1"
                                            class="avatar-uploader"
                                            action=""
                                            :show-file-list="false"
                                            :http-request="mapRightImgUpload"
                                            :before-upload="beforeAvatarUpload">
                                        <img v-if="addAndEditNameForm.mapRightValueImg.ImgUrl" :src="addAndEditNameForm.mapRightValueImg.ImgUrl"
                                             class="avatar" style="">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                                <!--<el-radio-group v-model="item.Code">-->
                                    <!--<el-radio v-for="item in layoutList.MiddleRight" :label="3">备选项</el-radio>-->
                                    <!--<el-radio :label="6">备选项</el-radio>-->
                                    <!--<el-radio :label="9">备选项</el-radio>-->
                                <!--</el-radio-group>-->
                            </div>
                        </el-card>

                        <el-card shadow="hover" style="margin-top:10px">
                            <el-form>
                                <el-form-item v-if="mapRightRuleShow">
                                    <el-select
                                            clearable
                                            filterable
                                            v-model="SeeRuleDatas_model"
                                            placeholder="地图筛选模板"
                                            style="width:170px;line-height: 40px">
                                        <el-option
                                                v-for="item in SeeRuleDatas"
                                                :key="item.MapDataTypeName"
                                                :label="item.Name"
                                                :value="item.Id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="mapRightIdValue" v-if="mapRightIdValueShow">
                                    <el-input placeholder="请输入布局ID" required
                                              style="width: 170px"
                                              v-model="addAndEditNameForm.mapRightIdValue"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </div>
                    <div v-show="tabNum == 5" style="height: 312px;overflow-y: scroll">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>地图底部</span>
                            </div>
                            <div>
                                <el-form
                                        :inline="true"
                                        label-position="left"
                                        v-for="it in addAndEditNameForm.MapDataTypeList_bottom"
                                        :key="it.MapDataTypeName">
                                    <el-form-item :label="it.Name" prop="mapBottomMainValue">
                                        <div style="line-height: 40px">
                                            <el-checkbox
                                            v-model="addAndEditNameForm.demoStreet"
                                            @change="mapBottomChange(1)"
                                            v-if='it.MapDataType == 40'>
                                            显示示范街门店列表
                                            </el-checkbox>

                                            <el-checkbox
                                            v-model="addAndEditNameForm.ClockIn"
                                            @change="mapBottomChange(1)"
                                            v-else-if='it.MapDataType == 50'>
                                                显示人员打卡信息
                                            </el-checkbox>

                                            <el-checkbox
                                            v-model="it.checkedPop"
                                            @change="mapBottomChange(1,it)"
                                            v-else>
                                            弹出主体信息
                                            </el-checkbox>
                                        </div>
                                    </el-form-item>
                                    <el-form-item
                                        prop="mapBottomStoreTemValue"
                                        style="width:50%;
                                        display:inline-block"
                                        v-if='it.MapDataType != 40 && it.MapDataType != 50'
                                    >
                                        <el-select
                                                clearable
                                                filterable
                                                :disabled="!it.checkedPop"
                                                v-model="it.template_bottom"
                                                placeholder="请选择主体信息模板"
                                                style="width:180px;line-height: 40px">

                                            <el-option
                                                    v-for="item in layoutList.Bottom[0].Theme"
                                                    :key="item.MapDataTypeName"
                                                    :label="item.Name"
                                                    :value="item.Id">
                                            </el-option>

                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                        <!-- <el-card shadow="hover" style="margin-top:10px">
                            <el-form-item prop="checkdialPlateValue">
                                <el-checkbox v-model="addAndEditNameForm.checkdialPlateValue"
                                             @change="mapBottomChange(2)">弹出表盘
                                </el-checkbox>
                            </el-form-item>
                            <el-form-item prop="checkdialPlateRadioValue">
                                <el-radio-group v-model="addAndEditNameForm.checkdialPlateRadioValue">
                                    <el-radio
                                            style="margin-top:10px"
                                            v-for="item in layoutList.Bottom[0].ClockDial"
                                            :key="item.Id"
                                            :label="item.Id"
                                            :disabled="!addAndEditNameForm.checkdialPlateValue">
                                        {{item.Name}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-card> -->
                        <!-- cd bt -->
                        <el-card shadow="hover" style="margin-top:10px" >
                            <el-form-item class="recommendBox">
                                <el-checkbox v-model="addAndEditNameForm.IsShowRecommend"
                                @change="mapBottomChange(3)">显示数据列表</el-checkbox>
                                <el-checkbox-group :disabled="!addAndEditNameForm.IsShowRecommend"  v-model="addAndEditNameForm.commitList">
                                  <template>
                                      <el-checkbox label="1" style="margin:10px 30px 0px 25px">显示推荐门店</el-checkbox>
                                      <el-button
                                      type="primary"
                                      size="mini"
                                      @click="choseStore"
                                      :disabled="addAndEditNameForm.commitList.indexOf('1') < 0"
                                      >
                                      选择推荐门店
                                      </el-button>
                                  </template>
                                  <br>
                                  <template>
                                      <el-checkbox  label="2" style="margin:5px 30px 0px 25px">显示附近列表</el-checkbox>
                                      <el-button
                                      type="primary"
                                      size="mini"
                                      :disabled="addAndEditNameForm.commitList.indexOf('2') < 0"
                                      @click='isShowSortSelectBox = true'
                                      >
                                      配置排序和筛选
                                      </el-button>
                                      <!-- <el-select v-model="addAndEditNameForm.nearStoreType" :disabled="addAndEditNameForm.commitList.indexOf('2') < 0">
                                          <el-option
                                          v-for="item in nearList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                          </el-option>
                                      </el-select> -->
                                  </template>
                                </el-checkbox-group>

                            </el-form-item>
                        </el-card>
                    </div>
                    <div v-show="tabNum == 6">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>地图左侧</span>
                            </div>
                            <div>
                                <el-form-item prop="mapLeftValue">
                                    <el-checkbox
                                            v-for="item in layoutList.MiddleLeft"
                                            :key="item.Id"
                                            v-model="addAndEditNameForm.mapLeftValue">
                                        {{item.Name}}
                                    </el-checkbox>
                                </el-form-item>
                            </div>
                        </el-card>
                    </div>
                </div>
              </div>
            </el-form-item>
            <!-- <el-form-item label="可以匿名访问" prop="anonymityValue">
                <el-checkbox v-model="addAndEditNameForm.anonymityValue" @change="anonymityChange"></el-checkbox>
            </el-form-item> -->
            <!-- <el-form-item label="角色配置">
                <el-checkbox-group
                        v-model="addAndEditNameForm.roleSetValue"
                        @change="roleSetChange">
                    <el-checkbox
                            v-for="items in roleSetList"
                            :label="items.Key"
                            :key="items.Key">{{items.Value}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item> -->
            <el-form-item label="显示感知范围">
              <el-checkbox v-model="addAndEditNameForm.IsShowFeel">启用感知范围</el-checkbox>
              <el-radio-group :disabled="!addAndEditNameForm.IsShowFeel" v-model="addAndEditNameForm.DisplaySensingRange" style="margin-left: 10px">
                <el-radio :label="1">显示感知区域</el-radio>
                <el-radio :label="2">显示雷达扫描</el-radio>
              </el-radio-group>
              <el-checkbox v-model="addAndEditNameForm.isShowDataPromptBox" v-if='addAndEditNameForm.DisplaySensingRange == 2' style="margin-left: 20px">
                显示数据提示框
              </el-checkbox>
            </el-form-item>
            <!-- <el-form-item label="显示地图消息提醒">
                <el-checkbox v-model="addAndEditNameForm.IsShowNotice"></el-checkbox>
            </el-form-item> -->
            <!-- <el-form-item label="地图中心配置">
                <el-checkbox v-model="addAndEditNameForm.IsShowCenter">启用中心点配置</el-checkbox>
                <el-radio-group :disabled="!addAndEditNameForm.IsShowCenter" v-model="addAndEditNameForm.CenterPosition" style="margin-left: 10px">
                    <el-radio :label="1">用户所在区域为中心点</el-radio>
                    <el-radio :label="2">APP所属区域为中心点</el-radio>
                </el-radio-group>
            </el-form-item> -->

            <!-- cd -->
            <!-- <el-form-item label="显示消费券" class="couponBox">
                <el-checkbox v-model="addAndEditNameForm.isCouponUrl">显示消费券领取入口</el-checkbox>
                <template v-if="addAndEditNameForm.isCouponUrl">
                    <el-input v-model="addAndEditNameForm.couponUrl" placeholder="请指定领取优惠券链接" size="medium"></el-input>
                    <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :http-request="couponPicUpload"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="addAndEditNameForm.couponImgUrl" :src="addAndEditNameForm.couponImgUrl"
                            class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </template>
            </el-form-item> -->

            <el-form-item label="快捷入口设置">
              <el-checkbox-group v-model="addAndEditNameForm.EntranceConfig">
                <el-checkbox label="1">入驻入口</el-checkbox>
                <el-checkbox label="2">上报入口</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="显示广告">
                <el-checkbox-group v-model="addAndEditNameForm.advertisement">
                    <el-checkbox label="1">插屏广告</el-checkbox>
                    <el-checkbox label="2">贴片广告</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="地图定义" prop="mapConfigValue">
                <el-input
                        maxlength="50"
                        show-word-limit
                        type="textarea"
                        placeholder="请输入地图定义(限50字)"
                        v-model.trim="addAndEditNameForm.mapConfigValue"
                        style="width:460px">
                </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddAndEditNameForm('addAndEditNameDiv')">取消</el-button>
          <el-button type="primary" @click="submitAddAndEditNameForm('addAndEditNameDiv')">保存</el-button>
        </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false"
               title="选择经营类型"
               :visible.sync="dialogTypeOfOperationVisible"
               width="50%"
               :append-to-body="true"
               top="10vh">
        <h3 style="color: red">C端业态和B端业态不能混合选择，只能保存当前Tab业态</h3>
        <div class="maxDialog" v-loading="classificationFormatsLoading">
            <el-tabs type="border-card" v-model="BCTYPE">
                <el-tab-pane label="C端业态">
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
                                    @change="((val) => { checkAllTypeOfChange(val, item.StoreTypeId) })"
                            >
                                {{item.StoreTypeName}}
                            </el-checkbox>
                            <el-button style="float: right; padding: 3px 0" type="text">
                                {{item.checkedTypeOfArr.length}}/{{item.TypeOfData.length}}
                            </el-button>
                        </div>
                        <el-checkbox-group
                                v-model="item.checkedTypeOfArr"
                                @change="((val) => { CheckedTypeOfChange(val, item.StoreTypeId) })"
                        >
                            <el-checkbox
                                    v-for="secondItem in item.GetMapSecondary"
                                    style="margin-bottom:10px;margin-left:0px;margin-right:30px;font-weight:normal"
                                    :label="secondItem.StoreTypeName"
                                    :key="secondItem.StoreTypeId">
                                {{secondItem.StoreTypeName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-card>
                </el-tab-pane>
                <el-tab-pane label="B端业态">
                    <el-card
                            shadow="hover"
                            class="box-card"
                            style="margin-bottom:10px"
                            v-for="item in classificationFormatsData_B"
                            :key="item.StoreTypeId">
                        <div slot="header" class="clearfix">
                            <el-checkbox
                                    :indeterminate="item.isIndeterminate"
                                    v-model="item.checkAllTypeOfValue"
                                    @change="((val) => { checkAllTypeOfChange_B(val, item.StoreTypeId) })"
                            >
                                {{item.StoreTypeName}}
                            </el-checkbox>
                            <el-button style="float: right; padding: 3px 0" type="text">
                                {{item.checkedTypeOfArr.length}}/{{item.TypeOfData.length}}
                            </el-button>
                        </div>
                        <el-checkbox-group
                                v-model="item.checkedTypeOfArr"
                                @change="((val) => { CheckedTypeOfChange_B(val, item.StoreTypeId) })"
                        >
                            <el-checkbox
                                    v-for="secondItem in item.GetMapSecondary"
                                    style="margin-bottom:10px;margin-left:0px;margin-right:30px;font-weight:normal"
                                    :label="secondItem.StoreTypeName"
                                    :key="secondItem.StoreTypeId">
                                {{secondItem.StoreTypeName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-card>
                </el-tab-pane>
            </el-tabs>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTypeOfOperationVisible = false">取 消</el-button>
                <el-button type="primary" @click="TypeOfOperationCommit">确 定</el-button>
        </span>
    </el-dialog>
    <!--删除弹出框-->
    <el-dialog :close-on-click-modal="false"
               title="删除"
               :visible.sync="dialogDeleteVisible"
               width="30%"
               :append-to-body="true"
        >
        <span>确认删除此条信息</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogDeleteVisible = false">取 消</el-button>
            <el-button type="primary" @click="isEnuableAndDelete">确 定</el-button>
          </span>
    </el-dialog>
    <el-dialog
        :close-on-click-modal="false"
        title="推荐门店设置"
        :visible.sync="iframeShow"
        width="95%"
        top="5vh"
        :append-to-body="true">
        <iframe id="mainIframe" ref="mainIframe" name="mainIframe" :src="url" frameborder="0" style="width: 100%;height: 80vh;"></iframe>
    </el-dialog>
    <!--| 配置排序和筛选 |-->
    <el-dialog
        :close-on-click-modal="false"
        title="配置排序和筛选"
        :visible.sync="isShowSortSelectBox"
        width="40%"
        top="20vh"
        :append-to-body="true"
        v-if='isShowSortSelectBox'
        >
        <div v-if='layoutList.Bottom' class='sortSelectBox'>
            <el-checkbox-group v-model="addAndEditNameForm.SortSelectFood" @change='sortSelectFoodChange'>
                <el-checkbox
                v-for='(item,index) in layoutList.Bottom[0].FilterList'
                :key='index'
                :label="item.Identify">
                {{item.Name}}
                </el-checkbox>
            </el-checkbox-group>
            <el-card shadow="never" class='selectBox'>
                <el-checkbox-group v-model="addAndEditNameForm.FilterList"
                v-if='layoutList.Bottom[0]'
                >
                    <el-checkbox
                    v-for='(item,index) in FilterListLayoutData'
                    :key='index'
                    :label="item.Identify"
                    :disabled="addAndEditNameForm.SortSelectFood.indexOf('FILTER') == -1">
                    {{item.Name}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-card>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isShowSortSelectBox = false">取 消</el-button>
            <el-button type="primary" @click="sortSelectFoodKeepHandler">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      :title="mapGroup.title"
      :visible.sync="mapGroup.show"
      width="360px"
      append-to-body
      @close="mapGroup.show = false">
      <el-form>
        <el-form-item label="分组名称">
          <el-input
            v-model.trim="mapGroup.name"
            :data-id="mapGroup.currentId"
            style="width:220px;"
            maxlength="10"
            show-word-limit
            placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mapGroup.show = false">取 消</el-button>
        <el-button type="primary" @click="subGroupchange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script src="@/views/MapNameConfiguration/MapNameConfiguration.js"></script>
<style scoped lang="scss" type="text/scss" src="@/views/MapNameConfiguration/MapNameConfiguration.scss"></style>

<style>
    .mapContainer .el-form-item__label {
        width: 90px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .mapContainer .el-card__header {
        padding: 0 10px !important;
        background-color: #EBEEF5
    }

    .mapContainer .el-card__body {
        padding: 10px
    }

    .mapContainer .el-card__body .el-form-item__content {
        line-height: 30px
    }

    /*上传图片*/
    .addAndEditNameClass .cardBody .el-form-item__content {
        line-height: 38px !important
    }

    .addAndEditNameClass .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .addAndEditNameClass .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .addAndEditNameClass .avatar-uploader-icon {
        font-size: 20px;
        color: #8c939d;
        width: 38px;
        height: 38px;
        line-height: 38px !important;
        text-align: center;
    }

    .addAndEditNameClass .avatar {
        width: 38px;
        height: 38px;
        display: block;
    }
</style>
