<template>
    <div class="main-container picGame">
        <div>
            <el-form :inline="true" class="demo-form-inline">
                <!--   -->
                <el-form-item label-width="80px">
                    <el-select 
                        class="com-width" 
                        size="small" 
                        :filterable="mainGridTable.roomlist.length > 7"
                        placeholder="请选择操作间" 
                        v-model="mainGridTable.param.OperateRoom"  
                        clearable>
                        <el-option
                                v-for="(item,index) in mainGridTable.roomlist"
                                :key="index"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="gueryList">搜 索</el-button>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button type="primary" @click="addNewConfig(1)">新增配置</el-button>      
                       
                </el-form-item>
            </el-form>
        </div>
        <div class="table-box">
        <el-table
                v-loading="mainGridTable.Loading"
                :data="mainGridTable.list"
                border
                fit
                height="96%"
                highlight-current-row
                class="table">
            <el-table-column 
                label="序号" 
                type="index" 
                width="80" 
                align="center">
            </el-table-column>
            <el-table-column 
                label="操作间" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.OperateRoom }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="创建日期" 
                max-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.SubTime!=null || scope.row.SubTime!=''?scope.row.SubTime.split(' ')[0]:'' }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="最近操作人" 
                max-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.ModifiedName }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="最近编辑时间" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.ModifiedOn }}</span>
                </template>
            </el-table-column>
            <el-table-column  
                label="操作" 
                min-width="150px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button type="primary" plain @click='editReferenceImage(scope.row)'>编辑</el-button>
                    <el-button type="primary" plain @click="delReferenceImage(scope.row.Id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <pagination 
                ref="pagination" 
                v-show="mainGridTable.total>0"
                :total="mainGridTable.total"
                :page.sync="mainGridTable.param.PageNo"
                :limit.sync="mainGridTable.param.PageSize"
                @pagination="gueryList"></pagination>
        <!--新增配置-->
        <el-dialog
                :close-on-click-modal='false'
                :title="addConfig.title"
                :visible.sync="addConfig.show"
                class='addConfig'
                fullscreen
                top="5vh"
                v-if="addConfig.show"
                >
            <div style="width:100%">
                <pic-config 
                :violation = 'violation.list' 
                :roomList = 'mainGridTable.roomlist' 
                :Id = 'currentEditId'
                @refreshPage='refreshPage($event)'
                :title="addConfig.title"></pic-config>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination';
    import picConfig from './picConfig';

    export default {
        components: {
            Pagination,
            picConfig
        },
        data() {
            return {
                mainGridTable: { //主列表
                    Loading: true,
                    list: null,
                    total: 0,
                    param: {
                        OperateRoom:'',
                        PageNo: 1,
                        PageSize: 20
                    },
                    roomlist:[]
                },
                addConfig:{
                    show:false,
                    title:''
                },
                violation:{
                    page:1,
                    size:50,
                    list:[],

                },
                currentEditId:'',
                
            }
        },
        created() {
            this.getOperateRoomList()
            this.gueryList();
            this.getViolationsList();
        },
        methods: {
            /**
             * 获取操作间列表
             */
            getOperateRoomList() {
                this.$api.GetOperateRoomList({}).then(res =>{
                    if(res.IsSuccess){
                        this.mainGridTable.roomlist = res.Content;
                    }else{
                        this.mainGridTable.roomlist = [];
                    }
                    
                }).catch(error=>{

                })
            },
            /**
             * 查询数据
             */
            gueryList() {
                this.$api.GetReferenceImageList(this.mainGridTable.param).then(res => {
                    if (res.IsSuccess) {
                        this.mainGridTable.Loading = false;
                        if(res.Content == null){
                            this.$message({
                                message: '无查询数据',
                                type: 'info',
                                center:true,
                                duration: 1200,
                            });
                            this.mainGridTable.list = [];
                            return;
                        }
                        this.mainGridTable.list = res.Content;
                        this.mainGridTable.total = res.Data;

                    } else {
                        this.$message({
                            message: res.Message,
                            type: 'info',
                            duration: 1200,
                        });
                        this.mainGridTable.Loading = false;
                    }
                }).catch(r=>{
                    this.mainGridTable.Loading = false;
                });
            },
            /**
             * 新增配置
             */
            addNewConfig(type) {
                this.addConfig.show = true;
                if(type == 1){
                    this.addConfig.title = '新增配置';
                }else{
                    this.addConfig.title = '编辑配置';
                }
                
            },
            /**
             * 删除参照图
             */
            delReferenceImage(Id){
                   this.$confirm('确认要删除该参照图吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let data = {
                            "Id": Id
                        }
                        this.$api.DeleteReferenceImage(data).then(res=>{
                            if(res && res.IsSuccess){
                                let _this = this;
                                this.$message({
                                    message: '删除成功',
                                    type: 'success',
                                    duration: 1200,
                                    center: true,
                                    onClose(){
                                        _this.gueryList();
                                    }
                                });
                                this.gueryList();
                            }else{
                                this.$message({
                                    message: res.Message,
                                    type: 'error',
                                    duration: 1200,
                                    center: true
                                });
                            }
                        }).catch(error=>{

                        })
                        
                    }) 
                //}
            },
            /**
             * 编辑参照图
             */
            editReferenceImage(row){
                this.addConfig.show = true;
                this.addConfig.title = '编辑配置';
                this.currentEditId = row.Id;
            },
            /**
             * 获取违规项
             */
            getViolationsList() {
                let data = {
                        Name: "",
                        Type: 3,
                        PageNo: this.violation.page,
                        PageSize: this.violation.size
                    }
                this.$api.GetViolationsList(data).then(res => {
                    if (res.IsSuccess) {
                        //this.message(res.Message == null || res.Message == ''?'获取违规项成功':res.Message,1)
                        if(res.Content && res.Content.length){
                            for(let item of res.Content){
                                item.checked = false;
                            }
                        }
                        this.violation.list = res.Content;

                    } else {
                        this.message(res.Message == null || res.Message == ''?'获取违规项失败':res.Message,-1)
                        this.violation.list = [];
                    }
                }).catch(r=>{});
            },
            refreshPage(obj){
                this.addConfig.show = false;
                if(obj.type == 2){
                    this.gueryList();
                }
            }
            
        }
    }
</script>
<style scoped type="text/scss" lang='scss'>

    // .main-container {
    //     padding-top: 14px;
    //     width: 100%;
    //     height: 100%;
    //     @include box(box);
    //     @include box-orient(vertical);
    //     .el-middle {

    //         padding-bottom: 10px;
    //     }

    // }
    .main-container,.picGame{
        width: 100%;
        height: 100%;
        font-size: 16px;
        flex-direction: column;
        padding-left: 10px;
        display: flex;
    }
    .table-box {
        flex:1;
    }
    .el-table--border {
        overflow-y: auto;
    }
    .table-box {
        flex:1;
    }
    .picGame{
        width:100%;
        height:100%
    }
    .addConfig{
        width:85%;
        margin:0 auto;
    }
</style>

<style type="text/scss" lang="scss">
    .picGame .el-dialog {
        margin: 0 !important;
        overflow-y: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /*height:600px;*/
        max-height: calc(100% - 60px);
        max-width: calc(100% - 80px);
    }
    .picGame .addConfig .el-dialog .el-dialog__body {
        height:calc(100% - 50px);
        overflow: auto;
    }
    
    .picGame{
        .el-dialog__body{
            height: calc(100vh - 50px);
        }
        .el-table__header-wrapper {
            overflow: hidden;
        }
        .el-table--scrollable-y .el-table__body-wrapper {
            overflow-y: auto !important;
        }
    }
</style>
