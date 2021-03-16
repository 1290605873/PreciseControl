<template>
    <div class="wrapper">
        <div class="model" v-show="model">
            <div class="model-show" @click="model = false">
                <img :src="modelSrc" alt="" @click="model = false">
            </div>
        </div>
        <div class="content">
            <div class="show-info">
                <div class="img-wrap">
                    <vueCropper
                            ref="cropper"
                            :img="option.img"
                            :outputSize="option.size"
                            :outputType="option.outputType"
                            :info="true"
                            :full="option.full"
                            :canMove="option.canMove"
                            :canMoveBox="option.canMoveBox"
                            :fixedBox="option.fixedBox"
                            :original="option.original"
                            :autoCrop="option.autoCrop"
                            :autoCropWidth="option.autoCropWidth"
                            :autoCropHeight="option.autoCropHeight"
                            :centerBox="option.centerBox"
                            :high="option.high"
                            :infoTrue="option.infoTrue"
                            @cropMoving="cropMoving"
                            :enlarge="option.enlarge"
                            :mode="option.mode"
                    ></vueCropper>
                </div>
                <div class="test-button">
                    <el-row>
                        <label class="btn" for="uploads">选择图片</label>
                        <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
                        <el-button class="com-width" @click="finish('blob')" :loading="uploading" type="primary">截图并上传</el-button>
                        <!-- <el-button class="com-width" @click="finish('base64')" type="primary">截图并上传</el-button> -->
                        <el-button class="com-width" @click="clearCrop">清除</el-button>
                        <el-button class="com-width" @click="refreshCrop">刷新</el-button>
                        <el-button class="com-width" @click="changeScale(1)">放大</el-button>
                        <el-button class="com-width" @click="changeScale(-1)">缩小</el-button>
                        <el-button class="com-width" @click="rotateLeft">左转90°</el-button>
                        <el-button class="com-width" @click="rotateRight">右转90°</el-button>
                        <el-button class="com-width" @click="finish2('blob')">截图预览</el-button>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import VueCropper from '@/components/VueCropper/vue-cropper.vue'
    // import codes from '@/components/vue-cropper/code'
    export default {
        data: function () {
            return {
                model: false,
                modelSrc: "",
                crap: false,
                imgUrl: "",
                option: {
                    img: "",
                    size: 1,
                    full: true,
                    outputType: "",
                    canMove: true,
                    fixedBox: false,
                    original: false,
                    canMoveBox: true,
                    autoCrop: true,
                    // 只有自动截图开启 宽度高度才生效
                    // autoCropWidth: 300,
                    // autoCropHeight: 250,
                    centerBox: true,
                    high: true,
                    cropData: {},
                    enlarge: 1,
                    mode: 'contain',
                    fixed: true,
                    // 真实的输出宽高
                    infoTrue: true,
                    fixedNumber: [4, 4]
                },
                uploading: false

            };
        },
        methods: {
            clearCrop() {
                // clear
                this.$refs.cropper.clearCrop();
            },
            refreshCrop() {
                // clear
                this.$refs.cropper.refresh();
            },
            changeScale(num) {
                num = num || 1;
                this.$refs.cropper.changeScale(num);
            },
            rotateLeft() {
                this.$refs.cropper.rotateLeft();
            },
            rotateRight() {
                this.$refs.cropper.rotateRight();
            },
            finish(type) {
                if (type === "blob") {
                    if(this.option.img==null||this.option.img.length==0){
                        this.message('请选择图片',2);
                        return false;
                    }
                    const _this = this;
                    //上传服务器生成图片路径
                    this.uploading = true;
                    this.$refs.cropper.getCropBlob(data => {
                        let fd = new FormData();
                        fd.append('uploadFile', data);
                        _this.$api.UploadFile(fd).then(res => {
                            if(res&&res.data&&res.data.IsSuccess){
                                _this.imgUrl = res.data.Detail;
                                _this.$emit('finish', res.data.Detail);
                            }else{
                                this.$message({
                                    showClose: true,
                                    message:'上传失败',
                                    type: 'error',
                                    duration: 1200,
                                    center: true,
                                    onClose() {

                                    }
                                });
                            }
                            this.uploading = false;
                        }).catch(r=>{
                            this.uploading = false;
                            this.$message({
                                showClose: true,
                                message:'上传失败',
                                type: 'error',
                                duration: 1200,
                                center: true,
                                onClose() {

                                }
                            });
                        });
                    });

                } else {
                    this.$refs.cropper.getCropData(data => {
                        this.model = true;
                        this.modelSrc = data;
                    });
                }
            },
            finish2(type) {
                this.$refs.cropper.getCropData(data => {
                    this.model = true;
                    this.modelSrc = data;
                });
            },
            uploadImg(e, num) {
                //上传图片
                // this.option.img
                var file = e.target.files[0];
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                    // alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
                    return false;
                }
                var reader = new FileReader();
                reader.onload = e => {

                    let data;
                    if (typeof e.target.result === "object") {
                        // 把Array Buffer转化为blob 如果是base64不需要
                        data = window.URL.createObjectURL(new Blob([e.target.result]));
                    } else {
                        data = e.target.result;
                    }
                    if (num === 1) {
                        this.option.img = data;

                    } else if (num === 2) {
                        this.example2.img = data;
                    }
                };
                reader.readAsArrayBuffer(file);
            },
            imgLoad(msg) {
                console.log(msg);
            },
            cropMoving(data) {
                this.option.cropData = data;
            }
        },
        components: {
            VueCropper,
        },
        mounted() {

            var list = [].slice.call(document.querySelectorAll("pre code"));
            list.forEach((val, index) => {
                hljs.highlightBlock(val);
            });
        }
    };
