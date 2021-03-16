<template>
    <div class="main-container checkItemLibrary">
        <el-tabs style="height:100%"
                 type="border-card"
                 ref="topTabs"
                 id="topTabs"
                 @tab-click="topTabsClick"
                 v-model.trim="topTabs.code">
            <el-tab-pane
                    v-for="tabitem in topTabs.datas"
                    :key="tabitem.Id"
                    :label="tabitem.Name"
                    :name="tabitem.Id"
            ></el-tab-pane>
            <div>
                <div>
                    <el-tabs v-model.trim="taskTabs.code" @tab-click="taskTabsClick">
                        <el-tab-pane v-for="taskItem in taskTabs.datas"
                                     :key="taskItem.Id"
                                     :label="taskItem.Text"
                                     :name="taskItem.Id"
                        ></el-tab-pane>
                    </el-tabs>
                </div>
                <el-container>
                    <el-aside width="200px" class="left">
                        <div class="classifyItemWrap">
                            <div class="classifyItem"
                                 @click="classfifyClick(inx)"
                                 v-for="(classifyItem ,inx) in classify.datas"
                                 :key="classifyItem.Id"
                                 :class="{classifyItemCurrent:inx==classify.currentIndex}"
                            >
                                <span v-text="classifyItem.Text"></span>
                                <i style="margin-left: 10px" class="el-icon-delete" @click.stop="delClassifyItem(classifyItem.Id)"></i>
                                <i class="el-icon-edit-outline" @click.stop="classifyItemEdit(classifyItem.Text,classifyItem.Score,classifyItem.Id)"></i>
                            </div>
                        </div>
                        <div style="position: absolute;left:0;right:0;bottom: 10px;background: rgb(236, 245, 255)">
                            <el-button type="primary" @click="addSort">添加分类</el-button>
                        </div>

                    </el-aside>
                    <el-main class="right">
                        <div class="tableheaderbac">
                            <el-input clearable class="searchInput" maxlength="15" placeholder="输入检查项名称查询" v-model.trim="tableGrid.searchStr"></el-input>
                            <el-button type="primary" style="margin-left: 10px" @click="queryGrid">查询</el-button>
                            <el-button type='primary' plain @click="openAddCheckItemDialog">添加检查项</el-button>
                            <!--<el-button type="primary" plain @click="importTemplateDownload">下载导入模板</el-button>-->
                            <!--<el-tooltip class="item" effect="dark" content="请选择excel文件,单次上传数据建议小于1000条" placement="top">-->
                            <!--<el-upload-->
                            <!--style="display: inline-block;margin-left: 10px;margin-right: 10px"-->
                            <!--action=""-->
                            <!--:show-file-list="false"-->
                            <!--:http-request="importStoreData"-->
                            <!--accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"-->
                            <!--&gt;-->
                            <!--<el-button type="primary" plain>数据导入</el-button>-->
                            <!--</el-upload>-->
                            <!--</el-tooltip>-->
                        </div>

                        <el-table
                                highlight-current-row
                                v-loading="tableGrid.Loading"
                                :data="tableGrid.datas"
                                border
                                :height="150"
                                ref="checkitemtable"
                                fit
                                style="width: 100%;">
                            <el-table-column :label="tableGrid.column.name" show-overflow-tooltip min-width="150">
                                <template slot-scope="scope">
                                    <span v-text="scope.row.Text"></span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="tableGrid.column.desc" show-overflow-tooltip min-width="150">
                                <template slot-scope="scope">
                                    <span v-text="scope.row.Remark"></span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="tableGrid.column.picDesc">
                                <template slot-scope="scope">
                                    <img style="height: 40px;width: 40px;border-radius: 4px" v-show="scope.row.Picture!=null&&scope.row.Picture.startsWith('http')" :src="getThumbPic(scope.row.Picture)">
                                </template>
                            </el-table-column>
                            <el-table-column :label="tableGrid.column.camaraOptions" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-text="scope.row.LevelId==null||scope.row.LevelId==''?'无':'有'"></span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="tableGrid.column.step" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-text="scope.row.InspectMethod!=4?'有':'无'"></span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="tableGrid.column.guidedGrap" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-text="scope.row.InspectOptionGuidelist!=null&&scope.row.InspectOptionGuidelist.length>0?'有':'无'"></span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="tableGrid.column.guidedTip">
                                <template slot-scope="scope">
                                    <span v-text="scope.row.InspectOptionGuidelist!=null&&scope.row.InspectOptionGuidelist.length>0?'有':'无'"></span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="tableGrid.column.turnAudio">
                                <template slot-scope="scope">
                                    <span v-text="scope.row.IsVoicePlay?'是':'否'"></span>
                                </template>
                            </el-table-column>
							<el-table-column :label="tableGrid.column.fivetype">
							    <template slot-scope="scope">
							        <span v-text="scope.row.FiveSetType"></span>
							    </template>
							</el-table-column>
                            <el-table-column :label="tableGrid.column.operate" min-width="150px">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="editGridItem(scope.row)">编辑</el-button>
                                    <el-button size="mini" type="danger" @click="delGridItem(scope.row.Id)">删除</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column :label="tableGrid.column.operateSort" min-width="150px">
                                <template slot-scope="scope">
                                    <el-button size="mini" v-show="!tableGrid.searchStatus" type="primary" @click="updateGridItemSort(scope.row.Id,0)">向下</el-button>
                                    <el-button size="mini" v-show="!tableGrid.searchStatus" type="primary" @click="updateGridItemSort(scope.row.Id,1)">向上</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination ref="pagination" v-show="pageNation.total"
                                    :total="pageNation.total"
                                    :page.sync="pageNation.pageNum"
                                    :limit.sync="pageNation.countPerPage"
                                    @pagination="onPageNation">
                        </pagination>
                    </el-main>
                </el-container>
            </div>
        </el-tabs>

        <el-dialog
                title="添加分类"
                :visible.sync="addSortDialog.show"
                width="40%"
                top="30vh"
                :close-on-click-modal="false">
            <div>
                <label class="check-lable" style="margin-left: 10px">分类名称</label>
                <el-input clearable class="searchInput" maxlength='20' v-model.trim="addSortDialog.name" placeholder="输入分类名称"></el-input>
            </div>
            <div style="margin-top: 10px">
                <label class="check-lable" style="margin-left: 10px">排序</label>
                <el-input clearable class="searchInput" @input="BlurText($event)" v-model.trim="addSortDialog.sort" type="number" v-enter-number placeholder="输入排序顺序"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="addSortDialog.show = false">取消</el-button>
                    <el-button type="primary" @click="saveAddSort">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                v-if="tableGrid.addCheckItemDiaglog.show"
                title="添加检查项"
                :visible.sync="tableGrid.addCheckItemDiaglog.show"
                width="40%"
                top="10vh"
                :close-on-click-modal="false">
            <div class="maxDialog">
                <div class="mbottm20">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px">分类/类型</label>
                    <el-select clearable style="margin-left: 10px" :filterable="classify.datas.length > 7" v-model.trim="tableGrid.addCheckItemDiaglog.sortCode">
                        <el-option v-for="it_em in classify.datas" :key="it_em.Id"
                                   :label="it_em.Text" :value="it_em.Id">
                        </el-option>
                    </el-select>
                </div>
                <div class="mbottm20">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px">检查项名称</label>
                    <el-input clearable class="addCheckItemDialogInput" maxlength="50" v-model.trim="tableGrid.addCheckItemDiaglog.checkItemName"></el-input>
                </div>
                <div class="mbottm20">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px">说明</label>
                    <el-input clearable class="addCheckItemDialogInput" rows="3" type="textarea" maxlength="300" v-model.trim="tableGrid.addCheckItemDiaglog.desc"></el-input>
                </div>
                <div class="mbottm20">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px;margin-top: -100px">图片说明</label>
                    <span style="display:inline-block;">
                    <img class="showImg" :src="tableGrid.addCheckItemDiaglog.picDescUrl"
                         @click="uoloadImg(tableGrid.currentUploadImgEnum.picDesc,0)"
                         alt=""
                    >
                    </span>
                </div>
                <div class="mbottm20">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px">检查项重要程度</label>
                    <el-select clearable
						:filterable="tableGrid.addCheckItemDiaglog.checkItemImportanceList.length > 7"
                               v-model="tableGrid.addCheckItemDiaglog.checkItemImportance"
                    >
                        <el-option v-for="iit in tableGrid.addCheckItemDiaglog.checkItemImportanceList"
                                   :key="iit.Id"
                                   :label="iit.Text" :value="iit.Id">
                        </el-option>
                    </el-select>
                </div>
                <div class="mbottm20">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px">是否转换语音</label>
                    <el-select clearable v-model="tableGrid.addCheckItemDiaglog.turnAudio">
                        <el-option label="否" value="0"></el-option>
                        <el-option label="是" value="1"></el-option>
                    </el-select>
                </div>
                <div class="mbottm20" v-if="taskTabs.code==1">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px">检查管理</label>
                    <el-select  v-model="tableGrid.addCheckItemDiaglog.tag" :filterable="tableGrid.addCheckItemDiaglog.checkTag.length > 7">
                        <el-option v-for="itt in tableGrid.addCheckItemDiaglog.checkTag"  :label="itt.label" :value="itt.value"></el-option>
                    </el-select>
                </div>
				<div class="mbottm20" v-if="taskTabs.code == 1 && tableGrid.addCheckItemDiaglog.step == 1">
				    <label class="addCheckItemDialogLabel" style="margin-left: 10px">五定类型</label>
				    <el-select v-model="tableGrid.addCheckItemDiaglog.FiveType">
				        <el-option label="五定拍照" value="1"></el-option>
				        <el-option label="五定拍照+五定视频" value="2"></el-option>
						<el-option label="五定短视频(6秒)" value="3"></el-option>
						<el-option label="五定中长视频(3分钟)" value="4"></el-option>
						<!-- <el-option label="五定长视频(1小时)" value="5"></el-option> -->
				    </el-select>
				</div>
                <div class="mbottm20">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px">操作步骤</label>
                    <el-select v-model="tableGrid.addCheckItemDiaglog.step" @change="stepChange">
                        <el-option label="无需拍照" value="4"></el-option>
                        <el-option label="一个步骤,一张照片" value="1"></el-option>
                        <el-option label="一个步骤,多张照片" value="2"></el-option>
                        <el-option label="多个步骤,每个步骤对应一张照片" value="3"></el-option>
                    </el-select>
                </div>
				
                <div class="mbottm20" v-show="tableGrid.addCheckItemDiaglog.step!=4&&tableGrid.addCheckItemDiaglog.step.length>0">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px;margin-top: -100px">添加引导图</label>
                    <span style="display:inline-block;">
                    <img class="showImg" :src="tableGrid.addCheckItemDiaglog.guideUrl"
                         @click="uoloadImg(tableGrid.currentUploadImgEnum.picGuide,0)"
                         alt=""
                    >
                    </span>
                    <span class="addPic" style="margin-top: -100px" @click="addMoreGuides" v-if="tableGrid.addCheckItemDiaglog.step==3"></span>
                    <span class="downarrow" style="margin-top: -100px" @click="top2second" v-if="tableGrid.addCheckItemDiaglog.moreGuides.datas.length>0"></span>
                    <div style="margin-left: 110px;margin-top: 2px">
                        <el-input clearable class="addCheckItemDialogInput" v-model.trim="tableGrid.addCheckItemDiaglog.guideDesc" placeholder="输入引导语"></el-input>
                    </div>
                </div>
                <div class="mbottm20" v-for="(moreGuidesItem ,index) in tableGrid.addCheckItemDiaglog.moreGuides.datas"
                     :key="moreGuidesItem.id">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px;margin-top: -100px">&nbsp;</label>
                    <span style="display:inline-block;">
                    <img class="showImg" :src="moreGuidesItem.Picture"
                         @click="uoloadImg(tableGrid.currentUploadImgEnum.morePicGuide,index)"
                         alt=""
                    >
                    </span>
                    <span class="delPic" style="margin-top: -100px" @click="delMoreGuides(index)"></span>
                    <span class="uparrow" style="margin-top: -100px" @click="upArrow(index)"></span>
                    <span class="downarrow" v-if="index<tableGrid.addCheckItemDiaglog.moreGuides.datas.length-1" style="margin-top: -100px" @click="downArrow(index)"></span>
                    <div style="margin-left: 110px;margin-top: 2px">
                        <el-input clearable v-model.trim="moreGuidesItem.Text" class="addCheckItemDialogInput" placeholder="输入引导语"></el-input>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                  <el-button @click="tableGrid.addCheckItemDiaglog.show = false">取消</el-button>
                  <el-button type="primary" @click="saveAddItemCheck">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                :close-on-click-modal="false"
                append-to-body
                title="上传图片"
                :visible.sync="uploadDialog.show"
                width="70%">
            <VueCropper @finish="finish" :key="id"/>
        </el-dialog>
        <div v-if="showImportProgress" class="el-loading-mask is-fullscreen" style="background-color: rgba(0, 0, 0, 0.7); z-index: 2009;">
            <div class="el-loading-spinner">
                <el-progress type="circle" :percentage="importProgress"></el-progress>
            </div>
        </div>
        <el-dialog
                v-if="importResult.showImportResult"
                title="导入结果"
                custom-class="operate-dialog"
                :visible.sync="importResult.showImportResult"
                width="60%"
                :close-on-click-modal="false">
            <div class="importResultClass">导入总数据&nbsp;<span class="resutNum" v-text="importResult.allNum"></span>&nbsp;条&nbsp;</div>
            <div v-if="importResult.successTotal>0" class="importResultClass importResultClassChild">
                <span>导入成功&nbsp;<span class="resutNumChild" v-text="importResult.successTotal"></span>&nbsp;条</span>
                <!--<span v-if="importResult.addSucNum>0">新增数据&nbsp;<span v-text="importResult.addSucNum" class="resutNumChild"></span>&nbsp;条;</span>-->
                <!--<span v-if="importResult.updataSucNum>0">更新原有数据&nbsp;<span v-text="importResult.updataSucNum" class="resutNumChild"></span>&nbsp;条</span>-->
            </div>
            <div v-if="importResult.failTotal>0" class="importResultClass importResultClassChild">
                <span>导入失败&nbsp;<span class="resutNumChild" v-text="importResult.failTotal"></span>&nbsp;条</span>
                <!--<span v-if="importResult.noImportNum>0">未导入&nbsp;<span v-text="importResult.noImportNum" class="resutNumChild"></span>&nbsp;条;</span>-->
                <!--<span v-if="importResult.addFailNum>0">新增失败&nbsp;<span v-text="importResult.addFailNum" class="resutNumChild"></span>&nbsp;条;</span>-->
                <!--<span v-if="importResult.updataFailNum>0">更新原有数据失败&nbsp;<span v-text="importResult.updataFailNum" class="resutNumChild"></span>&nbsp;条</span>-->
            </div>
            <div style="margin-top: 5px">
                <span class="importResultClass">以下是部分未导入的数据</span>
                <!--<a class="resultTableUrl" v-if="importResult.showResultTableUrl" :href="importResult.resultTableUrl">导出详细表格</a>-->
            </div>

            <el-table
                    :data="importResult.ImportResultList"
                    border
                    :height="importResult.gridHeight"
                    fit
                    :show-header="importResult.resultTableHeader"
                    style="width: 100%;">
                <el-table-column type="index" width="40"></el-table-column>
                <el-table-column min-width="150px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.Text }}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="150px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.ErrorMsg }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
    import EditableCell from "../../components/EditableCell.vue";
    import Pagination from '../../components/Pagination';
    import VueCropper from '@/components/VueCropper/index.vue';
    import store from '../../store/index'

    export default {
        components: {
            EditableCell,
            Pagination,
            VueCropper,
        },
        data() {
            return {
                importResult: {
                    showImportResult: false,
                    gridHeight: 500,
                    ImportResultList: [],//导入结果表格数据
                    allNum: 0,//导入总数
                    noImportNum: 0,//未导入数目
                    updataFailNum: 0,//更新失败数据
                    updataSucNum: 0,//更新成功条数
                    addSucNum: 0,//新增成功数
                    addFailNum: 0,//新增成功数
                    successTotal: 0,//成功总数
                    failTotal: 0,//失败总数
                    resultTableHeader: false,
                    resultTableUrl: '',
                    showResultTableUrl: false
                },
				FiveType:'1',
                showImportProgress: false,
                importProgress: 0,
                AppId: '',
                id: +new Date(),
                topTabs: {//顶部业态
                    //业态
                    datas: [],
                    code: "" //当前业态值
                },
                taskTabs: {//业态下的任务
                    code: "", //当前值
                    datas: [],
                    currentCode: ''//当前所在
                },
                tableGrid: {
                    searchStatus: false,
                    Loading: false,
                    column: {
                        type: '分类',
                        name: '名称',
                        desc: '说明',
                        picDesc: '图片说明',
                        logic: '业务应用',
                        camaraOptions: '重要项',
                        step: '操作步骤',
                        guidedGrap: '引导图',
                        guidedTip: '引导语',
                        turnAudio: '语音提示',
						fivetype:'五定类型',
                        operate: '操作',
                        operateSort: '排序'
                    },
                    datas: [],
                    importData: {//导入数据
                        show: false,
                        showFileList: false
                    },
                    addCheckItemDiaglog: {
                        tag: 0,
                        checkTag: [//检查管理
                            {
                                value: 0,
                                label: '无'
                            },
                            {
                                value: 1,
                                label: '厨余垃圾'
                            },
                            {
                                value: 2,
                                label: '添加剂'
                            },
                            {
                                value: 3,
                                label: '消毒管理'
                            },
                            {
                                value: 4,
                                label: '留样管理'
                            },
                            {
                                value: 5,
                                label: '晨检'
                            },
                        ],
                        show: false,
                        sortList: [],//检查项分类数据
                        sortCode: '',//检查项Id
                        checkItemName: '',//名称
                        desc: '',//说明
                        picDescUrl: '',//图片说明url地址
                        checkItemImportance: '',//重要程度ID
                        checkItemImportanceList: [],//重要程度list
                        checkItemImportanceText: '',
                        turnAudio: '1',
                        step: '1',//操作步骤
                        guideUrl: '',//默认的单个引导图
                        guideDesc: '',//默认的单个引导语
                        guideId: '',//默认的引导图的ID
                        moreGuides: {//添加的更多引导图
                            datas: []
                        },
                        itemId: '',
						FiveType:'1',
                        model: 0//0新建  1 编辑
                    },
                    searchStr: '',
                    currentUploadImg: '',//当前上传图片位置标识
                    currentUploadImgEnum: {//当前上传图片位置枚举值
                        picDesc: 'picDesc',//图片说明位置
                        picGuide: 'picGuide',//默认引导图位置
                        morePicGuide: 'morePicGuide'
                    },
                    guidPicUploadIndex: 0,
                    defaultUploadImg: require('@/assets/images/tianjia_upload.png'),
                    // defaultUploadImg: 'http://fileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetFile?fileURL=29e54e46-3e17-4ca4-8f03-db71fb8f967d%2f2018042420%2f9a8de075-fffc-431c-a7e6-0c70a0395b39_9ec9615f-5ba7-4840-95c9-477cacca29c8.jpg',
                },
                pageNation: {//分页
                    total: 0,
                    pageNum: 1,//页数
                    countPerPage: 10//每页数
                },
                classify: {//分类
                    datas: [],
                    currentIndex: 0
                },
                addSortDialog: {
                    show: false,
                    name: '',
                    sort: '',
                    id: ''
                },
                uploadDialog: {
                    show: false
                }
            }

        },
        props: "",
        computed: {},
        methods: {
            BlurText(e) {
                if (e.length > 0) {
                    let boolean = new RegExp("^[1-9][0-9]*$").test(e);
                    if (!boolean) {
                        this.message('请填写正确排序', 2);
                    }
                }

            },
            getThumbPic(url) {
                if (url != null && url != undefined && url.startsWith('http')) {
                    //做缩略图处理
                    let relaPath = this.getUrlParam(url, 'fileURL');
                    if(this.$utils.isTestEvn()){
                        if (this.$utils.isHttpsProtal()) {
                            return 'https://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                        } else {
                            return 'http://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                        }

                    } else {
                            if (this.$utils.isHttpsProtal()) {
                                return 'https://fileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                            } else {
                                return 'http://fileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                            }

                    }
                }


            },
            openAddCheckItemDialog() {
                if (this.classify.datas.length == 0) {
                    this.message('请优先创建检查项分类', 2);
                    return;
                }
                this.tableGrid.addCheckItemDiaglog.show = true;
				this.tableGrid.addCheckItemDiaglog.FiveType = '1'
                this.tableGrid.addCheckItemDiaglog.sortCode = this.classify.datas[this.classify.currentIndex].Id;
                this.tableGrid.addCheckItemDiaglog.checkItemName = '';
                this.tableGrid.addCheckItemDiaglog.desc = '';
                this.tableGrid.addCheckItemDiaglog.picDescUrl = this.tableGrid.defaultUploadImg;
                if (this.tableGrid.addCheckItemDiaglog.checkItemImportanceList.length > 0) {
                    for (let ittm of this.tableGrid.addCheckItemDiaglog.checkItemImportanceList) {
                        if (ittm.IsDefault) {
                            this.tableGrid.addCheckItemDiaglog.checkItemImportance = ittm.Id;
                            break;
                        }
                    }
                } else {
                    this.tableGrid.addCheckItemDiaglog.checkItemImportance = '';
                }
                this.tableGrid.addCheckItemDiaglog.checkItemImportanceText = '';
                this.tableGrid.addCheckItemDiaglog.turnAudio = '1';
                this.tableGrid.addCheckItemDiaglog.step = '1';
                this.tableGrid.addCheckItemDiaglog.moreGuides.datas = [];
                this.tableGrid.addCheckItemDiaglog.model = 0;
                this.tableGrid.addCheckItemDiaglog.guideUrl = this.tableGrid.defaultUploadImg;
                this.tableGrid.addCheckItemDiaglog.guideDesc = '';
                this.tableGrid.addCheckItemDiaglog.tag = 0;
            },
            editGridItem(item) {
                this.tableGrid.addCheckItemDiaglog.itemId = item.Id;
                this.tableGrid.addCheckItemDiaglog.model = 1;
                let moreGuides = [];
                if (item.InspectOptionGuidelist != null && item.InspectOptionGuidelist.length > 0) {
                    let index = 0;
                    for (let ii of item.InspectOptionGuidelist) {
                        if (index == 0) {
                            this.tableGrid.addCheckItemDiaglog.guideUrl = ii.Picture.startsWith('http') ? ii.Picture : this.tableGrid.defaultUploadImg;
                            this.tableGrid.addCheckItemDiaglog.guideDesc = ii.Text;
                            this.tableGrid.addCheckItemDiaglog.guideId = ii.Id;
                        } else {
                            moreGuides.push({
                                "Id": ii.Id,
                                "AppId": this.AppId,
                                "Text": ii.Text,
                                "Picture": ii.Picture,
                                "InspectOptionId": item.Id
                            })
                        }
                        index++;
                    }
                } else {
                    this.tableGrid.addCheckItemDiaglog.guideUrl = this.tableGrid.defaultUploadImg;
                    this.tableGrid.addCheckItemDiaglog.guideDesc = '';
                    this.tableGrid.addCheckItemDiaglog.guideId = '';
                }
                this.tableGrid.addCheckItemDiaglog.sortCode = item.ClassificationId;
                this.tableGrid.addCheckItemDiaglog.checkItemName = item.Text;
                this.tableGrid.addCheckItemDiaglog.desc = item.Remark;
                this.tableGrid.addCheckItemDiaglog.picDescUrl = item.Picture.startsWith('http') ? item.Picture : this.tableGrid.defaultUploadImg;
                this.tableGrid.addCheckItemDiaglog.checkItemImportance = item.LevelId;
                this.tableGrid.addCheckItemDiaglog.checkItemImportanceText = '';
                this.tableGrid.addCheckItemDiaglog.turnAudio = item.IsVoicePlay ? "1" : "0";
                this.tableGrid.addCheckItemDiaglog.step = item.InspectMethod == null ? '' : +item.InspectMethod + '';
                this.tableGrid.addCheckItemDiaglog.moreGuides.datas = moreGuides;
                this.tableGrid.addCheckItemDiaglog.show = true;
				let arr = [1,2,3,4,5];
				let arr2 = ['五定拍照','五定拍照+五定视频','五定短视频(6秒)','五定中长视频(3分钟)','五定长视频(1小时)']
				this.tableGrid.addCheckItemDiaglog.FiveType = arr[arr2.indexOf(item.FiveSetType)].toString()
                this.tableGrid.addCheckItemDiaglog.tag = item.Tag==null||item.Tag==undefined?0:item.Tag;
            },
            saveAddItemCheck() {//添加保存
                if (this.tableGrid.addCheckItemDiaglog.sortCode == '') {
                    this.message('请选择检查项分类', 2);
                    return;
                }
                if (this.tableGrid.addCheckItemDiaglog.checkItemName == '') {
                    this.message('请填写检查项名称', 2);
                    return;
                }
                if (this.tableGrid.addCheckItemDiaglog.desc == '') {
                    this.message('请填写说明', 2);
                    return;
                }
                if (this.tableGrid.addCheckItemDiaglog.step == '') {
                    this.message('请选择操作步骤', 2);
                    return;
                }
                let InspectOptionGuidelist = [];
                if (!this.tableGrid.addCheckItemDiaglog.picDescUrl.startsWith('http')) {
                    this.message('请上传说明图片', 2);
                    return;
                }
                if (this.tableGrid.addCheckItemDiaglog.checkItemImportance == '') {
                    this.message('请选择检查项重要程度', 2);
                    return;
                }
                let data;
                let model = this.tableGrid.addCheckItemDiaglog.model;
                if (model == 0) {//新增
                    if (this.tableGrid.addCheckItemDiaglog.step == 4) {//无需拍照

                    } else {
                        if (this.tableGrid.addCheckItemDiaglog.guideUrl.startsWith('http')) {
                            InspectOptionGuidelist.push(
                                {
                                    "AppId": this.AppId,
                                    "Text": this.tableGrid.addCheckItemDiaglog.guideDesc,
                                    "Picture": this.tableGrid.addCheckItemDiaglog.guideUrl,
                                    "SubDate": "",
                                }
                            );
                        } else {
                            this.message('请上传引导图片', 2);
                            return;
                        }
                        if (this.tableGrid.addCheckItemDiaglog.guideDesc == '') {
                            this.message('请填写引导语', 2);
                            return;
                        }
                        for (let it of  this.tableGrid.addCheckItemDiaglog.moreGuides.datas) {
                            if (it.Picture.startsWith('http')) {
                                if (it.Text == null || it.Text.length == 0) {
                                    this.message('请填写引导语', 2);
                                    return false;
                                }
                            } else {
                                if (it.Text != null && it.Text.length > 0) {
                                    this.message('请上传引导图', 2);
                                    return false;
                                }
                            }
                            if ((it.Text != null && it.Text.length > 0) && it.Picture.startsWith('http')) {
                                InspectOptionGuidelist.push(
                                    {
                                        "AppId": this.AppId,
                                        "Text": it.Text,
                                        "Picture": it.Picture,
                                        "SubDate": "",
                                    }
                                );
                            }
                        }
                    }
                    data = {
                        "ClassificationId": this.tableGrid.addCheckItemDiaglog.sortCode,
                        "AppId": this.AppId,
                        "Text": this.tableGrid.addCheckItemDiaglog.checkItemName,
                        "Remark": this.tableGrid.addCheckItemDiaglog.desc,
                        "Picture": this.tableGrid.addCheckItemDiaglog.picDescUrl,
                        "LevelId": this.tableGrid.addCheckItemDiaglog.checkItemImportance,
                        "LevelText": this.tableGrid.addCheckItemDiaglog.checkItemImportanceText,
                        "HasGuidedGraph": this.tableGrid.addCheckItemDiaglog.guideUrl.startsWith('http') ? true : false,
                        "HasGuideLanguage": this.tableGrid.addCheckItemDiaglog.guideDesc.length > 0 ? true : false,
                        "IsVoicePlay": this.tableGrid.addCheckItemDiaglog.turnAudio == 1 ? true : false,
                        "InspectMethod": this.tableGrid.addCheckItemDiaglog.step,
                        "InspectOptionGuidelist": InspectOptionGuidelist,
                        "StoreTypeId": this.topTabs.code,
                        "ProcessType": this.taskTabs.code,
                        "Tag":this.tableGrid.addCheckItemDiaglog.tag,
						"FiveSetType":this.taskTabs.code == 0 ? 1 : Number(this.tableGrid.addCheckItemDiaglog.FiveType)
                    };
                } else {////编辑
                    if (this.tableGrid.addCheckItemDiaglog.step == 4) {//无需拍照

                    } else {
                        if (this.tableGrid.addCheckItemDiaglog.guideUrl.startsWith('http')) {
                            if (this.tableGrid.addCheckItemDiaglog.guideId == null || this.tableGrid.addCheckItemDiaglog.guideId == '') {
                                InspectOptionGuidelist.push(
                                    {
                                        "AppId": this.AppId,
                                        "Text": this.tableGrid.addCheckItemDiaglog.guideDesc,
                                        "Picture": this.tableGrid.addCheckItemDiaglog.guideUrl,
                                        "SubDate": "",
                                        "InspectOptionId": this.tableGrid.addCheckItemDiaglog.itemId
                                    }
                                );
                            } else {
                                InspectOptionGuidelist.push(
                                    {
                                        "Id": this.tableGrid.addCheckItemDiaglog.guideId,
                                        "AppId": this.AppId,
                                        "Text": this.tableGrid.addCheckItemDiaglog.guideDesc,
                                        "Picture": this.tableGrid.addCheckItemDiaglog.guideUrl,
                                        "SubDate": "",
                                        "InspectOptionId": this.tableGrid.addCheckItemDiaglog.itemId
                                    }
                                );
                            }

                        } else {
                            this.message('请上传引导图片', 2);
                            return;
                        }
                        if (this.tableGrid.addCheckItemDiaglog.guideDesc == '') {
                            this.message('请填写引导语', 2);
                            return;
                        }
                        for (let it of  this.tableGrid.addCheckItemDiaglog.moreGuides.datas) {
                            if (!it.Picture.startsWith('http')) {
                                this.message('请上传引导图', 2);
                                return false;
                            }
                            if (it.Text == null || it.Text.length == 0) {
                                this.message('请填写引导语', 2);
                                return false;
                            }
                            if ((it.Text != null && it.Text.length > 0) && it.Picture.startsWith('http')) {
                                if (it.Id == null || it.Id == "") {
                                    InspectOptionGuidelist.push(
                                        {
                                            "AppId": this.AppId,
                                            "Text": it.Text,
                                            "Picture": it.Picture,
                                            "SubDate": "",
                                            "InspectOptionId": this.tableGrid.addCheckItemDiaglog.itemId
                                        }
                                    );
                                } else {
                                    InspectOptionGuidelist.push(
                                        {
                                            "Id": it.Id,
                                            "AppId": this.AppId,
                                            "Text": it.Text,
                                            "Picture": it.Picture,
                                            "SubDate": "",
                                            "InspectOptionId": this.tableGrid.addCheckItemDiaglog.itemId
                                        }
                                    );
                                }

                            }
                        }
                    }
                    data = {
                        "Id": this.tableGrid.addCheckItemDiaglog.itemId,
                        "ClassificationId": this.tableGrid.addCheckItemDiaglog.sortCode,
                        "AppId": this.AppId,
                        "Text": this.tableGrid.addCheckItemDiaglog.checkItemName,
                        "Remark": this.tableGrid.addCheckItemDiaglog.desc,
                        "Picture": this.tableGrid.addCheckItemDiaglog.picDescUrl,
                        "LevelId": this.tableGrid.addCheckItemDiaglog.checkItemImportance,
                        "LevelText": this.tableGrid.addCheckItemDiaglog.checkItemImportanceText,
                        "HasGuidedGraph": this.tableGrid.addCheckItemDiaglog.guideUrl.startsWith('http') ? true : false,
                        "HasGuideLanguage": this.tableGrid.addCheckItemDiaglog.guideDesc.length > 0 ? true : false,
                        "IsVoicePlay": this.tableGrid.addCheckItemDiaglog.turnAudio == 1 ? true : false,
                        "InspectMethod": this.tableGrid.addCheckItemDiaglog.step,
                        "InspectOptionGuidelist": InspectOptionGuidelist,
                        "StoreTypeId": this.topTabs.code,
                        "ProcessType": this.taskTabs.code,
                        "Tag":this.tableGrid.addCheckItemDiaglog.tag,
						"FiveSetType":this.taskTabs.code == 0 ? 1 : Number(this.tableGrid.addCheckItemDiaglog.FiveType)
                    };
                }

                let HasGuidedGraph = false;
                let HasGuideLanguage = false;
                if (InspectOptionGuidelist.length > 0) {
                    HasGuidedGraph = true;
                    HasGuideLanguage = true;
                }
                if (model == 0) {
                    this.$api.SaveInspectOptionAsync(data).then(res => {
                        this.$utils.consoleObj(res);
                        if (res && res.IsSuccess) {
                            this.message('保存成功', 1);
                            this.tableGrid.addCheckItemDiaglog.show = false;
                            this.initGrid();
                        } else {
                            this.message(res.Message == null || res.Message == '' ? '保存失败' : res.Message, -1);
                        }
                    }).catch(r => {
                        this.$utils.consoleObj(r);
                        this.message(r.Message == null || r.Message == '' ? '保存失败' : r.Message, -1);
                    })
                } else {
                    this.$api.UpdateInspectOptionAsync(data).then(res => {
                        if (res && res.IsSuccess) {
                            this.message('保存成功', 1);
                            this.tableGrid.addCheckItemDiaglog.show = false;
                            this.initGrid();
                        } else {
                            this.message(res.Message == null || res.Message == '' ? '保存失败' : res.Message, -1);
                        }
                    }).catch(r => {
                        this.message(r.Message == null || r.Message == '' ? '保存失败' : r.Message, -1);
                    })
                }

            },
            updateGridItemSort(itemId, type) {
                let data = {
                    "Id": itemId,
                    "SortType": type,
                };
                this.$api.SortInspectOptionAsync(data).then(res => {
                    if (res && res.IsSuccess) {
                        this.message('操作成功', 1);
                        this.initGrid();
                    } else {
                        this.message(res.Message == null || res.Message == '' ? '操作失败' : res.Message, -1);
                    }
                }).catch(r => {
                    this.message(r.Message == null || r.Message == '' ? '操作失败' : r.Message, -1);
                })
            }
            ,
            delGridItem(id) {
                let ids = [];
                ids.push(id);
                this.$confirm('删除后影响已经配置的业务，确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {"ids": ids};
                    this.$api.DelInspectOptionAsync(data).then(res => {
                        if (res && res.IsSuccess) {
                            this.message('删除成功', 1);
                            this.initGrid();
                        } else {
                            this.message(res.Message == null || res.Message == '' ? '删除失败' : res.Message, -1);
                        }

                    }).catch(error => {
                        this.message(error.Message == null || error.Message == '' ? '删除失败' : error.Message, -1);
                    });

                }).catch(() => {

                });
            },
            addMoreGuides() {
                if (this.tableGrid.addCheckItemDiaglog.moreGuides.datas.length > 8) {
                    this.message('最多能添加10张引导图', 2);
                    return;
                }
                this.tableGrid.addCheckItemDiaglog.moreGuides.datas.push({
                    // "Id": '',
                    "AppId": this.AppId,
                    "Text": '',
                    "Picture": this.tableGrid.defaultUploadImg,
                    "SubDate": "",
                    "InspectOptionId": ""
                })
            },
            delMoreGuides(index) {
                this.tableGrid.addCheckItemDiaglog.moreGuides.datas.splice(index, 1);
            },
            top2second() {
                let tmp = this.tableGrid.addCheckItemDiaglog.moreGuides.datas[0];
                this.tableGrid.addCheckItemDiaglog.moreGuides.datas.splice(0, 1);
                this.tableGrid.addCheckItemDiaglog.moreGuides.datas.unshift({
                    "Id": this.tableGrid.addCheckItemDiaglog.guideId,
                    "AppId": this.AppId,
                    "Text": this.tableGrid.addCheckItemDiaglog.guideDesc,
                    "Picture": this.tableGrid.addCheckItemDiaglog.guideUrl,
                    "SubDate": "",
                    "InspectOptionId": ""
                });
                this.tableGrid.addCheckItemDiaglog.guideUrl = tmp.Picture;
                this.tableGrid.addCheckItemDiaglog.guideDesc = tmp.Text;
                this.tableGrid.addCheckItemDiaglog.guideId = tmp.Id;
            },
            upArrow(index) {
                if (index === 0) {
                    this.top2second();
                } else {
                    let tmp = this.tableGrid.addCheckItemDiaglog.moreGuides.datas[index - 1];
                    this.$set(this.tableGrid.addCheckItemDiaglog.moreGuides.datas, index - 1, this.tableGrid.addCheckItemDiaglog.moreGuides.datas[index]);
                    this.$set(this.tableGrid.addCheckItemDiaglog.moreGuides.datas, index, tmp);
                }

            },
            downArrow(index) {
                let tem = this.tableGrid.addCheckItemDiaglog.moreGuides.datas[index + 1];
                this.$set(this.tableGrid.addCheckItemDiaglog.moreGuides.datas, index + 1, this.tableGrid.addCheckItemDiaglog.moreGuides.datas[index]);
                this.$set(this.tableGrid.addCheckItemDiaglog.moreGuides.datas, index, tem);
            },
            topTabsClick(e) {
                this.getBasicOptionList();
            },
            taskTabsClick(tab, event) {
                if (tab.name == this.taskTabs.currentCode) {
                } else {
                    this.taskTabs.currentCode = tab.name;
                    this.getCheckItemSort();
                }


            },
            classfifyClick(index) {
                this.classify.currentIndex = index;
                this.initGrid();
            },
            classifyItemEdit(name, sort, id) {
                this.addSortDialog.show = true;
                this.addSortDialog.name = name;
                this.addSortDialog.sort = sort;
                this.addSortDialog.id = id;
            },
            delClassifyItem(id) {
                let data = {
                    "Id": id
                }
                let mes = '删除分类会同时删掉分类下的检查项，确定删除吗?';
                this.$confirm(mes, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.DelBasicOption(data).then(res => {
                        if (res && res.IsSuccess) {
                            this.message('删除成功', 1);
                            this.getCheckItemSort();
                        } else {
                            this.message(res.Message == null || res.Message == '' ? '删除失败' : res.Message, -1);
                        }
                    }).catch(r => {
                        this.message(r.Message == null || r.Message == '' ? '删除失败' : r.Message, -1);
                    })

                }).catch(() => {

                });

            }
            ,
            onPageNation() {//翻页
                this.initGrid();
            },
            queryGrid() {
                this.pageNation.pageNum = 1;
                this.initGrid();
            },
            addSort() {
                this.addSortDialog.name = '';
                this.addSortDialog.sort = '';
                this.addSortDialog.id = '';
                this.addSortDialog.show = true;
            },
            saveAddSort() {
                if (this.addSortDialog.name.length == 0) {
                    this.message('请填写分类名称', 2);
                    return;
                }
                if (this.addSortDialog.sort.length == 0) {
                    this.message('请指定排序', 2);
                    return;
                }
                if (this.addSortDialog.sort < 0) {
                    this.message('请填写正确排序', 2);
                    return;
                }
                let data = {
                    "Id": this.addSortDialog.id,
                    "Text": this.addSortDialog.name,
                    "IsDefault": true,
                    "IsDeadline": true,
                    "IsReform": true,
                    "StoreTypeId": this.topTabs.code,
                    "TaskTypeId": "",
                    "ProcessType": this.taskTabs.code,
                    "Score": this.addSortDialog.sort,
                    "Type": 6,
                    "PreviousId": "",
                };
                this.$api.SaveBasicOption(data).then(res => {
                    if (res && res.IsSuccess) {
                        this.message('保存成功', 1);
                        this.addSortDialog.show = false;
                        this.getCheckItemSort();
                    } else {
                        this.message(res.Message == null || res.Message == '' ? '保存失败' : res.Message, -1);
                    }

                }).catch(res => {
                    this.message(res.Message == null || res.Message == '' ? '保存失败' : res.Message, -1);
                })
            },
            importTemplateDownload() {
                if (this.$utils.isHttpsProtal()) {
                    window.location.href = "https://ripx.iuoooo.com/ui/%E6%A3%80%E6%9F%A5%E9%A1%B9%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx";
                } else {
                    window.location.href = "http://ripx.iuoooo.com/ui/%E6%A3%80%E6%9F%A5%E9%A1%B9%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx";
                }
            },
            importStoreData(obj) {
                let fd = new FormData();
                fd.append('file', obj.file);
                // fd.append('StoreTypeId', this.topTabs.code);
                // fd.append('AppId', this.$utils.getUrlKey('appId'));
                // fd.append('ProcessType', this.taskTabs.code);
                let data = fd;
                this.importProgress = 0;
                this.showImportProgress = !this.showImportProgress;
                let interval = setInterval(() => {
                    if (this.importProgress <= 80) {
                        this.importProgress += 10
                    }
                }, 1000);
                this.$api.UploadInspect(data, this.$utils.getUrlKey('appId'), this.topTabs.code, this.taskTabs.code).then(res => {
                    clearInterval(interval);
                    if (res && res.IsSucess) {
                        this.importProgress = 100;
                        setTimeout(() => {
                            this.showImportProgress = !this.showImportProgress;
                            this.importResult.showImportResult = !this.importResult.showImportResult;
                            this.importResult.ImportResultList = res.ErrorList;
                            // this.importResult.noImportNum = Math.abs(res.NoImportCount);
                            // this.importResult.updataFailNum = Math.abs(res.updataFailNum);
                            this.importResult.updataSucNum = Math.abs(res.UpdateCount);
                            // this.importResult.addFailNum = Math.abs(res.addFailNum);
                            this.importResult.addSucNum = Math.abs(res.SucessCount);
                            // this.importResult.successTotal = this.importResult.updataSucNum + this.importResult.addSucNum;
                            this.importResult.successTotal = res.SucessCount;
                            // this.importResult.failTotal = this.importResult.noImportNum + this.importResult.updataFailNum + this.importResult.addFailNum;
                            this.importResult.failTotal = res.ErrorCount;
                            this.importResult.allNum = res.AllCount;
                            if (this.importResult.ImportResultList.length > 0) {
                                this.importResult.showResultTableUrl = true;
                                // this.importResult.resultTableUrl = res.Url;
                            }
                        }, 500)
                    } else {
                        this.message('导入失败', -1);
                        this.importProgress = 0;

                    }


                }).catch(error => {
                    this.importProgress = 0;
                    this.showImportProgress = !this.showImportProgress;
                    clearInterval(interval);
                })
            },
            //上传图片
            uoloadImg(currentPosTag, index) {
                this.currentUploadImg = currentPosTag;
                this.refresh();
                this.uploadDialog.show = true;
                this.tableGrid.guidPicUploadIndex = index;
            },

            hideBigImg() {
                this.showPreview = false;
            },

            finish(url) {
                if (url != null && url.length > 0) {
                    this.uploadDialog.show = false;
                    switch (this.currentUploadImg) {
                        case this.tableGrid.currentUploadImgEnum.picDesc:
                            this.tableGrid.addCheckItemDiaglog.picDescUrl = url;
                            break;
                        case this.tableGrid.currentUploadImgEnum.picGuide:
                            this.tableGrid.addCheckItemDiaglog.guideUrl = url;
                            break;
                        case this.tableGrid.currentUploadImgEnum.morePicGuide:
                            this.tableGrid.addCheckItemDiaglog.moreGuides.datas[this.tableGrid.guidPicUploadIndex].Picture = url;
                            break;
                        default:
                            break;
                    }
                }
            },
            getUrlParam(url, paraName) {
                var arrObj = url.split("?");

                if (arrObj.length > 1) {
                    var arrPara = arrObj[1].split("&");
                    var arr;

                    for (var i = 0; i < arrPara.length; i++) {
                        arr = arrPara[i].split("=");

                        if (arr != null && arr[0] == paraName) {
                            return arr[1];
                        }
                    }
                    return "";
                }
                else {
                    return "";
                }
            },
            refresh: function () {
                this.id = +new Date();
            },

            getBasicOptionList() {//获取二级
                this.taskTabs.code = "0";
                this.taskTabs.currentCode = "0";
                this.taskTabs.datas = [];
                this.taskTabs.datas.push({
                    Id: "0",
                    Text: "巡查执法"
                });
                this.taskTabs.datas.push({
                    Id: "1",
                    Text: "自改自查"
                });
                this.getCheckItemSort();
            },
            getCheckItemSort() {//获取检查项分类
                let data = {
                    "StoreTypeId": this.topTabs.code,
                    "TaskTypeId": "",
                    "ProcessType": this.taskTabs.code,
                    "Type": 6,
                    "PreviousId": "",
                };
                this.classify.currentIndex = 0;
                this.$api.GetBasicOptionList(data).then(res => {
                    if (res && res.IsSuccess && res.Content.length > 0) {
                        this.classify.datas = res.Content;
                        this.initGrid();
                        this.getItemImportance();
                    } else {
                        this.classify.datas = [];
                        this.tableGrid.datas = [];
                        this.pageNation.total = 0;
                    }
                }).catch(r => {

                });

            },
            getItemImportance() {//获取检查项重要程度
                let data = {
                    "StoreTypeId": this.topTabs.code,
                    "TaskTypeId": "",
                    "ProcessType": this.taskTabs.code,
                    "Type": 7,
                    "PreviousId": "",
                };

                this.$api.GetBasicOptionList(data).then(res => {
                    if (res && res.IsSuccess) {
                        if (res.Content != null && res.Content.length > 0) {
                            this.tableGrid.addCheckItemDiaglog.checkItemImportanceList = res.Content;
                        } else {
                            this.tableGrid.addCheckItemDiaglog.checkItemImportanceList = [];
                        }
                    }
                }).catch(r => {

                });
            },
            getOperateInfo() {//获取一级业态
                this.$api.GetOperateInfo(1).then(res => {
                    if (res) {
                        this.topTabs.datas = res;
                        if (res.length > 0) {
                            this.topTabs.code = res[0].Id;
                        }
                        this.getBasicOptionList();
                    }
                }).catch(r => {
                });
            },
            gtInspectOptionList() {
                let data = {
                    "StoreTypeId": "string",
                    "ProcessType": 0,
                    "ClassificationId": "string",
                    "EnforceTypeId": "string",
                    "SearchWord": "string"
                };
                this.$api.GetInspectOptionList(data).then(res => {
                    if (res & res.IsSuccess) {
                        this.tableGrid.datas = res.Content;
                    }
                }).catch(r => {

                });
            },
            initGrid() {
                this.tableGrid.Loading = true;
                let data = {
                    "StoreTypeId": this.topTabs.code,
                    "ProcessType": this.taskTabs.code,
                    "ClassificationId": this.classify.datas[this.classify.currentIndex].Id,
                    "TaskTypeId": "",
                    "SearchWord": this.tableGrid.searchStr,
                    "pageNo": this.pageNation.pageNum,
                    "pageSize": this.pageNation.countPerPage
                };
                this.$api.GetInspectOptionListAsync(data).then(res => {
                    if (res && res.Content) {
                        this.$refs.checkitemtable.bodyWrapper.scrollTop = 0;
                        if (this.tableGrid.searchStr.length > 0) {
                            this.tableGrid.searchStatus = true;
                        } else {
                            this.tableGrid.searchStatus = false;
                        }
                        this.tableGrid.datas = res.Content;
						let arr = [1,2,3,4,5];
						let arr2 = ['五定拍照','五定拍照+五定视频','五定短视频(6秒)','五定中长视频(3分钟)','五定长视频(1小时)']
						this.tableGrid.datas.forEach(i=>{
							i.FiveSetType = arr2[arr.indexOf(i.FiveSetType)]
						})
                        this.pageNation.total = res.Data;
                    } else {
                        this.tableGrid.datas = [];
                        this.pageNation.total = 0;
                    }
                    this.tableGrid.Loading = false;
                }).catch(r => {
                    this.tableGrid.Loading = false;
                });

            },
            getInspectOptionDetail() {
                this.$api.GetInspectOptionDetail(a, b, c).then(res => {
                }).catch(r => {

                });

            },
            getInspectOptionDetail() {
                let data = {};
                this.$api.SaveInspectOption_(data).then(res => {
                }).catch(r => {

                });

            },
            setInspectOptionAttr() {
                let data = {};
                this.$api.SetInspectOptionAttr(data).then(res => {
                }).catch(r => {

                });

            },
            stepChange(val) {
				console.log(val)
                if (val != '3') {
                    this.tableGrid.addCheckItemDiaglog.moreGuides.datas = [];
                }
				if(val != '1'){
					this.tableGrid.addCheckItemDiaglog.FiveType = '1'
				}
            }
        }
        ,
        beforeCreated() {
        }
        ,
        created() {
            this.AppId = this.$utils.getUrlKey('appId');
            this.getOperateInfo();
        }
        ,
        mounted() {
        },

    }
    ;
