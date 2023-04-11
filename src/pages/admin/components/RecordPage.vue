<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="时间">
                    <a-range-picker  :format="timeFormat" v-model="time" size="small" />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="loadTable1">查询</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data" :rowKey="(record)=>record.order_id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="status" slot-scope="text">
                <a-tag :color="table1.status[text][1]" >{{table1.status[text][0]}}</a-tag>
            </span>
            <span slot="money" slot-scope="text">¥{{text}}</span>
            <span slot="action"><a-button type="primary">编辑</a-button></span>
        </a-table>
    </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import {getOrderByTime} from '@/api/admin/recordApi'
export default {
    name: "RecordPage",
    data(){
        return{
            timeFormat: 'YYYY-MM-DD',
            time:[moment('2023-03-15'),moment('2023-04-15')],
            table1:{
                loading:false,
                columns:[
                    {
                        title:'订单编号',
                        align: 'center',
                        dataIndex:'order_id',
                    },
                    {
                        title:'姓名',
                        align: 'center',
                        dataIndex: 'customer_name'
                    },
                    {
                        title:'顾客手机号',
                        align: 'center',
                        dataIndex: 'customer_phone',
                    },
                    {
                        title:'房间名',
                        align: 'center',
                        dataIndex: 'room_name',
                    },
                    {
                        title:'订单状态',
                        align: 'center',
                        dataIndex: 'order_status',
                        scopedSlots:{customRender:'status'}
                    },
                    {
                        title: '入住时间',
                        align: 'center',
                        dataIndex: 'check_in_time',
                        sorter:(a,b)=>{ return a.check_in_time> b.check_in_time? 1 : -1 }
                    },
                    {
                        title:'退房时间',
                        align: 'center',
                        dataIndex: 'check_out_time',
                        sorter:(a,b)=>{ return a.check_out_time> b.check_out_time? 1 : -1 }
                    },
                    {
                        title: '订单创建时间',
                        align: 'center',
                        dataIndex: 'create_time',
                        sorter:(a,b)=>{ return a.create_time> b.create_time? 1 : -1 }
                    },
                    {
                        title: '订单完成时间',
                        align: 'center',
                        dataIndex: 'complete_time',
                        sorter:(a,b)=>{ return a.complete_time> b.complete_time? 1 : -1 }
                    },
                    {
                        title: '入账(元)',
                        align: 'center',
                        dataIndex: 'final_payment_amount',
                        scopedSlots:{customRender:'money'}
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
                    pageSize: 20,//每页中显示10条数据
                    //showSizeChanger: true,
                    // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                },
                status: {
                    '-1':['已退款','red'],
                    '0':['已取消','grey'],
                    '1':['已预定','purple'],
                    '2':['待结账','orange'],
                    '3':['已完成','green']
                }
            },
        }
    },
    mounted() {
        this.loadTable1()
    },
    methods:{
        loadTable1(){
            let me=this
            me.table1.loading=true
            let params={
                start:me.time[0].format('yyyy-MM-DD 00:01'),
                end:me.time[1].format('yyyy-MM-DD 23:59')
            }
            getOrderByTime(params).then(r=>{
                if(r.data.length>0&& r.status===200){
                    me.table1.data=r.data
                    me.table1.loading=r.data
                }
                else {
                    me.table1.data=[]
                    me.table1.loading=[]
                }
                //console.log(r.data)
                me.table1.loading=false
            })
        }

    }
}
</script>

<style scoped>
</style>