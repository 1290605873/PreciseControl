<template lang="html">
  <el-dialog
    :title="title"
    width="600px"
    top="8vh"
    :close-on-click-modal="false"
    :visible.sync="showEditArea"
    :destroy-on-close="true"
    @close="Cancel">
    <div style="height:65vh">
      <el-scrollbar style="height:100%">
        <TreeAreaChoose
          :check="true"
          :checkStrictly="false"
          :baseCode="EditAreaData.baseNode"
          :checkedKey="checkedKeys"
          :limit="5"
          @getCheckedNode="getCheckedNode">
        </TreeAreaChoose>
      </el-scrollbar>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="Cancel">取 消</el-button>
      <el-button type="primary" @click="Ensure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import TreeAreaChoose from '@/components/TreeAreaChoose.vue'
export default {
  name: 'EditArea',
  components: {
    TreeAreaChoose
  },
  props: {
    EditAreaShow: {
      type: Boolean,
      required: true
    },
    EditAreaData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showEditArea: false,
      title: '选择区域',
      checkingList: [],
      checkedKeys:[]
    }
  },
  watch: {
    EditAreaShow(v) {
      if(v) {
        this.showEditArea = true
        this.init()
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.checkingList = this.EditAreaData.checkedList
      this.checkedKeys = this.checkingList.map(i=>i.Code)
    },
    // 取消
    Cancel() {
      this.showEditArea = false
      this.$emit('CloseEditArea', [false,[]])
    },
    // 确认
    Ensure() {
      this.showEditArea = false
      this.$emit('CloseEditArea', [true,this.checkingList])
    },
    // 获取选中区域
    getCheckedNode(v) {
      this.checkingList = v.map(i => {
        let o = {}
        o.Code = i.id
        o.Name = i.name
        o.Level = i.level
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
