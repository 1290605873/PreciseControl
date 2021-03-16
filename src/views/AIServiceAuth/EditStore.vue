<template lang="html">
  <el-dialog
    :title="title"
    width="80%"
    top="5vh"
    :close-on-click-modal="false"
    :visible.sync="showEditStore"
    :destroy-on-close="true"
    @close="Cancel">
    <el-form inline>
      <regionalism
        :showAll="showAll"
        v-on:regionalismResult='regionalismResult'
        v-on:initRegion='initRegion'>
      </regionalism>
      <el-form-item>
        <el-select
          placeholder="请选择一级业态"
          v-model="param.StoreTypeId"
          clearable
          @change="changeStoreType">
            <el-option
              v-for="item in StoreTypeList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          placeholder="请选择二级业态"
          v-model="param.StoreSecTypeId"
          clearable>
            <el-option
              v-for="item in StoreSecTypeList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入单位名称"
          v-model="param.UnitName"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入许可证号"
          v-model="param.LicenseKey"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="searchStore(false)">
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="loading"
      height="50vh"
      border
      fit
      ref="table"
      row-key="Id"
      highlight-current-row
      @selection-change="selectStore">
      <el-table-column type="index" label="序号" width="70px">
      </el-table-column>
      <el-table-column type="selection" reserve-selection>
      </el-table-column>
      <el-table-column prop="StoreName" label="单位名称">
      </el-table-column>
      <el-table-column label="许可证" prop="License">
      </el-table-column>
      <el-table-column label="业态" prop="StoreTypeSecond">
      </el-table-column>
      <el-table-column label="门店地址" prop="StoreAddress">
      </el-table-column>
    </el-table>
    <Pagination
      class="pagination"
      :total="total"
      :page="param.PageNo"
      :limit="param.PageSize"
      @pagination="paginationChange">
    </Pagination>
    <div style="text-align: center;" slot="footer">
      <el-button type="primary" size="mini" @click="Cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="Ensure">确定</el-button>
      <!-- <el-button type="primary" size="mini" @click="searchStore(true)">选择所有门店</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import Regionalism from '@/components/Regionalism.vue'
import Pagination from '../../components/Pagination'
export default {
  name: 'EditStore',
  components: {
    Regionalism,
    Pagination
  },
  props: {
    EditStoreShow: {
      type: Boolean,
      required: true
    },
    EditStoreData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showEditStore: false,
      showAll: false,
      title:'选择门店',
      appId:'00000000-0000-0000-0000-000000000000',
      tableData: [],
      // 分页组件数据
      total: 0,
      param: {
        AreaCodes: [],
        StoreTypeId: null,//一级
        UnitName: '',
        StoreStatus: null,//营业状态
        LicenseKey: '',
        SelfNumMore: 0,
        PatrolNumMore: 0,
        PageNo: 1,
        PageSize: 20,
        StoreSecTypeId: null,//二级经营业态
        //OrgIdIsItEmpty: 1//写死
      },
      StoreTypeList: [], // 一级业态列表
      StoreSecTypeList: [], // 二级业态列表
      loading: false,
      area: '',
      selectStoreArr: [],//选中的门店
      isOperate:false
    }
  },
  watch: {
    EditStoreShow(v) {
      if(v) {
        this.showEditStore = true
        this.init()
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.param = {
        AreaCodes: [],
        StoreTypeId: null,//一级
        UnitName: '',
        StoreStatus: null,//营业状态
        LicenseKey: '',
        SelfNumMore: 0,
        PatrolNumMore: 0,
        PageNo: 1,
        PageSize: 20,
        StoreSecTypeId: null,//二级经营业态
      }
      this.appId = this.EditStoreData.appId
      this.isOperate = false
      this.GetOperateInfo(1)
      // this.getStoreList(false)
    },
    // 取消
    Cancel() {
      this.showEditStore = false
      this.$emit('CloseEditStore', [false,[]])
    },
    // 确认
    Ensure() {
      this.showEditStore = false
      if(!this.isOperate){
        this.selectStoreArr = []
      }
      this.$emit('CloseEditStore', [true,this.selectStoreArr])
    },
    // 获取一级业态
    GetOperateInfo(k){
      this.$api.GetOperateInfo(k).then(res => {
        if(res){
          this.StoreTypeList = res
        }
      }).catch(()=>{})
    },
    // 一级业态改变
    changeStoreType(val) {
      this.param.StoreSecTypeId = ''
      if (val == '') {
        this.StoreSecTypeList = []
        return
      }
      this.GetOperateSubInfo()
    },
    //获取二级经营业态
    GetOperateSubInfo() {
      let data = {
        OperateTypeId: this.param.StoreTypeId,
        AppId: this.appId
      }
      this.$api.GetOperateSubInfo(data).then(res => {
          this.StoreSecTypeList = res
      }).catch(error => {})
    },
    // 获取门店列表
    getStoreList(all) {
      this.loading = true;
      if (all) {
        this.param.PageSize = 200000;
      }
      this.$api.ChoseStore(this.param).then(res => {
        this.loading = false
        if (res && res.Content) {
          this.total = res.Data
          this.tableData = res.Content
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 写入区域信息
    regionalismResult(obj) {
      let dataInfo = [
          {
              AreaType: 1,
              AreaCode: obj.provience.code.substr(2, obj.provience.code.length)
          },
          {
              AreaType: 2,
              AreaCode: obj.city.code.substr(2, obj.provience.code.length)
          }
      ];
      if (obj.town.code != '') {
          let town = {
              AreaType: 3,
              AreaCode: obj.town.code.substr(2, obj.provience.code.length)
          };
          dataInfo.push(town);
      }
      if (obj.street.code != '') {
          let street = {
              AreaType: 4,
              AreaCode: obj.street.code
          };
          dataInfo.push(street);
      }

      if (obj.community.code != '' && obj.community.code.length > 0) {
          /*obj.community.code.forEach(element => {
            let community = {
              AreaType: 5,
              AreaCode: element
            };
            dataInfo.push(community);
          });*/
          let community = {
              AreaType: 5,
              AreaCode: obj.community.code
          };
          dataInfo.push(community);
      }
      this.param.AreaCodes = dataInfo;
    },
    initRegion(obj) {
      this.area = obj
      let dataInfo = [
        {
          AreaType: 1,
          AreaCode: obj.provience.code.substr(2, obj.provience.code.length)
        },
        {
          AreaType: 2,
          AreaCode: obj.city.code.substr(2, obj.provience.code.length)
        }
      ];
      if (obj.town.code != '') {
        let town = {
          AreaType: 3,
          AreaCode: obj.town.code.substr(2, obj.provience.code.length)
        };
        dataInfo.push(town);
      }
      if (obj.street.code != '') {
        let street = {
          AreaType: 4,
          AreaCode: obj.street.code
        };
        dataInfo.push(street);
      }
      if (obj.community.code != '' && obj.community.code.length > 0) {
        let community = {
          AreaType: 5,
          AreaCode: obj.community.code
        };
        dataInfo.push(community);
      }
      this.param.AreaCodes = dataInfo;
      this.getStoreList(false)
    },
    // 翻页
    paginationChange(o) {
      this.param.PageSize = o.limit
      this.param.PageNo = o.page
      this.getStoreList(false)
    },
    // 查询
    searchStore(all) {
      this.param.PageNo = 1
      this.getStoreList(all)
    },
    //check变化之后的门店
    selectStore(v) {
      this.isOperate = true
      this.selectStoreArr = v.map(i=> i.Id)
    }
  }
}
</script>

<style lang="css" scoped>
.el-form-item{
  width: 170px
}
</style>
