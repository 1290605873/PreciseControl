<template>
	<el-dialog
		:title="title"
		:visible.sync="thresholdShow"
		:append-to-body="true"
		width="800px"
		top="10vh"
		@close="Close">
		<el-form
			label-width="164px">
			<el-form-item label="设备类型:">
				<el-select
					v-model="formData.TypeId"
					style="width:380px"
					@change="selectChange">
					<el-option v-for="(i,j) in EquipList"
						:key="j"
						:label="i.Name"
						:value="i.Id"
						:disabled="i.IsUse == 1? true : false">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item
				label="测量单位:">
				<span v-for="(i, j) in formData.SubList" :key="j" class="unit-box">
					{{i.UnitDesc}}：{{i.Unit}}
				</span>
			</el-form-item>
			<el-form-item label="隐藏湿度:" v-if="formData.MonitorWay == 2">
				<el-radio-group v-model="formData.IsHidHumidity">
					<el-radio
						v-for="(i, j) in showHumidityList"
						:key="j"
						:label="i.value">
						{{i.label}}
					</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="检测方式:" v-if="formData.MonitorWay == 1">
				<el-select v-model="formData.MonitorWayValue" style="width:180px;" @change="changeMonitorWay">
					<el-option
						v-for="(i, j) in MonitorWayValueList"
						:key="j"
						:label="i.label"
						:value="i.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="工作时间："
				v-if="formData.MonitorWay == 2 || formData.MonitorWay == 3 || (formData.MonitorWay == 1 && formData.MonitorWayValue == 1)">
				<div
					class="workTimeBox"
					v-for="(i, j) in formData.WorkTimeList"
					:key="j">
					<el-time-picker
				    is-range
				    v-model="i.timeRange"
						:picker-options="{
      				selectableRange: '00:00:00 - 23:59:59'
    				}"
						format="HH:mm:ss"
						value-format="HH:mm:ss"
				    range-separator="至"
				    start-placeholder="开始时间"
				    end-placeholder="结束时间"
				    placeholder="选择时间范围">
				  </el-time-picker>
					<el-button v-if="j == 0" icon="el-icon-plus" @click="operateTime"></el-button>
					<el-button v-else icon="el-icon-minus" @click="operateTime(j)"></el-button>
				</div>
			</el-form-item>
			<el-form-item label="设定频次："
				v-if="formData.MonitorWay == 4 || (formData.MonitorWay == 1 && formData.MonitorWayValue == 2)">
				<el-input
					style="width:180px;"
					v-model.trim="formData.Frequency"
					type="number"
					placeholder="请输入频次">
				</el-input>
			</el-form-item>
			<el-form-item label="设定时长："
				v-if="formData.MonitorWay == 4 || (formData.MonitorWay == 1 && formData.MonitorWayValue == 2)">
				<el-input
					style="width:180px;"
					placeholder="请输入时长"
					type="number"
					v-model="formData.WorkHours">
    			<template slot="append">
					分钟
					</template>
				</el-input>
			</el-form-item>
			<el-form-item
				v-if="formData.MonitorWay == 1 || formData.MonitorWay == 2 || (formData.MonitorWay == 3 && formData.ShowType == 2)"
				v-for="(i, j) in formData.SubList"
				:key="j"
				:label="'阈值设置(' +i.UnitDesc + ')：'">
				<el-input style="width:180px" v-model.trim="i.MinValue"></el-input>
				&nbsp;至&nbsp;
				<el-input style="width:180px" v-model.trim="i.MaxValue"></el-input>
			</el-form-item>
			<el-form-item
				v-if="formData.MonitorWay == 3 && formData.ShowType == 3"
				:label="formData.SubList[0].UnitDesc">
				<el-input style="width:180px" v-model.trim="formData.SubList[0].MinValue" type="number" placeholder="请输入时长">
					<template slot="append">
						分钟
					</template>
				</el-input>
				
			</el-form-item>
			<el-form-item
				v-if ="formData.MonitorWay == 1 || formData.MonitorWay == 2"
				:label=" formData.MonitorWay == 2 ? '开启值（温度）' : '开启值（强度）'">
				<el-select v-model="formData.OpeningValueOperate" style="width:120px">
					<el-option
						v-for="(i, j) in OpeningValueList"
						:key="j"
						:label="i.label"
						:value="i.value">
					</el-option>
				</el-select>
				<el-input
					style="width:180px;margin-left:10px;"
				 	v-model="formData.OpeningValue"
				 	type="number"
				 	placeholder="请输入开启值">
				</el-input>
			</el-form-item>
			<!-- <el-form-item
				label="工作时长：">
				<el-select v-model="formData.WorkHoursType" style="width:150px;margin-right:10px;">
					<el-option
						v-for="(i,j) in hourTypeList"
						:key="j"
						:label="i.label"
						:value="i.value"
					></el-option>
				</el-select>
				<el-select v-model="formData.WorkHoursOperate" style="width:90px;margin-right:10px;">
					<el-option
						v-for="(i,j) in hourLimitList"
						:key="j"
						:label="i.label"
						:value="i.value">
					</el-option>
				</el-select>
				<el-input
					v-model.trim="formData.WorkHours"
					style="width:80px;margin-right:10px;">
				</el-input>
				min
			</el-form-item> -->
		</el-form>
		<span slot="footer">
			<el-button @click="Close">取 消</el-button>
			<el-button type="primary" @click="Ensure">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
