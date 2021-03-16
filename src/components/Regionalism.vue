<template>
    <span class="regionallism" inline>
        <el-form-item :class="customLabelClass" class="pre-lable" label-width="80px">
            <el-select size="small" clearable :class="customSelectClass" class="select-item" placeholder="省" ref="provience_select" :filterable="area.provience.list.length > 7"
                       v-if="!area.provience.hide" v-model="area.provience.code" :disabled="area.provience.disable" @change="provienceChange(area.provience.code)">
                <el-option v-for="(provienceItem ,provienceIndex) in area.provience.list" :key="provienceItem.Code" :label="provienceItem.Name" :value="provienceItem.Code"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :class="customLabelClass" class="pre-lable">
            <el-select size="small" clearable :class="customSelectClass" class="select-item" placeholder="市" ref="city_select" :filterable="area.city.list.length > 7"
                       v-if="!area.city.hide" v-model="area.city.code" :disabled="area.city.disable" @change="cityChange(area.city.code)">
                <el-option v-for="(cityItem ,cityIndex) in area.city.list" :key="cityItem.Code" :label="cityItem.Name" :value="cityItem.Code"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :class="customLabelClass" class="pre-lable">
            <el-select size="small" clearable :class="customSelectClass" class="select-item" placeholder="区" ref="town_select" :filterable="area.town.list.length > 7"
                       v-if="!area.town.hide" v-model="area.town.code" :disabled="area.town.disable" @change="townChange(area.town.code)">
                <el-option v-for="(townItem ,townIndex) in area.town.list" :key="townItem.Code" :label="townItem.Name" :value="townItem.Code"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :class="customLabelClass" class="pre-lable">
            <el-select size="small" clearable :class="customSelectClass" class="select-item" placeholder="街道" ref="street_select" :filterable="area.street.list.length > 7"
                       v-if="!area.street.hide" v-model="area.street.code" @change="streetChange(area.street.code)">
                <el-option v-for="(streetItem ,streetIndex) in area.street.list" :key="streetItem.Code" :label="streetItem.Name" :value="streetItem.Code"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :class="customLabelClass" class="pre-lable">
            <el-select size="small" clearable :class="customSelectClass" class="select-item" placeholder="社区" ref="community_select" :filterable="area.community.list.length > 7"
                       v-if="!area.community.hide" v-model="area.community.code" @change="communityChange" :multiple="community_Multi">
                <el-option v-for="(communityItem ,communityIndex) in area.community.list" :key="communityItem.Code" :label="communityItem.Name" :value="communityItem.Code"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :class="customLabelClass" class="pre-lable" style="display: none">
            <el-select size="small" clearable :class="customSelectClass" class="select-item" style="display: none" placeholder="商圈" ref="businessDistrict_select" :filterable="area.businessDistrict.list.length > 7"
                       v-if="!area.businessDistrict.hide" v-model="area.businessDistrict.code" @change="businessDistrictChange">
                <el-option v-for="(businessDistrictItem ,businessDistrictIndex) in area.businessDistrict.list" :key="businessDistrictItem.Code" :label="businessDistrictItem.Name"
                           :value="businessDistrictItem.Code"></el-option>
            </el-select>
        </el-form-item>
    </span>
</template>


