<template lang="html">
  <el-dialog
    :title="title"
    width="600px"
    top="5vh"
    :close-on-click-modal="false"
    :visible.sync="showEditType"
    @close="Cancel">
    <div style="height: 65vh">
      <el-scrollbar style="height:100%">
        <el-tree
          ref="operate_tree"
          :check-on-click-node="true"
          :props="defaultProps"
          :data="typeShowList"
          node-key="Id"
          show-checkbox
          :default-expanded-keys="defaultExpandedKeys"
          :expand-on-click-node="false"
          @check="checkChange">
        </el-tree>
      </el-scrollbar>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="Cancel">取 消</el-button>
      <el-button type="primary" @click="Ensure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditType',
  props: {
    EditTypeShow: {
      type: Boolean,
      required: true
    },
    EditTypeData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      appId:'',
      showEditType: false,
      title:'选择业态',
      defaultProps:{
        children: 'children',
        label: 'Name'
      },
      selectList:[],
      defaultExpandedKeys:[],
      typeDataList: [],
      typeShowList: []
    }
  },
  watch: {
    EditTypeShow(v) {
      if(v) {
        this.showEditType = true
        this.init()
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.selectList = this.$utils.deepCopy(this.EditTypeData.checkedList)
      this.appId = this.EditTypeData.appId
      this.getTypeList()
      this.$nextTick(()=>{
        let selectedKeys = this.selectList.map(i=>i.Id)
        this.$refs.operate_tree.setCheckedKeys(selectedKeys)
      })
    },
    // 获取业态
    getTypeList(){
      this.$api.GetOperateInfo(0).then(res => {
          this.typeDataList = res
          this.typeDataList.push({
            Id: '00000000-0000-0000-0000-000000000000',
            ParentId: 0,
            Name: '根目录'
          })
          this.typeShowList = this.transTreeData(this.typeDataList)
          this.defaultExpandedKeys = ['00000000-0000-0000-0000-000000000000']
      }).catch(()=>{})
    },
    //把平级数据变成树形数据
    transTreeData(items) {
      if (items.length > 0) {
        let curPid = 0;//为最上层节点 ，即无父节点
        let parent = this.findChild(curPid);//数组
        return parent
      } else {
        return []
      }
    },
    //拼接子节点
    findChild(curPid) {
      let _arr = [];
      let items = this.typeDataList;
      let length = items.length;
      for (let i = 0; i < length; i++) {
        if (items[i].ParentId == curPid) {
          let _obj = items[i];
          _obj.children = this.findChild(_obj.Id)
          _arr.push(_obj);
        }
      }
      return _arr;
    },
    // 取消
    Cancel() {
      this.showEditType = false
      this.$emit('CloseEditType', [false,[]])
    },
    // 确认
    Ensure() {
      this.showEditType = false
      this.$emit('CloseEditType', [true, this.selectList])
    },
    // 切换业态选中
    checkChange(v,d){
      console.log(d)
      this.selectList = d.checkedNodes
    }
  }
}
</script>

<style lang="css" scoped>
  .el-scrollbar >>> .el-scrollbar__wrap{
    overflow-x: hidden;
  }
</style>
