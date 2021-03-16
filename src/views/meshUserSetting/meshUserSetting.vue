<template>
  <div class="main-container meshUserSetting">
    <!-- |搜索表单开始| -->
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="userPhone"
          placeholder="请输入账号"
          class="com-width">
        </el-input>
      </el-form-item>
      <el-form-item >
        <el-input
          v-model="userName"
          placeholder="请输入姓名"
          class="com-width">
        </el-input>
      </el-form-item>
      <el-form-item >
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
      <el-form-item >
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
      <el-form-item >
        <el-select
          clearable class="com-width"
          placeholder="请选择标签"
          :filterable="tagTabs.datas.length > 7"
          v-model="tagTabs.id">
          <el-option
            v-for="(item,ix)  in tagTabs.datas"
            :key="item.id"
            :index="ix"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
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
          style="margin-left: 10px"
          @click="Search">
          查询
        </el-button>
        <!-- <el-button
          type="primary"
          style="margin-left: 10px"
          @click="SearchAll">
          查询全部
        </el-button> -->
      </el-form-item>
    </el-form>
    <!-- |搜索表单结束| -->

    <!-- |主体展示开始| -->
    <el-container style="margin-top: 10px;">
      <el-aside width="200px" class="left">
        <el-scrollbar style="height: 100%">
          <GridTreeAreaChoose
            @getLoadNode="getLoadNode"
            @getCurrentNode="getCurrentNode">
          </GridTreeAreaChoose>
        </el-scrollbar>
      </el-aside>
      <el-main class="right">
        <div class="tableheaderbac">
          <el-button type="primary" plain @click="openAdduser">添加</el-button>
          <el-button type="primary" plain @click="openBatchSetting(null)">批量添加</el-button>
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
          style="width: 100%;"
          @select="getSelectChange"
          @select-all="getSelectChange">
          <el-table-column type="index" width="40"></el-table-column>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :label="tableGrid.column.userName" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.UserName"></span>
            </template>
          </el-table-column>
          <el-table-column :label="tableGrid.column.UserPhone" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.UserPhone"></span>
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
                @click="openBatchSetting(scope.row.UserId,scope.row)">
                查看
              </el-button>
              <el-button
                size="mini"
                type="success"
                v-else
                @click="openBatchSetting(scope.row.UserId,scope.row)">
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
          v-show="pageNation.total>0"
          :total="pageNation.total"
          :page.sync="pageNation.pageNum"
          :limit.sync="pageNation.countPerPage"
          @pagination="onPageNation"></pagination>
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
      <div class="max-Dialog">
        <set-user
          ref="user"
          :defaultCheckuserId="defaultCheckuserId"
          @checkUserData="checkUserData"></set-user>
      </div>
    </el-dialog>
    <!-- |添加人员弹层结束| -->
    <!-- |设置业态弹层开始| -->
    <BatchSetting
      :ShowBatchSetting="batchSetting.show"
      :BatchSettingTopTab="batchSetting.topTab"
      :BatchSettingTaskTab="batchSetting.taskTab"
      :BatchSettingData="batchSetting.data"
      :BatchSettingBaseNode="batchSetting.baseNode"
      @CloseBatchSetting="CloseBatchSetting">
    </BatchSetting>
    <!-- |设置业态弹层结束| -->
  </div>
</template>
<script src="./meshUserSetting.js"></script>
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
    .max-Dialog{
      height: calc(90vh - 92px);
      overflow: auto;
    }
    .el-dialog__wrapper /deep/ .el-dialog{
      margin-bottom: 0
    }
</style>
<style lang="scss" type="text/scss">
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
