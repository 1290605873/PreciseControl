<template>
    <div class="createTask">
        <h2>发布任务</h2>
        <div class="infoItem">
            <h3>基础信息</h3>
            <div class="content">
                <p>
                    <label for="">业态类型:</label>
                    <el-select v-model="createTask.info.businessTypeValue" :filterable="createTask.info.businessType.length > 7" multiple>
                        <el-option v-for="item in createTask.info.businessType" :key="item.id" :value="item.value">{{item.value}}</el-option>
                    </el-select>
                </p>
                <p>
                    <label for="">业务类型:</label>
                    <el-select v-model="createTask.info.checkTypeValue" :filterable="createTask.info.checkType.length > 7">
                        <el-option v-for="item in createTask.info.checkType" :key="item.id" :value="item.value">{{item.value}}</el-option>
                    </el-select>
                </p>
                <p>
                    <label for="">任务类型:</label>
                    <el-input type="text"></el-input>
                </p>
                <p>
                    <label for="">任务名称:</label>
                    <el-input type="text"></el-input>
                </p>
                <p>
                    <label for="" class="task">任务说明:</label>
                    <textarea type="text" rows="5" maxlength="500"></textarea>
                </p>
            </div>
        </div>
        <div class="infoItem">
            <h3>任务周期</h3>
            <div class="content">
                <p>
                    <label for="">开始时间:</label>
                    <el-input type="text"></el-input>
                    <label for="">结束时间:</label>
                    <el-input type="text"></el-input>
                </p>
                <p>
                    <label for="">任务计时时间:</label>
                    <el-input type="text"></el-input>
                </p>
                <p>
                    <el-radio></el-radio>
                    <label for="">频次</label>
                    <el-input placeholder="1" class="frequencyNum"></el-input>
                    <el-select v-model="createTask.period.frequency" class="frequency">
                        <el-option value="请选择">请选择</el-option>
                        <el-option value="次/天">次/天</el-option>
                        <el-option value="次/月">次/月</el-option>
                        <el-option value="次/季度">次/季度</el-option>
                    </el-select>
                    <el-radio></el-radio>
                    <label for="" class="nums">次数</label>
                    <el-input class="times" placeholder="1" v-model="createTask.period.times"></el-input>
                </p>
            </div>
        </div>
        <div class="infoItem">
            <h3>任务执行设置</h3>
            <div class="content">
                <p>
                    <label for="">检查对象:</label>
                    <label for="" @click="checkObj">
                        <el-input type="text"></el-input>
                    </label>
                </p>
                <p>
                    <label for="">检查方式:</label>
                    <el-radio type="text"></el-radio>
                    <label for="">按网络分工</label>
                <p style="margin-left:70px;">
                    <el-radio type="text"></el-radio>
                    <label for="">指定设置</label>
                    <label for="">选择组织或人员:</label>
                    <el-input type="text"></el-input>
                </p>
                </p>
                <p>
                    <label for="">检查内容:</label>
                    <label for="" @click="checkContent">
                        <el-input type="text"></el-input>
                    </label>
                </p>
            </div>
        </div>
        <div class="operateButton">
            <el-button tyle="info">保存不发布</el-button>
            <el-button tyle="primary">发布</el-button>
        </div>

        <!-- 检查对象 -->
        <!-- <el-dialog
            title="检查对象"
            :visible.sync="selectCheckingObject.checkObjDialog.show"
            top='10vh'
            width="100%"
            >
            <div class="maxDialog">
                <div class="mbottm20">
                    <el-checkbox></el-checkbox>
                    <label for="">按区域:</label>
                    <el-select v-model="selectCheckingObject.areaValue" multiple placeholder="上地街道">
                        <el-option v-for="item in selectCheckingObject.area" :key="item.id" :value="item.value">{{item.value}}</el-option>
                    </el-select>
                    <el-checkbox></el-checkbox>
                    <label for="">按业态:</label>
                    <el-select v-model="selectCheckingObject.opertaionValue" placeholder="餐饮服务">
                        <el-option v-for="item in selectCheckingObject.opertaion" :key="item.id" :value="item.value">{{item.value}}</el-option>
                    </el-select>

                    <el-checkbox></el-checkbox>
                    <label for="">按自检次数:</label>
                    <el-select v-model="selectCheckingObject.seleCheckTimeValue" placeholder="巡检次数">
                        <el-option v-for="item in selectCheckingObject.seleCheckTime" :key="item.id" :value="item.value">{{item.value}}</el-option>
                    </el-select>

                    <el-checkbox></el-checkbox>
                    <label for="">按巡检次数:</label>
                    <el-select v-model="selectCheckingObject.inspectionTimeValue" placeholder="自检次数">
                        <el-option v-for="item in selectCheckingObject.inspectionTime" :key="item.id" :value="item.value">{{item.value}}</el-option>
                    </el-select>
                </div>
                <div class="mbottm20">
                    <el-checkbox></el-checkbox>
                    <label for="">按店加入:</label>
                    <el-button type="primary">添加</el-button>
                    <el-button type="primary">删除</el-button>
                </div>
                <div class="mbottm20">
                        <el-table
                            height="auto"
                            border
                            style="width: 80%"
                        >
                        <el-table-column type="index" width="40" align="center">序号</el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.CompanyName" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.storeName" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.licence" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.TwoLevelFormat" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.storeAddress" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.operate" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="mbottm20 operateButton">
                    <el-button type="primary">查询</el-button>
                    <el-button type="primary">提交</el-button>
                    <el-button type="primary">取消</el-button>
                </div>
                <div class="mbottm20 checkedStore">
                    <label for="">已选门店:</label><el-input placeholder="请输入门店名称"></el-input><el-button type="primary">查询</el-button>
                </div>
                <div class="mbottom20">
                    <el-table
                        height="auto"
                        border
                        style="width: 80%"
                        >
                        <el-table-column width="40" align="center">
                            <el-checkbox></el-checkbox>
                        </el-table-column>
                        <el-table-column type="index" width="40" align="center">序号</el-table-column>
                        <el-table-column :label="selectCheckingObject.selectedTable.CompanyName" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.selectedTable.storeName" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.selectedTable.licence" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.selectedTable.operateState" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.selectedTable.storeAddress" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.selectedTable.operate" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="total"><span class="totalNumber">合计<label v-model="selectCheckingObject.totalNum">__</label>家</span></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancleCheckObjDialog">取 消</el-button>
                <el-button type="primary" @click="sureCheckObjDialog">确 定</el-button>
            </span>
        </el-dialog> -->
        <!-- 检查对象 end -->
        <!-- 检查内容 -->
        <el-dialog
                title="检查对象"
                :visible.sync="selectCheckingObject.checkObjDialogList.show"
                top='10vh'
                width="100%">
            <div class="addDialogButton buttonStyle" @click="queryStore()">
                <el-button>添加</el-button>
            </div>
            <div class="mbottom20">
                <el-table
                        height="auto"
                        border
                        highlight-current-row
                        style="width: 80%"
                >
                    <el-table-column width="40" align="center">
                        <el-checkbox></el-checkbox>
                    </el-table-column>
                    <el-table-column type="index" width="40" align="center"></el-table-column>
                    <el-table-column :label="selectCheckingObject.selectedTable.CompanyName" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="selectCheckingObject.selectedTable.storeName" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="selectCheckingObject.selectedTable.licence" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="selectCheckingObject.selectedTable.operateState" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="selectCheckingObject.selectedTable.storeAddress" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="selectCheckingObject.selectedTable.operate" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="sureDialogButton buttonStyle">
                    <el-button>确定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog
                title="查询门店"
                :visible.sync="selectCheckingObject.queryStoreDialog.show"
                top='10vh'
                width="100%">
            <div class="maxDialog">
                <div class="mbottm20">
                    <el-checkbox></el-checkbox>
                    <label for="">按区域:</label>
                    <el-select v-model="selectCheckingObject.areaValue" :filterable="selectCheckingObject.area.length > 7" multiple placeholder="上地街道">
                        <el-option v-for="item in selectCheckingObject.area" :key="item.id" :value="item.value">{{item.value}}</el-option>
                    </el-select>
                    <el-checkbox></el-checkbox>
                    <label for="">按业态:</label>
                    <el-select v-model="selectCheckingObject.opertaionValue" placeholder="餐饮服务" :filterable="selectCheckingObject.opertaion.length > 7">
                        <el-option v-for="item in selectCheckingObject.opertaion" :key="item.id" :value="item.value">{{item.value}}</el-option>
                    </el-select>

                    <el-checkbox></el-checkbox>
                    <label for="">按自检次数:</label>
                    <el-select v-model="selectCheckingObject.seleCheckTimeValue" placeholder="巡检次数" :filterable="selectCheckingObject.seleCheckTime.length > 7">
                        <el-option v-for="item in selectCheckingObject.seleCheckTime" :key="item.id" :value="item.value">{{item.value}}</el-option>
                    </el-select>

                    <el-checkbox></el-checkbox>
                    <label for="">按巡检次数:</label>
                    <el-select v-model="selectCheckingObject.inspectionTimeValue" placeholder="自检次数" :filterable="selectCheckingObject.inspectionTime.length > 7">
                        <el-option v-for="item in selectCheckingObject.inspectionTime" :key="item.id" :value="item.value">{{item.value}}</el-option>
                    </el-select>
                </div>
                <div class="mbottm20">
                    <el-table
                            highlight-current-row
                            height="auto"
                            border
                            style="width: 80%"
                    >
                        <el-table-column type="index" width="40" align="center"></el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.CompanyName" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.storeName" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.licence" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.TwoLevelFormat" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.storeAddress" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="selectCheckingObject.addTable.operate" min-width="80px" show-overflow-tooltip>
                            <template>
                                <span>{{}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="mbottm20 operateButton">
                    <el-button>取消</el-button>
                    <el-button type="primary" @click="closeQueryStore">保存</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog
                title="检查内容"
                :visible.sync="checkingContent.checkingContentDialog.show"
                top='10vh'
                width="100%"
        >
            <div class="maxDialog">
                <el-table
                        width="80%"
                        center
                        border
                        highlight-current-row
                >
                    <el-table-column width="40" align="center">
                        <el-checkbox></el-checkbox>
                    </el-table-column>
                    <el-table-column type="index" width="40" align="center"></el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.className" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.checkName" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.explain" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.img" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.important" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.voice" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.operationSteps" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.guidedImg" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.guidanceLang" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.isEnabled" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.defaultPass" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.operate" min-width="80px" show-overflow-tooltip>
                        <template>
                            <span>{{}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 检查内容 end-->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                //创建发布类型
                createTask: {
                    //基础信息
                    info: {
                        businessType: [
                            {
                                id: '1',
                                value: '食品-餐饮'
                            },
                            {
                                id: '2',
                                value: '食品-食堂'
                            },
                            {
                                id: '3',
                                value: '食品-销售'
                            }

                        ],
                        businessTypeValue: '',
                        checkType: [
                            {
                                id: '1',
                                value: '常规巡检'
                            },
                            {
                                id: '2',
                                value: '专项巡检'
                            },

                        ],
                        checkTypeValue: ''

                    },
                    //周期
                    period: {
                        times: "1",
                        frequency: "次/天"
                    },
                },
                //检查对象
                selectCheckingObject: {
                    // checkObjDialog:{
                    // 	show:false
                    // },
                    //显示门店列表弹框
                    checkObjDialogList: {
                        show: false
                    },
                    //查询门店弹框
                    queryStoreDialog: {
                        show: false
                    },
                    //按店加入
                    addTable: {
                        CompanyName: "单位名称",
                        storeName: "门店名称",
                        licence: "许可证",
                        TwoLevelFormat: "二级业态",
                        storeAddress: "门店地址",
                        operate: "操作"
                    },
                    //已选门店
                    selectedTable: {
                        companyName: "单位名称",
                        storeName: "门店名称",
                        licence: "许可证",
                        operateState: "经营状态",
                        storeAddress: "门店地址",
                        operate: "操作"
                    },
                    totalNum: "x",
                    area: [
                        {
                            id: '1',
                            value: '社区1'
                        },
                        {
                            id: '2',
                            value: '社区2'
                        },
                        {
                            id: '3',
                            value: '社区3'
                        }

                    ],
                    areaValue: '',
                    opertaion: [
                        {
                            id: '1',
                            value: '微型餐饮'
                        },
                        {
                            id: '2',
                            value: '中型餐饮'
                        },
                        {
                            id: '3',
                            value: '大型餐饮'
                        }

                    ],
                    opertaionValue: '',
                    seleCheckTime: [
                        {
                            id: '1',
                            value: '小于等于2次'
                        },
                        {
                            id: '2',
                            value: '大于等于2次'
                        }
                    ],
                    seleCheckTimeValue: "",
                    inspectionTime: [
                        {
                            id: '1',
                            value: '小于等于2次'
                        },
                        {
                            id: '2',
                            value: '大于等于2次'
                        }
                    ],
                    inspectionTimeValue: "",
                    totalNum: ""
                },
                //检查内容
                checkingContent: {
                    checkingContentDialog: {
                        show: false
                    },
                    checkingContentTable: {
                        className: "分类名称",
                        checkName: "检查项名称",
                        explain: "说明",
                        img: "图片",
                        important: "重要性",
                        voice: "语音",
                        operationSteps: "操作步骤",
                        guidedImg: "引导图",
                        guidanceLang: "引导语",
                        isEnabled: "是否启用",
                        defaultPass: "默认通过",
                        operate: "操作"

                    }
                },
                //选择组织和人员
                selectOrAndPeople: {}

            }
        },
        methods: {
            //检查项
            /*checkObj(){
                this.selectCheckingObject.checkObjDialog.show = true;
            },
            //取消关闭检查对象弹框
            cancleCheckObjDialog(){
                this.selectCheckingObject.checkObjDialog.show = true;
            },
            //关闭检查对象弹框
            sureCheckObjDialog(){
                this.selectCheckingObject.checkObjDialog.show = false;
            },*/
            checkObj() {
                this.selectCheckingObject.checkObjDialogList.show = true;
            },
            //查询门店
            queryStore() {
                this.selectCheckingObject.queryStoreDialog.show = true;
            },
            //关闭查询门店
            closeQueryStore() {
                this.selectCheckingObject.queryStoreDialog.show = false;
            },


            //检查内容
            checkContent() {
                this.checkingContent.checkingContentDialog.show = true;
            }


        }
    }
