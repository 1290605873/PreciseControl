import Pagination from '@/components/Pagination'
import EditServiceAuth from './EditServiceAuth.vue'
export default {
  name: 'AIServiceAuth',
  components: {
    Pagination,
    EditServiceAuth
  },
  data() {
    return {
      appId: '',
      userId: '',
      orgId: '',
      // 筛选表单
      formData: {
        name: '',
        time:''
      },
      // 服务期列表
      serviceTimeList: [
        {label:'有效',value:1},
        {label:'无效',value:2}
      ],
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
      // 编辑授权
      editServiceAuth: {
        show: false,
        data: {}
      },
      baseAreaCode:{}
    }
  },
  created() {
    this.appId = this.$utils.getUrlKey('appId') || '00000000-0000-0000-0000-000000000000'
    this.userId = this.$utils.getUrlKey('userId') || '00000000-0000-0000-0000-000000000000'
    this.orgId = this.$utils.getUrlKey('curChangeOrg') || '00000000-0000-0000-0000-000000000000'
    this.getTableList()
    this.getCityCode()
  },
  mounted() {
    this.tableData.height = document.body.clientHeight - 190 + 'px'
  },
  methods: {
    // 获取表格数据
    getTableList() {
      let p = {
        DeptName: this.formData.name,
        ValidityDate: this.formData.time == 0 ? '' : this.formData.time,
        PageNo: this.pages.page,
        PageSize: this.pages.limit,
        OrgId: this.orgId,
        AppId: this.appId,
        UserId: this.userId,
        ClientType: 0,
        RoleType: 0,
        RoleId: "00000000-0000-0000-0000-000000000000",
        KeyWord: ""
      }
      this.$api.GetAuthorizeList(p).then(res => {
        if(res && res.IsSuccess){
          this.tableData.DataList = res.Data
          this.pages.total=res.Total
        }
      }).catch(() => {})
    },
    // 查询
    SearchAuth() {
      this.pages.page = 1
      this.getTableList()
    },
    // 添加服务授权
    AddAuth() {
      if(!this.baseAreaCode.id){
        this.message('该APP未绑定区域',-1)
        return
      }
      this.editServiceAuth.data = {
        id: '00000000-0000-0000-0000-000000000000',
        appId: this.appId,
        orgId: this.orgId,
        userId: this.userId,
        deptId: '',
        deptName: '',
        startTime: '',
        endTime: '',
        areaList: [],
        typeList: [],
        storeList: [],
        baseAreaCode:this.baseAreaCode
      }
      this.editServiceAuth.show = true
    },
    // 设置服务授权
    SetAuth(v) {
      let p = {
        Id:v
      }
      this.$api.GetAuthorizeById(p).then(res => {
        if(res.Success){
          this.editServiceAuth.show = true
          this.editServiceAuth.data = {
            id: res.Id,
            appId: res.AppId,
            orgId: this.orgId,
            userId: this.userId,
            deptId: res.DeptId,
            deptName: res.DeptName,
            startTime: res.ValidityBegin,
            endTime: res.ValidityEnd,
            areaList: res.AreaList,
            typeList: res.OperateTypeList,
            storeList: res.StoreIdList || [],
            baseAreaCode:this.baseAreaCode,
          }
        }else{
          this.message(res.Message, -1)
        }
      }).catch(() => {})
    },
    // 删除服务授权
    DeleteAuth(v) {
      let p = {
        Id: v
      }
      this.$confirm('删除后该授权将不可使用，确定删除?', '提示', {
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
    },
    // 关闭编辑授权
    CloseEditServiceAuth(v) {
      this.editServiceAuth.show = false
      if(!v){
        return
      }
      this.getTableList()
    },
    // 获取app 所在区域
    async getCityCode(){
      let isWhole = await this.$api.GetAppPeropty()
      if(isWhole.IsSuccess){
        if(isWhole.Data == ""){
          this.baseAreaCode = {}
        } else if(isWhole.Data == '000000'){
          this.baseAreaCode = {
            id: '0-000000',
            name: '全国',
            pId: '',
            disabled: true,
            level: 0
          }
        }else{
          let res = await this.$api.GetCityCode()
          let tempArr = res.filter(i => i.CityCode)
          let a = tempArr.reduce((k, i) => i.Level >= k ? i.Level : k , 1)
          let b = tempArr.find(i => i.Level == a)
          let p
          p = (a - 1) + '-' + b.CityCode.substring(2, a * 2)
          p = p.padEnd(8,'0')
          console.log(a,b,p)
          this.baseAreaCode = {
            id: b.CityCode,
            name: b.CodeName,
            pId: p,
            level: a
          }
        }
      }else{

      }

      // this.$api.GetCityCode().then(res => {
      //   if(res.length == 0){
      //     this.baseAreaCode = {
      //       id: '0-000000',
      //       name: '全国',
      //       pId: '',
      //       disabled: true,
      //       level: 0
      //     }
      //   }else{
      //     let tempArr = res.filter(i => i.CityCode)
      //     let a = tempArr.reduce((k, i) => i.Level >= k ? i.Level : k , 1)
      //     let b = tempArr.find(i => i.Level == a)
      //     let p
      //     p = (a - 1) + '-' + b.CityCode.substring(2, a * 2)
      //     p = p.padEnd(8,'0')
      //     console.log(a,b,p)
      //     this.baseAreaCode = {
      //       id: b.CityCode,
      //       name: b.CodeName,
      //       pId: p,
      //       level: a
      //     }
      //   }
      // }).catch(() => {})
    }
  },
  filters:{
    dateFilter(v) {
      let str1 = v.split('-')[0], str2 = v.split('-')[1]
      str1 = str1.length < 10 ? str1.slice(0,8)+'0'+str1.slice(8) : str1
      str2 = str2.length < 10 ? str2.slice(0,8)+'0'+str2.slice(8) : str2
      return str1 + '-' + str2
    }
  }
}
