<template>
    <div class="formTask">
        <div style="margin:100px auto;">
            <h2></h2>
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="80px">
                <el-form-item
                        label="AppId"
                        prop="AppId">
                    <el-input v-model="form.AppId"></el-input>
                </el-form-item>
                <el-form-item
                        label="任务类型"
                        prop="InitTypeValue">
                    <el-radio-group v-model="form.InitTypeValue" >
                        <el-radio v-for="item in form.InitType"
                                  :label="item.value">
                            {{item.label}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        label="初始范围"
                        prop="OnlyTaskValue">
                    <el-radio-group v-model="form.OnlyTaskValue" @change="change()">
                        <el-radio v-for="item in form.OnlyTask"
                                  :label="item.value">
                            {{item.label}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        label="业态"
                        prop="statusValue">
                    <el-select v-model="form.statusValue" multiple :filterable="form.status.length > 7">
                        <el-option
                                v-for="item in form.status"
                                :key="item.Id"
                                :value="item.Id"
                                :label="item.Name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div style="width: 100%;text-align: center;margin-top: 10px;">
                    <el-button type="primary" style="margin-right: 20px;" @click="saveForm('form')">保存</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            let guidVerify = (rule, value, callback) => {
                let reg = new RegExp(/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/);
                if (!reg.test(value)) {
                    callback(new Error('AppId格式不正确'));
                }else{
                    callback()
                }
            };
            return {
                form: {
                    AppId: '',
                    InitType: [//任务类型

                        {
                            label: '全部',
                            value: 0
                        },
                        {
                            label: '临时任务',
                            value: 1
                        },
                        {
                            label: '电子巡查',
                            value: 2
                        },
                        {
                            label: 'AI巡查任务',
                            value: 3
                        }
                    ],
                    InitTypeValue: 1,
                    OnlyTask: [
                        {
                            label: '临时认为只初始化任务',
                            value: 1
                        },
                        {
                            label: '同时生成重要不重要等基础数据',
                            value: 0
                        }
                    ],
                    OnlyTaskValue: 1,//初始范围值
                    status: [],
                    statusValue: '',
                },
                rules: {
                    AppId: [
                        {required: true,message: '请输入36为guid', trigger: 'blur'},
                        { validator: guidVerify, trigger: 'blur' }
                    ],
                    InitTypeValue: [
                        {required: true, message: '请选择任务类型', trigger: 'change'}
                    ],
                    OnlyTaskValue: [
                        {required: true, message: '请选择初始范围值', trigger: 'change'}
                    ],
                    statusValue: [
                        {required: true, message: '请选择业态', trigger: 'change'}
                    ]
                },
                isSubmit:false,
            }



        },
        created(){
            this.getOperateInfo();
        },
        methods: {
            /*
            ** 获取一级业态
            */
            getOperateInfo() {
                this.$api.GetOperateInfo(1).then(res => {
                    if (res) {
                        if (res.length > 0) {
                            this.form.status = res;
                        }
                    }
                }).catch(r => {
                });
            },
            change(val){
                console.log(val)
            },
            /*
            ** 保存表单
             */
            InitBasicOption(){
                let data ={
                    AppId:this.form.AppId,
                    StoreTypeIds:this.form.statusValue,
                    InitType:this.form.InitTypeValue,
                    OnlyTask:this.form.OnlyTaskValue
                }
                this.$api.InitBasicOption(data).then(res =>{
                    if(res && res.IsSuccess){
                        this.message(res.Message,1)
                    }
                })
            },
            saveForm(formName){
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        //if(!this.isSubmit){
                            this.InitBasicOption();
                            //this.isSubmit = true;
                        //}

                        //保存表单
                    }
                    else {
                        console.log('error submit!!');
                        return false;
                    }

                });
            }


        }
    }
</script>
<style scoped lang="scss">
    .formTask {
        width: 50%;
        padding: 10px;
        height: auto;
        font-size: 14px;
        color: #333333;
        border: 1px solid #cccccc;
        .el-input{
            width:90%;
        }
        .el-select{
            width:90%;
        }
    }


</style>
