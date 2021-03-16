<template lang="html">
  <div class="edit-service-auth">
    <el-dialog
      :title="title"
      width="600px"
      :visible.sync="showEditServiceAuth"
      :close-on-click-modal="false"
      @close="Cancel">
      <el-form
        label-width="120px"
        size="middle">
        <el-form-item label="部门名称" :id="formData.deptId" required>
          <el-input
            v-model="formData.deptName"
            readonly
            @click.native="ChooseDepartMent">
          </el-input>
        </el-form-item>
        <el-form-item label="服务有效期" required>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="formData.startTime"
            :picker-options="checkStartTime"
            type="date"
            style="width:200px"
            placeholder="请选择开始时间"
            clearable>
          </el-date-picker>
          <span style="padding:0 12px">至</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="formData.endTime"
            type="date"
            :picker-options="checkEndTime"
            style="width:200px"
            placeholder="请选择结束时间"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="服务区域" required>
          {{formData.areas.length > 0 ? '已' : '未'}}设置
          <el-button
            type="primary"
            size="mini"
            style="float:right;margin:5px 0"
            @click="ChooseArea">
            选择服务区域
          </el-button>
        </el-form-item>
        <el-form-item label="服务业态" required>
          {{formData.types.length > 0 ? '已' : '未'}}设置
          <el-button
            type="primary"
            size="mini"
            style="float:right;margin:5px 0"
            @click="ChooseType">
            选择业态
          </el-button>
        </el-form-item>
        <el-form-item label="指定服务门店">
          已选择{{formData.stores.length}}家门店
          <el-button
            type="primary"
            size="mini"
            style="float:right;margin:5px 0"
            @click="ChooseStore">
            选择门店
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Cancel">取 消</el-button>
        <el-button type="primary" @click="Ensure">确 定</el-button>
      </div>
    </el-dialog>
    <EditDepartMent
      :EditDepartMentShow="editDepartMent.show"
      :EditDepartMentData="editDepartMent.data"
      @CloseEditDepartMent="CloseEditDepartMent">
    </EditDepartMent>
    <EditArea
      :EditAreaShow="editArea.show"
      :EditAreaData="editArea.data"
      @CloseEditArea="CloseEditArea">
    </EditArea>
    <EditType
      :EditTypeShow="editType.show"
      :EditTypeData="editType.data"
      @CloseEditType="CloseEditType">
    </EditType>
    <EditStore
      :EditStoreShow="editStore.show"
      :EditStoreData="editStore.data"
      @CloseEditStore="CloseEditStore">
    </EditStore>
  </div>
</template>

<script>
import EditDepartMent from './EditDepartMent.vue'
import EditArea from './EditArea.vue'
import EditType from './EditType.vue'
import EditStore from './EditStore.vue'

