<template lang="html">
  <el-dialog
    :title="title"
    width="600px"
    :visible.sync="showEditAppSet"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="Cancel">
    <el-form
      label-width="120px"
      size="middle">
      <el-form-item label="馆名称" required>
        <el-select
          placeholder="请选择馆"
          v-model="formData.appName"
          clearable>
          <el-option
            v-for="(i, j) in AppList"
            :key="j"
            :label="i.label"
            :value="i.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型" required>
        <el-select
          placeholder="请选择设备类型"
          v-model="formData.type"
          clearable>
          <el-option
            v-for="(i, j) in EquipTypeList"
            :key="j"
            :label="i.label"
            :value="i.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="整改时间间隔" required>
        <el-input v-model="formData.interval"></el-input> 分钟
      </el-form-item>
      <el-form-item label="巡查触发条件" required>
        <el-select
          placeholder="请选择巡查触发条件"
          v-model="formData.factor"
          clearable>
          <el-option
            v-for="(i, j) in FactorList"
            :key="j"
            :label="i.label"
            :value="i.value">
          </el-option>
        </el-select>
        <el-input v-model="formData.times"></el-input> 次
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="Cancel">取 消</el-button>
      <el-button type="primary" @click="Ensure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditAppSet',
  props: {
    EditAppSetShow: {
      type: Boolean,
      required: true
    },
    EditAppSetData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      appId: '',
      orgId: '',
      userId: '',
      id: '',
      showEditAppSet: false,
      title: '',
      formData: {
        appName: '',
        type: '',
        factor: '',
        interval: 0,
        times: 0,
      },
      AppList: [],
      EquipTypeList: [],
      FactorList: []
    }
  },
  watch: {
    EditAppSetShow(v) {
      if(v) {
        this.showEditAppSet = true
        this.init()
      }
    }
  },
  methods:{
    init() {
        this.title = this.EditAppSetData.id == '' ? '添加馆' : '编辑馆'
        this.id = this.EditAppSetData.id
        this.formData.type = this.EditAppSetData.type
        this.AppList = this.$utils.deepCopy(this.EditAppSetData.AppList)
        this.EquipTypeList = this.$utils.deepCopy(this.EditAppSetData.EquipTypeList)
    },
    Cancel() {
      this.showEditAppSet = false
      this.$emit('CloseEditAppSet', false)
    },
    Ensure() {
      this.showEditAppSet = false
      this.$emit('CloseEditAppSet', true)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
