<template>
  <div class="main-container meshUserSetting">
    <!-- |搜索表单开始| -->
    <el-form :inline="true">
      <el-form-item label-width="80px">
        <el-input
          v-model="userName"
          placeholder="请输入姓名"
          class="com-width"></el-input>
      </el-form-item>
      <el-form-item label-width="80px">
        <el-select
          clearable class="com-width"
          v-model="roles.code"
          placeholder="请选择角色"
          :filterable="roles.list.length > 7">
          <el-option
            v-for="roleItem in roles.list"
            :key="roleItem.Id"
            :label="roleItem.Name"
            :value="roleItem.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px">
        <el-select
          clearable class="com-width"
          placeholder="请选择业态"
          :filterable="topTabs.datas.length > 7"
          v-model="topTabs.code">
          <el-option
            v-for="(opItem,ix)  in topTabs.datas"
            :key="opItem.Id"
            :index="ix"
            :label="opItem.Name"
            :value="opItem.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px">
        <el-select
          clearable class="com-width"
          placeholder="请选择业务"
          :filterable="taskTabs.datas.length > 7"
          v-model="taskTabs.code">
          <el-option
            v-for="(opItem_ ,idx) in taskTabs.datas"
            :key="idx+10000000"
            :label="opItem_.Text"
            :value="opItem_.Id">
          </el-option>
        </el-select>
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="Search">
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <!-- |搜索表单结束| -->

    <!-- |主体展示开始| -->
    <el-container style="margin-top: 10px;">
      <el-aside width="200px" class="left">
        <el-scrollbar style="height: 100%">
          <TreeAreaChoose
            @getLoadNode="getLoadNode"
            @getCurrentNode="getCurrentNode"></TreeAreaChoose>
        </el-scrollbar>
      </el-aside>
      <el-main class="right">
        <div class="tableheaderbac">
          <el-button type="primary" plain @click="openAdduser">添加</el-button>
          <el-button type="primary" plain @click="batchSetting(null)">批量设置</el-button>
          <el-button type="primary" plain @click="batchDelUserInGrid">批量删除</el-button>
        </div>
        <el-table
          v-loading="tableGrid.Loading"
          highlight-current-row
          :data="tableGrid.datas"
          border
          :height="150"
          fit
          ref="meshgrid"
          style="width: 100%;">
          <el-table-column type="index" width="40"></el-table-column>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :label="tableGrid.column.userName" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.UserName"></span>
            </template>
          </el-table-column>
          <el-table-column :label="tableGrid.column.community" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.CommunityName"></span>
            </template>
          </el-table-column>
          <el-table-column :label="tableGrid.column.role" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.RoleName"></span>
            </template>
          </el-table-column>
          <el-table-column :label="tableGrid.column.yetai">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                v-if="scope.row.OperateInfo.length>0"
                @click="batchSetting(scope.row.UserId,scope.row.OperateInfo)">
                查看
              </el-button>
              <el-button
                size="mini"
                type="success"
                v-else
                @click="batchSetting(scope.row.UserId,scope.row.OperateInfo)">
                设置
              </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="tableGrid.column.oper" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="delGridItem(scope.row.UserRealId)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          ref="pagination"
          v-show="pageNation.total"
          :total="pageNation.total"
          :page.sync="pageNation.pageNum"
          :limit.sync="pageNation.countPerPage"
          @pagination="onPageNation">
        </pagination>
      </el-main>
    </el-container>
    <!-- |主体展示结束| -->

    <!-- |添加人员弹层开始| -->
    <el-dialog
      append-to-body
      :title="addUserDialog.title"
      :visible.sync="addUserDialog.show"
      width="960px"
      top="5vh"
      :before-close="closeUserDialog">
      <div class="maxDialog">
        <set-user
          ref="user"
          :defaultCheckuserId="defaultCheckuserId"
          @checkUserData="checkUserData"></set-user>
      </div>
    </el-dialog>
    <!-- |添加人员弹层结束| -->
    <!-- |设置业态弹层开始| -->
    <el-dialog
      append-to-body
      title="设置业态/业务"
      :visible.sync="battchsetting.show"
      width="60%"
      top="10vh"
      class="batchSetting"
      :close-on-click-modal="false">
      <div class="maxDialog">
        <div>
          <label class="searhCluseLabel">业态类型</label>
          <el-select
            clearable
            class="select-item"
            placeholder="请选择"
            v-model="battchsetting.defaultOperId"
            :filterable="topTabs.datas.length > 7">
              <el-option v-for="(op_Item,j)  in topTabs.datas"
                         :key="j+op_Item.Id"
                         :label="op_Item.Name"
                         :value="op_Item.Id">
              </el-option>
          </el-select>
          <label class="searhCluseLabel">业务类型</label>
          <el-select
            clearable class="select-item"
            placeholder="可多选"
            v-model="battchsetting.defaultTaskId"
            multiple
            :filterable="taskTabs.datas.length > 7">
            <el-option
              v-for="(opItem_ ,k) in taskTabs.datas"
              :key="k+opItem_.Id"
              :label="opItem_.Text"
              :value="opItem_.Id"></el-option>
          </el-select>
          <span class="addPic" @click="addMoreSetting"></span>
        </div>
        <div
          v-for="(it , inxx) in battchsetting.moreDatas"
          :key="inxx"
          style="margin-top: 10px">
          <label class="searhCluseLabel">业态类型</label>
          <el-select
            clearable
            class="select-item"
            placeholder="请选择"
            v-model="it.OperateTypeId"
            :filterable="topTabs.datas.length > 7">
            <el-option
              v-for="(opItem,n)  in topTabs.datas"
              :key="n"
              :label="opItem.Name"
              :value="opItem.Id"></el-option>
          </el-select>
          <label class="searhCluseLabel">业务类型</label>
          <el-select
            clearable
            class="select-item"
            placeholder="可多选"
            v-model="it.BusinessInfo"
            multiple
            :filterable="taskTabs.datas.length > 7">
              <el-option v-for="(op,mm)  in taskTabs.datas"
                         :label="op.Text"
                         :key="mm"
                         :value="op.Id">
              </el-option>
          </el-select>
          <span class="delPic" @click="delMoreSetting(inxx)"></span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="battchsetting.show = false">取消</el-button>
        <el-button type="primary" @click="setOperTask">确定</el-button>
      </span>
    </el-dialog>
    <!-- |设置业态弹层结束| -->
  </div>
