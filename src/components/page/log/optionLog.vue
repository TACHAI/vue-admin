<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>历史操作查看</el-breadcrumb-item>
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
                     <el-col :span="11">
                         <el-form-item label="开始时间" :span="3" prop="startTime">
                             <el-date-picker type="datetime" v-model="searchForm.startTime" placeholder="开始时间" class="handle-input mr10"></el-date-picker>
                         </el-form-item>
                     </el-col>
                     <el-col :span="11">
                         <el-form-item label="结束时间" :span="3" prop="endTime">
                             <el-date-picker type="datetime" v-model="searchForm.endTime" placeholder="结束时间" class="handle-input mr10"></el-date-picker>
                         </el-form-item>
                     </el-col>
                 </el-row>
                  <el-row>
                      <el-col :span="11">
                          <el-form-item label="内容  " :span="3" prop="name">
                              <el-input v-model="searchForm.content" placeholder="内容" class="handle-input mr10"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="11">
                          <el-form-item label="姓名  " :span="3" prop="name">
                              <el-input v-model="searchForm.name" placeholder="姓名" class="handle-input mr10"></el-input>
                          </el-form-item>
                      </el-col>
                     <el-button type="primary" icon="search" @click="search">搜索</el-button>
                 </el-row>
              </el-form>
            </div>


            <!--<el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">-->
            <el-table :data="data" border class="table" >
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="userName" label="操作人" sortable width="120">
                </el-table-column>
                <el-table-column prop="content" label="操作内容" >
                </el-table-column>
                <el-table-column prop="insertTime" label="操作时间" :formatter="formatter" width="200" >
                </el-table-column>

                <!--<el-table-column label="操作"  width="220" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                        <!--<el-button type="text" icon="el-icon-edit" class="red" @click="resetPassword(scope.$index, scope.row)">重置密码</el-button>-->
                        <!--<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
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
    </div>
</template>

<script>
    export default {
        name: 'optionLog',
        data() {
            return {
                url: './vuetable.json',
                tableData: [],
                cur_page: 1,
                pagesize:10,//一页显示几条
                total:0,
                multipleSelection: [],
                is_search: false,
                searchForm:{
                    content:'',
                    id:'',
                    name:'',
                    startTime:'',
                    endTime:'',
                },
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
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                // if (process.env.NODE_ENV === 'development') {
                //     this.url = '/ms/table/list';
                // };
                this.$axios.get('/log/list.do', {
                    params:{
                        startTime:this.timeUtil.renderTime(this.searchForm.startTime),
                        endTime:this.timeUtil.renderTime(this.searchForm.endTime),
                        userId:this.searchForm.userId,
                        content:this.searchForm.content,
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

            formatter(row, column) {
                var date =this.TimestampToDate(row.insertTime)

                return date;
            },

            filterTag(value, row) {
                return row.tag === value;
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





