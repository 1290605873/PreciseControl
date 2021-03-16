<template>
	<div>
    <div class="taskDetail" style="padding-bottom: 10px;">
        <el-card class="box-card" shadow="hover">
            <div class="cardItem">
                <el-form>
                    <el-form-item label="任务名称:" label-width="120px">
                        <span  class="cardItemInput" type="text" v-text="taskName" style="width:30%"></span>
                    </el-form-item>
                    <el-form-item label="自查结果:" label-width="120px">
                        <span  v-text="selfCheckResult" v-if="TaskStatus != 5">{{selfCheckResult}}</span>
                    </el-form-item>
                    <el-form-item label="开始结束日期:" label-width="120px">
                        <span  v-text="startEndTime">{{startEndTime}}</span>
                    </el-form-item>    
                </el-form>
            </div>
        </el-card>
        <el-card>
            <div class="cardItem">
                <el-form>
                    <el-form-item label="责任主体:" label-width="120px">
                        <span  class="cardItemInput" type="text" v-text="responBody">{{responBody}}</span>
                    </el-form-item>
                    <el-form-item label="门店状态:" label-width="120px">
                        <span  v-text="storeStatus">{{storeStatus}}</span>
                    </el-form-item>
                    <el-form-item label="社区名称:" label-width="120px">
                        <span  v-text="community">{{community}}</span>
                    </el-form-item>
                    <!-- <el-form-item label="自查员:" label-width="120px">
                        <span  v-text="selfChecker">{{selfChecker}}</span>
                    </el-form-item> -->
                    <el-form-item label="法人:" label-width="120px">
                        <span  v-text="legalPerson">{{legalPerson}}</span>
                    </el-form-item>   
                </el-form>




            </div>

        </el-card>
        <el-card>
            <div class="cardItem">
                <div slot="header" class="imgList">
                    <span class="cardTitle">自查点列表</span>
                </div>
                <ul>
                    <li
                            v-for="(item, index) in SelfCheckPoint"
                            :key="item.InspectOptionId">
                        <p><label for=""></label><span>{{ item.CheckName}}</span><label for=""></label></p>
                        <el-carousel arrow="always" :autoplay="false" class="SelfCheckPoint">
                            <el-carousel-item
                                    v-for="(srcItem ,inx_) in item.cutArr"
                                    :key="inx_" >
									<p v-for="(pic ,inx) in srcItem"  class="imgbox">
										<img src="../../assets/images/VideoPlay.png" v-if="pic.PicType == 2" class="playimg" @click="ShowVideo(pic)">
										<img :src="pic.PictureSrc" alt="" :key="inx"  @mouseenter="showBigImg(pic.PictureSrc,pic)"
										@mouseleave="hideBigImg()" @click="ShowVideo(pic)">
									</p>
                                
                            </el-carousel-item>
                        </el-carousel>
                    </li>
                </ul>
                <!--预览图片-->
                <div v-if="showPreview">
                    <PreviewImage :imgUrl="bigImgUrl"/>
                </div>
            </div>
        </el-card>
	
    </div>
	<el-dialog title="详情"
	           top="10vh" v-if="DetailsPage" width="700px"
	           :visible.sync="DetailsPage"
	           append-to-body
	           :close-on-click-modal="false">
	    <div style="height: calc(80vh - 60px); overflow-y: auto;">
	        <div style="display: flex;">
	            <p style="margin: 5px;">视频源</p>
	            <p style="width: 90%;word-break: break-word;margin: 5px 0;">{{playerOptions.sources[0].src}}</p>
	        </div>
	
	        <div  style="text-align: center;overflow: hidden">
	            <video-player class="video-player vjs-custom-skin"
	                          ref="videoPlayer"
	                          style="margin-top: 20px"
	                          :playsinline="true"
	                          :options="playerOptions"
	            ></video-player>
	        </div>
	    </div>
	</el-dialog>
	</div>
