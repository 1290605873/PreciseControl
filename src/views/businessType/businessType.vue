<template>
    <div class="checkItemLibrary">
        <el-tabs style="height:100%"
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
                    <el-main class="right">
                        <!-- <div class="tableheaderbac">
                            <span class="tableOper">
                            </span>
                        </div> -->
                <div class="addbutton" style="margin-bottom: 10px;">
                                <el-button class=""  type="primary" plain @click="centerDialogVisible = true;tableGridId = '';businessName = '';title='添加任务类型'">添加任务类型</el-button>
                    <!-- <el-button type="primary" plain @click="addview">添加</el-button> -->
                </div>                        
                        <el-table
                                :data="tableGrid"
                                border
                                highlight-current-row
                                class="main-table"
                                ref="table"
                                id="table"
                                height="100%"
                                @selection-change="">
                            <el-table-column type="index" align=""  width="50">
                            </el-table-column>
                            <el-table-column property="Text" label="名称" align="" width="">
                            </el-table-column>
                            <el-table-column align="" label="操作"  width="">

                               <!-- <template slot="header"   slot-scope="scope">
                                    <div style="text-align: right !important;width: 100%">
                                        <el-button plain  type="primary" @click="centerDialogVisible = true;tableGridId = '';businessName = '';">添加任务类型</el-button>
                                    </div>
                                </template> -->
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" v-if="scope.row.NoDelete" disabled @click="modifyEById(scope.$index)">
                                        修改
                                    </el-button>
                                    <el-button size="mini" type="primary" v-else @click="modifyEById(scope.$index)">
                                        修改
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="pageNation.total>0" :total="pageNation.total" :page.sync="pageNation.pageNum" :limit.sync="pageNation.countPerPage"
                            class="main-bottom" id="main-bottom" />
                    </el-main>
                    <el-dialog
						:title="title"
						:visible.sync="centerDialogVisible"
						width="30%"
                        :close-on-click-modal="false"
						>
						<span style="display: flex;">
							<label for="" style="width: 50px;line-height: 32px;">名称:</label>	
							<el-input clearable v-model="businessName" placeholder="最多可输入20个汉字" @input.native="changeCode" maxlength="20"></el-input>
						</span>
						<span slot="footer" class="dialog-footer">
							<el-button @click="centerDialogVisible = false">取 消</el-button>
							<el-button type="primary"  @click="Preservation()">确 定</el-button>
						</span>
					</el-dialog>
                </el-container>
            </div>
        </el-tabs>


    </div>
</template>
<script src="@/views/businessType/businessType.js">
//     import EditableCell from "../../components/EditableCell.vue";
//     import Pagination from '../../components/Pagination';
// 
//     export default {
//         components: {
//             EditableCell,
//             Pagination
//         },
//         data() {
//             return {
//                 topTabs: {//顶部业态
//                     //业态
//                     code: "", //当前业态值
//                     datas: []
//                 },
//                 taskTabs: {//业态下的任务
//                     code: "", //当前值
//                     datas: [
// 	                    {
// 	                    	id:'1',
// 	                    	name:'巡检执法'
// 	                    },
// 	                    {
// 	                    	id:'2',
// 	                    	name:'自检自查'
// 	                    }
//                     ]
//                 },
//                 tableGrid: {
//                     column: {
//                         name: '名称',
//                         desc: '说明',
//                         operate: '操作'
//                     },
//                     datas: []
//                 },
//                 centerDialogVisible: false, //添加任务类型
//                 pageNation: {//分页
//                     total: 100,
//                     pageNum: 1,//页数
//                     countPerPage: 20//每页数
//                 },
//                 classify: {//分类
//                     datas: []
//                 }
//             };
//         },
//         props: "",
//         computed: {},
//         methods: {
//             topTabsClick(e){
//                 this.message('topTabsClick');
//             },
//             taskTabsClick(e){
//                 this.message('taskTabsClick');
//             },
//             onPageNation() {//翻页
//                 this.message('onPageNation');
//             }
//         },
//         beforeCreated() {
//         },
//         created() {
//             for (let i = 0; i < 30; i++) {
//                 this.topTabs.datas.push({
//                     id: i + '',
//                     name: "业态" + i
//                 });
//                 /*this.taskTabs.datas.push({
//                     id: i + '',
//                     name: "二级" + i
//                 });*/
//                 
//             }
//         },
//         mounted() {
//         }
//     };
</script>
<style type="text/scss" lang="scss" scoped>
    .checkItemLibrary {
        height: 100%;
        .classifyItemCurrent {
            opacity: 1;
            color: white !important;
            background-color: $defaultColor;
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
        .btn {
            background-color: rgb(236, 245, 255);
            border-radius: 4px;
            border: 1px solid rgb(179, 216, 255);
            color: rgb(64, 158, 255);
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            font-weight: 500;
            height: 34px;
            line-height: 14px;
            margin-bottom: 0px;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 0px;
            padding-bottom: 9px;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 9px;
            text-align: center;
            white-space: nowrap;
            width: 126px;
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
        .el-main {
            padding: 0 20px
        }
    }
</style>
<style lang="scss" type="text/scss">
    .checkItemLibrary {
        .el-aside {
            text-align: center;
            border: 1px solid $defaultColor;
        }
        .el-table thead{
            color: #666666;
        }
    }

</style>
