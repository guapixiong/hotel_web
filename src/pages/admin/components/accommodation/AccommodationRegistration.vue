<template>
    <div>
        <a-card style="height: 100px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="时间">
                    <a-range-picker :format="timeFormat" v-model="time"/>
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
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data"
                 :rowKey="(record)=>record.order_id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="status" slot-scope="text">
                <a-tag :color="table1.status[text][1]">{{ table1.status[text][0] }}</a-tag>
            </span>
            <span slot="money" slot-scope="text">¥{{ text }}</span>
            <span slot="action" slot-scope="record">
                <a-button v-show="record.order_status==='1'" type="primary"
                          @click="goToCheckin(record.order_id)">入住</a-button>
                <a-popconfirm title="确定要取消吗?" ok-text="确定" cancel-text="取消" @confirm="cancelOrder(record.order_id)">
                    <a-button style="margin-left: 5px" v-show="record.order_status==='1'"
                           click="#">取消预约</a-button>
                </a-popconfirm>
                <a-button v-show="record.order_status==='2'" type="primary"
                          @click="billPlease(record.order_id)">结账</a-button>
                <a-button v-show="record.order_status==='2'" style="margin-left: 5px" @click="goToCommodityAdd(record.order_id)">添加商品</a-button>
                <a-button style="margin-left: 5px" @click="orderDetails(record.order_id)">详情</a-button>
            </span>
        </a-table>
        <a-modal title="入住登记" :visible="identityRegistrationModal.visible" @cancel="cancelIdentityRegistrationModal"
                 @ok="destineCheckIn">
            <div v-for="(item,index) in identityRegistrationModal.occupants" :key="index">
                <a-card style="margin-top: 2px">
                    <a-input style="width: 200px;margin-left: 5px" v-model="item.name" placeholder="姓名"></a-input>
                    <a-input style="width: 200px ;margin-left: 5px" v-model="item.cardId" placeholder="身份证号"></a-input>
                    <a-select style="width: 200px ;margin: 5px" v-model="item.type">
                        <a-select-option value="0">居民身份证</a-select-option>
                        <a-select-option value="1">临时身份证</a-select-option>
                        <a-select-option value="2">港澳台身份证</a-select-option>
                    </a-select>
                </a-card>
            </div>
            <a-button type="primary" @click="addOccupant">添加</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="deleteOccupant">删除</a-button>
        </a-modal>
    </div>
</template>

<script>
import moment from 'moment'

moment.locale('zh-cn')
import {getOrderByTime, addBookAStayInfo, cancelOrderById} from '@/api/admin/recordApi'
import {getAllInfo,getCommodityType} from '@/api/admin/commodityApi'
import Util from '@/util/generalMethod'

