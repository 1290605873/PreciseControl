<template>
  <div class="ai-service-auth">
    <el-form inline size="middle">
      <el-form-item>
        <el-input v-model="formData.name" placeholder="部门名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formData.time" placeholder="服务有效期" clearable>
          <el-option
            v-for="(i,j) in serviceTimeList"
            :key="j"
            :label="i.label"
            :value="i.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="SearchAuth">
          查询
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="AddAuth">
          AI服务授权
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="tableData.loading"
      :data="tableData.DataList"
      :height="tableData.height"
      border
      fit>
      <el-table-column
        type="index"
        label="序号"
        width="60px">
      </el-table-column>
      <el-table-column
        label="部门名称"
        prop="DeptName"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="总服务门店数"
        prop="TotalStoreNum"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="服务有效期"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.ValidityDate|dateFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="服务区域"
        prop="AreaName"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="服务业态"
        prop="OperateTypeName"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="指定服务门店"
        prop="StoreNum"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="SetAuth(scope.row.Id)">
            设置
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="DeleteAuth(scope.row.Id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="pages.total>0"
      :total="pages.total"
      :page.sync="pages.page"
      :pageSizes="pages.pageSizes"
      :limit.sync="pages.limit"
      @pagination="pageChange">
    </Pagination>
    <EditServiceAuth
      :EditServiceAuthShow="editServiceAuth.show"
      :EditServiceAuthData="editServiceAuth.data"
      @CloseEditServiceAuth="CloseEditServiceAuth">
    </EditServiceAuth>
  </div>
</template>

<script src="./AIServiceAuth.js"></script>

<style lang="css" scoped>
.ai-service-auth{
  padding: 15px
}
</style>
<style lang="css">
 .el-tooltip__popper{max-width: 80%}
</style>
