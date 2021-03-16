<template>
    <div class="setUserWrap">
        <p>已选：</p>
        <div class="checkUser">
            <div v-for="item in checkUserArray"
                 :key="item.UserId">
                <div class="user" v-if="item.UserName">
                    <span :class="['name-img']" v-text="replaceName(item.UserName)"></span>
                    <span class="name" v-if="item.UserName">{{item.UserName}}</span>
                </div>
            </div>

        </div>
        <p>选择：</p>
        <div class="setUser" style="height:400px;">
           
                <el-scrollbar style="width:400px;">
                    <el-tree
                            class="filter-tree"
                            ref="tree"
                            node-key="Code"
                            accordion
                            :expand-on-click-node="false"
                            :data="treeData"
                            :props="defaultProps"
                            @node-click='nodeClick'
                            style="border:1px solid #ccc;min-height:400px;">
                    </el-tree>
                </el-scrollbar>
           
            <div class="right" style="margin-left:20px;width:100%;">
                <el-table
                        :data="userData"
                        border
                        width="100%"
                        :row-key="getRowKeys"
                        height="400px"
                        @selection-change="handleSelectionChange"                          
                        ref="table">
                    <el-table-column type="index" width="40" align="center"></el-table-column>
                    <el-table-column type="selection" reserve-selection width="55">
                    </el-table-column>
                    <el-table-column label="职员姓名" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.UserName }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        
        <span slot="footer" class="dialog-footer" style="margin-top:10px;text-align:center;width:100%;display:block;">
            <el-button @click="cancelUserData">取 消</el-button>
            <el-button type="primary" style="margin-left: 20px" @click="savaUserData">确 定</el-button>
        </span>
    </div>
