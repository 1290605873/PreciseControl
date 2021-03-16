<template>
    <div>
        <label :class="customLabelClass" class="pre-lable" >{{customLabelText}}</label>

        <el-select :class="customSelectClass" class="select-item" placeholder="省" :filterable="area.provience.list.length > 7" v-if="!area.provience.hide" v-model="area.provience.code" :disabled="area.provience.disable" @change="provienceChange(area.provience.code)">
            <el-option v-for="(provienceItem ,provienceIndex) in area.provience.list" :key="provienceItem.Code" :label="provienceItem.Name" :value="provienceItem.Code"></el-option>
        </el-select>
    
        <el-select :class="customSelectClass" class="select-item" placeholder="市" :filterable="area.city.list.length > 7" v-if="!area.city.hide" v-model="area.city.code" :disabled="area.city.disable" @change="cityChange(area.city.code)">
            <el-option v-for="(cityItem ,cityIndex) in area.city.list" :key="cityItem.Code" :label="cityItem.Name" :value="cityItem.Code"></el-option>
        </el-select>
    
        <el-select :class="customSelectClass" class="select-item" placeholder="区" :filterable="area.town.list.length > 7" v-if="!area.town.hide" v-model="area.town.code" :disabled="area.town.disable" @change="townChange(area.town.code)">
            <el-option v-for="(townItem ,townIndex) in area.town.list" :key="townItem.Code" :label="townItem.Name" :value="townItem.Code"></el-option>
        </el-select>
    
        <el-select :class="customSelectClass" class="select-item" placeholder="街道" :filterable="area.street.list.length > 7" v-if="!area.street.hide" v-model="area.street.code" @change="streetChange(area.street.code)">
            <el-option v-for="(streetItem ,streetIndex) in area.street.list" :key="streetItem.SelectValue" :label="streetItem.SelectName" :value="streetItem.SelectValue"></el-option>
        </el-select>

        <el-select :class="customSelectClass" class="select-item" placeholder="社区" :filterable="area.community.list.length > 7" v-if="!area.community.hide" v-model="area.community.code">
            <el-option v-for="(communityItem ,communityIndex) in area.community.list" :key="communityItem.SelectValue" :label="communityItem.SelectName" :value="communityItem.SelectValue"></el-option>
        </el-select>

        <el-select :class="customSelectClass" class="select-item" placeholder="商圈" :filterable="area.businessDistrict.list.length > 7" v-if="!area.businessDistrict.hide" v-model="area.businessDistrict.code">
            <el-option v-for="(businessDistrictItem ,businessDistrictIndex) in area.businessDistrict.list" :key="businessDistrictItem.SelectValue" :label="businessDistrictItem.SelectName" :value="businessDistrictItem.SelectValue"></el-option>
        </el-select>
    </div>
</template>


<script>
    /**
     * @module pagination
     * @desc   区域选择公共组件省市区、街道、社区、商圈
     * @author xyt
     * @date   2019/1/22
     * @param  {Boolean} [disable] -该select是否可操作 true为不可操作
     * @param  {Array} [list] - 该select的option数据
     * @param  {string} [Code] - select的取值 v-model绑定，默认值可传递此值，标识默认选中
     * @param  {Boolean} [hide] - 该select是否显示 true为隐藏
     * @param  {customLabelText} 修改'行政区域'文本
     * @param  {customSelectClass} 给select框添加样式
     * @param  {customLabelClass} 给‘行政区域’添加样式
     * @example 调用示例
     *   <area-choose :area="area"></area-choose>
     *   area数据结构见props
     */

    export default {
        data() {
            return {
            }
        },
        name: "AreaChoose",
        props: {
            area: {
                provience: {
                    'disable': {
                        type: Boolean,
                        default: false
                    },
                    'list': {
                        type:Array,
                        default:[]
                    },
                    'code': {
                        type:String,
                        default:''
                    },
                    hide: {
                        type: Boolean,
                        default: false
                    }
                },
                city: {
                    'disable': {
                        type: Boolean,
                        default: false
                    },
                    'list': {
                        type:Array,
                        default:[]
                    },
                    'code': {
                        type:String,
                        default:''
                    },
                    hide: {
                        type: Boolean,
                        default: false
                    }
                },
                town: {
                    'disable': {
                        type: Boolean,
                        default: false
                    },
                    'list': {
                        type:Array,
                        default:[]
                    },
                    'code': {
                        type:String,
                        default:''
                    },
                    hide: {
                        type: Boolean,
                        default: false
                    }
                },
                street: {
                    'disable': {
                        type: Boolean,
                        default: false
                    },
                    'list': {
                        type:Array,
                        default:[]
                    },
                    'code': {
                        type:String,
                        default:''
                    },
                    hide: {
                        type: Boolean,
                        default: false
                    }
                },
                community: {
                    'disable': {
                        type: Boolean,
                        default: false
                    },
                    'list': {
                        type:Array,
                        default:[]
                    },
                    'code': {
                        type:String,
                        default:''
                    },
                    hide: {
                        type: Boolean,
                        default: false
                    }
                },
                businessDistrict: {
                    'disable': {
                        type: Boolean,
                        default: false
                    },
                    'list': {
                        type:Array,
                        default:[]
                    },
                    'code': {
                        type:String,
                        default:''
                    },
                    hide: {
                        type: Boolean,
                        default: false
                    }
                },
            },
            customLabelText:{
                default:"行政区域",
                type:String
            },
            customSelectClass:{
                type:String,
                default:''
            },
            customLabelClass:{
                type:String,
                default:''
            }

        },
        methods:{
            provienceChange() {
                this.$emit('provienceChange',this.area.provience.code)
            },
            cityChange() {
                this.$emit('cityChange',this.area.city.code)
            },
            townChange() {
                this.$emit('townChange',this.area.town.code)
            },
            streetChange:function(streetId) {
                this.$emit('streetChange',this.area.street.code)
            }

        }
    }

</script>
<style scoped>
    .pre-lable {
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
        width: 82px;
    }
    .select-item{
        width:180px;
        height: 34px;
        padding-right:10px;
    }
</style>
