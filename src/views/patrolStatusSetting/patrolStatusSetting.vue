<template>
    <div class="patrolStatusSetting main-container">
        <el-tabs class="pageH"
                 type="border-card"
                 ref="topTabs"
                 id="topTabs"
                 @tab-click="topTabsClick"
                 v-model="topTabs.code">
            <el-tab-pane
                    v-for="tabitem in topTabs.datas"
                    :key="tabitem.Id"
                    :label="tabitem.Name"
                    :name="tabitem.Id"
            ></el-tab-pane>
            <div>
                <div>
                    <el-tabs v-model="taskTabs.code" @tab-click="taskTabsClick">
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
                            </div>
                        </div>
                    </el-aside>
                    <el-main class="right">
                        <el-table
                                highlight-current-row
                                v-loading="tableGrid.Loading"
                                :data="tableGrid.datas"
                                border
                                :height="150"
                                fit
                                ref="patrolstatustable"
                                style="width: 100%;">
                            <el-table-column type="index" width="40"></el-table-column>
                            <el-table-column :label="tableGrid.column.result" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-text="scope.row.ProcessResultText"></span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="tableGrid.column.status" show-overflow-tooltip>
                                <template slot-scope="scope">
                                        <span style="display: inline-block;border-radius: 50%;height: 40px;width: 40px" :style="{background:scope.row.Color}"></span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="tableGrid.column.operate" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="setColor(scope.row.ProcessResultId,scope.row.Color)">设置</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
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
                <el-input class="searchInput" placeholder="输入检查项名称查询" value=""></el-input>
                <div style="margin-left: 88px;margin-top: 50px">
                    <el-button>取消</el-button>
                    <el-button type="primary">确定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog
                width="350px"
                top='30vh'
                title="设置颜色"
                :close-on-click-modal="false"
                :visible.sync="colorDialog.show">
            <swatches-picker
                    v-model="colorDialog.color"
                    :value="colorDialog.color"/>
            <span slot="footer" class="dialog-footer">
                  <el-button @click="colorDialog.show = false">取消</el-button>
                    <el-button @click="saveColor(-1)">清空</el-button>
                  <el-button type="primary" @click="saveColor">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '../../components/Pagination';
    import {Swatches} from 'vue-color'

    export default {
        components: {
            Pagination,
            'swatches-picker': Swatches,
        },
        data() {
            return {
                topTabs: {//顶部业态
                    //业态
                    datas: [],
                    code: "" //当前业态值
                },
                taskTabs: {//二级任务
                    code: "", //当前值
                    datas: []
                },
                tableGrid: {
                    Loading: false,
                    column: {
                        result: '处理结果',
                        status: '状态',
                        operate: '操作'
                    },
                    datas: [],
                    importData: {//导入数据
                        show: false,
                        showFileList: false
                    },
                    addCheckItemDiaglog: {
                        show: false
                    },
                    currentUploadImg: '',
                    currentUploadImgEnum: {
                        picDesc: 'picDesc',//图片说明位置
                        picGuide: 'picGuide',//引导图位置
                    },
                    picDescUrl: '',//图片说明url地址
                    guideUrl: '',//引导图
                    guideDesc: '',//引导语
                    defaultUploadImg: require('@/assets/images/tianjia_upload.png'),
                    moreGuides: {//添加的更多引导图
                        datas: []
                    }
                },
                classify: {//分类
                    datas: [],
                    currentIndex: 0
                },
                addSortDialog: {
                    show: false
                },
                colorDialog: {
                    show: false,
                    color: {},
                    id: '',
                }
            }
        },
        props: "",
        computed: {},
        methods: {
            setColor(id, color) {
                this.colorDialog.show = true;
                this.colorDialog.id = id;
                // setTimeout(()=>{
                //     if(color){
                //         this.colorDialog.color1.hex=color;
                //     }else{
                //         this.colorDialog.color1.hex='#B71C1C';
                //     }
                // },1000)
            },
            classfifyClick(inx) {
                this.classify.currentIndex = inx;
                this.initGrid();
            },
            top2second() {
                let tmp = this.tableGrid.moreGuides.datas[0];
                this.tableGrid.moreGuides.datas.splice(0, 1);
                this.tableGrid.moreGuides.datas.unshift({
                    id: Date.now(),
                    url: this.tableGrid.guideUrl,
                    desc: this.tableGrid.guideDesc
                });
                this.tableGrid.guideUrl = tmp.url;
                this.tableGrid.guideDesc = tmp.desc;
            },
            upArrow(index) {
                if (index === 0) {
                    this.top2second();
                } else {
                    let tmp = this.tableGrid.moreGuides.datas[index - 1];
                    this.$set(this.tableGrid.moreGuides.datas, index - 1, this.tableGrid.moreGuides.datas[index]);
                    this.$set(this.tableGrid.moreGuides.datas, index, tmp);
                }

            },
            downArrow(index) {
                let tem = this.tableGrid.moreGuides.datas[index + 1];
                this.$set(this.tableGrid.moreGuides.datas, index + 1, this.tableGrid.moreGuides.datas[index]);
                this.$set(this.tableGrid.moreGuides.datas, index, tem);
            },
            topTabsClick(e) {
                this.getBasicOptionList();
            },
            taskTabsClick(e) {
                this.getBasicOptionList5();
            },
            nodeClick(data, node, obj) {

            },
            onPageNation() {//翻页
            },
            queryGrid() {
            },
            addSort() {
                this.addSortDialog.show = true;
            },
            importTemplateDownload() {
                window.location.href = "http://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetFile?fileURL=29e54e46-3e17-4ca4-8f03-db71fb8f9556/2018111421/dff8b04c-8380-4c78-8b63-dd9df9e0a84f_政府数据导入模板.xlsx";
            },
            importStoreData(obj) {
                let fd = new FormData();
                fd.append('uploadFile', obj.file);
                fd.append('userId', this.$utils.getUrlKey('userId'));
                fd.append('appId', this.$utils.getUrlKey('appId'));
                let data = fd;
                this.gridParam.importProgress = 0;
                this.gridParam.showImportProgress = !this.gridParam.showImportProgress;
                let interval = setInterval(() => {
                    if (this.gridParam.importProgress <= 80) {
                        this.gridParam.importProgress += 10
                    }
                }, 1000);
                this.$api.ImportStoreExcel(data).then(res => {
                    this.gridParam.importProgress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        this.gridParam.showImportResult = !this.gridParam.showImportResult;
                        this.gridParam.showImportProgress = !this.gridParam.showImportProgress;
                        this.gridParam.ImportResultList = res.exList;
                        this.gridParam.noImportNum = Math.abs(res.noImportNum);
                        this.gridParam.updataFailNum = Math.abs(res.updataFailNum);
                        this.gridParam.updataSucNum = Math.abs(res.updataSucNum);
                        this.gridParam.addFailNum = Math.abs(res.addFailNum);
                        this.gridParam.addSucNum = Math.abs(res.addSucNum);
                        this.gridParam.successTotal = this.gridParam.updataSucNum + this.gridParam.addSucNum;
                        this.gridParam.failTotal = this.gridParam.noImportNum + this.gridParam.updataFailNum + this.gridParam.addFailNum;
                        this.gridParam.allNum = this.gridParam.successTotal + this.gridParam.failTotal;
                        if (this.gridParam.ImportResultList.length > 0) {
                            this.gridParam.showResultTableUrl = true;
                            this.gridParam.resultTableUrl = res.Url;
                        }
                    }, 500)

                }).catch(error => {

                })
            },
            addCheckItem() {
                this.tableGrid.addCheckItemDiaglog.show = true;
            },
            //上传图片
            uoloadImg(currentPos) {
                this.currentUploadImg = currentPos;
                this.refresh();
                this.isUploadImg = true;
            },
            showBigImg: function (url) {
                if (url.startsWith('http')) {
                    this.bigImgUrl = url;
                    this.showPreview = true;
                } else {
                    this.bigImgUrl = '';
                    this.showPreview = false;
                }
            },
            hideBigImg() {
                this.showPreview = false;
            },
            saveColor(oper) {
                if (oper == -1) {
                    this.colorDialog.color.hex = ''
                }
                this.colorDialog.show = false;
                let data = {
                    "StoreTypeId": this.topTabs.code,
                    "TaskTypeId": this.taskTabs.code,
                    "EnforceResultId": this.classify.datas[this.classify.currentIndex].Id,
                    "ProcessResultId": this.colorDialog.id,
                    "Color": this.colorDialog.color.hex,
                };
                this.$api.SetColorEnforceStatus(data).then(res => {
                    if (res && res.IsSuccess) {
                        this.initGrid();
                    }
                }).catch(r => {

                })
            },
            finish(url) {
                if (url != "" && url != null) {
                    this.isUploadImg = false;
                    switch (this.currentUploadImg) {
                        case this.currentUploadImgEnum.foodPermitImg:
                            this.foodPermitImg = url;
                            break;
                        case this.currentUploadImgEnum.businessImg:
                            this.businessImg = url;
                            break;
                        case this.currentUploadImgEnum.levelImg:
                            this.levelImg = url;
                            break;
                        case this.currentUploadImgEnum.personnelHealthImg:
                            this.personnelHealthImgs.push(url);
                            break;
                        case this.currentUploadImgEnum.mainSupplierImg:
                            this.mainSupplierImgs.push(url);
                            break;
                        default:
                            break;
                    }
                }
            },
            addMoreGuides() {
                this.tableGrid.moreGuides.datas.push({
                    id: Date.now(),
                    url: this.tableGrid.defaultUploadImg,
                    desc: ''
                })
            },
            delMoreGuides(index) {
                this.tableGrid.moreGuides.datas.splice(index, 1);
            },
            saveAddItemCheck() {

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
            //获取二级任务
            getBasicOptionList() {
                let data = {
                    "StoreTypeId": this.topTabs.code,
                    "ProcessType": 0,
                    "Type": 1,
                };
                this.$api.GetBasicOptionList(data).then(
                    res => {
                        if (res && res.Content) {
                            this.taskTabs.datas = res.Content;
                            if (this.taskTabs.datas.length > 0) {
                                this.taskTabs.code = res.Content[0].Id;
                            }
                            this.getBasicOptionList5();
                        } else {

                        }
                    }
                )
            },
            getBasicOptionList5() {//获取执法状态

                let data = {
                    "StoreTypeId": this.topTabs.code,
                    "TaskTypeId": this.taskTabs.code,
                    "ProcessType": 0,
                    "Type": 5,
                    "PreviousId": "",
                };
                this.$api.GetBasicOptionList(data).then(res => {
                    if (res && res.Content && res.Content.length > 0) {
                        this.classify.datas = res.Content;
                        this.initGrid();
                    } else {
                        this.classify.datas = [];
                        this.tableGrid.datas = [];
                    }

                }).catch(r => {

                })

            },
            initGrid() {
                this.tableGrid.Loading = true;
                let data = {
                    "StoreTypeId": this.topTabs.code,//业态ID
                    "TaskTypeId": this.taskTabs.code,//任务Id
                    "EnforceResultId": this.classify.datas[this.classify.currentIndex].Id,//执法结果Id (如:限期整改/停业整顿/已通过)
                };
                this.$api.GetEnforceStatus(data).then(res => {
                    if (res && res.IsSuccess) {
                        this.tableGrid.datas = res.Content;
                    }
                    this.tableGrid.Loading = false;
                }).catch(r => {
                    this.tableGrid.Loading = false;
                });
            }
        },
        beforeCreated() {
        },
        created() {
            this.getOperateInfo();
            this.tableGrid.picDescUrl = this.tableGrid.defaultUploadImg;
            this.tableGrid.guideUrl = this.tableGrid.defaultUploadImg;
        },
        mounted() {
        }
    };
</script>

<style type="text/scss" lang="scss" scoped>
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding-top: 10px;
        padding: 0;
        background: #ffffff;

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
    .patrolStatusSetting {
        /*height: calc(100vh - 36px);*/
        .searchInput {
            width: 180px
        }
        .left {
            height: calc(100vh - 85px);
            position: relative;
            overflow: hidden;
        }
        .right {
            width: 100%;
            height: calc(100vh - 85px);
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
            float: right;
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
            width: 180px;
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
                i:hover{
                    color: #303133;
                }
            }
        }
        .classifyItemCurrent {
            opacity: 1;
            color: white !important;
            background-color:rgb(121, 187, 255);
        }
    }
</style>
<style lang="scss" type="text/scss">
    .patrolStatusSetting {
        .el-aside {
            text-align: center;
        }
        .el-table thead {
            color: #666666;
        }
    }

</style>
