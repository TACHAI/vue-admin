<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 连接资源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form v-bind:model="searchForm" v-bind:rules="rules"  lable-width="80px">

                <el-row >
                    <el-col :span="6">
                        <el-form-item label="开始时间" :span="3" prop="startTime">
                            <el-date-picker type="date" v-model="searchForm.startTime" placeholder="开始时间" class="handle-input mr10"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="结束时间" :span="3" prop="endTime">
                            <el-date-picker type="date" v-model="searchForm.endTime" placeholder="结束时间" class="handle-input mr10"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="链接类型  " :span="3" prop="status">
                            <el-select v-model="searchForm.type"   placeholder="请选择">
                                <el-option
                                        v-for="item in options"
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
                        <el-form-item label="长网址  " :span="3" prop="lUrl">
                            <el-input v-model="searchForm.lUrl" placeholder="长网址" class="handle-input mr10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="短网址  " :span="3" prop="sUrl">
                            <el-input v-model="searchForm.sUrl" placeholder="短网址" class="handle-input mr10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="网址说明  " :span="3" prop="urlName">
                            <el-input v-model="searchForm.urlName" placeholder="网址说明" class="handle-input mr10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-row>
                </el-form>
                <el-row>
                    <el-button type="primary" icon="delete" class="handle-new mr10" @click="newUrl">新增</el-button>
                    <el-button type="primary" icon="delete" class="handle-new mr10" @click="bathDel">批量删除</el-button>
                </el-row>
            </div>

            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="urlName" label="网址说明" sortable width="150"></el-table-column>
                <el-table-column prop="lUrl" label="长链接" sortable width="150">
                </el-table-column>
                <el-table-column prop="sUrl" label="短链接" width="120">
                </el-table-column>
                <el-table-column prop="type" label="链接类型" >
                </el-table-column>
                <el-table-column prop="insertUser" label="创建人" >
                </el-table-column>
                <el-table-column prop="insertDate" label="创建时间" :formatter="formatter">
                </el-table-column>
                <el-table-column label="操作"  width="220" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                <el-form-item label="资源名">
                    <el-input v-model="form.urlName"></el-input>
                </el-form-item>
                <el-form-item label="长链接">
                    <el-input v-model="form.lUrl" @blur="formatterUrl"></el-input>
                </el-form-item>
                <el-form-item label="短链接">
                    <el-input v-model="form.sUrl"></el-input>
                </el-form-item>
                <el-form-item label="资源类型">
                    <el-select v-model="form.type"  placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
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

        <!--新增用户-->
        <el-dialog title="新增" :visible.sync="newVisible" width="45%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="资源名">
                    <el-input v-model="form.urlName"></el-input>
                </el-form-item>
                <el-form-item label="长链接">
                    <el-input v-model="form.lUrl" @blur="formatterUrl"></el-input>
                </el-form-item>
                <el-form-item label="短链接">
                    <el-input v-model="form.sUrl"></el-input>
                </el-form-item>
                <el-form-item label="资源类型">
                    <el-select v-model="form.type"  placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveNew">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'urlResource',
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
                editVisible: false,
                newVisible: false,
                delVisible: false,
                resetVisible: false,
                form: {
                    urlName: '',
                    lUrl: '',
                    sUrl: '',
                    type:''
                },
                searchForm:{
                    startTime:'',
                    endTime:'',
                    lUrl:'',
                    sUrl:'',
                    urlName:'',
                    type:'',
                },
                options:[
                    {
                        value: '',
                        label: '>--请选择--<',
                    },
                    {
                        value:'材料及模板下载',
                        label:'材料及模板下载'
                    },
                    {
                        value:'上传材料链接',
                        label:'上传材料链接'
                    },
                    {
                        value:'非自制链接',
                        label:'非自制链接'
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
            // this.getDepts();
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

            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                // if (process.env.NODE_ENV === 'development') {
                //     this.url = '/ms/table/list';
                // };
                this.$axios.get('/urlResource/listByParams.do', {
                    params:{
                        startTmie: this.renderTime(this.searchForm.startTime),
                        endTime: this.renderTime(this.searchForm.endTime),
                        lUrl: this.searchForm.lUrl,
                        sUrl: this.searchForm.sUrl,
                        urlName: this.searchForm.urlName,
                        type: this.searchForm.type,
                        pageNumber: this.cur_page,
                        pageSize:this.pagesize
                    }
                }).then((res)=>  {
                    console.info("rows"+res.data.rows)
                    this.tableData=res.data.rows;
                    this.total=res.data.total

                }).catch(function (error) {
                    console.info(error)
                })
            },

            search() {
                this.is_search = true;
            },

            formatter(row, column) {
                return this.TimestampToDate(row.insertDate);
            },

            filterTag(value, row) {
                return row.tag === value;
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

            newUrl(){
                this.newVisible=true;
            },

            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id
                this.delVisible = true;
            },

            resetPassword(index,row){
                this.id = row.id
                this.resetVisible = true;
            },

            formatterUrl(){
                var token = '6c5c9a3c970c0df021d76454654eef19'
                this.$axioBaidu.defaults.headers.common['token'] = token;
                this.$axioBaidu.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';//配置请求头

                this.$axioBaidu.post('https://dwz.cn/admin/v2/create', {
                    url:this.form.lUrl
                    }
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success(res.data.msg);
                    }else {
                        alert(res.data.msg)
                    }
                }).catch((error)=>{
                    console.info("删除用户错误"+error)
                })

            },
            bathDel() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].id + ',';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
                var formData = new FormData();
                formData.append('ids',str)
                this.$axios.post('/urlResource/batchIgnoreUrl.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success(res.data.msg);
                    }else {
                        alert(res.data.msg)
                    }
                }).catch((error)=>{
                    console.info("删除用户错误"+error)
                })

            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 保存编辑
            saveEdit() {
                // this.$set(this.tableData, this.idx, this.form);

                var formData = new FormData();
                formData.append('id',this.id)

                formData.append('lUrl',this.form.lUrl)
                formData.append('sUrl',this.form.sUrl)
                formData.append('urlName',this.form.urlName)
                formData.append('type',this.form.type)
                this.$axios.post('/urlResource/update.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success(res.data.msg);
                    }else {
                        alert(res.data.msg)
                    }
                }).catch((error)=>{
                    console.info("修改错误"+error)
                })

                this.form = {
                    lUrl: '',
                    sUrl: '',
                    type: '',
                    urlName: ''
                }
                this.id=''
                this.editVisible = false
                this.getData();

                // this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },

            saveNew(){
                var formData = new FormData();
                // formData.append('id',this.id)
                formData.append('lUrl',this.form.lUrl)
                formData.append('sUrl',this.form.sUrl)
                formData.append('urlName',this.form.urlName)
                formData.append('type',this.form.type)
                this.$axios.post('/urlResource/addUrl.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success('新建成功');
                    }else {
                        this.$message.error(res.data.msg)
                        // alert(res.data.msg)
                    }
                }).catch((error)=>{
                    this.$message.error('新建失败\n'+error)
                })

                this.form = {
                    lUrl: '',
                    sUrl: '',
                    type: '',
                    urlName: ''

                }
                this.newVisible = false;
            },

            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);

                var formData = new FormData();
                formData.append('id',this.id)
                this.$axios.post('/urlResource/deleteUrlResource.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success('删除成功');
                    }else {
                        alert(res.data.msg)
                    }
                }).catch((error)=>{
                    console.info("删除错误"+error)
                })
                this.delVisible = false;

            },

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
                return ''
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
    .handle-new{
        float: right;
    }
    .mr10{
        margin-left: 10px;
    }
</style>





