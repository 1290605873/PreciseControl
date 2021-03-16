<template>
    <div class="tag">
        <el-form >
            <el-form-item label="选择标签" label-width="90px">
                <el-select 
                    multiple 
                    v-model="tag.ids" 
                    collapse-tags
                    
                    clearable="">
                    <el-option 
                    v-for="item of tag.list" 
                    :key="item.id" 
                    :value="item.id" 
                    :label="item.name">

                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="btn-box">
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeTagDia">取 消</el-button>
            <el-button type="primary" @click="submitTag">确 定</el-button>
            </span>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            tag:{
                list:[],
                ids:[]
            }
        }
        
    },
    created(){
        this.getLabelList()
    },
    methods:{
        getLabelList() {
			let data = {
				"appId": this.$utils.getUrlKey("appId"),
        		"type": 1
			}
			this.$api.GetLabelList(data).then(res => {
				if (res) {
					this.tag.list = res.labelList;
				}
			}).catch(r => {})

		},
        submitTag() {
            this.$emit('submitTag',this.tag.list,this.tag.ids)
        },
        closeTagDia() {
            this.$emit('closeTagDia')
        }
    }
}
</script>
<style lang="scss">
    .tag{
        width:100%;
        height:100%;
    }
    .setTagDia {
        .maxDialog{
            height: calc(90vh - 154px);
        }
        .btn-box{
            text-align: center;
        }
    }
</style>
<style lang="scss">
    .tag {
        .el-form{
            height:calc(100% - 60px)
        }
        .el-select{
            width:200px !important;
        }
    }
</style>