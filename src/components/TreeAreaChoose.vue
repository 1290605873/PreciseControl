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
			:check-strictly="checkStrictly"
			@node-click="labelClick"></el-tree>
	</div>
</template>

<script>
/**
* @module TreeAreaChoose
* @desc 树形四级地址功能
* @author tansb
* @date 2020/4/28
* @Attributes [baseCode] {Object} 设置树形基础节点
* @Attributes [limit] {Number} 设置可选择的层级 3 加载到区级 4 加载到街道 5 加载到社区
* @Attributes [check] {Boolean} 设置是否开启多选

* @Attributes [checkedKey] {Array}设置默认选中节点
* @Attributes [disabledLevel] {Number} 设置禁止选中的等级 比如  1 默认省级区域不可选  2  市级省级不可选 3区级及以上不可选
* @Attributes [isRadio] {Boolean} 设置是否开启单选
* @Attributes [checkStrictly] {Boolean} 开启选择时，是否严格的遵循父子不互相关联

* @events [getLoadNode] {Function} 输出当前树节点对象，初次生效
* @events [getCurrentNode] {Function} 输出当前节点对象，点击生效
* @event [getChecked] {Function} 输出当前选中的节点 选中生效
* @example 示例
* BaseCode = [{id:'1-110000',pId:'0-000000','name':'北京市'}]
* <TreeAreaChoose :baseCode="BaseCode" @getLoadNode="loadNode" @getCurrentNode="clickNode"></TreeAreaChoose>
*/
export default {
	name:'TreeAreaChoose',
	props:{
		baseCode:{
			type: Array,
			required: false
		},
		limit:{
			type: Number,
			required: false,
			default: 4
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
		disabledLevel:{
			type:Number,
			default:0
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
			baseNode:[{
				id: "0-000000",
				pId: "",
				name: "根目录",
				disabled:true
			}],
			level:0,
			currentCheck:{},
			checkedKeys:[]
		}
	},
	created(){
		this.initData()
	},
	watch:{
		checkedKey:{
			handler(o,n){
				console.log(o,n)
				if(JSON.stringify(o) != JSON.stringify((n))){
					console.log(1)
					this.$refs.tree.setCheckedKeys([],true)
					this.initData()
					console.log(this.checkedKey)
				}
				// if(typeof(v) == 'String'){
				// 	v = [v]
				// }
				// this.$refs.tree.setCheckedKeys(v,true)
			},
			deep:true
		}
	},
	methods:{
		// 初始设置
		initData(){
			if(this.baseCode){
				this.baseNode = this.baseCode
				if(typeof(this.checkedKey) == 'String'){
					this.checkedKeys = [this.checkedKey]
				}else{
					this.checkedKeys = this.checkedKey
				}
			}
		},
		// 加载子节点
		loadNode(node,resolve){
			this.level = node.data == undefined ? -1 : node.data.id.length < 9 ? parseInt(node.data.id.slice(0,1)) : 4
			if(node.data){
				let ParentArr = this.getAllParent(node)
				this.$emit('getLoadNode',node,node.data.level,ParentArr)
			}else{
				this.$emit('getLoadNode',node,this.level,[])
			}
			if(this.level >= this.limit){
				return resolve([])
			}
			let params = {}
			if (this.level == -1) { // 初始 加载 死数据
				return resolve(this.baseNode);
			}else if(this.level == 0){ //
				this.getAreaList({},resolve)
			}else if(this.level > 0 && this.level < 3){
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
		},
		//获取区域接口
		getAreaList(p,resolve) {
			this.$api.GetAreaByCode(p).then(res => {
				let t = res.map(i => {
				let o = {}
				o['id'] = i.Code
				o['pId'] = i.ParentCode == null ? '' :i.ParentCode
				o['name'] = i.Code + i.Name
				o['disabled'] = parseInt(i.Code.slice(0,1)) <= this.disabledLevel ? true : false
				o['level'] = parseInt(i.Code.slice(0,1))
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
				o['level'] = 5
				return o
				})
				resolve(t)
			})
		},
		//获取当前节点
		labelClick(data,node){
			let ParentArr = this.getAllParent(node)
			this.level = data == undefined ? -1 : data.level
			this.$emit('getCurrentNode',data,ParentArr)
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
				console.log(d)
				this.currentCheck = this.$utils.deepCopy(d.checkedNodes)
				this.$emit('getCheckedNode',this.currentCheck)
			}
			if(d.checkedKeys.length == 0){
				this.nodeChange(v,true)
			}
		},
		getAllParent(obj){
			let arr = []
			getParent(obj)
			function getParent(o){
				if(o.level > 1) {
					arr.push({
						level: o.data.level,
						code: o.data.id,
						parentCode:o.data.pId,
						parentLevel:o.data.level - 1,
						name:o.data.name
					}
				)
					if(o.parent){ getParent(o.parent)}
				}
			}
			return arr
		}
	}
}
</script>

<style>
</style>
