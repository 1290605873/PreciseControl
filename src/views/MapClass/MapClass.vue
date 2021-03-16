<template>
    <div class="mapClass main-container">
                <el-button
                        type="primary"
                        @click="addOrEdit(1)">
                    添加
                </el-button>
            <el-table
                    highlight-current-row
                    border
                    v-loading="loading"
                    :data="tableList"
                    style="width:100%"
                    class="mapClassTable">
                <el-table-column
                        type="index"
                        label="序号"
                        width="50">
                </el-table-column>
                <el-table-column
                        property="Name"
                        label="分类名称"
                        min-width="150px"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        property="Remark"
                        label="分类定义"
                        min-width="150px"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        property="Id"
                        label="地图分类ID"
                        min-width="200px"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        label="地图"
                        min-width="250px"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span
                                v-for="(item,index) in scope.row.MapNames">
                            {{item.Name}}<span v-if="index!=scope.row.MapNames.length-1">,</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        min-width="350px"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                size="small" plain
                                @click="addOrEdit(2,scope.row.Name,scope.row.Id,scope.row.Remark,scope.row.IsEnable,scope.row.SubId,scope.row.MapNames)">
                            编辑
                        </el-button>
                        <el-button
                                type="primary"
                                size="small" plain
                                @click="specialConfig(scope.row.Id)">
                            特殊事件配置
                        </el-button>
                        <el-button
                                type="primary"
                                size="small" plain
                                @click="DeleteMapCategory(scope.row.Id)">
                            删除
                        </el-button>
                        <el-button
                                type="primary"
                                size="small" plain
                                @click="changeIsEnable(scope.row.Name,scope.row.Id,scope.row.Remark,scope.row.IsEnable,scope.row.SubId)">
                            {{scope.row.text}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination
                v-show="total>0"
                :total="total"
                :page.sync="pageNo"
                :limit.sync="pageSize"
                @pagination="Pagination">
            </Pagination>
        <!-- 新增编辑弹框 -->
        <el-dialog
                :title="title"
                :visible.sync="addEditDialog.show"
                :modal="true"
                :append-to-body="true"
                class="addEditDialog"
                @close="closeIcon('map')"
        >
            <div class="maxDialog">
                <el-form
                        ref="map"
                        :rules="rules"
                        label-width="80px"
                        :model="map">
                    <el-form-item
                            label="分类名称"
                            prop="className">
                        <el-input
                                type="text"
                                v-model.trim="map.className"
                                placeholder="请输入分类名称"
                                clearable
                                maxlength="30"
                                show-word-limit>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                            label="分类定义">
                        <el-input
                                type="text"
                                v-model.trim="map.classDefinition"
                                placeholder="请输入分类定义(限50个字)"
                                clearable
                                maxlength="50"
                                show-word-limit>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                            label="选择地图"
                            prop="checkedMap"
                            placeholder="请选择地图">
                        <el-card
                                class="box-card"
                                shadow="hover">
                            <div
                                    slot="header"
                                    class="clearfix">
                                <span>
                                    <el-checkbox
                                            :indeterminate="map.isIndeterminate"
                                            v-model="map.chooseMapAll"
                                            @change="handleCheckAllMap">
                                        全部
                                    </el-checkbox>
                                </span>
                                <el-button
                                        style="float: right;"
                                        type="text">
                                    {{map.checkedMap.length}}/{{map.mapOptions.length}}
                                </el-button>
                            </div>
                            <el-checkbox-group
                                    v-model="map.checkedMap"
                                    @change="handleCheckedMapChange">
                                <div
                                        ref="divDom"
                                        v-for="(item,index) in map.mapOptions"
                                        :key="index"
                                        @mouseover="hoverMap(item,index)"
                                        @mouseleave="leaveMap(item,index)">
                                    <el-checkbox
                                            :label="item.Id"
                                            :key="index">
                                        {{item.Name}}
                                    </el-checkbox>
                                    <span
                                            :class="{'def':item.def}"
                                            @click="setDefMap(item)">
                                    设为默认
                                </span>
                                    <span :class="{'setdef':item.setdef}">默认地图</span>
                                </div>

                            </el-checkbox-group>
                        </el-card>
                    </el-form-item>
                    <div style="width: 100%;text-align: center;margin-top: 10px;">
                        <el-button @click="closeAddEditDialog('map')">取消</el-button>
                        <el-button
                                type="primary"
                                style="margin-right: 20px;"
                                @click="saveDialog('map',title)">
                            保存
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <!-- 新增编辑弹框 -->
        <!-- 特殊事件配置弹框 -->
        <el-dialog
                title="特殊事件配置"
                :visible.sync="specialConfigDialog.show"
                :modal="true"
                :append-to-body="true"
                class="specialConfigDialog"
                @close="closeSpecialDia('specialForm')">
            <el-form
                    ref="specialForm"
                    :model="specialForm"
                    label-width="80px"
                    >
                <el-form-item
                        label="事件名称"
                        placeholder="请选择事件"
                        >
                    <el-card
                            class="box-card
                            el-card-event
                            special-card"
                            shadow="hover">
                        <div
                                slot="header"
                                class="clearfix">
                            <span>
                                <el-checkbox
                                        :indeterminate="specialForm.isIndeterminate"
                                        v-model="specialForm.checkAll"
                                        @change="handleCheckAllChange">
                                    全部事件
                                </el-checkbox>
                            </span>
                            <el-button
                                    style="float: right;"
                                    type="text">
                                {{specialForm.checkedCities.length}}/{{specialForm.cityOptions.length}}
                            </el-button>
                        </div>
                        <el-checkbox-group
                                v-model="specialForm.checkedCities"
                                @change="handleCheckedCitiesChange">
							<div
							        ref="divDomTwo"
							        v-for="(item,index) in specialForm.cityOptions"
                                    :key="index"
							        @mouseover="hoverMapClass(item,index)"
							        @mouseleave="leaveMapClass(item,index)">
							    <el-checkbox
							            :label="item.Id" :key="index">
							        {{item.Name}}
							    </el-checkbox>
							    <span
							            :class="{'def':item.def}"
							            @click="setDefMapClass(item)">
							    设为默认
							</span>
							    <span :class="{'setdef':item.IsDefault}" @click="setDefMapClassTwo(item)">默认地图</span>
							</div>
                            <!-- <el-checkbox
                                    v-for="(city,index) in specialForm.cityOptions"
									@mouseover="hoverMapClass(item,index)"
                                    :label="city.Id" :key="index">
                                {{city.Name}}
                            </el-checkbox> -->
                        </el-checkbox-group>
                    </el-card>
                </el-form-item>
            </el-form>
            <div style="width: 100%;text-align: center;margin-top: 10px;">
                <el-button
                        @click="resetForm('specialForm')">
                    取消
                </el-button>
                <el-button
                        type="primary"
                        style="margin-right: 20px;"
                        @click="saveSpecialEvent('specialForm')">
                    保存
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script src="@/views/MapClass/MapClass.js"></script>
<style lang="scss" type="text/scss" scoped>
    .mapClass {
		padding: 0;
        .highLight {
            background: #e6e6e6;
        }

        .el-card__header {
            padding: 0 20px !important;
            background: #EBEEF5;

            span {
                label {
                    display: inline-block;
                    margin-left: 0;
                }
            }
        }

        .el-checkbox-group {
            label {
                display: block;
                margin-left: 30px;
            }
        }

        .el-card__body {
            padding: 20px 0;
        }

        .el-button--text {
            padding: 12px 0;
            color: #000000;
        }

        .el-checkbox-group label {
            display: inline-block !important;
        }

        .el-card-event {
            .el-checkbox-group label {
                display: block !important;
            }
        }

        .cell el-tooltip {
            span {
                display: inline-block !important;
                margin-right: 10px !important;
            }
        }

        .mapClassTable {
            margin-top:12px;
            height: calc(100vh - 229px) !important;
            overflow: auto;
        }

    }
</style>

<style>
    .addEditDialog .el-card__header {
        padding: 0 20px !important;
        background: #EBEEF5;
    }

    .specialConfigDialog .el-card__header {
        padding: 0 20px !important;
        background: #EBEEF5;
    }

    .el-checkbox-group span.def {
        position: absolute;
        cursor: pointer;
        z-index: 10000;
        right: 10px;
        display: inline-block;
        color: #cccccc;
        font-size: 16px;
        width: 20%;
        height: 30px;
    }

    .el-checkbox-group span.setdef {
        position: absolute;
        cursor: pointer;
        z-index: 10000;
        right: 10px;
        display: inline-block;
        color: orange;
        font-size: 16px;
        width: 20%;
        height: 30px;
    }

    .special-card .el-checkbox-group label {
        /* display: block !important; */
    }

    .special-card .el-checkbox + .el-checkbox {
        margin-left: 0;
    }
</style>