</template>
<script>
    import PreviewImage from '@/components/PreviewImage.vue';

    export default {
        components: {
            PreviewImage
        },
        props: {
            taskName: {
                type: String,
                default: ''
            },
            taskId: {
                type: String,
                default: ''
            },
            TaskStatus: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                taskStatusStr: '',//任务状态
                startEndTime:'',//开始结束日期
                responBody: '',//责任主体
                community: '',//社区名称
                storeStatus: '',//门店状态
                //selfChecker: '',//自查人
                legalPerson: '',//法人
                selfCheckResult:'',//自查结果
                SelfCheck: [],
                SelfCheckPoint: [],//自检点
                bigImgUrl: '',//大图地址
                showPreview: false,//是否显示预览图片
                defaultImgUrl: require('@/assets/images/tianjia_upload.png'),//默认图片路径
				DetailsPage:false,
				playerOptions:{
                        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                        autoplay: true, //如果true,浏览器准备好时开始回放。
                        muted: false, // 默认情况下将会消除任何音频。
                        loop: false, // 导致视频一结束就重新开始。
                        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                        language: 'zh-CN',
                        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                        sources: [{ // 流配置，数组形式，会根据兼容顺序自动切换
                            type: 'video/mp4',
                            src: ''
                        }],
                        poster: "", //你的封面地址
                        // width: document.documentElement.clientWidth,
                        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                        controlBar: {
                            timeDivider: true,
                            durationDisplay: true,
                            remainingTimeDisplay: false,
                            fullscreenToggle: true  //全屏按钮
                        }
                    }
            }
        },
        created() {
            this.getSelfTaskDetail();
        },
        methods: {
            getSelfTaskDetail() {
                let data = {
                        id:this.taskId
                        //id: 
                };
                let result = [];

                this.$api.SelfTaskExecutedDetail(data).then(res => {
                    if(res && res.IsSuccess){
                        let SelfCheckPoint = res.Content.SelfCheckPoint;
                        this.startEndTime = res.Content.StartTimeStr+"-"+res.Content.EndTimeStr;
                        this.responBody = res.Content.DutyBody;
                        this.storeStatus = res.Content.StoreStatusStr;
                        this.legalPerson = res.Content.LegalPerson;
                        //this.selfChecker = res.Content.Checker;
                        this.community = res.Content.CommunityName;
                        this.selfCheckResult = res.Content.SelfCheckResult;
                        if(SelfCheckPoint != null && SelfCheckPoint.length>0){
                            for(let SelfCheckPointItem of SelfCheckPoint){
                                let CheckPics =  SelfCheckPointItem.CheckPic;
                                let arr = [];
                                for (let k = 0; k < CheckPics.length; k += 3) {
                                    arr.push(CheckPics.slice(k, k + 3));
                                }
                                SelfCheckPointItem.cutArr = arr;
                            }
                            this.SelfCheckPoint = SelfCheckPoint;
							console.log(this.SelfCheckPoint)
                            /*this.startTime = res.Content.StartTimeStr;
                            this.endTime = res.Content.EndTimeStr;*/
                            
                        }else{
                            this.SelfCheckPoint = [];
                        }
                    }else{
                        this.SelfCheckPoint = [];
                    }
                }).catch(error => {
                })
            },
            showBigImg: function (url,c) {
				if(c.PicType == 2) return
                if (url) {
                    this.bigImgUrl = url;
                    this.showPreview = true;
                } else {
                    this.bigImgUrl = '';
                    this.showPreview = false;
                }
            },
			ShowVideo(c){
				if(c.PicType == 2){
					 this.$api.GetVideoUrl({
						 id:c.VideoId
					 }).then(res=>{
						 console.log(res)
						 if(res.IsSuccess == true){
							 this.DetailsPage = true;
							  this.playerOptions.poster = res.Data.FlThumbnaiPath;
							 this.playerOptions.sources[0].src = res.Data.FlLocationPathList[0].VideoPath;
						 }
					 })
					
				}
			},
            hideBigImg() {
                this.showPreview = false;
            },
        }
    }
</script>
<style scoped lang='scss'>
    .taskDetail {
        font-size: 14px;
    }

    .block {
        padding: 5px 0;
        display: inline-block;
        margin-right: 20px;
    }

    .block .demonstration {
        display: inline-block;
        width: 65px;
    }
	.imgbox{
		display: inline-block;
		width:30%;
		height: 100%;
		position: relative;
	}
	.playimg{
		position: absolute;
		width: 30px !important;
		height: 30px !important;
		top: 50% !important;
		left: 50% !important;
		margin-left: -15px !important;
		margin-top: -15px !important;
	}
    .cardLabel {
        text-align: right;
        vertical-align: middle;
        font-size: 14px;
        color: #606266;
        line-height: 34px;
        padding: 0 5px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 80px;
        display: inline-block;
        font-weight: 400;
    }

    .selectItem {
        width: 250px;
    }

    .cardItem {
        margin-bottom: 10px;

        .cardItemInput {
            width: 200px;
        }

    }

    .imgList {
        padding: 10px 0 0 20px;
    }

    .SelfCheckPoint {
        width: 50%;
        height: auto;
        padding: 10px 0 0 10px;
    }

    .SelfCheckPoint img {
        width: 100%;
        height: 100%;
        margin-right: 0.3%;
        float: left;
    }

    #overlay img {
        margin-left: 20%;
    }

    .el-carousel__indicators {
        display: none;
    }

    ul li {
        list-style: none;
    }

    #overlay {
        margin-left: 15%;
        img {
            height: 62%;
        }
    }
    .el-dialog__body .el-card__body{
        padding:0 !important;
    }
    .el-card{
        padding-top:10px;
        border:none;
        border-bottom:1px solid #cccccc;
    }
    span{
        display:inline-block;
        width:50%;
    }
</style>