<template>
	<div class="LawEnforcementSealManagement main-container">
		<div class="main-header" style="margin-bottom: 10px;">
			<el-button type="primary" plain @click="addview">添加</el-button>
		</div>
		<el-table
				class="main-table"
				:data="list"
				v-loading="Loading"
				border
				highlight-current-row
				ref="table"
				height="500"
				id="table"
				@selection-change="">
		    <el-table-column type="index" align="" label="序号" show-overflow-tooltip width="50">
		    </el-table-column>
		    <el-table-column property="Name" align="" show-overflow-tooltip label="章名称" width="">
		    </el-table-column>
		    <el-table-column property="ImageUrl" label="章图片" show-overflow-tooltip align="" width="">
		        <template slot-scope="scope">
					<img style="height: 40px;width: 40px;border-radius: 4px"  @click="CheckImgView(scope.row.ImageUrl)" v-show="scope.row.ImageUrl!=null&&scope.row.ImageUrl.startsWith('http')" :src="scope.row.ImageUrl">
		        </template>
		    </el-table-column>
		    <el-table-column property="" label="章设置" show-overflow-tooltip align="" width="">
		       <template slot-scope="scope">
					<el-button size="mini" type="primary" @click="modifylist(scope.$index)">
						修改
					</el-button>
					<el-button size="mini" type="danger" @click="Delete(scope.row.Id)">
						删除
					</el-button>
		        </template>   
		    </el-table-column>
		</el-table>
		<pagination 
		 v-show="total>0" 
		 :total="total" 
		 :page.sync="searchValue.page" 
		 :limit.sync="searchValue.rows"
		 @pagination="getBasicOptionList"
		 class="main-bottom" id="main-bottom" />
		<el-dialog
		 :title="title"
		 :visible.sync="AddViews"
		 :close-on-click-modal="false"
		 width="600px"
		 v-if="AddViews">
		 <!-- <div class="maxDialog" style="height: 75vh;overflow-y: auto;"> -->
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="章名称" prop="ChapterName">
					<el-input v-model="ruleForm.ChapterName" class="com-width"></el-input>
				</el-form-item>			
				<el-form-item  label="章图片" prop="ImageUrl" ref='ChapterPictures'>
					<el-upload
							class="avatar-uploader"
							action=""
							:show-file-list="false"
							list-type="picture-card"
							:http-request="defaultPicUpload">
						<img v-if="ruleForm.ImageUrl" :src="ruleForm.ImageUrl"
							 class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<p style="margin: 0;"><span style="color: red;"> * </span>章图片，需要上传镂空的图片，确保不会掩盖到文件上面的字迹</p>
				</el-form-item>
				<el-form-item>
					<el-button @click="resetForm('ruleForm')">取消</el-button>
					<el-button type="primary" @click="RuleBtn('ruleForm')">提交</el-button>
				</el-form-item>
			</el-form>
		<!-- </div> -->
		</el-dialog>
		<el-dialog
		 title="查看大图"
		 :visible.sync="CheckImg"
		 :close-on-click-modal="false"
		 v-if="CheckImg">
		 <div style="text-align: center;">
			<img :src="BigImg" alt="">
		 </div>
		</el-dialog>
	</div>
</template>