export default {
	name:'EditThreshold',
	props:{
		ShowThreshold:{
			type: Boolean,
			required: true
		},
		EquipList:{
			type: Array,
			required: false
		},
		ThresholdData:{
			type: Object,
			required: true
		}
	},
	data(){
		return{
			thresholdShow: false,
			title:'',
			isEdit: false,
			formData:{
				TypeId:'', // 设备类型Id
				TypeName:'', // 设备名称
				WorkHoursType:1, // 工作时长类型
				WorkHoursOperate:1, // 工作时长比较值
				WorkHours: null, // 工作时长
				MonitorWay: 0,
				IsHidHumidity: 2, // 是否隐藏湿度
				MonitorWayValue: 1,// 检测方式
				Frequency: null, // 设定频次
				OpeningValue: null, // 开启值
				OpeningValueOperate: null, // 开启值方式
				WorkTimeList: [],
				SubList: []
			},
			hourTypeList:[
				{label:'连续工作时长',value:1},
				{label:'断开工作时长',value:2}
			],
			hourLimitList:[
				{label:'>',value:1},
				{label:'=',value:2},
				{label:'<',value:3}
			],
			showHumidityList:[
				{label:'是',value: 2},
				{label:'否',value: 1}
			],
			MonitorWayValueList: [
				{label:'工作时间',value: 1},
				{label:'频次',value: 2}
			],
			OpeningValueList: [
				{label: '>', value: 0},
				{label: '<', value: 1}
			],
			timeModel:{
				timeRange:["",""]
			}
		}
	},
	watch:{
		ShowThreshold(v){
			if(v){
				this.thresholdShow = true
				this.init()
			}
		}
	},
	methods:{
		// 初始化
		init(){
			this.isEdit = this.ThresholdData.Id != '00000000-0000-0000-0000-000000000000'
			this.formData.TypeId = this.ThresholdData.TypeId
			if(this.isEdit){
				this.title = '编辑阈值设置'
			}else{
				this.title = '新增阈值设置'
			}
			this.selectChange(this.formData.TypeId)
			if(this.isEdit){
				this.GetThresholdSettingById(this.ThresholdData.Id)
			}
		},
		// 关闭
		Close(){
			this.thresholdShow = false
			this.$emit('CloseThreshold',false)
		},
		// 获取单条数据 (废弃)
		GetThresholdSettingById(d){
			let p = {
				Id:d
			}
			this.$api.GetThresholdSettingById(p).then(res => {
				if(res && res.Success){
					let tempArr = []
					tempArr = this.$utils.deepCopy(res.SubList)
				  tempArr = tempArr.map(i => {
						i.MinValue = i.MinValue == -99999 ? null : i.MinValue
						i.MaxValue = i.MaxValue == 99999 ? null : i.MaxValue
						return i
					})
					this.formData.SubList = tempArr
				}
			}).catch(()=>{})
		},
		// 确定
		Ensure(){
			if(this.formData.MonitorWay == 0 || this.formData.MonitorWay == 4 ||
				(this.formData.MonitorWay == 1 && this.formData.MonitorWayValue == 1) ){
				this.formData.WorkHours = null
			}
			if(this.formData.MonitorWay == 0 || this.formData.MonitorWay == 4 ||
				(this.formData.MonitorWay == 3 && this.formData.ShowType == 1)){
				this.formData.SubList = this.formData.SubList.map(i => {
					i.MaxValue = null
					i.MinValue = null
					return i
				})
			}
			let WorkTimeList
			if( (this.formData.MonitorWay == 1 && this.formData.MonitorWayValue == 1) ||this.formData.MonitorWay == 2 || this.formData.MonitorWay == 3 ){
				this.formData.Frequency = 0
				WorkTimeList = this.formData.WorkTimeList.map(i => ({
					StartTime:i.timeRange[0],
					EndTime:i.timeRange[1]
				}))
			}else{
				WorkTimeList = []
			}

			let Reg = /^-?[0-9]+(.[0-9]{1,2})?$/;
			let intReg = /^[1-9]\d{0,}$/;
			if(this.formData.MonitorWayValue == 2 && !intReg.test(this.formData.Frequency)){
				this.message('频次只能为正整数',-1)
				return
			}
			if( this.formData.MonitorWayValue == 2 && !intReg.test(this.formData.WorkHours) || 
			(this.formData.MonitorWay == 3 && this.formData.ShowType == 3 && !intReg.test(this.formData.SubList[0].MinValue))  ){
					this.message('时长只能为正整数',-1)
					return
			}
			let a = WorkTimeList.some(i => i.StartTime == '' || i.EndTime == '')
			if(this.formData.MonitorWayValue == 1 && a){
				this.message('请输入工作时间', -1)
				return
			}
			let b = this.formData.SubList.every(i =>
		    i.MinValue == null || i.MaxValue == null ||
				(i.MinValue != null && Reg.test(Number(i.MinValue))) &&
				(i.MaxValue != null&& Reg.test(Number(i.MaxValue)))
			)
			let c = this.formData.SubList.every(i =>
				i.MinValue == null || i.MaxValue == null || (Number(i.MinValue) <= Number(i.MaxValue))
			)
			if(!b){
				this.message('阈值只能为数字',-1)
				return
			}
			if(!c){
				this.message('最小值不得大于最大值',-1)
				return
			}

			let SubList = this.$utils.deepCopy(this.formData.SubList)
			SubList = SubList.map(i => {
				i.HidHumidityType = (this.formData.MonitorWay == 2 && i.Unit == '%') ? this.formData.IsHidHumidity : 0
				return i
			})

			let p = {
				Id: this.ThresholdData.Id,
				AppId: this.ThresholdData.AppId,
				SubId: this.ThresholdData.SubId,
				AreaLevel: this.ThresholdData.AreaLevel,
				AreaCode: this.ThresholdData.AreaCode,
				TypeId: this.formData.TypeId,
				TypeName: this.formData.TypeName,
				SubList: SubList,
				WorkHours:this.formData.WorkHours,
				WorkHoursType: 0,
				WorkHoursOperate: 0,
				AlarmtType: 0,
				AlarmInterval: '',
				OpeningValue: this.formData.OpeningValue,
				OpeningValueOperate: this.formData.OpeningValueOperate,
				IsHidHumidity:this.formData.IsHidHumidity,
				MonitorWayValue:this.formData.MonitorWayValue,
				Frequency:this.formData.Frequency,
				WorkTimeList:WorkTimeList
			}
			this.$api.AddOrUpdateThreshold(p).then(res=>{
				if(res && res.IsSuccess){
					this.Close()
					this.message(res.Message, 1)
				}else{
					this.message(res.Message, -1)
				}
			}).catch(()=>{})
		},
		// 设备类型下拉改变
		selectChange(v){
			this.formData.TypeId = v
			let m = this.EquipList.find(i => i.Id == v)
			this.formData.MonitorWay = m.MonitorWay
			if(v == this.ThresholdData.TypeId && this.isEdit){
				this.formData.ShowType = this.ThresholdData.ShowType
				this.formData.TypeName = this.ThresholdData.TypeName
				this.formData.WorkHours = this.ThresholdData.WorkHours == null ? 0 : parseInt(this.ThresholdData.WorkHours)
				this.formData.IsHidHumidity = this.ThresholdData.IsHidHumidity
				this.formData.MonitorWayValue = this.ThresholdData.MonitorWayValue
				this.formData.Frequency = this.ThresholdData.Frequency
				this.formData.OpeningValue = this.ThresholdData.OpeningValue
				this.formData.OpeningValueOperate = this.ThresholdData.OpeningValueOperate
				if(this.ThresholdData.workTimeList.length > 0){
					this.formData.WorkTimeList = this.ThresholdData.workTimeList.map(i => {
						i.StartTime = i.StartTime.length < 6 ? i.StartTime + ':00' : i.StartTime
						i.EndTime = i.EndTime.length < 6 ? i.EndTime + ':00' : i.EndTime
						return {
							timeRange:[i.StartTime,i.EndTime]
						}
					})
				}else{
					this.formData.WorkTimeList = [this.$utils.deepCopy(this.timeModel)]
				}
				this.GetThresholdSettingById(this.ThresholdData.Id)
			}else{
				this.GetDefaultThresholdSetting(v)
			}
		},
		// 增减时间范围
		operateTime(k){
			if(k > 0){
				this.formData.WorkTimeList.splice(k,1)
			}else{
				this.formData.WorkTimeList.push(this.$utils.deepCopy(this.timeModel))
			}
		},
		// 获取默认设备参数
		GetDefaultThresholdSetting(d){
			let data = {
				DeviceTypeId:d,
				ParentAreaLevel: this.ThresholdData.ParentLevel,
				ParentAreaCode:this.ThresholdData.ParentCode,
				AreaList:this.ThresholdData.parentsCode
			}
			this.$api.GetDefaultThresholdSetting(data).then(res => {
				if(res && res.Success){
					this.formData.ShowType = res.ShowType
					this.formData.TypeName = res.TypeName
					this.formData.WorkHours = res.WorkHours == null ? 0 : parseInt(res.WorkHours)
					this.formData.IsHidHumidity = res.IsHidHumidity
					this.formData.MonitorWayValue = res.MonitorWayValue
					this.formData.Frequency = res.Frequency
					this.formData.OpeningValue = res.OpeningValue
					this.formData.OpeningValueOperate = res.OpeningValueOperate
					this.formData.SubList = res.SubList.map(i => {
						i.MinValue = i.MinValue == -99999 ? null : i.MinValue
						i.MaxValue = i.MaxValue == 99999 ? null : i.MaxValue
						return i
					})
					if(res.workTimeList.length > 0) {
						this.formData.WorkTimeList = res.workTimeList.map(i => {
							i.StartTime = i.StartTime.length < 6 ? i.StartTime + ':00' : i.StartTime
							i.EndTime = i.EndTime.length < 6 ? i.EndTime + ':00' : i.EndTime
							return {
								timeRange:[i.StartTime,i.EndTime]
							}
						})
					}else{
						this.formData.WorkTimeList = [this.$utils.deepCopy(this.timeModel)]
					}
				}
			}).catch(() => {})
		},
		// 改变检测方式
		changeMonitorWay(v){
			if(v == 2){
				this.formData.Frequency = 0
				this.formData.WorkHours = 0
			}else{
				this.formData.WorkTimeList = [this.$utils.deepCopy(this.timeModel)]
			}
		}
	}
}
</script>

<style scoped lang="scss">
.el-input{
	/deep/ .el-input-group__append{
		padding:0 10px;
	}
}
	.workTimeBox{
		display:flex;
		margin: 4px 0;
		.el-date-editor{
			width:320px;
		}
		/deep/ .el-input__icon{
			line-height:24px;
		}
		/deep/ .el-range-separator{
			width:10%;
			line-height:24px;
		}
		.el-button{
			margin-left: 10px;
		}
	}
	.unit-box{
		padding-right: 40px;
		opacity: .5;
	}
</style>
