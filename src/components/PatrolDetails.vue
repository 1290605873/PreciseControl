<template>
    <div>
        <div class="header">巡查结果记录表</div>
        <div class="content">
            <ul>
                <li>
                    <p class="left">单位名称:</p>
                    <p>{{InspectionTable.Name}}</p>
                </li>
                <li>
                    <p class="left">地址:</p>
                    <p>{{InspectionTable.Address}}</p>
                </li>
                <li>
                    <p class="left">巡查位置:</p>
                    <p>{{InspectionTable.Address}}</p>
                </li>
                <li>
                    <div style="border-right:1px solid #ccc;">
                        <p class="left">所属街道:</p>
                        <p>{{InspectionTable.LocationName}}</p>
                    </div>
                    <div>
                        <p class="left">所属社区:</p>
                        <p>{{InspectionTable.CommunityName}}</p>
                    </div>
                </li>
                <li>
                    <p class="left">巡查时间:</p>
                    <p>{{InspectionTable.InspectDate}}</p>
                </li>
                <li>
                    <div style="border-right:1px solid #ccc;">
                        <p class="left">巡查类型:</p>
                        <p>{{InspectionTable.InspectType}}</p>
                    </div>
                    <div>
                        <p class="left">巡查人员:</p>
                        <p>{{InspectionTable.InspectUserName}}</p>
                    </div>
                </li>
                <li>
                    <div style="border-right:1px solid #ccc;">
                        <p class="left">巡查结果:</p>
                        <p>{{InspectionTable.InspectResult}}</p>
                    </div>
                    <div>
                        <p class="left">结果处理:</p>
                        <p>{{InspectionTable.ProcessResult}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="header">相关检查项图片</div>
        <div class="picture">
            <ul>
                <li v-for="item in Patrolprojectpic">
                    <p>{{item.Text}}</p>
                    <img v-for="itempic in item.InspectOptionGuideList" v-show="itempic.Picture" :src=itempic.Picture alt="">
                </li>
            </ul>
        </div>
        <div class="header" style="display: flex;margin-bottom: 5px;">
            <span style="width: 15%;">巡查项目</span>
            <span style="width: 70%;">巡查内容</span>
            <span style="width: 15%;">巡查结果</span>
        </div>
        <div class="details" v-for="item in Patrolproject">
            <span style="width: 15%;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;">{{item.ClassificationName}}</span>
            <div style="width: 85%;">
                <div v-for="itemstr in item.InspectOptionList" style="display: flex;justify-content: space-between;border-bottom: 1px solid #ccc;">
                    <span style="padding: 10px;width: 80%;border-right: 1px solid #ccc;">{{itemstr.Text}}</span>
                    <div style="display: flex;align-items: center;width: 40%;justify-content: center;">
                        <!-- <el-radio v-model="itemstr.Status" :label="1">是</el-radio> -->
                        <!-- <el-radio v-model="itemstr.Status" :label="0">否</el-radio> -->
                        <el-radio v-for="itemtext in itemstr.InspectOptionStatusList" v-model="itemstr.Status" :label="itemtext.Status">{{itemtext.StatusText}}</el-radio>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex;flex-wrap: wrap;justify-content: space-between;" v-if="InspectionTable.SignaturePic == null || InspectionTable.SignaturePic == ''">
            <div class="autograph" v-for="item in InspectionTable.EnforceSignature">
                <p style="padding: 0 5px;width: 120px;">巡查人员(签字):</p>
                <div>
                    <img :src=item alt="">
                </div>
            </div>
            <div class="autograph" >
                <p style="padding: 0 5px;width: 120px;">被巡察单位(签字):</p>
                <div>
                    <img :src=InspectionTable.StoreSignature alt="">
                </div>
            </div>            
        </div>
        <div v-if="InspectionTable.SignaturePic">
            <div class="autograph">
                <p style="padding: 0 5px;width: 120px;">检查人员与被查单位负责人照片:</p>
                <div>
                    <img :src="InspectionTable.SignaturePic" alt="">
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                InspectionTable:{},
                Patrolproject: [],
                Patrolprojectpic:[],
            }
        },
        name: "PatrolDetails",
        props:{
            "Rowcontentdetails":"",
        },
        created: function() {
            this.inspectiondetails()
            console.log(this.Rowcontentdetails)
        },
        methods: {
            //查看检查详情
            inspectiondetails(rows) {
                let data = {
                    "SubTaskId": this.Rowcontentdetails.Id,
                    "StoreId": this.Rowcontentdetails.StoreId,
                    "ClientType": 0,
                    "RoleType": 0
                }
                this.$api.GetInspectTaskDetail(data).then(
                    res => {
                        if (res.IsSuccess) {
                            this.InspectionTable = res.Content;
                            if(res.Content.EnforceSignature){
								debugger
                                if (res.Content.EnforceSignature.indexOf(";") == -1) {
                                    this.InspectionTable.EnforceSignature = res.Content.EnforceSignature.split(";");
                                } else {
                                    // res.Content.EnforceSignature.splice(res.Content.EnforceSignature.length-1,1)
                                    let arr = [];
                                    let arr1 = [];
                                    arr = res.Content.EnforceSignature.split(";");
                                    arr1 = arr.splice(arr.length - 1, 1);
                                    this.InspectionTable.EnforceSignature = arr;
                                }
                            }
                            if(res.Content.length!=''&&res.Content.StoreSignature){
                                if (res.Content.StoreSignature.indexOf(";") == -1) {
                                    this.InspectionTable.StoreSignature = res.Content.StoreSignature.split(";")
                                } else {
                                    let arr = [];
                                    let arr1 = [];
                                    arr = res.Content.StoreSignature.split(";");
                                    arr1 = arr.splice(arr.length - 1, 1);
                                    this.InspectionTable.StoreSignature = arr;
                                }
                            }                            
                        }
                    }
                )
                let datas = {
                    "SubTaskId": this.Rowcontentdetails.Id,
                    "StoreId": this.Rowcontentdetails.StoreId,
                    "ClientType": 0,
                    "RoleType": 0
                }
                this.$api.GetInspectTaskOptionsResult(datas).then(
                    res => {
                        if (res.IsSuccess) {
                            let arr = res.Content;
                            this.Patrolproject = res.Content;
                            for(let item of arr){
                                for(let secondItem of item.InspectOptionList ){
                                    for(let thirdItem of secondItem.InspectOptionGuideList ){
                                       if(thirdItem.Picture!=null&&thirdItem.Picture.startsWith('http')){
                                           this.Patrolprojectpic.push(secondItem);
                                           break;
                                       }
                                    }
                                }
                            }
                            console.log(this.Patrolprojectpic)
                        }
                    }
                )
            },
        },
        filters: {
            formatedate: function(d) {
                if (d != "") {
                    var date = new Date(parseInt(d.substring(6, 19)));
                    return date.toLocaleDateString();
                }
            }
        }        
    }