export default {
    name: "AccommodationRegistration",
    data() {
        return {
            timeFormat: 'YYYY-MM-DD',
            time: [moment('2023-03-01'), moment('2023-04-30')],
            selectStatus: 'all',
            statusList: [{id: '-1', value: '已退款'}, {id: '0', value: '已取消'}, {id: '1', value: '已预定'}, {
                id: '2',
                value: '待结账'
            }, {id: '3', value: '已完成'}],
            name: '',
            phone: '',
            table1: {
                loading: false,
                columns: [
                    {
                        title: '订单编号',
                        align: 'center',
                        dataIndex: 'order_id',
                    },
                    {
                        title: '姓名',
                        align: 'center',
                        dataIndex: 'customer_name'
                    },
                    {
                        title: '顾客手机号',
                        align: 'center',
                        dataIndex: 'customer_phone',
                    },
                    {
                        title: '房间名',
                        align: 'center',
                        dataIndex: 'room_number',
                    },
                    {
                        title: '订单状态',
                        align: 'center',
                        dataIndex: 'order_status',
                        scopedSlots: {customRender: 'status'}
                    },
                    {
                        title: '入住时间',
                        align: 'center',
                        dataIndex: 'check_in_time',
                        sorter: (a, b) => {
                            return a.check_in_time > b.check_in_time ? 1 : -1
                        }
                    },
                    {
                        title: '退房时间',
                        align: 'center',
                        dataIndex: 'check_out_time',
                        sorter: (a, b) => {
                            return a.check_out_time > b.check_out_time ? 1 : -1
                        }
                    },
                    {
                        title: '订单创建时间',
                        align: 'center',
                        dataIndex: 'create_time',
                        sorter: (a, b) => {
                            return a.create_time > b.create_time ? 1 : -1
                        }
                    },
                    {
                        title: '订单完成时间',
                        align: 'center',
                        dataIndex: 'complete_time',
                        sorter: (a, b) => {
                            return a.complete_time > b.complete_time ? 1 : -1
                        }
                    },
                    {
                        title: '入账(元)',
                        align: 'center',
                        dataIndex: 'final_payment_amount',
                        scopedSlots: {customRender: 'money'}
                    },
                    {
                        title: '操作',
                        scopedSlots: {customRender: 'action'}
                    }
                ],
                data: [],
                dataCopy: [],
                pagination: {
                    total: 0,
                    pageSize: 20,//每页中显示10条数据
                    //showSizeChanger: true,
                    // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                },
                status: {
                    '-1': ['已退款', 'red'],
                    '0': ['已取消', 'grey'],
                    '1': ['已预定', 'purple'],
                    '2': ['待结账', 'orange'],
                    '3': ['已完成', 'green']
                }
            },
            identityRegistrationModal: {
                order_id: '',
                roomFee:'',
                deposit:'',
                visible: false,
                occupants: [{name: '', cardId: '', type: '0'}],
            },
            commodityAddModal:{
                visible:false,
                order_id:'',
                commodity:[{commodity_id:'',commodity_count:1}],
                data:[],  //商品列表
                commoditySelection:[],
                columns:[
                    {
                    title:'名称',
                    dataIndex:'name',
                    align:'center',
                },
                    {
                        title: '商品种类',
                        align: 'center',
                        dataIndex: 'type',
                        scopedSlots: {customRender: 'type'}
                    },
                    {
                        title: '商品价格',
                        align: 'center',
                        dataIndex: 'price',
                        scopedSlots: {customRender: 'price'}
                    },
                    {
                        title: '商品数量',
                        align: 'center',
                        dataIndex: 'amount'
                    },
                    {
                        title: '商品图片',
                        align: 'center',
                        dataIndex: 'commodity_url',
                        scopedSlots: {customRender: 'url'}
                    },
                    {
                        title: '商品介绍',
                        align: 'center',
                        dataIndex: 'commodity_introduction'
                    },
                ],
                pagination: {
                    total: 0,
                    pageSize: 6,//每页中显示10条数据
                    //showSizeChanger: true,
                    // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                },
            }

        }
    },
    mounted() {
        this.loadTable1()
    },
    methods: {
        loadTable1() {
            let me = this
            me.table1.loading = true
            let params = {
                start: me.time[0].format('yyyy-MM-DD 00:01'),
                end: me.time[1].format('yyyy-MM-DD 23:59')
            }
            getOrderByTime(params).then(r => {
                if (r.data.length > 0 && r.status === 200) {
                    me.table1.data = r.data//.filter((e) => e.order_status === '1')  //只拿已预定的订单从而实现快速入住
                    me.table1.dataCopy = [...me.table1.data]
                } else {
                    me.table1.data = []
                    me.table1.dataCopy = []
                }
                //console.log(r.data)
                me.table1.loading = false
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
        goToFastCheckIn() {
            this.$router.push({path: '/accommodation/fastCheckIn'});
        },
        /**
         * 打开身份登记对话框
         */
        openIdentityRegistrationModal(id) {
            this.identityRegistrationModal.order_id = id
            this.identityRegistrationModal.visible = true
        },
        cancelIdentityRegistrationModal() {
            this.identityRegistrationModal.visible = false
        },
        addOccupant() {
            this.identityRegistrationModal.occupants.push({name: '', cardId: '', type: '0'})
        },
        deleteOccupant() {
            this.identityRegistrationModal.occupants.pop()
        },
        /**
         * 预定入住
         */
        destineCheckIn() {
            let me = this
            let params = {
                record_id: me.identityRegistrationModal.order_id,
                occupants: me.identityRegistrationModal.occupants
            }
            addBookAStayInfo(params).then(r => {
                if (r.status === 200 && r.data === 1) {
                    me.$message.success("添加成功")
                    me.identityRegistrationModal.visible = false
                } else
                    me.$message.success("添加失败")
            })
        },
        /**
         * 取消订单
         */
        cancelOrder(id) {
            let me = this
            cancelOrderById({id: id}).then(r => {
                if (r.status === 200 && r.data === 1) {
                    me.$message.success("取消成功")
                } else
                    me.$message.error("取消失败")
            })
        },
        /**
         * 打开商品对话框
         */
        openCommodityAddModal(id){
            let me=this
            this.commodityAddModal.order_id=id
            me.commodityAddModal.visible=true
            getAllInfo().then(r=>{
                if(r.data.length>0){
                    me.commodityAddModal.data=r.data
                }
            })

        },
        cancelCommodityAddModal(){
            this.commodityAddModal.visible=false
        },
        /**
         * 跳转到入住界面
         * @param id
         */
        goToCheckin(id){
            this.$router.push({
                path:`/accommodation/checkIn/${id}`
            })
        },
        /**
         * 跳转到商品添加页面
         * @param id
         */
        goToCommodityAdd(id){
            this.$router.push({
                path:`/accommodation/commodityAdd/${id}`
            })
        },

        /**
         * 结账
         */
        billPlease(id) {
            this.$router.push({
                path:`/accommodation/checkoutPage/${id}`
            })

        },
        /**
         * 订单详情
         */
        orderDetails(id){
            this.$router.push({
                path:`/accommodation/orderDetails/${id}`
            })
        }
    }
}
</script>

<style scoped>
</style>