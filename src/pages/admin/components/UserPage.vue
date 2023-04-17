<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="姓名">
                    <a-input-search v-model="selectContent" :allowClear=true @change="contentChange"></a-input-search>
                </a-form-item>
                <a-form-item label="电话">
                    <a-input-search></a-input-search>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="addRoomModal">新增用户</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data"
                 :rowKey="(record)=>record.customer_id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="operate" slot-scope="record">
                <a-button type="primary" @click="editRoom(record)">编辑</a-button>
                <a-divider type="vertical"/>
                <a-popconfirm
                    title="确定要删除吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="deleteRoom(record)">
                    <a-button type="danger" click="#">删除</a-button>
                </a-popconfirm>
            </span>
        </a-table>
    </div>
</template>

<script>
import {getAllUser} from '@/api/admin/userApi'
export default {
    name: "UserPage",
    data(){
        return{
            table1: {
                loading: false,
                columns: [
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
                    {
                        title: '年龄',
                        align: 'center',
                        dataIndex:'age'
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
                    pageSize: 10,//每页中显示10条数据
                    //showSizeChanger: true,
                    // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                },
            },

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
        }

    }
}
</script>

<style scoped>

</style>