</script>

<style scoped lang="scss">
    .header {
        text-align: center;
        height: 50px;
        line-height: 50px;
        background: #404040;
        color: #ffffff;
    }

    .content {
        border: 1px solid #ccc;

        ul {
            padding-left: 0;
            margin: 0;
        }

        li {
            display: flex;
            border-bottom: 1px solid #ccc;

            div {
                display: flex;
                width: 50%
            }

            p {
                margin: 0;
                height: 40px;
                line-height: 40px;
                padding-left: 20px;
            }

            .left {
                width: 100px;
                text-align: center;
                padding: 0;
                border-right: 1px solid #ccc;
            }
        }
    }

    .picture {
        border: 1px solid #ccc;
        ul {
            padding-left: 0;
            margin: 0;
            li {
                list-style: none;
                border: 1px solid #ccc;
                margin: 5px;
                p {
                    border-bottom: 1px solid #ccc;
                    line-height: 40px;
                    margin: 0;
                    padding-left: 10px;
                }

                img {
                    width: 200px;
                    height: 200px;
                    margin: 10px;
                }
            }
        }
    }

    .details {
        display: flex;
        border: 1px solid #ccc;
        margin-bottom: 5px;
        justify-content: space-between;
        border-bottom: 0 none;
        span {
            padding: 0 10px;
            display: flex;
            align-items: Center;
        }
    .el-radio{
        margin-right:5px; 
        margin-left: 0;
    }        

    }
                .autograph {
        width: 49%;
        border: 1px solid #ccc;
        display: flex;
        align-items: Center;
        margin-bottom: 5px;
    
        div {
            border-left: 1px solid #ccc;
    
            img {
                width: 100px;
                height: 100px;
            }
        }
    }

</style>
