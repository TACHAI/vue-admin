<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>统计报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">-->
                <!--<el-option key="1" label="广东省" value="广东省"></el-option>-->
                <!--<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
                <!--</el-select>-->
                <el-form v-bind:model="searchForm" v-bind:rules="rules"  lable-width="80px">
                    <el-row >
                        <el-col :span="6">
                            <el-form-item label="委办局  " :span="3" prop="status">
                                <el-select v-model="searchForm.officeId"  @change="getOption"  placeholder="请选择">
                                    <el-option
                                            v-for="item in depts"
                                            :key="item.value"
                                            :label="item.text"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="事项  " :span="3" prop="status">
                                <el-select v-model="searchForm.item"    placeholder="请选择">
                                    <el-option
                                            v-for="item in depts"
                                            :key="item.value"
                                            :label="item.text"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="状态  " :span="3" prop="status">
                                <el-select v-model="searchForm.online"    placeholder="请选择">
                                    <el-option
                                            v-for="item in onlines"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="问题" :span="3" prop="question">
                                <el-input  v-model="searchForm.question" placeholder="问题" class="handle-input mr10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="答案" :span="3" prop="answer">
                                <el-input  v-model="searchForm.answer" placeholder="答案" class="handle-input mr10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="概要" :span="3" prop="target">
                                <el-input  v-model="searchForm.target" placeholder="概要" class="handle-input mr10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-button type="primary" icon="search" @click="search">搜索</el-button>

                    </el-row>
                </el-form>
            </div>


            <!--<el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">-->
            <el-table :data="data" border class="table" >
                <el-table-column prop="questionAlias" :formatter="questionMatter" label="问题"></el-table-column>
                <!--<el-table-column prop="target" label="概要"></el-table-column>-->
                <el-table-column prop="answer" :formatter="answerMatter"label="答案" ></el-table-column>
                <el-table-column prop="office" label="委办局" ></el-table-column>
                <el-table-column prop="item" label="事项" ></el-table-column>
                <el-table-column prop="attr" label="关键字"  ></el-table-column>
                <el-table-column prop="online" :formatter="formatterOnLine" label="上线情况"  ></el-table-column>
                <!--<el-table-column prop="insertAt" :formatter="dateformatter" label="创建时间"  ></el-table-column>-->
                <el-table-column prop="orderTime" :formatter="dateformatter2" label="预约时间" ></el-table-column>
                <el-table-column prop="updateTime" :formatter="dateformatter1" label="上线时间" ></el-table-column>

                <el-table-column label="操作"  width="220" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button type="text" icon="el-icon-edit" class="red" @click="downKnowledge(scope.$index, scope.row)">下线</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="orderUpAndDown(scope.$index, scope.row)">预约上线</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="orderUpAndDown(scope.$index, scope.row)">预约下线</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="cancelOrder(scope.$index, scope.row)">取消预约</el-button>
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
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="45%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="姓名">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="登录名">
                    <el-input v-model="form.loginName"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <!--<el-input v-model="form.deptName"></el-input>-->
                    <el-select v-model="form.officeId"  placeholder="请选择">
                        <el-option
                                v-for="item in depts"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
                depts:[],
                items:[],
                is_search: false,
                editVisible:false,
                searchForm:{
                    question:'',
                    answer:'',
                    target:'',
                    online:'',
                    item:'',
                    officeId:'',
                },
                onlines:[
                    {
                        value: 0,
                        label: '已上线',
                    },
                    {
                        value:1,
                        label:'未上线'
                    },
                    {
                        value:2,
                        label:'已预约上线',
                    },
                    {
                        value:3,
                        label:'已预约下线'
                    }

                ],
                // 里面的键对应prop的值
                rules: {
                    // Date: [
                    //     { type: "date", required: true, message: "请选择消费日期", trigger: "change" }
                    // ],
                    // Cost: [
                    //     { required: true, message: "请填写消费金额", trigger: "blur" },
                    //     { validator: costValidator, trigger: "change" }
                    // ],
                    // Remark: [
                    //     { required: true, message: "请填写消费明细", trigger: "blur" }
                    // ]
                },

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
                    // let is_del = false;
                    // for (let i = 0; i < this.del_list.length; i++) {
                    //     if (d.userName === this.del_list[i].userName) {
                    //         is_del = true;
                    //         break;
                    //     }
                    // }


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

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getDepts(){
                this.$axios.get('/office/list.do', {
                }).then((res)=>  {
                    this.depts=res.data.data;
                }).catch(function (error) {
                    console.info(error)
                })
            },
            getOption() {
//            getBackOptions(baseUrl+'/office/list.do',$("#officeId"))

                this.$axios.get('/item/list.do', {
                    officeId:this.searchForm.officeId
                }).then((res)=>  {
                    this.items=res.data.data;
                }).catch(function (error) {
                    console.info(error)
                })
            },
            formatterOnLine(row, index) {
                if(row.orderOnline=="0"){
                    return '预约上线'
                }else if(row.orderOnline=='1'){
                    return '预约下线'
                }
                if (row.online == '0') {
                    return '已上线'
                } else if(row.online=='1') {
                    return '未上线'
                }
            },
            handleEdit(index, row) {
                this.idx = index;
                // const item = this.tableData[index];
                this.id=row.id;
                this.form = {
                    userName: row.userName,
                    loginName: row.loginName,
                    officeId: row.deptName
                }
                this.editVisible = true;
            },

            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                // if (process.env.NODE_ENV === 'development') {
                //     this.url = '/ms/table/list';
                // };
                this.$axios.get('/knowledge/list.do', {
                    params:{
                        question:this.searchForm.question,
                        answer:this.searchForm.answer,
                        target:this.searchForm.target,
                        online:this.searchForm.online,
                        item:this.searchForm.item,
                        officeId:this.searchForm.officeId,
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
                this.getData()
            },

            // formatter(row, column) {
            //     var date =this.TimestampToDate(row.insertTime)
            //
            //     return date;
            // },

            filterTag(value, row) {
                return row.tag === value;
            },

            formatterOnLine(row, index) {
                if(row.orderOnline=="0"){
                    return '预约上线'
                }else if(row.orderOnline=='1'){
                    return '预约下线'
                }
                if (row.online == '0') {
                    return '已上线'
                } else if(row.online=='1') {
                    return '未上线'
                }
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

            questionMatter(row,index) {
                var values = row.questionAlias;
                values = values.replace(/\\n/g,"\n");//换行
                var span = document.createElement('span');
                span.setAttribute('title',values);
                span.innerHTML = row.questionAlias;
                return span.outerHTML;
            },

            orderUpAndDown(id,value) {
                $("#onlineValue").val(value)
                $("#orderId").val(id)
                if(value=='0'){
                    $("#myModalLabel").text('预约上线时间')
                }else if(value=='1'){
                    $("#myModalLabel").text('预约下线时间')
                }
                $("#myModal").modal('show');
            },

            detailHandle(row,column) {
                var defaultTime = new Date(row.insertDate);
                var defaultDate = defaultTime.getTime()+24*3600*1000;
                var endTime = TimestampToDate1(defaultDate)
                var handle='<a href="../knowledgeUp/messagelist.html?startTime='+row.insertDate+'&endTime='+endTime+'">'+row.handleNum+'</a>'

                return handle;
            },
            // detailAnswer(row,index) {
            //     var defaultTime = new Date(row.insertDate);
            //     var defaultDate = defaultTime.getTime()+24*3600*1000;
            //     var endTime = TimestampToDate1(defaultDate)
            //     var answerQuestionNum='<a href="../knowledgeUp/messagelist.html?startTime='+row.insertDate+'&endTime='+endTime+'">'+row.answerQuestionNum+'</a>'
            //
            //     return answerQuestionNum;
            // },

            // 时间戳转换
            TimestampToDate(Timestamp) {
                var date = new Date(Timestamp);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hours = date.getHours();
                var moment = date.getMinutes();
                var scents = date.getSeconds();
                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;
                hours = hours < 10 ? '0' + hours : hours;
                moment = moment < 10 ? '0' + moment : moment;
                scents = scents < 10 ? '0' + scents : scents;
                return year + '-' + month + '-' + day + ' ' + hours + ':' + moment + ':' + scents;
            },
            // 加8小时
            renderTime(date) {
                if (date.toString().length>1){
                    var dateee = new Date(date).toJSON();
                    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                }
                return null
            }

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
    .handle-del{
        float: right;
    }
    .mr10{
        margin-left: 10px;
    }
</style>





