import Pagination from '@/components/Pagination'
import EditAppSet from './EditAppSet.vue'
export default {
  name: 'ViolationTriggerSet',
  components: {
    Pagination,
    EditAppSet
  },
  data() {
    return {
      appId: '',
      userId: '',
      orgId: '',
      // 筛选表单
      formData: {
        appName: '',
        type:''
      },
      // 馆列表
      AppList:[],
      // 设备类型列表
      EquipTypeList: [],
      // 表格
      tableData:{
        loading: false,
        height:null,
        DataList:[]
      },
      // 翻页
      pages: {
        total: 0,
        page: 1,
        limit: 20,
        pageSizes: [10, 20, 30]
      },
      editAppSet:{
        show: false,
        data: {}
      }
    }
  },
  created() {
    this.appId = this.$utils.getUrlKey('appId') || '00000000-0000-0000-0000-000000000000'
    this.userId = this.$utils.getUrlKey('userId') || '00000000-0000-0000-0000-000000000000'
    this.orgId = this.$utils.getUrlKey('curChangeOrg') || '00000000-0000-0000-0000-000000000000'
    this.getTableList()
    this.getTypeList()
  },
  mounted() {
    this.tableData.height = document.body.clientHeight - 190 + 'px'
  },
  methods: {
    // 获取设备类型
    getTypeList() {
      this.EquipTypeList = []
    },
    // 获取表格数据
    getTableList() {
      let p = {

      }
      this.tableData.DataList = []
    },
    // 查询
    SearchApp() {
      this.pages.page = 1
      this.getTableList()
    },
    // 添加馆
    AddApp() {
      this.editAppSet.show = true
      this.editAppSet.data = {
        id: '',
        type: '',
        AppList: this.AppList,
        EquipTypeList: this.EquipTypeList,
        interval: '',
        factor: '',
        times: ''
      }
    },
    // 修改馆
    EditApp(o) {
      this.editAppSet.show = true
      this.editAppSet.data = {
        id: o.id,
        type: o.type,
        AppList: this.AppList,
        EquipTypeList: this.EquipTypeList,
        interval: o.interval,
        factor: o.factor,
        times: o.times
      }
    },
    // 关闭编辑
    CloseEditAppSet(v) {
      this.editAppSet.show = false
      if(v){
        this.getTableList()
      }
    },
    // 删除馆
    DeleteApp(d) {
      let p = {
        Id: d
      }
      this.$confirm('删除后该馆设置条件将不可使用，确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.$api.DeleteAuthorizeById(p).then(res => {
          if(res && res.IsSuccess){
            this.message('删除成功', 1)
            this.getTableList()
          }else{
            this.message('删除失败', -1)
          }
        }).catch(() => {})
      }).catch(() => {});
    },
    // 翻页
    pageChange(v) {
      this.pages.page = v.page
      this.pages.limit = v.limit
      this.getTableList()
    }
  }
}
