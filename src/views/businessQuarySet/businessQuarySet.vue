<template>
    <div class="businessQuarySet">
        <div class="page">
            <h3>企业查询设置</h3>
            <div class="content">
                <div class="title">
                    <span>企业查询设置</span>
                </div>
                
                <el-radio-group v-model="radio">
                    <el-radio :label="1">网格权限</el-radio>
                    <el-radio :label="2">按馆下网格显示</el-radio>
                </el-radio-group>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitClick">提 交</el-button>
                </div>
            </div>
            
        </div>    
    </div>
</template>
<script>
    export default {
        data(){
            return {
                radio:'',
                appId:'',
                userId:'',
                orgId:''

            }

        },
        created:function(){
            this.getAppConfigValue();
        },
        methods:{
            getAppConfigValue() {
                let data = {
                    "AppId":this.$utils.getUrlKey('appId'),
                    "UserId":this.$utils.getUrlKey('userId'),
                    "Type":5
                }
                this.$api.GetAppConfigValue(data).then(res =>{
                    this.message(res.Message,1);
                    if(res.IsSuccess){
                        if(res.Data){
                            this.radio = res.Data*1;
                        }
                    }
                }).catch(error =>{

                })
            },
            submitClick() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                let param = {
                    "AppId":this.$utils.getUrlKey('appId'),
                    "UserId":this.$utils.getUrlKey('userId'),
                    "Type":5,
                    "Value":this.radio
                }
                this.$api.SaveAppConfig(param).then(res =>{
                    this.message(res.Message,1)
                }).catch(error =>{

                })
            }
           

        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    .businessQuarySet {
        width: 100%;
        @include box(box);
        @include box-orient(vertical);
        height:100%;
        padding:5%;
        margin:0;
        background:#ffffff;
        .page{
            margin:auto 0;
            width:50%;
            height:100%;
            h3{
                text-align:center;
                font-weight:500;
            }
            .title{
                border-left:0;
                border-top:0;
                padding:0 15px;
                height:40px;
                line-height:40px;
                border-bottom:1px solid #cccccc;
                span{
                    display: inline-block;
                    width:100%;
                }
            }
            .content{
                padding-bottom:20px;
                border:1px solid #cccccc;
                height:70%;
                position:relative;
            }
        }
    }
</style>
<style lang="scss" type="text/scss">
   .businessQuarySet{
       margin:0;
       padding:0;
       .el-radio-group{
            padding:50px 70px;
        }
        .el-radio {
            display: block;
            margin-bottom:25px;
            margin-left:0;
        }
        .dialog-footer{
            text-align:center;
            margin-top:50px;
            position:absolute;
            bottom:40px;
            width:100%;
        }
   }
</style>