</template>
<script src="./meshUserSettingAll.js"></script>
<style type="text/scss" lang="scss" scoped>
    .meshUserSetting {
        height: 100%;
        padding-top: 20px;
        .searchInput {
            width: 180px
        }
        .left {
            height: calc(100vh - 106px);
            position: relative;
            overflow: hidden;
        }
        .right {
            width: 100%;
            height: calc(100vh - 100px);
            @include box(box);
            @include box-orient(vertical);
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
            background: #f2f2f2;
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

        .check-lable {
            text-align: right;
            vertical-align: middle;
            font-size: 14px;
            color: #606266;
            line-height: 34px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            width: 82px;
            display: inline-block;
        }
        .addCheckItemDialogInput {
            width: 180px;
            margin-left: 10px;
        }
        .searhCluseLabel {
            text-align: right;
            vertical-align: middle;
            font-size: 14px;
            color: #606266;
            line-height: 34px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            width: 60px;
            display: inline-block;
        }

        .userNameInput {
            width: 130px;
        }
        .addCheckItemDialogLabel {
            text-align: right;
            vertical-align: middle;
            font-size: 14px;
            color: #606266;
            line-height: 34px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            width: 110px;
            display: inline-block;
        }
        .el-main {
            padding: 0 20px
        }
        .mbottm20 {
            margin-bottom: 20px;
        }


    }
    .maxDialog{
      height: calc(90vh - 72px);
    }
    .el-dialog__wrapper /deep/ .el-dialog{
      margin-bottom: 0
    }
</style>
<style lang="scss" type="text/scss">
    .batchSetting {
        .searhCluseLabel {
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
            color: #606266;
            line-height: 34px;
            box-sizing: border-box;
            width: 110px;
            display: inline-block;
        }
        .select-item {
            width: 150px;
            height: 34px;
            padding-right: 10px;
        }
        .addPic {
            width: 25px;
            height: 25px;
            background: url("../../assets/images/add_icon.png");
            background-repeat: no-repeat;
            background-size: contain;
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
        }
        .delPic {
            width: 25px;
            height: 25px;
            background: url("../../assets/images/delete_icon.png");
            background-repeat: no-repeat;
            background-size: contain;
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
        }
        .uparrow {
            width: 25px;
            height: 25px;
            background: url("../../assets/images/uparrow.png");
            background-repeat: no-repeat;
            background-size: contain;
            display: inline-block;
            margin-left: 10px;
            margin-top: 4px;
            vertical-align: middle;
        }
        .downarrow {
            width: 25px;
            height: 25px;
            background: url("../../assets/images/downarrow.png");
            background-repeat: no-repeat;
            background-size: contain;
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
        }
        .el-tag--info i {
            display: none;
        }
        .el-select__tags {
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
        }
    }

    .meshUserSetting {
        .select-item {
            width: 150px;
            height: 34px;
            padding-right: 10px;
        }
        .el-aside {
            text-align: center;
            background: rgb(236, 245, 255);
        }
        .treeBac {
            background: rgb(236, 245, 255);
            .ellipsis {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        .el-table thead {
            color: #666666;
        }

        .is-current > div:first-child {
            background-color: rgb(121, 187, 255);
            color: white;
        }
        .el-tree-node__content {
            font-size: 14px;
            color: #909399;
        }
        .el-tree-node__content:hover {
            background-color: rgb(121, 187, 255);
            opacity: 0.7;
            color: white;
        }
        .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
            background-color: rgb(121, 187, 255);
        }
    }


</style>
