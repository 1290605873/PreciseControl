<template>
    <div class="picConfig">
        <el-form 
            class="ruleForm"
            :model="ruleForm" 
            :rules="rules" 
            ref="ruleForm" 
            >
            <el-form-item label="选择操作间"  prop="operateRoom" label-width="160px" >
                <el-select 
                    placeholder="请选择操作间" 
                    :filterable="ruleForm.operateRoomList.length > 7"
                    v-model="ruleForm.operateRoom" clearable="">
                    <el-option 
                            v-for="(room,index) of ruleForm.operateRoomList" 
                            :key="index" 
                            :value="room" 
                            :label="room">
                        </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传参照图片"  prop="fileList" class="fileList" label-width="160px" >
                    <el-checkbox-group v-model="ruleForm.fileList" v-show="false"></el-checkbox-group>
                    <el-button type="primary" size="small"  class="onImport" @click="onImport">点击上传</el-button>
                    <el-upload
                        class="upload-demo"
                        ref="fileRefs"
                        action=""
                        :class="{'unUpload':ruleForm.fileList.length == 0}"
                        :limit='1'
                        :file-list="ruleForm.fileList"
                        list-type="picture"
                        :on-change="changePic"
                        :http-request="defaultPicUpload"
                        :before-upload="beforeAvatarUpload"
                        :before-remove="beforeRemove"
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span 
                            slot="tip" 
                            class="el-upload__tip" 
                            style="margin-left:20px;display:inline-block;">请上传748*433pt的图片</span>
                    </el-upload>
                
            </el-form-item>
            <el-form-item label='请选择显示问题点'  prop="violationList" label-width="160px" >
                <div class="violation-box" >
                    <div>
                        <el-checkbox 
                            :indeterminate="isIndeterminate" 
                            v-model="checkAll" 
                            @change="handleCheckAllChange">全选</el-checkbox>
                    </div>
                    <el-checkbox-group 
                        v-model="ruleForm.violationList" 
                        @change="changeViolation" >
                        <el-checkbox 
                            v-for='(item,index) of violation' 
                            :key='item.Id' 
                            :label="item.Id" 
                            :value="item.Name" 
                            @change="((val)=>{itemChange(item,index)})"
                            :checked="item.checked">{{item.Name}}</el-checkbox>
                            <!-- @change="selectedShowPoint(item)" -->
                    </el-checkbox-group>
                </div>
                
            </el-form-item>
            <!-- 请选择正确的问题点 -->
            <el-form-item label='请选择正确的问题点' v-if="ruleForm.violationList.length>0" label-width="160px" >
                <div class="violation-box"  >
                    <div>
                        <el-checkbox 
                            :indeterminate="right.isIndeterminate" 
                            v-model="right.selectAll" 
                            @change="handleSelectAllRight">全选</el-checkbox>
                    </div>
                    <el-checkbox-group 
                        v-model="right.selectedIdList" 
                        @change="changeRightPoint" >
                        <el-checkbox 
                            v-for='item of right.pointArr' 
                            :key='item.Id' 
                            :label="item.Id" 
                            :value="item.Name" 
                            
                            :checked="item.checked">{{item.Name}}</el-checkbox>
                    </el-checkbox-group>
                    <!-- @change="selectedRightPoint(item)" -->
                </div>
                
            </el-form-item>
            <el-form-item label="奖励规则" v-if="right.selectedIdList.length>0" label-width="160px">
                <el-select v-model="reward.selectRule" clearable >
                    <el-option 
                        v-for="(item,index) of reward.ruleList" 
                        :key="index" :label="item.optionVal" 
                        :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="btn-box">
                <div  style="text-align:center;">
                    <el-button @click="closePicDialog">取 消</el-button>
                    <el-button type="primary" :disabled="submitDisabled" @click='submitForm("ruleForm")'> 确 定</el-button>
                </div>
            </el-form-item>
        </el-form>
        <!-- <div style="text-align:center;">
            <el-button @click="closePicDialog">取 消</el-button>
            <el-button type="primary" :disabled="submitDisabled" @click='submitForm("ruleForm")'> 确 定</el-button>
        </div> -->
    </div>
