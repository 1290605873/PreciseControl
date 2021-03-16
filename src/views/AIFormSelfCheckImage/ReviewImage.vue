<template>
	<el-dialog
		:title="title"
		custom-class="operate-dialog"
		:visible.sync="reviewImageShow"
		width="1000px"
		top="10vh"
		:close-on-click-modal="false"
		append-to-body
		@close="Close">
		<div class="maxDialog_">
			<iframe
					id="childiframe"
					src="static/via/via.html" 
					scrolling="auto"
					frameborder="0"
					style="height: 100%;width: 100%">
			</iframe>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="Close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
export default {
	name:'ReviewImage',
	props:{
		ShowReviewImage:{
			type:Boolean,
			required: true
		},
		ReviewImageData:{
			type:Object,
			required:true
		}
	},
	data(){
		return{
			title:'审查图片',
			reviewImageShow: false,
			AppId:'',
			UserId:'',
			OrgId:'',
			index:'',
			val:{}
		}
	},
	created(){
		this.AppId = this.$utils.getUrlKey("appId")
		this.UserId = this.$utils.getUrlKey("userId")
		this.OrgId = this.$utils.getUrlKey("curChangeOrg")
		window['toserver'] = (data) => {
			let regions = [], AttrList = [],AuditOptionList = [],TextList = []
			regions = data[this.val.OriginalPicture + this.val.Id + ''].regions
			// console.log(regions)
			let fixArr = [], selfArr = []
			fixArr = regions.filter(i => i.rasoncode.indexOf("wrongText") == -1)
			selfArr = regions.filter(i => i.rasoncode.indexOf("wrongText") > -1)
			fixArr = fixArr.map(i => {
				let code = ''
				let tempObj = this.ReviewImageData.AttrList.find(k => k.AttrName == i.rason)
				if(tempObj){
					code = tempObj.AttrCode
					i.rasoncode = code
				}
				return i
			})
			AttrList = fixArr.filter((i,j) => {
				let b = fixArr.findIndex(k => k.rasoncode == i.rasoncode)
				return b == j
			})
			AttrList = AttrList.map(i => {
				return {
					AttrCode:i.rasoncode,
						AttrTxt: i.rason
					}
			})
			AuditOptionList = fixArr.map(i => {
				return {
					AttrTxt: i.rason,
					AttrCode:i.rasoncode,
					InitHeight: this.val.InitHeight,
					InitWidth:this.val.InitWidth,
					Height: i.shape_attributes.height,
					Width:	i.shape_attributes.width,
					Left:	i.shape_attributes.x,
					Top: i.shape_attributes.y,
				}
			})
			TextList = selfArr.map(i => {
				return {
					Text: i.rason,
					AttrCode:i.rasoncode,
					InitHeight: this.val.InitHeight,
					InitWidth:this.val.InitWidth,
					Height: i.shape_attributes.height,
					Width:	i.shape_attributes.width,
					Left:	i.shape_attributes.x,
					Top: i.shape_attributes.y,
				}
			})
			let p = {
				Id: this.val.Id,
				UserId:this.UserId,
				AppId: this.AppId,
				UserName: this.ReviewImageData.userName,
				AttrList:AttrList,
				picType: this.ReviewImageData.picType,
				PicturePath:this.ReviewImageData.PicturePath,
				AuditOptionList: AuditOptionList,
				TextList:TextList,
				InitHeight:this.val.InitHeight,
				InitWidth:this.val.InitWidth
			}
			// console.log(JSON.stringify(p))
			// return
			this.$api.SingleSubmit(p).then(res => {
			if (res.IsSuccess) {
						this.message('审核成功', 1);
				} else {
						this.message('审核失败', -1);
				}
				document.getElementById("childiframe").contentWindow.reportting = false
				this.Close()
			}).catch(r => {
				this.message('审核失败', -1);
				document.getElementById("childiframe").contentWindow.reportting = false
				this.Close()
			})
		};
		window['message'] = (msg, type) => {
				this.message(msg, type);
		}
	},
	watch:{
		ShowReviewImage(v){
			if(v){
				this.reviewImageShow = true
				this.init()
			}
		}
	},
	methods:{
		init(){
			this.index = this.ReviewImageData.index
			this.val = this.ReviewImageData.val
			let _via_img_metadata = {}
			let arr = this.val.wrongItem.map(k=>{
				return {
					"shape_attributes": {
						"name": "rect",
						"x": k.Left,
						"y": k.Top,
						"width": k.Width,
						"height": k.Height
					},
					"region_attributes": {},
					'rason':  k.AttrTxt,
					'rasoncode': k.AttrCode
				}
			});
			_via_img_metadata[this.val.OriginalPicture + this.val.Id + ''] = {
					filename: this.val.OriginalPicture,
					"size": -1,
					"regions": arr,
			}
			window.markPicsObj = {
				"_via_settings": {
					"ui": {
						"annotation_editor_height": 25,
						"annotation_editor_fontsize": 0.8,
						"leftsidebar_width": 18,
						"image_grid": {
							"img_height": 80,
							"rshape_fill": "none",
							"rshape_fill_opacity": 0.3,
							"rshape_stroke": "yellow",
							"rshape_stroke_width": 2,
							"show_region_shape": true,
							"show_image_policy": "all"
						},
						"image": {
							"region_label": "__via_region_id__",
							"region_label_font": "10px Sans",
							"on_image_annotation_editor_placement": "NEAR_REGION"
						}
					},
					"core": {
						"buffer_size": 18,
						"filepath": {},
						"default_filepath": ""
					},
					"project": {
						"name": "via_project_9Jul2019_15h53m"
					}
				},
				"_via_attributes": {
					"region": {},
					"file": {}
				},
				_via_img_metadata: _via_img_metadata
			};

			window.wrongItem = this.ReviewImageData.AttrList
			// console.log(window.wrongItem)
		},
		Close(){
			this.reviewImageShow = false
			this.$emit('CloseReviewImage', false)
		}
	}
}
</script>

<style scoped>
.maxDialog_{
        height: calc(80vh - 106px);
        overflow-y: auto;
        font-size: 0;
    }
</style>