<script>
	import Pagination from "@/components/Pagination";
	export default{
		components: {
			Pagination,
		},
		data() {
			return {
				list:[],
				Loading:false,
				title:'添加',
				AddViews:false,
				total:1,
				searchValue:{
					page:1,
					rows:20
				},
				//修改ID
				ModifyId:'',
				ruleForm:{
					ChapterName:'',
					ChapterPictures:'',
					ImageUrl:''
				},
				rules:{
					ChapterName:{required:true,message:'请输入章名称',trigger:'change'},
					ImageUrl:{required:true,message:'请上传图片',trigger:'change'},
				},
				CheckImg:false
			}
		},
		created:function(){
			this.getBasicOptionList();
		},
		methods:{
			addview(){
				this.title = '新增';
				this.AddViews = true;
				this.ruleForm.ChapterName = '';
				this.ruleForm.ImageUrl = '';
				this.ModifyId = '';
			},
			modifylist(rows){
				this.title = '修改';
				this.AddViews = true;
				this.ruleForm.ChapterName = this.list[rows].Name;
				this.ruleForm.ImageUrl = this.list[rows].ImageUrl;
				this.ModifyId = this.list[rows].Id;
			},
			Delete(id){
				let data = {
					'id':id
				}
				this.$confirm('删除后影响已经配置的业务，确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.DeleteEnforceSealById(data).then(res => {
						if(res.IsSuccess){
							this.message(res.Message,1);
							this.getBasicOptionList();
						}else{
							this.message(res.Message,-1);
						}
					}).catch(error => {
					});

				}).catch(() => {

				}); 
			},
			//上传图片
			defaultPicUpload(obj) {
				let fd = new FormData();
				fd.append('upload', obj.file);
				this.$api.UploadFile(fd).then(res => {
					if (res.data.IsSuccess) {
						this.ruleForm.ImageUrl = res.data.Detail;
						this.$refs.ChapterPictures.clearValidate();
						this.message('上传成功', 1)
					} else {
						this.message('上传失败', -1)
					}
				}).catch(error => {

				})
			},
			getBasicOptionList(){
				let data = {
					'AppId':this.$utils.getUrlKey("appId"),
					'PageIndex':this.searchValue.page,
					'PageSize':this.searchValue.rows
				}
				this.$api.GetEnforceSealList(data).then(
					res => {
						if(res && res.IsSuccess){
							this.list = res.Data.SealList;
							this.total = res.Data.Total;
						}
					}
				)
			},
			RuleBtn(formName){
				this.$refs[formName].validate((valid) => {
					if(valid){
						let data = {
							'Id':this.ModifyId == '' ? '00000000-0000-0000-0000-000000000000' : this.ModifyId,
							'AppId':this.$utils.getUrlKey("appId"),
							'Name':this.ruleForm.ChapterName,
							'ImageUrl':this.ruleForm.ImageUrl,
						}
						this.$api.SaveEnforceSeal(data).then(
							res => {
								if(res && res.IsSuccess){
									this.AddViews = false;
									this.message(res.Message,1);
									this.getBasicOptionList();
								}else{
									this.message(res.Message,-1);
								}
							}
						)
					}else{
						return false
					}
				});
			},
			//规则取消
			resetForm(formName){
				this.$nextTick(function() {
					this.$refs[formName].resetFields();
				 })
				this.AddViews=false;
			},
			CheckImgView(url){
				this.CheckImg = true;
				this.BigImg = url;
			},
            getThumbPic(url) {
                if (url != null && url != undefined && url.startsWith('http')) {
                    //做缩略图处理
                    let relaPath = this.getUrlParam(url, 'fileURL');
					if(this.$utils.isTestEvn()){
                        if (this.$utils.isHttpsProtal()) {
                            return 'https://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                        } else {
                            return 'http://testfileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                        }

                    } else {
                            if (this.$utils.isHttpsProtal()) {
                                return 'https://fileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                            } else {
                                return 'http://fileserver.iuoooo.com/Jinher.JAP.BaseApp.FileServer.UI/FileManage/GetImageThumbnail?imgURL=' + relaPath + '&width=40&height=40';
                            }
                    }
                }
            },
            getUrlParam(url, paraName) {
                var arrObj = url.split("?");

                if (arrObj.length > 1) {
                    var arrPara = arrObj[1].split("&");
                    var arr;

                    for (var i = 0; i < arrPara.length; i++) {
                        arr = arrPara[i].split("=");

                        if (arr != null && arr[0] == paraName) {
                            return arr[1];
                        }
                    }
                    return "";
                }
                else {
                    return "";
                }
            },
		}
	}
</script>

<style scoped="scoped" lang="scss">
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding-top: 10px;

        .com-width {
            width: 170px;
        }

        .com-width-time {
            width: 170px;
            margin-right: 10px;
        }

        .el-form-item {
            margin-bottom: 5px;
        }
    } 
</style>
<style lang="scss" type="text/scss">
    .LawEnforcementSealManagement {
        .el-form-item__error{
            position:relative;
        }
		.el-form-item__content{
			line-height: 44px;
		}
		.avatar {
			width: 100%;
			height: 100%;
			display: block;
		}	
    }
</style>