<template>
    <div class="diningManagement main-container paddingt20">
        <div>
            <div class="item" ref="areachoose">
                <area-choose :area="gridParam.area"
                             custom-select-class="customW"
                             @provienceChange="provienceChange"
                             @cityChange="cityChange"
                             @townChange="townChange"
                             @streetChange="streetChange"
                ></area-choose>
            </div>
            <div class="item" ref="nameComAddLin">
                <el-row :gutter="20">
                    <label class="pre-lable">门店名称</label>
                    <el-col :span="3">
                        <el-input v-model.trim="gridParam.Name"></el-input>
                    </el-col>
                    <label class="pre-lable">单位名称</label>
                    <el-col :span="3">
                        <el-input v-model.trim="gridParam.CompanyName"></el-input>
                    </el-col>
                    <label class="pre-lable">单位地址</label>
                    <el-col :span="3">
                        <el-input v-model.trim="gridParam.Address"></el-input>
                    </el-col>
                    <label class="pre-lable">许可证号</label>
                    <el-col :span="3">
                        <el-input v-model.trim="gridParam.LicenceCode"></el-input>
                    </el-col>
                </el-row>
            </div>
            <div class="item" ref="typeStaMoreQue">
                <el-row :gutter="20">
                    <label class="pre-lable ">经营类型</label>
                    <el-col :span="3">
                        <el-input class="moreellipsis" v-model="gridParam.chooseOperateNames" @click.native="showOperateDialog" readonly></el-input>
                    </el-col>
                    <label class="pre-lable">营业状态</label>
                    <el-checkbox-group v-model="gridParam.StoreStatus" class="middleVertical">
                        <el-checkbox label="5" checked>营业中</el-checkbox>
                        <el-checkbox label="4" checked>待完善</el-checkbox>
                        <el-checkbox label="3" checked>待认领</el-checkbox>
                        <el-checkbox label="1" checked>已导入</el-checkbox>
                        <el-checkbox label="8">停业</el-checkbox>
                        <el-checkbox label="2" checked>生成失败</el-checkbox>
                    </el-checkbox-group>
                    <el-button type="primary" @click="refreshGrid(1)" class="queryBt">查询</el-button>
                </el-row>
            </div>
            <!-- <div class="item" style="float:left;margin-right:10px;color:#606266;">
                <label for="" style="display:inline-block;margin-right:10px;">巡检次数:</label>
                <el-radio v-model="radio" label="1">小于等于_____次</el-radio>
                <el-radio v-model="radio" label="2">大于等于_____次</el-radio>
            </div>
            <div class="item" style="float:left;color:#606266;">
                <label for="" style="display:inline-block;margin-right:10px;">自检次数:</label>
                <el-radio v-model="radio" label="1">小于等于_____次</el-radio>
                <el-radio v-model="radio" label="2">大于等于_____次</el-radio>
            </div> -->
            <div class="item itemRadio">
                <label for="">巡检次数:</label>
                <el-radio-group v-model="gridParam.radio2">
                    <el-radio :label="3">小于等于_____次</el-radio>
                    <el-radio :label="6">大于等于_____次</el-radio>
                </el-radio-group>
            </div>
            <div class="item itemRadio">
                <label for="">自检次数:</label>
                <el-radio-group v-model="gridParam.radio1">
                    <el-radio :label="1">小于等于_____次</el-radio>
                    <el-radio :label="2">大于等于_____次</el-radio>
                </el-radio-group>
            </div>
            
            <div class="item" style="clear:both;">
                <el-button type="primary" @click="addList">添加</el-button>
            </div> 
        </div>
        <el-table
                v-loading="gridParam.gridLoading"
                :data="gridParam.gridList"
                border
                :height="gridParam.gridHeight"
                fit
                highlight-current-row
                style="width: 60%;" ref="gridwrap">
            <el-table-column type="index" width="40" align="center"></el-table-column>
            <el-table-column :label="gridParam.table.StoreName" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.cell[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="gridParam.table.CompanyName" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.cell[1] }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="gridParam.table.StroeAddress" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.cell[4] }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="gridParam.table.StoreStatus" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.cell[5] | computeStoreStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="gridParam.table.operate" min-width="150px" show-overflow-tooltip class-name="status-col">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.cell[5]==1||scope.row.cell[5]==3||scope.row.cell[5]==4" type="text" @click="deleteStore(scope.row.id)">删除</el-button>
                    <el-button v-if="scope.row.cell[5]==3||scope.row.cell[5]==4||scope.row.cell[5]==5||scope.row.cell[5]==8" type="text">查看详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination ref="pagination" v-show="gridParam.gridTotalCount>0" :total="gridParam.gridTotalCount"
                    :page.sync="gridParam.giridPageNum" :limit.sync="gridParam.giridPageLimit" @pagination="refreshGrid"></pagination>
        <!--<viewDetails :isviewDetails="gridParam.isviewDetails" @hand="handd"></viewDetails>-->
        
        <el-dialog
                title="选择经营类型"
                custom-class="operate-dialog"
                :visible.sync="gridParam.showChooseOperate"
                width="30%"
                :close-on-click-modal="false"
                :before-close="handleClose"
        >
            <el-scrollbar>
                <el-tree ref="operate_tree"
                         class="operate-tree"
                         :data="gridParam.OperateTypeList"
                         show-checkbox
                         :props="gridParam.operateTypeProps"
                         node-key="Id"
                         :default-expanded-keys="gridParam.chooseOperateIds"
                         :default-checked-keys="gridParam.chooseOperateIds"
                >
                </el-tree>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script src="./seeSelectedObject.js"></script>

<style scoped lang="scss">

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

    .item {
        margin-bottom: 20px;
    }

    .middleVertical {
        height: 40px;
        line-height: 40px;
        display: inline-block;
    }

    .moreCondition {
        margin-left: 20px;
        font-size: 12px;
        display: inline-block;
        cursor: pointer;
    }

    .queryBt {
        margin-left: 20px;
    }

    .mtop20 {
        margin-top: 20px;
    }

    .paddingt20 {
        padding-top: 20px;
    }

    .testtest {
        color: red;
    }

    .diningManagement {
        width: 100%;
        height: 100%;
        font-size:14px;
    @include box(box);
    @include box-orient(vertical);
    }
    .el-table thead {
        color:#000000 !important;
    }
    .itemRadio{
        float:left;
        margin-right:20px;
    }
    .itemRadio label{
        display:inline-block;
        margin-right:10px;
        color:#606266;
    }
</style>
<style>
    .diningManagement .customW {
        width: 160px !important;
    }
    .moreellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .moreellipsis input {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .diningManagement .operate-tree {
        height: 600px;
    }

    .diningManagement .operate-dialog {
        /*height: 600px;*/
    }

    .diningManagement .el-message {
        top: 50%
    }

    .diningManagement .el-button--primary.is-plain:focus, .el-button--primary.is-plain:hover {
        background-color: rgb(236, 245, 255) !important;
        border-color: rgb(179, 216, 255) !important;
        color: rgb(64, 158, 255) !important;
    }

    .diningManagement .el-progress__text {
        color: white !important;
    }


</style>