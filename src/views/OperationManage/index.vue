<template>
    <!--| 运营管理 |-->
    <div class='OperationManage'>
        <div class='itemBox'  :class='{isActive:setObj.ConfigValue}'>
            <div>
                <p class='title'>用户标签选择</p>
                <p class='message'>开启选择，用户在注册app后，可以直接跳转到选择标签页面。</p>
            </div>
            <el-switch v-model="setObj.ConfigValue" 
            active-color="#13ce66"
            :active-value='1'
            :inactive-value='0'
            @change="tagsChangeHandler"
            >
            </el-switch>
        </div>
    </div>
</template>


<script src='./OperationManage.js'></script>

<style lang='scss' scoped>
.OperationManage{
    padding: 10px;
    .itemBox{
        background-color: rgba(233,242,253,.5);
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 76px;
        padding: 0 20px;
        transition: all 0.5s;
        .title{
            font-size: 17px;
            margin-bottom: 10px;
            color: #333;
        }
        .message{
            color: #999;
            font-size: 14px;
        }
    }
    .isActive{
        background-color: #e9f2fd;
    }
}
</style>