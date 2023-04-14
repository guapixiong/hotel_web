<template>
    <div>
        <a-card style="height: 150px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="时间">
                    <a-range-picker  :format="timeFormat" v-model="time"  />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="loadTable1">查询</a-button>
                </a-form-item>
                <a-form-item label="订单状态">
                    <a-select v-model="selectStatus"  style="width: 100px;" @change="statusChange">
                        <a-select-option key="all" value="all">全部</a-select-option>
                        <a-select-option v-for="item in statusList" :key="item.id" :value="item.id">{{item.value}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="电话查询">
                    <a-input-search v-model="phone" allowClear @change="phoneChange"></a-input-search>
                </a-form-item>
                <a-form-item label="姓名查询">
                    <a-input-search v-model="name" allowClear @change="nameChange"></a-input-search>
                </a-form-item>
            </a-form>
            <a-form layout="inline">
                <a-form-item label="入住操作">
                    <a-button type="primary" @click="openCheckInModal" >快速入住</a-button>
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
import Util from '@/util/generalMethod'
import {getAvailableRoomByTime, getTypeInfo} from "@/api/admin/roomApi";
export default {
    name: "AccommodationRegistration",
    data(){
        return{
            timeFormat: 'YYYY-MM-DD',
            time:[moment('2023-03-15'),moment('2023-04-15')],
            selectStatus:'all',
            statusList:[{id:'-1',value:'已退款'},{id:'0',value: '已取消'},{id:'1',value: '已预定'},{id:'2',value:'待结账'},{id:'3',value: '已完成'}],
            name:'',
            phone:'',
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
                        dataIndex: 'room_number',
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
                    me.table1.data=r.data//.filter((e) => e.order_status === '1')  //只拿已预定的订单从而实现快速入住
                    me.table1.dataCopy=[...me.table1.data]
                }
                else {
                    me.table1.data=[]
                    me.table1.dataCopy=[]
                }
                //console.log(r.data)
                me.table1.loading=false
            })
        },
        /**
         * 状态改变
         */
        statusChange(){
            let me=this
            if(me.selectStatus==='all')
                this.table1.data = this.table1.dataCopy.filter(() => true);
            else
                this.table1.data = this.table1.dataCopy.filter((e) => e.order_status === me.selectStatus);
        },
        /**
         * 电话模糊匹配
         */
        phoneChange(){
            let me= this
            if(this.phone.length>0){
                this.table1.data=this.table1.dataCopy.filter(e=>{return Util.fuzzyQuery(e.customer_phone,me.phone)
                })
            }
            else
                this.table1.data=this.table1.dataCopy
        },
        /**
         * 名称模糊匹配
         */
        nameChange(){
            let me= this
            if(this.name.length>0){
                this.table1.data=this.table1.dataCopy.filter(e=>{return Util.fuzzyQuery(e.customer_name,me.name)
                })
            }
            else
                this.table1.data=this.table1.dataCopy

        },
    }
}
</script>

<style scoped>
</style>