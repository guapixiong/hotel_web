<template>
    <div>
        <a-card style="height: 200px;margin: 20px;border-radius: 5px">
            <p style="font-weight: bold;font-size: 16px">经营概况</p>
            <a-row :gutter="[24,24]">
                <a-col span="6">
                    <a-card
                        style="width: auto;height: 120px;background: linear-gradient(to left,#7F87FE,#09BDFE);border-radius: 8px ">
                        <div style="text-align: left;margin-left: 30px;font-size: 16px;color: white">
                            <p>房间总数</p>
                            <span style="font-size: 20px;">{{ totalNumberOfRooms }}</span>
                        </div>
                    </a-card>
                </a-col>
                <a-col span="6">
                    <a-card
                        style="width: auto;height: 120px;background: linear-gradient(to left,#01A7F0,#09BDFE);border-radius: 8px ">
                        <div style="text-align: left;margin-left: 30px;font-size: 16px;color: white">
                            <p>今日客流量</p>
                            <span style="font-size: 20px;">{{ customerFlow.total }}</span>
                            <p>较昨日{{customerFlow.relatively>=0?('🔼'+customerFlow.relatively+'%'):('🔽'+customerFlow.relatively+'%')}}</p>
                        </div>
                    </a-card>
                </a-col>
                <a-col span="6">
                    <a-card
                        style="width: auto;height: 120px;background: linear-gradient(to left,#FCC687,#F286A0);border-radius: 8px ">
                        <div style="text-align: left;margin-left: 30px;font-size: 16px;color: white">
                            <p>今日总收入</p>
                            <span style="font-size: 20px;">{{sales.total}}</span>
                            <p>较昨日{{sales.relatively>=0?('🔼'+sales.relatively+'%'):('🔽'+sales.relatively+'%')}}</p>
                        </div>
                    </a-card>
                </a-col>
                <a-col span="6">
                    <a-card
                        style="width: auto;height: 120px;background: linear-gradient(to left,#FBC2EB,#A18CD1);border-radius: 8px ">
                        <div style="text-align: left;margin-left: 30px;font-size: 16px;color: white">
                            <p>今日订单量</p>
                            <span style="font-size: 20px;">{{ order.total }}</span>
                            <p>较昨日{{order.relatively>=0?('🔼'+order.relatively+'%'):('🔽'+order.relatively+'%')}}</p>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </a-card>
        <div style="margin: 20px;">
            <a-row  :gutter="100">
                <a-col span="6">
                    <a-card style="width: 400px;height: 320px;border-radius: 5px"></a-card>
                </a-col>
                <a-col span="6">
                    <a-card style="width: 400px;height: 320px;border-radius: 5px"></a-card>
                </a-col>
                <a-col span="12">
                    <a-card style="width: auto;height: 320px;border-radius: 5px"></a-card>
                </a-col>
            </a-row>
        </div>
        <a-card style="height: 380px;margin: 10px;border-radius: 5px">
            <p style="font-weight: bold;font-size: 16px">用户画像</p>
            <a-row>
                <a-col span="12">客户性别占比</a-col>
                <a-col span="12">人群年龄占比</a-col>
            </a-row>
        </a-card>
    </div>
</template>

<script>
import {getCustomerFlowByTime, getRecordTotal, getRoomTotal, getSalesByTime} from '@/api/admin/frontApi'
import moment from 'moment'
moment.locale('zh-cn')
import Util from "@/util/generalMethod";
import _ from 'lodash'
export default {
    name: "FrontPage",
    data(){
        return{
            totalNumberOfRooms:0,//房间总数
            customerFlow:{//客流量
                total:0,
                relatively:0,
            },
            sales:{  //销售额
                total:0,
                relatively: 0
            },
            order:{
                total:0,
                relatively:0
            }



        }
    },
    mounted() {
        //console.log(this.order)
        this.loadData()
    },
    methods:{
        //加载页面数据
        loadData(){
            let me=this
            getRoomTotal().then(r=>{
                if(r.status===200)
                    me.totalNumberOfRooms=r.data
            })
            //let start=moment().add(-1,'days')
            //let end=moment()
            //测试数据
            let start=moment("2023-04-03 00:01")
            let end=moment('2023-04-03 23:59')
            let param={
                start:start.format('yyyy-MM-DD 00:01'),
                end:end.format('yyyy-MM-DD 23:59')
            }
            //console.log(param)
            getCustomerFlowByTime(param).then((r)=>{
                if(r.status===200 && r.data.length>0){
                    let old=0
                    let current=0
                    let processData=_.groupBy(r.data,'time')
                    if(processData[start.format('yyyy-MM-DD')]!==undefined){
                        old=processData[start.format('yyyy-MM-DD')].length
                    }
                    if(processData[end.format('yyyy-MM-DD')]!==undefined){
                        current=processData[end.format('yyyy-MM-DD')].length
                    }
                    me.customerFlow.total=current
                    me.customerFlow.relatively=Util.getPercentValue([old,current],1,0)-Util.getPercentValue([old,current],0,0)
                    //console.log(processData)
                }
            })
            getSalesByTime(param).then(r=>{
                if(r.status===200 && r.data.length>0){
                    let old=0
                    let current=0
                    let processData=_.groupBy(r.data,'time')
                    if(processData[start.format('yyyy-MM-DD')]!==undefined){
                        processData[start.format('yyyy-MM-DD')].forEach(e=>{old+=e.final_payment_amount})
                    }
                    if(processData[end.format('yyyy-MM-DD')]!==undefined){
                        processData[end.format('yyyy-MM-DD')].forEach(e=>current+=e.final_payment_amount)
                    }
                    me.sales.total=current
                    me.sales.relatively=Util.getPercentValue([old,current],1,0)-Util.getPercentValue([old,current],0,0)
                    //console.log(r.data)
                }
            })
            getRecordTotal(param).then(r=>{
                if(r.status===200 && r.data.length>0){
                    let old=0
                    let current=0
                    let processData=_.groupBy(r.data,'time')
                    if(processData[start.format('yyyy-MM-DD')]!==undefined){
                        old=processData[start.format('yyyy-MM-DD')].length
                    }
                    if(processData[end.format('yyyy-MM-DD')]!==undefined){
                        current=processData[end.format('yyyy-MM-DD')].length
                    }
                    me.order.total=current
                    me.order.relatively=Util.getPercentValue([old,current],1,0)-Util.getPercentValue([old,current],0,0)
                }
            })

        },
    },



}
</script>

<style scoped>

</style>