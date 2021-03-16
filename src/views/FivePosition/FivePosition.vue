<template>
    <div class="main-container meshUserSetting">
        <div style="width:30%;text-align: left;">
            <h2>五定设置</h2>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <label>
                    巡查五定配置
                </label>
            </div>
            <div>
                <el-form :inline="false" width="30%">
                    <el-form-item >
                        <span>巡查检查项五定</span>
                    </el-form-item>

                    <el-form-item >
                        <el-radio-group v-model="InspectItem">
                            <div style="margin-top:10px;"><el-radio :label="1">巡查第一张照片五定，其余照片四定</el-radio></div>
                            <div style="margin-top:10px;"><el-radio :label="2">全五定</el-radio></div>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item >
                        <span>巡查单五定</span>
                    </el-form-item>
                    <el-form-item >
                        <el-radio-group v-model="PatrolList">
                            <div style="margin-top:10px;"><el-radio :label="1">提交巡查单五定</el-radio></div>
                            <div style="margin-top:10px;"><el-radio :label="2">巡查单上不五定</el-radio></div>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card low-card">
            <div slot="header" class="clearfix">
                <label>
                    执法五定配置
                </label>
            </div>
            <div>
                <el-form :inline="false" width="30%">
                    <el-form-item >
                        <span>执法五定配置</span>
                    </el-form-item>
                    <el-form-item>
                        <el-radio-group v-model="Enforce">
                            <div style="margin-top:10px;"><el-radio :label="1">执法凭证单五定</el-radio></div>
                            <div style="margin-top:10px;"><el-radio :label="2">不五定</el-radio></div>
                        </el-radio-group>
                    </el-form-item>
                    <div style="text-align: center;">
                        <el-button type="primary" class="loginBtn" @click="submitFive()" :loading="loadingbut">{{loadingbuttext}}</el-button>
                    </div>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                InspectItem: '',
                PatrolList:'',
                Enforce:'',
                loadingbuttext:'提交',
                loadingbut:false
            };
        },
        created(){
            this.GetFivePositionByAppId();
        },
        methods:{
            GetFivePositionByAppId(){
                let data = {
                    appId:this.$utils.getUrlKey('appId')
                }
                this.$api.GetFivePositionByAppId(data).then(res =>{
                    if(res.IsSuccess){
                        this.message(res.Message,1);
                        this.InspectItem = res.Data.InspectItem
                        this.PatrolList = res.Data.PatrolList
                        this.Enforce = res.Data.Enforce
                    }
                }).catch(error =>{

                })
            },
            submitFive(){
                this.loadingbut = true;
                this.loadingbuttext = '提交中...';
                let data =
                    {
                        "AppId": this.$utils.getUrlKey('appId'),
                        "InspectItem": this.InspectItem,
                        "PatrolList": this.PatrolList,
                        "Enforce": this.Enforce
                    }
                this.$api.SaveFivePosition(data).then(res=>{
                    if(res.IsSuccess){
                        this.loadingbut = false;
                        this.loadingbuttext = '提交';
                        this.message(res.Message,1);
                    }
                }).catch(error=>{

                })

            }
        }
    }
</script>
<style type="text/css" lang="scss" scoped>
    .main-container {
        padding-top: 14px;
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        .el-form-item__label{
            float:none !important;
        }
        span{
            font-size:16px;
        }
    }
</style>
<style type="text/css" lang="scss" scoped>

        .low-card{
            margin:10px 0;
        }
        .text {
            font-size: 14px;
        }
        .item {
            margin-bottom: 18px;
        }

        .clearfix:before,
        .clearfix:after {
            display: table;
            content: "";
        }
        .clearfix:after {
            clear: both
        }

        .box-card {
            width:30%;
        }
        .el-radio-group{
            padding-left:10px;
        }
        .el-card__header{
            font-size:18px !important;
        }
        .el-form-item__label{
            font-size:16px;
            clear:both;

        }
        .el-radio{
            color:#999;
        }



</style>
