
<template>
    <div class="edit_container main-container BusinessSettings">
        <!-- <Editor v-model="article.content"/> -->
        <div class="main-header">
            <el-form :inline="true" class="demo-form-inline">
                <!-- <regionalism v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion'></regionalism> -->
                <el-form-item label="">
                    <el-input clearable placeholder="名称" v-model="searchValue.Name" class="com-width"></el-input>
                </el-form-item>
<!--                <el-form-item label="">
                    <el-input clearable placeholder="单位名称" v-model="searchValue.companyName" class="com-width"></el-input>
                </el-form-item> -->
                <el-form-item label-width="80px">
                    <el-select class="com-width" size="small" :filterable="category.datas.length > 7" placeholder="类别" v-model="category.code" @change="getBasicOptionList" clearable>
                        <el-option
                                v-for="item in category.datas"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-select class="com-width" size="small" :filterable="state.datas.length > 7" placeholder="状态" v-model="state.code" clearable style="margin-right: 10px;">
                        <el-option
                                v-for="item in state.datas"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="query()">查询</el-button>
                </el-form-item>                
            </el-form>            
        </div>
        <div>
            <el-container>
                <el-aside width="200px" class="left">
                    <el-tree 
                     :data="treeData" 
                     ref="treeForm" 
                     @node-click="handleClick" 
                     :check-strictly="true" 
                     node-key="Id"
                     class="el-tree-node__contents"
                     highlight-current
                     :props="operateTypeProps">
                    </el-tree>
                </el-aside>
                <el-main class="right">
                    <div class="tableheaderbac">
                        <el-button type='primary' plain @click="openAddCheckItemDialog">添加</el-button>
                    </div>
                    <el-table
                            class="main-table"
                            :data="list"
                            v-loading="Loading"
                            border
                            highlight-current-row
                            ref="table"
                            height="100%"
                            id="table"
                            @selection-change="">
                        <el-table-column type="index" align="" label="序号" show-overflow-tooltip width="50">
                        </el-table-column>
                        <el-table-column property="UndertakingTitle" align="" show-overflow-tooltip label="名称" width="">
                            <template slot-scope="scope">
                                <span class="linkType" type="text" @click="showTaskInfo(scope.row.Id)">{{ scope.row.UndertakingTitle }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column property="UndertakingType" label="类型" show-overflow-tooltip align="" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.UndertakingType == 1 ?'承诺书' : '制度'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column property="UndertakingSubDate" label="设置时间" show-overflow-tooltip align="" width="">
                        </el-table-column>
                        <el-table-column property="UndertakingStatus" label="状态" show-overflow-tooltip align="" width="">
                            <template slot-scope="scope">
                                <span v-if="scope.row.UndertakingStatus == 1">未发布</span>
                                <span v-if="scope.row.UndertakingStatus == 2">已发布</span>
                                <span v-if="scope.row.UndertakingStatus == 3">已下线</span>
                            </template>
                        </el-table-column>
                        <el-table-column property="UndertakingUserId" label="操作" show-overflow-tooltip align="" width="">
                           <template slot-scope="scope">
                                <el-button type='primary' plain size="mini" v-if="scope.row.UndertakingStatus==1" @click="modifyUnder(scope.row)">修改</el-button>
                                <el-button type='primary' plain size="mini" v-if="scope.row.UndertakingStatus==1" disabled>下线</el-button>
                                <el-button type='primary' plain size="mini" v-if="scope.row.UndertakingStatus==2" disabled>修改</el-button>
                                <el-button type='primary' plain size="mini" v-if="scope.row.UndertakingStatus==2" @click="Isoffline(scope.row.Id)">下线</el-button>
                                <el-button type='primary' plain size="mini" v-if="scope.row.UndertakingStatus==3" disabled>修改</el-button>
                                <el-button type='primary' plain size="mini" v-if="scope.row.UndertakingStatus==3" disabled>下线</el-button>
                            </template>   
                        </el-table-column>
                        <el-table-column property="StoreType" show-overflow-tooltip label="启用详情" align="" min-width="">
                           <template slot-scope="scope">
                                <el-button type='primary' plain size="mini" @click="Seedetails(scope.row.Id)">查看</el-button>
                            </template>               
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </div>
        <!--翻页-->
        <pagination 
         v-show="total>=0" 
         :total="total" 
         :page.sync="searchValue.page" 
         :limit.sync="searchValue.rows"
         @pagination="InitTable()" 
         class="main-bottom" />  
        <el-dialog
            v-if="addCheckItemDiaglog.show"
            :title="title"
            :visible.sync="addCheckItemDiaglog.show"
            width="50%"
            top="10vh"
            :close-on-click-modal="false">
                <div class="mbottm20">
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px">名称</label>
                    <el-input type="text" clearable class="addCheckItemDialogInput com-width" v-bind:disabled="readonly"  v-model="addCheckItemDiaglog.Name"  @input="fixedOnInputChange"></el-input>
                    <label class="addCheckItemDialogLabel" style="margin-left: 10px">类别</label>
                    <el-select clearable class="com-width" :filterable="addCheckItemDiaglog.category.datas.length > 7" style="margin-left: 10px" v-bind:disabled="readonly" v-model="addCheckItemDiaglog.category.code">
                        <el-option v-for="it_em in addCheckItemDiaglog.category.datas" :key="it_em.value"
                                   :label="it_em.label" :value="it_em.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="mbottm20">
                </div>
                <Editor v-model="article.content" @editorContent="EditorChange" :Isinput="Isinput"/>
                <div style="text-align: center;margin-top: 20px;" v-if="btnShow">
                    <el-button style="margin-right: 20px;" @click="cancel()">取消</el-button>
                    <el-button type="primary" style="margin-right: 20px;" @click="Preservation()">保存</el-button>
                    <el-button type='success' style="margin-right: 20px;" @click="Release()">发布</el-button>
                </div>
        </el-dialog>
        <el-dialog
         v-if="Enablationdetails.show"
         :visible.sync="Enablationdetails.show"
         title="启用详情"
         width="90%"
         top="5vh"
         :close-on-click-modal="false"
         >
            <div class="maxDialog main-container">
                <div class="main-header">
                    <el-form :inline="true" class="demo-form-inline">
                        <regionalism v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion'></regionalism>
                        <el-form-item label="">
                            <el-input clearable placeholder="门店名称" v-model="searchDetails.storeName" class="com-width"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input clearable placeholder="单位名称" v-model="searchDetails.companyName" class="com-width"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-select clearable class="com-width" :filterable="Detailsstate.datas.length > 7" v-model="Detailsstate.code" placeholder="状态" @change="">
                                <el-option v-for="item in Detailsstate.datas" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-date-picker v-model="Startdate" type="date" class="com-width-time" placeholder="开始时间"
                                value-format="yyyy-MM-dd" :picker-options="pickerOptions0" @change="Timechange()">
                            </el-date-picker>
                            <el-date-picker v-model="Enddate" type="date" class="com-width-time" placeholder="结束时间"
                                value-format="yyyy-MM-dd" :picker-options="pickerOptions1">
                            </el-date-picker>
                            <el-button type="primary" @click="querydetails()">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-table
                        class="main-table"
                        :data="detailslist"
                        v-loading="Loading"
                        border
                        highlight-current-row
                        ref="table"
                        height="400"
                        id="table"
                        @selection-change="">
                    <el-table-column type="index" align="" label="序号" show-overflow-tooltip width="50">
                    </el-table-column>
                    <el-table-column property="StoreName" align="" show-overflow-tooltip label="门店名称" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.StoreName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="StoreAliasName" label="单位名称" show-overflow-tooltip align="" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.StoreAliasName}}</span>
                        </template>                
                    </el-table-column>
                    <el-table-column property="StoreAddress" label="门店地址" show-overflow-tooltip align="" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.StoreAddress}}</span>
                        </template>                
                    </el-table-column>
                    <el-table-column property="UseDate" label="启用时间" show-overflow-tooltip align="" width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.UseDate}}</span>
                        </template>               
                    </el-table-column>
                    <el-table-column property="UseStatusValue" show-overflow-tooltip label="状态" align="" min-width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.UseStatusValue}}</span>
                            <!-- <el-button type="primary" size="mini" plain v-if="scope.row.StoreType == 1">未启用</el-button>
                            <el-button type="primary" size="mini" plain v-if="scope.row.StoreType == 2">已启用</el-button>
                            <el-button type="primary" size="mini" plain v-if="scope.row.StoreType == 3">已停用</el-button>
                            <el-button type="primary" size="mini" plain v-if="scope.row.StoreType == 4">已下线</el-button> -->
                        </template>
                    </el-table-column>
                    <el-table-column property="StoreType" show-overflow-tooltip label="操作" align="" min-width="">
                        <template slot-scope="scope">
                            <el-button type='primary' plain size="mini" @click="checkPic(scope.$index)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--翻页-->
                <pagination 
                 v-show="Detailstotal>=0" 
                 :total="Detailstotal" 
                 :page.sync="searchDetails.page" 
                 :limit.sync="searchDetails.rows"
                 @pagination="GetStoreUsePageList()" 
                 class="main-bottom" />
            </div>
        </el-dialog>
        <el-dialog
                v-if="checkPicViews"
                :visible.sync="checkPicViews"
                title="查看图片"
                width="50%"
                top="10vh"
                :close-on-click-modal="false">
            <el-carousel :interval="4000" type="card" height="500px">
                <el-carousel-item v-for="item in checkUrl" :key="item">
                    <img :src="item" alt="" style="height:100%;width:100%;">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>
