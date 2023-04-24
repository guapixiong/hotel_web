<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-17 15:24
-->
<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="时间">
                    <a-range-picker  :format="timeFormat" v-model="time" size="small" />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="getData">查询</a-button>
                </a-form-item>
                <a-form-item label="电话查询">
                    <a-input-search v-model="phone" allowClear @change="phoneChange"></a-input-search>
                </a-form-item>
                <a-form-item label="姓名查询">
                    <a-input-search v-model="name" allowClear @change="nameChange"></a-input-search>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data" :rowKey="(record)=>record.id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="action" slot-scope="record">
<!--                <a-button type="primary">编辑</a-button>-->
            <a-popconfirm
                title="确定要删除吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteOrder(record)"
            >
                    <a-button style="margin-left: 2px" type="danger" >删除</a-button>
                </a-popconfirm></span>
        </a-table>
    </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import {deleteCommodityRecordById, getCommodityRecordByTime} from '@/api/admin/commodityApi'
import Util from "@/util/generalMethod";
export default {
    name: "CommodityRecord",
    data(){
        return{
            name: '',
            phone: '',
            timeFormat: 'YYYY-MM-DD',
            time:[moment(moment().format('YYYY-MM-01')).add(-1,'M'), moment(moment().format('YYYY-MM-01')).add(1,'M')],
            table1:{
                loading:false,
                columns:[
                    {
                      title: '消费编号',
                      align: 'center',
                      dataIndex: 'id'
                    },
                    {
                        title: '房间号码',
                        align: 'center',
                        dataIndex: 'room_number'
                    },
                    {
                        title: '商品名称',
                        align: 'center',
                        dataIndex:'name'
                    },
                    {
                      title: '顾客姓名',
                      align: 'center',
                      dataIndex: 'customer_name'
                    },
                    {
                        title: '顾客电话',
                        align: 'center',
                        dataIndex: 'customer_phone'
                    },
                    {
                        title: '消费状态',
                        align: 'center',
                        dataIndex: 'commodity_status'
                    },
                    {
                        title: '消费数量',
                        align: 'center',
                        dataIndex: 'commodity_count'
                    },
                    {   title: '消费金额',
                        align: 'center',
                        dataIndex: 'money'
                    },
                    {
                        title: '消费创建时间',
                        align: 'center',
                        dataIndex: 'create_time',
                        sorter:(a,b)=>{ return a.create_time> b.create_time? 1 : -1 }
                    },
                    {
                        title: '消费完成时间',
                        align: 'center',
                        dataIndex: 'complete_time',
                        sorter:(a,b)=>{ return a.complete_time> b.complete_time? 1 : -1 }
                    },
                    {
                        title:'操作',
                        scopedSlots:{customRender:'action'}
                    }
                ],
                data:[],
                dataCopy:[],
                pagination: {
                    total: 0,
                    pageSize: 14,//每页中显示10条数据
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
            getCommodityRecordByTime({
                start:me.time[0].format('YYYY-MM-DD 00:01'),
                end:me.time[1].format('YYYY-MM-DD 23:59')
            }).then(r=>{
                if(r.status===200&&r.data.length>0){
                    me.table1.data=r.data
                    me.table1.dataCopy=[...r.data]
                }
            })
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
        deleteOrder(record){
            let me=this
            deleteCommodityRecordById({id:record.id}).then(r=>{
                if(r.data===1){
                    me.$message.success("删除成功")
                }
                else
                    me.$message.error("删除失败")
            })
        }
    }
}
</script>

<style scoped>

</style>