<template>
    <div class="main-wrap">
       <tags-view/>
       <router-view></router-view>
    </div>
</template>
<script>
import path from 'path'
import TagsView  from '@/components/TagsView.vue';
export default {
    components: {
        TagsView
    },
    created(){
        this.setUrlpParam();
    },
    methods: {
        setUrlpParam(){
     
           this.$store.dispatch('addAppId', this.$utils.getUrlKey("appId"));
           this.$store.dispatch('addUserId', this.$utils.getUrlKey("userId"));
           this.$store.dispatch('addOrgID', this.$utils.getUrlKey("curChangeOrg"));
          
        }
    }
}
</script>
<style>
.main-wrap{
    height:calc(100vh);
}
.main-wrap .tags-view-container ~ .main-container{
    height:calc(100vh - 34px);
}
</style>


