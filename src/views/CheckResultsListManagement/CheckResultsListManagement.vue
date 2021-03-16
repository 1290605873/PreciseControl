<template>
	<div class="main-container checkResultManage">
		<!-- 列表模式查询条件 -->
		<div class="listQueryConditions" v-if="listQueryConditions">
			<el-form :inline="true" ref="form">
				<regionalism v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion'></regionalism>
				<el-form-item label="" label-width="80px">
					<el-select class="searchSelect" clearable :filterable="listData.statusTypeList.length > 7" v-model="listData.statusType"
					 placeholder="业态类型" @change="changeListStatusType">
						<el-option v-for="item in listData.statusTypeList" :key="item.Name" :label="item.Name" :value="item.Id">{{item.Name}}</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="" label-width="80px">
					<el-select class="searchSelect" clearable :filterable="listData.businessTypeList.length > 7" v-model="listData.businessType"
					 placeholder="业务类型" @change="changeListBusinessType">
						<el-option v-for="item in listData.businessTypeList" :key="item.value" :label="item.label" :value="item.value">{{item.label}}</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="" label-width="80px">
					<el-select clearable class="searchSelect" :filterable="listData.taskTypeList.length > 7" v-model="listData.taskType"
					 placeholder="任务类型">
						<el-option v-for="item in listData.taskTypeList" :key="item.Text" :label="item.Text" :value="item.Id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="" label-width="80px">
					<el-input class="searchInput" clearable v-model="listData.companyName" placeholder="单位名称"></el-input>
				</el-form-item>
				<el-form-item label="" label-width="80px">
					<!-- <el-select class="searchSelect" clearable v-model="listData.operateState"  placeholder="经营业态">
                        <el-option v-for="item in listData.operateStateList" :key="item.Id" :label="item.Name" :value="item.Id">{{item.Name}}</el-option>
                    </el-select> -->
				</el-form-item>
				<el-form-item label="" label-width="80px">
					<el-input class="searchInput" clearable v-model="listData.licence" placeholder="许可证"></el-input>
				</el-form-item>
				<el-form-item label="" label-width="80px">
					<el-select class="searchInput clearable" :filterable="listData.storeStatusList.length > 7" clearable v-model="listData.storeStatus"
					 placeholder="门店状态">
						<el-option v-for="item in listData.storeStatusList" :key="item.label" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="" label-width="80px">
					<el-input class="searchSelect" clearable v-model="listData.patrolValue" placeholder="巡查次数"></el-input>
				</el-form-item>
				<!-- <el-form-item label="" label-width="80px">
                    <el-input class="searchSelect" clearable v-model="listData.patrolMan" placeholder="巡查员">
                    </el-input>
                </el-form-item> -->
				<el-form-item label="" label-width="80px">
					<el-input class="searchSelect" clearable v-model="listData.selfCheckTimeValue" placeholder="自查次数"></el-input>
				</el-form-item>
				<!-- <el-form-item label="" label-width="80px">
                    <el-input class="searchSelect" clearable v-model="listData.selfCheckMan" placeholder="自查员"></el-input>
                </el-form-item> -->
				<el-form-item label-width="80px">
					<el-button type="primary" style="margin-left: 20px" @click="queryData">查询</el-button>
				</el-form-item>
				<br>
				<el-form-item>
					<el-button type="primary" plain @click="SwitchingPictureMode" class="SwitchingMode">切换图片模式</el-button>
					<el-button type="primary" plain @click="publishPatrolTaskDialog.show =true">布置巡查任务</el-button>
					<el-button type="primary" plain @click="publishSelfCheckTaskDialog.show =true">布置自查任务</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 列表模式查询条件 end-->
		<!-- 图片模式查询条件 -->
		<div class="imgQueryConditions" v-if="imgQueryConditions">


			<!-- 图片模式按任务查询查询条件 -->
			<div v-if="imgModeData.accordingTask">

				<el-form :inline="true" ref="form">
					<regionalism v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion'></regionalism>
					<el-form-item label="" label-width="80px">
						<el-select class="searchSelect" clearable :filterable="imgModeData.statusTypeList.length > 7" v-model="imgModeData.statusTypeValue"
						 placeholder="经营业态" @change="changeOperateStatusValue">
							<el-option v-for="item in imgModeData.statusTypeList" :key="item.Name" :label="item.Name" :value="item.Id">{{item.Name}}</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-select class="searchSelect" clearable :filterable="imgModeData.businessTypeList.length > 7" v-model="imgModeData.businessType"
						 placeholder="业务类型" @change="changeBusinessType">
							<el-option v-for="item in imgModeData.businessTypeList" :key="item.value" :label="item.label" :value="item.value">{{item.label}}</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-select class="searchSelect" clearable :filterable="imgModeData.patrolClassList.length > 7" v-model="imgModeData.patrolClass"
						 placeholder="大类" @change="changePatrolClass">
							<el-option v-for="item in imgModeData.patrolClassList" :key="item.id" :value="item.Id" :label="item.Text">{{item.Text}}</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-select class="searchSelect" clearable :filterable="imgModeData.patrolProjectList.length > 7" v-model="imgModeData.patrolProject"
						 placeholder="项目">
							<el-option v-for="item in imgModeData.patrolProjectList" :key="item.id" :value="item.Id" :label="item.Text">{{item.Text}}</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-select class="searchSelect" clearable :filterable="imgModeData.taskTypeList.length > 7" v-model="imgModeData.taskType"
						 placeholder="任务类型" @change="changeTaskTypeList">
							<el-option v-for="item in imgModeData.taskTypeList" :key="item.Text" :label="item.Text" :value="item.Id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<!-- <el-select class="searchSelect" clearable v-model="imgModeData.taskNameValue" placeholder="任务名称">
                            <el-option
                                    v-for="item in imgModeData.taskNameList"
                                    :key="item.Text"
                                    :label="item.Text"
                                    :value="item.Id">
                                    {{item.Text}}
                            </el-option>
                        </el-select> -->
						<el-input class="searchSelect" clearable v-model="imgModeData.taskNameValue" placeholder="任务名称"></el-input>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-date-picker v-model="imgModeData.imgDateStartValue" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-date-picker v-model="imgModeData.imgDateEndValue" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-select class="searchInput" v-model="imgModeData.imgStatus" :filterable="imgModeData.imgStatusList.length > 7"
						 placeholder="图片状态" @change="changePictureStatus">
							<el-option v-for="item in imgModeData.imgStatusList" :key="item.value" :label="item.value" :value="item.label"></el-option>
						</el-select>
						<el-button type="primary" style="margin-left: 20px" @click="TaskQuery">查询</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-button type="primary" plain @click="SwitchingListMode" class="SwitchingMode">切换列表模式</el-button>
					<el-button type="primary" plain @click="accordingStoreQuary">按门店查询</el-button>
					<el-button type="primary" plain @click="accordingTaskQuary">按任务查询</el-button>
				</div>
			</div>
			<!-- 图片模式按任务查询 end -->
			<!-- 图片模式按门店查询  -->
			<div v-if="imgModeData.accordingStore">
				<el-form :inline="true" ref="form">
					<regionalism v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion'></regionalism>
					<el-form-item label="" label-width="80px">
						<el-input class="searchInput" clearable v-model="imgModeData.storeName" placeholder="单位名称"></el-input>
					</el-form-item>
					<!-- <el-form-item label="" label-width="80px">
                             <el-input class="searchInput" clearable v-model="imgModeData.companyName" placeholder="单位名称"></el-input>
                         </el-form-item> -->
					<el-form-item label="" label-width="80px">
						<el-input class="searchInput" clearable v-model="imgModeData.licence" placeholder="许可证"></el-input>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-select class="searchInput" clearable :filterable="imgModeData.statusTypeList.length > 7" v-model="imgModeData.statusTypeValue"
						 placeholder="经营业态" @change="changeOperateStatusValue">
							<el-option v-for="item in imgModeData.statusTypeList" :key="item.Name" :label="item.Name" :value="item.Id">{{item.Name}}</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-select class="searchSelect" clearable :filterable="imgModeData.businessTypeList.length > 7" v-model="imgModeData.businessType"
						 placeholder="业务类型" @change="changeBusinessType">
							<el-option v-for="item in imgModeData.businessTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-select class="searchSelect" clearable :filterable="imgModeData.patrolClassList.length > 7" v-model="imgModeData.patrolClass"
						 placeholder="大类" @change="changePatrolClass">
							<el-option v-for="item in imgModeData.patrolClassList" :key="item.id" :value="item.Id" :label="item.Text"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-select class="searchSelect" clearable :filterable="imgModeData.patrolProjectList.length > 7" v-model="imgModeData.patrolProject"
						 placeholder="项目">
							<el-option v-for="item in imgModeData.patrolProjectList" :key="item.id" :value="item.Id" :label="item.Text"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-date-picker v-model="imgModeData.imgDateStartValue" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-date-picker v-model="imgModeData.imgDateEndValue" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="" label-width="80px">
						<el-select class="searchInput" clearable :filterable="imgModeData.imgStatusList.length > 7" v-model="imgModeData.imgStatus"
						 placeholder="图片状态" @change="changePictureStatus">
							<el-option v-for="item in imgModeData.imgStatusList" :key="item.value" :label="item.value" :value="item.label"></el-option>
						</el-select>
						<el-button type="primary" style="margin-left: 20px" @click="StoreQuery">查询</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-button type="primary" plain @click="SwitchingListMode" class="SwitchingMode">切换列表模式</el-button>
					<el-button type="primary" plain @click="accordingStoreQuary">按门店查询</el-button>
					<el-button type="primary" plain @click="accordingTaskQuary">按任务查询</el-button>
				</div>
			</div>
			<!-- 图片模式按门店查询 end -->

		</div>
		<el-table highlight-current-row :data="tableGrid.datas" border fit height="500px" v-if='!imgMode'>
			<el-table-column align="left" type="selection" width="40"></el-table-column>
			<el-table-column type="index" width="40" align="left"></el-table-column>
			<el-table-column :label="tableGrid.column.companyName" show-overflow-tooltip align="left">
				<template slot-scope="scope">
					<span>{{scope.row.UnitName }}</span>

				</template>
			</el-table-column>
			<el-table-column :label="tableGrid.column.areaName" show-overflow-tooltip align="left">
				<template slot-scope="scope">
					<span>{{scope.row.AreaName }}</span>

				</template>
			</el-table-column>
			<el-table-column :label="tableGrid.column.yetai" show-overflow-tooltip align="left">
				<template slot-scope="scope">
					<span>{{scope.row.StoreTypeName }}</span>

				</template>
			</el-table-column>
			<el-table-column :label="tableGrid.column.licence" show-overflow-tooltip align="left">
				<template slot-scope="scope">
					<span>{{scope.row.Licence }}</span>

				</template>
			</el-table-column>
			<el-table-column :label="tableGrid.column.storeStatus" show-overflow-tooltip align="left">
				<template slot-scope="scope">
					<span>{{ StoreStatus}}</span>

				</template>
			</el-table-column>
			<el-table-column :label="tableGrid.column.checkTimes" show-overflow-tooltip align="left">
				<template slot-scope="scope">
					<span>{{ scope.row.PatrolNum}}</span>

				</template>
			</el-table-column>
			<!-- <el-table-column :label="tableGrid.column.preCheckResult" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                <span>{{scope.row.LastPatrolResult }}</span>

                </template>
            </el-table-column> -->
			<el-table-column :label="tableGrid.column.selfCheckTimes" show-overflow-tooltip align="left">
				<template slot-scope="scope">
					<span>{{scope.row.SelfCheckNum}}</span>

				</template>
			</el-table-column>
			<!-- <el-table-column :label="tableGrid.column.selfCheckResult" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                <span>{{scope.row.LastSelfCheckResult }}</span>

                </template>
            </el-table-column> -->
			<el-table-column label="操作" align="center" width="160px">
				<template slot-scope="scope">
					<span class="linkType" @click="patrolHistory(scope.$index)" style="display:inline-block;margin-right:10px;">巡查历史</span>
					<span class="linkType" @click="selfHistory(scope.row.StoreId,scope.row.StoreTypeId)">自查历史</span>
				</template>
			</el-table-column>
		</el-table>
		<div v-if='!imgMode'>
			<pagination ref="pagination" v-show="pageNation.total>0" :total="pageNation.total" :page.sync="pageNation.pageNum"
			 :limit.sync="pageNation.countPerPage" @pagination="onPageNation">
			</pagination>
		</div>
		<!-- 图片模式 -->
		<el-container class="imgMode" res="imgMode" v-if='imgMode' v-loading="imgModeData.gridLoading">
			<el-aside width="50%" v-if="imgModeData.imgResult!=null&&imgModeData.imgResult.length>0">
				<ul>
					<li class="item" :class="{itemWrong:item.Status==2}" v-for="(item, index) in imgModeData.imgResult" :key="index"
					 @click="leftImgClick(index,item.Id)">
						<img src="../../assets/images/VideoPlay.png" v-if="item.PicType == 2" class="playimg">
						<img :src="item.PictureSrc" alt="" v-bind:class="{ active: item.isShow }">
						<!--<span style="color:red;border:1px solid #000000"-->
						<!--v-if="item.Status==2">{{item.qualified.wrong}}</span>-->
					</li>
				</ul>
				<pagination ref="pagination" v-show="imgModeData.pageNation.total>0" :total="imgModeData.pageNation.total"
				 :page.sync="imgModeData.pageNation.pageNum" :limit.sync="imgModeData.pageNation.countPerPage" @pagination="onPicturePageNation">
				</pagination>

			</el-aside>
			<el-main v-if="imgModeData.imgResult!=null&&imgModeData.imgResult.length>0">
				<el-carousel arrow="always" :autoplay="false" ref="carousel" @change="onActiveItem" style="height:400px;margin-top: 10px">
					<el-carousel-item v-for="(item, index) in imgModeData.imgResult" :key="index+1" style="height: 400px;">
						<img src="../../assets/images/VideoPlay.png" v-if="item.PicType == 2" class="playimg" @click="ShowDialog(item)">
						<img :src="item.PictureSrc" style="height: 100%;width: auto" alt="" @click="ShowDialog(item)">
					</el-carousel-item>
				</el-carousel>
				<el-form :inline="true" ref="form" class="pictureForm">
					<el-form-item label="任务类型:" label-width="80px">
						<el-input class="imgdetailInfo" style="border:none;" v-model="imgModeData.imgDetailInfo.taskType">{{imgModeData.imgDetailInfo.taskType}}</el-input>
					</el-form-item>
					<el-form-item label="单位名称:" label-width="80px">
						<el-input class="imgdetailInfo" v-model="imgModeData.imgDetailInfo.storeName">{{imgModeData.imgDetailInfo.taskType}}</el-input>
					</el-form-item>
					<el-form-item label="任务名称:" label-width="80px">
						<el-input class="imgdetailInfo" v-model="imgModeData.imgDetailInfo.taskName">{{imgModeData.imgDetailInfo.taskName}}</el-input>
					</el-form-item>
					<el-form-item label="地址:" label-width="80px">
						<el-input class="imgdetailInfo" v-model="imgModeData.imgDetailInfo.address">{{imgModeData.imgDetailInfo.address}}</el-input>
					</el-form-item>
					<el-form-item label="大类:" label-width="80px">
						<el-input class="imgdetailInfo" v-model="imgModeData.imgDetailInfo.selfCheckClass">{{imgModeData.imgDetailInfo.selfCheckClass}}</el-input>
					</el-form-item>
					<el-form-item label="照片提供人:" label-width="100px">
						<el-input class="imgdetailInfo" v-model="imgModeData.imgDetailInfo.pictureGetter">{{imgModeData.imgDetailInfo.pictureGetter}}</el-input>
					</el-form-item>
					<el-form-item label="项目:" label-width="80px">
						<el-input class="imgdetailInfo" v-model="imgModeData.imgDetailInfo.selfProject">{{imgModeData.imgDetailInfo.selfProject}}</el-input>
					</el-form-item>
					<el-form-item label="许可证号:" label-width="80px">
						<el-input class="imgdetailInfo" v-model="imgModeData.imgDetailInfo.licence">{{imgModeData.imgDetailInfo.licence}}</el-input>
					</el-form-item>
					<el-form-item label="" label-width="" style="display:block;text-align:center;height:25px;line-height:25px;margin-top:15px;">
						<el-button type="primary" @click="cancelNonconformity">{{imgModeData.imgDetailInfo.message.info}}</el-button>
						<el-button type="primary" style="display:none;">提醒</el-button>
					</el-form-item>
				</el-form>
			</el-main>
		</el-container>
		<!-- 图片模式 end-->


		<el-dialog class="patrolHistoryDialog" title="巡查历史" :visible.sync="patrolHistoryDialog.show" width="65%" top="10vh"
		 :close-on-click-modal="false">
			<div class="maxDialog" style="padding-bottom: 10px">
				<historical-task :Rowcontent="Rowcontent" v-if="patrolHistoryDialog.show"></historical-task>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="patrolHistoryDialog.show = false">取消</el-button>
				<el-button type="primary" style="margin-left: 20px" @click="patrolHistoryDialog.show = false">保存</el-button>
			</span>
		</el-dialog>
		<el-dialog title="详情" top="10vh" v-if="DetailsPage" width="700px" :visible.sync="DetailsPage" append-to-body
		 :close-on-click-modal="false">
			<div style="height: calc(80vh - 60px); overflow-y: auto;">
				<div style="display: flex;">
					<p style="margin: 5px;">视频源</p>
					<p style="width: 90%;word-break: break-word;margin: 5px 0;">{{playerOptions.sources[0].src}}</p>
				</div>

				<div style="text-align: center;overflow: hidden">
					<video-player class="video-player vjs-custom-skin" ref="videoPlayer" style="margin-top: 20px" :playsinline="true"
					 :options="playerOptions"></video-player>
				</div>
			</div>
		</el-dialog>
		<el-dialog class="selfCheckHistoryDialog" title="自查历史" :visible.sync="selfCheckHistoryDialog.show" width="65%" top="10vh"
		 :close-on-click-modal="false">
			<div class="maxDialog" style="padding-bottom: 10px">
				<self-check-history v-if="selfCheckHistoryDialog.show" :StoreTypeId="selfCheckHistoryDialog.StoreTypeId" :StoreId="selfCheckHistoryDialog.storeId"></self-check-history>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="selfCheckHistoryDialog.show = false">取消</el-button>
				<el-button type="primary" style="margin-left: 20px" @click="selfCheckHistoryDialog.show = false">保存</el-button>
			</span>
		</el-dialog>
		<el-dialog class="publishPatrolTaskDialog" title="发布巡查任务" :visible.sync="publishPatrolTaskDialog.show" width="65%"
		 top="10vh" :close-on-click-modal="false">
			<div class="maxDialog" style="padding-bottom: 10px">
				<publis-patrol-task :savaTaskInfo="savaTaskInfo" @storesResult="storesResult"></publis-patrol-task>
			</div>
		</el-dialog>
		<el-dialog class="publishSelfCheckTaskDialog" title="发布自查任务" :visible.sync="publishSelfCheckTaskDialog.show" width="65%"
		 top="10vh" :close-on-click-modal="false">
			<div class="maxDialog" style="padding-bottom: 10px">
				<publish-self-check-task :savaTaskInfo="savaTaskInfo"></publish-self-check-task>
			</div>
		</el-dialog>

	</div>
