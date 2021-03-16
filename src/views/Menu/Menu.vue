<template>
    <div class="menu">
        <div>
            <h3>业务基础设置</h3>
            <p></p>
            <div class="item">
                <router-link to="/checkItemLibrary" id="checkItemLibrary">
                    检查项目库
                </router-link>
            </div>
            <div class="item">
                <router-link to="/TaskPerSetting" id="TaskPerSetting">
                    业务指定权限设置
                </router-link>
            </div>

            <div class="item">
                <router-link to="/businessType" id="businessType">
                    业务类型设置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/checkImportanceDegree" id="checkImportanceDegree">
                    检查项重要程度
                </router-link>
            </div>
            <div class="item">
                <router-link to="/meshUserSetting" id="meshUserSetting">
                    网格人员权限管理
                </router-link>
            </div>
            <div class="item">
                <router-link to="/EnforcementVoucher" id="EnforcementVoucher">
                    执法凭证单
                </router-link>
            </div>
            <div class="item">
                <router-link to="/LawEnforcementSealManagement" id="LawEnforcementSealManagement">
                    执法章管理
                </router-link>
            </div>


        </div>
        <!--》》》》》》》》》》》》》》》》-->
        <div class="clear">
            <h3>巡查业务设置</h3>
            <p></p>
            <div class="item">
                <router-link to="/patrolStatusSetting" id="patrolStatusSetting">
                    执法状态设置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/ExaminationResult" id="ExaminationResult">
                    检查结果设置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/ProcessingResult" id="ProcessingResult">
                    结果处理设置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/EnforcementResult" id="EnforcementResult">
                    执法结果设置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/CheckitemSettings" id="CheckitemSettings">
                    巡查项业务库属性设置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/Checkitemresultsetting" id="Checkitemresultsetting">
                    检查项结果配置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/InspectionFiveSettings" id="InspectionFiveSettings">
                    巡查五定设置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/PatrolLawEnforcement" id="PatrolLawEnforcement">
                    巡查执法处理
                </router-link>
            </div>
            <div class="item">
                <router-link to="/FivePosition" id="FivePosition">
                    五定配置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/CheckReportShare" id="CheckReportShare">
                    自查报告分享
                </router-link>
            </div>
            <div class="item">
                <router-link to="/patrolManagementSettings" id="patrolManagementSettings">
                    自查报告分享
                </router-link>
            </div>
        </div>


        <!--》》》》》》》》》》》》》》》》-->
        <div class="clear">
            <h3>自查业务设置</h3>
            <p></p>
            <!--<div class="item">-->
            <!--<router-link to="/CheckProSettings" id="CheckProSettings">-->
            <!--检查项目设置-->
            <!--</router-link>-->
            <!--</div>-->
            <div class="item">
                <router-link to="/SelfcheckingSetting" id="SelfcheckingSetting">
                    自查项业务库属性设置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/Statussettings" id="Statussettings">
                    门店状态显示设置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/PCbackground" id="PCbackground">
                    pc后台
                </router-link>
            </div>
        </div>


        <!--》》》》》》》》》》》》》》》》-->
        <div class="clear">
            <h3>其他业务</h3>
            <p></p>
            <div class="item">
                <router-link to="/patrolManagement" id="patrolManagement">
                    巡检管理
                </router-link>
            </div>
            <div class="item">
                <router-link to="/selfCheckManagement" id="selfCheckManagement">
                    自改自检管理
                </router-link>
            </div>
            <div class="item">
                <router-link to="/CheckResultsListManagement" id="CheckResultsListManagement">
                    检查结果汇总管理
                </router-link>
            </div>
            <div class="item">
                <router-link to="/electronicManagement" id="electronicManagement">
                    电子巡查
                </router-link>
            </div>
            <!--<div class="item">-->
                <!--<router-link to="/electronicManagement" id="electronicManagement">-->
                    <!--电子管理-->
                <!--</router-link>-->
            <!--</div>-->
            <div class="item">
                <router-link to="/BusinessSettings" id="BusinessSettings">
                    业务设置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/AIpatrol" id="AIpatrol">
                    AI巡查管理
                </router-link>
            </div>
            <div class="item">
                <router-link to="/Relatedirregularities" id="Relatedirregularities">
                    关联违规项
                </router-link>
            </div>
            <div class="item">
                <router-link to="/WhiteListManagement" id="WhiteListManagement">
                    大屏白名单
                </router-link>
            </div>
            <div class="item">
                <router-link to="/Largescreenpermission" id="Largescreenpermission">
                    大屏使用权限
                </router-link>
            </div>
        </div>
        <div class="clear">
            <h3>地图配置</h3>
            <p></p>
            <div class="item">
                <router-link to="/MapConfigPlat" id="MapConfigPlat">
                    地图配置
                </router-link>
            </div>
            <div class="item">
                <router-link to="/ApplicationComponent" id="ApplicationComponent">
                    应用组件配置
                </router-link>
            </div>
        </div>
        <!-- 》》》》》》》》》》》》》》》》 -->
        <div class="clear">
          <h3>all</h3>
          <div class="item" v-for="i in routerList">
            <router-link :to="i.path">
              {{i.name}}
            </router-link>
          </div>
        </div>
    </div>
</template>
<script>
    import path from 'path'
    import TagsView from '@/components/TagsView.vue';
    import { constantRouterMap } from '@/router/index'
    export default {
        components: {
            TagsView
        },
        data() {
          return {
            routerList:[]
          }
        },
        created() {
            this.setUrlpParam();
            this.routerList = constantRouterMap
        },
        methods: {
            setUrlpParam() {
                this.$store.dispatch('addAppId', this.$utils.getUrlKey("appId"));
                this.$store.dispatch('addUserId', this.$utils.getUrlKey("userId"));
                this.$store.dispatch('addOrgID', this.$utils.getUrlKey("curChangeOrg"));
            }
        }
    }
</script>
<style type="text/scss" scoped lang="scss">
    .menu {
        padding: 20px 0 0 40px;
        .item {
            width: 120px;
            height: 120px;
            border: 1px solid #E8E8E8;
            background: #f1f1f1;
            float: left;
            margin-right: 100px;
            cursor: pointer;
            margin-bottom: 20px;
            a {
                box-sizing: border-box;
                padding-top: 86px;
                display: inline-block;
                width: 100%;
                height: 100%;
                text-align: center;
                font-size: 14px;
                color: #757575;
                background: url("../../assets/images/CheckProSettings.png");
                background-repeat: no-repeat;
                /*background-size: contain;*/
                background-position-x: center;
                background-position-y: 20px;
            }
        }
        p {
            width: 90%;
            border-bottom: 1px solid #e8e8e8;
            margin-bottom: 20px;
        }
        h3 {
            font-weight: normal;
            font-size: 16px;
            color: #000000;
            line-height: 16px;
            margin-bottom: 20px;
        }
        .clear {
            clear: both;
        }
    }


</style>
