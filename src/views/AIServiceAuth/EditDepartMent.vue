<template lang="html">
  <el-dialog
    :title="title"
    width="600px"
    top="8vh"
    :close-on-click-modal="false"
    :visible.sync="showEditDepartMent"
    @close="Cancel">
    <div style="height:65vh">
      <el-scrollbar style="height:100%">
        <el-tree
          ref="department_tree"
          :check-on-click-node="true"
          :data="depShowList"
          node-key="id"
          show-checkbox
          check-strictly
          :default-expanded-keys="defaultExpandedKeys"
          :props="defaultProps"
          :expand-on-click-node="false"
          @check-change="CheckChange">
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
  name: 'EditDepartMent',
  props: {
    EditDepartMentShow: {
      type: Boolean,
      required: true
    },
    EditDepartMentData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showEditDepartMent: false,
      title: '选择部门',
      selectNode:{
        id:'',
        name:'',
        pId:''
      },
      defaultProps:{
        children: 'children',
        label:'name',
        disabled:function(d){
          return d.IsEnable
        }
      },
      defaultExpandedKeys:[],
      depDataList:[],
      depShowList:[]
    }
  },
  watch: {
    EditDepartMentShow(v) {
      if(v) {
        this.showEditDepartMent = true
        this.init()
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.selectNode = this.$utils.deepCopy(this.EditDepartMentData.selectNode)
      this.$nextTick(() => {
          this.$refs.department_tree.setCheckedKeys([this.selectNode.id])
      })
      this.getDepList()
    },
    // 取消
    Cancel() {
      this.showEditDepartMent = false
      this.$emit('CloseEditDepartMent', [false,[]])
    },
    // 确认
    Ensure() {
      this.showEditDepartMent = false
      console.log(this.selectNode)
      this.$emit('CloseEditDepartMent', [true,this.selectNode])
    },
    // 获取部门列表
    getDepList() {
      let p = {
        OrgId: this.EditDepartMentData.orgId,
        AppId: this.EditDepartMentData.appId
      }
      this.$api.GetDepartmentTreeData(p).then(res => {
        if(res && res.IsSuccess){
          this.depDataList = res.Data.map(i => {
            let o = {}
            o.id = i.Id
            o.pId = i.ParentId
            o.name = i.Name
            o.IsEnable = (i.IsUse == 1 && i.Id != this.selectNode.id)
            return o
          })
          this.depShowList = this.transTreeData(this.depDataList)
          this.defaultExpandedKeys = [(res.Data.find(i => i.ParentId == 0)).Id]
        }else{
          this.message(res.Message, -1)
        }
      }).catch(() => {})
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
      let items = this.depDataList;
      let length = items.length;
      for (let i = 0; i < length; i++) {
        if (items[i].pId == curPid) {
          let _obj = items[i];
          _obj.children = this.findChild(_obj.id)
          _arr.push(_obj);
        }
      }
      return _arr;
    },
    //切换选中
    CheckChange(data, checked, node) {
      if (checked) {
        this.$refs.department_tree.setCheckedNodes([data]);
        this.selectNode.name = data.name
        this.selectNode.id = data.id
        this.selectNode.pId = data.pId
      }
    },
  }
}
</script>

<style lang="css" scoped>
.el-scrollbar >>> .el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
