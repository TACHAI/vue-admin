<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 连接资源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">-->
                <!--<el-option key="1" label="广东省" value="广东省"></el-option>-->
                <!--<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
                <!--</el-select>-->
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="newUser">新增</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            </div>


            <!--工具条-->
            <!--<el-col :span="24" class="el-table_headtoolbar" style="padding-bottom: 0px;">-->
            <!--<el-form :inline="true" :model="filters" class="userform" label-width="50px">-->
            <!--<el-form-item label="姓名"  prop="name">-->
            <!--<el-input v-model="filters.name" placeholder="姓名"  prefix-icon="el-icon-search"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="性别" prop="sex">-->
            <!--<el-select v-model="filters.sex" filterable placeholder="请选择" prop="sex">-->
            <!--<el-option v-for="item in sexOptions" :key="item.value"  :label="item.label" :value="item.value">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <!--<el-dropdown split-button type="primary" @click="btnSearch" trigger="click">-->
            <!--检索-->
            <!--<el-dropdown-menu slot="dropdown" class="lyzbtn-group" trigger="click">-->
            <!--<el-dropdown-item @click.native="btnReset">重置</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
            <!--<el-dropdown split-button type="primary" @click="newUser" trigger="click">-->
            <!--新增-->
            <!--<el-dropdown-menu slot="dropdown" trigger="click">-->
            <!--<el-dropdown-item  @click.native="btnEdit">编辑</el-dropdown-item>-->
            <!--<el-dropdown-item  @click.native="btnDelete">删除</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
            <!--</el-form>-->
            <!--</el-col>-->

            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="userName" label="姓名" sortable width="150">
                </el-table-column>
                <el-table-column prop="loginName" label="登录名" width="120">
                </el-table-column>
                <el-table-column prop="deptName" label="权限" >
                </el-table-column>
                <!--<el-table-column prop="address" label="地址" :formatter="formatter">-->
                <!--</el-table-column>-->
                <el-table-column label="操作"  width="220" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-edit" class="red" @click="resetPassword(scope.$index, scope.row)">重置密码</el-button>
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

        <!--新增用户-->
        <el-dialog title="新增" :visible.sync="newVisible" width="45%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="姓名">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="登录名">
                    <el-input v-model="form.loginName"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <!--<el-input v-model="form.deptName"></el-input>-->
                    <el-select v-model="form.officeId"   placeholder="请选择">
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

        <!-- 重置密码提示框 -->
        <el-dialog title="提示" :visible.sync="resetVisible" width="300px" center>
            <div class="del-dialog-cnt">确定要重置密码吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetVisible = false">取 消</el-button>
                <el-button type="primary" @click="reset">确 定</el-button>
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
                editVisible: false,
                newVisible: false,
                delVisible: false,
                resetVisible: false,
                form: {
                    userName: '',
                    loginName: '',
                    deptName: '',
                    officeId:''
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
                this.$axios.get('/user/selectlist.do', {
                    params:{
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

            formatter(row, column) {
                return row.address;
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

            newUser(){
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
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 保存编辑
            saveEdit() {
                // this.$set(this.tableData, this.idx, this.form);

                var formData = new FormData();
                formData.append('id',this.id)
                formData.append('userName',this.form.userName)
                formData.append('loginName',this.form.loginName)
                formData.append('officeId',this.form.officeId)
                this.$axios.post('/user/updateUser.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success(res.data.msg);
                    }else {
                        alert(res.data.msg)
                    }
                }).catch((error)=>{
                    console.info("删除用户错误"+error)
                })

                this.form = {
                    userName: '',
                    loginName: '',
                    deptName: '',
                    officeId: ''
                }
                this.editVisible = false
                this.getData();

                // this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },

            saveNew(){
                var formData = new FormData();
                // formData.append('id',this.id)
                formData.append('userName',this.form.userName)
                formData.append('loginName',this.form.loginName)
                formData.append('officeId',this.form.officeId)
                this.$axios.post('/user/addUser.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success('新建用户成功');
                    }else {
                        this.$message.error(res.data.msg)
                        // alert(res.data.msg)
                    }
                }).catch((error)=>{
                    this.$message.error('新建用户失败\n'+error)
                })

                this.form = {
                    userName: '',
                    loginName: '',
                    deptName: '',
                    officeId: ''

                }
                this.newVisible = false;
            },

            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);

                var formData = new FormData();
                formData.append('id',this.id)
                this.$axios.post('/user/delUser.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success('删除成功');
                    }else {
                        alert(res.data.msg)
                    }
                }).catch((error)=>{
                    console.info("删除用户错误"+error)
                })
                this.delVisible = false;

            },

            // 确定重置密码
            reset(){
                var formData = new FormData();
                formData.append('id',this.id)
                this.$axios.post('/user/resetPassword.do', formData
                ).then((res) => {
                    if(res.data.status==0){
                        this.$message.success('重置成功:'+res.data.data);
                    }else {
                        alert(res.data.msg)
                    }
                }).catch((error)=>{
                    console.info("重置用户密码失败"+error)
                })
                this.resetVisible = false;
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





