import Pagination from "@/components/Pagination";
export default {
	components: {
		Pagination,
	},
	data() {
		return {
			searchValue:{
				SeeRule:'',
				SeeRuleDatas:[],
				page:1,
				rows:20,
				total:0,
			},
			list:[],
			Loading:false,
		}
	},
	created(){
		this.GetMapDataNames();
		this.GetMapFilterCondition();
	},
	methods:{
		/*
		** 数据源
		 */
		GetMapDataNames(){
		    let data = {
		        'mapType':-1
		    }
		    this.$api.GetMapDataNames(data).then(res =>{
		        if(res && res.IsSuccess){
		            this.searchValue.SeeRuleDatas = res.Content;
		        }
		    }).catch(error =>{
		
		    })
		},
		GetMapFilterCondition(){
			let data = {
				'MapDataType':this.searchValue.SeeRule,
				'PageNo':this.searchValue.page,
				'PageSize':this.searchValue.rows,
			}
			this.$api.GetMapFilterCondition(data).then(
				 res => {
					 if(res && res.IsSuccess){
						this.list = res.Content;
						this.searchValue.total = res.Data;
					 }
				 }
			)
		},
		GetMapTemplatAll(){
			this.$api.GetMapTemplatAll({}).then(
				res => {
					if(res && res.IsSuccess){
						this.searchValue.SeeRuleDatas = res.Content;
					}
				}
			)
		}
	},
}