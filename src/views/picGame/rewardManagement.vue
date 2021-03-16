<template>
    <div class="main-container rewardManage">
        <div>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                  <div style="display: flex;">
                    <el-form-item class="com-width" style="margin-right:0">
                      <el-date-picker
                              class="com-width"
                              type="date"
                              placeholder="请选择开始时间"
                              :picker-options="pickerOptions0"
                              v-model="mainGridTable.param.StartTime"
                              value-format="yyyy-MM-dd"
                              style="width: 185px;">
                      </el-date-picker>
                    </el-form-item>
                    <span style="margin:0 10px;">-</span>
                    <el-form-item class="com-width">
                      <el-date-picker
                              class="com-width"
                              type="date"
                              placeholder="请选择结束时间"
                              :picker-options="pickerOptions1"
                              v-model="mainGridTable.param.EndTime"
                              value-format="yyyy-MM-dd"
                              style="width: 185px;">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="gueryList">搜 索</el-button>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button type="primary" @click="rewardSet">奖励配置</el-button>
                    <!-- <el-button type="primary" @click="rankBtn">排行榜</el-button>         -->
                </el-form-item>
            </el-form>
        </div>
        <div class="table-box">
        <el-table
                v-loading="mainGridTable.Loading"
                :data="mainGridTable.list"
                border
                fit
                height="96%"
                highlight-current-row
                class="table">
            <el-table-column 
                label="序号" 
                type="index" 
                width="60" 
                align="center">
            </el-table-column>
            <el-table-column 
                label="今日投入金额" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TheLimits}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="今日剩余金额" 
               width="120px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.BalanceAmount}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="今日单张价格" 
                width="120px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.PrizeSingleAmount}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="今日奖金池" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.PrizePoolAmount }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="今日总找茬图片" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TodayNum }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="今日平均找茬图片" 
                min-width="120px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.AvgNum }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="今日第一名" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TopUserAccount }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="第一名找茬图片" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TopFindNum }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                label="时间" 
                min-width="100px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.SubDate }}</span>
                </template>
            </el-table-column>
            <el-table-column  
                label="排行榜" 
                min-width="140px" 
                show-overflow-tooltip>
                <template slot-scope="scope">
                    
                    <el-button type="primary" plain @click="rankBtn(scope.row)">今日排行榜</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <pagination 
                ref="pagination" 
                v-show="mainGridTable.total>0"
                :total="mainGridTable.total"
                :page.sync="mainGridTable.param.PageNo"
                :limit.sync="mainGridTable.param.PageSize"
                @pagination="gueryList"></pagination>
        <!--奖励配置-->
        <el-dialog
                :close-on-click-modal='false'
                :title="rewardConfig.title"
                :visible.sync="rewardConfig.show"
                class='rewardConfig'
                fullscreen
                top="5vh"
                style="margin:60px auto;"
                v-if="rewardConfig.show"
                >
            <div style="width:100%">
                <el-form :model="rewardForm" :rules="rewardRule" ref="rewardForm" label-width="120px">
                    <el-form-item label='奖励类型' prop="money">
                        <el-checkbox v-model="rewardForm.money">钱包</el-checkbox>
                    </el-form-item>
                    <el-form-item label='奖励系数' prop="todayInvest">
                       <div>今日投入
                           <el-input 
                                clearable
                                v-model="rewardForm.todayInvest"
                                style="width:120px;display:inline-block;margin:0 10px"></el-input>
                           元
                           </div>
                    </el-form-item>
                    <el-form-item prop="singlePrice">
                       <div>个人单价
                           <el-input 
                                clearable
                                v-model="rewardForm.singlePrice"
                                style="width:120px;display:inline-block;margin:0 10px"></el-input>
                           元</div>
                    </el-form-item>
                    <el-form-item prop="priceRange">
                       <div>单张价格不能超过
                           <el-input 
                                clearable
                                v-model="rewardForm.priceRange"
                                style="width:120px;display:inline-block;margin:0 10px"></el-input>
                           元,若超出,取该金额</div> 
                           
                    </el-form-item>
                    <el-form-item class="defaultPrice">
                        <p>今日测算单张价格&nbsp;<span>{{this.rewardForm.PrizeSingleAmountForecast}}</span></p>
                    </el-form-item>
                    <el-form-item label="游戏开启时间" required>
                        <el-form-item  prop="startTime" class="startTime">
                            <el-time-picker 

                                v-model="rewardForm.startTime"  
                                format="HH:mm" 
                                value-format="HH:mm" 
                                clearable
                                
                                style="width: 160px;display:inline-block;"
                                
                                :picker-options="{selectableRange: '02:00:00 - 21:59:59'}"
                                placeholder='请输入开始时间'>
                                <!-- :picker-options="{selectableRange:`00:00:00-${rewardForm.endTime ? rewardForm.endTime + ':00' : '21:59:59'}`}" -->
                            </el-time-picker>
                        </el-form-item>
                        <span style="display:inline-block;margin:0 5px;">-</span>
                        <el-form-item prop="endTime" class="endTime">
                            <el-time-picker 

                                v-model="rewardForm.endTime"  
                                format="HH:mm" 
                                value-format="HH:mm" 
                                clearable 
                                
                                :picker-options="{selectableRange:`${rewardForm.startTime ? rewardForm.startTime + ':00' : '02:00:00'}-22:00:00`}"
                                style="width: 160px;display:inline-block;"
                                placeholder='请输入结束时间'>

                            </el-time-picker>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item class="btn-box">
                        <div>
                            <el-button @click="rewardConfig.show = false">取 消</el-button>
                            <el-button type="primary"  @click='submitForm("rewardForm")'> 确 定</el-button>
                        </div>
                    </el-form-item>
                </el-form>
                
            </div>
        </el-dialog>
        <!-- 排行榜 -->
        <el-dialog
                :close-on-click-modal='false'
                :title="rankDia.title"
                :visible.sync="rankDia.show"
                class='rankDialog'
                fullscreen
                
                style="width:70%;margin:50px auto;"
                v-if="rankDia.show"
                >
                <div style="height:100%">
                    <ranking-list :rankObj='rankDia.rankObj'></ranking-list>
                    <div style="bottom:20px;text-align:center;">
                        <el-button @click="rankDia.show = false">取 消</el-button>
                        <el-button type="primary" @click="rankDia.show = false">确 定</el-button>
                    </div>
                </div>
            
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination';
    import picConfig from './picConfig';
    import rankingList from './rankingList';
    export default {
        components: {
            Pagination,
            picConfig,
            rankingList
        },
        data() {
            let moneyLimit  = (rule, value, callback) => {
                if (!this.rewardForm.money) {
                    return callback('请选择奖励类型')
                }else {
                    callback()
                }
            };
            let todayInvestLimit = (rule, value, callback) => {

                let regNumber = /^10000$|^([1-9][0-9]{0,3})(\.\d{0,3})?$|^0(\.[0-9]{0,3}?$)/
                if (this.rewardForm.todayInvest === '' || this.rewardForm.todayInvest === null) {
                    return callback('请输入今日投入')
                } else if (!regNumber.test(this.rewardForm.todayInvest)) {
                    this.rewardForm.todayInvest = '';
                    return callback('请输入大于0小于等于10000保留三位小数的数')
                } else {
                    callback()
                }
            };
            let singlePriceLimit = (rule, value, callback) => {     
                
                let number = /^10000$|^([1-9][0-9]{0,3})(\.\d{0,3})?$|^0(\.[0-9]{0,3}?$)/
                if (this.rewardForm.singlePrice === '' || this.rewardForm.singlePrice === null) {
                    return callback('请输入个人单价')
                } else if (!number.test(this.rewardForm.singlePrice)) {
                    this.rewardForm.singlePrice = '';
                    return callback('请输入大于0小于等于10000保留三位小数的数')
                }  else {
                    callback()
                }
            };
            let priceRangeLimit = (rule, value, callback) => {
                let number = /^10000$|^([1-9][0-9]{0,3})(\.\d{0,3})?$|^0(\.[0-9]{0,3}?$)/
                if (this.rewardForm.priceRange === '' || this.rewardForm.priceRange === null) {
                    return callback('请输入单张价格')
                } else if (!number.test(this.rewardForm.priceRange)) {
                    this.rewardForm.priceRange = '';
                    return callback('请输入大于0小于等于10000保留三位小数的数')
                } else {
                    callback()
                }
            };
            return {
                pickerOptions0: {
                     disabledDate: time => {
                            if (this.mainGridTable.param.EndTime) {
                                return time.getTime() > new Date(this.mainGridTable.param.EndTime).getTime()
                            }else{
                                 return time.getTime() > Date.now();
                            }
                    }
                }, 
                pickerOptions1: {
                    disabledDate: time => {
                            if (this.mainGridTable.param.StartTime) {
                                    return time.getTime() < new Date(this.mainGridTable.param.StartTime).getTime() - 86400000
                            }else{
                                 return time.getTime() > Date.now();
                            }
                    }
                },
                mainGridTable: { //主列表
                    Loading: true,
                    list: null,
                    total: 0,
                    param: {
                        StartTime:'',
                        EndTime:'',
                        PageNo: 1,
                        PageSize: 20
                    },
                },
                rewardConfig:{
                    show:false,
                    title:''
                },
                form:{
                    
                },
                rewardRule:{
                    money: [
                        {required: true, validator: moneyLimit, trigger: 'change'}
                    ],
                    todayInvest: [
                        {required: true, validator: todayInvestLimit, trigger: 'blur' }
                    ],
                    singlePrice: [
                        {required: true, validator: singlePriceLimit, trigger: 'blur' }
                    ],
                    priceRange: [
                        {required: true, validator: priceRangeLimit, trigger: 'blur' }
                    ],
                    startTime: [
                        { required: true, message: '请选择开始时间', trigger: 'blur' }
                    ],
                    endTime: [
                        { required: true, message: '请选择结束时间', trigger: 'blur' }
                    ],
                },
                rewardForm:{
                    money:true,//1钱包
                    todayInvest:'1500',//限额
                    singlePrice:'0.005',//个人单价（每找一张个人所得金额）
                    priceRange:'0.5',//单张价格限额（每找一张存入奖金池金额）
                    startTime:'02：00',
                    endTime:'22：00',
                    PrizeSingleAmountForecast:'',//单张价格预测（每找一张存入奖金池金额）
                },
                rankDia:{
                    show:false,
                    title:'今日排行榜',
                    rankObj:{}
                },
                
                
                
            }
        },
        created() {
            this.gueryList();
        },
        methods: {
            getImagePushRewardSet(){
                this.$api.GetImagePushRewardSet({}).then(res => {
                    if (res.IsSuccess) {
                        this.rewardForm.money = res.Content.RewardType == 1?true:false;
                        this.rewardForm.todayInvest = res.Content.TheLimits;
                        this.rewardForm.singlePrice = res.Content.PersonalSingleAmount;
                        this.rewardForm.priceRange = res.Content.PrizeSingleAmountLimit;
                        this.rewardForm.startTime = res.Content.StartTime;
                        this.rewardForm.endTime = res.Content.EndTime;
                        this.rewardForm.PrizeSingleAmountForecast = res.Content.PrizeSingleAmountForecast
                    }
                }).catch(error =>{
                    
                })
            },
            /**
             * 查询数据
             */
            gueryList() {
                if(this.mainGridTable.param.StartTime == null){
                    this.mainGridTable.param.StartTime = '';
                }
                if(this.mainGridTable.param.EndTime == null){
                    this.mainGridTable.param.EndTime = '';
                }
                this.$api.GetImageRewardManagePageList(this.mainGridTable.param).then(res => {
                    if (res.IsSuccess) {
                        this.mainGridTable.Loading = false;
                        if(res.Content == null){
                            this.$message({
                                message: '无查询数据',
                                type: 'info',
                                center:true,
                                duration: 1200,
                            });
                            this.mainGridTable.list = [];
                            return;
                        }
                        if(res.Content && res.Content.length){
                            for(let item of res.Content){
                                if(item.SubDate!=null && item.SubDate!=''){
                                    item.SubDate = item.SubDate.split(' ')[0]
                                }
                                
                            }
                        }
                        this.mainGridTable.list = res.Content;
                        this.mainGridTable.total = res.Data;

                    } else {
                        this.$message({
                            message: res.Message,
                            type: 'info',
                            duration: 1200,
                        });
                        this.mainGridTable.Loading = false;
                    }
                }).catch(r=>{
                    this.mainGridTable.Loading = false;
                });
            },
            rewardSet() {
                this.rewardConfig.title = '奖励设置';
                this.rewardConfig.show = true;
                this.getImagePushRewardSet();
            },
            submitForm(formName) {debugger;
                this.$refs[formName].validate((valid) => {
                    if (valid) {debugger;
                        let price = '';
                        // if(this.rewardForm.priceRange >= this.rewardForm.PrizeSingleAmountForecast && this.rewardForm.PrizeSingleAmountForecast>0){
                        //     price = this.rewardForm.PrizeSingleAmountForecast;
                        // }else{
                        //     price = this.rewardForm.priceRange;
                        // }
                        let data = {
                            "RewardType": this.rewardForm.money?1:0,
                            "TheLimits": Number(this.rewardForm.todayInvest),
                            "PersonalSingleAmount": Number(this.rewardForm.singlePrice),
                            "PrizeSingleAmountLimit": Number(this.rewardForm.priceRange),
                            "StartTime": this.rewardForm.startTime,
                            "EndTime": this.rewardForm.endTime,
                            "SubId":this.$utils.getUrlKey("userId")
                        }
                        this.$api.SaveImagePushRewardSet(data).then(res =>{
                            if(res.IsSuccess){
                               
                               this.message(res.Message == null?'设置成功':res.Message,1);
                               this.rewardConfig.show = false;
                               this.mainGridTable.param.StartTime = '';
                               this.mainGridTable.param.EndTime = '';
                               this.gueryList();
                               
                            }else{
                                if(res.Message!='' && res.Message!=null){
                                   this.message(res.Message,-1);
                                   return
                               }
                            }
                        }).catch(error =>{

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            rankBtn(obj) {
                this.rankDia.show = true;
                this.rankDia.rankObj = obj;
            }
        }
    }
</script>
<style scoped type="text/scss" lang='scss'>

    // .main-container {
    //     padding-top: 14px;
    //     width: 100%;
    //     height: 100%;
    //     @include box(box);
    //     @include box-orient(vertical);
    //     .el-middle {

    //         padding-bottom: 10px;
    //     }

    // }
    .main-container,.rewardManage{
        width: 100%;
        height: 100%;
        font-size: 16px;
        flex-direction: column;
        padding-left: 10px;
        display: flex;
    }
    .table-box {
        flex:1;
    }
    .el-table--border {
        overflow-y: auto;
    }
    .table-box {
        flex:1;
    }
    .rewardManage{
        width:100%;
        height:100%
    }
    .rewardConfig{
        margin:0 auto;
        width:50%;
    }
    
</style>

<style type="text/scss" lang="scss">
 
    .rewardManage .addConfig .el-dialog .el-dialog__body {
        height:calc(100% - 50px);
        overflow: auto !important;
    }
    
    .rewardManage{
        .el-dialog__body{
            height: 100%；
        }
        .el-table__header-wrapper {
            overflow: hidden;
        }
        .el-table__body-wrapper {
            overflow-y: auto !important;
        }
        .el-form-item__label{
            text-align:center;
        }
    }
    .startTime{
        width:160px;
        display: inline-block;
    }
    .endTime{
        width:160px;
        display: inline-block;
    }
    .defaultPrice {

        .el-form-item__content{
            line-height:20px;
        }
    }
    .btn-box{
        .el-form-item__content{
            margin-left:0 !important;
            div{
                text-align:center;
                margin-top:40px;
            }
        }
        //text-align: center;
        //position: fixed;
        //margin-bottom: 35px;
        //width: calc(100% - 60px);
    }
    .rankDialog {
        .el-dialog__body{
            height: calc(100% - 100px);
        }
    }
</style>