</script>
<style scoped>
    .content {
        max-width: 1200px;
        margin: 0 auto;
    }

    .show-info {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
    }

    .img-wrap {
        width: 100%;
        height: 500px;
        margin: 10px;
    }

    .test-button {
        width: 400px;

    }

    .btn {
        width: 120px;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #c0ccda;
        color: #1f2d3d;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 22px 10px 0px 9px;
        padding: 9px 25px;
        font-size: 14px;
        border-radius: 4px;
        color: #fff;
        background-color: #409EFF;
        border-color: #409EFF;
        transition: all 0.2s ease;
        text-decoration: none;
        user-select: none;
    }

    .des {
        line-height: 30px;
    }

    code.language-html {
        padding: 10px 20px;
        margin: 10px 0px;
        display: block;
        background-color: #333;
        color: #fff;
        overflow-x: auto;
        font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo,
        Lucida, Sans, Type, Writer, Ubuntu, Mono;
        border-radius: 5px;
        white-space: pre;
    }

    .show-info {
        margin-bottom: 50px;

    }

    .show-info h2 {
        line-height: 50px;
    }

    .com-width {
        width: 120px;
        margin: 10px;
    }

    .test {
        height: 500px;
    }

    .model {
        position: fixed;
        z-index: 10;
        width: 100vw;
        height: 100vh;
        overflow: auto;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.8);
    }

    .model-show {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        text-align: center;
    }

    .model img {
        display: block;
        margin: auto;
        max-width: 80%;
        width: auto;
        user-select: none;
        background-position: 0px 0px, 10px 10px;
        background-size: 20px 20px;
        background-image: linear-gradient(
                45deg,
                #eee 25%,
                transparent 25%,
                transparent 75%,
                #eee 75%,
                #eee 100%
        ),
        linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
    }

    .c-item {
        display: block;
        padding: 10px 0;
        user-select: none;
    }

    .pre {
        display: flex;
    }

    .pre-item {
        padding-right: 20px;
    }

    @keyframes slide {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: -100% 0;
        }
    }

    @media screen and (max-width: 1000px) {
        .test {
            height: 550px;
        }
    }
</style>
