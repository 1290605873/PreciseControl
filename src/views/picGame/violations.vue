<template>
    <div class="main-container violations">
        <div>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input 
                        v-model="mainGridTable.param.Name" 
                        placeholder="请输入违规项名称" 
                        clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  @click="gueryList">搜 素</el-button>    
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button type="primary"  @click="createQuestion(1)">新增问题点</el-button> 
                </el-form-item>
            </el-form>
        </div>
        <div class="table-box">
        <el-table
                v-loading="mainGridTable.Loading"
                :data="mainGridTable.list"
                border
                fit
                highlight-current-row
                height="96%"
                class="table">
            <el-table-column 
                label="序号" 
                type="index" 
                width="80" 
                align="center">
            </el-table-column>
            <el-table-column
                label="名称" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.Name }}</span>
                </template>
            </el-table-column>
            <el-table-column  
                label="操作" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button type="primary" plain @click="editViolation(scope.row)">编辑</el-button>
                    <!-- <el-button type="primary" plain @click="delTask(scope.row.Id)">删除</el-button> -->
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
        <!--新增配置-->
        <el-dialog
                :close-on-click-modal='false'
                :title="ruleForm.title"
                :visible.sync="ruleForm.show"
                style="width:30%;"
                fullscreen
                top="5vh"
                v-if="ruleForm.show"
                >
            <div style="width:100%;height:200px;">
                <el-form 
                    :inline="true" 
                    class="demo-form-inline" 
                    :model="ruleForm" 
                    :rules="rules" 
                    ref="ruleForm">
                    <el-form-item 
                        label="问题点名称" 
                        prop="questName"
                        placeholder="请填写(少于7个字)">
                        <el-input v-model="ruleForm.questName" clearable></el-input>
                    </el-form-item>
                </el-form>
                
            </div>
            <div 
                    slot="footer" 
                    class="dialog-footer footBtn">
                    <el-button @click="cancle">取 消</el-button>
                    <el-button type="primary" @click="confirm('ruleForm')"> 确 定</el-button>
                </div>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination';

    export default {
        components: {
            Pagination,
        },
        data() {
            return {
                mainGridTable: { //主列表
                    Loading: true,
                    list: null,
                    total: 0,
                    param: {
                        Name: "",
                        Type: 3,
                        PageNo: 1,
                        PageSize: 20
                    }
                },
                ruleForm:{
                   
                    show:false,
                    title:'',
                    questName:''
                },
                currentEditId:'',
                rules:{
                    questName: [
                        { required: true, message: '请输入问题点名称', trigger: 'blur' },
                        { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
                    ],
                }
                
            }
        },
        created() {
            this.gueryList();
        },
        methods: {
            /**
             * 查询数据
             */
            gueryList() {
                this.$api.GetViolationsList(this.mainGridTable.param).then(res => {
                    if (res.IsSuccess) {
                        this.mainGridTable.Loading = false;
                        if(res.Content == null){
                            // this.$message({
                            //     message: '无查询数据',
                            //     type: 'info',
                            //     center:true,
                            //     duration: 1200,
                            // });
                            this.message('暂无数据',2);
                            this.mainGridTable.list = [];
                            return;
                        }
                        this.mainGridTable.list = res.Content;
                        this.mainGridTable.total = res.Data;

                    } else {
                        // this.$message({
                        //     message: res.Message,
                        //     type: 'info',
                        //     duration: 1200,
                        // });
                        this.mainGridTable.list = [];
                        this.mainGridTable.total = 0;
                        this.mainGridTable.Loading = false;
                    }
                }).catch(r=>{
                    this.mainGridTable.Loading = false;
                });
            },
            /**
             * 新增问题点
             */
            createQuestion(type) {
                this.ruleForm.questName = '';
                this.ruleForm.show = true;
                this.ruleForm.title = '新增问题点';
                
            },
            /**
             * 编辑问题点
             */
            editViolation(row){
                this.ruleForm.show = true;
                this.ruleForm.title = '编辑问题点';
                this.ruleForm.questName = row.Name;
                this.currentEditId = row.Id;
                //this.getViolationsById(row.Id);
            },
            /**
             * 删除任务
             */
            delTask(Id){
                   this.$confirm('确定要删除该违规项吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let data = {
                            "Id": Id
                        }
                        this.$api.DeleteViolations(data).then(res=>{
                            if(res && res.IsSuccess){
                                let _this = this;
                                this.$message({
                                    message: '删除成功',
                                    type: 'success',
                                    duration: 1200,
                                    center: true,
                                    onClose(){
                                        _this.gueryList();
                                    }
                                });
                                this.gueryList();
                            }else{
                                this.$message({
                                    message: res.Message,
                                    type: 'error',
                                    duration: 1200,
                                    center: true
                                });
                            }
                        }).catch(error=>{

                        })
                        
                    }) 
                //}
                
                
            },
            cancle(){
                this.ruleForm.show = false;
            },
            /**
             * 保存
             */
            confirm(formName) {
                // if(this.addQuestion.questName.length == 0){
                //     this.message('请输入问题点名称',-1);
                // }else if(this.addQuestion.questName.length >7){
                //     this.message('请输入小于7个字的问题点名称',-1);
                // }else{
                //     this.saveViolations();
                // }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.saveViolations();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                
            },
            /**
             * 保存违规项
             */
            saveViolations() {
                let data = {};
                if(this.ruleForm.title == '新增问题点'){
                    data = {
                        Name:this.ruleForm.questName
                    }
                }else{
                    data = {
                        Id:this.currentEditId,
                        Name:this.ruleForm.questName
                    }
                }
                this.$api.SaveViolations(data).then(res =>{
                    if(res.IsSuccess){
                        this.message(res.Message ==null || res.Message == ''?'保存成功':res.Message,1);
                        this.ruleForm.show = false;
                        this.gueryList();
                    }
                    else{
                        this.message(res.Message ==null || res.Message == ''?'保存失败':res.Message,-1);
                    }
                }).catch(error =>{

                })

            },
            
            
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
    .main-container,.violations{
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
    .violations{
        .el-dialog__wrapper{
            height:400px;
            margin:auto;
        }
        .pagination-container{
            padding:32px 0
        }
        .footBtn{
            margin-top:40px;
        }
    }
</style>

<style type="text/scss" lang="scss">
    .violations{
        // .el-dialog__body{
        //     height: calc(100vh - 50px);
        // }
        .el-table__header-wrapper {
            overflow: hidden;
        }
        .el-table--scrollable-y .el-table__body-wrapper {
            overflow-y: auto;
        }
        
    }
    .violations .el-table__fixed-right{
            height: 100% !important; 
        }
    .violations .table-box{
        .el-table{
            height:calc(100% - 7px)
        }
    }
</style>
