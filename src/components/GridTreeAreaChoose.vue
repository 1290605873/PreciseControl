<template>
	<div>
		<el-tree
			:props="defaultProps"
			lazy
			ref="tree"
			:load="loadNode"
			:highlight-current="true"
			node-key="id"
			:show-checkbox="check"
			:default-checked-keys="checkedKeys"
			:default-expanded-keys="baseCode"
			:expand-on-click-node="false"
			@check-change="nodeChange"
			@check="getCheck"
			check-strictly
			@node-click="labelClick"></el-tree>
	</div>
</template>

<script>
/**
* @module GridTreeAreaChoose
* @desc 权限树形地址功能
* @author tansb
* @date 2020/4/28
* @Attributes [baseCode] {Object} 设置树形基础节点
* @Attributes [limit] {Number} 设置可选择的层级 3 加载到区级 4 加载到街道 5 加载到社区
* @Attributes [check] {Boolean} 设置是否开启多选

* @Attributes [checkedKey] {Array}设置默认选中节点
* @Attributes [isRadio] {Boolean} 设置是否开启单选
* @Attributes [checkStrictly] {Boolean} 开启选择时，是否严格的遵循父子不互相关联

* @events [getLoadNode] {Function} 输出当前树节点对象，初次生效
* @events [getCurrentNode] {Function} 输出当前节点对象，点击生效
* @event [getChecked] {Function} 输出当前选中的节点 选中生效
* @example 示例
* BaseCode = [{id:'1-110000',pId:'0-000000','name':'北京市'}]
* <GridTreeAreaChoose :baseCode="BaseCode" @getLoadNode="loadNode" @getCurrentNode="clickNode"></GridTreeAreaChoose>
*/
export default {
	name:'GridTreeAreaChoose',
	props:{
		baseCode:{
			type: Array,
			required: false
		},
		check:{
			type:Boolean,
			required: false,
			default: false
		},
		checkedKey:{
			type:[String,Array],
			required:false,
		},
		isRadio:{
			type:Boolean,
			default:false
		},
		checkStrictly:{
			type: Boolean,
			default: true
		}
	},
	data(){
		return{
			defaultProps: {
				children: 'children',
				label: 'name',
				isLeaf:'leaf'
			},
			disabledLevel:0,
			baseNode:[],
			level:0,
			currentCheck:{},
			checkedKeys:[this.checkedKey],
			fixedNode:[]
		}
	},
	created(){
		this.initData()

	},
	watch:{
		checkedKey:{
			handler(o,n){
				console.log(o,n)
				if(JSON.stringify(o) != JSON.stringify(n)){
					console.log(1)
					this.$refs.tree.setCheckedKeys([],true)
					this.initData()
					console.log(this.checkedKey)
				}
			},
			deep:true
		}
	},
	methods:{
		// 初始设置
		initData(){
			if(typeof(this.checkedKey) == 'String'){
				this.checkedKeys = [this.checkedKey]
			}else{
				this.checkedKeys = this.checkedKey
			}
		},
		// 加载子节点
		loadNode(node,resolve){
			// console.log(node)
			this.level = node.data == undefined ? -1 : node.data.level
			if (this.level == -1) { //
				this.creatBaseNode(resolve)
			}
			if (this.level == 0) { //
					this.creatBaseNode(resolve)
				}
			else if(node.data && !node.data.IsChecked){
				let tempArr = this.fixedNode.filter(i => i.pId == node.data.id)
				return resolve(tempArr)
			}else{
				// console.log(this.level,'check')
				let params = {}
				
				if(this.level > 0 && this.level < 3){
					params = {
						'code':node.data.id
					}
					this.getAreaList(params,resolve)
				}else if(this.level == 3){  // 这里查到街道
					params = {"areaCode":node.data.id}
					this.GetBusinessLocation(params,resolve)
				}else if(this.level == 4){  // 这里查到社区
					params = {"LocationId":node.data.id}
					this.GetBusinessCommunity(params,resolve)
				}else{
					return resolve([])
				}
				this.$emit('getLoadNode',node,this.level)
			}
			
		},
		// 生成基础节点
		creatBaseNode(resolve){
			this.$api.GetAreaListShow().then(res => {
			if(res && res.IsSuccess){
				this.disabledLevel = parseInt((res.Content.find(i => i.IsChecked)).Level) - 1
				if(res.Content.length>5){//全国
					if(this.level == 0){
						res.Content.splice(0,1)
					}
				}
				this.fixedNode = res.Content.map(i => {
					let o = {}
					o['id'] = i.Code
					o['pId'] = i.ParentCode == null ? '' :i.ParentCode
					o['name'] = i.Code + i.Name
					o.level = i.Level
					o.IsChecked = i.IsChecked
					o['disabled'] = parseInt(i.Code.slice(0,1)) <= this.disabledLevel ? true : false
					return o
				})
				
				this.baseNode = this.fixedNode.filter(i => i.level == this.fixedNode[0].level)
			}
			let k = {}
			k.data = this.baseNode[0]
			k.isBase = true
			if(res.Content.length>5){//全国
				if(this.level == 0){
					this.$emit('getLoadNode', {
						id:'0-000000',
						pId:'',
						name:'根目录',
						level:0,
						IsChecked:true,
						disabled:true
					},0)
				}else{
					this.$emit('getLoadNode', k,this.baseNode[0].level)
				}
			}else{
				this.$emit('getLoadNode', k,this.baseNode[0].level)
			}
			resolve(this.baseNode)
		}).catch(()=>{})
		},

		//获取区域接口
		getAreaList(p,resolve) {
			this.$api.GetAreaByCode(p).then(res => {
				let t = res.map(i => {
				let o = {}
				o['id'] = i.Code
				o['pId'] = i.ParentCode == null ? '' :i.ParentCode
				o['name'] = i.Code + i.Name
				o.IsChecked = true
				o['disabled'] = parseInt(i.Code.slice(0,1)) <= this.disabledLevel ? true : false
				o['level'] = i.Code.slice(0,1)
				return o
				})
				resolve(t)
			}).catch(()=>{})
		},

		// 根据区域获取街道
		GetBusinessLocation(p,resolve){
			this.$api.GetBusinessLocation(p).then(res => {
				let t = res.map(i => {
				let o = {}
				o['id'] = i.SelectValue
				o['pId'] = p.areaCode
				o['name'] = i.SelectName
				o.IsChecked = true
				o['level'] = 4
				return o
				})
				resolve(t)
			})
		},

		// 根据街道获取社区
		GetBusinessCommunity(p,resolve){
			this.$api.GetBusinessCommunity(p).then(res => {
				let t = res.map(i => {
				let o = {}
				o['id'] = i.SelectValue
				o['pId'] = p.LocationId
				o['name'] = i.SelectName
				o.IsChecked = true
				o['level'] = 5
				return o
				})
				// console.log(t)
				resolve(t)
			})
		},

		//获取当前节点
		labelClick(data){
			// console.log(data)
			this.level = data == undefined ? -1 : data.level
			data.level = this.level
			this.$emit('getCurrentNode',data)
		},
		// 当前节点选中状态改变
		nodeChange(data,check){
			if(this.isRadio){
				let tempArr = []
				if(check){
					this.currentCheck = this.$utils.deepCopy(data)
					tempArr.push(data)
					this.$refs.tree.setCheckedNodes(tempArr)
					this.$emit('getCheckedNode',this.currentCheck)
				}
			}
		},
		getCheck(v,d){
			if(!this.isRadio){
				if(d.checkedNodes.length){
					for(let i=0;i<d.checkedNodes.length;i++){
						if(d.checkedNodes[i].id === '0-000000'){
							d.checkedNodes.splice(i,1);
							d.checkedKeys.splice(i,1);
						}
					}
				}
				this.currentCheck = this.$utils.deepCopy(d.checkedNodes)
				this.$emit('getCheckedNode',this.currentCheck)
			}
			if(d.checkedKeys.length == 0){
				this.nodeChange(v,true)
			}
		},
		toTree(data) {
						// 将数据存储为 以 id 为 KEY 的 map 索引数据列
						let map = {};
						data.forEach(function (item) {
								map[item.Code] = item;
						});
						let val = [];
						data.forEach(item => {
								// 以当前遍历项，的pid,去map对象中找到索引的id
								let parent = map[item.ParentCode];
								if (parent) {
										(parent.children || (parent.children = [])).push(item);
								} else {
										//如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
										// this.$utils.consoleObj(item);//顶级节点
										// this.tree.topNode.Name = item.Name;
										// this.tree.topNode.Code = item.Code;
										//默认展开一个顶级
										// this.tree.defaultExpand.push(item.Code);
										val.push(item);
								}
						});
						return val;
				},
	}
}
</script>

<style scoped>
	.el-tree{
		background: rgb(236, 245, 255);
	}
</style>
