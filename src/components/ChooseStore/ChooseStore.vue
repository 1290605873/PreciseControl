<template>
    <div>
        <div class="maxDialog">
            <div>
                <el-button type="primary" v-if="isShowButtonStore" plain @click="selectCheckingObject.queryStoreDialog.show=true">按门店添加</el-button>
                <el-button type="primary" v-if="ProcessType==1" plain
                           v-text="!isShowButtonStore?'查看类型规则':'按类型添加'"
                           @click="openFindStoreByType"></el-button>
                <el-button type="primary" v-if="isShowButtonStore" plain @click="batchDel">批量移除</el-button>
                <el-button type="primary" v-if="isShowButtonStore" plain @click="allDel">全部移除</el-button>
            </div>
            <el-table
                    ref="haschooseGrid"
                    class="calcTableH"
                    border
                    height="200px"
                    style="width: 100%;margin-top: 10px"
                    :data="tableData">
                <el-table-column type="index" width="60" align="center"></el-table-column>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column :label="selectCheckingObject.addTable.CompanyName" min-width="80px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.StoreName}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column :label="selectCheckingObject.addTable.storeName" min-width="80px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.StoreName}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column :label="selectCheckingObject.addTable.licence" min-width="80px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.License}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="selectCheckingObject.addTable.TwoLevelFormat" min-width="80px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.StoreTypeSecond}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="selectCheckingObject.addTable.storeAddress" min-width="80px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.StoreAddress}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="80px" show-overflow-tooltip v-if="isShowButtonStore">
                    <template slot="header" slot-scope="scope">
                        <el-input
                                v-model="search"
                                size="mini"
                                placeholder="输入关键字搜索"/>
                    </template>
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="del(scope.$index)">移除</el-button>
                    </template>
                </el-table-column>
                <!--<el-table-column :label="selectCheckingObject.addTable.operate" min-width="80px" show-overflow-tooltip>-->
                <!--<template>-->
                <!--<span>{{}}</span>-->
                <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <pagination ref="pagination_show"
                        :total="pageTotal"
                        :page.sync="pageIndex"
                        :limit.sync="pageSize"
                        @pagination="topTablePageNation">
            </pagination>
            <div slot="footer" style="text-align: center;margin-top: 10px" v-if="isShowButtonStore">
                <el-button @click="storesResult(-1)">取消</el-button>
                <el-button type="primary" style="margin-left: 20px" @click="storesResult">确定</el-button>
            </div>
        </div>
        <el-dialog
                v-if="selectCheckingObject.queryStoreDialog.show"
                class="findStoreClass"
                append-to-body
                :close-on-click-modal="false"
                title="查找门店"
                :visible.sync="selectCheckingObject.queryStoreDialog.show"
                top='10vh'
                width="80%"
                :before-close="closeDialog">
            <div class="maxDialog" style="width: 100%">
                <el-form inline>
                    <regionalism v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion' :community_Multi="true"></regionalism>
                    <el-form-item label-width="80px">
                        <el-select placeholder="请选择业态" :filterable="selectCheckingObject.opertaion.length > 7" class="selectItem" size="small" v-model="selectCheckingObject.param.StoreSecTypeId" clearable>
                            <el-option v-for="item in selectCheckingObject.opertaion" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="80px" style="display: none">
                        <el-tooltip content="自检次数" placement="top">
                            <el-input-number placeholder="自检次数" v-model="selectCheckingObject.param.SelfNumMore" size="small" controls-position="right" :min="0" :max="10000"></el-input-number>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label-width="80px" style="display: none">
                        <el-tooltip content="巡检次数" placement="top">
                            <el-input-number placeholder="巡检次数" v-model="selectCheckingObject.param.PatrolNumMore" size="small" controls-position="right" :min="0" :max="10000"></el-input-number>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="请输入单位名称" size="small" class="cardItemInput" v-model="selectCheckingObject.param.UnitName" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="selectCheckingObject.param.StoreStatus" placeholder="营业状态" clearable>
                            <el-option label="正常" :value="0"></el-option>
                            <el-option label="停业" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item inline>
                        <el-input placeholder="请输入许可证号" size="small" class="cardItemInput" v-model="selectCheckingObject.param.LicenseKey" clearable></el-input>
                        <el-button type="primary" style="margin-left: 10px" @click="queryStore(false)">查询</el-button>
                    </el-form-item>
                    <!--<el-form-item label-width="80px">-->
                    <!---->
                    <!--</el-form-item>-->

                </el-form>
                <el-table
                        ref="findStoreTable"
                        v-loading="selectCheckingObject.loading"
                        border
                        class="tableDeal"
                        height="200px"
                        style="width: 100%;margin-top: 10px"
                        :data="selectCheckingObject.queryStoreList"
                        @selection-change="selectStore"

                >
                    <el-table-column type="index" width="60" align="center"></el-table-column>
                    <el-table-column type="selection" reserve-selection width="55"></el-table-column>
                    <el-table-column :label="selectCheckingObject.addTable.CompanyName" min-width="80px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.StoreName}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column :label="selectCheckingObject.addTable.storeName" min-width="80px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.StoreName}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column :label="selectCheckingObject.addTable.licence" min-width="80px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.License}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="selectCheckingObject.addTable.TwoLevelFormat" min-width="80px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.StoreTypeSecond}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="selectCheckingObject.addTable.storeAddress" min-width="80px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.StoreAddress}}</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column :label="selectCheckingObject.addTable.selfCheckTimes" min-width="80px" show-overflow-tooltip>-->
                    <!--<template slot-scope="scope">-->
                    <!--<span>{{scope.row.InspectTimes}}</span>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column :label="selectCheckingObject.addTable.patrolTimes" min-width="80px" show-overflow-tooltip>-->
                    <!--<template slot-scope="scope">-->
                    <!--<span>{{scope.row.ComInspectTimes}}</span>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                </el-table>
                <pagination ref="pagination" v-show="selectCheckingObject.total"
                            :total="selectCheckingObject.total"
                            :page.sync="selectCheckingObject.param.PageNo"
                            :limit.sync="selectCheckingObject.param.PageSize"
                            @pagination="queryStore(false)">
                </pagination>
            </div>
            <span slot="footer" class="dialog-footer" v-show="!selectCheckingObject.loading">
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button type="primary" style="margin-left: 20px" @click="setStoreData(false)">确定</el-button>
                    <el-button type="primary" :loading="selectCheckingObject.loading" style="margin-left: 20px" @click="queryStore(true)">选择全部门店</el-button>
            </span>
        </el-dialog>
        <el-dialog
                v-if="selectCheckingObject_type.queryStoreDialog.show"
                class="findStoreClass"
                append-to-body
                :close-on-click-modal="false"
                title="查找门店"
                :visible.sync="selectCheckingObject_type.queryStoreDialog.show"
                top='10vh'
                width="720px"
                :before-close="closeTypeDialog"
                @opened="typeDialogShow"
        >
            <div class="maxDialog" style="width: 100%">
                <el-form>
                    <el-form-item>
                        <!--<el-switch-->
                        <!--inactive-text="启用"-->
                        <!--style="float: left"-->
                        <!--v-model="selectCheckingObject_type.opertateSwitch"-->
                        <!--active-color="#13ce66"-->
                        <!--inactive-color="#ff4949"-->
                        <!--@change="operateSwitchChange"-->
                        <!--&gt;-->
                        <!--</el-switch>-->
                        <el-transfer
                                style="text-align: left;display: inline-block;margin-left: 10px;"
                                v-model="selectCheckingObject_type.operateResult"
                                :titles="['业态', '已选']"
                                :props="{
                                  key: 'Id',
                                  label: 'Name'
                                }"
                                :data="selectCheckingObject_type.opertaion"
                        >
                            <!--<span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>-->
                        </el-transfer>

                    </el-form-item>
                    <el-form-item>
                        <!--<el-switch-->
                        <!--inactive-text="启用"-->
                        <!--style="float: left"-->
                        <!--v-model="selectCheckingObject_type.areaSwitch"-->
                        <!--active-color="#13ce66"-->
                        <!--inactive-color="#ff4949"-->
                        <!--@change="areaSwitchChange"-->
                        <!--&gt;-->
                        <!--</el-switch>-->
                        <!--<div style="text-align: left;display: inline-block">-->
                        <!--<tree-transfer style="text-align: left;display: inline-block;margin-left: 10px;width: 600px"-->
                        <!--:title="['区域', '已选']"-->
                        <!--:from_data='this.tree.treeDatas'-->
                        <!--:to_data='this.tree.toData'-->
                        <!--:defaultProps="{-->
                        <!--children: 'children',-->
                        <!--label: 'Name'-->
                        <!--}"-->
                        <!--:mode='tree.mode'-->
                        <!--node_key="Code"-->
                        <!--pid="ParentCode"-->
                        <!--openAll-->
                        <!--leafOnly-->
                        <!--v-model="this.tree.toData"-->
                        <!--@addBtn="areaTransferAdd"-->
                        <!--@removeBtn="areaTransferChange"-->
                        <!--&gt;-->
                        <!--</tree-transfer>-->
                        <!--</div>-->
                        <el-transfer
                                filterable
                                style="text-align: left;display: inline-block;margin-left: 10px;"
                                v-model="tree.toData"
                                :titles="['区域', '已选']"
                                :props="{
                                  key: 'OptionId',
                                  label: 'OptionName'
                                }"
                                :data="this.tree.treeDatas"
                        >
                        </el-transfer>
                    </el-form-item>
                    <el-form-item>
                        <!--<el-switch-->
                        <!--inactive-text="启用"-->
                        <!--style="float: left"-->
                        <!--v-model="selectCheckingObject_type.businessSwitch"-->
                        <!--active-color="#13ce66"-->
                        <!--inactive-color="#ff4949"-->
                        <!--@change="businessSwitchChange"-->
                        <!--&gt;-->
                        </el-switch>
                        <el-transfer
                                style="text-align: left;display: inline-block;margin-left: 10px;"
                                v-model="selectCheckingObject_type.businessResult"
                                :titles="['商圈', '已选']"
                                :props="{
                                  key: 'SelectValue',
                                  label: 'SelectName'
                                }"
                                :data="selectCheckingObject_type.businessData"
                        >
                            <!--<span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>-->
                        </el-transfer>

                    </el-form-item>
                    <el-form-item v-for="(itt,ittIndex) in selectCheckingObject_type.moreTaskTypes">
                        <!--<el-switch-->
                        <!--inactive-text="启用"-->
                        <!--v-model="itt.switch"-->
                        <!--active-color="#13ce66"-->
                        <!--inactive-color="#ff4949"-->
                        <!--@change="moreTypeSwitchChange(ittIndex)"-->
                        <!--&gt;-->
                        <!--</el-switch>-->
                        <el-select placeholder="请选择任务类型"
                                   class="com-width"
                                   style="margin-left: 10px"
                                   size="small"
                                   v-model="itt.typesCode"
								   :filterable="selectCheckingObject_type.moreTaskOptions.length > 7"
                                   @change="typesChange(ittIndex)"
                        >
                            <el-option
                                    v-for="(item,indexx) in selectCheckingObject_type.moreTaskOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                        <el-select
                                v-show="itt.typesCode=='code_restsize'"
                                placeholder="请选择餐厅规模"
                                class="com-width"
                                style="margin-left: 10px"
                                size="small"
                                clearable
								:filterable="selectCheckingObject_type.restSize.length > 7"
                                v-model="itt.result">
                            <el-option
                                    v-for="(it_em,it_emIndex) in selectCheckingObject_type.restSize"
                                    :key="it_em.RestaurSizeId"
                                    :label="it_em.RestaurSizeName"
                                    :value="it_em.RestaurSizeId">
                            </el-option>
                        </el-select>
                        <el-input v-show="itt.typesCode!='code_restsize'" style="margin-left: 10px"
                                  v-model="itt.result"
                                  clearable placeholder="请输入关键字过滤" class="com-width" size="small"></el-input>
                        <span class="addPic" v-if="ittIndex==0&&isShowButtonStore" @click="addMoreTaskType"></span>
                        <span class="delPic" v-if="ittIndex!=0&&isShowButtonStore" @click="delMoreTaskType(ittIndex)" style="margin-left: 10px"></span>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer" v-if="isShowButtonStore">
                    <el-button type="primary" style="margin-left: 20px" @click="saveParam">保存</el-button>
                    <el-button type="primary" :loading="selectCheckingObject_type.loading" style="margin-left: 20px" @click="getStoreFromServer">导入门店</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '../../components/Pagination';
    import Regionalism from '@/components/Regionalism.vue';
    // import treeTransfer from 'el-tree-transfer' // 引入
    const enumType = {
        oper: 1,
        area: 2,
        busi: 3,
        permit: 4,
        storeName: 5,
        comName: 6,
        restSize: 7,

        // 1：业态，2：区域，3：商圈，4：许可证号，5：门店名称，6：单位名称，7：餐厅规模
    };
    export default {
        name: "ChooseStore",

        data() {
            return {
                //检查对象 门店
                // regionalismResult:'',
                // initRegion:'',
                search: '',
                selectCheckingObject: {
                    queryStoreList: [],
                    stroeList: [],
                    total: 0,
                    loading: true,
                    param: {
                        AreaCodes: [],
                        StoreTypeId: '',//一级
                        UnitName: '',
                        StoreStatus:null,//营业状态
                        LicenseKey: '',
                        SelfNumMore: 0,
                        PatrolNumMore: 0,
                        PageNo: 1,
                        PageSize: 20,
                        StoreSecTypeId: '',
                        ProcessType: ''//巡查、自查
                    },
                    areaValue: null,
                    //显示门店列表弹框
                    checkObjDialogList: false,
                    //查询门店弹框
                    queryStoreDialog: {
                        show: false
                    },
                    //按店加入
                    addTable: {
                        CompanyName: "单位名称",
                        storeName: "门店名称",
                        licence: "许可证",
                        TwoLevelFormat: "业态",
                        storeAddress: "门店地址",
                        operate: "操作",
                        selfCheckTimes: "巡检次数",
                        patrolTimes: "自检次数",
                    },
                    //已选门店
                    selectedTable: {
                        companyName: "单位名称",
                        storeName: "门店名称",
                        licence: "许可证",
                        operateState: "经营状态",
                        storeAddress: "门店地址",
                        operate: "操作"
                    },

                    opertaion: [],
                    opertaionValue: '',
                    inspectionTimeValue: "",
                    totalNum: ""
                },
                selectCheckingObject_type: {
                    restSize: [],//餐厅规模
                    moreTaskOptions: [{name: '许可证号', code: 'code_permit'}, {name: '门店名称', code: 'code_storeName'},
                        {name: '单位名称', code: 'code_companyName'}, {name: '餐厅规模', code: 'code_restsize'}],
                    moreTaskTypes: [{
                        switch: false,
                        typesCode: 'code_permit',
                        result: ''
                    }],//任务类型
                    businessData: [],
                    businessResult: [],
                    businessSwitch: true,
                    opertateSwitch: true,
                    operateResult: [],
                    queryStoreList: [],
                    stroeList: [],
                    areaList: [],
                    areaSwitch: true,
                    areaResult: [],
                    total: 0,
                    loading: false,
                    moreTypes: [
                        {name: '许可证号', code: '0001'},
                        {name: '门店名称', code: '0002'},
                        {name: '单位名称', code: '0003'},
                        {name: '餐厅规模', code: '0004'},
                    ],
                    moreTypesCode: '',
                    param: {
                        AreaCodes: [],
                        StoreTypeId: '',//一级
                        UnitName: '',
                        LicenseKey: '',
                        SelfNumMore: 0,
                        PatrolNumMore: 0,
                        PageNo: 1,
                        PageSize: 20,
                        StoreSecTypeId: '',
                        ProcessType: ''//巡查、自查
                    },
                    areaValue: null,
                    //显示门店列表弹框
                    checkObjDialogList: false,
                    //查询门店弹框
                    queryStoreDialog: {
                        show: false
                    },
                    //按店加入
                    addTable: {
                        CompanyName: "单位名称",
                        storeName: "门店名称",
                        licence: "许可证",
                        TwoLevelFormat: "业态",
                        storeAddress: "门店地址",
                        operate: "操作",
                        selfCheckTimes: "巡检次数",
                        patrolTimes: "自检次数",
                    },
                    //已选门店
                    selectedTable: {
                        companyName: "单位名称",
                        storeName: "门店名称",
                        licence: "许可证",
                        operateState: "经营状态",
                        storeAddress: "门店地址",
                        operate: "操作"
                    },

                    opertaion: [],
                    inspectionTimeValue: "",
                    totalNum: ""
                },
                StoreData: [],
                StoreDataAll: [],
                pageTotal: 0,
                pageSize: 20,
                pageIndex: 0,
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
                        'hide': false,
                    },
                    businessDistrict: {
                        'disable': false,
                        'list': [],
                        'code': '',
                        'hide': false
                    }
                },
                tree: {//左边树数据结构
                    treeDatas: [],
                    tree_key: 0,
                    defaultExpand: [],
                    topNode: {//顶级节点
                        Code: '',
                        Name: ''
                    },
                    currentNode: '',
                    defaultProps: {
                        children: 'children',
                        label: 'Name'
                    },
                    toData: [],
                    mode: "transfer", // transfer addressList
                },
            }
        },
        props: {
            selectedStores: {
                type: Array,
                default: () => []
            },
            OperateId: {
                type: String,
                default: ''
            },
            isShowButtonStore: {
                type: Boolean,
                default: true
            },
            ProcessType: {
                type: Number,
                default: ''
            },
            //发布的规则
            rule: {
                type: Array,
                default: () => []
            },
            //是否需要回显规则
            needReShow:{
              type:Boolean,
              default:false
            },
            //任务发布人ID
            subUserId:{
                type:String,
                default:''
            }
        },
        computed: {
            tableData() {
                if (this.StoreData != null && this.StoreData.length > 0) {
                    // let arr = this.sliceArray(this.StoreData,this.pageSize);
                    // this.StoreData =arr[this.pageIndex-1];
                    const search = this.search;
                    try {
                        if (search) {
                            let arr = this.StoreData.filter(data => {
                                return Object.keys(data).some(key => {
                                    return String(data.StoreName).indexOf(search) > -1
                                })
                            });
                            this.pageTotal = arr.length;
                            return this.sliceArray(arr, this.pageSize)[this.pageIndex - 1];
                        }
                        // this.$utils.consoleObj(this.StoreData.length);
                        this.pageTotal = this.StoreData.length;
                        return this.sliceArray(this.StoreData, this.pageSize)[this.pageIndex - 1];
                    } catch (e) {
                        this.$utils.consoleObj(e);
                    }

                }

            }

        },
        methods: {
            sliceArray(array, size) {
                var result = [];
                for (var x = 0; x < Math.ceil(array.length / size); x++) {
                    var start = x * size;
                    var end = start + size;
                    result.push(array.slice(start, end));
                }
                return result;
            },
            del(inx) {
                this.StoreData.splice(inx, 1);
                this.pageTotal = this.StoreData.length;
            },
            batchDel() {
                let selectObj = this.$refs.haschooseGrid.store.states.selection;
                if (selectObj != null && selectObj.length > 0) {
                    for (let item of selectObj) {
                        for (let ite of this.StoreData) {
                            if (item.Id == ite.Id) {
                                this.StoreData.splice(this.StoreData.indexOf(ite), 1);
                            }
                        }
                    }
                    this.pageTotal = this.StoreData.length;
                } else {
                    this.message('请选择要移除的数据', 2)
                }

            },
            allDel() {
                this.StoreData = [];
                this.pageTotal = 0;
            },
            topTablePageNation() {
                this.$refs.haschooseGrid.bodyWrapper.scrollTop = 0;
            },
            //查询门店
            queryStore(all) {
                if (all) {
                    this.selectCheckingObject.param.PageSize = 100000;
                }
                this.selectCheckingObject.queryStoreList = [];//还原
                //this.selectCheckingObject.queryStoreDialog.show = true;
                this.selectCheckingObject.loading = true;
                this.$api.ChoseStore(this.selectCheckingObject.param).then(res => {
                    if (res && res.Content != null && res.Content.length > 0) {
                        this.selectCheckingObject.queryStoreList = res.Content;
                        this.selectCheckingObject.total = res.Data;
                    } else {
                        this.selectCheckingObject.queryStoreList = [];
                        this.selectCheckingObject.total = 0;
                    }
                    this.$refs.findStoreTable.bodyWrapper.scrollTop = 0;
                    this.selectCheckingObject.loading = false;
                    if (all) {
                        this.selectCheckingObject.queryStoreDialog.show = false;
                        this.selectStoreArr = res.Content;
                        this.setStoreData();
                    }
                }).catch(r => {
                    this.selectCheckingObject.loading = false;
                });
            },
            /**
             * 查找门店 确定
             */
            setStoreData() {
                if (this.selectStoreArr != null && this.selectStoreArr.length > 0) {
                    //去重
                    for (let it of this.selectStoreArr) {
                        let has = false;
                        for (let item of this.StoreData) {
                            if (item.Id == it.Id) {
                                has = true;
                                break;
                            }
                        }
                        if (!has) {
                            this.StoreData.push(it);
                        }
                    }
                    this.pageTotal = this.StoreData.length;
                    this.StoreDataAll = this.StoreData.concat(this.StoreDataAll);
                }
                this.closeDialog();
            },
            /**
             * check变化之后的门店
             */
            selectStore(selection) {
                this.selectStoreArr = selection;
            },
            //确定选择的门店
            storesResult(int) {
                if (int == -1) {
                    this.$emit('storesResult', null);

                } else {
                    this.$emit('storesResult', this.StoreData);
                    // this.$utils.consoleObj(this.StoreData);
                }

            },
            /**
             * 取消
             */
            closeDialog() {
                // this.selectCheckingObject.param = {
                //     AreaCodes: [],
                //     // StoreTypeId: '',
                //     UnitName: '',
                //     LicenseKey: '',
                //     SelfNumMore: 0,
                //     PatrolNumMore: 0,
                //     PageNo: 1,
                //     PageSize: 20
                // };
                //edited by xyt 2019 04 10 清除还原部分数据
                this.selectCheckingObject.queryStoreDialog.show = false;
                this.selectCheckingObject.param.UnitName = '';
                this.selectCheckingObject.param.StoreStatus = null;
                this.selectCheckingObject.param.StoreSecTypeId = '';
                this.selectCheckingObject.param.LicenseKey = '';
                this.selectCheckingObject.param.SelfNumMore = '';
                this.selectCheckingObject.param.PageNo = 1;
                this.selectCheckingObject.param.PageSize = 20;
                this.selectCheckingObject.total = 0;

            },
            closeTypeDialog() {
                this.selectCheckingObject_type.queryStoreDialog.show = false;
            },
            regionalismResult(obj) {
                let dataInfo = [
                    {
                        AreaType: 1,
                        AreaCode: obj.provience.code.substr(2, obj.provience.code.length)
                    },
                    {
                        AreaType: 2,
                        AreaCode: obj.city.code.substr(2, obj.provience.code.length)
                    }
                ];
                if (obj.town.code != '') {
                    let town = {
                        AreaType: 3,
                        AreaCode: obj.town.code.substr(2, obj.provience.code.length)
                    };
                    dataInfo.push(town);
                }
                if (obj.street.code != '') {
                    let street = {
                        AreaType: 4,
                        AreaCode: obj.street.code
                    };
                    dataInfo.push(street);
                }

                if (obj.community.code != '' && obj.community.code.length > 0) {
                    obj.community.code.forEach(element => {
                        let community = {
                            AreaType: 5,
                            AreaCode: element
                        };
                        dataInfo.push(community);
                    });


                }
                this.selectCheckingObject.param.AreaCodes = dataInfo;
            },
            initRegion(obj) {
                let dataInfo = [];
                if (obj.provience.code != '') {
                    let provience = {
                        AreaType: 1,
                        AreaCode: obj.provience.code.substr(2, obj.provience.code.length)
                    };
                    dataInfo.push(provience);
                }
                if (obj.city.code != '') {
                    let city = {
                        AreaType: 2,
                        AreaCode: obj.city.code.substr(2, obj.provience.code.length)
                    };
                    dataInfo.push(city);
                }
                if (obj.town.code != '') {
                    let town = {
                        AreaType: 3,
                        AreaCode: obj.town.code.substr(2, obj.provience.code.length)
                    };
                    dataInfo.push(town);
                }
                this.selectCheckingObject.param.AreaCodes = dataInfo;
                this.queryStore(false);
            },
            getOperateSubInfo() {
                if (this.OperateId.length == 0) {
                    return;
                }
                let data = {'OperateTypeId': this.OperateId};
                this.$api.GetOperateSubInfo(data).then(res => {
                    if (res) {
                        this.selectCheckingObject.opertaion = res;
                        this.selectCheckingObject_type.opertaion = res
                    }
                }).catch(r => {

                })
            },
            getCityCode() {
                this.$api.GetCityCode().then(res => {
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

                            }
                        }
                        this.getAreaInfoList();
                    }
                }).catch(r => {
                })
            },
            getAreaInfoList() {
                let currentUserId='';
                if(this.subUserId!=null&&this.subUserId!=undefined&&this.subUserId.length>0){
                    currentUserId = this.subUserId;
                }else{
                    currentUserId = this.$utils.getUrlKey('userId');
                }
                this.$api.GetAreaInfoList(1,currentUserId).then(res => {
                    if (res && res.IsSuccess) {
                        //对数据过滤  按默认省市区
                        this.tree.treeDatas = [];
                        this.tree.defaultExpand = [];
                        let locations = this.toTree(res.Content);
                        for (let iii of locations) {
                            if (this.area.town.code != null && this.area.town.code.length > 0 && this.area.town.disable) {//区级的应用
                                //找到省市、再找到区数据
                                if (iii.Code == this.area.provience.code) {
                                    for (let kkk of iii.children) {
                                        if (kkk.Code == this.area.city.code) {
                                            for (let jjj of  kkk.children) {
                                                if (jjj.Code == this.area.town.code) {
                                                    this.tree.treeDatas.push(jjj);
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                            } else if (this.area.city.code != null && this.area.city.code.length > 0 && this.area.city.disable) {//市级的应用
                                //找到省市、再找到区数据
                                if (iii.Code == this.area.provience.code) {
                                    for (let kkk of iii.children) {
                                        if (kkk.Code == this.area.city.code) {
                                            this.tree.treeDatas.push(kkk);
                                            break;
                                        }
                                    }
                                    break;
                                }
                            } else if (this.area.provience.code != null && this.area.provience.code.length > 0 && this.area.provience.disable) {
                                if (iii.Code == this.area.provience.code) {
                                    this.tree.treeDatas.push(iii);
                                    break;
                                }
                            }
                        }
                        if (this.tree.treeDatas.length > 0) {
                            this.tree.currentNode = {//当前显示（选中）节点
                                Code: this.tree.treeDatas[0].Code,
                                IsChecked: this.tree.treeDatas[0].IsChecked,
                                Level: this.tree.treeDatas[0].Level,
                                Name: this.tree.treeDatas[0].Name,
                                ParentCode: this.tree.treeDatas[0].ParentCode,
                            };
                        }
                        this.tree.treeDatas = this.tree2array(this.tree.treeDatas, []);
                        this.getRestSize();
                    }
                }).catch(r => {

                });
            },
            reShowData() {
                //获取业态回显
                try {
                    //优先使用服务器数据回显；
                    if (this.rule != null && this.rule.length > 0) {
                        for (let it of this.rule) {
                            if (it.Type == enumType.oper) {
                                let RuleOptionList = it.RuleOptionList;
                                if (RuleOptionList != null && RuleOptionList.length > 0) {
                                    this.selectCheckingObject_type.operateResult = [];
                                    for (let item of  RuleOptionList) {
                                        this.selectCheckingObject_type.operateResult.push(item.OptionId)
                                    }
                                }
                            } else if (it.Type == enumType.area) {
                                let RuleOptionList = it.RuleOptionList;
                                if (RuleOptionList != null && RuleOptionList.length > 0) {
                                    this.tree.toData = [];
                                    for (let item of  RuleOptionList) {
                                        this.tree.toData.push(item.OptionId)
                                    }
                                }
                            } else if (it.Type == enumType.busi) {
                                let RuleOptionList = it.RuleOptionList;
                                if (RuleOptionList != null && RuleOptionList.length > 0) {
                                    this.selectCheckingObject_type.businessResult = [];
                                    for (let item of  RuleOptionList) {
                                        this.selectCheckingObject_type.businessResult.push(item.OptionId)
                                    }
                                }
                            } else if (it.Type == enumType.permit) {
                                let RuleOptionList = it.RuleOptionList;
                                if (RuleOptionList != null && RuleOptionList.length > 0) {
                                    for (let item of  RuleOptionList) {
                                        this.selectCheckingObject_type.moreTaskTypes.push(
                                            {
                                                typesCode: 'code_permit',
                                                result: item.OptionName
                                            }
                                        )
                                    }
                                }
                            } else if (it.Type == enumType.storeName) {
                                let RuleOptionList = it.RuleOptionList;
                                if (RuleOptionList != null && RuleOptionList.length > 0) {
                                    for (let item of  RuleOptionList) {
                                        this.selectCheckingObject_type.moreTaskTypes.push(
                                            {
                                                typesCode: 'code_storeName',
                                                result: item.OptionName
                                            }
                                        )
                                    }
                                }
                            } else if (it.Type == enumType.comName) {
                                let RuleOptionList = it.RuleOptionList;
                                if (RuleOptionList != null && RuleOptionList.length > 0) {
                                    for (let item of  RuleOptionList) {
                                        for (let item of  RuleOptionList) {
                                            this.selectCheckingObject_type.moreTaskTypes.push(
                                                {
                                                    typesCode: 'code_companyName',
                                                    result: item.OptionName
                                                }
                                            )
                                        }
                                    }
                                }
                            } else if (it.Type == enumType.restSize) {
                                try {
                                    let RuleOptionList = it.RuleOptionList;
                                    if (RuleOptionList != null && RuleOptionList.length > 0) {
                                        for (let item of  RuleOptionList) {
                                            this.selectCheckingObject_type.moreTaskTypes.push(
                                                {
                                                    typesCode: 'code_restsize',
                                                    result: parseInt(item.OptionId)
                                                }
                                            )
                                        }
                                    }
                                } catch (e) {

                                }

                            }
                        }
                        if (this.selectCheckingObject_type.moreTaskTypes.length > 1) {
                            this.selectCheckingObject_type.moreTaskTypes.splice(0, 1);
                        }
                        // this.selectCheckingObject_type.opertaion = this.PatrolTaskRuleOptionInfoList.;
                        // this.selectCheckingObject_type.operateResult = param.operate.right;
                        // this.tree.treeDatas = param.areaZone.left;
                        // this.tree.toData = param.areaZone.right;
                        // this.selectCheckingObject_type.businessData = param.business.left;
                        // this.selectCheckingObject_type.businessResult = param.business.right;
                    } else {
                        let paramStr = localStorage.getItem('findStoreBytype' + this.$utils.getUrlKey('userId'));
                        let param = JSON.parse(paramStr);
                        if (param != null) {
                            // this.selectCheckingObject_type.opertaion = param.operate.left;
                            this.selectCheckingObject_type.operateResult = param.operate.right;
                            // this.tree.treeDatas = param.areaZone.left;
                            this.tree.toData = param.areaZone.right;
                            // this.selectCheckingObject_type.businessData = param.business.left;
                            this.selectCheckingObject_type.businessResult = param.business.right;
                            this.selectCheckingObject_type.moreTaskTypes = param.moreTaskTypes;
                            if (this.selectCheckingObject_type.moreTaskTypes == null || this.selectCheckingObject_type.moreTaskTypes.length == 0) {
                                this.selectCheckingObject_type.moreTaskTypes.push(
                                    {
                                        typesCode: 'code_permit',
                                        result: ''
                                    }
                                )
                            }
                        } else {
                            this.selectCheckingObject_type.operateResult = [];
                            this.tree.toData = [];
                            this.selectCheckingObject_type.businessResult = [];
                        }
                    }


                } catch (r) {
                    this.selectCheckingObject_type.operateResult = [];
                    this.tree.toData = [];
                    this.selectCheckingObject_type.businessResult = [];
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
            getRestSize() {

                this.$api.GetRestaurSizeList({}).then(res => {
                    if (res && res.IsSuccess) {
                        if (res.Content != null) {
                            this.selectCheckingObject_type.restSize = res.Content;
                        }
                        this.getBusinessData();
                    }
                }).catch(r => {

                })
            },
            getBusinessData() {
                // let areas = this.tree2array(this.tree.treeDatas,[]);
                let areas = this.tree.treeDatas;
                let level3Areas = [];
                if (areas != null && areas.length > 0) {
                    for (let item of areas) {
                        if (item.Level == "3") {
                            level3Areas.push(item.OptionId);
                        }
                    }
                }
                let data = {
                    areaCodeList: level3Areas
                };
                this.$api.GetBusinessAttrList(data).then(res => {
                    if (res && res.IsSuccess) {
                        if (res.Content != null && res.Content.length > 0) {
                            this.selectCheckingObject_type.businessData = res.Content;
                        }
                    }
                }).catch(r => {

                })
            },
            addMoreTaskType() {
                this.selectCheckingObject_type.moreTaskTypes.push({
                    typesCode: 'code_permit',
                    result: ''
                })
            },
            delMoreTaskType(index) {
                this.selectCheckingObject_type.moreTaskTypes.splice(index, 1);
            },
            typesChange(index) {
                // this.selectCheckingObject_type.moreTaskTypes[index].typesCode = this.selectCheckingObject_type.typesCode;
            },
            businessSwitchChange(val) {
                if (val) {
                    if (this.selectCheckingObject_type.businessResult.length == 0) {
                        this.message('请选择商圈数据', 2);
                        setTimeout(() => {
                            // val = false;
                            this.selectCheckingObject_type.businessSwitch = false;
                        }, 300)
                    }
                }
                // val = val&&this.selectCheckingObject_type.businessResult.length>0;
            },
            operateSwitchChange(val) {
                if (val) {
                    if (this.selectCheckingObject_type.operateResult.length == 0) {
                        this.message('请选择业态数据', 2);
                        setTimeout(() => {
                            // val = false;
                            this.selectCheckingObject_type.opertateSwitch = false;
                        }, 300)
                    }
                }
                // val = val&&this.selectCheckingObject_type.businessResult.length>0;
            },
            areaSwitchChange(val) {
                if (val) {
                    if (this.tree.toData.length == 0) {
                        this.message('请选择区域数据', 2);
                        setTimeout(() => {
                            // val = false;
                            this.selectCheckingObject_type.areaSwitch = false;
                        }, 300)
                    }
                }
                // val = val&&this.selectCheckingObject_type.businessResult.length>0;
            },
            // businessTransferChange(val) {
            //     if (val.length == 0) {
            //         this.selectCheckingObject_type.businessSwitch = false;
            //     }
            // },
            // operateTransferChange(val) {
            //     if (val.length == 0) {
            //         this.selectCheckingObject_type.opertateSwitch = false;
            //     }
            // },
            areaTransferChange(fromData, toData, obj) {
                this.tree.toData = toData;
                // if (toData.length == 0) {
                //     this.selectCheckingObject_type.areaSwitch = false;
                // }
            },
            areaTransferAdd(fromData, toData, obj) {
                this.tree.toData = toData;
            },
            moreTypeSwitchChange(index) {
                let obj = this.selectCheckingObject_type.moreTaskTypes[index];
                if (obj.switch) {
                    if (obj.result.length == 0) {
                        if (obj.typesCode == 'code_restsize') {
                            this.message('请选择餐厅规模', 2);
                        } else {
                            this.message('请输入过滤关键字', 2);
                        }
                        setTimeout(() => {
                            obj.switch = false;
                        }, 300)
                    }
                }
            },
            saveParam() {
                let oper_names = [];
                let area_names = [];
                let busi_names = [];
                for (let item of this.selectCheckingObject_type.operateResult) {
                    for (let kk of  this.selectCheckingObject_type.opertaion) {
                        if (item == kk.Id) {
                            oper_names.push(kk.Name);
                        }
                    }
                }
                for (let item of this.tree.toData) {
                    for (let kk of  this.tree.treeDatas) {
                        if (item == kk.OptionId) {
                            area_names.push(kk.OptionName);
                        }
                    }
                }
                for (let item of this.selectCheckingObject_type.businessResult) {
                    for (let kk of  this.selectCheckingObject_type.businessData) {
                        if (item == kk.SelectValue) {
                            busi_names.push(kk.SelectName);
                        }
                    }
                }
                let param = {

                    operate: {
                        left: this.selectCheckingObject_type.opertaion,
                        right: this.selectCheckingObject_type.operateResult,
                        names: oper_names
                        // swithch: this.selectCheckingObject_type.opertateSwitch
                    },
                    areaZone: {
                        left: this.tree.treeDatas,
                        right: this.tree.toData,
                        names: area_names
                        // swithch: this.selectCheckingObject_type.areaSwitch
                    },
                    business: {
                        left: this.selectCheckingObject_type.businessData,
                        right: this.selectCheckingObject_type.businessResult,
                        // swithch: this.selectCheckingObject_type.businessSwitch
                        names: busi_names
                    },
                    moreTaskTypes: this.selectCheckingObject_type.moreTaskTypes,
                    // Expire:3600*24,
                    // now:new Date().getTime()
                    restSize: this.selectCheckingObject_type.restSize
                };
                // this.$store.commit('findStoreBytype', param);
                localStorage.setItem('findStoreBytype' + this.$utils.getUrlKey('userId'), JSON.stringify(param));
                this.message('保存成功', 2);
                this.selectCheckingObject_type.queryStoreDialog.show = false;
                let serverParam = this.orgnizeServerParam();
                this.$emit('setRule', serverParam.PatrolTaskRuleOptionInfoList);
            },
            orgnizeServerParam(){
                let serverParam = {
                    PatrolTaskRuleOptionInfoList: [],
                };
                if (this.selectCheckingObject_type.opertateSwitch) {
                    let temp = [];
                    if (this.selectCheckingObject_type.operateResult.length > 0) {
                        for (let i of this.selectCheckingObject_type.operateResult) {
                            for (let kk of  this.selectCheckingObject_type.opertaion) {
                                if (i == kk.Id) {
                                    temp.push({
                                        OptionId: i,
                                        OptionName: kk.Name
                                    })
                                }
                            }

                        }
                    } else {
                        this.message('请选择业态', 2);
                        return;
                    }
                    serverParam.PatrolTaskRuleOptionInfoList.push({
                        Type: enumType.oper,
                        RuleOptionList: temp
                    })
                }
                if (this.selectCheckingObject_type.areaSwitch) {
                    // let areaResult = this.tree2array(this.tree.toData,[]);
                    let areaResult = this.tree.toData;
                    if (areaResult.length > 0) {
                        let temp = [];
                        for (let item of areaResult) {
                            for (let allItem of this.tree.treeDatas) {
                                if (allItem.OptionId == item) {
                                    temp.push({
                                        OptionId: item,
                                        OptionName: allItem.OptionName,
                                        Level: allItem.Level,
                                        ParentCode: allItem.ParentCode
                                    })
                                }

                            }

                        }
                        serverParam.PatrolTaskRuleOptionInfoList.push({
                            Type: enumType.area,
                            RuleOptionList: temp
                        })
                    } else {
                        this.message('请选择区域', 2);
                        return;
                    }

                }
                if (this.selectCheckingObject_type.businessSwitch) {
                    let temp = [];
                    if (this.selectCheckingObject_type.businessResult.length > 0) {
                        for (let item of this.selectCheckingObject_type.businessResult) {
                            for (let kk of  this.selectCheckingObject_type.businessData) {
                                if (item == kk.SelectValue) {
                                    temp.push({
                                        OptionId: item,
                                        OptionName: kk.SelectName
                                    })
                                }
                            }

                        }
                    }

                    serverParam.PatrolTaskRuleOptionInfoList.push({
                        Type: enumType.busi,
                        RuleOptionList: temp
                    })
                }
                let temp_code_permit = [];
                let temp_code_storeName = [];
                let temp_code_companyName = [];
                let temp_code_restsize = [];
                for (let it of this.selectCheckingObject_type.moreTaskTypes) {
                    if (it.typesCode == 'code_permit') {
                        temp_code_permit.push(it.result);
                    } else if (it.typesCode == 'code_storeName') {
                        temp_code_storeName.push(it.result);
                    }
                    else if (it.typesCode == 'code_companyName') {
                        temp_code_companyName.push(it.result);
                    }
                    else if (it.typesCode == 'code_restsize') {
                        temp_code_restsize.push(it.result);
                    }
                }
                if (temp_code_permit.length > 0) {
                    let temp = [];
                    if (temp_code_permit.length > 0) {
                        for (let item of temp_code_permit) {
                            if (item != null && item.length > 0) {
                                temp.push({
                                    OptionId: '',
                                    OptionName: item
                                })
                            }
                        }
                    }
                    serverParam.PatrolTaskRuleOptionInfoList.push({
                        Type: enumType.permit,
                        RuleOptionList: temp
                    });
                }
                if (temp_code_storeName.length > 0) {
                    let temp = [];
                    if (temp_code_storeName.length > 0) {
                        for (let item of temp_code_storeName) {
                            if (item != null && item.length > 0) {
                                temp.push({
                                    OptionId: '',
                                    OptionName: item
                                })
                            }
                        }
                    }
                    serverParam.PatrolTaskRuleOptionInfoList.push({
                        Type: enumType.storeName,
                        RuleOptionList: temp
                    });
                }
                if (temp_code_companyName.length > 0) {
                    let temp = [];
                    if (temp_code_companyName.length > 0) {
                        for (let item of temp_code_companyName) {
                            if (item != null && item.length > 0) {
                                temp.push({
                                    OptionId: '',
                                    OptionName: item
                                })
                            }
                        }
                    }
                    serverParam.PatrolTaskRuleOptionInfoList.push({
                        Type: enumType.comName,
                        RuleOptionList: temp
                    });
                }
                if (temp_code_restsize.length > 0) {
                    let tempArr = [];
                    if (temp_code_restsize.length > 0) {
                        for (let item_ of temp_code_restsize) {
                            for (let kk of this.selectCheckingObject_type.restSize) {
                                if (item_ != null && item_ > 0) {
                                    if (item_ == kk.RestaurSizeId) {
                                        tempArr.push({
                                            OptionId: item_,
                                            OptionName: kk.RestaurSizeName
                                        })
                                    }

                                }
                            }

                        }
                    }
                    serverParam.PatrolTaskRuleOptionInfoList.push({
                        Type: enumType.restSize,
                        RuleOptionList: tempArr
                    })
                }
                return serverParam;
            },
            getStoreFromServer() {
                // let enumType ={
                //     oper: 1,
                //     area: 2,
                //     busi: 3,
                //     permit: 4,
                //     storeName: 5,
                //     comName: 6,
                //     restSize: 7,
                //
                //     // 1：业态，2：区域，3：商圈，4：许可证号，5：门店名称，6：单位名称，7：餐厅规模
                // };
                let serverParam = this.orgnizeServerParam();
                if(serverParam == null ||serverParam ==undefined){
                    return;
                }
                this.$utils.consoleObj(serverParam);
                this.selectCheckingObject_type.loading = true;
                this.$api.GetRuleStoreList(serverParam).then(res => {
                    this.selectCheckingObject_type.loading = false;
                    if (res && res.Content != null && res.Content.length > 0) {
                        this.selectStoreArr = res.Content;
                    } else {
                        this.selectStoreArr = [];
                        this.message('未查询到满足条件的门店', 2);
                    }
                    this.setStoreData();
                    this.selectCheckingObject_type.queryStoreDialog.show = false;
                    this.$emit('setRule', serverParam.PatrolTaskRuleOptionInfoList);
                }).catch(r => {
                    this.selectCheckingObject_type.loading = false;
                    this.message('查询出错', -1);
                })
            },
            typeDialogShow() {
                //还原、清空
                this.selectCheckingObject_type.operateResult = [];
                this.selectCheckingObject_type.areaResult = [];
                this.selectCheckingObject_type.businessResult = [];
                this.selectCheckingObject_type.moreTaskTypes = [];
                this.selectCheckingObject_type.moreTaskTypes.push({
                    typesCode: 'code_permit',
                    result: ''
                });
                this.reShowData();
            },
            tree2array(data, arr) {
                if (data != null && data.length > 0) {
                    for (let item of data) {
                        if (Array.isArray(item)) {
                            for(let ii  of item ){
                                if (ii.IsChecked) {
                                    arr.push({
                                        OptionId: ii.Code,
                                        OptionName: ii.Name,
                                        Level: ii.Level,
                                        ParentCode: ii.ParentCode
                                    });
                                }
                                if (ii.children != null && ii.children.length > 0) {
                                    this.tree2array(ii.children, arr);
                                }
                            }

                        } else {
                            if (item.IsChecked) {
                                arr.push({
                                    OptionId: item.Code,
                                    OptionName: item.Name,
                                    Level: item.Level,
                                    ParentCode: item.ParentCode
                                });
                            }
                            if (item.children != null && item.children.length > 0) {
                                this.tree2array(item.children, arr);
                            }
                        }


                    }
                }
                return arr;
            },
            openFindStoreByType() {
                this.selectCheckingObject_type.queryStoreDialog.show = true;
                if (this.isShowButtonStore) {
                    // this.rule = null;
                }
            }

        },
        beforeCreated() {

        },
        created() {
            if (this.selectedStores != null && this.selectedStores.length > 0) {
                for (let item of this.selectedStores) {
                    this.StoreData.push(item);
                }
            }
            this.selectCheckingObject.param.StoreTypeId = this.OperateId;
            this.selectCheckingObject.param.ProcessType = this.ProcessType;
            this.getOperateSubInfo();
            this.getCityCode();

        },
        mounted() {

        },
        updated() {

        },

        // watch: {
        //     'selectCheckingObject.queryStoreList': {
        //         handler(newName, oldName) {
        //             this.$nextTick(() => {
        //                 //回显数据
        //                 for (let item of this.selectCheckingObject.queryStoreList) {
        //                     for (let hasChooseItem  of  this.StoreData) {
        //                         if (hasChooseItem.Id == item.Id) {
        //                             this.$refs.findStoreTable.toggleRowSelection(item, true);
        //                         }
        //                     }
        //                 }
        //             })
        //         },
        //         immediate: true
        //     }
        // },
        components: {
            Pagination,
            Regionalism,
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .maxDialog {
        width: 100%;
        @include box(box);
        @include box-orient(vertical);
    }

    .mast {
        color: #F56C6C;
    }

    // .tableDeal {
    //     height: calc(80vh - 356px);
    //     overflow-y: auto;
    // }

    // .calcTableH {
    //     height: calc(80vh - 236px);
    //     overflow-y: auto;
    // }
    .addPic {
        width: 25px;
        height: 25px;
        background: url("../../assets/images/add_icon.png");
        background-repeat: no-repeat;
        background-size: contain;
        display: inline-block;
        margin-left: 10px;
        vertical-align: middle;
    }

    .delPic {
        width: 25px;
        height: 25px;
        background: url("../../assets/images/delete_icon.png");
        background-repeat: no-repeat;
        background-size: contain;
        display: inline-block;
        margin-left: 10px;
        vertical-align: middle;
    }
</style>

<style type="text/scss" lang="scss">
    .findStoreClass {
        .cardLabel {
            font-size: 14px;
            color: #606266;
            line-height: 40px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            width: 82px;
            display: inline-block;
        }

        .cardTitle {
            font-size: 16px;
        }

        .selectItem {
            width: 170px;
            /*height: 32px;*/
            /*padding-right: 10px;*/
        }

        .cardItem {
            margin-bottom: 10px;
        }
        .cardItemInput {
            width: 170px;

        }
        .el-button--primary.is-disabled,
        .el-button--primary.is-disabled:active,
        .el-button--primary.is-disabled:focus,
        .el-button--primary.is-disabled:hover {
            color: #fff !important;
            background-color: #a0cfff !important;
            border-color: #a0cfff !important;
            border-radius: 50% !important;
            padding: 12px !important;
        }
        .el-transfer__button {
            border-radius: 50% !important;
            padding: 12px !important;
        }
        .el-transfer-panel, .transfer-left, .transfer-right {
            width: 250px !important;
        }
        .transfer-center {
            width: 100px !important;
            left: 250px !important;
        }
    }
</style>
