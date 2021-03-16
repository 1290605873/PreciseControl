<template>
    <div class="main-container rewardManage">
        <div>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input size="small" v-model="mainGridTable.param.StoreName" placeholder="请输入门店名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="mainGridTable.param.ComplaintState" placeholder="请选择状态">
                        <el-option label="待审核" value="2000"></el-option>
                        <el-option label="审核通过" value="3020"></el-option>
                        <el-option label="驳回" value="3030"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                              class="com-width"
                              type="date"
                              placeholder="请选择开始时间"
                              :picker-options="pickerOptions0"
                              v-model="mainGridTable.param.StartDate"
                              value-format="yyyy-MM-dd"
                              style="300px"
                              >
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                            class="com-width"
                            type="date"
                            placeholder="请选择结束时间"
                            :picker-options="pickerOptions1"
                            v-model="mainGridTable.param.EndDate"
                            value-format="yyyy-MM-dd"
                            style="300px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="gueryList">搜 索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-box">
        <el-table
                v-loading="mainGridTable.Loading"
                :data="mainGridTable.list"
                border
                fit
                height="96%"
                highlight-current-row
                class="table">
            <el-table-column 
                label="序号" 
                type="index" 
                width="60" 
                align="center">
            </el-table-column>
            <el-table-column 
                label="提交申述时间" 
                prop="ComplaintDate"
                min-width="100px" 
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column 
                label="门店名称" 
                prop="StoreName"
                width="120px" 
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column 
                label="申诉理由" 
                prop="ComplaintExcuse"
                width="120px" 
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column 
                label="找茬图片" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-image :src="scope.row.AnswerImage" :preview-src-list="[scope.row.AnswerImage]"></el-image>
                </template>
            </el-table-column>
            <el-table-column 
                label="申诉凭证图片" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-image :src="scope.row.ComplaintImage" :preview-src-list="[scope.row.AnswerImage]"></el-image>
                </template>
            </el-table-column>
            <el-table-column 
                label="申诉状态" 
                prop="ComplaintStateRemark"
                min-width="120px" 
                show-overflow-tooltip>
                <!-- <template slot-scope="scope">
                    <span slot="reference">{{ scope.row.ComplaintState | ComplaintStateFilter}}</span>
                </template> -->
            </el-table-column>
            <el-table-column 
                label="申诉人" 
                prop="ComplaintUserName"
                min-width="100px" 
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column 
                label="审核人" 
                prop="AuditUserName"
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TopFindNum }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="审核时间" 
                prop="AuditDate"
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.SubDate }}</span>
                </template>
            </el-table-column>
            <el-table-column  
                label="操作" 
                min-width="140px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-if="scope.row.ComplaintState=='2000'">
                      <el-button type="primary" plain @click="rankBtn(scope.row,'1')">通过</el-button>
                      <el-button type="primary" plain @click="rankBtn(scope.row,'0')">驳回</el-button>
                    </div>
                    <div v-if="scope.row.ComplaintState=='3020'">
                      <el-button type="info" disabled>通过</el-button>
                    </div>
                    <div v-if="scope.row.ComplaintState=='3030'">
                       <el-button type="info" disabled>驳回</el-button>
                    </div>  
                </template>
            </el-table-column>
        </el-table>
        </div>
        <pagination 
        ref="pagination" 
        v-show="mainGridTable.total>0"
        :total="mainGridTable.total"
        :page.sync="mainGridTable.param.PageNo"
        :limit.sync="mainGridTable.param.PageSize"
        @pagination="gueryList"></pagination>
        <el-dialog
            title="填写驳回理由"
            :visible.sync="mainGridTable.dialogVisible"
            width="500px">
            <el-input type="textarea" v-model="mainGridTable.AuditExcuse"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="mainGridTable.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="rejectedSure()">确 定</el-button>
            </span>
            </el-dialog>
    </div>
    
</template>
<script>
import Pagination from '@/components/Pagination';

