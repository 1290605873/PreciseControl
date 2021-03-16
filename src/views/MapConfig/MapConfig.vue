<template>
    <div class="mapConfig">
        <h4 class="toolTitle">地图配置</h4>
            <el-form inline class="formbox">
                <el-form-item >
                    <router-link to="/MapNameConfiguration" @click.native="MapNameConfiguration">
                        <div class="item">
                            <span>
                                <img src="../../assets/name.png" alt="">
                            </span>
                            <p class="li_item">地图名称配置</p>
                        </div>
                    </router-link>
                </el-form-item>
                <el-form-item >
                    <router-link to="/MapClass" @click.native="MapClass">
                        <div class="item">
                            <span>
                                <img src="../../assets/class.png" alt="">
                            </span>
                            <p class="li_item">地图分类配置</p>
                        </div>
                    </router-link>
                </el-form-item>
                <el-form-item>
                    <router-link to="/SubjectStateChange" @click.native="SubjectStateChange">
                        <div class="item">
                            <span>
                                <img src="../../assets/state.png" alt="">
                            </span>
                            <p class="li_item">主体状态变化设置</p>
                        </div>
                    </router-link>
                </el-form-item>
                <el-form-item>
                    <router-link to="/MapMain" @click.native="MapMain">
                        <div class="item">
                            <span>
                                <img src="../../assets/main.png" alt="">
                            </span>
                            <p class="li_item">地图主体设置</p>
                        </div>
                    </router-link>
                </el-form-item>
                <el-form-item>
                    <router-link to="/SpecialEvent" @click.native="SpecialEvent">
                        <div class="item">
                            <span>
                                <img src="../../assets/event.png" alt="">
                            </span>
                            <p class="li_item">特殊事件</p>
                        </div>
                    </router-link>
                </el-form-item>
            </el-form>
        <el-dialog
                :title="title"
                :visible.sync="dialogMainVisible.show"
                fullscreen
				append-to-body
                @close="handleClose"
        >
            <router-view></router-view>
            </el-dialog>
    </div>
</template>
<script>
    export default {

            /*MapClass: resolve => {
                require(['../MapClass/MapClass.vue'], resolve)
            },
            MapNameConfiguration: resolve => {
                require(['../MapNameConfiguration/MapNameConfiguration.vue'], resolve)
            },
            SubjectStateChange: resolve => {
                require(['../SubjectStateChange/SubjectStateChange.vue'], resolve)
            },
            MapMain: resolve => {
                require(['../MapMain/MapMain.vue'], resolve)
            },
            SpecialEvent: resolve => {
                require(['../SpecialEvent/SpecialEvent.vue'], resolve)
            },
        },*/
        data(){
            return {
                dialogMainVisible:{
                    show:false
                },
                title:'',
            }
        },
        methods:{
            handleClose() {
                this.$router.push({path: "/MapConfig", query: {}});
            },
            MapNameConfiguration() {
                this.dialogMainVisible.show = true;

                this.title = "地图名称配置";
            },
            MapClass() {
                this.dialogMainVisible.show = true;

                this.title = "地图分类配置";
            },
            SubjectStateChange() {
                this.dialogMainVisible.show = true;

                this.title = "主体状态变化设置";
            },
            MapMain() {
                this.dialogMainVisible.show = true;

                this.title = "地图主体设置";
            },
            SpecialEvent() {
                this.dialogMainVisible.show = true;

                this.title = "特殊事件配置";
            }

        }
    }
</script>


<style type="text/scss" lang="scss" scoped>
    .mapConfig {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding-top: 10px;
        padding: 10px;
        .toolTitle{
            width:95%;
            font-weight:normal;
            border-bottom:1px solid #e8e8e8;
            font-size: 16px;
            color: #000000;
            line-height: 16px;
            padding-bottom: 20px;
            margin:10px 0 10px 30px;
        }
        .item{
            display:inline-block;
            margin:0 12px;
            position:relative;

            span{
                display:block;
                width:124px;
                height:124px;
                img{
                    width:100%;
                    height:100%;
                }
            }
            .li_item{
                width: 120px;
                cursor: pointer;
                text-align: center;
                font-size: 14px;
                color: #757575;
                margin:0 auto;
                position:absolute;
                left:0;
                bottom:-20px;
            }
        }
        
        .formbox{
            margin-left:10px;
        }
        
    }
</style>
<style lang="scss" type="text/scss">
   
</style>
