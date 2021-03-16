<template>
    <div>
        <el-tab-pane
                v-for="tabitem in topTabs.datas"
                :key="tabitem.Id"
                :label="tabitem.Name"
                :name="tabitem.Id"
        ></el-tab-pane>
    </div>
</template>
<script>
    /**
     一级业态组件（门店类型）
     */
    export default {
        data() {
            return {
                topTabs: {//顶部业态
                    //业态
                    datas: [],
                    code: "" //当前业态值
                }
            }
        },
        name: "StoreType",
        props: '',
        computed: {},
        methods: {
            getStoreTypeList() {//获取一级业态
                this.$api.GetStoreTypeList().then(res => {
                    if (res && res.IsSuccess) {
                        this.topTabs.datas = res.Content;
                    }
                }).catch(r => {

                });
            }
        },
        beforeCreated() {

        },
        created() {
            this.getStoreTypeList();
        },
        mounted() {

        },
        components: {}
    }
</script>

