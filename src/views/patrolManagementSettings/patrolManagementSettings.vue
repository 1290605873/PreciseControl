<template>
    <div class="foundationSetup main-container paddingt20">
        <div>
            <p>我的任务列表显示:</p>
            <el-radio-group v-model="Patrol">
                <el-row :gutter="20" align="middle">
                    <el-radio :label="1">显示单位名称</el-radio>
                </el-row>
                <el-row :gutter="20" align="middle">
                    <el-radio :label="2">显示门店名称</el-radio>
                </el-row>
            </el-radio-group>
            <p>
                <el-button type="primary" class="saveButton" @click="saveButton">保存</el-button>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "patrolManagementSettings",
        data(){
            return {
                Patrol:1
            }
        },
        created:function(){
            this.Init();
        },
        methods:{
            Init(){
                this.$api.GetStoreNameConfig({}).then(
                    res =>{
                        if(res && res.IsSuccess){
                            this.Patrol = res.Content.NameType;
                        }
                    }
                )
            },
            saveButton(){
                let data = {
                    'NameType':this.Patrol
                }
                this.$api.SaveStoreNameConfig(data).then(
                    res => {
                        if(res && res.IsSuccess){
                            if(res && res.IsSuccess){
                                this.message(res.Message,1)
                            }else{
                                this.message(res.Message,-1)
                            }
                        }
                    }
                )
            }
        }
    }
</script>

<style scoped>

</style>