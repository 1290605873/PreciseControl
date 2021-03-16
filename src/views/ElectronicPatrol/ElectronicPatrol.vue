<template>
    <div class="main-container ElectronicPatrol">
        <el-form inline style="margin-bottom: 10px">
            <el-form-item label-width="80px">
                <el-input
                        clearable
                        class="normalW"
                        type="text" maxlength="20"
                        v-model="company"
                        placeholder="被巡查单位">
                </el-input>
            </el-form-item>
            <el-form-item label-width="80px">
                <el-input
                        class="normalW"
                        type="text" maxlength="20"
                        v-model="street"
                        placeholder="所属街道">
                </el-input>
            </el-form-item>
            <el-form-item label-width="80px">
                <el-input
                        class="normalW"
                        type="text" maxlength="20"
                        v-model="community"
                        placeholder="所属社区">
                </el-input>
            </el-form-item>
            <el-form-item label-width="80px">
                <el-select class="normalW"
                           placeholder="状态"
                           v-model="status"
                           clearable
						   :filterable="statuses.length > 7"
                >
                    <el-option
                            v-for="item in statuses"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label-width="80px">
                <el-date-picker
                        class="normalW"
                        v-model="StartTime"
                        type="date"
                        clearable
                        value-format="yyyy-MM-dd"
                        placeholder="开始日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item abel-width="80px">
                <el-date-picker
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions1"
                        class="normalW"
                        v-model="EndTime"
                        type="date"
                        clearable
                        placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" style="margin-left: 10px" @click="queryGrid">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
                v-loading="mainGridTable.Loading"
                :data="mainGridTable.list"
                border
                height="200px"
                fit
                highlight-current-row
                class="table">
            <el-table-column type="index" width="40" align="center"></el-table-column>
            <el-table-column label="被巡查单位" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.StoreName"></span>
                </template>
            </el-table-column>
            <el-table-column label="巡查时间" min-width="90px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.InspectDate"></span>
                </template>
            </el-table-column>
            <el-table-column label="巡查地址" min-width="180px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.Location==null?'':scope.row.Location"></span>
                </template>
            </el-table-column>
            <el-table-column label="所属街道" min-width="120px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.LocationName==null?'':scope.row.LocationName"></span>
                </template>
            </el-table-column>
            <el-table-column label="所属社区" min-width="120px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.CommunityName"></span>
                </template>
            </el-table-column>
            <el-table-column label="巡查人员" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.EnforceUserName"></span>
                </template>
            </el-table-column>
            <el-table-column label="详情" min-width="80px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <!--<span v-text="scope.row.cell[6]"></span>-->
                    <el-button size="mini" type="primary" @click="details(scope.row)">详情</el-button>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="70px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.Status==0">未处理</span>
                    <span v-else-if="scope.row.Status==1">已通告</span>
                    <span v-else-if="scope.row.Status==2">已整改</span>
                    <span v-else>未整改</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.Status==2" size="mini" type="primary" @click="Announcement(scope.row)">通告</el-button>
                    <el-button :disabled="scope.row.Status==2" size="mini" type="primary" @click="reView(scope.row)">复查</el-button>
                </template>
            </el-table-column>

        </el-table>
        <pagination ref="pagination_show"
                    :total="pageTotal"
                    :page.sync="pageIndex"
                    :limit.sync="pageSize"
                    @pagination="pageNation">
        </pagination>
        <el-dialog
                class="publishSelfCheckTaskDialog"
                :title="storeInfomationDialog.title"
                :visible.sync="storeInfomationDialog.show"
                width="50%"
                top="30vh"
                v-if="storeInfomationDialog.show"
                :close-on-click-modal="false">
            <div>
                <el-form>
                    <el-form-item label-width="80px" label="单位名称">
                        <span v-text="storeInfomationDialog.companyName"></span>
                    </el-form-item>
                    <el-form-item label-width="80px" label="门店名称">
                        <span v-text="storeInfomationDialog.storeName"></span>
                    </el-form-item>
                    <el-form-item label-width="80px" label="法人">
                        <span v-text="storeInfomationDialog.LeaderName"></span>
                    </el-form-item>
                    <el-form-item label-width="80px" label="联系方式">
                        <div v-for=" (item,indexx) in storeInfomationDialog.LinkTel" :key="indexx" v-text="item"></div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                  <el-button @click="storeInfomationDialog.show = false">取消</el-button>
                  <el-button type="primary" @click="tongGao()">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog
                :title="detailsDialog.title"
                :visible.sync="detailsDialog.show"
                width="80%"
                top="15vh"
                v-if="detailsDialog.show"
                :close-on-click-modal="false">
            <div class="maxDialog">
                <p v-text="detailsDialog.patrolTime" style="font-size: 16px"></p>
                <div style="background: rgb(217, 236, 255);height: 1px;margin-bottom: 4px"></div>
                <el-form inline>
                    <el-form-item v-for="item in detailsDialog.pics" style="text-align: center">
                        <img :src="item" style="width: 300px;height:240px;border-radius: 4px">
                        <p style="padding: 0;margin: 0" v-text="detailsDialog.Remark"></p>
                    </el-form-item>
                    <el-form-item v-for="ite in detailsDialog.videos">
                        <div style="width: 300px;height: 240px">
                            <video-player class="video-player vjs-custom-skin"
                            ref="videoPlayer"
                            :playsinline="true"
                            :options="ite.playerOptions"
                            >
                            </video-player>
                        </div>

                    </el-form-item>
                </el-form>
                <p style="font-size: 16px">巡查记录</p>
                <div style="background: rgb(217, 236, 255);height: 1px;margin-bottom: 4px"></div>
                <div v-for="itemm in detailsDialog.detailsLogs" :key="itemm.StoreId">
                    <p style="font-size: 16px" v-text="itemm.SubDate"></p>
                    <el-form inline>

                        <el-form-item v-for="item in itemm.picArr">
                            <img :src="item" style="width: 300px;height:240px;border-radius: 4px">
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>
        <el-dialog
                :title="reviewDialog.title"
                :visible.sync="reviewDialog.show"
                width="80%"
                top="15vh"
                v-if="reviewDialog.show"
                :close-on-click-modal="false">
            <div class="maxDialog">
                <p v-text="detailsDialog.patrolTime" style="font-size: 16px"></p>
                <div style="background: rgb(217, 236, 255);height: 1px;margin-bottom: 4px"></div>
                <el-form inline>
                    <el-form-item v-for="item in detailsDialog.pics" style="text-align: center">
                        <img :src="item" style="width: 300px;height:240px;border-radius: 4px">
                        <p style="padding: 0;margin: 0" v-text="detailsDialog.Remark"></p>
                    </el-form-item>
                    <el-form-item v-for="ite in detailsDialog.videos">
                        <div style="width: 300px;height: 240px">
                            <video-player class="video-player vjs-custom-skin"
                            ref="videoPlayer"
                            :playsinline="true"
                            :options="ite.playerOptions"
                            >
                            </video-player>
                        </div>
                    </el-form-item>
                </el-form>
                <p v-if="reviewDialog.cameras.length>0" style="font-size: 16px">直播视频</p>
                <div v-if="reviewDialog.cameras.length>0" style="background: rgb(217, 236, 255);height: 1px;margin-bottom: 4px"></div>
                <el-select
                        v-if="reviewDialog.cameras.length>0"
                        class="normalW"
                        placeholder="摄像头切换"
                        v-model="reviewDialog.titleCode"
                        @change="changeCamera"
						:filterable="reviewDialog.cameras.length > 7"
                >
                    <el-option
                            v-for="item in reviewDialog.cameras"
                            :key="item.EquipmentId"
                            :label="item.EquipmentTitle"
                            :value="item.liveUrlHttp">
                    </el-option>
                </el-select>
                <el-button v-if="reviewDialog.cameras.length>0" type="primary" style="margin-left: 10px" @click="captureImage">截图</el-button>
                <div style="text-align: center;width: 50%" v-if="reviewDialog.cameras.length>0">
                    <video-player id="liveVideo"
                                  style="margin-top: 10px"
                                  class="video-player vjs-custom-skin"
                                  :playsinline="true"
                                  :options="reviewDialog.playerOptions"
                    >
                    </video-player>
                </div>
                <el-form inline style="margin-top: 15px">
                    <el-form-item ref="imageCut" v-for="ite in reviewDialog.imageCut">
                        <img :src="ite" style="width: 150px;border-radius: 4px">
                    </el-form-item>
                </el-form>
                <el-form>
                    <el-form-item label="是否整改">
                        <el-radio v-model="reviewDialog.IsReformed" :label="true">已整改</el-radio>
                        <el-radio v-model="reviewDialog.IsReformed" :label="false">未整改</el-radio>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                  <el-button @click="reviewDialog.show = false">取消</el-button>
                  <el-button type="primary" @click="reViewSure">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '../../components/Pagination';
    import {videoPlayer} from 'vue-video-player';

    export default {
        components: {
            Pagination,
            videoPlayer,
        },
        data() {
            return {
                pageTotal: 0,
                pageIndex: 1,
                company: '',
                street: '',
                community: '',
                startTime: '',
                endTime: '',
                status: '',
                pageSize: 20,
                statuses: [
                    {
                        name: '未处理',
                        code: '0'
                    }, {
                        name: '已通告',
                        code: '1'
                    }, {
                        name: '已整改',
                        code: '2'
                    },
                ],
                StartTime: '',
                EndTime: '',
                pickerOptions1: { //限制结束时间
                    disabledDate: (time) => {
                        let timeStr = new Date(this.StartTime.replace(/-/g, '/'));
                        return time.getTime() < timeStr;
                    }
                },
                mainGridTable: { //主列表
                    Loading: false,
                    list: [],
                    total: 0,
                },
                storeInfomationDialog: {
                    show: false,
                    storeName: '',
                    companyName: '',
                    LeaderName: '',
                    LinkTel: [],
                    rowId: '',
                    title:''
                },
                detailsDialog: {
                    show: false,
                    pics: [],
                    patrolTime: '',//巡查具体时间
                    Remark: '',
                    videos: [],
                    title: '',
                    poster: require('../../assets/images/face.png'),
                    detailsLogs: []//巡查日志
                },
                reviewDialog: {
                    show: false,
                    pics: [],
                    videos: [],
                    title: '',
                    poster: require('../../assets/images/face.png'),
                    patrolTime: '',//巡查具体时间
                    Remark: '',
                    cameras: [],
                    titleCode: '',
                    playerOptions: null,
                    imageCut: [],
                    imageCutFileServe: [],
                    IsReformed: true,//是否整改
                    rowId: ''
                }
            }
        },
        methods: {
            pageNation() {
                this.initGrid();
            },
            details(row) {
                this.detailsDialog.show = true;
                this.detailsDialog.title = '详情-(' + row.StoreName + ')';
                this.getDetails(row.Id, true);
            },
            Announcement(row) {
                this.storeInfomationDialog.storeName = '';
                this.storeInfomationDialog.companyName = '';
                this.storeInfomationDialog.LeaderName = '';
                this.storeInfomationDialog.LinkTel = '';
                this.storeInfomationDialog.show = true;
                // this.tongGao(row.Id, row.Status);
                this.storeInfomationDialog.rowId = row.Id;
                this.getStoreInfo(row.StoreId);
                this.storeInfomationDialog.title = '详情-(' + row.StoreName + ')';
            },
            queryGrid() {
                this.pageNo = 1;
                this.initGrid();
            },
            initGrid() {
                let data = {
                    "PageNo": this.pageIndex,
                    "PageSize": this.pageSize,
                    "State": this.status,
                    "StoreName": this.company,
                    "CommunityName": this.community,
                    "LocationName": this.street,
                    "StartTime": this.StartTime,
                    "EndTime": this.endTime,
                };
                this.$api.GetElectGridDataInfo(data).then(res => {
                    if (res && res.IsSuccess) {
                        this.mainGridTable.list = res.Content;
                        this.pageTotal = res.Data;
                    }
                }).catch(r => {

                })
            },
            getDetails(id, toDetail) {
                let data = {
                    "Id": id
                };
                this.detailsDialog.pics = [];
                this.detailsDialog.videos = [];
                this.$api.GetElectPatrolDataDetail(data).then(res => {
                    if (res && res.IsSuccess) {
                        this.detailsDialog.patrolTime = res.Content.InspectDate;
                        this.detailsDialog.Remark = res.Content.Remark;
                        if (res.Content.Pics != null && res.Content.Pics.length > 0 && res.Content.Pics.indexOf(';') != -1) {
                            let arr = res.Content.Pics.split(';');
                            for (let arrItem of arr) {
                                if (arrItem.length > 0) {
                                    this.detailsDialog.pics.push(arrItem);
                                }
                            }
                        } else if (res.Content.Pics != null && res.Content.Pics.length > 0 && res.Content.Pics.indexOf(';') == -1) {
                            this.detailsDialog.pics.push(res.Content.Pics);
                        }
                        if (res.Content.Videos != null && res.Content.Videos.length > 0 && res.Content.Videos.indexOf(';') != -1) {
                            let arr = res.Content.Videos.split(';');
                            for (let arrItem of arr) {
                                if (arrItem.length > 0) {
                                    this.detailsDialog.videos.push({
                                        playerOptions: {
                                            height: '240',
                                            width: '300',
                                            autoplay: false,
                                            muted: true,
                                            language: 'zh-CN',
                                            playbackRates: [0.7, 1.0, 1.5, 2.0],
                                            sources: [{
                                                type: "video/mp4",
                                                src: this.reformUrl(arrItem)
                                            }],
                                            poster: this.detailsDialog.poster,
                                            notSupportedMessage: '播放源连接失败',
                                        }
                                    })
                                }
                            }
                        } else if (res.Content.Videos != null && res.Content.Videos.length > 0 && res.Content.Videos.indexOf(';') == -1) {
                            this.detailsDialog.videos.push({
                                playerOptions: {
                                    height: '240',
                                    width: '300',
                                    autoplay: false,
                                    muted: true,
                                    language: 'zh-CN',
                                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                                    sources: [{
                                        type: "video/mp4",
                                        src: this.reformUrl(res.Content.Videos)
                                    }],
                                    poster: this.detailsDialog.poster,
                                    notSupportedMessage: '播放源连接失败',
                                }
                            })
                        }

                    }

                }).catch(r => {
                });
                if (toDetail) {
                    this.getDetailLog(id);
                }

            },
            tongGao() {
                let data = {
                    "electronicInspectId": this.storeInfomationDialog.rowId,
                    "Status": 1//0未处理，1已通知，2已整改，3未整改
                };
                this.$api.UpdateStatus(data).then(res => {
                    if (res && res.IsSuccess) {
                        this.message('通告成功', 1);
                        this.storeInfomationDialog.show = false;
                        this.initGrid();
                    } else {
                        this.message('通告失败', -1);
                    }
                }).catch(r => {
                    this.message('通告失败', -1);
                })
            },
            reView(row) {
                this.reviewDialog.title ='复查-(' + row.StoreName + ')';
                this.reviewDialog.show = true;
                this.getDetails(row.Id, false);
                this.getStoreCameras(row.StoreId);
                this.reviewDialog.rowId = row.Id;
                this.reviewDialog.IsReformed = true;
            },
            reViewSure() {//复查确认
                let data = {
                    "ElectInspectId": this.reviewDialog.rowId,
                    "FileData": this.reviewDialog.imageCutFileServe,
                    "Remark": "",
                    "IsReformed": this.reviewDialog.IsReformed,
                };
                this.$api.ReviewElectInspect(data).then(res => {
                    if(res&&res.IsSuccess){
                        this.reviewDialog.show = false;
                        this.initGrid();
                        this.message('操作成功',1);
                    }else{
                        this.message('操作失败',-1);
                    }
                }).catch(r => {
                    this.message('操作失败',-1);
                })
            },
            getDetailLog(id) {
                this.$api.GetElectInspectLog(id).then(res => {
                    if (res && res.IsSuccess) {
                        if (res.Content != null && res.Content.length > 0) {
                            this.detailsDialog.detailsLogs = res.Content;
                            for (let it of this.detailsDialog.detailsLogs) {
                                let src = it.Pics;
                                let reslut = [];
                                if (src != null && src.length > 0 && src.indexOf(';') != -1) {
                                    let arr = src.split(';');
                                    for (let arrItem of arr) {
                                        if (arrItem.length > 0) {
                                            reslut.push(arrItem);
                                        }
                                    }
                                } else if (src != null && src.length > 0 && src.indexOf(';') == -1) {
                                    reslut.push(res.Content.Pics);
                                }
                                it.picArr = reslut;
                            }
                        } else {
                            this.detailsDialog.detailsLogs = [];
                        }
                    } else {
                        this.detailsDialog.detailsLogs = [];
                    }
                }).catch(r => {
                    this.detailsDialog.detailsLogs = [];
                })
            },
            getStoreInfo(storeId) {
                let data = {
                    "StoreId": storeId,
                };
                this.$api.GetStoreInfo(data).then(res => {
                    if (res && res.IsSuccess) {
                        if (res.Content != null) {
                            if (res.Content.LeaderName != null) {
                                this.storeInfomationDialog.LeaderName = res.Content.LeaderName;
                            }
                            if (res.Content.StoreName != null) {
                                this.storeInfomationDialog.storeName = res.Content.StoreName;
                            }
                            if (res.Content.Name != null) {
                                this.storeInfomationDialog.companyName = res.Content.Name;
                            }
                            if (res.Content.LinkTel != null && res.Content.LinkTel.length > 0) {
                                let phones = [];
                                if (res.Content.LinkTel.indexOf(",") != -1) {
                                    let temp = res.Content.LinkTel.split(",");
                                    for (let tempItem of temp) {
                                        if (tempItem.length > 0) {
                                            phones.push(tempItem);
                                        }
                                    }
                                } else {
                                    phones.push(res.Content.LinkTel);
                                }
                                this.storeInfomationDialog.LinkTel = phones;
                            }
                        }

                    }
                }).catch(r => {

                });
            },
            reformUrl(url){
                if(url == null ||url==undefined||url.length == 0){
                    return '';
                }
                let urlSrc = url ;
                if (this.$utils.isHttpsProtal()) {
                    if (urlSrc.startsWith('https')) {

                    } else {
                        urlSrc = urlSrc.replace("http", 'https');
                    }
                } else {
                    if (urlSrc.startsWith('https')) {
                        urlSrc = urlSrc.replace("https", 'http');
                    }
                }
                return urlSrc;
            },
            getStoreCameras(storeId) {
                let data = {
                    "StoreId": storeId,
                };
                this.reviewDialog.imageCut = [];
                this.reviewDialog.imageCutFileServe = [];
                this.reviewDialog.cameras = [];
                this.$api.GetStoreEquipments(data).then(res => {
                    debugger
                    if (res && (res.IsSuccess || true)) {
                        if (res.Content != null && res.Content.length > 0) {
                            let option = {
                                autoplay: true, //如果true,浏览器准备好时开始回放。
                                muted: false, // 默认情况下将会消除任何音频。
                                loop: false, // 导致视频一结束就重新开始。
                                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                                language: 'zh-CN',
                                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                                html5: {hls: {withCredentials: false}},
                                sources: [
                                    {
                                        withCredentials: false,
                                        type: "application/x-mpegURL",
                                        src: this.reformUrl(res.Content[0].liveUrlHttp)
                                    }
                                ],
                                notSupportedMessage: '播放源连接失败', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                                poster: this.reviewDialog.poster, //你的封面地址
                            };
                            window.console.log(this.reviewDialog.playerOptions);
                            this.reviewDialog.playerOptions = option;
                            this.reviewDialog.cameras = res.Content;
                            this.reviewDialog.titleCode = res.Content[0].liveUrlHttp;


                        } else {
                            this.reviewDialog.cameras = [];
                            this.reviewDialog.titleCode = '';
                            this.reviewDialog.playerOptions = null;
                        }
                    }
                }).catch(r => {

                })
            },
            changeCamera() {
                this.reviewDialog.playerOptions = {
                    autoplay: true, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    html5: {hls: {withCredentials: false}},
                    sources: [
                        {
                            withCredentials: false,
                            type: "application/x-mpegURL",
                            // src: res.Content[0].liveUrlHttp
                            src: this.reformUrl(this.reviewDialog.titleCode)
                        }
                    ],
                    notSupportedMessage: '播放源连接失败', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    poster: this.reviewDialog.poster, //你的封面地址
                };
            },
            captureImage() {
                try {
                    if (this.reviewDialog.imageCut.length >= 5) {
                        this.message("最多只能截取5张图片", 2);
                        return;
                    }
                    let scale = 0.25;
                    let video = document.querySelector("#liveVideo video");
                    let canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth * scale;
                    canvas.height = video.videoHeight * scale;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    let image = document.createElement('img');
                    image.crossOrigin = "anonymous"; //关键
                    image.src = canvas.toDataURL();
                    // image.src = canvas.toDataURL("image/png");
                    // this.$refs.imageCut.$el.appendChild(image);


                    let data = this.dataURLtoBlob(image.src);
                    let fd = new FormData();
                    fd.append('uploadFile', data);
                    this.$api.UploadFile(fd).then(res => {
                        if (res.data.Detail != null && res.data.Detail.length > 0) {
                            this.reviewDialog.imageCutFileServe.push(res.data.Detail);
                            this.reviewDialog.imageCut.push(image.src);
                        } else {
                            this.message('截图失败', 2);
                        }

                    }).catch(r => {

                    });
                } catch (e) {
                    this.message('截图失败,请稍后再试', 2);
                }
            },
            dataURLtoBlob(dataurl) {
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type: mime});
            }
        },
        created() {
            this.initGrid();
        }
    }
</script>

<style type="text/scss" lang="scss" scoped>
    .main-container {
        padding-top: 15px;
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
    }

    .ElectronicPatrol {
        .normalW {
            width: 170px;
        }
    }

</style>
<style lang="scss" type="text/scss">
    .ElectronicPatrol {
        .el-form-item {
            margin-bottom: 0 !important;
        }
    }


</style>