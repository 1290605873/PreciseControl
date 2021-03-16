<template>
		<el-dialog
			:title="title"
			:visible.sync="showEditEquip"
			:append-to-body="true"
			width="600px"
			@close="Close">
			<el-scrollbar>
				<el-form label-width="80px">
					<el-form-item label="设备类型">
						<el-input v-model="type" style="width:200px;"></el-input>
					</el-form-item>
					<el-form-item label="型号">
						<el-select v-model="modelNumber">
							<el-option></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="图示">
						<img :src="imageUrl" alt="">
					</el-form-item>
					<el-form-item label="测量单位">
						<div v-for="(i,j) in paramList" :key="j">
							<el-input v-model="i.value" style="width:200px;"></el-input>
							<el-button
								v-if="j == 0"
								size="mini"
								icon="el-icon-plus"
								style="margin-left:10px"
								@click="AddParam">
							</el-button>
							<el-button
								v-else
								size="mini"
								icon="el-icon-close"
								style="margin-left:10px"
								@click="DelParam(j)">
							</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-scrollbar>
			<span slot="footer">
				<el-button @click="Close">取 消</el-button>
				<el-button type="primary" @click="Ensure">确 定</el-button>
			</span>
		</el-dialog>
</template>

<script>
export default {
	name:'EditEquip',
	props: {
		EditEquitShow: {
			type: Boolean,
			required: true
		},
		EditEquitData:{
			type:Object,
			required: true
		},
	},
	data(){
		return{
			title:'',
			showEditEquip: false,
			type:'',
			number:'',
			imageUrl:'',
			paramList:[
				{value:''}
			],
			isEdit: false
		}
	},
	watch:{
		EditEquitShow(v){
			if(v){
				this.showEditEquip = v
				this.init()
			}
		}
	},
	methods:{
		init(){
			if(this.EditEquitData.id != '00000000-0000-0000-0000-000000000000'){
				this.title="新增设备"
				this.type = this.EditEquitData.type
				this.number = this.EditEquitData.number
				this.imageUrl = this.EditEquitData.imageUrl
				let tempArr = this.EditEquitData.type
				// this.paramList =
			}else{
				this.title="编辑设备"
				this.type = ''
				this.number = ''
				this.imageUrl = ''
				this.paramList = [{value:''}]
			}
		},
		Close(){
			this.showEditEquip = false
			this.$emit('CloseEditEquip', false)
		},
		Ensure(){
			this.Close()
		},
		AddParam(){
			let o = {value:''}
			this.paramList.push(o)
		},
		DelParam(j){
			this.paramList.splice(j,1)
		}
	}
}
</script>

<style scoped>
	.el-scrollbar >>> .el-scrollbar__wrap{
		max-height:60vh;
	}
</style>
