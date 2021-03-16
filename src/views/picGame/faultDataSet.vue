<template>
  <div class="faultDataSet">
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="详情页公示设置" name="DetailsSet">
            <el-form :model="DetailsSet" ref="DetailsSet" :rules="rules">
                <div class="set-title">数据范围设置</div>
                <div class="det-con">
                    <el-checkbox 
                    class="input-set"
                    v-model="DetailsSet.StateRange"
                    v-for="(item,index) in DetailsSet.DetailsCheck1" 
                    :label="item.code" 
                    :key="index">{{item.name}}</el-checkbox>
                    <el-checkbox class="input-set" :indeterminate="DetailsSet.isIndeterminate" v-model="DetailsSet.checkAll" @change="handleCheckAllChange">已处理</el-checkbox>
                     <el-checkbox-group v-model="DetailsSet.StateRange" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="item in DetailsSet.DetailsCheck2" :label="item.code" :key="item.code">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="set-title">数据时间设置</div>
                <div class="det-con">
                    <el-form-item prop="DateRange">
                        <el-input v-model.number="DetailsSet.DateRange" style="width:165px"></el-input>
                    </el-form-item>
                    <span>天内</span>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('DetailsSet')">保存</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="找茬纠错设置" name="errorCorSet">
            <el-form :model="errorCorSet" ref="errorCorSet" :rules="rules">
                <div class="det-con">
                    <div class="det-con-li">
                        <span>申诉超时时间</span>
                        <el-form-item prop="ComplaintTimeout">
                            <el-input v-model.number="errorCorSet.ComplaintTimeout"></el-input>
                        </el-form-item>
                        <span>天内</span>
                    </div>
                    <div class="det-con-li">
                        <span>找出问题容错率</span>
                        <el-form-item prop="ErrorTolerantRate">
                            <el-input v-model.number="errorCorSet.ErrorTolerantRate"></el-input>
                        </el-form-item>
                        <span>%</span>
                    </div>
                    <div class="det-con-li">
                        <span>是否要冻结找茬当日奖金</span>
                        <el-form-item prop="IsFrozen">
                            <el-checkbox v-model="errorCorSet.IsFrozen"></el-checkbox>
                        </el-form-item>
                    </div>
                    <div class="det-con-li">
                        <span>冻结周期</span>
                        <el-form-item prop="FrozenDay">
                            <el-input v-model.number="errorCorSet.FrozenDay"></el-input>
                        </el-form-item>
                        <span>天</span>
                    </div>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('errorCorSet')">保存</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    data() {
    var checkDataTime = (rule, value, callback) => {
        if (!value || !Number.isInteger(value) || value < 1 || value > 30) {
            return callback(new Error('请输入大于0且小于30的正整数'));
        }else {
            callback();
        }
    };
    var checkNum = (rule, value, callback) => {
        if (!value || !Number.isInteger(value) || value < 1) {
            return callback(new Error('请输入大于0的正整数'));
        }else{
            callback();
        }
        // setTimeout(() => {
        //     if (!Number.isInteger(value)) {
        //        callback(new Error('请输入大于0且小于30的正整数'));
        //     } else {
        //     if (value < 1 || value > 30) {
        //         callback(new Error('请输入大于0且小于30的正整数'));
        //     } else {
                
        //     }
        //     }
        // }, 1000);
    };
      return {
        activeName: 'DetailsSet',
        DetailsSet: {
           id:'',
           checkAll: false,
           isIndeterminate: false,
           StateRange:[],
           DateRange:'',
           DetailsCheck1:[
            {
                code:'1000',
                name:'待处理'
            },
            {
                code:'2000',
                name:'处理中'
            }],
           DetailsCheck2:[
            {
                code:'3010',
                name:'已认可'
            },
            {
                code:'3030',
                name:'已驳回'
            }]
        },
        errorCorSet: {
           Id:'',
           ComplaintTimeout:0,
           ErrorTolerantRate:'',
           IsFrozen:true,
           FrozenDay:0
        },
        rules: {
          DateRange: [
            { validator: checkDataTime, trigger: 'blur' }
          ],
          ComplaintTimeout: [
            { validator: checkNum, trigger: 'blur' }
          ],
          FrozenDay: [
            { validator: checkNum, trigger: 'blur' }
          ],
          ErrorTolerantRate:[
            { type: 'number', message: '请输入数字', trigger:'blur' }
          ],
        }
        
       
      };
    },
    created(){
        //详情公示
        this.$api.GetImagePushStoreDetailsSet('').then(res => {
            if(res.Code==='1'){
                this.DetailsSet.DateRange=res.Content.DateRange
                let StateRange=res.Content.StateRange.split(',')
                if(StateRange.indexOf('3010')!=-1 && StateRange.indexOf('3030')!=-1){
                    this.DetailsSet.checkAll=true
                }
                this.DetailsSet.StateRange=StateRange
                this.DetailsSet.id=res.Content.Id
            }
            console.log(this.DetailsSet) 
        })
        //找茬纠错
        this.$api.GetImagePushRecoverySet('').then(res => {
            if(res.Code==='1'){
                let data=res.Content
                let errorCorSet=this.errorCorSet
                errorCorSet.Id=data.Id,
                errorCorSet.ComplaintTimeout=data.ComplaintTimeout,
                errorCorSet.ErrorTolerantRate=res.Content.ErrorTolerantRate,
                errorCorSet.IsFrozen=res.Content.IsFrozen,
                errorCorSet.FrozenDay=res.Content.FrozenDay
            }
            console.log(this.errorCorSet) 
        })
        
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //详情公示保存
                    if(formName=='DetailsSet'){
                        let StateRange=this.DetailsSet.StateRange
                        let datas={
                            "Id": this.DetailsSet.id,
                            "StateRange": StateRange.join(),
                            "DateRange": this.DetailsSet.DateRange
                            }
                        this.$api.SaveImagePushStoreDetailsSet(datas).then(res => {
                            if(res.Code==='1'){
                            this.$message.success(res.Message)
                            }else{
                                this.$message.error(res.Message)
                            }
                        })
                    }else{
                        //找茬纠错保存
                        let datas=this.errorCorSet
                        this.$api.SaveImagePushRecoverySet(datas).then(res => {
                            if(res.Code==='1'){
                                this.$message.success(res.Message)
                            }else{
                                this.$message.error(res.Message)
                            }
                        })
                    }
                    
                } else {
                    return false;
                }
            });
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        changeHandle(val){
           let data = this.DetailsSet.StateRange
           if(val.code!='2000' && val.code!='1000'){
                if(val.code=='3000'){
                    if(data.indexOf('3000')==-1){
                        data.splice(data.indexOf('3010'), 1);
                        data.splice(data.indexOf('3030'), 1);
                    }else{
                        data.push('3010','3030')
                    }
                }else{
                    if(data.indexOf('3010')==-1 && data.indexOf('3030')==-1){
                        data.splice(data.indexOf('3000'), 1);
                    }else if(data.indexOf('3000')==-1 && data.indexOf('3010')>-1 && data.indexOf('3030')>-1){
                        data.push('3000')
                    }
                }
           }
           console.log(this.DetailsSet)
        },
        handleCheckAllChange(val) {
            let data=this.DetailsSet.StateRange
            if(val){
               data.push('3010','3030') 
            }else{
               data.splice(data.indexOf('3010'), 1);
               data.splice(data.indexOf('3030'), 1); 
            }
            this.DetailsSet.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.DetailsSet.checkAll = checkedCount === this.DetailsSet.DetailsCheck2.length;
            this.DetailsSet.isIndeterminate = checkedCount > 0 && checkedCount < this.DetailsSet.DetailsCheck2.length;
        }
    }
  };
</script>
<style lang="scss">
.faultDataSet{
    padding: 15px;
    .set-title{
       padding: 20px 0;
    }
    .det-con{
        padding:0 20px;
    }
    .det-con span{
        font-size: 14px;
    }
    .det-con .el-form-item{
        margin: 0 10px;
    }
    .det-con .el-form-item{
      display: inline-block;
      .el-input{
          width:130px;
      }
    }
    .input-set{
        display: block;
        margin:0 10px 20px 0px; 
    }
    .el-checkbox-group{margin:0 10px 20px 20px; }
    .el-button--primary{
        margin:30px;
    }
    .det-con-li{
        margin:10px 0 20px 0;
    }
}
</style>