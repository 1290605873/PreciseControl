<template>
	<div class="container">
        <div class="flexContainer">
            <div class="top" ref="top">
                <el-form inline>
                    <regionalism :isAuth="1" :showAll="false" v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion'></regionalism>
                    <el-form-item>
                        <el-input v-model="state" clearable class="com-width" maxlength="15" placeholder="单位名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select clearable class="com-width" v-model="Violations.AttrCode" placeholder="请选择违规项" >
                            <el-option v-for="item in Violations.datas" :key="item.AttrCode" :label="item.AttrName" :value="item.AttrCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select clearable class="com-width" v-model="IsViolation.code" placeholder="是否违规" >
                            <el-option v-for="item in IsViolation.datas" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select class="com-width" v-model="IsToexamine.code" placeholder="是否审核"  clearable>
                            <el-option v-for="item in IsToexamine.datas" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                        <el-input clearable class="com-width" maxlength="15" placeholder="审核人" v-model="Auditor"></el-input>
                    </el-form-item>
                    <el-form-item label-width="80px">
                        <el-date-picker
                                value-format="yyyy-MM-dd HH:mm:ss"
                                class="com-width"
                                placeholder="请选择开始时间"
                                v-model="StartTime"
                                type="datetime"
                                @change="startTimeChange"
                                clearable>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label-width="80px">
                        <el-date-picker
                                placeholder="请选择结束时间"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :picker-options="pickerOptions1"
                                class="com-width"
                                v-model="EndTime"
                                type="datetime"
                                clearable>
                        </el-date-picker>
                        <el-button style="margin-left: 10px" type="primary" :disabled="disabled" @click="queryList">查 询</el-button>
                    </el-form-item>
                    <div style="margin-bottom: 10px;">
                        <el-button type="primary" plain @click="comInspectAuditPic()">审核通过</el-button>
                    </div>
                </el-form>
            </div>
            <div class="picTable">
                <el-form inline ref="middle"  v-loading.body="loadings" class="middle" element-loading-text="正在加载中">
                    <el-form-item v-for="(item,index) of gridParam.gridList" :key="index" :style="{width: (640*3/5-2)+'px',height: (360*3/5+42)+'px'}" >
                        <div :style="{position: 'relative',height: (360*3/5)+'px'}">
                            <img :src="item.OriginalPicture" alt="" style="width: 100%;height: 100%;" @click.stop="change(item.Id)" @dblclick="dbcheck(index, item)">

                            <template v-if="!!item.Coordinate" >
                                <span v-for="(items,idx) of item.Coordinate" :key="idx" :style="{position: absolute,top:((items.Top/item.InitHeight*100).toFixed(2))+'%',left:((items.Left/item.InitWidth*100).toFixed(2))+'%',width: (items.Width/item.InitWidth*100).toFixed(2)+'%',height: (items.Height/item.InitHeight*100).toFixed(2)+'%',border: border}"></span>
                            </template>

                            <el-checkbox style="position: absolute;right: 0;top: -9px;" @change.native="change(item.Id, 'checkbox')" v-model="item.checked"></el-checkbox>
                        </div>
                        <div style="position: absolute;display: flex;justify-content: space-between;width: 100%;line-height: 25px;margin: 10px 0 0 0;">
                            <div>
                                <el-tag style="margin-right: 10px;float: left;" v-if="!item.IsAudit">合格</el-tag>
                                <el-tag style="margin-right: 10px;float: left;" type="danger" v-if="item.IsAudit">违规</el-tag>
                                <el-tag style="margin-right: 10px;float: left;" type="info" >{{item.AttrTxt}}</el-tag>

                            </div>
                            <el-tag v-if="item.AuditStatus == 1">未审核</el-tag>
                            <el-tag  type="success"  v-if="item.AuditStatus == 2">{{item.AuditUserName}}</el-tag>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <pagination v-show="total>=0" :total="total" :page.sync="searchValue.page" :limit.sync="searchValue.rows"
                @pagination="GetAiPhotoSearch" class="main-bottom" />
        </div>

        <el-dialog
                title="审查图片"
                custom-class="operate-dialog"
                :visible.sync="markpicDialog.show"
                width="1000px"
                top="10vh"
                :close-on-click-modal="false"
                append-to-body
                @close="onMarkDialogClose">
            <div class="maxDialog_">
                <iframe id="childiframe" src="static/via/via.html" scrolling="auto"  frameborder="0" style="height: 100%;width: 100%"   ></iframe>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="onMarkDialogClose">关闭</el-button>
                    <!-- <el-button type="primary" @click="move_to_prev_image" >上一张</el-button>
                    <el-button type="primary" @click="move_to_next_image" >下一张</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script src='@/views/AIoperationRectificate/AIoperationRectificate.js'>
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
        box-sizing: border-box;

        .middle{
            /*height: calc(100vh - 261px);*/
            // overflow-y: scroll;
        }
    }
    .flexContainer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
        padding: 10px;

        .picTable {
            flex: 1;

            overflow-y: scroll;
            /deep/.el-form {
                padding: 5px;
                .el-form-item {
                    box-shadow: 0 0 5px #ddd;
                    margin-bottom: 10px;
                }
                .el-checkbox__inner {
                    width: 20px;
                    height: 20px;
                }
                .el-checkbox__inner::after {
                    top: 4px;
                    left: 7px;
                }
            }
        }

    }
    .container {
        height: 100%;
        background: #fff;

    }

    .maxDialog_{
        height: calc(80vh - 106px);
        overflow-y: auto;
        font-size: 0;
    }
</style>