</template>
<script>
    /**
     * @module set-user
     * @desc   选择组织
     * @author jinsh
     * @date   2019/3/10
     * @param  {checkOragnData} [Function] - 返回选中的部门ID和Name
     * @param  {defaultCheckuserId} [Array] 默认选中的UserId 可用于回显数据
     * @example 调用示例
     *   <set-organ @checkOragnData="checkOragnData" :defaultCheckuserId="defaultCheckuserId"></set-organ>
     *
     */
    let checkID = [];
    let checkJson = [];
    export default {
        name: 'area-or-user',
        props: {
            defaultCheckuserId: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        data() {
            return {
                filterText: '',
                defaultProps: {
                    children: 'children',
                    label: 'Name'
                },
                checkUserArray: [],
                userData: [],
                topNode: {//顶级节点
                    Code: '',
                    Name: ''
                },
                defaultExpand:[],
                treeData:[],
                userDataParme:{
                    "UserName": '',
                    "UserPhone": '',
                    "AreaLevel": '',
                    "AreaCode": '',
                    "OperateTypeId": '',
                    "BusinessId": '',
                    "PageNo": 1,
                    "PageSize": 2000,
                    "RoleId": ''
                },
                userDataTotal:0,
                currentNode: null,
                defaultData:this.$store.state.setCheckUserDate,
                area: {
                    provience: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    },
                    city: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    },
                    town: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    },
                    street: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    },
                    community: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false,
                    },
                    businessDistrict: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    }
                },
            }
        },
        created() {
            debugger;
            this.getCityCode();
            if(this.defaultCheckuserId!=null&&this.defaultCheckuserId.length>0){
                this.checkUserArray = this.defaultCheckuserId;
            }

            //this.getTreeData();
        },
        methods: {
            getRowKeys(row){
                return row.UserId;
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.Name.indexOf(value) !== -1;
            },          
            getTreeData() {
                // this.$api.GetAreaInfoList(0).then(res => {                  
                //     if (res && res.IsSuccess) {
                //         this.treeData= this.toTree(res.Content);               
                //     }
                // }).catch(r => {

                // });
                this.$api.GetAreaInfoList(0,this.$utils.getUrlKey('userId')).then(res => {
                    if (res && res.IsSuccess) {
                        //对数据过滤  按默认省市区
                        this.treeData = [];
                      
                        //this.tree.defaultExpand = [];
                        let locations = this.toTree(res.Content);
                        // this.$utils.consoleObj(locations);
                     
                        for (let iii of locations) {
                            if (this.area.town.code != null && this.area.town.code.length > 0 && this.area.town.disable) {//区级的应用
                                //找到省市、再找到区数据
                                if (iii.Code == this.area.provience.code) {
                                    for (let kkk of iii.children) {
                                        if (kkk.Code == this.area.city.code) {
                                            for (let jjj of  kkk.children) {
                                                if (jjj.Code == this.area.town.code) {
                                                    this.treeData.push(jjj);
                                                   // this.tree.defaultExpand.push(jjj.Code);
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                            } else if (this.area.city.code != null && this.area.city.code.length > 0 && this.area.city.disable) {//市级的应用
                                //找到省市、再找到区数据
                                if (iii.Code == this.area.provience.code) {
                                    for (let kkk of iii.children) {
                                        if (kkk.Code == this.area.city.code) {
                                            this.treeData.push(kkk);
                                          
                                            break;
                                        }
                                    }
                                    break;
                                }
                            } else if (this.area.provience.code != null && this.area.provience.code.length > 0 && this.area.provience.disable) {
                                if (iii.Code == this.area.provience.code) {
                                    this.treeData.push(iii);
                                    
                                    break;
                                }
                            }
                        }
                        if (this.treeData.length > 0) {
                            this.currentNode = {//当前显示（选中）节点
                                Code: this.treeData[0].Code,
                                IsChecked: false,
                                Level: this.treeData[0].Level,
                                Name: this.treeData[0].Name,
                                ParentCode: this.treeData[0].ParentCode,
                            };
                        }
                      
                    }
                }).catch(r => {

                });
            },
            toTree(data) {
                // 将数据存储为 以 id 为 KEY 的 map 索引数据列
                let map = {};
                data.forEach(function (item) {
                    map[item.Code] = item;
                });
                let val = [];
                data.forEach(item => {
                    // 以当前遍历项，的pid,去map对象中找到索引的id
                    let parent = map[item.ParentCode];
                    // window.console.log("parent:"+parent.Code);
                    if (parent) {
                        (parent.children || (parent.children = [])).push(item);
                    } else {
                        //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                        // this.$utils.consoleObj(item);//顶级节点
                        this.topNode.Name = item.Name;
                        this.topNode.Code = item.Code;
                        //默认展开一个顶级
                        // this.tree.defaultExpand.push(item.Code);
                        val.push(item);
                    }
                });
                return val;
            },
            nodeClick(data, node, self) {
                this.currentNode = {//当前显示（选中）节点
                    Code: data.Code,
                    IsChecked: false,
                    Level: data.Level,
                    Name: data.Name,
                    ParentCode: data.ParentCode,
                };     
                this.checkUserArray = this.checkUserArray;
                this.getUserRoleList();
                //this.checkUserArray =  this.$store.state.setCheckUserDate;
               
            },
            getUserRoleList(){
                this.userDataParme.AreaLevel = this.currentNode.Level;
                this.userDataParme.AreaCode = this.currentNode.Code;
                this.$api.GetUserRoleList(this.userDataParme).then(res => {
                    if (res && res.IsSuccess) {
                        this.userDataTotal = res.Total;

                        this.userData = res.Data  
                            
                    } else {
                        this.userDataTotal = 0;
                        this.userData = [];
                    }
                }).catch(r => {

                });
            },
             getCityCode() {
                this.$api.GetCityCode().then(res => {
                    if (res) {
                        for (let item_ of res) {
                            if (item_.Level == "1") {
                                if (item_.CityCode.length > 0) {
                                    this.area.provience.code = item_.CityCode;
                                    this.area.provience.disable = true;
                                }
                            } else if (item_.Level == "2") {
                                if (item_.CityCode.length > 0) {
                                    this.area.city.code = item_.CityCode;
                                    this.area.city.disable = true;
                                }

                            } else if (item_.Level == "3") {
                                if (item_.CityCode.length > 0) {
                                    this.area.town.code = item_.CityCode;
                                    this.area.town.disable = true;
                                }

                            }
                        }
                        this.getTreeData();
                    }
                }).catch(r => {
                })
            },
            /**
             * 选中人员
             */
            handleSelectionChange(selection) {          
                this.checkUserArray = selection;
            },
            /**
             * 点击确定
             */
            savaUserData(){              
                this.$emit('checkUserData',this.checkUserArray);
            },
            /**
             * 点击取消
             */
            cancelUserData(){
                this.$emit('checkUserData',null);
            },
            clearData(){
                checkID = [];
                checkJson = [];
                this.userData = [];
                this.checkUserArray = [];
            },
            replaceName(senderName) {
                let Regx = /^[A-Za-z]*$/;
                if (Regx.test(senderName)) {
                    senderName = senderName.substring(0, 2);
                } else {
                    senderName = senderName.substring(senderName.length - 2, senderName.length);
                }
                return senderName;
            },
        },
        watch:{
            'userData':{
                 handler(newName, oldName) {
                        this.$nextTick(()=>{
                            let selectArr = [];
                            for(let item of  this.userData){
                                if(this.defaultCheckuserId.indexOf(item.UserId) != -1) {
                                    this.$refs.table.toggleRowSelection(item, true);
                                    selectArr.push(item);
                                }            
                            }
                            if(selectArr.length>0){
                                // this.checkUserArray = selectArr;
                            }

                        });
                 }
            },
            immediate: true
        }
        // mounted() {
        //     let _this = this;
        //      let obj= {"UserName":"马如枚"}
        //         this.$refs.table.toggleRowSelection(obj, true);
        // },
      
    };
</script>
<style scoped lang="scss">
    p {
        margin-top: 0;
    }
    .right{
        -webkit-box-flex:1;
    }
    .setUser {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;

    }

    .checkUser {
        display: -webkit-flex;
        display: flex;
        -webkit-flex-flow: row nowrap;
        overflow-x: auto;
        padding-top: 7px;
        height:87px;

    .user {
        width: 80px;
        height: 80px;
        text-align: center;

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
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    }
    }
</style>
<style>

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



