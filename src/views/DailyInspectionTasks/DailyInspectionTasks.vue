<template>
	<div class="dailyInspTask">
		<div class="header">
			<div class="taskName">{{ date }}</div>
			<div class="times">
				<div>
					<span>第1次</span>
					<span>第2次</span>
					<span>第3次</span>
					<span>第4次</span>
					<span>第5次</span>
					<span>第6次</span>
					<span>第7次</span>
					<span>第8次</span>
					<span>第9次</span>
					<span>第10次</span>
					<span>第11次</span>
					<span>第12次</span>
					<span>第13次</span>
					<span>第14次</span>
					<span>第15次</span>
					<span>第16次</span> 
					<div style="clear:both;"></div>
				</div>
			</div>
		</div>
		<div class="content">
			<div class="list" v-for="item in list">
				<h5>{{ item.StoreName }}</h5>
				<p><span>规模:</span><span>{{ item.StoreSecTypeName }}</span></p>
				<p><span>地址:</span><span>{{ item.Address }}</span></p>
				<p><span>电话:</span><span>{{ item.LinkTel }}</span></p>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		data() {
			return {
				date:'2019年6月3日',
				list:[
					{
						StoreName:"红黄蓝幼儿园食堂......",
						StoreSecTypeName:"中型餐饮",
						Address:"北京市海淀区上地东路5-3号",
						LinkTel:"15892922929"
					},
					{
						StoreName:"红黄蓝幼儿园食堂......",
						StoreSecTypeName:"中型餐饮",
						Address:"北京市海淀区上地东路5-3号",
						LinkTel:"15892922929"
					},
					{
						StoreName:"红黄蓝幼儿园食堂......",
						StoreSecTypeName:"中型餐饮",
						Address:"北京市海淀区上地东路5-3号",
						LinkTel:"15892922929"
					}
				],
			}
		},
		created(){
			this.$utils.flexible();
		},
		methods:{
			// GetStoreListBySubTask(){
			// 	let data = {
			// 		"TaskId": "string",
			// 		"Number": 0,
			// 		"TaskStatus": 0
			// 	}
			// 	this.$api.GetStoreListBySubTask(data).then(res=>{

			// 	}).catch((=>{

			// 	}))
			// }
		}
	}
</script>
<style scoped lang="scss">
	.dailyInspTask{
		width:100%;
		height:100%;
		.header{
			padding-left:.24rem;
			height:auto;
		}
	}
	.header .taskName{
		font-size:.24rem;
		line-height:.24rem;
		margin-top:.2rem;
		color:#5E637B;
	}
	.times{
		overflow-x:scroll;

	}
	::-webkit-scrollbar {
	    display: none;
	}

	.times div{
		width:100%;
		list-style:none;
		margin-top:.2rem;
		margin-bottom:0;
		padding-left:0;
	}
	.times div span{
		white-space:nowrap;
		background:#EBECF0;
		font-size:.26rem;
		line-height:.26rem;
		color:#5E637B;
		padding:.1rem .26rem;
		margin:0 .2rem .3rem 0;
		text-align:center;
	}
	.list{
		clear:both;
		padding-left:.24rem;
		border-bottom:.02rem solid #EEEEEE;
		h5{
			font-size:.32rem;
		}
		p{
			font-size:.26rem;
			line-height:.26rem;
			color:#5E637B;
		}
	}

</style>