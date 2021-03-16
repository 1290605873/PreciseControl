<template>
    <div class="main-container businessAuthSetting">
        <div>
            <label class="searhCluseLabel">业态</label>
            <el-select class="select-item" placeholder="请选择" clearable :filterable="topTabs.datas.length > 7"
                       v-model="topTabs.code">
                <el-option v-for="opItem  in topTabs.datas"
                           :key="opItem.Id"
                           :label="opItem.Name"
                           :value="opItem.Id"></el-option>
            </el-select>
            <label class="searhCluseLabel">业务类型</label>
            <el-select class="select-item" placeholder="请选择" clearable>
                <el-option></el-option>
            </el-select>
            <label class="searhCluseLabel">任务类别</label>
            <el-select class="select-item" placeholder="请选择" clearable>
                <el-option></el-option>
            </el-select>
            <el-button type="primary" style="margin-left: 20px">查询</el-button>
        </div>
        <el-table
                :data="tableGrid.datas"
                border
                :height="150"
                fit
                highlight-current-row
                style="width: 100%;margin-top: 10px">
            <el-table-column type="index" width="40" align="center"></el-table-column>
            <el-table-column :label="tableGrid.column.joinYetai" show-overflow-tooltip align="center">
                <template slot-scope="scope">

                </template>
            </el-table-column>
            <el-table-column :label="tableGrid.column.joinSort" show-overflow-tooltip align="center">
                <template slot-scope="scope">

                </template>
            </el-table-column>
            <el-table-column :label="tableGrid.column.businessType" show-overflow-tooltip align="center">
                <template slot-scope="scope">

                </template>
            </el-table-column>
            <el-table-column :label="tableGrid.column.joinDeparts" show-overflow-tooltip align="center">
                <template slot-scope="scope">

                </template>
            </el-table-column>
            <el-table-column :label="tableGrid.column.jionUsers" show-overflow-tooltip align="center">
                <template slot-scope="scope">

                </template>
            </el-table-column>
        </el-table>
        <pagination ref="pagination" v-show="pageNation.total"
                    :total="pageNation.total"
                    :page.sync="pageNation.pageNum"
                    :limit.sync="pageNation.countPerPage"
                    @pagination="onPageNation"></pagination>
    </div>
</template>
<script>
    import Pagination from '../../components/Pagination';

    export default {
        data() {
            return {
                topTabs: {//顶部业态
                    //业态
                    datas: [],
                    code: "" //当前业态值
                },
                taskTabs: {//业态下的任务
                    code: "", //当前值
                    datas: []
                },
                tableGrid: {
                    column: {
                        joinYetai: '关联业态1',
                        joinSort: '业务类别',
                        businessType: '任务类型',
                        joinDeparts: '关联部门',
                        jionUsers: '关联人员'
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
                pageNation: {//分页
                    total: 100,
                    pageNum: 1,//页数
                    countPerPage: 20//每页数
                }
            }
        },
        props: '',
        computed: {},
        methods: {
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
            init(){
                
                let data  ={
                    "FormattypeId": "",//业态类型Id
                    "FormatCategorysId": '',//业务类别Id
                    "TaskTypeId": ""//任务类型Id
                };
                this.$api.GetTaskTypePrivilegescopeAsync(data).then(res=>{

                }).catch(r=>{

                })
            }
        },
        beforeCreated() {

        },
        created() {
            this.getOperateInfo();
            this.init();
        },
        mounted() {

        },
        components: {
            Pagination
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    .businessAuthSetting{
        padding-top: 20px;
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        .searchInput {
            width: 180px
        }
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
    }
</style>

<style>

</style>