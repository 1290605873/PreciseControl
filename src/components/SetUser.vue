<template>
    <div
      class="setUserWrap"
      ref="setUser"
      :defaultCheckuserId="defaultCheckuserId">
      <el-input
        v-model="search.userName"
        size="middle"
        style="width:200px"
        placeholder="请输入职员姓名"/>
      <el-input
        v-model="search.depName"
        size="middle"
        style="width:200px;margin-left:10px;"
        placeholder="请输入部门名称"/>
      <el-button
        @click="Search"
        size="mini"
        style="margin-left:10px">
        搜索
      </el-button>
      <el-badge
        :value="checkUserArray.length"
        style="width: 100%;height: 98px">
          <div
            v-if="checkUserArray.length == 0"
            style="text-align: center;height: 104px;line-height: 104px">
            <div style="font-size: 18px;color: #cccccc">请选择人员</div>
          </div>
          <div v-else class="checkUser">
            <div v-for="item in checkUserArray" :key="item.UserId">
              <div class="user" v-if="item.Name">
                <span :class="['name-img']" v-text="replaceName(item.Name)"></span>
                <span class="name" v-if="item.Name">{{item.Name}}</span>
                <i class="el-icon-close" @click="removeCheck(item)"></i>
              </div>
            </div>
          </div>
      </el-badge>

        <div class="setUser">
                <el-table
                    :data="tableData"
                    border
                    :max-height="tableHeight"
                    fit
                    :row-key="getRowKey"
                    class="table"
                    @select="handleSelectionChange"
                    @select-all="handleSelectionAll"
                    ref="table">
                    <el-table-column
                      type="index"
                      label="序号"
                      width="50"
                      align="center"></el-table-column>
                    <el-table-column
                      type="selection"
                      width="50"
                      reserve-selection></el-table-column>
                    <el-table-column
                      label="职员姓名"
                      width="100px"
                      show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.Name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                      property="DepartmentName"
                      label="部门名称"
                      width="140px"
                      show-overflow-tooltip >
                    </el-table-column>
                    <el-table-column
                      property="RoleInfoRemark"
                      label="角色"
                      min-width="150px"
                      show-overflow-tooltip >
                    </el-table-column>
                    <!-- <el-table-column
                       align="right">
                       <template slot="header" slot-scope="scope">
                           <el-input
                           v-model="searchCurrent"
                           size="mini"
                           placeholder="搜索当前页人员"/>
                       </template>
                   </el-table-column> -->
                </el-table>
             <Pagination
               v-show="pageNation.total"
               :total="pageNation.total"
               :page.sync="pageNation.page"
               :limit.sync="pageNation.limit"
               @pagination="PageChange"></Pagination>
        </div>
        <span slot="footer" class="dialog-footer" style="display:block;width:100%;text-align:center;padding-top:10px;">
            <el-button @click="closeUserDialog">取 消</el-button>
            <el-button type="primary" @click="userDialogFn">确 定</el-button>
        </span>
    </div>
