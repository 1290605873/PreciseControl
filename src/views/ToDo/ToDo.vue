<template>
    <div class="page" v-title data-title="风险待办">
        <div class="toparea">
            <span class="date">2020/01</span>
            <span class="riqi">日期</span>
        </div>
        <div class="downdate">
            <div class="pingfen">
                <div class="topitemvalue">10</div>
                <div class="topitemtext">风险类</div>
            </div>
            <div class="pingfen">
                <div class="topitemvalue">50</div>
                <div class="topitemtext">风险对象</div>
            </div>
            <div class="pingfen">
                <div class="topitemvalue">合格</div>
                <div class="topitemtext">风险状态</div>
            </div>
            <div class="pingfen">
                <div class="topitemvalue">500</div>
                <div class="topitemtext">完成检测</div>
            </div>
        </div>

        <div class="jinridaiban">今日代办</div>
        <div class="datasheader">
            <div class="headeritem">
                <span class="tableheadercontent">风险类</span>
            </div>
            <div class="headeritem">
                <span class="tableheadercontent">风险对象</span>
            </div>
            <div class="headeritem">
                <span class="tableheadercontent">风险监测点</span>
            </div>
            <div class="headeritem">
                <span class="tableheadercontent">完成状态</span>
            </div>
            <div class="headeritem">
                <span class="tableheadercontent">风险处理</span>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem">
                <span class="tablecontent">压力容器</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">201压力管道</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">有无异常震动</span>
            </div>
            <div class="tablerowitem" >
                <span class="tablecontent" style="text-align: right">正常</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent daiban">待办检查</span>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem">
                <span class="tablecontent">压力容器</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">205压力表</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">实验指针有无归零</span>
            </div>
            <div class="tablerowitem" >
                <span class="tablecontent">正常</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent daiban">待办检查</span>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem">
                <span class="tablecontent">压力容器</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">301温度计</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">指针有无掉落</span>
            </div>
            <div class="tablerowitem" >
                <span class="tablecontent">正常</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent daiban">待办检查</span>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem">
                <span class="tablecontent">压力容器</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">接口阀门</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">过热</span>
            </div>
            <div class="tablerowitem" >
                <span class="tablecontent">正常</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent daiban">待办检查</span>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem">
                <span class="tablecontent">压力容器</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">保温层</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">有无破损</span>
            </div>
            <div class="tablerowitem" >
                <span class="tablecontent">正常</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent daiban">待办检查</span>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem">
                <span class="tablecontent">压力容器</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">测温仪表</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">检查和校验</span>
            </div>
            <div class="tablerowitem" >
                <span class="tablecontent">正常</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent daiban">待办检查</span>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem">
                <span class="tablecontent">压力容器</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">203压力管道</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">过热</span>
            </div>
            <div class="tablerowitem" >
                <span class="tablecontent">正常</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent daiban">待办检查</span>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem">
                <span class="tablecontent">压力容器</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">排水(气)阀</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">阀门管道有无泄漏</span>
            </div>
            <div class="tablerowitem" >
                <span class="tablecontent">正常</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent daiban">待办检查</span>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem">
                <span class="tablecontent">压力容器</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">焊接接头</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">有无裂纹</span>
            </div>
            <div class="tablerowitem" >
                <span class="tablecontent">正常</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent daiban">待办检查</span>
            </div>
        </div>

        <div style="color: #2F3856;margin-left:15px;font-size: 1.1rem;font-weight: bold;margin-top: 15px;margin-bottom: 10px">其他任务</div>
        <div class="datasheader" style="width: 100%;display: flex;flex-direction: row;">
            <div class="tablerowitem">
                <div class="tableheadercontent">风险类</div>
            </div>
            <div class="tablerowitem">
                <div class="tableheadercontent">风险对象</div>
            </div>
            <div class="tablerowitem">
                <div class="tableheadercontent">风险监测点</div>
            </div>
            <div class="tablerowitem">
                <div class="tableheadercontent">完成状态</div>
            </div>
            <div class="tablerowitem">
                <div class="tableheadercontent">风险处理</div>
            </div>
        </div>
        <div  class="tablerowwrap">
            <div class="tablerowitem">
                <span class="tablecontent">压力容器</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">本体</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent">泄露</span>
            </div>
            <div class="tablerowitem" >
                <span class="tablecontent">正常</span>
            </div>
            <div class="tablerowitem">
                <span class="tablecontent daiban">待办检查</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        created() {
            document.title = ''
        },
        mounted: function () {


        },
        methods: {}
    }

</script>
<style scoped lang="scss" type="text/scss">

    .page {
        width: 100%;
        margin: 0 auto;
        height: 100%;
        overflow-y: scroll;
        .toparea {
            margin-top: 15px;
            padding: 0 15px;

            .date {
                color: #2F3856;
                ont-weight: 500
            }

            .riqi {
                float: right;
                color: #2F3856;
                font-weight: 400
            }
        }

        .downdate {
            margin-left: 15px;
            margin-right: 15px;
            display: flex;
            flex-direction: row;
            text-align: center;
            margin-top: 10px;
            box-shadow: 0 0 10px #eee;
            padding: 20px 0
        }

        .pingfen {
            flex: 1;
            border-right: 1px solid #EEEEEE
        }

        .jinridaiban {
            color: #2F3856;
            margin-left: 15px;
            font-size: 1.1rem;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 10px
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

        .tableheadercontent {
            font-size: 0.8rem;
            color: #FF6A34;
            height: 40px;
            line-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .tablecontent {
            color: #2F3856;
            height: 40px;
            line-height: 40px;
            font-weight: 400;
            font-size: .7rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .daiban {
            color: #428BFE;
        }

        .datasheader {
            height: 40px;
            color: rgba(255, 106, 52, 1) !important;
            background: rgba(255, 106, 52, 0.06) !important;
            font-weight: 500;
            line-height: 40px;
            overflow: hidden;
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
            /*border:0.01rem solid #EEEEEE;*/
        }

        .headeritem {
            flex: 1;
            height: 40px;
            line-height: 40px;

        }
        .tablerowitem{
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .main {
            font-size: .1rem;
        }
        .zhengchang{
            text-align: right;
            margin-right: 10px;
        }
    }


</style>