<template>
    <div class="rankingList">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-input 
                    clearable
                    placeholder="请输入用户账号" 
                    v-model="account">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size='middle' @click="gueryRankList(1)">搜 索</el-button>
            </el-form-item>
        </el-form>
        <div class="table-box">
            <el-table
                v-loading="subGridTable.Loading"
                :data="subGridTable.list"
                border
                fit
                height="96%"
                highlight-current-row
                class="table ranktable">
                <el-table-column 
                    label="排名" 
                    type="index" 
                    width="80" 
                    align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.OrderNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="账号" 
                    min-width="100px" 
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.UserAccount }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="获得金额" 
                    min-width="100px" 
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.AwardAmountCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="获得金额池" 
                    min-width="100px" 
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.AwardPrizePool }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="已找茬图片数" 
                    min-width="100px" 
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.FindNum }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination 
                ref="pagination" 
                v-show="subGridTable.total>0"
                :total="subGridTable.total"
                :page.sync="subGridTable.param.PageNo"
                :limit.sync="subGridTable.param.PageSize"
                @pagination="gueryRankList"></pagination>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination';
export default {
    components: {
        Pagination,
    },
    props:{
        rankObj:{
            type:Object,
            default:{}
        }
    },
    data() {
        return {
            account:'',
            subGridTable: { //主列表
                Loading: true,
                list: null,
                total: 0,
                param: {
                    PageNo: 1,
                    PageSize: 20
                },

            },
        }
    },
    created() {
        this.gueryRankList();
    },
    methods:{
        /**
         * 查询数据
         */
        gueryRankList(type) {
            let UserAccount = '';
            if(type == 1){
                UserAccount = this.account;
            }else{
                UserAccount = '';
            }
            let data = {
                "UserAccount": UserAccount,
                "PageNo": this.subGridTable.param.PageNo,
                "PageSize": this.subGridTable.param.PageSize,
                "OrgId": this.$utils.getUrlKey("curChangeOrg"),
                'DateTag':this.rankObj.DateTag,
                //"AppId": this.$utils.getUrlKey("appId"),
                "UserId": this.$utils.getUrlKey("userId")
            }
            this.$api.GetImageLeaderBoard(data).then(res => {
                if (res.IsSuccess) {
                    this.subGridTable.Loading = false;
                    if(res.Content == null){
                        this.$message({
                            message: '无查询数据',
                            type: 'info',
                            center:true,
                            duration: 1200,
                        });
                        this.subGridTable.list = [];
                        return;
                    }
                    this.subGridTable.list = res.Content;
                    this.subGridTable.total = res.Data;

                } else {
                    this.$message({
                        message: res.Message,
                        type: 'info',
                        duration: 1200,
                    });
                    this.subGridTable.Loading = false;
                }
            }).catch(r=>{
                this.subGridTable.Loading = false;
            });
        },
    }
}
</script>
<style lang="scss" scoped>
    .rankingList{
        width:100%;
        height:100%;
        flex-direction: column;
        padding-left: 10px;
        display: flex;
    }
    .table-box {
        flex:1;
    }
    .el-table--border {
        overflow-y: auto;
    }
</style>
<style lang="scss">
    .ranktable{
        .el-dialog__body{
            height: calc(100vh - 50px);
        }
        .el-table__header-wrapper {
            overflow: hidden;
        }
        // .el-table--scrollable-y .el-table__body-wrapper {
        //     overflow-y: auto !important;
        // }
        .el-table__body-wrapper { 
            overflow-y: auto !important;
        }
    }
</style>