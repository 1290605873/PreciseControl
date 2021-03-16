<template>
    <div class="setOrganWrap">
        <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
        </el-input>
        <el-scrollbar>
            <el-tree
                class="filter-tree"
                show-checkbox
                node-key="Id"
                ref="tree"
                highlight-current
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                @check="getCheckedKeys"
                :default-checked-keys="defaultCheckOragnId"
                style="height:500px;">
            </el-tree>
        </el-scrollbar>
    </div>
</template>
<script>
   /**
     * @module set-organ
     * @desc   选择组织
     * @author jinsh
     * @date   2019/3/10
     * @param  {checkOragnData} [Function] - 返回选中的部门ID和Name
     * @param  {defaultCheckOragnId} [Array] 默认选中的部门Id 可用于回显数据
     * @example 调用示例
     *   <set-organ @checkOragnData="checkOragnData" :defaultCheckOragnId="defaultCheckOragnId"></set-organ>
     * 
     */

export default {
    name:'set-organ',
    props: {
        defaultCheckOragnId:{         
            type: Array,
            default: function(){}               
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    data() {
        return {
            filterText:'',
            defaultProps:{
                children: 'children',       
                label: 'Name'
            },
            treeData:[]
        }
    },
    created(){
        this.getTreeData();          
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.Name.indexOf(value) !== -1;
        },
        getTreeData(){
            this.$api.GetDepartmentlistAsync({}).then( res => {
               if(res.IsSuccess){
                   this.treeData = this.toTree(res.Content);
               }
            });       

        },
        toTree(data) {
            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            let map = {};
            data.forEach(function (item) {
                map[item.Id] = item;
            });
            let val = [];
            data.forEach(function (item) {
                // 以当前遍历项，的pid,去map对象中找到索引的id
                let parent = map[item.ParentId];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                    val.push(item);
                }
            });
            return val;
        },
        getCheckedKeys(){          
            let checkData = this.$refs.tree.getCheckedNodes(true);
            let checkOragnId = new Array();
            let checkOragnName = new Array();
            checkData.forEach(function (value) {
                checkOragnId.push(value.Id);
                checkOragnName.push(value.Name);
            });
            this.$emit('checkOragnData',{'checkOragnId':checkOragnId.join(','),'checkOragnName':checkOragnName.join(',')});
        }
    }
};
</script>
<style>
    .setOrganWrap .el-tree-node__expand-icon{
        font-size:16px;
    }
    /* .setOrganWrap .expanded:after{
        content:'';
        width:30px;
        height:25px;
        position: absolute;
        top:0;
        left:0;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABSklEQVRoQ+1Yy3HCQAx9YoblwCl3u4hUAHQQL41ABSkhoQMogJB0QDpICcwE7pzhIAYuCQd/diVPbEe+rqTV+8xau4SWf9Ty/mEA/lpBU8AUEDJgFhISKE7vvgKbw/mZmcdVqCJgniXuq0qsVkyhAuv9aUbAS/XNeEdD95g90LF6jiyyEMDb92kLwihwi4VP3CwwJzq8DgAgpkmW9rfRXQUk1gIAjCMTlj2SWYmZdz5xqyI89QAIYLAslIH5NHGveXGNBwDmD58OnloMAJ8+dbnHeAsUEAAo82cT1rs9SkT+yHSFYYGFDICGFqZA+DCnwftPDVPAFBA6yixkFjIL/eNx2mYhof1v6ZJjNPxhS6Pj+xqiS/211A0EI/dSrd/yrzGI8F70InGN7PaNrE52tWqbAlpMxtYxBWKZ08ozBbSYjK1jCsQyp5V3ATiGpzGLeb/pAAAAAElFTkSuQmCC) no-repeat;
        background-size:100% 100%;
    } */
    .setOrganWrap .el-tree-node__label{
        font-size: 15px;
    }
    .setOrganWrap .el-checkbox{
        font-size: 19px;
    }
</style>



