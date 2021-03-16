<template>
    <div class="page">
        <div class="header">
            <div class="title">
                餐饮服务企业（单位食堂）落实主体责任情况自查表
            </div>
        </div>
        <div v-for="item of allData">
			<div class="thead">
				<p>
					<span>企业名称:</span>
					<label>{{item.StoreName}}</label>
					<span>许可证号:</span>
					<label>{{item.LicenceCode}}</label>
				</p>
				<p>
					<span>地址:</span>
					<label>{{item.StoreAddr}}</label>
					<span>自查日期:</span>
					<label>{{item.ComInspectDate}}</label>
				</p>
			</div>
            <div class="main">
                <v-table
                        is-horizontal-resize
                        style="width:1000"
                        :columns="columns"
                        :table-data="item.ComInspectReportOptionList"
                        row-hover-color="#eee"
                        row-click-color="#edf7ff"
                        :cell-merge="cellMerge"
						:footer="footer"
						:footer-row-height="40"
                ></v-table>
            </div>
        </div>
		<div class="footer">
			<p>
				<span>自查人签名:</span>
				<label>{{title.CurrentDate}}</label>
			</p>
			<p>
				<span>企业法人代表/质量安全授权人签名:</span>
				<label>{{title.CurrentDate}}</label>
			</p>
		</div>
    </div>
</template>
<script>
    import {Base64} from 'js-base64';
    export default {
        data() {
            return {
                LicenceCode: "",
                StoreAddr: "",
                StoreName: "",
                selfDate: "",
                title: '',
				ExpType:'',
                allData: [],
                tableData: [],
                ClassificationName: [],
                checkDate:'',
                columns: [
                    {field: 'ClassificationName', title: '检查项目', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true},
                    {
                        field: 'custome', title: '序号', width: 70, titleAlign: 'center', columnAlign: 'center',
                        formatter: function (rowData, rowIndex) {
                            return rowIndex = rowIndex + 1
                        }
                    },
                    {field: 'InspectOptionText', title: '检查内容', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
					{
						field: 'IsQualified', title:'检查结果', width: 120, titleAlign: 'center', columnAlign: 'center',
						formatter: function (rowData,rowIndex) {
							return rowData.IsQualified == 1?"合格":"不合格";
						}
					},
                    {field: 'beizhu', title: '备注', width: 34, titleAlign: 'center', columnAlign: 'left', isResize: true},


                ],
				footer:[
						["自查结论(可另附页)"],
						["整改措施(可另附页)"]
				]
            }
        },
        created() {
        	this.bodyFontSize();
            this.GetComInspectReportList();
            document.title = this.$route.query.storeName;
            this.checkDate = this.$utils.getUrlKey('ComInspectDate');
        },
        mounted: function () {


        },
        methods: {
			bodyFontSize(){
				let desW=750,
						winW=document.documentElement.clientWidth,
						ratio=winW/desW;
				let oMain=document.getElementById('foodSafetyForum');
				document.documentElement.style.fontSize=ratio*100+'px';
			},
			GetComInspectReportList() {
                /*let data = {
                    "StoreId": "e21818ce-c2ec-44b0-83ae-79a3b5863911",
                    "AppId": "128b85de-0f43-4aac-bed9-33541f84eedb",
                    "UserId": "f5268875-4cce-4a9e-b9fb-9bd8052aa55c",
                    "ComInspectDate": "2019-5-28 10:15:32",
                    "ExpType": 1

                }*/
				let data = {
					"StoreId": this.$utils.getUrlKey('storeId'),
					"AppId": this.$utils.getUrlKey('appId'),
					"UserId": this.$utils.getUrlKey('userId'),
					"ComInspectDate": this.$utils.getUrlKey('comInspectDate'),
					"ExpType": this.$utils.getUrlKey('expType')
				};
                this.$api.GetComInspectReportList(data).then(res => {
                    if (res.IsSuccess) {
                        this.title = res.Content;
                        if (res.Content!=null&&res.Content.ComInspectReportDateList != null && res.Content!=null&&res.Content.ComInspectReportDateList.length > 0) {
                        	for(let item of res.Content.ComInspectReportDateList ){
                        	    item.CurrentDate = res.Content.CurrentDate;
                                item.LicenceCode = res.Content.LicenceCode;
                                item.StoreAddr = res.Content.StoreAddr;
                                item.StoreName = res.Content.StoreName;
                        		let itemList = item.ComInspectReportOptionList;
								let arr = [];
								let k = 0;
								for (let i = 0; i < itemList.length; i++) {
									if(arr.indexOf(itemList[i].ClassificationId)>=0){
										itemList[k].lastIndex=i;
									}else{
										itemList[i].firstIndex = i;
										k = i;
										arr.push(itemList[i].ClassificationId);
									}
								}
							}
                        }
						this.allData = res.Content.ComInspectReportDateList;
                    }
                }).catch(error => {

                })


            },
            cellMerge(rowIndex, rowData, field) {
                if (field === 'ClassificationName') {
					let name = rowData.ClassificationName;
					if(rowIndex == rowData.firstIndex){
						return {
							colSpan: 1,//列
							rowSpan: (rowData.lastIndex-rowData.firstIndex)+1,//行
							content: name
						}
					}
                }
            }
		}
    }

</script>
<style scoped lang="scss">
    .page {
        width: 100%;
        margin: 0 auto;
        height: 100%;
        display: -webkit-box; /* android 2.1-3.0, ios 3.2-4.3 */
        display: -webkit-flex; /* Chrome 21+ */
        display: -ms-flexbox; /* WP IE 10 */
        display: flex; /* android 4.4 */
        -webkit-box-orient: vertical; /* android 2.1-3.0, ios 3.2-4.3 */
        -webkit-flex-direction: column; /* Chrome 21+ */
        -ms-flex-direction: column; /* WP IE 10 */
        flex-direction: column; /* android 4.4 */
        overflow: auto;
        padding: 0 15px;

		.header {
			width: 100%;
			.title {
				width: 100%;
				height: .8rem;
				line-height: .8rem;
				text-align: center;
				font-size:.2rem;
			}
		}
		.thead{
			white-space:nowrap;
			p{
				margin:0;
				font-size:.15rem;
				height:.6rem;
				line-height:.6rem;
			}
			label{
				margin-right:.4rem;
			}
		}
		.main{
			font-size:.1rem;
		}
		.footer{
			font-size:.15rem;
			p{
				font-size:.1rem;
				height:.5rem;
				line-height:.5rem;
				position:relative;
			}
			span{
				margin-right:1.5rem;
			}
			label{
				right:0;
				position:absolute;
			}
		}
    }


</style>
<style lang="scss">
	.footer-cell-class-name-title {

		color: #000;
	}
	.v-table-ftable{
		width:100% !important;
		.horizontal-border{
			text-align:left !important;
			width:100% !important;
			padding-left:.25rem;
		}
	}

	.footer-cell-class-name-normal {
		width:200px;
		color: red;
	}
	.v-table-body{
		overflow-x:auto !important;
	}
	.v-table-body-class{
		overflow-x:auto !important;
	}
	.v-table-rightview-special-border{
		overflow-x:auto !important;
	}
	.v-scrollbar-wrap{
		overflow-x:auto !important;
	}
</style>