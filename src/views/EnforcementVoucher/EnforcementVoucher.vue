<template>
    <div class="EnforcementVoucher">
        <div>
            <el-button
                    style="margin: 20px"
                    type="primary"
                    @click="addBtn()">
                添 加
            </el-button>
        </div>
        <div>
            <el-table
                    highlight-current-row
                    v-loading="loading"
                    :data="tableData"
                    border
                    style="width: 90%;margin:0 20px;"
                    class="enforceTable">
                <el-table-column label="序号" type="index" width="50px">

                </el-table-column>
                <el-table-column label="名称" property="CertName">

                </el-table-column>
                <el-table-column label="是否启用" property="IsEnable == false?'否':'是'">
                    <template slot-scope="scope">
                        <span>{{ scope.row.IsEnable == false?'否':'是' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="显示阶段">
                    <template slot-scope="scope">
                        <span>{{scope.row.ViewStage}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                plain
                                ize="mini"
                                @click="editBtn(scope.$index)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                :title="title"
                style=""
                :visible.sync=addDialog.show
                @close="closeIcon('ruleForm')">
            <el-form
                    ref="ruleForm"
                    :model="ruleForm"
                    label-width="120px"
                    :rules="rules">
                <el-form-item label="执法凭证单名称" prop="Name">
                    <el-input
                            v-model.trim ="ruleForm.Name"
                            maxlength="30"
                            show-word-limit>
                    </el-input>
                </el-form-item>
                <el-form-item
                        label="执法部门名称"
                        prop="Department">
                    <el-input
                            v-model.trim="ruleForm.Department"
                            maxlength="30"
                            show-word-limit>
                    </el-input>
                </el-form-item>
                <el-form-item
                        label="备注显示阶段"
                        prop="ViewStage">
                    <el-radio-group v-model="ruleForm.ViewStage">
                        <el-radio :label="1">执法整改之后</el-radio>
                        <el-radio :label="2">巡查进行时</el-radio>
                        <el-radio :label="3">巡查结束之后</el-radio>
                        <el-radio :label="4">巡查开始之前</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        label="上传执法盖章"
                        prop="SealId">
                    <el-select v-model="ruleForm.SealId" :filterable="ruleForm.SealList.length > 7">
                        <el-option
                                v-for="item in ruleForm.SealList"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item
                        label="上传执法盖章"
                        prop="sealPic">
                    <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :http-request="UploadTag"
                            :before-upload="beforeAvatarUpload">
                            <img
                                v-if="ruleForm.sealPic"
                                :src="ruleForm.sealPic"
                                class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>

                    </el-upload>
                </el-form-item>-->

                <el-form-item label="是否启用">
                    <el-radio-group
                            v-model="useRadioValue"
                            @change="changeApplication()">
                        <el-radio
                                v-for="item of isUse"
                                :key="item.value"
                                :label="item.value">
                            {{item.label}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <div style="text-align:center;">
                    <el-button
                            type="primary"
                            plain
                            @click="resetForm('ruleForm')">
                        取 消
                    </el-button>
                    <el-button
                            type="primary"
                            plain
                            @click="submit('ruleForm')">
                        保 存
                    </el-button>
                </div>

            </el-form>

        </el-dialog>

    </div>
</template>
<script>
    export default {
        data(){
            return {
                loading:true,
                tableData:[],
                addDialog:{
                    show:false
                },
                title:'',
                isUse: [
                    {
                        label: "启用",
                        value: 1
                    },
                    {
                        label: "禁用",
                        value: 0
                    }
                ],
                useRadioValue:1,
                ruleForm:{
                    CertId:'',//
                    Department:'',//
                    Name:'',
                    sealPic:'',//上传执法盖章
                    IsEnable:false, //是否启用,
                    ViewStage:'',//备注显示阶段
                    SealListVal:'',
                    SealId:'',//执法章的Id
                    SealList:[],//执法章列表
                },
                rules:{
                    Name: [
                        { required: true, message: '请输入执法凭证单名称', trigger: 'blur' },
                    ],
                    Department: [
                        { required: true, message: '请输入执法部门名称', trigger: 'blur' },
                    ],
                    /*sealPic:[
                        { required: true, message: '请上传执法盖章',trigger: 'blur'}
                    ],*/
                    SealId:[
                        { required: true, message: '请选择执法盖章',trigger: 'change'}
                    ],
                    ViewStage:[
                        { required: true, message: '请选择备注显示阶段',trigger: 'change'}
                    ],
                },
                editCertId:'',//当前编辑的row 的certId;
                PageSize:50,
                PageIndex:1,

            }

        },
        created:function(){
            this.GetEnforceCertList();
            this.GetEnforceSealListNew();
        },
        methods:{
            //获取执法章分页列表
            GetEnforceSealListNew(){
                let data = {
                    "AppId":this.$utils.getUrlKey('appId'),
                    "PageSize": this.PageSize,
                    "PageIndex": this.PageIndex

                }
                this.$api.GetEnforceSealListNew(data).then(res=>{
                    if(res.IsSuccess){
                        this.ruleForm.SealList = res.Data.SealList;
                    }
                }).catch(error=>{

                })
            },
            changeApplication(val){

               //alert(this.useRadioValue);
            },
            addBtn(){
                /*if(this.tableData.length>0){
                    this.message("只可以配置一个监督意见书",-1)
                }else{*/
                    this.addDialog.show = true;
                    this.title = "新增执法凭证单";
                    this.ruleForm.Name = "";
                    this.ruleForm.Department = "";
                    //this.ruleForm.sealPic = "";
                    this.ruleForm.SealListVal = "";
                    this.ruleForm.SealId = "";
               // }
            },
            UploadTag(obj){
                let fd = new FormData();
                fd.append('upload', obj.file);
                //var base = "http://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetFile?fileURL=";
                this.$api.Upload(fd).then(res =>{
                    this.ruleForm.sealPic = res.data.Detail;
                    this.message('上传成功', 1)
                }).catch(error =>{
                    this.message('上传失败', -1)
                })
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isJPG2 = file.type === 'image/jpg';
                const isGIF = file.type === 'image/gif';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 1;

                if (!isJPG && !isJPG2 && !isGIF && !isPNG) {
                    this.message('图片格式：jpg，jpeg，gif，png',-1);
                }
                if (!isLt2M) {
                    this.message('上传头像图片大小不能超过 1MB!',-1);
                }
                return (isJPG || isJPG2 || isGIF || isPNG) && isLt2M;
            },
            submit(formName,tit){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(tit == "新增执法凭证单"){
                            //创建create
                            this.SaveEnforceCert(0);
                        }else{
                            //编辑update
                            this.SaveEnforceCert(1);
                        }
                        this.addDialog.show = false;
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.addDialog.show = false;
                this.ruleForm.Name = "";
                this.ruleForm.Department = "";
                this.ruleForm.sealPic = "";
                this.$refs[formName].resetFields();
            },
            closeIcon(formName){
                this.resetForm(formName)
            },
            editBtn(rows){
                this.addDialog.show = true;
                this.title = "编辑执法凭证单";
                this.index = rows;
                this.ruleForm.Department = this.tableData[rows].CertDepartmentName;
                this.ruleForm.Name = this.tableData[rows].CertName;
                //this.ruleForm.sealPic = this.tableData[rows].CertSealSrc;:'',
                this.ruleForm.SealListVal = this.tableData[rows].SealName;
                this.ruleForm.SealId = this.tableData[rows].SealId;
                if(this.tableData[rows].ViewStage == '执法整改之后'){
                    this.ruleForm.ViewStage = 1;
                }else if(this.tableData[rows].ViewStage == '巡查进行时'){
                    this.ruleForm.ViewStage = 2;
                }else if(this.tableData[rows].ViewStage == '巡查结束之后'){
                    this.ruleForm.ViewStage = 3;
                }else if(this.tableData[rows].ViewStage == '巡查开始之前'){
                    this.ruleForm.ViewStage = 4;
                }else{
                    this.ruleForm.ViewStage = '';
                }
                this.ruleForm.CertId = this.tableData[rows].Id;
                this.editCertId = this.tableData[rows].Id;
                if(this.tableData[rows].IsEnable){
                    this.useRadioValue = 1 ;
                }else{
                    this.useRadioValue = 0 ;
                }

            },
            /*
            ** 获取执法凭证单列表
             */
            GetEnforceCertList(){
                let data = {
                    "RoleId": this.$utils.guid()
                }
                this.$api.GetEnforceCertList(data).then(res=>{
                    this.loading = false;
                    if(res.IsSuccess){
                        this.tableData = res.Content;
                    }
                }).catch(error=>{

                })
            },
            /*
            ** 新增和修改执法凭证单
             */
            /*SaveEnforceCert(type){
                let data = {
                    "CertId": "",
                    "CertName": this.ruleForm.Name,
                    "CertDepartmentName": this.ruleForm.Department,
                    "CertSealSrc": this.ruleForm.sealPic,
                    "IsEnable": this.useRadioValue == 0 ? false:true,
                    "RoleId": this.$utils.guid()
                }
                if(type == 0){
                    data.CertId = '';
                }else{
                    data.CertId = this.editCertId;
                }
                this.$api.SaveEnforceCert(data).then(res=>{
                    if(res.IsSuccess){
                        this.message(res.Message,1);
                        this.GetEnforceCertList();
                    }
                }).catch(error=>{

                })
            },*/
            SaveEnforceCert(type){
                let data = {
                    "CertId": "",
                    "CertName": this.ruleForm.Name,
                    "CertDepartmentName": this.ruleForm.Department,
                    //"CertSealSrc": this.ruleForm.sealPic,
                    "CertSealSrc": this.ruleForm.SealId,
                    "IsEnable": this.useRadioValue == 0 ? false:true,
                    "ViewStage":this.ruleForm.ViewStage,
                    "RoleId": this.$utils.guid()
                }
                if(type == 0){
                    data.CertId = '';
                }else{
                    data.CertId = this.editCertId;
                }
                this.$api.SaveEnforceCert(data).then(res=>{
                    if(res.IsSuccess){
                        this.message(res.Message,1);
                        this.GetEnforceCertList();
                    }else{
                        this.message(res.Message,2);
                    }
                }).catch(error=>{

                })
            },

        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    .EnforcementVoucher {
        width: 100%;
        @include box(box);
        @include box-orient(vertical);
        height:100%;
        background:#ffffff;
        .enforceTable {
            margin-top:12px;
            height: calc(100vh - 150px) !important;
            overflow: auto;
        }
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

    }
</style>
<style lang="scss" type="text/scss">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 68px;
        height: 68px;
        line-height: 68px;
        text-align: center;
    }
    .avatar {
        width: 68px;
        height: 68px;
        display: block;
    }
    .EnforcementVoucher .el-select{
        width:100%;
    }
    .EnforcementVoucher .el-select-dropdown,.el-popper{
        width:41%;
    }

</style>