<script src='@/views/BusinessSettings/BusinessSettings.js'>

</script>
<style scoped="scoped" lang="scss">
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
        .el-aside {
            border: 1px solid $defaultColor;
        }
        .el-table thead{
            color: #666666;
        }
        .classifyItemCurrent {
            opacity: 1;
            color: white !important;
            background-color: rgb(121, 187, 255);
        }
        p,span{
            -webkit-user-select:none;
            -moz-user-select:none;
            -ms-user-select:none;
            user-select:none;
        }  
            .el-dialog{
       background: red;
    }
.el-tree-node__content {
    background-color: transparent !important;
  }
</style>
<style scoped="scoped" lang="scss">
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
    .left {
        height: calc(100vh - 124px);
        position: relative;
        overflow: auto;
        background-color: #ecf5ff !important;
    }
    .right {
        width: 100%;
        height: calc(100vh - 124px);
        @include box(box);
        @include box-orient(vertical);
        padding:0 20px;
                .tableheaderbac {
            background: #f2f2f2;
            padding: 10px 10px;
        }
        .main-table{
            height: 300px;
        }
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
            width: 40px;
            display: inline-block;
        }
        .mbottm20 {
            margin-bottom: 10px;
        }
        .maxDialog{
            padding: 0;
            height: calc(85vh - 5vh);
        }
        .el-table thead{
            color: #666666;
        }

    .el-tree-node__contents {
        background-color: #ecf5ff !important;
    }
    .el-input__icon{
        line-height: 32px !important;
    }
</style>
<style>
    .BusinessSettings .el-tree-node__content:hover{
        background: rgb(121, 187, 255);
        color: #fff;
        opacity: .5;
    }
.el-tree-node.is-current > .el-tree-node__content {
    opacity: 1;
        color: #fff;
         background-color: rgb(121, 187, 255) !important;
}
    .BusinessSettings .el-input__icon{
        line-height: 32px !important;
    }
    .BusinessSettings .regionallism{
        margin-left: -20px;
    }
</style>