<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 热门问答管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="问题" :span="3" prop="question">
                            <el-input  v-model="searchForm.question" placeholder="问题" class="handle-input mr10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态  " :span="3" prop="status">
                            <el-select v-model="searchForm.status"    placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-button type="primary" icon="search" @click="search">搜索</el-button>

                </el-row>
                <el-row>
                    <el-button type="primary" icon="delete" class="handle-new mr10" @click="newHot">新增</el-button>
                </el-row>
            </div>

            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="question" label="问题" sortable width="150">
                </el-table-column>
                <el-table-column prop="answer" label="答案" width="120">
                </el-table-column>
                <el-table-column prop="num" label="次数" >
                </el-table-column>
                <el-table-column prop="userNum" label="用户数" >
                </el-table-column>
                <el-table-column prop="createTime" label="修改时间" :formatter="formatterTime">
                </el-table-column>
                <el-table-column label="操作"  width="220" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" class="red" @click="distribution('0', scope.row)">下线</el-button>
                        <el-button type="text" icon="el-icon-edit" class="red" @click="deleteSaleOpp(scope.$index, scope.row)">删除</el-button>
                        <el-button type="text" icon="el-icon-edit" class="red" @click="distribution('1', scope.row)">下线</el-button>
                        <el-button type="text" icon="el-icon-edit" class="red" @click="distribution('3', scope.row)">上移</el-button>
                        <el-button type="text" icon="el-icon-edit" class="red" @click="distribution('4', scope.row)">下移</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <!--<el-col :span="24" class="el-table_footertoolbar">-->
            <!--<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" :total="users.length" style="float:right;">-->
            <!--</el-pagination>-->
            <!--</el-col>-->
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes,prev, pager, next,jumper" :total="total">
                </el-pagination>
                <!--<el-pagination background  @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="prev, pager,size, next,total" :total="total">-->
                <!--</el-pagination>-->
            </div>
        </div>

        <!--新增用户-->
        <el-dialog title="新增" :visible.sync="newVisible" width="45%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="问题">
                    <el-input v-model="form.question"></el-input>
                </el-form-item>
                <el-form-item label="答案">
                    <el-input v-model="form.answer"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveNew">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                url: './vuetable.json',
                tableData: [],
                cur_page: 1,
                pagesize:10,//一页显示几条
                total:0,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                depts:[],
                id:'',
                is_search: false,
                newVisible: false,
                delVisible: false,
                searchForm:{
                    question:'',
                    status:'',
                },
                form: {
                    question: '',
                    answer: '',
                },
                options:[
                    {
                        value: 0,
                        label: '已上线',
                    },
                    {
                        value: 1,
                        label: '未上线',
                    },
                ],
                idx: -1
            }
        },
        created() {
            this.getData();
            this.getDepts();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.userName === this.del_list[i].userName) {
                            is_del = true;
                            break;
                        }
                    }
                    // if (!is_del) {
                    //     if (d.deptName.indexOf(this.select_cate) > -1 &&
                    //         (d.loginName.indexOf(this.select_word) > -1 ||
                    //             d.deptName.indexOf(this.select_word) > -1)
                    //     ) {
                    //         return d;
                    //     }
                    // }
                    return d;

                })
            }
        },
        methods: {
            //初始页page、初始每页数据数pagesize和数据data
            handleSizeChange(size){
                this.pagesize = size;
                this.getData();

            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },

            getDepts(){
                this.$axios.get('/office/list.do', {
                }).then((res)=>  {
                    this.depts=res.data.data;
                }).catch(function (error) {
                    console.info(error)
                })
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                // if (process.env.NODE_ENV === 'development') {
                //     this.url = '/ms/table/list';
                // };
                this.$axios.get('/hotquestion/list.do', {
                    params:{
                        question:this.searchForm.question,
                        status:this.searchForm.status,
                        pageNumber: this.cur_page,
                        pageSize:this.pagesize
                    }
                }).then((res)=>  {
                    console.info("rows"+res.data.rows)
                    this.tableData=res.data.rows;
                    this.total=res.data.total
                    console.info("tableData"+this.tableData[1].address)

                }).catch(function (error) {
                    console.info(error)
                })
            },

            search() {
                this.is_search = true;
            },

            formatterTime(row,column){
               var time  = this.time(row.createTime)
                return time
            },



            filterTag(value, row) {
                return row.tag === value;
            },

            questionMatter(value,row,index) {
                var values = row.question;
                values = values.replace(/\\n/g, "\n");//换行
                var span = document.createElement('span');
                span.setAttribute('title', values);
                span.innerHTML = row.question;
                return span.outerHTML;
            },
            answerMatter(value,row,index) {
                var values = row.answer;
                // &#10 或&#13 都可以
                values = values.replace(/\\n/g,"\n");//换行
                var span = document.createElement('span');
                span.setAttribute('title',values);
                span.innerHTML = row.answer;
                return span.outerHTML;
            },
            newHot(){
                this.newVisible=true;
            },

            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id
                this.delVisible = true;
            },

            distribution(statu,row) {

                var formData = new FormData();
                // formData.append('id',this.id)
                formData.append('id',row.id)
                formData.append('status',statu)
                this.$axios.post('/hotquestion/update.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success('修改成功');
                    }else {
                        this.$message.error(res.data.msg)
                        // alert(res.data.msg)
                    }
                }).catch((error)=>{
                    this.$message.error('修改失败\n'+error)
                })

            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            saveNew(){
                var formData = new FormData();
                // formData.append('id',this.id)
                formData.append('question',this.form.question)
                formData.append('answer',this.form.answer)
                this.$axios.post('/hotquestion/add.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success('新建热门问答成功');
                    }else {
                        this.$message.error(res.data.msg)
                        // alert(res.data.msg)
                    }
                }).catch((error)=>{
                    this.$message.error('新建热门问答失败\n'+error)
                })

                this.form = {
                    answer: '',
                    question: '',
                }
                this.newVisible = false;
            },

            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);

                var formData = new FormData();
                formData.append('id',this.id)
                this.$axios.post('/hotquestion/deleteById.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success('删除成功');
                    }else {
                        alert(res.data.msg)
                    }
                }).catch((error)=>{
                    console.info("删除失败"+error)
                })
                this.delVisible = false;
                this.id=''
            },

        }
    }
</script>
<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .handle-new{
        float: right;
    }
    .mr10{
        margin-left: 10px;
    }
</style>





