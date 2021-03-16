<template>

    <div id="overlay">
        <img :src="imgUrl" alt="">
    </div>

</template>
<script>
    export default {
        name: 'PreviewImage',
        props: {
            imgUrl: {
                type: String,
                default: '111.png'
            }
        }

    }
</script>
<style scoped>
    #overlay {
        z-index: 2;
        position: fixed;
        width: 100vw;
        /* height: 100vh; */

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 10vh;
        left: 0;
        height: 80%;
        pointer-events: none;
        /*osition: fixed;*/
        /*z-index: 1;*/
        /*width: 80%;*/
        /*height: 80%;*/
        /*top: 10%;*/
        /*left: 10%;*/
        /*pointer-events: none*/
    }

    #overlay img {
        height: 80%;
        width: auto;
        border-radius: 4px;
        /*max-height: 100%;*/
        /*border: none;*/
        /*position: absolute;*/
        /*left: 0;*/
        /*right: 0;*/
        /*margin: auto;*/
        /*border-radius: 4px*/
    }
</style>

