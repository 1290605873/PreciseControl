<template>
  <div class="batch-setting">
    <el-dialog
      append-to-body
      title="设置业态/业务"
      :visible.sync="setOperateShow"
      width="800px"
      top="5vh"
      class="setOperate"
      :close-on-click-modal="false"
      @close="Close">
      <div class="maxDialog">
        <div v-for="(i,j) in operates" :key="j">
          <label class="searhCluseLabel">业态类型</label>
          <el-select
            clearable
            class="select-item"
            placeholder="请选择"
            v-model="i.OperateTypeId"
            value-key="label"
            :filterable="SetOperateTopTab.length > 7">
            <el-option
              v-for="(item,index) in SetOperateTopTab"
              :key="index"
              :label="item.Name"
              :value="item.Id">
            </el-option>
          </el-select>
          <label class="searhCluseLabel">业务类型</label>
          <el-select
            clearable
            class="select-item"
            placeholder="可多选"
            v-model="i.BusinessInfo"
            value-key="label"
            multiple
            :filterable="SetOperateTaskTab.length > 7">
            <el-option
              v-for="(item, index) in SetOperateTaskTab"
              :key="index"
              :label="item.Text"
              :value="item.Id">
            </el-option>
          </el-select>
          <span v-if="j == 0" class="addPic" @click="addMoreSetting"></span>
          <span v-else class="delPic" @click="delMoreSetting(j)"></span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Cancel">取消</el-button>
        <el-button type="primary" @click="Ensure">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SetOperate',
  props: {
    ShowSetOperate:{
      type: Boolean,
      required:true
    },
    SetOperateData:{
      type:Array,
      required: true
    },
    SetOperateTopTab:{
      type:Array,
      required: true
    },
    SetOperateTaskTab:{
      type:Array,
      required: true
    }
  },
  data() {
    return {
      setOperateShow: false,
      operates:[]
    }
  },
  watch: {
    ShowSetOperate(v){
      if(v){
        this.setOperateShow = true
        this.init()
      }
    }
  },
  methods: {
    // 初始化
    init(){
      let a = this.$utils.deepCopy(this.SetOperateData)
      this.operates = this.SetOperateData.map(i => {
        i.BusinessInfo = i.BusinessInfo.map(j => j.BusinessId)
        return i
      })
      if(this.operates.length == 0){
        this.operates = [{
          OperateTypeId: '',
  				OperateTypeName: '',
  				BusinessInfo: []
        }]
      }
    },
    Close(){
      this.setOperateShow = false
      this.$emit('CloseSetOperate',[false])
    },
    Cancel(){
      this.setOperateShow = false
      this.$emit('CloseSetOperate',[false])
    },
    Ensure(){
      let a = this.operates.some(i=>i.OperateTypeId == '')
      let b = this.operates.some(i=>i.BusinessInfo.length == 0)
      let e = this.operates.map(i=>i.OperateTypeId)
      if(a){
        this.message('请选择业态', 2)
        return
      }
      if(b){
        this.message('请选择业务', 2)
        return
      }
      e = [...new Set(e)]
      if(e.length != this.operates.length){
        this.message('业态不可重复', 2)
        return
      }
      let k = this.operates.map(i => {
        let o = {}
        let b = i.BusinessInfo.map(d => {
          let c = {}
          c.BusinessId = d
          c.BusinessName = d == 0 ? '巡查' : d == 1 ? '自查' : ''
          return c
        })
        o.OperateTypeId = i.OperateTypeId
        o.OperateTypeName = (this.SetOperateTopTab.find(j => j.Id == i.OperateTypeId)).Name
        o.BusinessInfo = b
        return o
      })
      this.setOperateShow = false
      this.$emit('CloseSetOperate',[true,k])
      // this.$api.SubOperateUser(this.SetOperateData.ids, k).then(res => {
      //   if (res && res.IsSuccess) {
      //     this.message('添加成功', 1)
      //     this.setOperateShow = false
      //     this.$emit('CloseSetOperate',[true])
      //   } else {
      //     this.message(res.Message == null || res.Message == '' ? '添加失败' : res.Message, -1);
      //   }
      // }).catch(res => {
      //   this.message(res.Message == null || res.Message == '' ? '添加失败' : res.Message, -1);
      // })
    },
    addMoreSetting() {
			this.operates.push({
				OperateTypeId: '',
				OperateTypeName: '',
				BusinessInfo: []
			})
		},
    delMoreSetting(i){
      this.operates.splice(i,1)
    }
  }
}
</script>

<style lang="scss" scoped>
.setOperate {
  .searhCluseLabel {
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 34px;
    box-sizing: border-box;
    width: 100px;
    display: inline-block;
  }
  .select-item {
    width: 180px;
    height: 34px;
    padding-right: 10px;
  }
  .addPic {
    width: 25px;
    height: 25px;
    background: url("../../assets/images/add_icon.png");
    background-repeat: no-repeat;
    background-size: contain;
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;
  }
  .delPic {
    width: 25px;
    height: 25px;
    background: url("../../assets/images/delete_icon.png");
    background-repeat: no-repeat;
    background-size: contain;
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;
  }
  .uparrow {
    width: 25px;
    height: 25px;
    background: url("../../assets/images/uparrow.png");
    background-repeat: no-repeat;
    background-size: contain;
    display: inline-block;
    margin-left: 10px;
    margin-top: 4px;
    vertical-align: middle;
  }
  .downarrow {
    width: 25px;
    height: 25px;
    background: url("../../assets/images/downarrow.png");
    background-repeat: no-repeat;
    background-size: contain;
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;
  }
  .el-tag--info i {
    display: none;
  }
  .el-select__tags {
    white-space: nowrap;
    display: inline-block;
    overflow: hidden;
  }
}

</style>
