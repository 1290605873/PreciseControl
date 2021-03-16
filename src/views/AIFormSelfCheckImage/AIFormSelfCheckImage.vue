<template>
    <div class="container">
        <div class="flexContainer">
            <div class="top" ref="top">
                <el-form inline v-show="!isSlide">
                    <regionalism
                        :isAuth="1"
                        :showAll="false"
                        v-on:regionalismResult='regionalismResult'
                        v-on:initRegion='initRegion'>
                    </regionalism>
                    <el-form-item>
                        <el-input
                            v-model="state"
                            clearable
                            class="com-width"
                            maxlength="15"
                            placeholder="单位名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select
                            clearable
                            class="com-width"
                            v-model="AttrCode"
                            placeholder="请选择违规项" >
                            <el-option
                                v-for="item in violationsList"
                                :key="item.AttrCode"
                                :label="item.AttrName"
                                :value="item.AttrCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select
                            clearable
                            class="com-width"
                            v-model="IsAudit"
                            placeholder="是否违规" >
                            <el-option
                                v-for="item in isViolationList"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select
                            class="com-width"
                            v-model="AuditStatus"
                            placeholder="是否审核"
                            @change="auditChange"
                            clearable>
                            <el-option
                                v-for="item in isToexamineList"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="80px">
                        <el-date-picker
                            value-format="yyyy-MM-dd HH:mm:ss"
                            class="com-width"
                            placeholder="请选择开始时间"
                            v-model="StartTime"
                            type="datetime"
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
                    </el-form-item>
                    <el-form-item>
                      <el-select
                        class="com-width"
                        v-model="scene"
                        placeholder="五定场景"
                        clearable>
                        <el-option
                          v-for="(i, j) in sceneList"
                          :key="j"
                          :label="i.BusinessName"
                          :value="i.Id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            :disabled="disabled"
                            @click="queryList">
                            查 询
                        </el-button>
                    </el-form-item>
                </el-form>
                <div style="margin:5px 0 10px;">
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        :disabled="disabled || this.AuditStatus == 2"
                        @click="Allelection">
                        全选
                    </el-button>
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        :disabled="disabled || this.AuditStatus == 2"
                        @click="comInspectAuditPic()">
                        批量提交
                    </el-button>
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        :disabled="disabled"
                        @click="goTask">
                        违规标识
                    </el-button>
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        :disabled="disabled"
                        class="slide-btn"
                        :icon="isSlide ? 'el-icon-arrow-down':'el-icon-arrow-up' "
                        @click="slideToggle">
                    </el-button>
                    <div class="sum-info-box"  v-show="!isSlide">
                        <span>
                            已审核：{{AuditedTotal}}
                        </span>
                        <span>
                            待审核：{{NotAuditedTotal}}
                        </span>
                        <span>
                            违规图片：{{FailedPicturesTotal}}
                        </span>
                        <span>
                            合格图片：{{PicturesTotal}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="picTable">
                <el-form
                    inline ref="middle"
                    v-loading.body="gridParam.gridLoading"
                    element-loading-text="正在加载中">
                    <el-form-item
                        v-for="(item,index) of gridParam.gridList"
                        :key="index"
                        :style="{width: (640*3/5-2)+'px',height: (360*3/5+42)+'px'}" >
                        <div :style="{position: 'relative',height: (360*3/5)+'px'}">
                            <img
                                :src="item.OriginalPicture"
                                alt=""
                                style="width: 100%;height: 100%;"
                                @click.stop="change(index)"
                                @dblclick="dbcheck(item,index)">
                            <template v-if="!!item.wrongItem" >
                                <span
                                    style="position:absolute;border:1px solid red"
                                    v-for="(items,idx) of item.wrongItem"
                                    :key="idx"
                                    :style="{
                                        top:((items.Top/items.InitHeight*100).toFixed(2))+'%',
                                        left:((items.Left/items.InitWidth*100).toFixed(2))+'%',
                                        width: (items.Width/items.InitWidth*100).toFixed(2)+'%',
                                        height: (items.Height/items.InitHeight*100).toFixed(2)+'%'}">
                                    </span>
                            </template>

                            <el-checkbox
                                style="position: absolute;right: 0;top: -9px;"
                                @change.native="change(index, 'checkbox')"
                                v-if="AuditStatus == 1"
                                v-model="item.checked">
                            </el-checkbox>
                        </div>
                        <div class="info-box">
                            <div>
                                <el-tag style="margin-right: 10px;float: left;" v-if="!item.IsAudit">合格</el-tag>
                                <el-tag style="margin-right: 10px;float: left;" type="danger" v-if="item.IsAudit">违规</el-tag>
                                <el-tag class="textInfo" type="info" v-if="item.AttrTxt != ''">{{item.AttrTxt}}</el-tag>
                            </div>
                            <el-tag v-if="item.AuditStatus == 1">未审核</el-tag>
                            <el-tag  type="success"  v-if="item.AuditStatus == 2">{{item.AuditUserName}}</el-tag>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <pagination
                v-show="pages.total>0"
                :total="pages.total"
                :page.sync="pages.page"
                :pageSizes="pages.pageSizes"
                :limit.sync="pages.limit"
                @pagination="pageChange"/>
        </div>
        <ReviewImage
            :ShowReviewImage="reviewImage.show"
            :ReviewImageData="reviewImage.data"
            @CloseReviewImage="CloseReviewImage">
        </ReviewImage>
    </div>
</template>

<script src='@/views/AIFormSelfCheckImage/AIFormSelfCheckImage.js'>
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
    }
    .flexContainer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
        padding: 10px;
        .sum-info-box{
            display: flex;
            height: 36px;
            line-height: 36px;
            border:1px dashed #CCC;
            margin: 15px 0;
            padding: 0 15px;
            span{
                width:25%;
                font-size: 14px;
            }

        }
        .slide-btn{
            vertical-align: top;
            font-size: 17px;
            padding:4px 4px 6px 4px;
        }
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
            .info-box{
                position: absolute;
                display: flex;
                justify-content: space-between;
                width: 100%;
                line-height: 25px;
                margin: 10px 0 0 0;
                .textInfo{
                    margin-right: 10px;
                    float: left;
                    max-width: 120px;
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
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
