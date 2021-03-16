import Pagination from "@/components/Pagination"
import TreeAreaChoose from '@/components/TreeAreaChoose'
import EditThreshold from './EditThreshold'
export default {
	name:'ThresholdSet',
	components:{
		Pagination,
		EditThreshold,
    TreeAreaChoose
	},
	data(){
		return{
			AppId:'', // appId
			SubId:'', // 用户id
			limitLevel:5, // 地址选择层级限制
			currentCode:'', // 当前地址节点
			currentCodeLevel:'', // 当前地址节点等级
			currentParentCode:'', // 当前地址父节点
			currentParentCodeLevel:'', // 当前地址父节点等级
			equipList:[], // 设备类型列表
			hourTypeList:[
				{},
				{label:'连续工作时长',value:1},
				{label:'断开工作时长',value:2}
			],
			hourLimitList:[
				{},
				{label:'>',value:1},
				{label:'=',value:2},
				{label:'<',value:3}
			],
			AlarmtTypeList:[ // 报警类型列表
				'无',
				'立即通知',
			],
			tableData:[], // 表格数据列表
			threshold:{ // 阈值设置组件数据
				show: false, // 是否显示
				data:{ // 单项数据
					Id:'',  // 当前Id
					AppId: this.AppId,
					SubId: this.SubId,
					AreaLevel: this.currentCodeLevel, // 区域编码
					AreaCode: this.currentCode, // 区域等级
					ParentCode:'',
					ParentLevel:'',
					parentsCode:[], // 父级区域
					TypeName: '', // 设备名称
					TypeId:'', // 设备Id
					SubList:[ // 计量单位设置值列表
						{
							UnitDesc:'', // 名称
							Unit:'', // 符号
							MinValue: 0, // 最小值
							MaxValue: 0 // 最大值
						}
					]
				}
			}
		}
	},
	created(){
		this.AppId = this.$utils.getUrlKey('appId')
		this.SubId = this.$utils.getUrlKey('userId')
	},
	methods:{
		// 地址节点加载
		loadNode(v, d, p){
			this.threshold.data.parentsCode = this.$utils.deepCopy(p)
			if(v.data){
				console.log(v.data)
				this.currentCode =v.data.id.length < 9 ? v.data.id.slice(2, 8) : v.data.id
				this.currentCodeLevel = d
				this.currentParentCode = v.data.pId.length < 9 ? v.data.pId : v.data.pId
				this.currentParentCodeLevel = this.currentCodeLevel - 1
				if(d > 0){
					this.getEquipType()
					this.getTableList()

				}
			}
		},
		//点击左侧tree
    ZTreeOnClick(data, p) {
			this.threshold.data.parentsCode = this.$utils.deepCopy(p)
			console.log(data)
			this.currentCode =data.id.length == 8 ? data.id.slice(2, 8) : data.id
			this.currentCodeLevel = data.pId.length < 1 ? 0 : data.pId.length < 9 ? Number(data.pId.slice(0,1))	+ 1 : 5
			this.currentParentCode = data.pId.length < 1 ? '0-000000': data.pId.length < 9 ? data.pId : data.pId
			this.currentParentCodeLevel = this.currentCodeLevel - 1
			if(this.currentCodeLevel > 0){
				this.getEquipType()
				this.getTableList()
			}
		},
		// 获取设备类型
		getEquipType(){
			let p = {
				AreaCode:this.currentCode,
				AreaLevel: this.currentCodeLevel
			}
			this.$api.GetIntelligentDeviceTypeList(p).then(res => {
				if(res && res.IsSuccess){
					this.equipList = res.Content
				}else{
					this.message(res.Message, -1)
				}
			}).catch(()=>{})
		},
		// 获取列表数据
		getTableList(){
			let p = {
				AreaCode: this.currentCode
			}
			this.$api.GetThresholdSettingList(p).then(res => {
				if(res && res.IsSuccess){
					this.tableData = res.Content
				}else{
					this.tableData = []
					this.message(res.Message, -1)
				}
			}).catch(()=>{})
		},
		// 新增
		Add(){
			if(!this.currentCode){
				this.message('不可在根目录上设置阈值',-1)
				return
			}
			let m = this.equipList.find(i => i.IsUse == 0)
			if(!m){
				this.message('所有设备均已添加', -1)
				return
			}
			this.threshold.data.Id ='00000000-0000-0000-0000-000000000000'
			this.threshold.data.TypeId =  m.Id
			this.threshold.data.AppId = this.AppId
			this.threshold.data.SubId = this.SubId
			this.threshold.data.AreaLevel = this.currentCodeLevel
			this.threshold.data.AreaCode = this.currentCode
			this.threshold.data.ParentLevel = this.currentParentCodeLevel
			this.threshold.data.ParentCode = this.currentParentCode
			this.threshold.show = true
		},
		// 编辑
		Edit(d,b){
			let m = this.equipList.find(i => i.Name == d.TypeName)
			d.TypeId = m.Id
			d.AppId = this.AppId
			d.SubId = this.SubId
			d.AreaLevel = this.currentCodeLevel
			d.AreaCode = this.currentCode
			d.ParentLevel = this.currentParentCodeLevel
			d.ParentCode = this.currentParentCode
			d.parentsCode = this.threshold.data.parentsCode
			this.threshold.show = true
			this.threshold.data = d
		},
		// 删除
		Delete(d){
			let p = {
				Id: d
			}
			this.$confirm('确认删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$api.DelThresholdSettingById(p).then(res => {
					if (res && res.IsSuccess) {
						this.message(res.Message, 1)
						this.getEquipType()
						this.getTableList()
					} else {
						this.message(res.Message, -1);
					}
				}).catch(() => {});
			}).catch(() => {});
		},
		// 关闭编辑
		CloseThreshold(){
			this.threshold.show = false
			this.getEquipType()
			this.getTableList()
		}
	}
}
