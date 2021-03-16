
import Regionalism from '@/components/Regionalism.vue';

export default {
  name: 'stbs',
  data () {
    return {
      form: {
        storeName: '',
        licenceCode: '',
        formatId: [],
        formatName: ''
      },
      reportInfoDialog: false,
      adressData: {},
      // 表格
      tableData: [],
      tableLoading: false,
      // 分页
      currentPage: 1,
      pageSize: 50,
      totalLen: 0,
      // 业态
      reportData: [],
      defaultProps: {
        children: 'children',
        label: 'Name'
      }
    }
  },
  components: {
    Regionalism
  },
  computed: {
  },
  created () {
    this.GetOperateInfo()
  },
  methods: {
    initRegion (val) {
      this.adressData = val
      
      this.GetStoreCommConfigList()
    },
    regionalismResult () {
      this.adressData = val

    },
    search () { // 搜索
      this.currentPage = 1
      this.GetStoreCommConfigList()


    },
    handleSizeChange (val) {
      this.pageSize = val
      this.GetStoreCommConfigList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.GetStoreCommConfigList()

    },
    upInfoFocus () {
      this.reportInfoDialog = true
    },
    upInfoIpt () {
      this.form.formatName = ''
    },
    batchCheck (val1,val2,val3) { // 批量查
      // console.error(this.$refs.table.selection);
      console.error(val1,val2,val3);
      if (typeof val3 == 'object') {
        
        this.SubCommonSwitch(val1, val2, [val3.StoreId])
      } else {
        if (this.$refs.table.selection.length == 0) {
          this.$message({showClose: true,  message: '请选择数据', type: 'warning',duration: 1000})
          return
        }
        this.$confirm(`是否确认${val3}`, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let lst = this.$refs.table.selection.map(e=>e.StoreId)
          
          this.SubCommonSwitch(val1, val2, lst, true)
        })

      }

      
    },
    toTree(data) {
      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      let map = {};
      data.forEach(function (item) {
          map[item.Id] = item;
      });
      let val = [];
      
      data.forEach(function (item) {
          // 以当前遍历项，的pid,去map对象中找到索引的id
          let parent = map[item.ParentId];
          if (parent) {
              (parent.children || (parent.children = [])).push(item);
          } else {
              //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
              val.push(item);
          }
      });
      return val;
    },
    clearFormat () {
      this.form.formatName = ''
      this.form.formatId = []
      this.$refs.repTree.setCheckedKeys([])
    },
    reportInfoConfirm () {
      this.reportInfoDialog = false
      let checkList = this.$refs.repTree.getCheckedNodes()

      this.form.formatName = checkList.map(e=>e.Name).join(',')
      this.form.formatId = checkList.map(e=>e.Id) || []
      
    },
    async GetStoreCommConfigList (setFlag) { // 获取列表数据
      this.tableLoading = true
      let param = {
        ProvinceCode: this.adressData.provience.code,//省Code
        CityCode: this.adressData.city.code,//市Code
        DistrictCode: this.adressData.town.code,//区Code
        LocationId: this.adressData.street.code || '00000000-0000-0000-0000-000000000000',//街道Id
        CommouityId: this.adressData.community.code || '00000000-0000-0000-0000-000000000000',//社区Id
        OperIds:	this.form.formatId, // 业态Id
        StoreName: this.form.storeName,//门店名称
        LicenceCode: this.form.licenceCode,//许可证
        PageNo: this.currentPage,//当前页数
        PageSize:  this.pageSize,//每页显示数
      }

      const res = await this.$api.GetStoreCommConfigList(param)
      this.tableData = []
      if (res.IsSuccess && res.Content && res.Content.length>0) {
        this.tableData  = res.Content
        this.totalLen = res.Data


        !setFlag && (this.$refs.table.bodyWrapper.scrollTop =0);

      }
      // console.log('-获取列表数据-->', JSON.stringify(res.Content[0], null, 2));
      this.tableLoading = false

    },
    async GetOperateInfo () { // 获取业态
      const res = await this.$api.GetOperateInfo(0,1)
      // console.error('--->', res);
      this.reportData = []
      if (res && res.length>0) {
        this.reportData = this.toTree(res)
      }
    },
    async SubCommonSwitch (bool,type, storeIds, single) { // 设置状态
      let param = {
        status: bool? '0': '1', // 0 是选中
        storeIds: storeIds, // 门店Id
        type: type // 1批量AI审核自查2批量AI审核整改 3批量人工审核自查4批量人工审核整改
      }
      const res = await this.$api.SubCommonSwitch(param)
      console.error('设置状态--->', res);
      if (res.IsSuccess) {
        this.$message({showClose: true,  message: '设置成功！', type: 'success',duration: 1000})
        // this.currentPage = 1        
        single && this.GetStoreCommConfigList('set')
      } else {
        this.$message({showClose: true,  message: '设置失败', type: 'error',duration: 1000})
      }
     
    }

    

  }
}