<template>
	<div>
		<el-dialog
			title="审查视频"
			custom-class="operate-dialog"
			:visible.sync="videoViewShow"
			width="1000px"
			top="10vh"
			:close-on-click-modal="false"
			append-to-body
			@close="Close">
				<div class="video-box" ref="videoBox">
					<span
						class="control-btn"
						:class=" isPlay ? 'play-btn':'pause-btn'"
						@click="videoControls"></span>
				</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cut">截图</el-button>
				<el-button @click="Close">关闭</el-button>
			</span>
		</el-dialog>
		 	<ReviewImage
				:ShowReviewImage="reviewImage.show"
				:ReviewImageData="reviewImage.data"
				@CloseReviewImage="CloseReviewImage">
			</ReviewImage>
	</div>
</template>

<script>
import ReviewImage from '../AIFormSelfCheckImage/ReviewImage.vue'
export default {
	name:'VideoView',
	components:{
		ReviewImage
	},
	props:{
		ShowVideoView:{
			type:Boolean,
			required: false
		},
		VideoViewData:{
			type:Object,
			required:true
		}
	},
	data(){
		return{
			videoViewShow:false,
			videoSrc:'',
			isPlay:false,
			imageUrl:'',
			reviewImage:{
				show: false,
				data: {}
			}
		}
	},
	watch:{
		ShowVideoView(v){
			if(v){
				this.videoViewShow = true
				this.init()
			}
		}
	},
	methods:{
		async init(){
			this.reviewImage.data = this.$utils.deepCopy(this.VideoViewData)
			this.videoSrc = this.VideoViewData.val.VideoPath
			if(this.videoSrc.indexOf('http')<0){
				let p = {
					Id: this.videoSrc
				}
				let res = await this.$api.GetAIVideoUrl(p)
				if(res && res.IsSuccess){
					this.setVideo()
					this.videoSrc = res.Data.FlLocationImagePath
					let m = window.location.origin.indexOf('https') == 0
					let n = this.videoSrc.indexOf('https') == 0
					if(m && !n){
						this.videoSrc = 'https' + this.videoSrc.slice(4)
					}
					if(!m && n){
						this.videoSrc = 'http' + this.videoSrc.slice(5)
					}
				}else{
					this.message(res.Message,-1)
				}
			}else{
				let m = window.location.origin.indexOf('https') == 0
				let n = this.videoSrc.indexOf('https') == 0
				if(m && !n){
					this.videoSrc = 'https' + this.videoSrc.slice(4)
				}
				if(!m && n){
					this.videoSrc = 'http' + this.videoSrc.slice(5)
				}
				this.setVideo()
			}
		},
		setVideo(){
			let videoElem=document.createElement("video");//创建video
			videoElem.style.maxWidth="1000px";
			videoElem.style.maxHeight="60vh";
			// videoElem.useCORS= true;//解决跨域
			videoElem.crossOrigin="Anonymous";// 这两个参数必填 解决跨域
			videoElem.setAttribute('id','video')
			this.$nextTick(()=>{
				let videoBox = this.$refs.videoBox
				videoBox.appendChild(videoElem)
				videoElem.setAttribute('src',this.videoSrc)
				videoElem.onclick = this.videoControls
				videoElem.addEventListener('ended', (e) => {
					let v = document.getElementById('video')
					v.load()
					v.currentTime = 0
					setTimeout(()=>{
						v.play()
					},150)
				})
			})
		},
		Close(){
			this.videoViewShow = false
			let video = document.getElementById('video')
			video.parentNode.removeChild(video)
			this.$emit('CloseVideoView', false)
		},
		cut(){
			console.log(this.VideoViewData.AttrList)
			let v = document.getElementById('video')
			console.log(this.isPlay)
			if(this.isPlay){
				v.pause()
				this.isPlay = false
			}
			this.captureImage()
		},
		videoControls(){
			let v = document.getElementById('video')
			this.isPlay = v.paused
			if(v.paused){
				v.play()
			}else{
				v.pause()
			}
		},

		CloseReviewImage(){
			this.reviewImage.show = false
		},
		captureImage() {
			try {
				let scale = 1;
				let video = document.getElementById('video')
				let canvas = document.createElement("canvas");
				let ctx = canvas.getContext('2d')
				canvas.width = video.videoWidth * scale;
				canvas.height = video.videoHeight * scale;
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
				let image =new Image()
				image.crossOrigin = "anonymous"; //绘制图片在这里设置
				image.src = canvas.toDataURL();
				let data = this.dataURLtoBlob(image.src);
        let fd = new FormData();
        fd.append('uploadFile', data);
        this.$api.UploadFile(fd).then(res => {
					if(res.data && res.data.IsSuccess){
						this.imageUrl = res.data.Detail
						this.reviewImage.show = true
						this.reviewImage.data.val.Coordinate = []
						this.reviewImage.data.val.TextList = []
						this.reviewImage.data.val.wrongItem = []
						this.reviewImage.data.AttrList=this.$utils.deepCopy(this.VideoViewData.AttrList)
						this.reviewImage.data.val.OriginalPicture = res.data.Detail
						this.reviewImage.data.PicturePath = res.data.Detail
					}else {
						this.message(res.Message, -1);
					}
				}).catch(()=>{})
			} catch (e) {
				console.log(e)
				this.message('截图失败,请稍后再试', 2);
			}
		},
		dataURLtoBlob (base64Data) {
      var byteString;
      if (base64Data.split(',')[0].indexOf('base64') >= 0){
				byteString = atob(base64Data.split(',')[1]);
			}else{
				byteString = unescape(base64Data.split(',')[1]);
			}
      var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], {
          type: mimeString
      });
    }
	}
}
</script>

<style scoped>
.video-box{
	height: 60vh;
	text-align: center;
	position: relative;
}
video{
	max-width:1000px;
	max-height: 60vh;
}
.control-btn{
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width:50px;
	height: 50px;
	margin: auto;
	border-radius:50%;
	background: rgba(255,255,255,.5);
	opacity: 1;
}
.control-btn:before{
	content:'';
	display: block;
	position: absolute;
	border-style: solid;
}
.play-btn{
	opacity: 0;
	transform: scale(1.25);
	transition: all .3s;
}
.play-btn:before{
	top: 16px;
	left: 19px;
	width:12px;
	height: 18px;
	border-width:0 4px;
	border-color: #FFFFFF;
}
.pause-btn:before{
	top: 15px;
	left: 17px;
	border-width: 10px 0 10px 16px;
	border-color: transparent transparent transparent #FFF;
}
</style>
