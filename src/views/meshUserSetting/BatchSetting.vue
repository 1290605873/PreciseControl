<template>
  <div class="batch-setting">
    <el-dialog
      append-to-body
      title="设置业态/标签/业务"
      v-if="batchsettingShow"
      :visible.sync="batchsettingShow"
      width="800px"
      top="5vh"
      class="batchSetting"
      :close-on-click-modal="false"
      @close="Close">
      <div class="maxDialog">
        <el-button
          type="primary"
          size="middle"
          @click="openSetUser">
          设置人员
        </el-button>
        <el-button
          type="primary"
          size="middle"
          @click="openSetOperate">
          设置业态
        </el-button>
        <el-button
          type="primary"
          size="middle"
          @click="openSetArea">
          设置区域
        </el-button>
        <el-button
          type="primary"
          size="middle"
          @click="openSetTag">
          设置标签
        </el-button>
        <el-card class="box-card" v-if="userList.length > 0">
          <div slot="header">
            <span class="header_title">人员列表</span>
          </div>
          <div
            v-for="(i, j) in userList"
            :key="j"
            class="item-box">
            <span style="padding-left:8px" :data-id="i.UserId">{{i.Name}}</span>
            <el-button
              type="text"
              icon="el-icon-close"
              style="padding:8px"
              @click="deleteData(0,j)">
            </el-button>
          </div>
        </el-card>
        <el-card class="box-card" v-if="operateList.length > 0">
          <div slot="header">
            <span class="header_title">业态列表</span>
          </div>
          <div
            v-for="(i, j) in operateList"
            :key="j"
            class="item-box">
            <span style="padding-left:8px" :data-id="i.OperateTypeId">{{i.OperateTypeName}}</span>
            <el-button
              type="text"
              icon="el-icon-close"
              style="padding:8px"
              @click="deleteData(1,j)">
            </el-button>
          </div>
        </el-card>
        <el-card class="box-card" v-if="areaList.length > 0">
          <div slot="header">
            <span class="header_title">区域列表</span>
          </div>
          <div
            v-for="(i, j) in areaList"
            :key="j"
            class="item-box">
            <span
              style="padding-left:8px"
              :data-id="i.AreaCode"
              :data-level="i.AreaLevel">
              {{i.AreaName}}
            </span>
            <el-button
              type="text"
              icon="el-icon-close"
              style="padding:8px"
              @click="deleteData(2,j)">
            </el-button>
          </div>
        </el-card>
        <!-- 标签列表 -->
        <el-card class="box-card" v-if="tagList.length > 0">
          <div slot="header">
            <span class="header_title">标签列表</span>
          </div>
          <div
            v-for="(i, j) in tagList"
            :key="j"
            class="item-box">
            <span
              style="padding-left:8px"
              :data-id="i.id"
              :data-level="i.name">
              {{i.name}}
            </span>
            <el-button
              type="text"
              icon="el-icon-close"
              style="padding:8px"
              @click="deleteData(3,j)">
            </el-button>
          </div>
        </el-card>
        <!-- 标签列表end -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Cancel">取消</el-button>
        <el-button type="primary" @click="Ensure">确定</el-button>
      </span>
    </el-dialog>
    <!-- |添加人员弹层开始| -->
    <el-dialog
      append-to-body
      :title="addUser.title"
      :visible.sync="addUser.show"
      width="960px"
      top="5vh"
      :before-close="closeSetUser">
      <div class="max-Dialog">
        <set-user
          ref="user"
          :defaultCheckuserId="defaultCheckuserId"
          @checkUserData="closeSetUser"></set-user>
      </div>
    </el-dialog>
    <!-- |添加人员弹层结束| -->
    <SetOperate
      :ShowSetOperate="setOperate.show"
      :SetOperateTopTab="setOperate.topTab"
      :SetOperateTaskTab="setOperate.taskTab"
      :SetOperateData="setOperate.data"
      @CloseSetOperate="CloseSetOperate">
    </SetOperate>
    <!-- |编辑区域弹层| -->
    <EditGridArea
      :EditGridAreaShow="editGridArea.show"
      :EditGridAreaData="editGridArea.data"
      @CloseEditGridArea="CloseEditGridArea">
    </EditGridArea>
    <!-- 选择标签弹层 -->
    <el-dialog
      append-to-body
      title="设置标签"
      v-if="setTag.show"
      :visible.sync="setTag.show"
      width="600px"
      top="5vh"
      class="setTagDia"
      :close-on-click-modal="false">
      <set-tag-dia class="maxDialog" @submitTag="submitTag(arguments,submitTag)" @closeTagDia="closeTagDia">
      </set-tag-dia>
    </el-dialog>
  </div>
</template>