export default { 
    components: {
        Pagination
    },
    data() {
        return { 
            pickerOptions0: {
                    disabledDate: time => {
                        if (this.mainGridTable.param.EndDate) {
                            return time.getTime() > new Date(this.mainGridTable.param.EndDate).getTime()
                        }else{
                                return time.getTime() > Date.now();
                        }
                }
            }, 
            pickerOptions1: {
                disabledDate: time => {
                        if (this.mainGridTable.param.StartDate) {
                                return time.getTime() < new Date(this.mainGridTable.param.StartDate).getTime() - 86400000
                        }else{
                                return time.getTime() > Date.now();
                        }
                }
            },
            mainGridTable: { //主列表
                Loading: true,
                list: null,
                total: 10,
                AuditExcuse:'',//申诉理由
                dialogVisible: false,
                currentObj:{},//当前行对象
                param: {
                    StoreName:'',
                    ComplaintState:'',
                    StartDate:'',
                    EndDate:'',
                    PageNo: 1,
                    PageSize: 20
                },
            }, 
        }
    },
    created() {
        this.gueryList();
    },
    filters: {
        ComplaintStateFilter(value) {
            switch (value) {
                case 1000:
                return '待处理';
                case 2000:
                return '处理中';
                case 3010:
                return '已认可';
                case 3020:
                return '审核通过';
                case 3030:
                return '审核驳回';
                default:
                return '';
            }
        }
    },
    methods: {
        /**
         * 查询数据
         */
        gueryList() {
            let datas={
                    UserId:this.$utils.getUrlKey("userId"),
                    OrgId:this.$utils.getUrlKey("curChangeOrg"),
                    AppId:this.$utils.getUrlKey("appId"),
                    PageNo: 1,
                    PageSize: 20
                }
            let param= this.mainGridTable.param
            if(param.StoreName){
                datas.StoreName = param.StoreName
            }
            if(param.ComplaintState){
                datas.ComplaintState = param.ComplaintState
            }
            if(param.StartDate){
                datas.StartDate = param.StartDate
            }
            if(param.EndDate){
                datas.EndDate = param.EndDate
            }
            this.$api.GetImageAuditManageList(datas).then(res => {
                if (res.IsSuccess) {
                    this.mainGridTable.Loading = false;
                    if(res.Content && res.Content.length){
                        for(let item of res.Content){
                            if(item.SubDate!=null && item.SubDate!=''){
                                item.SubDate = item.SubDate.split(' ')[0]
                            }
                            
                        }
                    }
                    this.mainGridTable.list = res.Content;
                    this.mainGridTable.total = res.Data || 10;

                } else {
                    this.$message({
                        message: res.Message,
                        type: 'info',
                        duration: 1200,
                    });
                    this.mainGridTable.Loading = false;
                }
            }).catch(r=>{
                this.mainGridTable.Loading = false;
            });
            
            
        },
        /**
         * 图片审核通过以及驳回
         */
        rankBtn:function(obj,val){
            if(val=='1'){
                this.$confirm('申诉成功', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    let datas={
                        "Id": obj.Id,
                        "UserId": this.$utils.getUrlKey("userId"),
                        "ComplaintState": 3020,
                    }
                    this.$api.SubmitImageAuditPassExcuseData(datas).then(res => {
                        if (res.IsSuccess) {
                            this.gueryList();
                            this.$message.success('申诉成功')
                        }else{
                            this.$message.error('申诉失败')
                        } 
                    }).catch(r=>{
                        this.$message.error('申诉失败')
                    });
             }).catch(() => {});
            }else{
                this.mainGridTable.dialogVisible=true
                this.mainGridTable.currentObj=obj
                // this.$prompt('请填写驳回理由', '', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                // }).then(({ value }) => {
                //     if(value && value.length>30){
                //         this.$message.error('不能超过30个字')
                //     }else if(!value){
                //         this.$message.error('不能为空')
                //     }else{
                //         datas.AuditExcuse=value
                //         this.$api.GetImageAuditManageList(datas).then(res => {
                //             if (res.IsSuccess) {
                //                 this.gueryList();
                //                 this.$message.success('驳回成功')
                //             }else{
                //                 this.$message.error('驳回失败')
                //             }
                //         }).catch(r=>{
                //             this.$message.error('驳回失败')
                //         });
                //     }
                // }).catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '取消输入'
                //     });       
                // }); 
            }  
        },
        rejectedSure() {
            let currentObj=this.mainGridTable.currentObj
            let value=this.mainGridTable.AuditExcuse
            let datas={
                "Id": currentObj.Id,
                "UserId": this.$utils.getUrlKey("userId"),
                "ComplaintState": 3030,
                "AuditExcuse":value
            }
            if(value && value.length>30){
                this.$message.error('不能超过30个字')
            }else if(!value){
                this.$message.error('请填写驳回理由')
            }else{
                this.$api.SubmitImageAuditPassExcuseData(datas).then(res => {
                    if (res.IsSuccess) {
                        this.gueryList();
                        this.$message.success('驳回成功')
                        this.mainGridTable.dialogVisible=false
                    }else{
                        this.$message.error('驳回失败')
                    }
                }).catch(r=>{
                    this.$message.error('驳回失败')
                });
            }
        }
        
    }   
}
</script>
<style scoped type="text/scss" lang='scss'>

    // .main-container {
    //     padding-top: 14px;
    //     width: 100%;
    //     height: 100%;
    //     @include box(box);
    //     @include box-orient(vertical);
    //     .el-middle {

    //         padding-bottom: 10px;
    //     }

    // }
    .main-container,.rewardManage{
        width: 100%;
        height: 100%;
        font-size: 16px;
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
    .table-box {
        flex:1;
    }
    .rewardManage{
        width:100%;
        height:100%
    }
    .rewardConfig{
        margin:0 auto;
        width:50%;
    }
    
</style>

<style type="text/scss" lang="scss">
 
    .rewardManage .addConfig .el-dialog .el-dialog__body {
        height:calc(100% - 50px);
        overflow: auto !important;
    }
    
    .rewardManage{
        .el-dialog__body{
            height: 100%；
        }
        .el-table__header-wrapper {
            overflow: hidden;
        }
        .el-table__body-wrapper {
            overflow-y: auto !important;
        }
        .el-form-item__label{
            text-align:center;
        }
    }
    .startTime{
        width:160px;
        display: inline-block;
    }
    .endTime{
        width:160px;
        display: inline-block;
    }
    .defaultPrice {

        .el-form-item__content{
            line-height:20px;
        }
    }
    .btn-box{
        .el-form-item__content{
            margin-left:0 !important;
            div{
                text-align:center;
                margin-top:40px;
            }
        }
        //text-align: center;
        //position: fixed;
        //margin-bottom: 35px;
        //width: calc(100% - 60px);
    }
    .rankDialog {
        .el-dialog__body{
            height: calc(100% - 100px);
        }
    }
</style>

