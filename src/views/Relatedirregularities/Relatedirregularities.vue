<template>
    <div class="Relatedirregularities main-container">
        <el-tabs
         style="height:100%"
         type="border-card"
         ref="topTabs"
         id="topTabs"
         @tab-click="topTabsClick"
         v-model.trim="topTabs.code">
            <el-tab-pane
             v-for="tabitem in topTabs.datas"
             :key="tabitem.Id"
             :label="tabitem.Name"
             :name="tabitem.Id"></el-tab-pane>
             <div class="table right">
                <div class="addbutton" style="margin-bottom: 10px;">
                    <el-button type="primary" plain @click="add()">添加</el-button>
                </div>
                <el-table
                        highlight-current-row
                        v-loading="tableGrid.Loading"
                        :data="tableGrid.datas"
                        border
                        :height="150"
                        ref="checkitemtable"
                        fit
                        style="width: 100%;">
                    <el-table-column
                      property="ViolationOptionName"
                      label="违规项"
                      show-overflow-tooltip
                      min-width="150">
                    </el-table-column>
                    <el-table-column
                      property="InspectOptionName"
                      label="检查项"
                      show-overflow-tooltip
                      min-width="150">
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      show-overflow-tooltip
                      min-width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="DelEByIds(scope.$index)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination ref="pagination" v-show="pageNation.total"
                            :total="pageNation.total"
                            :page.sync="pageNation.pageNum"
                            :limit.sync="pageNation.countPerPage"
                            @pagination="onPageNation">
                </pagination>
             </div>
             <el-dialog
              :title="title"
              :visible.sync="gridParam.isviewAdd"
              :close-on-click-modal="false"
              width="400px">
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 100px;text-align: right;margin-right: 5px;">违规项:</p>
                    <el-select
                      v-model="gridParam.EditingConditions"
                      placeholder="请选择"
                      @change="choseEditingList($event)"
                      style="line-height: 44px;margin-right: 20px;"
                      :filterable="gridParam.EditingList.length > 7">
                        <el-option
                          v-for="item in gridParam.EditingList"
                          :key="item.ViolationOptionCode"
                          :label="item.ViolationOptionName"
                          :value="item.ViolationOptionCode">
                        </el-option>
                    </el-select>
                </div>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 100px;text-align: right;margin-right: 5px;">检查项分类:</p>
                    <el-select
                      v-model="classify.code"
                      placeholder="请选择"
                      @change="choseclassify($event)"
                      style="line-height: 44px;margin-right: 20px;"
                      :filterable="classify.datas.length >7">
                        <el-option
                          v-for="item in classify.datas"
                          :key="item.Id"
                          :label="item.Text"
                          :value="item.Id">
                        </el-option>
                    </el-select>
                </div>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 100px;text-align: right;margin-right: 5px;">检查项:</p>
                    <el-select
                      v-model="Checkpoints.code"
                      placeholder="请选择"
                      @change="choseCheckpoints($event)"
                      style="line-height: 44px;margin-right: 20px;"
                      :filterable="Checkpoints.datas.length > 7">
                        <el-option
                          v-for="item in Checkpoints.datas"
                          :key="item.Id"
                          :label="item.Text"
                          :value="item.Id">
                        </el-option>
                    </el-select>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="gridParam.isviewAdd = false">取消</el-button>
                    <el-button type="primary" @click="Preservation">确定</el-button>
                </span>
             </el-dialog>
        </el-tabs>
    </div>
</template>

<script src="@/views/Relatedirregularities/Relatedirregularities.js">
</script>

<style type="text/scss" lang="scss" scoped>
    .Relatedirregularities{
        padding: 0;
        height: 100%;
        .right {
            width: 100%;
            height: calc(100vh - 70px);
            @include box(box);
            @include box-orient(vertical);
            // padding: 0 20px;

            .main-table {
                height: 300px;
            }
        }
    }
</style>