export default {
  name: 'EditServiceAuth',
  components:{
    EditDepartMent,
    EditArea,
    EditType,
    EditStore
  },
  props: {
    EditServiceAuthShow: {
      type: Boolean,
      required: true
    },
    EditServiceAuthData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      appId: '',
      orgId: '',
      userId: '',
      id:'',
      showEditServiceAuth: false,
      title:'',
      formData: {
        deptName: '',
        deptId: '',
        startTime: '',
        endTime: '',
        areas: [],
        types: [],
        stores: []
      },
      checkStartTime: {
        disabledDate: (time) => {
            if (this.formData.endTime != null && this.formData.endTime != '' ||
                this.formData.endTime != undefined) {
                let timeStr = new Date(this.formData.endTime).getTime();
                return time.getTime() > timeStr - 86400000;
            } else {
                this.formData.startTime =  '';
            }
        }
      },
      checkEndTime: {
        disabledDate: (time) => {
            if (this.formData.startTime != null && this.formData.startTime != '' ||
                this.formData.startTime != undefined) {
                let timeStr = new Date(this.formData.startTime).getTime();
                return time.getTime() <= timeStr - 86400000;
            } else {
                this.formData.endTime =  '';
            }
        }
      },
      editDepartMent: {
        show: false,
        data: {
          selectNode:{
            id:'',
            name:'',
          },
          orgId:'',
          appId:''
        }
      },
      editArea: {
        show: false,
        data: {
          baseNode:[],
          checkedList:[]
        }
      },
      editType: {
        show: false,
        data: {
          checkedList:[],
          appId:''
        }
      },
      editStore: {
        show: false,
        data: {
          checkedList:[],
          appId:''
        }
      }
    }
  },
  watch: {
    EditServiceAuthShow(v) {
      if(v) {
        this.showEditServiceAuth = true
        this.init()
      }
    },
  },
  methods: {
    // 初始化
    init() {
      if(this.EditServiceAuthData.id == '00000000-0000-0000-0000-000000000000'){
        this.title="添加服务授权"
      }else{
        this.title="编辑服务授权"
      }
      this.id = this.EditServiceAuthData.id
      this.appId = this.EditServiceAuthData.appId
      this.orgId = this.EditServiceAuthData.orgId
      this.userId = this.EditServiceAuthData.userId
      this.formData.deptName = this.EditServiceAuthData.deptName
      this.formData.deptId = this.EditServiceAuthData.deptId
      this.formData.startTime = this.EditServiceAuthData.startTime
      this.formData.endTime = this.EditServiceAuthData.endTime
      this.formData.areas = this.$utils.deepCopy(this.EditServiceAuthData.areaList)
      this.formData.types = this.$utils.deepCopy(this.EditServiceAuthData.typeList)
      this.formData.stores = this.$utils.deepCopy(this.EditServiceAuthData.storeList)
    },
    // 取消
    Cancel() {
      this.showEditServiceAuth = false
      this.$emit('CloseEditServiceAuth', false)
    },
    // 确认
    Ensure() {
      if(this.formData.deptName == '' || this.formData.DeptId == ''){
        this.message('请选择部门', -1)
        return
      }
      if(this.formData.ValidityBegin == ''){
        this.message('请选择开始日期', -1)
        return
      }
      if(this.formData.ValidityEnd == ''){
        this.message('请选择结束日期', -1)
        return
      }
      if(this.formData.areas.length<1){
        this.message('请选择服务区域', -1)
        return
      }
      if(this.formData.types.length<1){
        this.message('请选择服务业态', -1)
        return
      }

      let areas = this.formData.areas.map(i => {
        let o = {
          Code: i.Code,
          Name: i.Name,
          Level: i.Level
        }
        return o
      })
      let types = this.formData.types.map(i => {
          let o = {
            Id: i.Id,
            Name: i.Name,
            ParentId: i.ParentId
          }
          return o
      })
      types = types.filter(i => i.ParentId != 0)
      let stores = this.formData.stores
      let p = {
        Id: this.id,
        AppId: this.appId,
        DeptId: this.formData.deptId,
        DeptName: this.formData.deptName,
        ValidityBegin: this.formData.startTime,
        ValidityEnd: this.formData.endTime,
        AreaList: areas,
        OperateTypeList: types,
        StoreNum: this.formData.stores.length,
        StoreIdList: stores,
        SubId: this.userId,
      }
      this.$api.AddOrUpdateAuthorize(p).then(res => {
        if(res && res.IsSuccess){
          this.showEditServiceAuth = false
          this.$emit('CloseEditServiceAuth', true)
          this.message(res.Message, 1)
        }else{
          this.message(res.Message, -1)
        }
      })
    },
    // 选择部门
    ChooseDepartMent() {
      this.editDepartMent.show = true
      this.editDepartMent.data = {
        selectNode: {
          id: this.formData.deptId,
          name: this.formData.deptName
        },
        orgId: this.orgId,
        appId: this.appId
      }
    },
    // 关闭选择部门
    CloseEditDepartMent(v) {
      this.editDepartMent.show = false
      if(v[0]){
        this.formData.deptName = v[1].name
        this.formData.deptId = v[1].id
      }
    },
    // 选择区域
    ChooseArea() {
      this.editArea.show = true
      this.editArea.data = {
        baseNode: [this.$utils.deepCopy(this.EditServiceAuthData.baseAreaCode)],
        checkedList:this.formData.areas
      }
    },
    // 关闭选择区域
    CloseEditArea(v) {
      this.editArea.show = false
      if(v[0]){
        this.formData.areas = v[1]
      }
    },
    // 选择业态
    ChooseType() {
      this.editType.show = true
      this.editType.data = {
        checkedList:this.formData.types,
        appId:this.appId,
      }
    },
    // 关闭选择业态
    CloseEditType(v) {
      this.editType.show = false
      if(v[0]){
        this.formData.types = v[1]
      }
    },
    // 选择门店
    ChooseStore() {
      this.editStore.show = true
      this.editStore.data = {
        checkedList: this.formData.stores,
        appId: this.appId
      }
    },
    // 关闭选择门店
    CloseEditStore(v) {
      this.editStore.show = false
      if(v[0]){
        this.formData.stores = v[1]
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