</template>
<script>
export default {
    name:'picConfig',
    props:{
        violation:{
            type:Array,
            default:[]
        },
        roomList:{
            type:Array,
            default:[]
        },
        title:{
            type:String,
            default:''
        },
        Id:{
            type:String,
            default:''
        }
    },
    data (){
        return {
            checkAll:false,
            isIndeterminate: false,
            rules:{
                operateRoom: [
                    { required: true, message: '请选择操作间', trigger: 'change' }
                ],
                fileList: [
                    { required: true, message: '请上传参照图片', trigger: 'change' }
                ],
                violationList:[
                    { required: true, message: '请选择问题点', trigger: 'change' }
                ]
            },
            ruleForm:{
                operateRoom:'',
                operateRoomList:[
                    
                ],
                fileList:[],
                violationList:[],
                referenceImg:'',
            },
            isNewUpload:false,
            ViolationsNameArr:[],
            ReferenceImageData:[],//通过Id查找返回的问题点集合
            submitDisabled:false,
            right:{
                pointArr:[],
                selectedIdList:[],
                isIndeterminate:false,
                selectAll:false,
                paramPointObjList:[],
                flagArr:[]

            },
            reward:{//奖励规则
                selectRule:'',
                ruleList:[],
            },
            checkedOption:[],
            rightCheckedPoint:[],
            questPointObj:{},
            currentObj:{}
           
        }
    },
    created(){
        this.ruleForm.operateRoomList = this.roomList;
        if(this.title == '新增配置'){
            this.Id = '';
            this.ruleForm.violationList = [];
            for(let item of this.violation){
                item.checked = false;
            }
        }else{
            this.getReferenceImageById()
        }
        console.log('sdfsfd',this.right.selectedIdList)
        
    },
    methods:{
        /**
         * 根据Id获取参照图
         */
        getReferenceImageById() {
            let data = {
                Id:this.Id
            }
            return this.$api.GetReferenceImageById(data).then(res => {
                if (res.IsSuccess) {
                    this.ruleForm.operateRoom = res.Content.OperateRoom;
                    let path = res.Content.ImageUrl.split('/');
                    let len = path.length;
                    let imgSrc = path[len-1];
                    this.ruleForm.fileList = [{
                        name:imgSrc,
                        url: res.Content.ImageUrl,
                    }]
                    this.ViolationsNameArr = [];
                    let ViolationsByIdList = res.Content.ReferenceImageViolationsByIdList;
                    this.ReferenceImageData = res.Content.ReferenceImageViolationsByIdList;
                    for(let aa of this.ReferenceImageData){
                        if(aa.IsChecked){
                            this.$forceUpdate()
                            this.right.flagArr.push(aa.Id)
                        }
                    }
                    
                    
                    this.$nextTick(()=>{
                        this.$forceUpdate();
                        this.right.selectedIdList = this.right.flagArr;
                    })

                    this.reward.selectRule = res.Content.RewardRule;
                    if(ViolationsByIdList && ViolationsByIdList.length){
                        for (var i = 0; i < ViolationsByIdList.length; i++) {
                            if (this.ViolationsNameArr.indexOf(ViolationsByIdList[i]) == -1) {
                                this.ViolationsNameArr.push(ViolationsByIdList[i].Id)
                            }
                        }
                    }
                    
                    this.ruleForm.violationList = this.ViolationsNameArr;
                   
                    if(this.ViolationsNameArr.length == this.violation.length){
                        this.checkAll = true;
                        this.isIndeterminate = false;
                        this.ruleForm.violationList = [];
                        //处理新增问题点后，再编辑参照图，全选的问题。
                        for(let ele of this.violation){
                            ele.checked = true;
                            this.ruleForm.violationList.push(ele.Id)
                        }
                        //console.log("查询1",this.ruleForm.violationList.length)
                    }else{
                        this.checkAll = false;
                        this.isIndeterminate = true;
                    }
                    this.checkedOption = [];
                    this.right.selectRule = [];
                    //this.right.selectedIdList = []
                    // 回显正确的问题点
                    ViolationsByIdList.forEach((point,idx) =>{
                        
                        
                        point.checked = point.IsChecked;
                        let index = this.violation.findIndex((item) =>{
                            return item.Id == point.Id;
                        })
                        if(index>=0){
                            //找出正确的问题点
                            this.violation[index].checked = point.checked;
                            this.right.pointArr.push(this.violation[index]);
                            
                            
                            for(let item of this.right.pointArr){
                                if(item.checked){
                                    if(this.checkedOption.indexOf(item)==-1){
                                        this.checkedOption.push(item);
                                        
                                    }
                                }
                            }
                            console.log(this.checkedOption.length)
                            
                        }
                        
                    })
                    this.rightCheckedPoint = [];
                    for(let item of this.right.pointArr){
                        this.rightCheckedPoint.push({
                            Id:item.Id,
                            Name:item.Name,
                            IsChecked:item.checked
                        })
                    }
                    
                    // 是否全选
                    this.right.selectAll = ViolationsByIdList.length === this.checkedOption.length;
                    this.right.isIndeterminate = !this.right.selectAll;
                    for(let i=0;i<this.checkedOption.length;i++){
                        let num = i+1;
                        this.reward.ruleList.push({
                            Id:num,
                            optionVal:'选中'+ num + '项给奖励'
                        });
                    }
                    console.log('aaa',this.right.pointArr)
                    
                } else {
                    
                }
            }).catch(r=>{});
        },
        /**
         * 选择参照图
         */
        onImport(){
            if(this.ruleForm.fileList.length>0){
                this.message('请先删除图片再上传',2);
                return false;
            }else{
                this.$refs['fileRefs'].$refs['upload-inner'].handleClick();
            }
        },
        changePic(file, filelist) {
            this.ruleForm.fileList = filelist;
        },
        /**
         * 上传参照图
         */
        defaultPicUpload(obj) {
            this.submitDisabled = true;
            let fd = new FormData();
            fd.append('upload', obj.file);
            this.$api.UploadFile(fd).then(res => {
                if (res.data.IsSuccess) {
                    this.ruleForm.referenceImg = res.data.Detail;
                    this.isNewUpload = true;
                    if(res.data.Detail!='' || res.data.Detail!=null){
                        this.message(res.data.Message, 1);
                        this.submitDisabled = false;
                    }else{
                        this.message(res.data.Message, -1)
                        this.submitDisabled = false;
                    }
                    
                } else {
                    this.message(res.data.Message, -1)
                }
            }).catch(error => {

            })
        },
        /**
         * 上传参照图前验证尺寸
         */
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isPG = (isJPG || isPNG)                                       //限制图片格式为jpg / png
            const isLt2M = file.size / 1024 / 1024 < 2;                         //限制图片大小
            const isSize = new Promise(function(resolve,reject) {
                let width = 1496
                let height = 866
                let _URL = window.URL || window.webkitURL
                let img = new Image()
                img.onload = function() {
                    let valid = img.width <= width && img.height <= height
                    valid ? resolve() : reject();
                }
                img.src = _URL.createObjectURL(file)
            }).then(() => {
                return file;
            },()=>{
                this.message('请上传小于等于748*433pt的图片!',-1);
                this.ruleForm.fileList = [];
                return promise.reject();
            })
            return isSize
        },
        handleCheckAllChange(val) {
            //this.reward.ruleList = [];
            let arr = [];
            arr = val ? this.violation : [];
            this.ruleForm.violationList = [];
            for (var i = 0; i < arr.length; i++) {
                if (this.ruleForm.violationList.indexOf(arr[i].Id) == -1) {
                    this.ruleForm.violationList.push(arr[i].Id)
                }
            }
            this.right.isIndeterminate = false;
            this.right.selectAll = false;
            if(val){
                if(this.title == '新增配置'){
                    this.checkedOption = [];
                    console.log(this.right.selectedIdList)
                    for(let item of this.violation){
                        item.checked = true;
                    }
                    let temp = [];
                    for(let ele of this.violation){
                        ele.checked = false;
                        temp.push(ele);
                    }
                    this.right.pointArr = temp;
                    if(this.right.selectedIdList.length>0){
                        for(let item of this.right.selectedIdList){
                            let idx = this.right.pointArr.findIndex((ele) =>{
                                return ele.Id == item;
                            })
                            if(idx>=0){
                                this.$nextTick(()=>{
                                    this.$forceUpdate();
                                    this.right.pointArr[idx].checked = true;
                                    this.$set(this.right.pointArr[idx],'checked',true);
                                }) 
                            }
                        }
                    }
                    for(let item of this.right.pointArr){
                        if(item.checked && this.checkedOption.indexOf(item) == -1){
                            this.checkedOption.push(item)
                        }
                    }
                }else{
                    for(let item of this.violation){
                        item.checked = true;
                    }
                    let temp = [];
                    for(let ele of this.violation){
                        ele.checked = false;
                        temp.push(ele);
                    }
                    this.right.selectAll = false;
                    this.right.pointArr = temp;
                    this.right.selectedIdList = [];
                    if(this.ReferenceImageData.length){//this.ReferenceImageData接口返回的问题点。
                        for(let k=0;k<this.ReferenceImageData.length;k++){
                            let index = this.right.pointArr.findIndex((obj) =>{//this.right.pointArr，所有的问题点。
                                return obj.Id == this.ReferenceImageData[k].Id && this.ReferenceImageData[k].checked;
                            })
                            
                            if(index>=0){
                                this.$forceUpdate();
                                this.right.pointArr[index].checked = true;
                                this.$forceUpdate()
                                this.$nextTick(()=>{
                                    this.$set(this.right.pointArr[index],'checked',true);
                                    this.right.selectedIdList.push(this.right.pointArr[index].Id);
                                })
                                
                            }else{

                            }
                        }
                    }
                    this.reward.ruleList = [];
                    for(let item of this.right.pointArr){
                        if(item.checked && this.checkedOption.indexOf(item) == -1){
                            this.checkedOption.push(item)
                        }
                    }
                }
            }else{
                this.checkedOption = [];
                this.right.selectedIdList = [];
                for(let item of this.violation){
                    item.checked = false;
                    this.ruleForm.violationList = [];
                }
                this.right.pointArr = [];
                this.reward.ruleList = [];
                this.reward.selectRule = '';
                
            }
            this.isIndeterminate = false;
            for(let i=0;i<this.checkedOption.length;i++){
                let num = i+1;
                this.reward.ruleList.push({
                    Id:num,
                    optionVal:'选中'+ num + '项给奖励'
                });
            }
            this.rightCheckedPoint = [];
            for(let item of this.right.pointArr){
                this.rightCheckedPoint.push({
                    Id:item.Id,
                    Name:item.Name,
                    IsChecked:item.checked
                })
            }
        },
        /**
         * 删除参照图
         */
        beforeRemove(file, fileList) {
            // return this.$confirm(`确定要移除 ${ file.name }？`, '提示', {
            if (file && file.status==="ready" || file.status==="success") {
                return this.$confirm(`确定要移除参照图吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.ruleForm.fileList = [];
                })
            }
        },
        // selectedShowPoint(obj){
        //     this.currentObj = obj;
        // },
        itemChange(obj,index){
             this.currentObj = obj;
        },
        /**
         * 关闭参照图设置弹框
         */
        closePicDialog(){
            this.$emit('refreshPage',{type:1});
        },
        /**
         * 选择问题点
         */
        changeViolation(value) {
            this.reward.selectRule = '';
            
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.violation.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.violation.length;
            
            let violationList = this.ruleForm.violationList
            this.checkedOption = [];
            let temp = [];

            console.log(this.currentObj)
            if(this.currentObj.checked){
                let idx = this.right.pointArr.findIndex((ele) =>{
                    return ele.Id == this.currentObj.Id
                })
                if(idx>=0){
                    this.right.pointArr.splice(idx,1);
                }else{
                    this.$set(this.currentObj,'checked',false);
                    this.right.pointArr.push(this.currentObj);
                    let x = this.right.selectedIdList.findIndex((ele) =>{
                        return ele == this.currentObj.Id
                    })
                    if(x>=0){
                        this.right.selectedIdList.splice(x,1)
                    }
                }
            }else{
                let idx = this.right.pointArr.findIndex((ele) =>{
                    return ele.Id == this.currentObj.Id
                })
                if(idx>=0){
                    this.right.pointArr.splice(idx,1);
                }else{
                    this.$set(this.currentObj,'checked',false);
                    this.right.pointArr.push(this.currentObj);
                }
            }
                
            // if(this.title == '新增配置'){
            //     this.right.pointArr = [];
            //     if(violationList.length){
            //         for(let i=0; i<violationList.length;i++){
            //             this.violation.forEach((item,index) =>{
            //                 if(violationList[i] == item.Id){
            //                     item.checked = false;
            //                     this.right.pointArr.push(item)
            //                 }
            //             })
            //         }
            //     }
                
            // }else{
            //     console.log(this.currentObj)
            //     if(this.currentObj.checked){
            //         let idx = this.right.pointArr.findIndex((ele) =>{
            //             return ele.Id == this.currentObj.Id
            //         })
            //         if(idx>=0){
            //             this.right.pointArr.splice(idx,1);
            //         }else{
            //             this.$set(this.currentObj,'checked',false);
            //             this.right.pointArr.push(this.currentObj);
            //             let x = this.right.selectedIdList.findIndex((ele) =>{
            //                 return ele == this.currentObj.Id
            //             })
            //             if(x>=0){
            //                 this.right.selectedIdList.splice(x,1)
            //             }
            //         }
            //     }else{
            //         let idx = this.right.pointArr.findIndex((ele) =>{
            //             return ele.Id == this.currentObj.Id
            //         })
            //         if(idx>=0){
            //             this.right.pointArr.splice(idx,1);
            //         }else{
            //             this.$set(this.currentObj,'checked',false);
            //             this.right.pointArr.push(this.currentObj);
            //         }
            //     }
                
                
            // }

            for(let k=0;k<this.right.pointArr.length;k++){
                if(!this.right.pointArr[k].checked){
                    this.right.selectAll = false;
                    break;
                }
            }
            
            this.checkedOption = [];
            this.reward.ruleList = [];
            for(let item of this.right.selectedIdList){
                let y = this.right.pointArr.findIndex((obj) =>{
                    return obj.Id == item
                })
                if(y>=0){
                    this.checkedOption.push(this.right.pointArr[y]);
                }
            }
            for(let i=0;i<this.checkedOption.length;i++){
                let num = i+1;
                this.reward.ruleList.push({
                    Id:num,
                    optionVal:'选中'+ num + '项给奖励'
                });
            }
            //选中的正确的问题点--保存时用
            this.rightCheckedPoint = [];
            for(let ite of this.right.pointArr){
                this.rightCheckedPoint.push({
                    Id:ite.Id,
                    Name:ite.Name,
                    IsChecked:ite.checked
                })
            };
            if(this.right.selectedIdList.length == this.right.pointArr.length){
                this.right.selectAll = true
            }
            if(this.right.selectedIdList.length < this.right.pointArr.length && this.right.selectedIdList.length>0){
                this.right.selectAll = false;
                this.right.isIndeterminate = true;
            }
            if(this.right.selectedIdList.length < this.right.pointArr.length && this.right.selectedIdList.length==0){
                this.right.selectAll = false;
                this.right.isIndeterminate = false;
            }
            let rusult = this.right.pointArr.every((a) =>{
                return a.checked;
            })
            if(rusult){
                this.right.selectAll = true;
            }else{
                this.right.selectAll = false;
            }
        },
        handleSelectAllRight(val){
            this.reward.ruleList = [];
            let arr = [];
            arr = val ? this.right.pointArr : [];
            
            this.right.selectedIdList = [];
            for (var i = 0; i < arr.length; i++) {
                if (this.right.selectedIdList.indexOf(arr[i].Id) == -1) {
                    this.right.selectedIdList.push(arr[i].Id)
                }  
            }
 
            if(val){
                for(let item of this.right.pointArr){
                    item.checked = true;
                }
                this.checkedOption = this.right.pointArr;
                for(let i=0;i<this.checkedOption.length;i++){
                    let num = i+1;
                    this.reward.ruleList.push({
                        Id:num,
                        optionVal:'选中'+ num + '项给奖励'
                    });
                }
            }else{
                for(let item of this.right.pointArr){
                    item.checked = false;
                    this.right.selectedIdList = [];
                }
                this.checkedOption = [];
                this.reward.ruleList = [];
            }
            
            this.right.isIndeterminate = false;
            this.rightCheckedPoint = [];
            for(let item of this.right.pointArr){
                this.rightCheckedPoint.push({
                    Id:item.Id,
                    Name:item.Name,
                    IsChecked:item.checked
                })
            }
        },
        changeRightPoint(value){debugger;
            this.reward.selectRule = '';
            value = Array.from(new Set(value));
            this.right.selectedIdList = value;
            let checkedCount = value.length;
            let pointArr =this.right.pointArr;
            this.reward.ruleList = [];
            this.checkedOption = [];
            let rightIdList = [];
            if(this.title == '编辑配置'){
                if(this.checkedOption.length == 0){
                    this.right.isIndeterminate = false;
                    this.right.selectAll = false;
                }

                // for(let item of this.right.selectedIdList){
                //     let y = this.right.pointArr.findIndex((obj) =>{
                //         return obj.Id == item
                //     })
                //     if(y>=0){
                //         this.$forceUpdate()
                //         this.right.pointArr[y].checked = true;
                //         this.checkedOption.push(this.right.pointArr[y]);
                //     }
                // }
                for(let i=0;i<this.right.pointArr.length;i++){
                    let has = false;
                    for(let j=0;j<this.right.selectedIdList.length;j++){
                        if(this.right.selectedIdList[j]== this.right.pointArr[i].Id){
                            this.right.pointArr[i].checked = true;
                            has = true
                        }
                        if(!has){
                            this.right.pointArr[i].checked = false;
                        }
                    }
                    if(this.right.pointArr[i].checked){
                        this.checkedOption.push(this.right.pointArr[i])
                    }
                }
                
                
            }else{
                
                for(let j of this.right.selectedIdList){
                    let idx = this.right.pointArr.findIndex((obj) =>{
                        return obj.Id == j
                    })
                    if(idx>=0){
                        this.$forceUpdate();
                        this.$set(this.right.pointArr[idx],'checked',true);
                        this.right.pointArr[idx].checked = true;
                        this.checkedOption.push(this.right.pointArr[idx])
                    }
                    
                }

                // for(let ele of this.right.pointArr){
                //     if(ele.checked){
                //         this.checkedOption.push(ele)
                //     }
                // }
            }
            if(this.right.selectedIdList.length == this.right.pointArr.length){
                this.right.selectAll = true;
                this.right.isIndeterminate = false;
            }
            if(this.right.selectedIdList.length < this.right.pointArr.length && this.right.selectedIdList.length>0){
                this.right.selectAll = false;
                this.right.isIndeterminate = true;
            }
            if(this.right.selectedIdList.length < this.right.pointArr.length && this.right.selectedIdList.length==0){
                this.right.selectAll = false;
                this.right.isIndeterminate = false;
            }
            for(let i=0;i<this.checkedOption.length;i++){
                let num = i+1;
                this.reward.ruleList.push({
                    Id:num,
                    optionVal:'选中'+ num + '项给奖励'
                });
            }
            //选中的正确的问题点--保存时用
            this.rightCheckedPoint = [];
            for(let ite of pointArr){
                this.rightCheckedPoint.push({
                    Id:ite.Id,
                    Name:ite.Name,
                    IsChecked:ite.checked
                })
            }
            
        },
        
        /**
         * 保存参照图设置
         */
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                let data = {};
                if(this.title == "新增配置"){
                    data = {
                        "OperateRoom": this.ruleForm.operateRoom,
                        "ImageUrl": this.ruleForm.referenceImg,
                        "SubId": this.$utils.getUrlKey('userId'),
                        //"ViolationsIdList": this.ruleForm.violationList,
                        "ViolationsList":this.rightCheckedPoint,
                        "RewardRule":this.reward.selectRule
                    }
                }else{
                    let ImageUrl = '';
                    if(this.isNewUpload){
                        ImageUrl = this.ruleForm.referenceImg;
                    }else{
                        ImageUrl = this.ruleForm.fileList[0].url
                    }
                    data = {
                        "Id": this.Id,
                        "OperateRoom": this.ruleForm.operateRoom,
                        "ImageUrl": ImageUrl,//this.ruleForm.fileList[0].url,
                        "SubId": this.$utils.getUrlKey('userId'),
                        "ViolationsList":this.rightCheckedPoint,
                        "RewardRule":this.reward.selectRule
                    }
                }debugger;
                this.$api.SaveReferenceImage(data).then(res =>{
                    if(res.IsSuccess){
                        this.message(res.Message==null || res.Message ==''?'保存成功':res.Message,1);
                        this.$emit('refreshPage',{type:2});
                        this.ruleForm.violationList = [];
                        this.checkAll = false;
                    }else{
                        this.message(res.Message==null || res.Message ==''?'保存失败':res.Message,-1);
                    }
                }).catch(error=>{

                })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
    }
}
</script>
<style scoped type="text/scss" lang='scss'>
    
</style>
<style lang="scss">
.picConfig{
    height:100%;
    .unUpload{
        height:60px;
        position: absolute;
        z-index:1;
    }
    .el-upload-list{
        width:200px;
        height:200px;
    }
    .el-upload-list--picture .el-upload-list__item{
        height:200px
    }
    .el-upload-list__item is-ready{
        position:relative;
    }
    .el-upload-list--picture .el-upload-list__item-thumbnail{
        width:160px;
        height:160px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
    .el-upload-list__item-name{
        display: none !important;
    }
    .formBtn .el-form-item__content{
        margin-left:0 !important;
    }
    .onImport{
        position: absolute;
        z-index: 2;
        left: 0px;
        top: 11px;
        height: 30px;
    }
    
    .violation-box{
        max-height:200px;
        overflow-y:auto;
    }
}
</style>
<style lang="scss">
    .picConfig{
        
        .el-checkbox{
            line-height:20px  !important;
        }
        .ruleForm{
            height:100%;
        }
        .btn-box .el-form-item__content{
            margin-left:0 !important;
           
                
                div{
                    text-align:center;
                    margin-top:60px;
                }
            }
            //text-align: center;
            //position: fixed;
            //margin-bottom: 35px;
            //width: calc(100% - 60px);
        }
    
    
</style>