</script>
<style type="text/scss" lang="scss" scoped>
    .checkItemLibrary {
        height: 100%;
        padding: 0;
        .classifyItemWrap {
            height: 100%;
            padding-bottom: 100px;
            overflow-y: auto;
            background: rgb(236, 245, 255);
            .classifyItem {
                font-size: 14px;
                color: #909399;
                height: 40px;
                text-align: left;
                padding-left: 10px;
                padding-right: 10px;
                span {
                    display: inline-block;
                    line-height: 40px;
                    max-width: 70%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                i {
                    display: inline-block;
                    line-height: 40px;
                    float: right;
                    visibility: hidden;
                }
            }
            .classifyItem:hover {
                height: 40px;
                background-color: rgb(121, 187, 255);
                color: #fff;
                text-align: left;
                padding-left: 10px;
                opacity: 0.7;
                span {
                    display: inline-block;
                    line-height: 40px;
                    max-width: 70%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                i {
                    display: inline-block;
                    line-height: 40px;
                    float: right;
                    visibility: visible;

                }
                i:hover {
                    color: #303133;
                }
            }
        }
        .classifyItemCurrent {
            opacity: 1;
            color: white !important;
            background-color: rgb(121, 187, 255);
        }
        .searchInput {
            width: 180px
        }
        .left {
            height: calc(100vh - 124px);
            position: relative;
            overflow: hidden;
        }
        .right {
            width: 100%;
            height: calc(100vh - 124px);
            @include box(box);
            @include box-orient(vertical);
        }

        .pre-lable {
            text-align: right;
            vertical-align: middle;
            float: left;
            font-size: 14px;
            color: #606266;
            line-height: 40px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            width: 82px;
        }
        .tableheaderbac {
            background: #f2f2f2;
            padding: 10px 10px;
        }

        .tableOper {
            /*float: right;*/
        }

        .middleVertical {
            height: 40px;
            line-height: 40px;
            display: inline-block;
        }

        .check-lable {
            text-align: right;
            vertical-align: middle;
            font-size: 14px;
            color: #606266;
            line-height: 34px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            width: 82px;
            display: inline-block;
        }
        .addCheckItemDialogInput {
            width: 200px;
            margin-left: 10px;
        }
        .addCheckItemDialogLabel {
            text-align: right;
            vertical-align: middle;
            font-size: 14px;
            color: #606266;
            line-height: 34px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            width: 110px;
            display: inline-block;
        }
        .el-main {
            padding: 0 20px
        }
        .mbottm20 {
            margin-bottom: 20px;
        }

        .showImg {
            border-radius: 4px;
            height: 100px;
            float: left;
            background: rgba(0, 0, 0, .1);
            min-width: 100px;
            max-width: 200px;
        }
        .addPic {
            width: 25px;
            height: 25px;
            background: url("../../assets/images/add_icon.png");
            background-repeat: no-repeat;
            background-size: contain;
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
        }
        .delPic {
            width: 25px;
            height: 25px;
            background: url("../../assets/images/delete_icon.png");
            background-repeat: no-repeat;
            background-size: contain;
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
        }
        .uparrow {
            width: 25px;
            height: 25px;
            background: url("../../assets/images/uparrow.png");
            background-repeat: no-repeat;
            background-size: contain;
            display: inline-block;
            margin-left: 10px;
            margin-top: 4px;
            vertical-align: middle;
        }
        .downarrow {
            width: 25px;
            height: 25px;
            background: url("../../assets/images/downarrow.png");
            background-repeat: no-repeat;
            background-size: contain;
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
        }
        .importResultClass {
            border-collapse: separate;
            box-sizing: border-box;
            color: rgb(144, 147, 153);
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
            font-size: 16px;
            font-weight: 700;
            height: 23px;
            line-height: 23px;
            overflow-wrap: normal;
            overflow-x: hidden;
            overflow-y: hidden;
            padding-left: 10px;
            padding-right: 10px;
            position: relative;
            text-align: left;
            text-overflow: ellipsis;
            text-rendering: optimizelegibility;
            text-size-adjust: 100%;
            user-select: none;
            vertical-align: middle;
            white-space: normal;
            word-break: break-all;
            -webkit-border-horizontal-spacing: 0px;
            -webkit-border-vertical-spacing: 0px;
            -webkit-font-smoothing: antialiased;
        }

        .importResultClassChild {
            font-size: 13px;
        }

        .resutNum {
            color: #409EFF;
            font-size: 18px;
        }

        .resutNumChild {
            color: #409EFF;
            font-size: 16px;
        }

        .resultTableUrl {
            float: right;
            margin-right: 10px;
            color: #409EFF
        }
    }
</style>
<style lang="scss" type="text/scss">
    .checkItemLibrary {
        .el-aside {
            text-align: center;
        }
        .el-table thead {
            color: #666666;
        }
        .noborder {
            border: none !important;
        }
    }

</style>