</template>
<script>
	import AreaChoose from '../../components/AreaChoose';
    import Pagination from '../../components/Pagination';
    import PublishSelfCheckTask from '../../components/publisSelfCheckTask/publisSelfCheckTask.vue';
    import publisPatrolTask from '../../components/publisPatrolTask/publisPatrolTask.vue';
    import selfCheckHistory from '../../components/selfCheckHistory/selfCheckHistory.vue';
    import Regionalism from '@/components/Regionalism.vue';
    import HistoricalTask from '@/components/HistoricalTask.vue';

    export default {
        components: {
            AreaChoose,
            Pagination,
            PublishSelfCheckTask,
            publisPatrolTask,
            selfCheckHistory,
            Regionalism,
            HistoricalTask
        },
        data() {
            return {
                savaTaskInfo: {//巡查任务详情数据
                    StoreTypeId: '',
                    TaskTypeId: '',
                    Name: '',
                    Explain: '',
                    StartTime: '',
                    EndTime: '',
                    TaskStatus: '',
                    Frequency: '',
                    FrequencyCompary: '',
                    ByMethod: '',
                    Times: '',
                    TaskTargets: '',
                    Contents: '',
                    CheckType: '',
                    Checker: ''
                },
                savaTaskInfo: {
                    StoreTypeId: '',
                    TaskTypeId: '',
                    TaskName: '',
                    Explain: '',
                    StartTime: '',
                    EndTime: '',
                    Frequency: 0,
                    FrequencyCompary: 1,
                    ByMethod: 1,
                    Times: 0,
                    TaskTargets: '',
                    Contents: '',
                    CheckType: '',
                    Checker: ''
                },
                areaDatas: '',
				DetailsPage:false,
				playerOptions:{
				        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
				        autoplay: true, //如果true,浏览器准备好时开始回放。
				        muted: false, // 默认情况下将会消除任何音频。
				        loop: false, // 导致视频一结束就重新开始。
				        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
				        language: 'zh-CN',
				        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
				        sources: [{ // 流配置，数组形式，会根据兼容顺序自动切换
				            type: 'video/mp4',
				            src: ''
				        }],
				        poster: "", //你的封面地址
				        // width: document.documentElement.clientWidth,
				        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
				        controlBar: {
				            timeDivider: true,
				            durationDisplay: true,
				            remainingTimeDisplay: false,
				            fullscreenToggle: true  //全屏按钮
				        }
				    },
                tableGrid: {
                    column: {
                        storeName: '门店名称',
                        companyName: '单位名称',
                        areaName: '区域名称',
                        yetai: '经营业态',
                        licence: '许可证',
                        storeStatus: '门店状态',
                        checkTimes: '巡查次数',
                        checkMan: '巡查员',
                        preCheckResult: '上次巡查结果',
                        selfCheckTimes: '自查次数',
                        selfCheckMan: '自查员',
                        selfCheckResult: '上次自查结果',
                    },
                    datas: [],
                    importData: {//导入数据
                        show: false,
                        showFileList: false
                    },
                    addCheckItemDiaglog: {
                        show: false
                    },

                },
                selfCheckHistoryDialog: {
                    show: false,
                    storeId: '',
                    StoreTypeId:''//业态
                },
                publishSelfCheckTaskDialog: {
                    show: false
                },
                publishPatrolTaskDialog: {
                    show: false
                },
                patrolHistoryDialog: {//巡查历史
                    show: false
                },
                Rowcontent: '',//巡查历史任务
                pageNation: {//分页
                    total: 0,
                    pageNum: 1,//页数
                    countPerPage: 20//每页数
                },
                StoreStatus: '',//门店状态
                listData: {//列表状态数据

                    selfCheckTimeValue: '',//自查次数
                    patrolValue: '',//巡查次数
                    patrolMan: '',//巡查员
                    selfCheckMan: '',//自查员
                    companyName: '',//单位名称
                    operateState: '',//经营业态
                    operateStateList: [//经营业态列表

                    ],
                    businessType: 1,//业务类型
                    businessTypeList: [//业务类型列表
                        {
                            label: '自查',
                            value: 1
                        },
                        {
                            label: '巡查',
                            value: 0
                        },
                    ],
                    storeStatus: '',//门店状态
                    storeStatusList: [
                        {
                            value: "0",
                            label: '正常'
                        },
                        {
                            value: "1",
                            label: '异常'
                        },
                        {
                            value: "2",
                            label: '停业'
                        }

                    ],
                    licence: '',//许可证
                    statusType: '',//
                    statusTypeList: [],
                    taskType: '',//任务类型
                    taskTypeList: [],
                    storeName: ''//门店名字
                },
                listMode: true,
                imgMode: false,
                listQueryConditions: true,
                imgQueryConditions: false,
                imgModeData: { //图片模式数据
                    pageNation: {//分页
                        total: 0,
                        pageNum: 1,//页数
                        pageSize: [9, 18, 27, 36],
                        countPerPage: 9//每页数
                    },
                    hidePicList: false,//隐藏图片内容
                    gridLoading: false, //loading显示,
                    currentActiveIndex: 0,//当前轮播图索引
                    statusTypeValue: '',//业态类型
                    statusTypeList: [//业态类型列表

                    ],
                    businessType: 1,//业务类型
                    businessTypeList: [//业务类型列表
                        {
                            label: '自查',
                            value: 1
                        },
                        {
                            label: '巡查',
                            value: 0
                        },
                    ],
                    currentBusinessType: '',//当前业务类型
                    taskType: '',//任务类型
                    taskTypeList: [],
                    taskNameValue: '',//任务名称
                    taskNameList: [//任务名称列表

                    ],
                    operateStatusValue: '',//经营业态
                    operateStatusList: [//经营业态列表

                    ],
                    startTime: '',//开始时间
                    endTime: '',//结束时间
                    imgStatus: '',//图片状态0未审核 1合格 2 不合格 3全部状态
                    imgStatusList: [//
                        {
                            label: 0,
                            value: '无'
                        },
                        {
                            label: 1,
                            value: '合格'
                        },
                        {
                            label: 2,
                            value: '不合格'
                        }
                    ],
                    storeName: '',//门店名称
                    companyName: '',//单位名称
                    licence: '',//许可证
                    currentOperateStatusValue: '',//当前业态类型id
                    patrolClass: "",//巡查大类
                    patrolClassList: [],
                    currentPatrolClass: 1,//当前巡查大类的id
                    currentSelfClass: '',//当前自查大类的id
                    patrolProject: '',//巡查项目
                    patrolProjectList: [],
                    accordingTask: false,//按任务查询
                    accordingStore: true,//按门店查询
                    imgResult: [],//按门店搜索九宫格图片
                    imgSwper: [],//按门店搜索轮播图
                    imgDateStartValue: '',
                    imgDateEndValue: '',
                    imgDetailInfo: {//右侧轮播图详细信息
                        taskType: '',
                        taskName: '',
                        storeName: '',
                        address: '',
                        selfCheckClass: '',//自查大类
                        pictureGetter: '',//照片提供人
                        selfProject: '',//自查项目
                        licence: '',//许可证号
                        isPass: '',//合格不合格
                        remind: '',//提醒
                        message: {
                            info: '标记不合格',
                            flag: false
                        },
                    }

                }
            }

        },
        props: '',
        computed: {},
        created: function () {

        },
        mounted() {

        },
        methods: {
            /**
             * 切换列表模式
             */
            SwitchingListMode() {
                this.listMode = !this.listMode;
                this.imgMode = !this.imgMode;
                this.listQueryConditions = !this.listQueryConditions;
                this.imgQueryConditions = !this.imgQueryConditions;
            },
            /**
             * 切换图片模式
             */
            SwitchingPictureMode() {
                this.pageNation.total = 0;
                this.listMode = !this.listMode;
                this.imgMode = !this.imgMode;
                this.listQueryConditions = !this.listQueryConditions;
                this.imgQueryConditions = !this.imgQueryConditions;
                this.accordingStoreQuary();//默认按门店查询
                this.getOperateInfo();//经营业态
                this.getPatrolOrSelfItemSort();
                this.getPIctrueBasicOptionList();
                //this.getInspectResultPicManageList(0); 
            },
            cancelTask() {

            },
            /**
             * 列表翻页
             */
            onPageNation() {
                this.checkResultManage();
            },
            /**
             * 图片翻页
             */
            onPicturePageNation() {
                if (this.imgModeData.accordingStore) {
                    this.getInspectResultPicManageList(0);
                } else {
                    this.getInspectResultPicManageList(1);
                }
            },
            /**
             * 列表模式任务类型
             */
            getBasicOptionList() {

                let dataInfo = {
                    "StoreTypeId": this.listData.statusType,//业态类型
                    "TaskTypeId": "",
                    "ProcessType": this.listData.businessType,//任务流类型：0巡查、1自查、2双随机
                    "Type": 1,
                    "PreviousId": ""
                };
                this.$api.GetBasicOptionList(dataInfo).then(res => {
                    if (res.IsSuccess) {
                        this.listData.taskTypeList = res.Content;
                    } else {
                        this.listData.taskTypeList = [];
                    }
                });
            },
            /**
             * 图片模式任务类型
             */
            getPIctrueBasicOptionList() {

                let dataInfo = {
                    "StoreTypeId": this.imgModeData.statusTypeValue,//业态类型
                    "TaskTypeId": "",
                    "ProcessType": this.imgModeData.businessType,//任务流类型：0巡查、1自查、2双随机
                    "Type": 1,//类型 1任务类型 2检查结果3处理结果 4餐厅类型 5执法处理 6检查项分类 7检查项重要项和
                    "PreviousId": ""
                };
                this.$api.GetBasicOptionList(dataInfo).then(res => {
                    if (res && res.Content.length > 0) {
                        this.imgModeData.taskTypeList = res.Content;
                        //this.imgModeData.taskType = res.Content[0].Id;
                        this.getTaskNameLstByTaskTypeId();
                    } else {
                        this.imgModeData.taskTypeList = [];
                    }
                });
            },
            /**
             * 列表模式业态类型改变
             */

            /**
             * 列表模式业务类型改变
             */
            changeListBusinessType(val) {

                this.imgModeData.taskNameList = '';
                this.listData.taskType = '';
                this.getBasicOptionList();
            },
            /**
             * 图片模式任务类型改变
             */
            changeTaskTypeList(val) {
                this.getTaskNameLstByTaskTypeId();
            },
            /**
             * 获取任务名称
             */
            getTaskNameLstByTaskTypeId() {
                if (this.imgModeData.taskType.length > 0) {
                    let data = {
                        TaskTypeId: this.imgModeData.taskType
                    }
                    this.$api.GetTaskNameLstByTaskTypeId(data).then(res => {
                        this.imgModeData.taskNameList = res.Content;
                    }).catch(() => {
                    })
                }

            },
            checkResultManage() {
                let data = {
                    "SelfCheckNum": this.listData.selfCheckTimeValue,
                    "Inspector": this.listData.patrolMan,
                    "SelfChecker": this.listData.selfCheckMan,
                    "PatrolNum": this.listData.patrolValue,
                    "StoreTypeId": this.listData.statusType,
                    "Licence": this.listData.licence,
                    "StoreStatus": this.listData.storeStatus,
                    "TaskStatus": 0,
                    "TaskTypeId": this.listData.taskType,
                    "Province": this.areaDatas.provience.code == null ? "" : this.areaDatas.provience.code.slice(2),
                    "City": this.areaDatas.city.code == null ? "" : this.areaDatas.city.code.slice(2),
                    "Area": this.areaDatas.town.code == null ? "" : this.areaDatas.town.code.slice(2),
                    "Street": this.areaDatas.street.code,
                    "Community": this.areaDatas.community.code,
                    "StoreName": this.listData.storeName,
                    "UnitName": this.listData.companyName,
                    "StoreTypeSec": this.listData.operateState,
                    "PageNo": this.pageNation.pageNum,
                    "PageSize": this.pageNation.countPerPage
                }
                this.$api.CheckResultManage(data).then(res => {
                    if (res && res.Content.length > 0) {
                        this.tableGrid.datas = res.Content;
                        this.pageNation.total = res.Data;
                        let _this = this;
                        for (let item of this.tableGrid.datas) {
                            if (item.StoreStatus == 0) {
                                _this.StoreStatus = "正常";
                            } else if (item.StoreStatus == 1) {
                                _this.StoreStatus = "异常";
                            } else {
                                _this.StoreStatus = "停业";
                            }
                        }
                    } else {
                        this.tableGrid.datas = [];
                        this.pageNation.total = 0;
                    }
                }).catch(r => {
                })
            },
            /**
             * 获取省市区街道
             */
            // this.$emit('regionalismResult', this.area)
            regionalismResult(area) {
                this.areaDatas = area;
                return this.areaDatas
            },
            initRegion(area) {
                this.getOperateInfo();
                this.getBasicOptionList();
                this.areaDatas = area;
                this.checkResultManage();
            },
            /**
             * 获取一级业态
             */
            changeListStatusType(val) {
                this.listData.operateState = ''
                this.listData.businessType = '';
                this.listData.taskType = '';
                this.$api.GetOperateInfo(2).then(res => {
                    this.listData.operateStateList = [];
                    if (res) {
                        res.forEach((value, index) => {
                            if (value.ParentId == val) {
                                this.listData.operateStateList.push(value);
                            }
                        })
                        //console.log(this.listData.operateStateList)
                    }
                }).catch(r => {
                });
            },
            /**
             * 获取经营业态
             */
            getOperateInfo() {
                this.imgModeData.gridLoading = true;
                this.$api.GetOperateInfo(1).then(res => {
                    if (res) {
                        this.listData.statusTypeList = res;
                        this.imgModeData.statusTypeList = res;
                        //this.imgModeData.statusTypeValue = res[0].Id;
                        this.imgModeData.gridLoading = false;
                    }
                }).catch(r => {
                    this.imgModeData.gridLoading = false;
                });
            },
            /**
             * 发布巡查任务
             */
            storesResult() {

            },
            /**
             * 查询
             */
            queryData() {
                this.checkResultManage();
            },
            provienceChange(code) {

                this.getAreaListByCode(code);

            },
            cityChange(code) {
            },
            townChange(code) {
            },
            streetChange(code) {


            },
            /**
             * 巡查历史
             */
            patrolHistory(ids) {
                this.patrolHistoryDialog.show = true;
                this.Rowcontent = this.tableGrid.datas[ids];
            },
            /**
             * 自查历史
             */
            selfHistory(storeId,StoreTypeId) {
                this.selfCheckHistoryDialog.show = true;
                this.selfCheckHistoryDialog.storeId = storeId;
                this.selfCheckHistoryDialog.StoreTypeId = StoreTypeId;
            },
            /**
             * 选择图片模式业态类型
             */
            changeOperateStatusValue(val) {
                this.imgModeData.statusTypeValue;
                this.imgModeData.currentOperateStatusValue = val;
                this.imgModeData.businessType = '';
                this.imgModeData.patrolClass = '';
                this.imgModeData.patrolProject = '';
                this.imgModeData.patrolProjectList = '';
                this.imgModeData.taskType = '';//任务名称为空
                this.getPatrolOrSelfItemSort();
                this.getPIctrueBasicOptionList();
            },
            /**
             * 选择业务类型(自查巡查)
             */
            changeBusinessType(val) {
                this.imgModeData.currentBusinessType = val;
                //获取业务类型下的自查大类和巡查大类
                //清空 大类  项目
                this.imgModeData.patrolClass = '';
                this.imgModeData.patrolClassList = [];
                this.imgModeData.patrolProject = '';
                this.imgModeData.patrolProjectList = [];
                this.getPatrolOrSelfItemSort();
                //获取任务类型
                this.getPIctrueBasicOptionList()

            },
            /**
             * 选择大类(自查巡查)
             */
            changePatrolClass(val) {
                //清空 大项
                this.imgModeData.patrolProject = '';
                this.imgModeData.patrolProjectList = [];
                this.imgModeData.patrolClass = val;
                this.initPatrolProjectGrid();

            },
            /**
             * 获取自查或巡查大类
             */
            getPatrolOrSelfItemSort() {//获取
                let data = {
                    "StoreTypeId": this.imgModeData.statusTypeValue,//this.imgModeData.statusTypeValue,//业态id
                    //"TaskTypeId": "",
                    "ProcessType": this.imgModeData.businessType,//0巡查、1自查、2双随机
                    "Type": 6,//检查项分类
                    "PreviousId": "",
                };
                this.$api.GetBasicOptionList(data).then(res => {
                    if (res && res.IsSuccess && res.Content.length > 0) {
                        this.imgModeData.patrolClassList = res.Content;

                        this.initPatrolProjectGrid();
                    } else {
                        this.imgModeData.patrolClassList = [];
                    }
                }).catch(r => {

                });

            },
            /**
             * 获取自查或巡查项目
             */
            initPatrolProjectGrid() {
                //this.tableGrid.Loading = true;
                if (this.imgModeData.patrolClass.length == 0) {
                    return;
                }
                let data = {
                    "StoreTypeId": this.imgModeData.statusTypeValue,
                    "ProcessType": this.imgModeData.businessType,//0巡查、1自查、2双随机
                    "ClassificationId": this.imgModeData.patrolClass,//当前大类的Id
                    "TaskTypeId": "",
                    "SearchWord": "",
                    "pageNo": this.pageNation.pageNum,
                    "pageSize": this.pageNation.countPerPage
                };
                this.$api.GetInspectOptionListAsync(data).then(res => {
                    if (res && res.Content) {
                        this.imgModeData.patrolProjectList = res.Content;
                    } else {
                        this.imgModeData.patrolProjectList = [];
                    }
                }).catch(r => {
                });

            },
            /**
             * 图片状态
             */
            changePictureStatus(val) {
                this.imgModeData.imgStatus
            },
            /**
             * 检查结果图片汇总
             */
            getInspectResultPicManageList(num) {
                this.imgModeData.gridLoading = true;
                let data = {};
                let appId = this.$utils.getUrlKey("appId");
                let userId = this.$utils.getUrlKey("userId");
                let orgId = this.$utils.getUrlKey('curChangeOrg');
                data.InputParamDTO = {
                    AppId: appId,
                    OrgId: orgId,
                    UserId: userId,
                    "QueryType": num,//查询类型 0 按门店查询 1 按任务查询
                    "IsComInspect": this.imgModeData.businessType,//业务类型 0巡查、1自查、2双随机
                    "Status": this.imgModeData.imgStatus,//图片状态 0未审核 1合格 2 不合格 3全部状态
                    "StartTime": this.imgModeData.imgDateStartValue,
                    "EndTime": this.imgModeData.imgDateEndValue,
                    "PageIndex": this.imgModeData.pageNation.pageNum,
                    "PageSize": this.imgModeData.pageNation.countPerPage,//每页多少条
                    "StoreTypeId": this.imgModeData.statusTypeValue,//经营业态
                    "Name": this.imgModeData.storeName,//(门店)名称
                    "LicenceCode": this.imgModeData.licence,
                    "Province": this.areaDatas.provience.code == null ? "" : this.areaDatas.provience.code.slice(2),
                    "City": this.areaDatas.city.code == null ? "" : this.areaDatas.city.code.slice(2),
                    "District": this.areaDatas.town.code == null ? "" : this.areaDatas.town.code.slice(2),//区
                    "Location": this.areaDatas.street.code,//街道
                    "Community": this.areaDatas.community.code,
                    "TaskTypeId": this.imgModeData.taskType,//任务类型
                    "TaskId": this.imgModeData.taskNameValue,//任务名称
                    "ClassificationId": this.imgModeData.patrolClass,//自查大类
                    "InspectOptionId": this.imgModeData.patrolProject,//自查项目
                }

                this.$api.GetInspectResultPicManageList(data).then(res => {
                    if (res && res.Content.length > 0) {
                        this.imgModeData.gridLoading = false;
                        this.imgModeData.imgResult = res.Content;
						console.log(this.imgModeData.imgResult)
                        this.imgModeData.pageNation.total = res.Data;
                        this.pageNation.total = 0;
                        for (let item of res.Content) {
                            if (item.Status == 2) {
                                item.qualified.hide = false;
                            }
                        }
                        this.getInspectResultPicDetailInfo(this.imgModeData.imgResult[0].Id);
                    } else {
                        this.imgModeData.imgResult = [];
                        this.imgModeData.gridLoading = false;
                        this.imgModeData.pageNation.total = 0;
                    }
                }).catch(() => {
                    this.imgModeData.gridLoading = false;
                })
            },
            /**
             * 获取轮播图的详细信息
             */
            getInspectResultPicDetailInfo(ids) {
                let data = {};
                let appId = this.$utils.getUrlKey("appId");
                let userId = this.$utils.getUrlKey("userId");
                let orgId = this.$utils.getUrlKey('curChangeOrg');
                data.InputParamDTO = {
                    Id: ids,
                    AppId: appId,
                    OrgId: orgId,
                    UserId: userId,
                    IsComInspect: this.imgModeData.businessType
                }
                this.$api.GetInspectResultPicDetailInfo(data).then(res => {
                    if (res && res.Content) {
                        this.imgModeData.imgSwper = res.Content;
                        this.imgModeData.imgDetailInfo.taskName = res.Content.TaskName;
                        this.imgModeData.imgDetailInfo.taskType = res.Content.TaskType;
                        this.imgModeData.imgDetailInfo.selfProject = res.Content.ExaminationProject;
                        this.imgModeData.imgDetailInfo.storeName = res.Content.StoreName;
                        this.imgModeData.imgDetailInfo.address = res.Content.Ads;
                        this.imgModeData.imgDetailInfo.selfCheckClass = res.Content.ExaminationClassfication;
                        this.imgModeData.imgDetailInfo.pictureGetter = res.Content.BodyName;
                        this.imgModeData.imgDetailInfo.licence = res.Content.LicencesNo;
                        this.imgModeData.imgDetailInfo.isPass = res.Content.Status;
                        this.imgModeData.imgDetailInfo.message.info = res.Content.message.info;
                        //this.setInspectResultPicStatus(res.Content.Status);//设置图片状态
                    } else {
                        this.imgModeData.imgSwper = [];
                    }
                }).catch(() => {

                })
            },
            /**
             * 点击左侧九宫格图片切换轮播图
             */
            leftImgClick(index, ids) {
				
                this.setActiveItem(index, ids);
                this.getInspectResultPicDetailInfo(ids)
            },
            /**
             * 点击轮播图切换九宫格图片
             */
            setActiveItem(index) {
                this.$refs.carousel.setActiveItem(index);
            },
			ShowDialog(e){
				if(e.PicType == 2){
					this.$api.GetVideoUrl({
						id:e.VideoId
					}).then(res=>{
						// console.log(res)
						if(res.IsSuccess == true){
						this.DetailsPage = true;
						this.playerOptions.poster = res.Data.FlThumbnaiPath;
						this.playerOptions.sources[0].src = res.Data.FlLocationPathList[0].VideoPath;
						}
					})
				}
			},
            /**
             * 设置检查结果图片状态
             */
            setInspectResultPicStatus(sts) {
                let data = {
                    "Id": "",//图片Id
                    "Status": sts,// 图片状态（0-无1-合格2-不合格）
                    "IsComInspect": this.imgModeData.businessType//是否自查 0巡查、1自查、2双随机
                };
                this.$api.SetInspectResultPicStatus(data).then(res => {

                }).catch(() => {
                })
            },
            /**
             * 左右切换轮播图显示对应的九宫格图片
             */
            onActiveItem(index) {

                let ids = this.imgModeData.imgResult[index].Id;
                //this.currentIndex = index;
                this.imgModeData.currentActiveIndex = index;
                for (var i = 0; i < this.imgModeData.imgResult.length; i++) {
                    if (ids == this.imgModeData.imgResult[i].Id) {
                        this.imgModeData.imgResult[i].isShow = true;
                        if (this.imgModeData.imgResult[i].Status != 2) {//false
                            this.imgModeData.imgDetailInfo.message.info = "标记不合格";
                        } else if (this.imgModeData.imgResult[i].Status == 2) {
                            this.imgModeData.imgDetailInfo.message.info = "取消不合格";
                        }
                    } else {
                        this.imgModeData.imgResult[i].isShow = false;
                    }
                }


            },
            /**
             * 设置图片合格不合格状态
             */
            setInspectResultPicStatus(inx, id, status) {
                let data = {
                    "Id": id,//
                    "Status": status,//
                    "IsComInspect": this.imgModeData.businessType //
                };
                this.$api.SetInspectResultPicStatus(data).then(res => {
                    if (res && res.IsSuccess) {
                        if (status == 2) {
                            this.imgModeData.imgDetailInfo.message.info = "取消不合格";
                        } else {
                            this.imgModeData.imgDetailInfo.message.info = "标记不合格";
                        }
                    } else {
                        this.message('设置图片状态失败', 2);
                    }
                }).catch(() => {
                })
            },
            /**
             * 标记不合格取消不合格
             */
            cancelNonconformity() {
                //知道轮播控件的index
                //所有的数据源 array 
                let ids = '';
                ids = this.imgModeData.currentActiveIndex;
                for (var i = 0; i < this.imgModeData.imgResult.length; i++) {
                    if (ids == i) {
                        this.imgModeData.imgResult[i].isShow = true;
                        if (this.imgModeData.imgResult[i].Status != 2) {//false
                            this.imgModeData.imgDetailInfo.message.info = "标记不合格";
                            this.imgModeData.imgDetailInfo.message.flag = true;
                            this.imgModeData.imgResult[i].qualified.hide = true;
                            this.imgModeData.imgResult[i].Status = 2;
                            this.setInspectResultPicStatus(i, this.imgModeData.imgResult[i].Id, this.imgModeData.imgResult[i].Status);
                        } else if (this.imgModeData.imgResult[i].Status == 2) {
                            this.imgModeData.imgDetailInfo.message.info = "取消不合格";
                            this.imgModeData.imgDetailInfo.message.flag = false;
                            this.imgModeData.imgResult[i].qualified.hide = false;
                            this.imgModeData.imgResult[i].Status = 1
                            this.setInspectResultPicStatus(i, this.imgModeData.imgResult[i].Id, this.imgModeData.imgResult[i].Status);
                        }
                    }
                }
            },
            StoreQuery() {
                this.getInspectResultPicManageList(0);
            },
            /**
             * 按门店查询
             */
            accordingStoreQuary() {
                this.imgModeData.imgDateStartValue = '';
                this.imgModeData.imgDateEndValue = '';
                this.imgModeData.accordingStore = true;
                this.imgModeData.accordingTask = false;
                this.getInspectResultPicManageList(0);

            },
            TaskQuery() {
                this.getInspectResultPicManageList(1);
            },
            /**
             * 按任务查询
             */
            accordingTaskQuary() {
                this.imgModeData.imgDateStartValue = '';
                this.imgModeData.imgDateEndValue = '';
                this.imgModeData.accordingStore = false;
                this.imgModeData.accordingTask = true;
                this.getInspectResultPicManageList(1);
                //this.changePictureStatus(); 
                this.getOperateInfo();
            },
            /**
             // * 按检查项查询
             */
            change(val) {
            }
        },
        beforeCreated() {

        },
        mounted() {

        }

    }
