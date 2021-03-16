import Pagination from '@/components/Pagination'
export default{
	name:'SelfCheckFormDataMark',
	components: {
		Pagination
	},
	data(){
		return{
			tableData:[
				{
					id:'',
					formName:'晨检',
					formField: '拍摄双手、拍摄头部'
				}
			],
			pages:{
				page: 0,
				limit: 20,
				total: 100
			}
		}
	},
	created(){
		console.log(1)
		this.init()
	},
	methods:{
		init(){
			console.log(2)
		},
		getTableList(){

		},
		Add(){

		},
		Edit(){

		},
		Delete(){

		},
		pageChange(v){
			this.pages.page = v.page
			this.pages.limit = v.limit
		}
	}
}