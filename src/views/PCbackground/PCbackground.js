import Pagination from "@/components/Pagination";

export default {
    components: {
        Pagination,
    },
    data() {
        return {
            operationlist: { //业态列表
                //业态
                datas: [],
                Name: "", //当前业态值                
                code: "" //当前业态值id                
            },
            tablelist: [],
            loading: true,
            total: 0, //总条数    
            isviewAdd: false, //是否显示添加弹框  
            title: '添加',
            InitDataParam: {//获取列表数据参数


            },
            submitFormParam: {//提交表单参数

            },
            delItemParam: {//删除列表条目参数

            },
            formName: [],
            formNameValue: '',
            Attribute: [],
            AttributeValue: '',
            ItemName: [],
            ItemNameValue: '',
            item: [],
            itemValue: '',
            isenable: '1',
            editType: 0,
            EditId: '',
            submitting: false,
            PageNo: 1,
            PageSize: 20,
        }
    },
    created: function () {
        this.getOperateInfo();
    },
    mounted: function () {

    },
    methods: {
        openEditDialog(row, type) {
            this.isviewAdd = true;
            this.editType = type;
            this.EditId = row.InspectOptionBusinessId;
            if (type == 0) {
                this.title = '添加';
                // this.formName = [];
                this.Attribute = [];
                // this.ItemName = [];
                this.item = [];
                this.formNameValue = '';
                this.AttributeValue = '';
                this.ItemNameValue = '';
                this.itemValue = '';
                this.isenable = '1';
            } else {
                this.title = '编辑';
                this.formNameValue = row.FormId;
                this.getFormFieldList(row.FormId, row.FieldKey);
                this.ItemNameValue = row.ClassificationId;
                this.getInspectOptionList(row.ClassificationId, row.InspectOptionId);
                this.isenable = row.IsEnable == 1 ? '1' : '0';
            }
        },
        deleteItem(id,fromId) {

            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    "InspectOptionBusinessId": id,
                    "FormId":fromId
                };
                this.$api.DeleteInspectOptionBusinessField(data).then(res => {
                    if (res && res.IsSuccess) {
                        this.message('删除成功', 1);
                        this.getInitData();
                    } else {
                        this.message(res.Message == null || res.Message == '' ? '删除失败' : res.Message, -1);
                    }

                }).catch(error => {
                    this.message(error.Message == null || error.Message == '' ? '删除失败' : error.Message, -1);
                });

            }).catch(() => {

            });
        },
        /**
         * 点击一级业态
         */
        handleClick(tab, event) {
            this.operationlist.code = tab.paneName;
            this.getInitData();
        },
        /**
         * 获取一级业态
         */
        getOperateInfo() { //获取一级业态
            this.$api.GetOperateInfo(1).then(res => {
                this.operationlist.datas = res;
                this.operationlist.Name = res[0].Name;
                this.operationlist.code = res[0].Id;
                this.getInitData();

            }).catch(r => {
            });
        },
        /**
         * 提交
         */
        submitForm() {
            // if( this.editType == 0){
            if (this.formNameValue == undefined || this.formNameValue == '') {
                this.message('请选择表单名称', 2);
                return;
            }
            if (this.AttributeValue == undefined || this.AttributeValue == '') {
                this.message('请选择表单属性', 2);
                return;
            }
            if (this.ItemNameValue == undefined || this.ItemNameValue == '') {
                this.message('请选择检查分类', 2);
                return;
            }
            if (this.itemValue == undefined || this.itemValue == '') {
                this.message('请选择检查项或者更换检查项分类', 2);
                return;
            }
            if (this.submitting) {
                this.message('正在提交...,请稍后再试', 2);
                return;
            }
            this.data2Server();
            // let hasDone =false;
            // for(let item of this.tablelist){
            //     if(item.InspectOptionId ==  this.itemValue){
            //         hasDone = true;
            //         break;
            //     }
            // }
            // if(hasDone){
            //     this.$confirm('该检查项已被使用,再次提交将会覆盖之前的列表数据?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.data2Server();
            //     }).catch(() => {
            //
            //     });
            // }else{
            //     this.data2Server();
            // }
        },
        data2Server() {
            this.submitting = true;
            let data = {
                "InspectOptionBusinessId": this.editType == 1 ? this.EditId : '00000000-0000-0000-0000-000000000000',
                "InspectOptionName": this.item == undefined || this.item == null ? "" : this.item.find((k) => {
                    return k.Id == this.itemValue
                }).Text,
                "StoreTypeId": this.operationlist.code,
                "FormId": this.formNameValue,
                "FormName": this.formName.find((k) => {
                    return k.formId == this.formNameValue
                }).formName,
                "FieldKey": this.AttributeValue,
                "FieldName": this.Attribute == null && this.Attribute == undefined ? '' : this.Attribute.find((k) => {
                    return k.fieldKey == this.AttributeValue
                }).fieldName,
                "FieldType": this.Attribute == null && this.Attribute == undefined ? '' : this.Attribute.find((k) => {
                    return k.fieldKey == this.AttributeValue
                }).fieldType,
                "IsEnable": this.isenable,
                "InspectOptionId": this.itemValue,

            };
            this.$api.UpdateInspectOptionBusinessField(data).then(res => {
                if (res && res.IsSuccess) {
                    this.message('提交成功', 1);
                    this.getInitData();
                    this.isviewAdd = false;
                } else {
                    this.message('提交失败', -1);
                }
                this.submitting = false;
            }).catch(r => {
                this.message('提交失败', -1);
                this.submitting = false;
            })
        },
        /**
         * 获取列表数据
         */
        getInitData() {
            this.loading = true;
            let data = {
                "StoreTypeId": this.operationlist.code,
                "ProcessType": 1,
                PageNo: this.PageNo,
                PageSize: this.PageSize
            };
            this.$api.GetInspectOptionBusinessFieldList(data).then(res => {
                if (res && res.IsSuccess) {
                    this.tablelist = res.Content;
                }
                this.loading = false;
                this.getOptionList();
                this.getFormList();
                this.total = res.Data;
            }).catch(r => {
                this.loading = false;
            })
        },
        //获取检查项分类
        getOptionList() {
            let dataInfo = {
                "StoreTypeId": this.operationlist.code,
                "TaskTypeId": "",
                "ProcessType": 1,
                "Type": 6,
                "PreviousId": ""
            };
            this.$api.GetBasicOptionList(dataInfo).then(res => {
                if (res && res.IsSuccess) {
                    this.ItemName = res.Content;
                }
            }).catch(r => {

            })
        },
        //获取检查项
        getInspectOptionList(id, defaultVal) {
            let data = {
                "StoreTypeId": this.operationlist.code,
                "ProcessType": 1,
                "ClassificationId": id,
                "TaskTypeId": "",
                "SearchWord": '',
                "pageNo": 1,
                "pageSize": 500,
                "InspectMethodType": 1
            };
            this.$api.GetInspectOptionListAsync(data).then(res => {
                if (res && res.IsSuccess) {
                    this.item = res.Content;
                    if (this.editType == 1) {
                        this.itemValue = defaultVal;
                    }
                    if(res.Content&&res.Content.length==0){
                        this.itemValue = '';
                    }
                }
            }).catch(r => {

            })
        },
        getFormList() {
            let data = {};
            this.$api.GetFormList(data).then(res => {
                if (res && res.IsSuccess) {
                    this.formName = res.Content;
                }


            }).catch(r => {

            })
        },
        getFormFieldList(id, defaultVal) {

            let data = {
                "formId": id
            };
            this.$api.GetFormFieldList(data).then(res => {
                if (res && res.IsSuccess) {
                    this.Attribute = res.Content;
                    if (this.editType == 1) {
                        this.AttributeValue = defaultVal;
                    }
                    if(res.Content&&res.Content.length==0){
                        this.AttributeValue = '';
                    }
                }
            }).catch(r => {

            })
        },
        changeFormName(id) {
            //清空
            this.Attribute=[];
            this.AttributeValue='';
            this.getFormFieldList(id);
        },
        changeItem(id) {
            //清空
            this.itemValue = '';
            this.item = [];
            this.getInspectOptionList(id);
        }
    }
}
