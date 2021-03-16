import AreaChoose from '../../components/AreaChoose';
import Pagination from '../../components/Pagination';
// 餐厅信息
export default {
    components: {
        AreaChoose,
        Pagination
    },
    data() {
        return {
            gridParam: {
                area: {
                    provience: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    },
                    city: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    },
                    town: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    },
                    street: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    },
                    community: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    },
                    businessDistrict: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    },

                },
                radio1: 1,
                radio2: 2,
                StoreStatus: [],//营业状态,
                gridTotalCount: 0,
                giridPageNum: 1,
                giridPageLimit: 20,
                gridLoading: true, //loading显示,
                Name: '',//门店名称,
                CompanyName: '',//单位名称,
                OperateTypeList: [],//经营类型数据
                LicenceCode: '',//许可证号
                Address: '',//门店地址
                table: {
                    //表头
                    StoreName: "门店名称",
                    CompanyName: "单位名称",
                    StroeAddress: "门店地址",
                    StoreStatus: "状态",
                    LegalPerson: "法人",
                    LegalPhone: "联系电话",
                    Level: "量化等级",
                    operate: '操作'
                },
                gridList: [],
                gridHeight: 500,
                ShopDetails: 'ShopDetails',
                showChooseOperate: false,
                chooseOperateIds: '',
                chooseOperateNames: '食品-餐饮,食品-食堂',
                OperateType: '',//经营类型
                operateTypeProps: {
                    children: 'children',
                    label: 'Name'
                }
            }
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            // this.computeGridH();
        })
    },
    created: function () {
        //let data = {'appId': this.$utils.getUrlKey("appId")};
        let data = {'appId': "f5268875-4cce-4a9e-b9fb-9bd8052aa55c"};
        this.$api.GetCityCode(data).then(
            res => {
                let province, city, town;
                let hasProvince, hasTown, hasCity;
                if (res && res.date && res.date.length > 0) {
                    for (let i = 0; i < res.date.length; i++) {
                        let value = res.date[i];
                        if (value.Level == 1) {//省
                            province = {
                                CityCode: value.CityCode,
                                CodeName: value.CodeName
                            }
                        } else if (value.Level == 2) {//市
                            city = {
                                CityCode: value.CityCode,
                                CodeName: value.CodeName
                            }
                        } else if (value.Level == 3) {//区
                            town = {
                                CityCode: value.CityCode,
                                CodeName: value.CodeName
                            }
                        }
                    }
                    if (province && province.CityCode && province.CityCode.length > 0) {//省存在
                        hasProvince = true;

                        this.gridParam.area.provience.disable = true;
                        this.gridParam.area.provience.list.push({
                            Code: province.CityCode,
                            Name: province.CodeName
                        });
                        this.gridParam.area.provience.code = province.CityCode;
                    } else {
                        hasProvince = false;
                    }
                    if (city && city.CityCode && city.CityCode.length > 0) {//市存在
                        hasCity = true;
                        this.gridParam.area.city.disable = true;
                        this.gridParam.area.city.list.push({
                            Code: city.CityCode,
                            Name: city.CodeName
                        });
                        this.gridParam.area.city.code = city.CityCode;
                    } else {
                        hasCity = false;
                    }
                    if (town && town.CityCode && town.CityCode.length > 0) {//区存在
                        hasTown = true;
                        this.gridParam.area.town.disable = true;
                        this.gridParam.area.town.list.push({
                            Code: town.CityCode,
                            Name: town.CodeName
                        });
                        this.gridParam.area.town.code = town.CityCode;
                    } else {
                        this.gridParam.area.town.disable = false;
                        hasTown = false;
                    }
                    if (!hasProvince && !hasCity && !hasTown) {//都不存在
                        this.$alert('未获取到该应用的省市区域,请联系后台管理人员查询处理', '该应用配置出错', {
                            confirmButtonText: '确定',
                        });
                    } else {
                        if (hasTown) {
                            this.loadBusinessAttr_(town.CityCode);
                        } else {
                            if (hasCity) {
                                this.loadLocation(city.CityCode, 2);
                            } else {
                                if (hasProvince) {
                                    this.loadLocation(province.CityCode, 1);
                                }
                            }
                        }
                        this.getOperateDate();
                    }
                }
            }
        ).catch(
            error => {

            }
        )

    },
    methods: {
        toTree(data) {
            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            let map = {};
            data.forEach(function (item) {
                map[item.Id] = item;
            });
            let val = [];
            data.forEach(function (item) {
                // 以当前遍历项，的pid,去map对象中找到索引的id
                let parent = map[item.ParentId];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                    val.push(item);
                }
            });
            return val;
        },

        getOperateDate() {
            this.$api.GetOperateTypeList({}).then(res => {
                if (res) {
                    res.Content.unshift(
                        {
                            Id: "00000000-0000-0000-0000-000000000000",
                            ParentId: "",
                            Name: "经营类型"
                        }
                    );
                    this.gridParam.OperateTypeList = this.toTree(res.Content);
                }
                let operateArr = [];
                let operateArr_names = [];
                let item_id, item_name, item_pid;
                //放入一个根节点
                // operateArr_all.push({
                //     id: "00000000-0000-0000-0000-000000000000",
                //     pId: "",
                //     name: "经营类型",
                //     open: true
                // });
                for (let i = 0; i < res.Content.length; i++) {
                    //食品-食堂  ed8e25c8-5b9a-434b-aac6-c8c2a18f5021
                    //食品-餐饮  7d6815f0-09cb-47a0-aa08-6be84d138a80
                    item_id = res.Content[i].Id;
                    item_pid = res.Content[i].ParentId;
                    item_name = res.Content[i].Name;
                    if (item_id == "ed8e25c8-5b9a-434b-aac6-c8c2a18f5021" || item_id == "7d6815f0-09cb-47a0-aa08-6be84d138a80"
                        || item_pid == "ed8e25c8-5b9a-434b-aac6-c8c2a18f5021" || item_pid == "7d6815f0-09cb-47a0-aa08-6be84d138a80"
                    ) {//默认餐饮、食堂
                        operateArr.push(item_id);
                        operateArr_names.push(item_name);
                    }
                }
                this.gridParam.chooseOperateIds = operateArr;
                this.getNewGridStoreList();
            }).catch(error => {
            });
        },

        loadBusinessAttr_: function (areaCode) {
            let data = {"AreaCode": areaCode};
            this.$api.GetBusinessAttr(data).then(res => {
                if (res != null) {
                    if (res.LocationList) {
                        this.gridParam.area.street.list = res.LocationList;
                    }
                    if (res.BusinessDistrictList) {
                        this.gridParam.area.businessDistrict.list = res.BusinessDistrictList//商圈
                    }
                }
            }).catch(error => {
            })
        },
        loadLocation(areaCode, tag) {
            //tag 1 获取city tag 2获取street
            switch (tag) {
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;
            }
            let data = {"ParentCode": areaCode};
            this.$api.GetBusinessAttr(data).then(res => {
            }).catch(error => {
            })
        },
    
        getNewGridStoreList() {
            let data = this.getGridParam();
            this.$api.GetNewGridStoreList(data).then(res => {

                this.gridParam.gridLoading = false;
                this.gridParam.gridList = res.rows;
                this.gridParam.gridTotalCount = res.records;

            }).catch(error => {
                this.gridParam.gridLoading = false;
            })
        },
        refreshGrid(page) {
            if (page) {
                this.gridParam.giridPageNum = page;
            }

            this.gridParam.gridLoading = true;
            let data = this.getGridParam();
            this.$api.GetNewGridStoreList(data).then(res => {
                this.gridParam.gridLoading = false;
                this.gridParam.gridList = res.rows;
                this.gridParam.gridTotalCount = res.records;
            }).catch(error => {
            })

        },
        getGridParam() {
            let streetParam = this.gridParam.area.street.code;
            let provinceParam = this.gridParam.area.provience.code;
            let cityParam = this.gridParam.area.city.code;
            let townParam = this.gridParam.area.town.code;
            if (streetParam != null && streetParam.length > 0) {
                provinceParam = "";
                cityParam = "";
                townParam = "";
            } else {
                streetParam = "00000000-0000-0000-0000-000000000000";
                if (townParam.length > 0) {
                    provinceParam = "";
                    cityParam = "";
                } else {
                    if (cityParam.length > 0) {
                        provinceParam = "";
                    } else {
                        if (provinceParam.length > 0) {
                            //
                        }
                    }
                }
            }
            let BusinessStatus = 3, Status = -1;
            if (this.gridParam.StoreStatus.toString().indexOf('8') != -1) {//停业选中
                BusinessStatus = "1";
            }
            if (this.gridParam.StoreStatus.length > 0) {
                Status = this.gridParam.StoreStatus.toString();
            }

            let data = {
                page: this.gridParam.giridPageNum,
                rows: this.gridParam.giridPageLimit,
                AppId: this.$utils.getUrlKey("appId"),
                UserId: this.$utils.getUrlKey("userId"),
                OrgId: this.$utils.getUrlKey("curChangeOrg"),
                Name: this.gridParam.Name,
                CompanyName: this.gridParam.CompanyName,
                Community: this.gridParam.area.community.code,
                Location: streetParam,
                BusinessDistrict: this.gridParam.area.businessDistrict.code, //商圈
                BusinessMarket: "", //商场 //需求去掉了 2018 12 05 edited by xyt
                OperateType: JSON.stringify(this.gridParam.chooseOperateIds),
                Address: this.gridParam.Address,
                Level: '',
                Year: '',
                BusinessStatus: BusinessStatus,
                Status: Status,
                ProvinceCode: provinceParam,
                CityCode: cityParam,
                DistrictCode: townParam
            };
            return data;
        },
        getBusinessCommunity(streetId) {
            let data = {"LocationId": streetId};
            this.$api.GetBusinessCommunity(data).then(res => {
                this.gridParam.area.community.list = res.CommunityList;
            }).catch(error => {
            })
        },

        provienceChange(code) {
        },
        cityChange(code) {
        },
        townChange(code) {
        },
        streetChange(code) {
            if(code == ''){//清空了
                this.gridParam.area.community.list = [];
                this.gridParam.area.community.code = '';
            }else{
                this.getBusinessCommunity(code);
            }

        },
        // 弹出经营类型对话框
        showOperateDialog() {
            this.gridParam.showChooseOperate = !this.gridParam.showChooseOperate;
            //设置回显
        },
        handleClose() {

            this.gridParam.chooseOperateIds = this.$refs.operate_tree.getCheckedKeys();
            let checkNodes = this.$refs.operate_tree.getCheckedNodes();
            this.gridParam.chooseOperateNames = '';
            let result = [];
            for (let checkNode of checkNodes) {
                if (checkNode.ParentId == '00000000-0000-0000-0000-000000000000') {
                    result.push(checkNode.Name);
                }
            }
            this.gridParam.chooseOperateNames = result.toString();
            this.getGridParam().OperateType = this.gridParam.chooseOperateNames.toString();
            this.gridParam.showChooseOperate = !this.gridParam.showChooseOperate;
        },
        //删除
        deleteStore(storeId) {
            this.$confirm('确定删除门店?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {"storeId": storeId};
                this.$api.DeleteImportStore(data).then(res => {
                    this.refreshGrid();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: '删除失败!'
                    });
                });

            }).catch(() => {

            });
        },
        // 添加列表数据
        addList(){

        }   
    },
    filters: {
        computeStoreStatus(status) {
            if (status == "1") return "已导入";
            if (status == "2") return "生成失败";
            if (status == "3") return "待认领";
            if (status == "4") return "待完善";
            if (status == "5") return "营业中";
            if (status == "8") return "已停业";
            return '';
        }
    }

}