<script>
    /**
     * @module pagination
     * @desc   区域选择公共组件省市区、街道、社区、商圈，内容
     * @author xyt
     * @date   2019/1/22
     * @param  {Boolean} [disable] -该select是否可操作 true为不可操作
     * @param  {Array} [list] - 该select的option数据
     * @param  {string} [Code] - select的取值 v-model绑定，默认值可传递此值，标识默认选中
     * @param  {Boolean} [hide] - 该select是否显示 true为隐藏
     * @param  {customLabelText} 修改'行政区域'文本
     * @param  {customSelectClass} 给select框添加样式
     * @param  {customLabelClass} 给‘行政区域’添加样式
     * @param  {showAll} 选择全部的省市区 不和APP关联。
     * @param  {isAuth} 是否与权限相关 默认 0 无关则为1
     * @example 调用示例
     *   <area-choose :area="area"></area-choose>
     *   area数据结构见props
     */

    export default {
        data() {
            return {
                area: {
                    provience: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'name': '',
                        'hide': false
                    },
                    city: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'name': '',
                        'hide': false
                    },
                    town: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'name': '',
                        'hide': false
                    },
                    street: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'name': '',
                        'hide': false
                    },
                    community: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'name': '',
                        'hide': false,
                    },
                    businessDistrict: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'name': '',
                        'hide': false
                    }
                },
                customLabelText: '',
                customSelectClass: '',
                customLabelClass: '',
                allRegionDatas: []
            }
        },
        name: "Regionalism",
        props: {
            community_Multi: {
                type: Boolean,
                default: false
            },
            communityHide: {
                type: Boolean,
                default: false
            },
            showAll: {
                type: Boolean,
                default: false
            },
            appId: {
                type: String,
                default: ''
            },
            isAuth:{
              type:Number,
              default:0
            }

        },
        methods: {
            reShow(){
                this.area.city.list = this.getChild(this.area.provience.code);
                this.area.town.list = this.getChild(this.area.city.code);
                this.area.street.list = this.getChild(this.area.town.code);
                this.area.community.list = this.getChild(this.area.street.code);
            },
            provienceChange(provienceCode) {
                this.emptyCity();
                this.emptyTown();
                this.emptyStreet();
                this.emptyCommunity();
                this.emptyCityBusinessDistrict();
                this.area.city.list = this.getChild(this.area.provience.code);
                if(provienceCode!=""){
                    this.area.provience.name = this.area.provience.list.find((item)=>{
                        return  item.Code == this.area.provience.code;
                    }).Name;
                }else{
                    this.area.provience.name="";
		    this.area.provience.code="";
                }

                this.$emit('regionalismResult', this.area)
            },
            cityChange(cityCode) {
                this.emptyTown();
                this.emptyStreet();
                this.emptyCommunity();
                this.emptyCityBusinessDistrict();
                this.area.town.list = this.getChild(this.area.city.code);
                if(cityCode!=""){
                    this.area.city.name =  this.area.city.list.find((item)=>{
                        return  item.Code == this.area.city.code;
                    }).Name;
                }else{
                    this.area.city.name = '';
                }

                this.$emit('regionalismResult', this.area)
            },
            townChange(townCode) {
                this.emptyStreet();
                this.emptyCommunity();
                this.emptyCityBusinessDistrict();
                this.area.street.list = this.getChild(this.area.town.code);
                if(townCode!=""){
                    this.area.town.name = this.area.town.list.find((item)=>{
                        return  item.Code == this.area.town.code;
                    }).Name;
                }else{
                    this.area.town.name = "";
                }

                this.$emit('regionalismResult', this.area)
            },
            streetChange: function (streetId) {
                this.emptyCommunity();
                this.area.community.list = this.getChild(this.area.street.code);
                if(streetId!=""){
                    this.area.street.name = this.area.street.list.find((item)=>{
                        return  item.Code == this.area.street.code;
                    }).Name;
                }else{
                    this.area.street.name ="";
                }

                this.$emit('regionalismResult', this.area)
            },
            communityChange(communityCode) {
                if(communityCode!=""){
                    this.area.community.name = this.area.community.list.find((item)=>{
                        return  item.Code == this.area.community.code;
                    }).Name;
                }else{
                    this.area.community.name ="";
                }
                this.$emit('regionalismResult', this.area)
            },
            businessDistrictChange(businessDistrictCode) {
                if(businessDistrictCode!=""){
                    this.area.businessDistrict.name =  this.area.businessDistrict.list.find((item)=>{
                        return  item.Code == this.area.businessDistrict.code;
                    }).Name;
                }else{
                    this.area.businessDistrict.name = "";
                }
                this.$emit('regionalismResult', this.area)
            },
            emptyCity() {
                this.area.city.name ='';
                this.area.city.code = '';
                this.area.city.list = [];
            },
            emptyTown() {
                this.area.town.name ='';
                this.area.town.code = '';
                this.area.town.list = [];
            },
            emptyStreet() {
                this.area.street.name = '';
                this.area.street.code = '';
                this.area.street.list = [];
            },
            emptyCommunity() {
                this.area.community.name = '';
                if (this.community_Multi) {
                    this.area.community.code = [];
                } else {
                    this.area.community.code = '';
                }

                this.area.community.list = [];
            },
            emptyCityBusinessDistrict() {
                this.area.businessDistrict.name = '';
                this.area.businessDistrict.code = '';
                this.area.businessDistrict.list = [];
            },
            getRegion() {
                this.$api.GetAreaInfoList(this.isAuth,this.$utils.getUrlKey('userId')).then(res => {
                    if (res && res.Content) {
                        this.allRegionDatas = res.Content;
                        for (let item of res.Content) {
                            if (item.Level == '1') {
                                this.area.provience.list.push(item);
                            } else if (item.Level == '2') {
                                if (item.ParentCode == this.area.provience.code) {
                                    this.area.city.list.push(item);
                                }
                            } else if (item.Level == '3') {
                                if (item.ParentCode == this.area.city.code) {
                                    this.area.town.list.push(item);
                                }
                            } else if (item.Level == '4') {
                                if (item.ParentCode == this.area.town.code) {
                                    this.area.street.list.push(item);
                                }
                            }
                        }
                        if (this.showAll) {
                            this.$emit('initRegion', this.area);
                        }
                    }
                }).catch(r => {

                })
            },
            getChild(id) {
                let tem = [];
                for (let item of this.allRegionDatas) {
                    if (item.ParentCode == id) {
                        tem.push(item);
                    }
                }
                return tem;
            },
            getCityCode() {

                let data = {'appId': this.appId == "" ? this.$utils.getUrlKey("appId") : this.appId};
                if (data.appId == null || data.appId == "" || data.appId == undefined) {
                    return;
                }
                this.$api.GetCityCode(data).then(res => {
                  // let k = [
                  //   {"CityCode":"1-110000","CodeName":"北京市","Level":"1"},
                  //   {"CityCode":"2-110100","CodeName":"北京城区","Level":"2"},
                  //   {"CityCode":"","CodeName":"","Level":"3"}
                  // ]
                  // res = res.length > 1 ? res : k
                    if (res) {
                        for (let item_ of res) {
                            if (item_.Level == "1") {
                                if (item_.CityCode.length > 0) {
                                    this.area.provience.code = item_.CityCode;
                                    this.area.provience.disable = true;
                                }
                            } else if (item_.Level == "2") {
                                if (item_.CityCode.length > 0) {
                                    this.area.city.code = item_.CityCode;
                                    this.area.city.disable = true;
                                }
                            } else if (item_.Level == "3") {
                                if (item_.CityCode.length > 0) {
                                    this.area.town.code = item_.CityCode;
                                    this.area.town.disable = true;
                                }

                            } else if (item_.Level == "4") {
                                if (item_.CityCode.length > 0) {
                                    this.area.street.code = item_.CityCode;
                                    this.area.street.disable = true;
                                }

                            }
                        }
                        this.$emit('initRegion', this.area);
                        this.getRegion();
                    }
                }).catch(r => {

                })
            }
        },
        created() {

            if (this.showAll) {
                this.area.provience.disable = false;
                this.area.city.disable = false;
                this.area.town.disable = false;
                this.area.street.disable = false;
                this.getRegion();
            } else {
                this.getCityCode();
            }

            if (this.community_Multi) {
                this.area.community.code = [];
            } else {
            }
            this.area.community.hide = this.communityHide;
        }

    }

</script>
<style scoped lang="scss" type="text/scss">
    .pre-lable {
        /*font-size: 14px;*/
        /*color: #606266;*/
        /*line-height: 40px;*/
        /*padding: 0 12px 0 0;*/
        /*box-sizing: border-box;*/
        /*width: 82px;*/
        /*display: inline-block;*/
    }

    .select-item {
        width: 170px;
        height: 32px !important;
    }


</style>

<style lang="scss" type="text/scss">
    .regionallism {
        .el-tag--info i {
            display: none;
        }

        .el-select__tags {
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
        }

        .el-select--small input:first-child {
            height: 32px !important;
        }
    }
</style>
