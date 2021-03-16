<template>
	<div>
		<el-form inline size="middle">
			<el-form-item>
				<el-input v-model="searchData"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="Search">搜索</el-button>
			</el-form-item>
			<el-form-item style="float:right">
				<el-button  type="primary" size="mini" @click="Add">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="tableData">
			<el-table-column type="index" label="序号"></el-table-column>
			<el-table-column label="设备类型" prop="type"></el-table-column>
			<el-table-column label="图示">
				<template  slot-scope="scope">
					<div class="img-box">
						<img :src="scope.row.imageUrl" alt="" class="">
					</div>
				</template>
			</el-table-column>
			<el-table-column label="型号" prop="number"></el-table-column>
			<el-table-column label="测量单位" prop="unit"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="Edit(scope.row)">修改</el-button>
					<el-button type="danger" size="mini" @click="Delete(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<pagination
			v-show="pages.total>0"
			:total="pages.total"
			:page.sync="pages.page"
			:limit.sync="pages.limit"
			@pagination="pageChange">
		</pagination>
		<EditEquip 
			:EditEquitShow="editEquit.show"
			:EditEquitData="editEquit.data"
			@CloseEditEquip="CloseEditEquip">
		</EditEquip>
	</div>	
</template>

<script>
import Pagination from '@/components/Pagination'
import EditEquip from './EditEquip.vue'
import Img from '@/assets/logo.png'
export default {
	name:'IOTEquipDictionary',
	components:{
		Pagination,
		EditEquip
	},
	data(){
		return{
			searchData:'',
			tableData:[
				{
					id:'d2c91743-7c09-40de-8ed4-7b618fc8179e',
					type:'专间 - 温湿度传感器',
					imageUrl: Img,
					number:'587',
					unit:'温度：°C',
				},
				{
					id:'d2c91743-7c09-40de-8ed4-7b618fc8179e',
					type:'专间 - 温湿度传感器',
					imageUrl: Img,
					number:'587',
					unit:'温度：°C',
				},
				{
					id:'d2c91743-7c09-40de-8ed4-7b618fc8179e',
					type:'专间 - 温湿度传感器',
					imageUrl: Img,
					number:'587',
					unit:'温度：°C',
				}
			],
			editEquit:{
				show: false,
				data:{
					id: '',
					type:'',
					imageUrl:'',
					number:'',
					unit:[]
				}
			},
			pages:{
				total: 0,
				page: 1,
				limit: 20
			},
		}
	},
	created(){
		this.init()
	},
	methods:{
		// 初始化
		init(){
			this.getTableList()
		},
		// 获取列表数据
		getTableList(){
			let p = {

			}
			//
		},
		// 搜索
		Search(){
			this.pages.page = 1
			this.getTableList()
		},
		// 添加
		Add(){
			this.editEquit.show = true
			this.editEquit.data = {
				id:'00000000-0000-0000-0000-000000000000',
				type:'',
				imageUrl:'',
				number:'',
				unit:[]
			}
		},
		// 删除
		Delete(d){
			let p = {
				id: d
			}
			this.$confirm('确认删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// 删除
				this.$api.DelLib(p).then(res => {
						if (res && res.IsSuccess) {
							this.message(res.Message, 1);
							this.getTableList()
						} else {
							this.message(res.Message, -1);
						}
				}).catch(() => {});
			}).catch(() => {});
		},
		// 修改
		Edit(p){
			this.editEquit.show = true
			this.editEquit.data = p
		},
		// 关闭编辑
		CloseEditEquip(){
			this.editEquit.show = false
		},
		// 翻页
		pageChange(v){
			this.pages.page = v.page 
			this.pages.limit = v.limit
			this.getTableList()
		},
	}
}
</script>

<style scoped>
.img-box{
	width: 80px;
	height: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.img-box img{
	max-width: 80px;
	max-height: 80px;
}
</style>