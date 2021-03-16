<template>
    <div>
        <el-button type="primary" @click="openColor">设置颜色</el-button>      
        <el-dialog
            width="300px"
            title="设置颜色"
            :visible.sync="showColorDialog">
            <sketch-picker v-model="colors" 
            :value="colors"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showColorDialog = false">取 消</el-button>
                <el-button type="primary" @click="closeColor">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { Sketch } from 'vue-color'
export default {
    components:{
        'sketch-picker':Sketch,
    },
    data(){
        return {
            colors:'red',//默认色值可有可无
            showColorDialog:false,
        }
    },
    methods: {
        openColor(){
            this.showColorDialog = true;
          
        },
        closeColor(){
              window.console.log(this.colors.hex)//最终选中色值
        }
    }
}
</script>
<style scoped>
.el-dialog__footer{
    text-align: center;
}
.vc-sketch{
    width:240px;
}
</style>


