<template>
    <div>
        <div class="table">
            <div class="header">执法详情页</div>
            <div class="content">
                <ul>
                    <li>
                        <p class="left">单位名称:</p>
                        <p>{{lawenforcementtasksDetails.Name}}</p>
                    </li>
                    <li>
                        <p class="left">地址:</p>
                        <p>{{lawenforcementtasksDetails.Address}}</p>
                    </li>
                    <li>
                        <p class="left">巡查位置:</p>
                        <p>{{lawenforcementtasksDetails.InspectLocation}}</p>
                    </li>
                    <li>
                        <div style="border-right:1px solid #ccc;">
                            <p class="left">所属街道:</p>
                            <p>{{lawenforcementtasksDetails.LocationName}}</p>
                        </div>
                        <div>
                            <p class="left">所属社区:</p>
                            <p>{{lawenforcementtasksDetails.CommunityName}}</p>
                        </div>
                    </li>
                    <li>
                        <p class="left">执法时间:</p>
                        <p>{{lawenforcementtasksDetails.EnforceDate}}</p>
                    </li>
                    <li>
                        <div style="border-right:1px solid #ccc;">
                            <p class="left">执法类型:</p>
                            <p>{{lawenforcementtasksDetails.EnforceType}}</p>
                        </div>
                        <div>
                            <p class="left">执法人员:</p>
                            <p>{{lawenforcementtasksDetails.EnforceUserNameReal}}</p>
                        </div>
                    </li>
                    <li>
                        <p class="left">执法结果:</p>
                        <p>{{lawenforcementtasksDetails.EnforceResult}}</p>
                    </li>
                </ul>
            </div>
            <div class="header">相关检查项图片</div>
            <div class="picture">
                <ul v-for="item in Patrolprojectpic">
                    <li v-for="itemstr in item.InspectOptionList">
                        <p>{{itemstr.Text}}</p>
                        <img v-for="itempic in itemstr.EnforcePictures.split(';')" :src=itempic alt="">
                    </li>
                </ul>
            </div>
            <div class="header">执法说明</div>
            <div class="Enforcementinstructions">
                {{lawenforcementtasksDetails.EnforceRemark}}
            </div>
            <div style="display: flex;flex-wrap: wrap;justify-content: space-between;">
                <div class="autograph" v-if="lawenforcementtasksDetails.EnforceSignature.length>0" v-for="item in lawenforcementtasksDetails.EnforceSignature">
                    <p style="padding: 0 5px;width: 120px;">巡查人员(签字):</p>
                    <div>
                        <img :src=item alt="">
                    </div>
                </div>
                <div class="autograph">
                    <p style="padding: 0 5px;width: 120px;">被巡察单位(签字):</p>
                    <div>
                        <img :src=lawenforcementtasksDetails.StoreSignature alt="">
                    </div>
                </div>
            </div>
            <div class="header">整改详情</div>
            <div class="Rectificationdetails content">
                <ul>
                    <li>
                        <p class="left">整改时间:</p>
                        <p>{{lawenforcementtasksDetails.ReformDate111}}</p>
                    </li>
                    <li>
                        <div style="border-right:1px solid #ccc;">
                            <p class="left">执法类型:</p>
                            <p>{{lawenforcementtasksDetails.EnforceType}}</p>
                        </div>
                        <div>
                            <p class="left">复查审核人员:</p>
                            <p>{{lawenforcementtasksDetails.ReviewEnforceUserName}}</p>
                        </div>
                    </li>
                    <li>
                        <p class="left">整改结果:</p>
                        <p>{{lawenforcementtasksDetails.ReformStatusText}}</p>
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
                        <div style="display: flex;align-items: center;width: 20%;justify-content: center;">
                            <el-radio v-model="itemstr.Status" :label="1">是</el-radio>
                            <el-radio v-model="itemstr.Status" :label="0">否</el-radio>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                lawenforcementtasksDetails: {},
                Patrolproject: [ //巡查项目
                ],
                Patrolprojectpic: [],
            }
        },
        props: {
            "Rowcontentdetails": "",
        },
        name: "EnforcementDetails",
        created: function() {
            this.enforcementdetails();
        },
        methods: {
            //查看执法详情
            enforcementdetails(rows) {
                let data = {
                    "SubTaskId": this.Rowcontentdetails.Id,
                    "StoreId": this.Rowcontentdetails.StoreId,
                    "ClientType": 0,
                    "RoleType": 0
                }
                this.$api.GetInspectEnforceTaskDetail(data).then(
                    res => {
                        if (res.IsSuccess) {
                            this.lawenforcementtasksDetails = res.Content;
                            if (res.Content.length != '' && res.Content.EnforceSignature) {
                                if (res.Content.EnforceSignature.indexOf(";") == -1) {
                                    this.lawenforcementtasksDetails.EnforceSignature.push(res.Content.EnforceSignature)
                                } else {
                                    let arr = [];
                                    let arr1 = [];
                                    arr = res.Content.EnforceSignature.split(";");
                                    arr1 = arr.splice(arr.length - 1, 1);
                                    this.lawenforcementtasksDetails.EnforceSignature = arr;
                                }
                            }
                            if (res.Content.length != '' && res.Content.StoreSignature) {
                                if (res.Content.StoreSignature.indexOf(";") == -1) {
                                    this.lawenforcementtasksDetails.StoreSignature.push(res.Content.StoreSignature)
                                } else {
                                    let arr = [];
                                    let arr1 = [];
                                    arr = res.Content.StoreSignature.split(";");
                                    arr1 = arr.splice(arr.length - 1, 1);
                                    this.lawenforcementtasksDetails.StoreSignature = arr;
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
                this.$api.GetEnforceTaskOptionsResult(datas).then(
                    res => {
                        if (res.IsSuccess) {
                            let arr = res.Content;
                            this.Patrolproject = res.Content;
                            for (let item of arr) {
                                for (let secondItem of item.InspectOptionList) {
                                        if (secondItem.EnforcePictures != null && secondItem.EnforcePictures.startsWith('http')) {
                                            this.Patrolprojectpic.push(item);
                                            break;
                                        }
//                                     for (let thirdItem of secondItem.InspectOptionGuideList) {
//                                     }
                                }
                            }
                            console.log(this.Patrolprojectpic)
                        }
                    }
                )
            },
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

    .Enforcementinstructions {
        width: 100%;
        // height: 100px;
        border: 1px solid #ccc;
        word-wrap: break-word;
        text-indent: 2em;
        line-height: 18px;
        padding: 5px 10px;
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
