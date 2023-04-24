<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="电话查询">
                    <a-input-search v-model="phone" allowClear @change="phoneChange"></a-input-search>
                </a-form-item>
                <a-form-item label="姓名查询">
                    <a-input-search v-model="name" allowClear @change="nameChange"></a-input-search>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="openAddModal">新增用户</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data"
                 :rowKey="(record)=>record.customer_id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="operate" slot-scope="record">
                <a-button type="primary" @click="openEditModal(record)">编辑</a-button>
                <a-divider type="vertical"/>
                <a-popconfirm
                    title="确定要删除吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="deleteCustomer(record)">
                    <a-button type="danger" click="#">删除</a-button>
                </a-popconfirm>
            </span>
        </a-table>
        <a-modal title="新增用户" :visible="addCustomerModal.visible" @cancel="cancelAddModal" @ok="okAddModal">
            <a-form>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="姓名">
                            <a-input  v-model="addCustomerModal.form.customer_name"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="电话">
                            <a-input  v-model="addCustomerModal.form.customer_phone"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
        <a-modal title="编辑用户" :visible="editCustomerModal.visible" @cancel="cancelEditModal" @ok="okEditModal">
            <a-form>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="姓名">
                            <a-input v-model="editCustomerModal.form.customer_name"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="电话">
                            <a-input v-model="editCustomerModal.form.customer_phone"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import {deleteCustomerById, getAllUser, insertCustomer, updateCustomer} from '@/api/admin/userApi'
import Util from "@/util/generalMethod";
export default {
    name: "UserPage",
    data(){
        return{
            name: '',
            phone: '',
            table1: {
                loading: false,
                columns: [
                    {
                        title: '顾客编号',
                        align: 'center',
                        dataIndex: 'customer_id'
                    },
                    {
                        title: '姓名',
                        align: 'center',
                        dataIndex:'customer_name'
                    },
                    {
                        title: '电话',
                        align: 'center',
                        dataIndex:'customer_phone'
                    },
                    // {
                    //     title: '年龄',
                    //     align: 'center',
                    //     dataIndex:'age'
                    // },
                    {
                        title: '创建时间',
                        align: 'center',
                        dataIndex: 'create_time'

                    },
                    {
                        title: '操作',
                        align: 'center',
                        scopedSlots: {customRender: 'operate'}
                    }
                ],
                data: [],
                dataCopy: [],
                pagination: {
                    total: 0,
                    pageSize: 14,//每页中显示10条数据
                    //showSizeChanger: true,
                    // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                },
            },
            addCustomerModal:{
                visible:false,
                form:{
                    customer_name:'',
                    customer_phone:'',
                }
            },
            editCustomerModal:{
                visible: false,
                form: {
                    id:'',
                    customer_name:'',
                    customer_phone:'',
                }
            }

        }
    },
    mounted() {
        this.getData()
    },
    methods:{
        getData(){
            let me=this
            getAllUser().then(r=>{
                if(r.status===200&&r.data.length>0){
                    me.table1.data=r.data
                    me.table1.dataCopy=[...r.data]
                }
                }
            )
        },
        /**
         * 电话模糊匹配
         */
        phoneChange() {
            let me = this
            if (this.phone.length > 0) {
                this.table1.data = this.table1.dataCopy.filter(e => {
                    return Util.fuzzyQuery(e.customer_phone, me.phone)
                })
            } else
                this.table1.data = this.table1.dataCopy
        },
        /**
         * 名称模糊匹配
         */
        nameChange() {
            let me = this
            if (this.name.length > 0) {
                this.table1.data = this.table1.dataCopy.filter(e => {
                    return Util.fuzzyQuery(e.customer_name, me.name)
                })
            } else
                this.table1.data = this.table1.dataCopy
        },
        openAddModal(){
            this.addCustomerModal.visible=true
        },
        cancelAddModal(){
            this.addCustomerModal.visible=false
        },
        okAddModal(){
            let me=this
            insertCustomer(me.addCustomerModal.form).then(
                r=>{
                    if(r.data===1){
                        me.$message.success("添加成功")
                    }
                    else
                        me.$message.error("添加失败")
                }
            )


        },
        openEditModal(record){
            this.editCustomerModal.visible=true
            this.editCustomerModal.form={
                id:record.customer_id,
                customer_name:record.customer_name,
                customer_phone:record.customer_phone,
            }
        },
        cancelEditModal(){
            this.editCustomerModal.visible=false
        },
        okEditModal(){
            let me=this
            //me.$message.success("修改成功")
            updateCustomer(me.editCustomerModal.form).then(
                r=>{
                    if(r.data===1){
                        me.$message.success("修改成功")
                    }
                    else
                        me.$message.error("修改失败")
                }
            )
        },
        /**
         * 删除用户
         * @param record
         */
        deleteCustomer(record){
            let me=this
            deleteCustomerById({id:record.customer_id}).then(
                r=>{
                    if(r.data===1){
                        me.$message.success("删除成功")
                    }
                    else
                        me.$message.error("删除失败")
                }
            )
        }

    }
}
</script>

<style scoped>

</style>