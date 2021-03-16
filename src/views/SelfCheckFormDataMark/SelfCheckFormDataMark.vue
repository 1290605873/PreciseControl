<template>
	<div class="container">
        <div class="flexContainer">
					<div class="button-box"> 
          	<el-button type="primary" size="middle" @click="Add">新增表单</el-button>
					</div>
					<el-table :data="tableData">
						<el-table-column type="index" label="序号" width="66px"></el-table-column>
						<el-table-column label="表单名称" prop="formName" max-width="300px"></el-table-column>
						<el-table-column label="需检查字段" prop="formField"></el-table-column>
						<el-table-column label="操作" width="160px">
							<template slot-scope="scope">
								<el-button type="primary" size="mini" @click="Edit(scope.row)">编辑</el-button>
								<el-button type="danger" size="mini" @click="Delete(scope.row.id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination 
						v-show="pages.total>0" 
						:total="pages.total" 
						:page.sync="pages.page" 
						:limit.sync="pages.limit"
						@pagination="pageChange"/>
        </div>
    </div>
</template>

<script src='@/views/SelfCheckFormDataMark/SelfCheckFormDataMark.js'>
</script>

<style scoped="scoped" lang="scss">
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding-top: 10px;

        .com-width {
            width: 170px;
        }

        .com-width-time {
            width: 170px;
            margin-right: 10px;
        }
        box-sizing: border-box;
    }
    .flexContainer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
        padding: 10px;
        .button-box{
					margin-bottom:15px
				}
        

    }
    .container {
        height: 100%;
        background: #fff;

    }

    .maxDialog_{
        height: calc(80vh - 106px);
        overflow-y: auto;
        font-size: 0;
    }
</style>
