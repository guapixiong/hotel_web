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
                <a-form-item label="订单状态">
                    <a-select v-model="selectStatus" style="width: 100px;" @change="statusChange">
                        <a-select-option key="all" value="all">全部</a-select-option>
                        <a-select-option v-for="item in statusList" :key="item.id" :value="item.id">{{ item.value }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="电话查询">
                    <a-input-search v-model="phone" allowClear @change="phoneChange"></a-input-search>
                </a-form-item>
                <a-form-item label="姓名查询">
                    <a-input-search v-model="name" allowClear @change="nameChange"></a-input-search>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data" :rowKey="(record)=>record.order_id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="status" slot-scope="text">
                <a-tag :color="table1.status[text][1]" >{{table1.status[text][0]}}</a-tag>
            </span>
            <span slot="money" slot-scope="text">¥{{text}}</span>
            <span slot="action" slot-scope="record">
                <a-button type="primary"  @click="openEditModal(record)">编辑</a-button>
                <a-popconfirm
                    title="确定要删除吗?会删除相关所有记录"
                    ok-text="确定"
                    cancel-text="取消"
                    confirm="#"
                >
                    <a-button style="margin-left: 2px" type="danger" click="#">删除</a-button>
                </a-popconfirm>
            </span>

        </a-table>
        <a-modal title="订单编辑" :visible="editModalVisible" @cancel="cancelEdit">
            <a-form>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="订单编号"><a-input v-model="orderItem.order_id" disabled></a-input></a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="订单状态">
                            <a-select v-model="orderItem.order_status" >
                                <a-select-option v-for="item in statusList" :key="item.id" :value="item.id">{{ item.value }}
                            </a-select-option>
                        </a-select></a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="姓名"><a-input v-model="orderItem.customer_name" disabled></a-input></a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="电话"><a-input v-model="orderItem.customer_phone" disabled></a-input></a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="房间名"><a-input v-model="orderItem.room_number" disabled></a-input></a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="付款金额"><a-input prefix="¥" v-model="orderItem.final_payment_amount" ></a-input></a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="入住时间"><a-input v-model="orderItem.check_in_time" ></a-input></a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="退房时间"><a-input v-model="orderItem.check_out_time" ></a-input></a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="订单创建时间"><a-input v-model="orderItem.create_time" disabled></a-input></a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="订单完成时间"><a-input v-model="orderItem.complete_time" ></a-input></a-form-item>
                    </a-col>
                </a-row>

            </a-form>
        </a-modal>
    </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import {getOrderByTime} from '@/api/admin/recordApi'
import Util from "@/util/generalMethod";
export default {
    name: "RecordPage",
    data(){
        return{
            timeFormat: 'YYYY-MM-DD',
            time:[moment(moment().format('YYYY-MM-01')).add(-1,'M'), moment(moment().format('YYYY-MM-01')).add(1,'M')],
            selectStatus: 'all',
            statusList: [{id: '-1', value: '已退款'}, {id: '0', value: '已取消'}, {id: '1', value: '已预定'}, {
                id: '2',
                value: '待结账'
            }, {id: '3', value: '已完成'}],
            name: '',
            phone: '',
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
            orderItem:{
                order_id:'',
                customer_name:'',
                customer_phone:'',
                room_number:'',
                order_status:'',
                check_in_time:'',
                check_out_time:'',
                create_time:'',
                complete_time:'',
                final_payment_amount:'',
            },
            editModalVisible:false,
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
                    me.table1.dataCopy=r.data
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
        statusChange() {
            let me = this
            if (me.selectStatus === 'all')
                this.table1.data = this.table1.dataCopy.filter(() => true);
            else
                this.table1.data = this.table1.dataCopy.filter((e) => e.order_status === me.selectStatus);
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
        /**
         * 打开编辑对话框
         * @param record
         */
        openEditModal(record){
            this.orderItem=record
            this.editModalVisible=true
        },
        /**
         * 取消编辑
         */
        cancelEdit(){
            this.editModalVisible=false
        }

    }
}
</script>

<style scoped>
</style>