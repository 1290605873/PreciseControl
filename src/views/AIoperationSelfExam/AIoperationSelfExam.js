import Pagination from "@/components/Pagination";
import Regionalism from '@/components/Regionalism.vue';
var time = null;

export default {
    components: {
        Pagination,
        Regionalism,
    },
    data () {
        const self = this
        return {
            absolute: 'absolute',
            border: '1px solid red',
            storeName: '',
            StartTime: '',
            EndTime: "",
            pickerOptions1: { //限制结束时间
                disabledDate: (time) => {
                    if (this.StartTime != null && this.StartTime != '' || this.StartTime != undefined) {
                        let timeStr = new Date(this.StartTime).getTime();
                        // let timeStr = new Date(this.StartTime.replace(/-/g, '/'));
                        return time.getTime() <= timeStr - 86400000;
                    } else {
                        // this.EndTime =  '';
                    }

                }
            },
            gridParam: {
                gridLoading: false,
                gridList: []
            },
            total: 0,
            searchValue: {
                page: 1,
                rows: 20
            },
            //上传图片信息集合
            checkedList: [],
            state: '',
            //检查项
            Violations: {
                AttrCode: [],
                datas: []
            },
            //是否违规
            IsViolation: {
                code: '-1',
                datas: [{
                        Id: '-1',
                        Name: '全部'
                    },{
                        Id: '0',
                        Name: '未违规'
                    },{
                        Id: '1',
                        Name: '违规'
                    },
                ]
            },
            //是否审核
            IsToexamine: {
                code: 0,
                datas: [{
                        Id: 0,
                        Name: '全部'
                    },{
                        Id: 1,
                        Name: '未审核'
                    },
                    {
                        Id: 2,
                        Name: '已审核'
                    },
                ]
            },
            //审核人
            Auditor: '',
            markpicDialog: {
                show: false
            },
            loadings: false,
            disabled: true,
            allcheck: false,
            model:{
                icon:'',
                result:'',
                uploadUrl:'',
                uploadId:'',
                index:0
            },
            // 级联的数据
            cascaderOpt: {
                lazy: true,
                value: 'Id',
                label: 'Name',
                lazyLoad (node, resolve) {
                    self.getOperateInfo(node, resolve)

                }
            }
              
        }
    },
    created () {
        // this.StartTime = new Date().toLocaleDateString();
        this.StartTime = this.getNowFormatDate();
        window['toserver'] = (data, index) => {
            let orignObj = this.gridParam.gridList[index];
            var regions = data[orignObj.OriginalPicture + orignObj.Id + ''].regions || [];
          
            let param = { // 不批量
                "Id": orignObj.Id,
                "AuditOptionList": [],
                "OrgId": this.$utils.getUrlKey("curChangeOrg"),
                "AppId": this.$utils.getUrlKey("appId"),
                "UserId": this.$utils.getUrlKey("userId"),
                "SourceType": 1

            }
            for (let ii of regions) {
                let obj = {
                    "AttrCode":  orignObj.AttrCode,
                    "AttrTxt":  orignObj.AttrTxt,
                    "InitHeight": orignObj.InitHeight || 0, // 原图高
                    "InitWidth": orignObj.InitWidth || 0, // 原图宽
                    "Height": ii.shape_attributes.height,
                    "Width": ii.shape_attributes.width,
                    "Left": ii.shape_attributes.x,
                    "Top": ii.shape_attributes.y
                };
                param.AuditOptionList.push(obj)
            }
            console.error(orignObj, regions, JSON.stringify(param, null, 2));
            this.$api.ComInspectAuditPic(param).then(res => {
                if (res.IsSuccess) {
                    this.message('审核成功', 1);
                } else {
                    this.message('审核失败', -1);
                }
                document.getElementById("childiframe").contentWindow.reportting = false;
                this.markpicDialog.show = false;

            }).catch(r => {
                this.message('审核失败', -1);
                document.getElementById("childiframe").contentWindow.reportting = false;
                this.markpicDialog.show = false;
            });


        };
        window['message'] = (msg, type) => {
            this.message(msg, type);
        }

        this.getAttrList()
    },
    mounted() {
        // let H = this.$refs.top.offsetHeight + 62 + 10 ;
        // this.$refs.middle.$el.style.height = 'calc(100vh - ' + H + 'px)'
    },
    methods: {
        move_to_prev_image() {
            document.getElementById("childiframe").contentWindow.move_to_prev_image();
        },
        move_to_next_image() {
            document.getElementById("childiframe").contentWindow.move_to_next_image();
        },
        onMarkDialogClose() {
            this.markpicDialog.show = false;
            this.GetAiPhotoSearch();
        },

        markok() {
            document.getElementById("childiframe").contentWindow.toserver();
        },
        regionalismResult(area) {
            this.areaDatas = area;
        },
        initRegion(area) {
            this.disabled = false;
            this.areaDatas = area;
            this.GetAiPhotoSearch();
        },
        startTimeChange(data) {
            this.$utils.consoleObj(data);
            // this.EndTime ='';
        },
        //查询
        queryList() {
            this.searchValue.page = 1;
            this.disabled = true;
            this.GetAiPhotoSearch();
        },
        //全选
        Allelection() {
            if (this.allcheck) {
                for (let item of this.gridParam.gridList) {
                    item.checked = false;
                    this.allcheck = false;
                }
            } else {
                for (let item of this.gridParam.gridList) {
                    item.checked = true;
                    this.allcheck = true;
                }

            }
        },
        //获取列表
        GetAiPhotoSearch() {
            
            this.loadings = true;
            if (new Date(this.EndTime).getTime() < new Date(this.StartTime).getTime() && new Date(this.EndTime).getTime() > 0) {
                this.message('请选择正确时间', 2);
                return;
            }
            let param = {
                ProvinceCode: this.areaDatas.provience.code,//省编码
                CityCode: this.areaDatas.city.code,//市编码
                DistrictCode: this.areaDatas.town.code,//区编码
                LocationId: this.areaDatas.street.code || '00000000-0000-0000-0000-000000000000',//街道id
                CommunityId: this.areaDatas.community.code || '00000000-0000-0000-0000-000000000000',//社区ID
                CompanyName: this.state,//单位名称
                AttrCode:  this.Violations.AttrCode[2] || '',//违规项
                IsAudit: this.IsViolation.code,//是否违规 -1全部 0未违规 1违规 --> true false
                AuditStatus: this.IsToexamine.code,//审核状态：0-无 1-未审核 2-已审核
                SourceType: 1,//来源类型 0无 1自查 2 ai智能整改
                AuditUserName: this.Auditor,//审核人
                BeginTime: this.StartTime,//开始时间
                EndTime: this.EndTime,//结束时间
                PageNo: this.searchValue.page,//当前页数
                PageSize: this.searchValue.rows,//每页显示数
                OrgId: this.$utils.getUrlKey('curChangeOrg'),//($uuid)组织id
                AppId: this.$utils.getUrlKey('appId'),//($uuid)应用id
                UserId: this.$utils.getUrlKey('userId'),//($uuid)用户id
            }
            this.$api.GetReformAuditPicList(param).then(res => {
                    // console.log('获取列表--->', JSON.stringify(res.ListData, null, 2));
                    this.loadings = false;
                    this.disabled = false;
                    this.allcheck = false;
					this.total = res.Total || 0;
                    if (res && res.IsSuccess && res.ListData) {
                        for (let item of res.ListData) {
                            item.checked = false;
                        }
                        this.gridParam.gridList = res.ListData;
                    } else {
                        this.gridParam.gridList = []
                    }
                }
            ).catch(error => {
                this.loadings = false;
                this.disabled = false;
            })
        },
        change(id, flag) {
            if (flag == 'checkbox') {
                this.gridParam.gridList.forEach(v=>{
                    if (v.Id !== id) {
                        v.checked = false
                    }
                })
                return 
            }
            clearTimeout(time)
            time = setTimeout(() => {
                for (let item of this.gridParam.gridList) {
                    if (item.Id == id) {
                        if (item.checked) {
                            item.checked = false;
                        } else {
                            item.checked = true;
                        }
                    } else {
                        item.checked = false;
                    }
                }

            }, 300)
        },
        getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate + ' 00:00:00';
            return currentdate;
        },
        //双击图片
        dbcheck(index, val) {
            clearTimeout(time);
            let _via_img_metadata = {};
            this.model.index = index;
            this.model.uploadUrl = this.gridParam.gridList[index].OriginalPicture;
            this.model.uploadId = this.gridParam.gridList[index].Id;
            
            this.gridParam.gridList.forEach((v)=>{
                !v.Coordinate && (v.Coordinate = [])

                let arr = v.Coordinate.map(vv=>{
                    return {
                        "shape_attributes": {
                            "name": "rect",
                            "x": vv.Left,
                            "y": vv.Top,
                            "width": vv.Width,
                            "height": vv.Height
                        },
                        "region_attributes": {},
                        'rason':  v.AttrTxt
                    }
                });
                // item.ImgUrl = 'http://pic25.nipic.com/20121205/10197997_003647426000_2.jpg';
                _via_img_metadata[v.OriginalPicture + v.Id + ''] = {
                    filename: v.OriginalPicture,
                    "size": -1,
                    "regions": arr,
                }
            })

            window.markPicsObj = {
                "_via_settings": {
                    "ui": {
                        "annotation_editor_height": 25,
                        "annotation_editor_fontsize": 0.8,
                        "leftsidebar_width": 18,
                        "image_grid": {
                            "img_height": 80,
                            "rshape_fill": "none",
                            "rshape_fill_opacity": 0.3,
                            "rshape_stroke": "yellow",
                            "rshape_stroke_width": 2,
                            "show_region_shape": true,
                            "show_image_policy": "all"
                        },
                        "image": {
                            "region_label": "__via_region_id__",
                            "region_label_font": "10px Sans",
                            "on_image_annotation_editor_placement": "NEAR_REGION"
                        }
                    },
                    "core": {
                        "buffer_size": 18,
                        "filepath": {},
                        "default_filepath": ""
                    },
                    "project": {
                        "name": "via_project_9Jul2019_15h53m"
                    }
                },
                "_via_attributes": {
                    "region": {},
                    "file": {}
                },
                _via_img_metadata: _via_img_metadata
            };
            window.wrongItem = [{AttrName: val.AttrTxt}]

            
            // window.wrongItem = this.Violations.datas;
            window.wrongitemIndex = index;
            this.markpicDialog.show = true;
                
        },
        async getAttrList () {
            const res = await this.$api.GetAttrList({})
            // console.log('违规项--->',res);
            if (res && res.Content) {
                this.Violations.datas = res.Content
            }
        },
        async comInspectAuditPic () { // 审核
            this.checkedList = this.gridParam.gridList.find(e=>e.checked)
            if (!this.checkedList) {
                this.message('请勾选图片', 2);
                return
            }
            try {
                let param = { // 不批量
                    "Id": this.checkedList.Id,
                    "SourceType": 1,
                    "AuditOptionList": [
                    //   {
                    //     "AttrCode": this.checkedList.AttrCode, // 违规项
                    //     "AttrTxt": this.checkedList.AttrTxt, // 违规项名称
                    //     "InitHeight": this.checkedList.InitHeight, // 原图高
                    //     "InitWidth": this.checkedList.InitWidth, // 原图宽
                    //     "Height": this.checkedList.Coordinate.Height, // 人体高
                    //     "Width": this.checkedList.Coordinate.Width, // 人体宽
                    //     "Left": this.checkedList.Coordinate.Left, // 左边距
                    //     "Top": this.checkedList.Coordinate.Top // 上边距
                    //   }
                    ],
                    "OrgId": this.$utils.getUrlKey("curChangeOrg"),
                    "AppId": this.$utils.getUrlKey("appId"),
                    "UserId": this.$utils.getUrlKey("userId"),
                }
                !this.checkedList.Coordinate && (this.checkedList.Coordinate = [])
                param.AuditOptionList = this.checkedList.Coordinate.map(v=>{
                    return {
                        "AttrCode": this.checkedList.AttrCode, // 违规项
                        "AttrTxt": this.checkedList.AttrTxt, // 违规项名称
                        "InitHeight": this.checkedList.InitHeight, // 原图高
                        "InitWidth": this.checkedList.InitWidth, // 原图宽
                        "Height": v.Height, // 人体高
                        "Width": v.Width, // 人体宽
                        "Left": v.Left, // 左边距
                        "Top": v.Top // 上边距
                    }
                })
                const res = await this.$api.ComInspectAuditPic(param)
                console.log('违规项--->',res);
                if (res.IsSuccess) {
                    this.message(res.Message, 1)
                    this.searchValue.page = 1;
                    this.GetAiPhotoSearch()
                }
            } catch (error) {
                console.error(error);
                
            }
        },

        async getOperateInfo (node, resolve) { // 业态
            // console.error('级联的数据-->', node);
            const { level } = node
            if (level == 0) {
                const res = await this.$api.GetOperateInfo(1)
                // console.log('业态违规项--->',res);
                resolve(res)
            } else if (level == 1) {
                let param = {
                    "StoreTypeId": node.data.Id,
                    "TaskTypeId": "",
                    "ProcessType": "1", // -1全部、0巡查、1自查、2双随机
                    "Type": 6, // 类型 1任务类型 2检查结果 3处理结果 4餐厅类型 5执法处理 6检查项分类 7检查项重要项
                    "PreviousId": "",
                    "OrgId": this.$utils.getUrlKey("curChangeOrg"),
                    "AppId": this.$utils.getUrlKey("appId"),
                    "UserId": this.$utils.getUrlKey("userId"),
                }
                const res = await this.$api.GetBasicOptionList(param)
                res.Content.forEach(v=>{
                    v.Name = v.Text
                })
                // console.log('分类--->',JSON.stringify(res.Content, null, 2));

                resolve(res.Content)
            } else if (level == 2) {
                let param = {
                    "StoreTypeId": node.parent.data.Id, // 液态id
                    "ProcessType": "1",
                    "ClassificationId": node.data.Id, // 分类id
                    "TaskTypeId": "",
                    "SearchWord": "",
                    "pageNo": 1,
                    "pageSize": 1000,
                    "OrgId": this.$utils.getUrlKey("curChangeOrg"),
                    "AppId": this.$utils.getUrlKey("appId"),
                    "UserId": this.$utils.getUrlKey("userId"),
                }
                const res = await this.$api.GetInspectOptionListAsync(param)
                res.Content.forEach(v=>{
                    v.Name = v.Text
                    v.leaf = v.Text
                    v.leaf = true
                })
                // console.log('违规项--->',res);
                resolve(res.Content)

            }
            
        },
        
        
    }
}
