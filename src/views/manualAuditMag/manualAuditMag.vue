<template>
  <div class="container">

    <div class="pageBox">
      <div class="">
        <el-form :inline="true" class="demo-form-inline">
          <regionalism :showAll="true" @regionalismResult='regionalismResult' @initRegion='initRegion'></regionalism>
          <el-form-item label>
            <el-input clearable placeholder="业态" v-model="form.formatName"  @focus="upInfoFocus($event)"
              @input="upInfoIpt($event)" @clear="clearFormat" class="com-width"></el-input>
          </el-form-item>
          <el-form-item label>
            <el-input clearable placeholder="门店名称" v-model="form.storeName" class="com-width"></el-input>
          </el-form-item>
          <el-form-item label>
            <el-input clearable placeholder="许可证号" v-model="form.licenceCode" class="com-width"></el-input>
          </el-form-item>
          <el-form-item label>
            <el-button type="primary" @click="search"  class="">查询</el-button>
          </el-form-item>
          
        </el-form>

        <div>
          <el-button type="primary" @click="batchCheck(true, 1, '批量AI审核自查')"  class="" plain>批量AI审核自查</el-button>
          <el-button type="primary" @click="batchCheck(true, 2, '批量AI审核整改')" style="margin-left: 10px" class="" plain>批量AI审核整改</el-button>
          <el-button type="primary" @click="batchCheck(true, 3, '批量人工审核自查')" style="margin-left: 10px" class="" plain>批量人工审核自查</el-button>
          <el-button type="primary" @click="batchCheck(true, 4, '批量人工审核整改')" style="margin-left: 10px" class="" plain>批量人工审核整改</el-button>
        </div>
      </div>

      <el-table :data="tableData" stripe border v-loading="tableLoading" ref="table">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="StoreName" show-overflow-tooltip label="门店名称" ></el-table-column>
        <el-table-column prop="OperName" show-overflow-tooltip label="业态"></el-table-column>
        <el-table-column prop="OperName" show-overflow-tooltip label="所属馆"></el-table-column>
        <el-table-column prop="LicenceCode" show-overflow-tooltip label="许可证号"></el-table-column>
        
        <el-table-column label="AI审核自查" width="120">
          <template slot-scope="scope">
            <el-switch @change="batchCheck($event, 1, scope.row)" v-model="scope.row.ComInspectAiAudit" ></el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="AI审核整改" width="120">
          <template slot-scope="scope">
            <el-switch @change="batchCheck($event, 2, scope.row)" v-model="scope.row.ReformAiAudit" ></el-switch>
          </template>
        </el-table-column>
        <el-table-column   label="人工审核自查" width="120">
          <template slot-scope="scope">
            <el-switch @change="batchCheck($event, 3, scope.row)" v-model="scope.row.ComInspectHumanAudit"></el-switch>
          </template>
        </el-table-column>
        <el-table-column   label="人工审核整改" width="120">
          <template slot-scope="scope">
            <el-switch @change="batchCheck($event, 4, scope.row)" v-model="scope.row.ReformHumanAudit"></el-switch>
          </template>
        </el-table-column>

      </el-table>

      <div class="paginationBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[50, 100, 200, 500]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalLen"
        ></el-pagination>
      </div>

    </div>
    <!-- 业态 -->
    <el-dialog title="业态" top="5vh" :visible.sync="reportInfoDialog" width="400px">
      <div class="reportBox">
        <el-tree :data="reportData" show-checkbox node-key="Id" ref="repTree"
         :props="defaultProps" ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reportInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="reportInfoConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script src="./manualAuditMag.js"></script>

<style lang="scss" scoped >
.container {
  width: 100%;
  height: 100%;
  @include box(box);
  @include box-orient(vertical);
  padding-top: 10px;
  padding: 15px;
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
  .pageBox {
    display: flex;
    flex-direction: column;
    height: 100%;
    .el-table {
      flex: 1;
      margin-top: 10px;
    }
    /deep/ .el-table__body-wrapper {
      height: calc(100% - 50px);
      overflow-y: scroll;
    }
  }
  .paginationBox {
    margin: 10px;
  }
  .reportBox {
    height: 60vh;
    overflow-y: scroll;
  }
}
</style>
