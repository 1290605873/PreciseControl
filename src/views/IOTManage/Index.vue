<template>
    <div class="containerBox main-container paddingt20">
      <div v-for="(item, index) in routerList" :key="index">
        <h4 class="toolTitle">{{item.name}}</h4>
        <el-form inline class="formbox">
          <el-form-item v-for="(i, j) in item.children" :key="index">
            <router-link :to="{path: i.path, query: queryObj}" @click.native="goRouter(i.name)">
              <div class="li_item">{{i.name}}</div>
            </router-link>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :title="title"
        :visible.sync="dialogMainVisible.show"
        fullscreen
        @close="handleClose">
        <router-view></router-view>
      </el-dialog>
    </div>
</template>

<script>
  import { constantRouterMap } from '@/router/index'
  export default {
    components: {},
    data() {
      return{
        dialogMainVisible:{
          show:false
        },
        title:'',
        queryObj:{
          userId: this.$utils.getUrlKey('userId'),
          curChangeOrg: this.$utils.getUrlKey('curChangeOrg'),
          sessionId:this.$utils.getUrlKey('sessionId'),
          changeOrg:this.$utils.getUrlKey('changeOrg'),
        },
        routerList: []
      }
    },
    created() {
      this.routerList = constantRouterMap.filter(i => i.path == '/IOTManage')
    },
    methods:{
      handleClose() {
        this.$router.push({path: "/IOTManage", query: this.queryObj});
      },
      goRouter(title){
        this.dialogMainVisible.show = true;
        this.title = title
      }
    }
  }
</script>
<style scoped lang="scss" type="text/scss">
    .containerBox{
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        .toolTitle{
            width:95%;
            margin-left:30px;
            font-weight:normal;
            border-bottom:1px solid #e8e8e8;
            font-size: 16px;
            color: #000000;
            line-height: 16px;
            padding-bottom: 20px;
        }
        .li_item{
            width: 120px;
            height: 120px;
            cursor: pointer;
            text-align: center;
            font-size: 14px;
            color: #757575;
            padding-top: 86px;
            margin:0 auto;
            background: #f1f1f1 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAD6klEQVRoQ+2aX4gVdRTHv2futhklZZBPET2oBJvtnUGF6CGj9O5sSvWgFWkl1sPOVcItwacQokKStPTOLUsNMordXvpjMysb1EuJ6M7dQmkpKpBQVmgpw9J77+8bU21ctrne+d31zs4Nf48z3/M753POb8785o+s949fP4sXXqbwfoFci5kYxAUKTkD4vJuz3m8mBMn7wT4A65oxboUNBZvdnLldd+4QZALAdbqGrdOzIpJZsDvX/YOOjxCEOgZJaClY4+bMd3R8pRIEwKZCj7mz7UEUuKzYYw23NQiJYO6s7JKtd0mlbUEIHIR09Lm5hSd1IEJtrGuEQAmAaxDf6jqIoyd4vtyhTuxZtuiXOPooTUMQEmNnzma7BldLtVknSdg1BGmmgyQR+FQfDUEUsbpom4MzEZyOz8sgOtlKQqtVEccLPhPBnXEDI7nXta0n4uqno0stSN4ftQC1gaTiFR0vFO+57fuLgeqB+MFOENm4mRPgYME2X4qrn9Tlh0sLUObXEHSGx0ieYwa9xeXW5/Xm0gLRDahZveOXNgi4q9aeYJmUR+p10FSC5IdKK0B+FJkIoVPIWcVp3UccL3gcwM1xM22AI7tt68O4+lqd4wVvi2BNlC2J7a5tbq49p1WRRLsWKXm/tB+CxyITQQyOn80+PLl1Si/IP9E73siLIrIlsjLAcKVcvW/PykXn9EAOBVmjGv/5vgrjVNHuHqsNYuMnozdS1Dyd5abAfhFZGV0ZHh2/6co7tEB0nP9HGy6VodLe1ryx4bbEQPq8YJUhGJhWMuoYE/xOC2Q6F3ufX1pngOE7tEs+SEwkBvLM0OjVv7N6FJBbWkDyXmIgYfCbvjh51R+/nVmSqYrEhVEiAnKbCBbXuadMqE5ZmChI3OD/1ZHiDAVvCeTROhA/EcbdYWdMLciqAWbmzg4OQOShOhBjUJ1L3Xu7TofnUwvi+MF+AcItUcTgl+WMsmvfuqQSxPGCxSI4En03p5dRsx/Y1Tv/fOr3WlHb+L+D5r4bcuaTW0XUVMh0VsQ/Nk9oHJ98sPoLAXzW7bGeq9cwUgkSBpv3S10Anw4fdQV4t2Bbn16s66UWRLdVa4HoTp6k/jJIktmO46thRUjpd+3sjjiTzaSmIQjAb8Z/NW/9P3xWCHv4MUBeb+sPPUkuFwJvZNQ1G6duP+LEEGNpxZnmkmoGCj3mg7ozphEEShm3F3u7D+vApBIE5FMF23q17UEUZW3Rzh7QAnG84GcRzNExaq2WlSpl/mu2+aOOH3G8kTdFZL2OUau0BChAv+5/KGE80vfxV3OMjsorpKyYqcoQDH8U+ACG7HCXm+HPCdrjT+u2wx/MfAI8AAAAAElFTkSuQmCC) no-repeat center 20px;
        }
        .formbox{
            margin-left:30px;
        }
        /deep/ .el-dialog__body{
            height:calc(100% - 100px);
        }
    }
</style>
<style scoped>
    .el-form--inline .el-form-item{margin-right:45px!important;margin-bottom:45px!important}
</style>
