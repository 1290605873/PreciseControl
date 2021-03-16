export default {
    name:"OperationManage",
    data(){
        return{
            setObj:{
                ConfigValue:0,
            },   
            userId:this.$utils.getUrlKey("userId"),
            appId:this.$utils.getUrlKey("appId"),
            orgId:this.$utils.getUrlKey("curChangeOrg"),
        }
    },
    mounted(){
        this.getStoreTagConfig()
        console.log(this.userId)
    },
    methods:{
        tagsChangeHandler(val){             // 标签开关
            if(val){
                this.setObj.ConfigValue = 1
            }else{
                this.setObj.ConfigValue = 0
            }
            this.saveStoreTagConfig()
        },
        // =====| http |=====
        getStoreTagConfig(){                // 获取门店标签配置
            this.$api.GetStoreTagConfig({
                "ConfigType": 1,
                "OrgId": this.orgId,
                "AppId": this.appId,
                "UserId": this.userId,
                // "ClientType": 0,
                // "RoleType": 0,
                // "RoleId": "string"
            }).then(res => {
                if(res.IsSuccess){
                    this.setObj = res.Content
                }
            }).catch(err => {
                this.$message.error('网络链接失败，请重试')
            })
        },
        saveStoreTagConfig(){
            this.$api.SaveStoreTagConfig({
                "ConfigType": this.setObj.ConfigType,
                "ConfigValue": this.setObj.ConfigValue,
                "OrgId": this.orgId,
                "AppId": this.appId,
                "UserId": this.userId,
                // "ClientType": 0,
                // "RoleType": 0,
                // "RoleId": "string"
              }).then(res => {
                if(res.IsSuccess){
                    this.$message.success(res.Message)
                    this.getStoreTagConfig()
                }else{
                    this.$message.error(res.Message)
                    
                }
            }).catch(err => {
                this.$message.error('网络链接失败，请重试')
            })
        }
    },
}