import Pagination from "@/components/Pagination";
export default {
    components: {
        Pagination
    },
    data(){
        return {
            tablelist:[],//初始化列表
            editorDialog:{
                show:false
            },
            disabled:false,
            form:{
                statusAndColor:'',//门店状态及颜色
                timeUpperLimit:'',//累计未完成次数及上限
                UpperLimitChangeColor:'',//累计未完成次数超上限后状态变更为
                tips:''//提示语
            },
            editor:{
                ids:'',
                name:'',
                nextName:'',
                UnfinishedLimit:'',
                tips:'',
            },
            
            rules: {
                timeUpperLimit: 
                [
                    { required: true, //是否必填
                      message: '输入大于1的数字', //规则
                      trigger: 'blur'  //何事件触发
                    }
                ]
            }
        }   
    },

    created: function () {
        this.getStateColors();
    },
   
    methods:{
        /**
         * 获取列表
         */
        getStateColors(){
            this.$api.GetStateColors().then(res=>{
                if(res.Message && res.Content.length>0){
                    this.tablelist = res.Content;
                }
            }).catch(()=>{})
            
        },
        /**
         * 编辑
         */
        editorList(id,name,nextName,UnfinishedLimit,tips){
            this.editorDialog.show = true;
            if(name == "红色警告"){
                this.disabled = true;
            }else{
                this.disabled = false;
            }
            this.form.statusAndColor = name;
            this.form.timeUpperLimit = nextName;
            this.form.UpperLimitChangeColor = UnfinishedLimit;
            this.form.tips = tips;

            this.editor.ids = id;
            this.editor.name = name;
            this.editor.nextName = nextName ?nextName:"";
            this.editor.UnfinishedLimit = UnfinishedLimit ?UnfinishedLimit:"";
            this.editor.tips = tips;
        },
        /**
         * 保存
         */
        editorSave() {
            
            let data = {
                    "Id": this.editor.ids,
                    "Name": this.editor.name,
                    "NextName": this.editor.nextName,
                    "UnfinishedLimit": this.form.timeUpperLimit,
                    "Tips": this.form.tips
                }
            this.$api.UpdateStateColors(data).then(res=>{;
                if(res.IsSuccess ){
                    this.getStateColors();
                    this.message(res.Message,1)
                    this.editorDialog.show = false;
                }else{
                    this.message(res.Message,2)
                }
            }).catch(()=>{})
            
        }


    }
        
        
}
