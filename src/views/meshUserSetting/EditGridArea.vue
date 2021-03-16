<template lang="html">
  <el-dialog
    :title="title"
    width="600px"
    top="8vh"
    :close-on-click-modal="false"
    :visible.sync="showEditGridArea"
    :destroy-on-close="true"
    @close="Cancel">
    <div style="height:65vh">
      <el-scrollbar style="height:100%">
        <GridTreeAreaChoose
          :check="true"
          :checkStrictly="false"
          :baseCode="[EditGridAreaData.baseNode]"
          :disabledLevel="EditGridAreaData.disabledLevel"
          :checkedKey="checkedKeys"
          :limit="5"
          @getCheckedNode="getCheckedNode">
        </GridTreeAreaChoose>
      </el-scrollbar>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="Cancel">取 消</el-button>
      <el-button type="primary" @click="Ensure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import GridTreeAreaChoose from '@/components/GridTreeAreaChoose.vue'
export default {
  name: 'EditGridArea',
  components: {
    GridTreeAreaChoose
  },
  props: {
    EditGridAreaShow: {
      type: Boolean,
      required: true
    },
    EditGridAreaData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showEditGridArea: false,
      title: '选择区域',
      checkingList: [],
      checkedKeys:[]
    }
  },
  watch: {
    EditGridAreaShow(v) {
      if(v) {
        this.showEditGridArea = true
        this.init()
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.checkingList = this.EditGridAreaData.checkedList
      this.checkedKeys = this.checkingList.map(i=>i.AreaCode)
    },
    // 取消
    Cancel() {
      this.showEditGridArea = false
      this.$emit('CloseEditGridArea', [false,[]])
    },
    // 确认
    Ensure() {
      this.showEditGridArea = false
      this.$emit('CloseEditGridArea', [true,this.checkingList])
    },
    // 获取选中区域
    getCheckedNode(v) {
      this.checkingList = v.map(i => {
        let o = {}
        o.AreaCode = i.id
        o.AreaName = i.name
        o.AreaLevel = i.level
        return o
      })
    }
  }
}
</script>

<style lang="css" scoped>
.el-scrollbar >>> .el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
