<template>
    <div>
        <a style="color: #C081FF" @click="goBack"><a-icon type="double-left" />返回</a>
        <template v-if="calculatePay>0">
            <span style="margin-left: 30px" >还需付款：¥{{calculatePay}}</span>
<!--            <a-input-number placeholder="输入金额"></a-input-number>-->
        </template>
        <template v-else>
            <span style="margin-left: 30px" >退还押金：¥{{-calculatePay}}</span>
        </template>
        <a-button style="margin-left: 30px;width: 200px" type="primary" @click="checkoutOperate">结账</a-button>
        <a-card style="height: 150px;margin: 10px;border-radius: 5px">
            <p>订单信息</p>
            <div style="margin-left: 20px">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :span="6">
                            <a-form-item label="订单编号" >{{details.order_id}}</a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="订单状态"><a-tag :color="status1[details.order_status][1]" >{{status1[details.order_status][0]}}</a-tag></a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="入住时间">{{ details.check_in_time }}</a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="退房时间">{{ details.check_out_time }}</a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="6">
                            <a-form-item label="订单创建时间">{{ details.create_time }}</a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="订单完成时间">{{ details.complete_time }}</a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="应付金额">¥{{ getTotalAmount }}</a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="实付金额">¥{{ details.final_payment_amount }}</a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </a-card>
        <a-card style="height: 230px;margin: 10px;border-radius: 5px">
            <p>房间信息</p>
            <div style="margin-left: 20px">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :span="6">
                            <a-form-item label="房间号码">{{ details.room_number }}</a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="房间类型">{{ details.type }}</a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="住房类型">{{ details.room_type !=='1' ? '标准房':'钟点房'}}</a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="房间价格">¥{{ details.room_price }}</a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-item label="钟点房价格">¥{{ details.hour_price }}</a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="房间押金">¥{{ details.deposit }}</a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-item label="房间图片"><img style="width: 140px;height: 80px" :src="details.room_url"></a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="房间介绍">{{ details.room_introduction }}</a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </a-card>
        <a-card style="height: 270px;margin: 10px;border-radius: 5px">
            <p>顾客信息</p>
            <div style="margin-left: 20px" >
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-item label="顾客姓名">{{ details.customer_name }}</a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="联系方式">{{ details.customer_phone }}</a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
                <div style="height: 120px">
                    <a-table  :columns="columns1" :dataSource="occupantData" :rowKey="(record)=>record.id" :scroll="{  y: 80 }" size="small">
                        <span slot="type" slot-scope="text">{{type[text]}}</span>
                    </a-table>
                </div>

            </div>
        </a-card>
        <a-card style="height: 220px;margin: 10px;border-radius: 5px">
            <p>商品信息</p>
            <div style="margin-left: 20px;height: 180px">

                <a-table  :columns="columns" :dataSource="commodityData" :rowKey="(record,index)=>index" :scroll="{  y: 80 }" size="small">
                    <span slot="price" slot-scope="text">¥{{text}}</span>
                    <span slot="money" slot-scope="text">¥{{text}}</span>
                </a-table>
            </div>
        </a-card>
    </div>
</template>

<script>
import {
    checkoutByOrderId,
    getCommodityRecordByOrderId,
    getCustomerByRecordId,
    getOrderDetailById
} from "@/api/admin/recordApi";
import moment from "moment";
moment.locale('zh-cn')
export default {
    name: "CheckoutPage",
    data(){
        return{
            orderId:'',
            details:{
                order_id:'',
                order_status:'0',
                check_in_time:'',
                check_out_time:'',
                create_time:'',
                complete_time:'',
                final_payment_amount:0.0,
                room_number:'',
                type:'',
                room_type:'',
                room_price:'',
                hour_price:'',
                deposit:0.0,
                room_url:'',
                room_introduction:'',
                customer_name:'',
                customer_phone:'',
            },
            roomFee:0.0,
            status1: {
                '-1':['已退款','red'],
                '0':['已取消','grey'],
                '1':['已预定','purple'],
                '2':['待结账','orange'],
                '3':['已完成','green']
            },
            commodityData:[],
            commodityRecordId:[],
            commodityDataCopy:[],
            columns:[
                {
                    title:'商品名称',
                    align:'center',
                    dataIndex:'name',
                },
                {
                    title: '数量',
                    align: 'center',
                    dataIndex: 'commodity_count',
                },
                {
                    title: '单价',
                    align: 'center',
                    dataIndex: 'price',
                    scopedSlots: {customRender: 'price'}
                },
                {
                    title: '创建时间',
                    align: 'center',
                    dataIndex: 'create_time'
                },
                {
                    title: '完成时间',
                    align: 'center',
                    dataIndex: 'complete_time',
                },
                {
                    title: '消费金额',
                    align: 'center',
                    dataIndex: 'money',
                    scopedSlots: {customRender: 'money'}
                }
            ],
            commodityFee:0.0,
            payExtra:0.0,//如果押金少于消费金额，需额外付款，如果押金大于消费金额需退押金多少元
            columns1:[
                {
                    title:'姓名',
                    align:'center',
                    dataIndex:'name'
                },
                {
                    title:'身份证号',
                    align:'center',
                    dataIndex: 'card_id'
                },
                {
                    title: '身份证类型',
                    align: 'center',
                    dataIndex: 'type',
                    scopedSlots: {customRender: 'type'}
                },
                {
                    title: '登记时间',
                    align: 'center',
                    dataIndex: 'register_time'
                },
                {
                    title:'离店时间',
                    align: 'center',
                    dataIndex: 'leave_time'
                }
            ],
            occupantData:[],
            type:["居民身份证","临时身份证","港澳台身份证"]
        }
    },
    computed:{
        getTotalAmount(){
            return this.roomFee+this.commodityFee
        },
        calculatePay(){
            if(this.details.deposit==undefined){
                    return (this.getTotalAmount-this.details.final_payment_amount).toFixed(2)  //还需补多少元
            }
            else{
                    return (this.getTotalAmount-(this.details.final_payment_amount+this.details.deposit)).toFixed(2)
            }
        }
    },
    mounted() {
        this.orderId=this.$route.params.id
        this.getData()
    },
    methods:{
        /**
         * 通过订单编号来获取订单详细信息
         */
        getData(){
            let me=this
            getOrderDetailById({orderId:me.orderId}).then(r=>{
                if(Object.keys(r.data).length>0){
                    me.details=r.data
                }
                if(r.data.room_type=='0'){
                    me.roomFee=Math.round(moment(r.data.check_out_time).diff(moment(r.data.check_in_time),"days",true))*r.data.room_price
                }else
                    me.roomFee=r.data.hour_price

                //console.log(r.data)
            })
            getCommodityRecordByOrderId({orderId:me.orderId}).then(r=>{
                if(r.data.length>0){
                    me.commodityData=r.data
                    me.commodityData.forEach(e=>{
                        me.commodityRecordId.push(e.id)
                        me.commodityFee+=e.money
                    })
                }
                //console.log(r.data)
            })
            getCustomerByRecordId({orderId:me.orderId}).then(r=>{
                if(r.data.length>0){
                    me.occupantData=r.data
                }
            })
        },
        /**
         * 结账操作
         */
        checkoutOperate(){
            let me=this

            let params={
                order_id:me.orderId,
                payment:me.getTotalAmount,
                commodityRecordIds:me.commodityRecordId
            }
            checkoutByOrderId(params).then(r=>{
                if(r.status===200&&r.data===1){
                    me.$message.success("结账成功")
                }
                else
                    me.$message.error("结账失败")
            })


        },
        /**
         * 返回
         */
        goBack(){
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>

</style>