</template>
<script>
    /**
     * @module set-user
     * @desc   选择组织
     * @author jinsh
     * @date   2019/3/10
     * @param  {checkUserData} [Function] - 返回选中的人员数据
     * @param  {defaultCheckuserId} [Array] 默认选中的UserId 可用于回显数据
     * @example 调用示例
     *   <set-organ @checkOragnData="checkOragnData" :defaultCheckuserId="defaultCheckuserId"></set-organ>
     *
     */
    let checkID = [];
    let checkName = [];
    let checkJson = [];
    import Pagination from './Pagination'
    export default {
        name: 'set-user',
        props: {
            defaultCheckuserId: {
                type: Array,
                default() {
                    return []
                }
            },
            AreaCode:{
                type: Array,
                default:() => []
            }
        },
        components:{
          Pagination
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            'userData':{
                handler(newName, oldName) {
                    this.$nextTick(()=>{
                        let _this = this;
                        this.userData.forEach((value, index) => {
                            if (this.defaultCheckuserId.indexOf(value.UserId) != -1) {
                                this.$refs.table.toggleRowSelection(value, true);
                                checkID.push(value.UserId);
                                checkName.push(value.Name)
                                checkJson.push(value);
                            }
                        });
                        this.checkUserArray = checkJson;
                    });
                },
                immediate: true
            }
        },

        data() {
            return {
                filterText: '',
                defaultProps: {
                    children: 'children',
                    label: 'Name'
                },
                tableHeight:0,
                // tableData:[],
                checkUserArray: [],
                checkUserData: {
                    checkUserId: [],
                    checkNameId: [],
                    checkOragnId: []
                },
                userData: [],
                search:{
                  userName:'',
                  depName:''
                }, // 搜索关键字
                pageNation:{
                  total:0,
                  page:1,
                  limit:20
                },
                getRowKey(row){
                  return row.UserId
                }
            }
        },
        created() {
            this.getUserList()
        },
        mounted(){
          this.$nextTick(()=>{
            this.tableHeight = this.$refs.setUser.clientHeight - 216
            this.tableHeight = this.tableHeight < 330 ? 330 : this.tableHeight
          })
        },
        methods: {
            // 获取人员列表
            getUserList() {
                if(this.AreaCode.length <= 0){
                    let p = {
                      PageNo: this.pageNation.page,
                      PageSize: this.pageNation.limit,
                      KeyWord:  this.search.userName,
                      DeptName: this.search.depName
                    }
                    this.$api.GetEmployeeInfoByOrgIdPager(p).then( res => {
                        if(res.IsSuccess){
                            this.pageNation.total = res.Data
                            this.userData = res.Content;
                            // this.tableData = res.Content
                        }
                    });
                } else {
                    let dataInfo = {
                        AreaCode:this.AreaCode
                    }
                    this.$api.GetUserByAreaCode(dataInfo).then( res => {
                        if(res.IsSuccess){
                            this.userData = res.Content;
                            // this.tableData = res.Content

                        }
                    });
                }
            },
            getCheckedKeys(data, node, self) {
              this.checkUserArray = this.checkUserArray;
            },
            // 搜索
            Search(){
              this.pageNation.page = 1
              this.getUserList()
            },
            /**
             * 选中人员
             */
            handleSelectionChange(selection, row) {
                if (checkID.indexOf(row.UserId) == -1) {
                    checkID.push(row.UserId);
                    checkName.push(row.Name);
                    checkJson.push(row);
                } else {
                    let index = checkID.findIndex(v => v === row.UserId);
                    checkID.splice(checkID.findIndex(v => v === row.UserId), 1);
                    checkName.splice(checkName.findIndex(v => v === row.Name), 1);
                    checkJson.splice(index, 1);
                }
                console.log(checkJson)

                this.checkUserArray = checkJson;
            },
            // 全选
            handleSelectionAll(selection) {
              console.log(selection)
                selection.forEach(function (item) {
                    if (checkID.indexOf(item.UserId) == -1) {
                        checkID.push(item.UserId);
                        checkName.push(item.Name);
                        checkJson.push(item);
                    }
                });
                if (selection.length == 0) {
                    checkID.splice(-this.userData.length);
                    checkName.splice(-this.userData.length);
                    checkJson.splice(-this.userData.length);
                }
                this.checkUserArray = checkJson;

            },
            // 确定
            userDialogFn(){
                this.$emit('checkUserData',checkJson)
                this.clearData()
            },
            // 取消
            closeUserDialog(){
                this.$emit('checkUserData',null);
                this.clearData()
            },
            clearData(){
                checkID = [];
                checkJson = [];
                this.checkUserArray = [];
                this.search = {
                  userName: '',
                  depName: ''
                }
                this.pageNation.page = 1
                this.getUserList()
                this.$refs.table.clearSelection()
            },
            // 姓名处理
            replaceName(senderName) {
                let Regx = /^[A-Za-z]*$/;
                if (Regx.test(senderName)) {
                    senderName = senderName.substring(0, 2);
                } else {
                    senderName = senderName.substring(senderName.length - 2, senderName.length);
                }
                return senderName;
            },
            // 分页
            PageChange(v){
              this.pageNation.page = v.page
              this.pageNation.limit = v.limit
              this.getUserList()
            },

            removeCheck(k){
              this.$refs.table.toggleRowSelection(k,false)
              this.checkUserArray = this.checkUserArray.filter(i => i.UserId != k.UserId)
              checkJson = checkJson.filter(i => i.UserId != k.UserId)
              checkID = checkID.filter(i => i.UserId != k.UserId)
            }
        },
        // mounted() {
        //     let _this = this;
        //     this.userData.forEach((value, index) => {
        //         if (this.defaultCheckuserId.indexOf(value.UserId) != -1) {
        //             this.$refs.table.toggleRowSelection(value, true);
        //             checkID.push(value.UserId);
        //             checkName.push(value.Name)
        //             checkJson.push(value);
        //         }
        //     });
        //     this.checkUserArray = checkJson;
        // },
        computed:{
            tableData () {
                const search = this.searchCurrent
                if (search) {
                    return this.userData.filter(data => {
                        return Object.keys(data).some(key => {
                            return String(data.Name).toLowerCase().indexOf(search) > -1 ||
                                   String(data.DepartmentName).indexOf(search) > -1 ||
                                   String(data.RoleInfoRemark).indexOf(search) > -1
                        })
                    })
                }
                return this.userData
            }
        },
    };