</script>
<style type="text/scss" lang="scss" scoped>

	.main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding-top: 10px;
        .searhCluseLabel {
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
            color: #606266;
            line-height: 34px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            width: 110px;
            display: inline-block;
        }
        .searchSelect {
            width: 170px;
        }
        .searchInput {
            width: 170px
        }
        .el-aside {
            padding-top: 15px;
        }
        .pre-lable {
            width: 92px !important;
        }
        .item {
            width: 33.3%;
            height: 200px;
            float: left;
            padding: 0 10px 10px 0;
            text-align: center;
            position: relative;
            list-style: none;
        }
        .itemWrong:before {
            content: "不合格";
            font-size: 20pt;
            position: absolute;
            top: 40%;
            left: 70%;
            color: red;
            margin-left: -80px;
            /* background: white; */
            padding: 6px 8px;
            background-color: rgba(255, 255, 255, 0.3);
            -webkit-transform: rotate(-45deg);
            border-radius: 40%;
        }
        .el-aside ul {
            overflow: hidden;
            padding-left: 0;
        }
        .item li {
            position: relative;
        }
        .item span {
            position: absolute;
            right: 10px;
            bottom: 10px;
            width: 90px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border: 1px solid #cccccc;
            border-bottom: none;
            border-right: none;
            font-size: 12px;
        }
        .item img {
            width: 100%;
            height: 100%;
        }

    }
	.playimg{
		position: absolute;
		width: 30px !important;
		height: 30px !important;
		top: 50% !important;
		left: 50% !important;
		margin-left: -15px !important;
		margin-top: -15px !important;
	}
    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        /*background-color: #99a9bf;*/
        background-color: #d3dce6;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }

    .imgDetail {
        text-align: left;
        font-size: 16px;
        p {
            text-align: left;
            font-size: 12px;
            color: #666666;
        }
        span {
            text-align: left;
        }

    }

    .el-carousel__container {
        height: 300px;
        img {
            width: 100%;
            height: 100%;
        }
    }

    .imgDetail .el-button {
        margin-right: 15px;
        height: 26px;
        line-height: 26px;
        padding: 0;
        width: 90px;
    }

    .active {
        border: 4px solid #409EFF;
    }

    .block {
        display: inline-block;
        margin: 0 5px;
        font-size: 14px;
        color: #606266;
        font-weight: 700;
    }

    .el-date-editor.el-input {
        width: 150px;
    }

    .imgArray1 {
        img {
            width: 33.3%
        }
    }

    .el-form-item {
        margin-bottom: 5px;
    }

    .el-carousel__indicators li span {
        display: none !important;
    }

    .linkType,
    .linkType:focus {
        color: #337ab7;
        cursor: pointer;

        &:hover {
            color: rgb(32, 160, 255);
        }
    }

    .imgdetailInfo {
        display: inline-block;
        width: 160px;
    }

    .wordInfo {
        width: 80px;
        text-aling: left;
        font-size: 14px;
        display: inline-block;

    }

    .el-carousel__item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .carousel-image {
            max-width: 100%;
            max-height: 100%;
        }
    }

    .el-table__body-wrapper is-scrolling-left {
        height: 100% !important;
    }

    .select-item {
        width: 170px;
    }
</style>
<style lang="scss">
	.checkResultManage .el-date-editor {
		width: 170px !important;
	}

	.pictureForm .el-input__inner {
		border: none;
		padding: 0;
	}

	.pictureForm .el-form-item {
		height: 25px;
		line-height: 25px;
	}
</style>
