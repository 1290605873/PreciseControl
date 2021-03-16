<template>
    <div class="main" v-title data-title="风险监管">
        <div style="height: 40px;background: #f0f0f0;line-height: 40px;padding-left: 10px">
            <span style="font-size: 0.8rem;font-weight:bold;">区域：</span><span style="font-size: 0.7rem" >鄂尔多斯市-准格尔旗-薛家湾镇</span>
            <span style="margin-left: 10px;font-size: 0.8rem;font-weight:bold;">业态：</span><span style="font-size: 0.7rem">小作坊</span>
        </div>
        <div style="height: 30px;line-height: 30px;margin-left: 10px;margin-top: 5px">
            <span style="font-weight: bold;font-size: 0.8rem">风险统计</span>
            <span style="padding-left: 5px;font-size: 0.7rem">2020年1月1日-1月31日</span>
            <span style="float: right;padding-left: 5px;font-size: 0.7rem;margin-right: 15px">256家</span><span style="float: right;font-weight: bold;font-size: 0.8rem">主体责任数：</span>
        </div>
        <div class="downdate">
            <div class="pingfen">
                <div class="topitemvalue black eightfont boldfont">356</div>
                <div class="topitemtext black eightfont ">风险点</div>
            </div>
            <div class="pingfen">
                <div class="topitemvalue warn eightfont boldfont">8</div>
                <div class="topitemtext warn eightfont ">风险警告</div>
            </div>
            <div class="pingfen">
                <div class="topitemvalue danger eightfont boldfont">3</div>
                <div class="topitemtext danger eightfont ">风险报警</div>
            </div>
            <div class="pingfen">
                <div class="topitemvalue black eightfont boldfont ">65</div>
                <div class="topitemtext black eightfont ">自查</div>
                <div class="topitemtext black eightfont " style="margin-top: 0">不合格</div>
            </div>
            <div class="pingfen">
                <div class="topitemvalue black eightfont boldfont">18</div>
                <div class="topitemtext black eightfont " >巡查</div>
                <div class="topitemtext black eightfont " style="margin-top: 0">不合格</div>
            </div>
        </div>
        <div style="height: 30px;line-height: 30px;font-size: .8rem;font-weight: bold;margin-left: 10px;margin-top: 8px"><span>风控统计</span></div>
        <div class="datasheader">
            <div class="headeritem" >
                <span class="tableheadercontent">单位名称</span>
            </div>
            <div class="headeritem halfwide">
                <span class="tableheadercontent">风险等级</span>
            </div>
            <div class="headeritem">
                <span class="tableheadercontent">自查情况（日查）</span>
            </div>
            <div class="headeritem">
                <span class="tableheadercontent">所巡查情况（月查）</span>
            </div>
            <div class="headeritem">
                <span class="tableheadercontent">区巡查情况（季查）</span>
            </div>
            <div class="headeritem">
                <span class="tableheadercontent">市巡查情况（年查）</span>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem  paddingleft5"   >
                <span class="tablecontent danger ">蒙牛肉干生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide">
                <span class="tablecontent ">D</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor"  :to="{path:'/zicha'}">自查6次</router-link>
                <div  class="danger margintop5px">不合格5次</div>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha',params: {id: 'm'}}">巡查2次</router-link>
                <div  class="danger margintop5px">不合格1次</div>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha',params: {id: 'q'}}">巡查1次</router-link>
                <div  class="danger margintop5px">不合格1次</div>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha',params: {id: 'y'}}">巡查1次</router-link>
                <div  class="danger margintop5px">不合格1次</div>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem paddingleft5"   >
                <span class="tablecontent danger ">黄桃罐头生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide">
                <span class="tablecontent ">D</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/zicha'}">自查16次</router-link>
                <div  class="danger margintop5px">不合格4次</div>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha'}">巡查3次</router-link>
                <div  class="danger margintop5px">不合格1次</div>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
                <div  class="danger margintop5px">不合格1次</div>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
                <div  class="danger margintop5px">不合格1次</div>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem paddingleft5"   >
                <span class="tablecontent danger ">山楂蛋糕生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide">
                <span class="tablecontent ">D</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/zicha'}">自查15次</router-link>
                <div  class="danger margintop5px">不合格3次</div>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha'}">巡查3次</router-link>
                <div  class="danger margintop5px">不合格1次</div>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
                <div  class="danger margintop5px">不合格1次</div>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
                <div  class="danger margintop5px">不合格1次</div>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem paddingleft5"   >
                <span class="tablecontent  ">内蒙羊油生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide" >
                <span class="tablecontent">B</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/zicha'}">自查15次</router-link>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha'}">巡查3次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查2次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem paddingleft5"   >
                <span class="tablecontent  ">黄桃罐头生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide">
                <span class="tablecontent ">C</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/zicha'}">自查16次</router-link>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha'}">巡查3次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查0次</router-link>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem paddingleft5"   >
                <span class="tablecontent  ">山楂蛋糕生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide">
                <span class="tablecontent ">C</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/zicha'}">自查16次</router-link>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha'}">巡查3次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查0次</router-link>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem paddingleft5"   >
                <span class="tablecontent  ">大香蕉油生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide">
                <span class="tablecontent ">D</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/zicha'}">自查16次</router-link>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha'}">巡查3次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查2次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem paddingleft5"   >
                <span class="tablecontent  ">苹果罐头生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide">
                <span class="tablecontent ">C</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/zicha'}">自查16次</router-link>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha'}">巡查3次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查0次</router-link>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem paddingleft5"   >
                <span class="tablecontent  ">山楂罐头生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide">
                <span class="tablecontent ">C</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/zicha'}">自查16次</router-link>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha'}">巡查3次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查0次</router-link>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem paddingleft5"   >
                <span class="tablecontent  ">红柿罐头生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide">
                <span class="tablecontent ">A</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/zicha'}">自查16次</router-link>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha'}">巡查3次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查0次</router-link>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem paddingleft5"   >
                <span class="tablecontent  ">牛奶蛋糕生产有限公司</span>
            </div>
            <div class="tablerowitem halfwide">
                <span class="tablecontent ">C</span>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/zicha'}">自查16次</router-link>
            </div>
            <div class="tablerowitem" >
                <router-link class="tablecontent clickcolor " :to="{path:'/xuncha'}">巡查3次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查1次</router-link>
            </div>
            <div class="tablerowitem">
                <router-link class="tablecontent clickcolor" :to="{path:'/xuncha'}">巡查0次</router-link>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        props: '',
        computed: {},
        methods: {
        },
        beforeCreated() {

        },
        created() {

        },
        mounted() {

        },
        components: {}
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .main{
        font-size: 0.1rem;
        .downdate {
            margin-left: 15px;
            margin-right: 15px;
            display: flex;
            flex-direction: row;
            text-align: center;
            margin-top: 10px;
            box-shadow: 0 0 10px #eee;
            padding: 10px 0
        }

        .pingfen {
            flex: 1;
            border-right: 1px solid #EEEEEE
        }
        .topitemvalue {
            color: #2F3856;
            font-weight: 500;
        }

        .topitemtext {
            margin-top: 10px;
            font-weight: 500;
            color: #5E637B;
            font-size: 1rem;
        }
        .datasheader {
            /*height: 40px;*/
            color: black !important;
            background: #fdedd2 !important;
            font-weight: bold;
            /*line-height: 40px;*/
            /*overflow: hidden;*/
            font-size: 0.7rem;
            width: 100%;
            display: flex;
            flex-direction: row;
            text-align: center;

        }

        .tablerowwrap {
            width: 100%;
            display: flex;
            flex-direction: row;
            text-align: center;
            background: #f1f1f1;
            /*border:0.01rem solid #EEEEEE;*/
        }

        .headeritem {
            flex: 1;
            /*height: 40px;*/
            /*line-height: 40px;*/
            padding: 15px 0;

        }
        .tablecontent {
            color: #2F3856;
            font-size: .7rem;
            /*overflow: hidden;*/
            /*text-overflow: ellipsis;*/
            /*white-space: nowrap;*/
        }
        .tablerowitem{
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-top: 15px;
        }
        .danger{
            color: #d50000;
        }
        .warn{
            color: #F4AC34;
        }
        .margintop10px{
            margin-top: 10px;
        }
        .margintop5px{
            margin-top: 5px;
        }
        .clickcolor{
            color: #67A2EC;
        }
        .halfwide
        {
            flex: 0.5;
        }
        .boldfont{
            font-weight: bold;
        }
        .eightfont{
            font-size: .8rem;
        }
        .blackfont{
            color: black;
        }
        .paddingleft5{
            padding-left: 5px;
        }
    }

</style>