<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 微信图片</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-row >
                    <el-col :span="11">
                        <el-form-item label="开始时间" :span="3" prop="startTime">
                            <el-date-picker type="date" v-model="searchForm.startTime" placeholder="开始时间" class="handle-input mr10"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="结束时间" :span="3" prop="endTime">
                            <el-date-picker type="date" v-model="searchForm.endTime" placeholder="结束时间" class="handle-input mr10"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="材料情形  " :span="3" prop="attribute1">
                            <el-input v-model="searchForm.attribute1" placeholder="材料情形" class="handle-input mr10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="图片id  " :span="3" prop="sUrl">
                            <el-input v-model="searchForm.imgId" placeholder="图片id" class="handle-input mr10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-row>
                <el-row>
                    <el-button type="primary" icon="delete" class="handle-new mr10" @click="newUrl">新增</el-button>
                </el-row>
            </div>

            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="pictureName" label="图片id" sortable width="150"></el-table-column>
                <el-table-column prop="attribute1" label="材料情形" sortable width="150">
                </el-table-column>
                <el-table-column prop="path" label="图片" width="120">
                </el-table-column>
                <el-table-column prop="user" label="上传人" >
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" >
                </el-table-column>
                <el-table-column prop="attribute2" label="修改时间" :formatter="formatter">
                </el-table-column>
                <el-table-column label="操作"  width="220" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">修改情形</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEditPic(scope.$index, scope.row)">修改图片</el-button>
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
        <el-dialog title="修改材料情形" :visible.sync="editVisible" width="45%">
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!--上传图片-->
        <el-dialog title="上传图片资源给微信后台" :visible.sync="newVisible" width="45%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="材料情形">
                    <el-input v-model="form.attribute1"></el-input>
                </el-form-item>
                <el-form-item label="选择图片">
                    <el-input v-model="form.file"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveNew">确 定</el-button>
            </span>
        </el-dialog>


        <!--修改图片-->
        <el-dialog title="修改图片资源" :visible.sync="editPicVisible" width="45%">
            <el-form ref="form" :model="form" label-width="100px">

                <el-form-item label="选择图片">
                    <el-input v-model="form.file"></el-input>
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
                editPicVisible: false,
                form: {
                    file: '',
                    attribute1: '',
                },
                searchForm:{
                    startTime:'',
                    endTime:'',
                    attribute1:'',
                    imgId:'',
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

            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                // if (process.env.NODE_ENV === 'development') {
                //     this.url = '/ms/table/list';
                // };
                this.$axios.get('/urlResource/listByParams.do', {
                    params:{
                        startTmie: this.timeUtil.renderTime(this.searchForm.startTime)s,
                        endTime: this.timeUtil.renderTime(this.searchForm.endTime),
                        attribute1: this.searchForm.attribute1,
                        imgId: this.searchForm.imgId,
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
            handleEditPic(index,row){

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