</script>
<style scoped lang="scss">
   /deep/ .el-badge sup{
      right: 20px;
    }
    p {
        margin-top: 0;
    }

    .setUser {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        flex-direction: column;
    }

    .checkUser {
        display: -webkit-flex;
        display: flex;
        -webkit-flex-flow: row nowrap;
        overflow-x: auto;
        padding-top: 6px;

      .user {
          width: 80px;
          height: 76px;
          text-align: center;
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          position: relative;
          .name-img {
              display: inline-block;
              width: 40px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              color: #fff;
              background: #00a5e0;
              border-radius: 50%;

          }

          .name {
              display: block;
              padding: 0 5px;
              width: 80px;
              height: 32px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
          }
          i{
            position: absolute;
            top: 0;
            right: 0;
            cursor: pointer;
            color: red;
            border-radius: 50%;
            font-size: 12px;
            padding: 2px;
          }
        }
    }
    /*头像随机颜色样式*/
    .color1 {
        background: #2196f3;
    }

    .color2 {
        background: #03a9f4;
    }

    .color3 {
        background: #00bcd4;
    }

    .color4 {
        background: #009688;
    }

    .color5 {
        background: #4caf50;
    }

    .color6 {
        background: #8bc34a;
    }

    .color7 {
        background: #cddc39;
    }

    .color8 {
        background: #ffc107;
    }

    .color9 {
        background: #ff9800;
    }

    .color10 {
        background: #9e9e9e;
    }

    .color11 {
        background: #607d8b;
    }
</style>
<style>
    .setUserWrap{
      padding:0 15px;
      height: calc(100% - 20px);

    }
    .setUserWrap .el-tree-node__expand-icon {
        font-size: 16px;
    }

    .setUserWrap .el-tree-node__label {
        font-size: 15px;
    }

    .setUserWrap .el-tree-node__label {
        position: relative;
        padding-left: 23px;

    }

    .setUserWrap .el-tree-node__label:after {
        content: '';
        width: 26px;
        height: 25px;
        position: absolute;
        top: -4px;
        left: -5px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABSklEQVRoQ+1Yy3HCQAx9YoblwCl3u4hUAHQQL41ABSkhoQMogJB0QDpICcwE7pzhIAYuCQd/diVPbEe+rqTV+8xau4SWf9Ty/mEA/lpBU8AUEDJgFhISKE7vvgKbw/mZmcdVqCJgniXuq0qsVkyhAuv9aUbAS/XNeEdD95g90LF6jiyyEMDb92kLwihwi4VP3CwwJzq8DgAgpkmW9rfRXQUk1gIAjCMTlj2SWYmZdz5xqyI89QAIYLAslIH5NHGveXGNBwDmD58OnloMAJ8+dbnHeAsUEAAo82cT1rs9SkT+yHSFYYGFDICGFqZA+DCnwftPDVPAFBA6yixkFjIL/eNx2mYhof1v6ZJjNPxhS6Pj+xqiS/211A0EI/dSrd/yrzGI8F70InGN7PaNrE52tWqbAlpMxtYxBWKZ08ozBbSYjK1jCsQyp5V3ATiGpzGLeb/pAAAAAElFTkSuQmCC) no-repeat;
        background-size: 100% 100%;

    }
</style>
