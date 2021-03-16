<template>
    <div>
        <div style="margin:80px auto;padding:15px;">
            <el-button type='primary' @click="clearImageGroupInfo">重置组数</el-button>
            <el-button type='primary' @click="resetImageSequence">重置排序</el-button>
            <el-button type='primary' @click="refreshImageSequence">更新排序</el-button>
        </div>
        <div style="padding:15px;">
            <el-button type='primary' @click="getImageGroupNum">获取组数</el-button>
            <el-button type='primary' @click="getImageTotalCount">获取图片总数</el-button>
        </div>
        <div style="padding:15px;">
            <p><span>获取组数:</span><span>{{groupNum}}</span></p> 
            <p><span>获取图片总数:</span><span>{{imageTotalCount}}</span></p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            groupNum:'',
            imageTotalCount:''

        }
    },
    created(){

    },
    methods:{
        clearImageGroupInfo() {
            this.$api.ClearImageGroupInfo({}).then(res =>{
                if(res.IsSuccess){
                    //console.log(res.Message)
                }
            }).catch(error=>{

            })
        },
        //重置排序
        resetImageSequence(){
            this.$api.InitImageSequence({"IsRealign":true}).then(res =>{
                if(res.IsSuccess){
                    //console.log(res.Message)
                }
            }).catch(error=>{

            })
        },
        //更新排序
        refreshImageSequence(){
            this.$api.InitImageSequence({"IsRealign":false}).then(res =>{
                if(res.IsSuccess){
                    //console.log(res.Message)
                }
            }).catch(error=>{

            })
        },
        getImageGroupNum(){
            this.$api.GetImageGroupNum({}).then(res =>{
                if(res.IsSuccess){
                    this.groupNum = res.Data;
                }
            }).catch(error=>{

            })
        },
        getImageTotalCount(){
            this.$api.GetImageTotalCount({}).then(res =>{
                if(res.IsSuccess){
                    this.imageTotalCount = res.Data;
                }
            }).catch(error=>{

            })
        }
    }

}
</script>
<style lang="scss">
    
</style>