import Pagination from "@/components/Pagination";
import Regionalism from '@/components/Regionalism.vue';
export default {
    name:'Enablationdetails',
    components: {
        Pagination,
        Regionalism,
    },   
    data() {
        return {
            searchDetails:{
                storeName:'',
                companyName:'',
                page:1,
                rows:20,
            },
            Detailsstate:{
                code: '',
                name: '',
                datas: [{
                        value: '1',
                        label: '未发布'
                    },
                    {
                        value: '2',
                        label: '已发布'
                    },
                    {
                        value: '3',
                        label: '已上线'
                    }
                ]
            },
            Startdate: '', //开始时间
            Enddate: '', //结束时间
            pickerOptions0: { //限制开始时间
                disabledDate: (time) => {
                    if (this.Enddate != '' && this.Enddate) {
                        let timeStr = new Date(this.Enddate.replace(/-/g, '/'));
                        return time.getTime() > timeStr;
                    } else {
                        return ''
                    }
                }
            },
            pickerOptions1: { //限制结束时间
                disabledDate: (time) => {
                    if (this.Startdate != '' && this.Startdate) {
                        let timeStr = new Date(this.Startdate.replace(/-/g, '/'));
                        return time.getTime() < timeStr;
                    } else {
                        return ''
                    }
                }
            },
            Detailstotal:1,
            list:[],
            Loading:false,
        }
    },
    methods:{
        regionalismResult(area) {
            this.areaDatas = area;
        },
        initRegion(area) {
            this.areaDatas = area;
            this.areaDatas.community.hide = true;
            // this.getInitTable();
            console.log(this.areaDatas)
        },
        Timechange(){
            this.Enddate = ''
        },
    }
}