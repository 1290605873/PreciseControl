<template>
    <div class="main-container SpecialEvent">

            <div style="margin-bottom:12px;">
                <el-button
                        @click="addEditDialog(1)"
                        type="primary"
                        class="addBtn">
                    添加
                </el-button>
            </div>
            <div>
                <el-table
                        v-loading="loading"
                        style="width: 100%"
                        border
                        :data="tableList"
                        class="SpecialEventTable">
                    <el-table-column
                            type="index"
                            label="序号"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            property="Name"
                            label="事件名称"
                            min-width="150px"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            property="Remark"
                            label="定义"
                            min-width="150px"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            min-width="200px"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button
                                    size="small"
                                    plain
                                    @click="edit(scope.$index)" type="primary" class="editBtn">
                                编辑
                            </el-button>
                            <el-button
                                    size="small"
                                    plain
                                    @click="deleDialog(scope.row.Id)"
                                    type="danger"
                                    class="deleBtn">
                                删除
                            </el-button>
                            <el-button
                                    size="small"
                                    plain
                                    @click="application(scope.row.Id,scope.row.IsEnable)"
                                    type="primary"
                                    class="applicationBtn">
                                {{scope.row.text}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        <!-- 新增or编辑特殊事件弹框-->
        <el-dialog

                :modal="true"
                :title="title"
                :visible.sync="addOrEditConfigDialog.show"
				v-if="addOrEditConfigDialog.show"
                :append-to-body="true"
                class="addOrEditConfigDialog"
                @close="closeConfigDialog('addEditForm')">
            <el-form
                    label-width="140px"
                    ref="addEditForm"
                    :model="addEditForm"
                    :rules="rules"
                    >
                <el-form-item
                        label="事件名称"
                        prop="eventName"
                        >
                    <el-input
                            type="text"
                            v-model.trim="addEditForm.eventName"
                            maxlength="30"
                            show-word-limit
                            clearable
                            style="width:68%"
                            placeholder="请输入事件名称">
                    </el-input>
                </el-form-item>
                <el-form-item
                        label="事件图标"
                        prop="eventPic"
                        >
                    <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :http-request="UploadEventPic"
                            :before-upload="beforeAvatarUpload"
                            >
                        <img
                                v-if="addEditForm.eventPic"
                                :src="addEditForm.eventPic"
                                class="avatar">
                        <i v-else  class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <!--<span style="position:absolute;top:10px;left:50px;color:red;font-size:12px;">图片格式：jpg，jpeg，gif，png，大小不能超过1MB</span>-->
                </el-form-item>
                <el-form-item
                        label="事件选中图标"
                        prop="eventCheckedPic"
                        >
                    <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :http-request="UploadCheckedPic"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="addEditForm.eventCheckedPic" :src="addEditForm.eventCheckedPic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>

                    </el-upload>
                    <!--<span style="position:absolute;top:10px;left:50px;color:red;font-size:12px;">图片格式：jpg，jpeg，gif，png，大小不能超过1MB</span>-->
                </el-form-item>
                <el-form-item
                        label="数据源"
                        prop="dataComeValue">
                    <el-select
                            v-model="addEditForm.dataComeValue"
                            clearable
                            placeholder="请选择数据源"
							:filterable="addEditForm.dataComeList.length > 7"
                            @change="dataComeChange(addEditForm.dataComeValue)"
                            :disabled="dataComeDisabled"
                    >
                        <el-option
                                v-for="item of addEditForm.dataComeList"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        label="选择主体信息模板"
                        v-if="addEditForm.dataComeValue!=''"
                        prop="mainMessageTemplate"
                        >
                    <el-select
                            v-model="addEditForm.mainMessageTemplate"
                            clearable
							:filterable="addEditForm.messageTemplateList.length > 7"
                            placeholder="请选择主体信息模板">
                        <el-option
                                v-for="item of addEditForm.messageTemplateList"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="选择筛选模板"  v-if="addEditForm.dataComeValue!=''">
					<el-select
					        v-model="addEditForm.ScreeningTemplate"
					        clearable
							:filterable="addEditForm.ScreeningTemplateDatas.length > 7"
					        placeholder="请选择主体信息模板">
					    <el-option
					            v-for="item of addEditForm.ScreeningTemplateDatas"
					            :key="item.Id"
					            :label="item.Name"
					            :value="item.Id">
					    </el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="定义">
                    <el-input
                            type="textarea"
                            placeholder="请输入事件定义"
                            maxlength="50"
                            clearable
                            show-word-limit
                            v-model.trim="addEditForm.remark"
                            >
                    </el-input>
                </el-form-item>
            </el-form>
            <div style="width: 100%;text-align: center;margin-top: 10px;">
                <el-button @click="resetAddEditForm('addEditForm')">取消</el-button>
                <el-button
                        type="primary"
                        style="margin-right: 20px;"
                        @click="saveAddOrEditConfigDialog('addEditForm',title)">
                    保存
                </el-button>
            </div>
        </el-dialog>
        <!-- 新增or编辑特殊事件弹框-->
    </div>
</template>
<script>
    export default {
        component:{

        },
        data(){
            let validcodeName = (rule,value,callback) =>{

                if(value.length <= 0){
                    callback(new Error('请选择事件'))
                }else{
                    callback()
                }
            };
            let eventImg = (rule,value,callback) =>{

                if(value =="" && value == undefined && value == null){
                    callback(new Error('请上传事件图标'))
                }else{
                    callback()
                }
            };
            let eventCheckedImg = (rule,value,callback) =>{

                if(value =="" && value == undefined && value == null){
                    callback(new Error('请上传事件选中图标'))
                }else{
                    callback()
                }
            };
            return {
                listParam:{
                    "PageNo": 1,
                    "PageSize": 20
                },
                tableList:[

                ],
                title:'',
                addOrEditConfigDialog:{
                    show:false
                },
                //新增修改特殊事件
                addEditForm:{
                    id:'',
                    eventName:'',
                    eventPic:'',
                    eventCheckedPic:'',//事件选中图标
                    dataComeValue:'',
                    mainMessageTemplate:"",
                    dataComeList:[],
                    messageTemplateList:[],
                    remark:'',
                    subBy: '',
                    subTime: '',
                    isEnable:'',
					ScreeningTemplate:'',
					ScreeningTemplateDatas:[],
                },
                rules:{
                    eventName:[
                        { required: true, message: '请填写事件名称',trigger: 'blur'},
                    ],
                    eventPic:[
                        { required: true, message: '请上传事件图标',trigger: 'blur'}
                    ],
                    eventCheckedPic:[
                        { required: true, message: '请上传事件选中图标',trigger: 'blur'}
                    ],
                    dataComeValue:[
                        { required: true, message: '请选择数据源', trigger: 'blur'},
                    ],
                    mainMessageTemplate:[
                        { required: true, message: '选择主体信息模板', trigger: 'blur'},
                    ]
                },
                loading:true,
                currentMapDataType:'',
                dataComeDisabled:false
            }
        },
        created(){
            this.GetMapEventList();
            this.GetMapDataNames();
            this.getMapTemplatAll();
        },
        methods:{
            resetAddEditForm(formName) {
                this.$refs[formName].resetFields();
                this.addOrEditConfigDialog.show = false;
            },
            /*
            ** 获取特殊事件列表数据
             */
            GetMapEventList(){
                this.$api.GetMapEventList(this.listParam).then(res =>{
                    this.loading = false;
                    if(res && res.Content && res.Content.length>0){
                        this.tableList = res.Content;
                        for(let item of res.Content){
                            if(!item.IsEnable){
                                this.$set(item,'text','启用');
                            }else{
                                this.$set(item,'text','禁用');
                            }
                        }

                    }else if(res && res.Content && res.Content.length==0){
                        this.tableList = [];
                    }
                }).catch(error =>{

                })
            },
            /*
            ** 数据源
             */
            GetMapDataNames(){
                let data = {}
                this.$api.GetMapDataNames(data).then(res =>{
                    if(res && res.Content && res.Content.length>0){
                        this.addEditForm.dataComeList = res.Content;
                    }
                }).catch(error =>{

                })
            },
            /*
            ** 监听数据源改变
             */
            dataComeChange(type){
                if(type==''){
                    this.addEditForm.mainMessageTemplate='';
                    return
                }
                this.currentMapDataType=type
                this.getLayoutList();
            },
            /*
            ** 打开新增编辑特殊事件
             */
            addEditDialog(type){
                this.dataComeDisabled=false;
                this.addEditForm.eventName = "";
				this.title = "新增特殊事件";
				this.addEditForm.eventPic = '';
				this.addEditForm.eventCheckedPic = '';
				this.addEditForm.dataComeValue = '';
				this.addEditForm.remark = '';
				this.addEditForm.mainMessageTemplate = '';
				this.addEditForm.ScreeningTemplate = '';
                this.addOrEditConfigDialog.show = true;
            },
            /*
            ** 编辑特殊事件
            */
            edit(row){
				this.title = "编辑特殊事件";
				this.dataComeDisabled=true
                this.addOrEditConfigDialog.show = true;
                this.addEditForm.id = this.tableList[row].Id;
                this.addEditForm.eventName = this.tableList[row].Name;
                this.addEditForm.eventPic = this.tableList[row].ImgUrl;
                this.addEditForm.eventCheckedPic = this.tableList[row].SelectImgUrl;
                this.addEditForm.remark = this.tableList[row].Remark;
                this.addEditForm.dataComeValue = this.tableList[row].MapDataType;
                this.addEditForm.subBy = this.tableList[row].SubBy;
                this.addEditForm.subTime = this.tableList[row].SubTime;
                this.addEditForm.isEnable = this.tableList[row].IsEnable;
				this.currentMapDataType = this.tableList[row].MapDataType;
				this.getLayoutList();
				this.addEditForm.mainMessageTemplate = this.tableList[row].LayoutId.toString();
				this.addEditForm.ScreeningTemplate = this.tableList[row].MapTemplateId;
				
            },
            /*
            ** 新增特殊事件
            */
            CreateMapEvent(){
                let data = {
                        "Name": this.addEditForm.eventName,
                        "MapDataType": this.addEditForm.dataComeValue,
                        "ImgUrl":  this.addEditForm.eventPic,
                        "SelectImgUrl": this.addEditForm.eventCheckedPic,
                        "Remark": this.addEditForm.remark,
                        "LayoutId":this.addEditForm.mainMessageTemplate,
						'MapTemplateId':this.addEditForm.ScreeningTemplate
                }
                this.$api.CreateMapEvent(data).then(res =>{
                    if(res && res.IsSuccess){
                        this.message(res.Message,1);
                        this.GetMapEventList();
                    }else{
                        this.message(res.Message,-1);
                    }
                }).catch(error =>{

                })
            },
            /*
            ** 编辑特殊事件
            */
            UpdateMapEvent(){
                let data = {
                    "Id": this.addEditForm.id,
                    "Name": this.addEditForm.eventName,
                    "MapDataType": this.addEditForm.dataComeValue,
                    "ImgUrl": this.addEditForm.eventPic,
                    "SelectImgUrl": this.addEditForm.eventCheckedPic,
                    "IsEnable": this.addEditForm.isEnable,
                    "Remark": this.addEditForm.remark,
                    "SubBy": this.addEditForm.subBy,
                    "SubTime": this.addEditForm.subTime,
                    "LayoutId":Number(this.addEditForm.mainMessageTemplate),
					'MapTemplateId':this.addEditForm.ScreeningTemplate
                }
                this.$api.UpdateMapEvent(data).then(res =>{
                    if(res && res.IsSuccess){
                        this.message(res.Message,1);
                        this.GetMapEventList();
                    }
                }).catch(error =>{

                })
            },

            /*
            ** 保存新增编辑特殊事件
             */
            saveAddOrEditConfigDialog(formName,txt){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log("验证成功");
                        if(txt == "新增特殊事件"){
                            this.CreateMapEvent();
                            this.addOrEditConfigDialog.show = false;
                        }else{
                            this.UpdateMapEvent();
                            this.addOrEditConfigDialog.show = false;
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            UploadEventPic(obj){
                let fd = new FormData();
                fd.append('upload', obj.file);
                //var base = "http://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetFile?fileURL=";
                this.$api.Upload(fd).then(res =>{
                    this.addEditForm.eventPic = res.data.Detail;
                    this.message('上传成功', 1)

                }).catch(error =>{
                    this.message('上传失败', -1)
                })
            },
            UploadCheckedPic(obj){
                let fd = new FormData();
                fd.append('upload', obj.file);
                //var base = "http://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetFile?fileURL=";
                this.$api.Upload(fd).then(res =>{
                    this.addEditForm.eventCheckedPic=res.data.Detail;
                    this.message('上传成功', 1)
                }).catch(error =>{
                    this.message('上传失败', -1)
                })
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
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
            /*
            ** 打开特殊事件弹框
            */
            specialConfig(){
                this.specialConfigDialog.show = true;
            },
            handleCheckAllChange(val) {//全部选中时val=true，取消全选时val=false;
                this.specialForm.checkedCities = val ? this.cityOptions : [];
                this.isIndeterminate = false;

            },
            handleCheckedCitiesChange(value) {//value是当前选中项的集合
                this.checkedCount = value.length;
                this.cities = this.cityOptions;
                this.checkAll = this.checkedCount === this.cities.length;
                this.isIndeterminate = this.checkedCount > 0 && this.checkedCount < this.cities.length;
            },
            /*
            ** 保存特殊事件
             */
            saveSpecialEvent(formName){
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        console.log("验证成功");
                    }
                    else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            /*
            ** 启用和取消启用
             */
            application(Id,IsEnable){
                let data = {
                    id:Id,
                    isEnable:!IsEnable
                }
                this.$api.UpdateMapEventStatus(data).then(res => {
                    if(res){//&& res.IsSuccess
                        this.message(res.Message,1);
                        this.GetMapEventList();
                    }
                }).catch(error =>{

                })
            },
            /*
            ** 删除
             */
            deleDialog(id){
                this.$confirm('确认要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    let data = {
                        id:id
                    }
                    this.$api.DeleteMapEvent(data).then(res =>{
                        if(res && res.IsSuccess){
                            this.message(res.Message,1);
                            this.GetMapEventList();
                        }
                    }).catch(error =>{

                    })
                })

            },
            closeConfigDialog(formName){
                this.$refs[formName].resetFields();
            },
            //获取 选择主体信息模板 数据
            getLayoutList(){
                let data={
                    'mapDataType':this.currentMapDataType
                }
                this.$api.GetLayoutList(data).then(res => {
                    if(res&& res.IsSuccess){
                        this.addEditForm.messageTemplateList=res.Content
                    }
                }).catch(error =>{

                })
            },
			getMapTemplatAll(){
				this.$api.GetMapTemplatAll({}).then(
					res => {
						if(res && res.IsSuccess){
							this.addEditForm.ScreeningTemplateDatas = res.Content;
						}
					}
				)
			},
        }
    }
</script>


<style type="text/scss" scoped>
    .SpecialEvent {
		padding: 0;
        @include box(box);
        @include box-orient(vertical);
    }

</style>
<style type="text/scss" lang="scss">
        .SpecialEventTable{
            height:calc(100vh - 229px)!important;
            overflow:auto;
        }
        .addOrEditConfigDialog .el-select{
            width:68% !important;
        }
        .addOrEditConfigDialog .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .addOrEditConfigDialog .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .addOrEditConfigDialog .avatar-uploader-icon {
            font-size: 20px;
            color: #8c939d;
            width: 38px;
            height: 38px;
            line-height: 38px !important;
            text-align: center;
        }
        .addOrEditConfigDialog .avatar {
            width: 38px;
            height: 38px;
            display: block;
        }



</style>