</script>
<style scoped lang="scss">
    .createTask {
        width: 60%;
        padding: 10px 20px 20px 20px;
        height: auto;
        margin: 20px auto;
        font-size: 14px;
        color: #333333;
        border: 1px solid #cccccc;
    }

    .infoItem {
        border: 1px solid #cccccc;
        padding: 0 10px;
        margin-bottom: 20px;
    }

    .infoItem h3 {
        height: 20px;
        line-height: 10px;
        border-bottom: 1px solid #cccccc;
    }

    .infoItem .content {
        padding-left: 20px;
    }

    @mixin labelt {
        display: inline-block;
        margin-right: 10px;
        color: #666666;
    }
    p label {
    @include labelt
    }

    .frequencyNum {
        margin-right: 0 !important;
        width: 50px !important;
    }

    .frequency {
        margin-left: 0 !important;
        width: 100px;
    }

    p label.task {
    @include labelt;
        position: relative;
        bottom: 40px;
    }

    p label.taskPeople {
        width: 60px;
        text-align: right;
    }

    p .el-input {
        width: 200px;
        margin-right: 20px;
    }

    p .el-input.times {
        width: 50px;
    }

    p textarea {
        width: 30%;
        border: 1px solid #cccccc;
    }

    p .el-radio {
        margin-right: 0
    }

    p .el-select {
        margin-right: 25px;
    }

    .operateButton {
        text-align: right;
        margin-right: 30px;
    }


    .mbottm20 {
        margin-bottom: 20px;
    }

    .operateButton {
        text-align: center;
        margin: 10px 0;
    }

    label {
        display: inline-block;
        margin-right: 10px;
    }

    .el-select {
        margin-right: 10px;
    }

    .checkedStore label {
        margin-right: 10px;
    }

    .checkedStore .el-input {
        width: 200px;
        margin-right: 40px;
    }

    .total {
        text-align: center;
    }

    .totalNumber {
        display: inline-block;
        border: 1px solid #cccccc;
        width: 200px;
        height: 30px;
        line-height: 30px;
        margin: 10px 0;
    }

    .buttonStyle {
        width: 80%;
        margin-right: 20px;
        margin: 20px 0;
    }

    .addDialogButton {
        text-align: right;
    }

    .sureDialogButton {
        text-align: center;
    }
</style>
