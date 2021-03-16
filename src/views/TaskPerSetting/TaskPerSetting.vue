<template>
    <div class="main-container">
        <div>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select class="com-width" size="small" :filterable="OperateData.length > 7" placeholder="请选择业态类型" v-model="listParam.FormattypeId" clearable>
                        <el-option
                                v-for="item in OperateData"
                                :key="item.TaskType"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select class="com-width" size="small" placeholder="请选择业务类别" v-model="listParam.FormatCategorysId" @change="getBasicOptionList" clearable>
                        <!-- <el-option label="全部" :value="-1"></el-option> -->
                        <el-option label="巡查" :value="0"></el-option>
                        <el-option label="自查" :value="1"></el-option>
                        <!-- <el-option label="双随机" :value="2"></el-option>  -->
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select class="com-width" size="small" :filterable="BasicData.length > 7" placeholder="请选择任务类型" v-model="listParam.TaskTypeId" clearable>
                        <el-option
                                v-for="item in BasicData"
                                :key="item.Text"
                                :label="item.Text"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTaskTypePrivilegescopeAsync">查 询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
         v-loading="mainGridTable.Loading"
         :data="mainGridTable.list"
         border
         highlight-current-row
         :height="200"
         fit
         class="main-table">
            <el-table-column type="index" width="40" align="center"></el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[0]" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.Formattype }}</span>

                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[1]" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.FormatCategorys }}</span>

                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[2]" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TaskType }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[3]" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="linkType" @click="openOragnDialog(scope.row)">{{scope.row.arrOrgan?scope.row.arrOrgan:'选择部门'}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[4]" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="linkType" @click="openUserDialog(scope.row)">{{scope.row.arrUser?scope.row.arrUser:'选择人员'}}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination ref="pagination" v-show="total"
                :total="total"
                :page.sync="listParam.PageNo"
                :limit.sync="listParam.PageSize"
                @pagination="getTaskTypePrivilegescopeAsync"
                class="main-bottom"/></pagination>
        <!--选择组织-->

        <el-dialog
                title="选择组织"
                :visible.sync="oragnDialog"
                width="400px"
                append-to-body
                v-if="oragnDialog"
                :before-close="closeOragnDialog">
            <set-organ @checkOragnData="checkOragnData" :defaultCheckOragnId="defaultCheckOragnId"></set-organ>
            <span slot="footer" class="dialog-footer">
                <el-button @click="oragnDialog = false">取 消</el-button>
                <el-button type="primary" @click="oragnDialogFn">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="选择人员"
                :visible.sync="userDialog"
                width="720px"
                top="10vh"
                append-to-body
                v-if="userDialog"
                :before-close="closeUserDialog">
                <div class="maxDiaglog">
                  <set-user ref="setUser" :defaultCheckuserId="defaultCheckuserId" @checkUserData="checkUserData"></set-user>
                </div>
        </el-dialog>
    </div>
</template>
<script>
    import SetOrgan from '@/components/SetOrgan.vue';
    import SetUser from '@/components/SetUser.vue';
    import Pagination from '@/components/Pagination';

    export default {
        name: 'task-per-setting',
        components: {
            SetOrgan,
            SetUser,
            Pagination
        },
        data() {
            return {
                oragnDialog: false,//选择组织弹框
                userDialog: false,//选择人员弹框
                mainGridTable: {
                    Loading: true,
                    tableHerder: ['关联业态', '业务类别', '任务类型', '关联部门', '关联人员'],
                    list: null
                },
                defaultCheckOragnId: [],
                defaultCheckuserId: [],
                total: 0,
                listParam: {
                    "FormattypeId": "",
                    "FormatCategorysId": '',
                    "TaskTypeId": "",
                    "OrgId": this.$utils.getUrlKey("userId"),
                    "pageNo": 1,
                    "AppId": this.$utils.getUrlKey("appId"),
                    "pageSize": 20
                },
                OperateData: [],//业务类型
                BasicData: [],//任务类型
                rowData: [],
                checkOragn: [],
                checkUser: []
            }
        },
        created() {
            this.getOperateInfo();
            this.getTaskTypePrivilegescopeAsync();
        },
        methods: {
            /**
             * 业态类型
             */
            getOperateInfo() {
                this.$api.GetOperateInfo(1).then(res => {
                    this.OperateData = res;
                    this.getBasicOptionList();
                });
            },
            /**
             * 任务类型
             */
            getBasicOptionList() {
                let dataInfo = {
                    "StoreTypeId": this.listParam.FormattypeId,
                    "TaskTypeId": "",
                    "ProcessType": this.listParam.FormatCategorysId,
                    "Type": 1,
                    "PreviousId": ""
                };
                this.$api.GetBasicOptionList(dataInfo).then(res => {
                    if (res.IsSuccess) {
                        this.BasicData = res.Content;
                    }
                });
            },
            /**
             * 获取列表数据
             */
            getTaskTypePrivilegescopeAsync() {
                this.$api.GetTaskTypePrivilegescopeAsync(this.listParam).then(res => {
                    if (res.IsSuccess) {

                        res.Content.forEach((value, index) => {
                            if (value.tasktypepriviledgescopelist.length > 0) {
                                let arrOrgan = [];
                                let arrUser = [];
                                value.tasktypepriviledgescopelist.forEach((item) => {
                                    if (item.Type == 0) {
                                        arrOrgan.push(item.Name);
                                    } else {
                                        arrUser.push(item.Name);
                                    }
                                });
                                value.arrOrgan = arrOrgan.join('/');
                                value.arrUser = arrUser.join('/');
                            }
                        });

                        this.mainGridTable.list = res.Content;
                        this.total = res.Data;
                        window.console.log(res.Content)
                        this.mainGridTable.Loading = false;

                    } else {
                        let _this = this;
                        this.$message({
                            message: res.Message,
                            type: 'error',
                            duration: 1200,
                            center: true,
                            onClose() {
                                _this.mainGridTable.Loading = false;
                            }
                        });
                    }
                }).catch(res => {
                    this.mainGridTable.Loading = false;
                })
            },
            checkOragnData(obj) {
                this.checkOragn = obj;
            },
            /**
             * 选择组织
             */
            openOragnDialog(row) {
                this.oragnDialog = true;
                this.rowData = row;
                let arr = new Array();
                row.tasktypepriviledgescopelist.forEach(element => {
                    if (element.Type == 0) {
                        arr.push(element.UserOrDepartId);
                    }
                });
                this.defaultCheckOragnId = arr;
            },
            oragnDialogFn() {
                let checkId = this.checkOragn.checkOragnId.split(',');
                if (checkId != 0) {
                    let dataInfo = [];
                    checkId.forEach((value, index) => {
                        let obj = {
                            Id: '',
                            UserOrDepartId: value,
                            Name: this.checkOragn.checkOragnName.split(',')[index],
                            Type: 0,
                            TaskTypeId: this.rowData.Id,
                            SubId: value,
                            SubTime: '',
                            AppId: this.$utils.getUrlKey("appId")

                        };
                        dataInfo.push(obj);
                    });
                    let requestDTO = {requestDTO: dataInfo};
                    this.saveTaskTypePrivilegescopeAsync(requestDTO);
                }
            },
            /**
             * 保存人员或部门
             */
            saveTaskTypePrivilegescopeAsync(requestDTO) {
                this.$api.SaveTaskTypePrivilegescopeAsync(requestDTO).then(res => {
                    if (res.IsSuccess) {
                        let _this = this;
                        this.$message({
                            message: res.Message,
                            type: 'success',
                            duration: 1200,
                            center: true,
                            onClose() {
                                _this.oragnDialog = false;

                                _this.getTaskTypePrivilegescopeAsync();
                            }
                        });
                    }
                });
            },
            /**
             * 选择人员
             */
            openUserDialog(row) {
                this.userDialog = true;
                this.rowData = row;
                let arr = new Array();
                row.tasktypepriviledgescopelist.forEach(element => {
                    if (element.Type == 1) {
                        arr.push(element.UserOrDepartId);
                    }
                });
                this.defaultCheckuserId = arr;
            },
            checkUserData(obj) {
                if (obj) {
                    this.userDialog = false;
                    if (obj.length > 0) {
                        let dataInfo = [];
                        obj.forEach((value, index) => {
                            let obj = {
                                Id: '',
                                UserOrDepartId: value.UserId,
                                Name: value.Name,
                                Type: 1,
                                TaskTypeId: this.rowData.Id,
                                SubId: value.UserId,
                                SubTime: '',
                                AppId: this.$utils.getUrlKey("appId")

                            };
                            dataInfo.push(obj);
                        });
                        let requestDTO = {requestDTO: dataInfo};
                        this.saveTaskTypePrivilegescopeAsync(requestDTO);

                    } else {
                        let dataInfo = [];
                        let obj = {
                            Id: '',
                            UserOrDepartId: '',
                            Name: '',
                            Type: 1,
                            TaskTypeId: this.rowData.Id,
                            SubId: '',
                            SubTime: '',
                            AppId: this.$utils.getUrlKey("appId")

                        };
                        dataInfo.push(obj);
                        let requestDTO = {requestDTO: dataInfo};
                        this.saveTaskTypePrivilegescopeAsync(requestDTO);
                    }

                }
                this.userDialog = false;
                this.$refs.setUser.clearData();
            },
            closeOragnDialog() {
                this.oragnDialog = false;
            },
            closeUserDialog(obj) {
                this.userDialog = false;
                this.$refs.setUser.clearData();
            }
        }
    }
</script>
<style scoped type="text/scss" lang='scss'>
    .maxDiaglog{
      height: calc(90vh - 72px);
    }
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