<script>
import setUser from '../../components/SetUser'
import SetOperate from './SetOperate.vue'
import EditGridArea from './EditGridArea.vue'
import SetTagDia from './SetTagDia'
export default {
  name: 'BatchSetting',
  components: {
    SetOperate,
    setUser,
    EditGridArea,
    SetTagDia
  },
  props: {
    ShowBatchSetting:{
      type: Boolean,
      required:true
    },
    BatchSettingData:{
      type:Object,
      required: true
    },
    BatchSettingTopTab:{
      type:Array,
      required: true
    },
    BatchSettingTaskTab:{
      type:Array,
      required: true
    },
    BatchSettingBaseNode:{
      type:Object,
      required:true
    }
  },
  data() {
    return {
      batchsettingShow: false,
      userList:[],
      operateList:[],
      areaList:[],
      tagList:[],//标签
      // 添加人员
      addUser:{
        title: '添加人员',
        show: false
      },
      defaultCheckuserId:[],
      // 设置业态
      setOperate:{
        show:false,
        data: [], // 业态数据表
        topTab:[], // 业态列表
        taskTab:[] // 巡查自查列表
      },
      // 设置区域
      editGridArea:{
        show: false,
        data:{}
      },
      // 设置标签
      setTag:{
        show:false,
        data:{}
      },
    }
  },
  watch: {
    ShowBatchSetting(v){
      if(v){
        this.batchsettingShow = true
        this.init()
      }
    }
  },
  created(){

  },
  methods: {
    // 初始化
    init(){
      this.battchsetting = this.$utils.deepCopy(this.BatchSettingData)
      this.userList = this.$utils.deepCopy(this.BatchSettingData.ids)
      this.operateList = this.$utils.deepCopy(this.BatchSettingData.operate)
      this.setOperate.topTab = this.$utils.deepCopy(this.BatchSettingTopTab)
      this.setOperate.taskTab = this.$utils.deepCopy(this.BatchSettingTaskTab)
      this.editGridArea.data.baseNode = this.$utils.deepCopy(this.BatchSettingBaseNode)
      this.areaList = this.$utils.deepCopy(this.BatchSettingData.areas)
      let newTagArr = [];
      if(this.BatchSettingData.tag.length){
        
        for(let item of this.BatchSettingData.tag){
          if(item.name){
            newTagArr.push(item)
          }
        }
      }
      this.tagList = this.$utils.deepCopy(newTagArr)
    },
    // 关闭
    Close(){
      this.batchsettingShow = false
      this.$emit('CloseBatchSetting',[false])
    },
    // 取消
    Cancel(){
      this.batchsettingShow = false
      this.$emit('CloseBatchSetting',[false])
    },
    // 确认
    Ensure(){
      if(this.userList.length < 1){
        this.message('请选择人员',-1)
        return
      }
      if(this.operateList.length < 1){
        this.message('请选择业态',-1)
        return
      }
      if(this.areaList.length < 1){
        this.message('请选择区域',-1)
        return
      }
      let p = {}
      p.UserData = this.userList.map(i=>i.UserId)
      p.OperateData = this.operateList
      p.AreaData = this.areaList.map(i =>{
        return {
          AreaLevel: i.AreaLevel,
          AreaCode: i.AreaCode
        }
      })
      p.LabelData = this.tagList.map(i =>{
        return {
          id: i.id,
          name: i.name,
          LabelId:i.id
        }
      })
      this.$api.SavePrivilegeAndOperate(p).then(res => {
        if(res.IsSuccess){
          this.message(res.Message,1)
          this.batchsettingShow = false
          this.$emit('CloseBatchSetting',[true])
        }else{
          this.message(res.Message,-1)
        }
      }).catch(()=>{})
    },
    // 打开人员设置
    openSetUser(){
      this.addUser.show = true
    },
    // 关闭人员设置
    closeSetUser(o){
      if(Array.isArray(o) && o.length > 0){
        let tempArr = o.map(i=>{
          return {
            Name:i.Name,
            UserId:i.UserId
          }
        })
        let t = [...this.userList, ...tempArr]
        t.map(i=>{
          let b = this.userList.some(j=> j.UserId == i.UserId)
          if(!b){
            this.userList.push(i)
          }
        })
      }
      this.addUser.show = false
      this.$refs.user.clearData()
    },
    // 打开业态设置
    openSetOperate(){
      this.setOperate.data = this.$utils.deepCopy(this.operateList)
      this.setOperate.show= true
    },
    // 关闭业态设置
    CloseSetOperate(v){
      if(v[0]){
        this.operateList = this.$utils.deepCopy(v[1])
      }
      this.setOperate.show= false
    },
    //打开区域设置
    openSetArea(){
      this.editGridArea.data.checkedList = this.areaList
      this.editGridArea.show = true
    },
    // 关闭区域设置
    CloseEditGridArea(v){
      if(v[0]){
        console.log(v[1])
        this.areaList = v[1]
      }
      this.editGridArea.show = false
    },
    // 打开标签设置
    openSetTag () {
      this.setTag.show = true;
    },
    closeTagDia () {
      this.setTag.show = false;
    },
    submitTag(arg){
      let tagArr = Array.from(arg);
      this.setTag.show = false;
      let selectedTag = tagArr[1];
      let allTagList = tagArr[0];
      let arr = [];
      for(let i=0;i<selectedTag.length;i++){
        for(let j=0;j<allTagList.length;j++){
          if(selectedTag[i] == allTagList[j].id){
            arr.push(allTagList[j]);
          }
        }
      }
      //标签去重
      for(let i=0;i<arr.length;i++){
        let has = false;
        for(let j=0;j<this.tagList.length;j++){
          if(arr[i].id == this.tagList[j].id){
            has = true;
          }
        }
        if(!has){
          this.tagList.push(arr[i])
        }
      }
    },
    deleteData(m,n){
      console.log(m,n)
      if(m == 0){
        this.userList.splice(n,1)
      }
      if(m == 1){
        this.operateList.splice(n,1)
      }
      if(m == 2){
        this.areaList.splice(n,1)
      }
      if(m == 3){
        this.tagList.splice(n,1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .max-Dialog{
    height:calc(90vh - 110px);
    overflow: auto;
  }
.batchSetting {
  .maxDialog{
    height: calc(90vh - 154px);
  }
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
  .el-card{
    margin: 20px 0;
    /deep/ .el-card__header{
      padding: 12px 16px;
    }
    .header_title{
      display: inline-block;
      line-height: 24px;
      font-size: 16px;
    }
    /deep/ .el-card__body{
      padding:8px;
      .item-box{
        display: inline-block;
        border: 1px solid rgba(64, 158, 255, .5);
        background-color: rgba(64, 158, 255,.2);
        margin: 8px;
        border-radius: 4px;
      }
    }
  }
}

</style>
