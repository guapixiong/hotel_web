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
                <a-col span="8">
                    <a-card style="width: 400px;height: 400px;border-radius: 5px">
                        <p style="font-weight: bold;font-size: 16px">订单状态占比</p>
                        <a-range-picker  :format="chart1.timeFormat" v-model="chart1.time" size="small" @change="chart1TimeChange"/>
                        <div style="width: 350px;height: 280px" id="chart1">
                        </div>
                    </a-card>
                </a-col>
                <a-col span="16">
                    <a-card style="width: auto;height: 400px;border-radius: 5px">
                        <p style="font-weight: bold;font-size: 16px">入账记录</p>
                        <a-range-picker  :format="chart2.timeFormat" v-model="chart2.time" size="small" @change="chart2TimeChange"/>
                        <div style="height: 280px;width: 800px" id="chart2">

                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </div>
        <a-card style="height: 380px;margin: 20px;border-radius: 5px">
            <p style="font-weight: bold;font-size: 16px">客流量</p>
            <a-row :gutter="100">
                <a-col span="12">
                    <p style="font-weight: bold;font-size: 16px">  <a-range-picker  :format="chart3.timeFormat" v-model="chart3.time" size="small" @change="chart3TimeChange"/></p>

                    <div style="height: 320px;width: 1000px" id="chart3">

                    </div>
                </a-col>
<!--                <a-col span="12">人群年龄占比</a-col>-->
            </a-row>
        </a-card>
    </div>
</template>

<script>
import {getCustomerFlowByTime, getRecordTotal, getRoomTotal, getSalesByTime} from '@/api/admin/frontApi'
import moment from 'moment'
moment.locale('zh-cn')
import Util from "@/util/generalMethod";
import * as echarts from 'echarts';
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
            },
            colorList:['#009DFF','#22E4FF','#4985F0','#04E38A','#9DFF86'],
            chart1:{
                timeFormat: 'YYYY-MM-DD',
                time:[moment(moment().format('YYYY-MM-01')), moment(moment().format('YYYY-MM-01')).add(1,'M')],
            },
            chart2:{
                timeFormat: 'YYYY-MM-DD',
                time:[moment(moment().format('YYYY-MM-01')), moment(moment().format('YYYY-MM-01')).add(1,'M')],
            },
            chart3:{
                timeFormat: 'YYYY-MM-DD',
                time:[moment(moment().format('YYYY-MM-01')), moment(moment().format('YYYY-MM-01')).add(1,'M')],
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
            //console.log(''||null)
            getRoomTotal().then(r=>{
                if(r.status===200)
                    me.totalNumberOfRooms=r.data
            })
            let start=moment().add(-1,'days')
            let end=moment()
            //测试数据
            // let start=moment("2023-04-03 00:01")
            // let end=moment('2023-04-03 23:59')
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
            getRecordTotal({
                start:me.chart1.time[0].format('yyyy-MM-DD'),
                end:me.chart1.time[1].format('yyyy-MM-DD')
            }).then(r=>{
                let data=[{value:0,name:'已退款'},{value:0,name:'已取消'},{value:0,name:'已预定'},{value:0,name:'待结账'},{value:0,name:'已完成'},]
                if(r.data.length>0){
                    r.data.forEach(e=>{
                        data[parseInt(e.order_status)+1].value++
                    })
                }
                me.drawChart1(data)
            })
            getSalesByTime({
                start:me.chart2.time[0].format('yyyy-MM-DD'),
                end:me.chart2.time[1].format('yyyy-MM-DD')
            }).then(r=>{
                if(r.data.length>0){
                    let processData=_.groupBy(r.data,'time')
                    let data={columns:[],data:[]}
                    //console.log(processData)
                    for(let key in processData){
                        data.columns.push(key)
                        let count=0.0
                        processData[key].forEach(e=>{
                            count+=e.final_payment_amount
                        })
                        data.data.push(count)
                    }
                    //console.log(data)
                    me.drawChart2(data)
                    //console.log(r.data)
                }
            })
            getCustomerFlowByTime({
                start:me.chart3.time[0].format('yyyy-MM-DD'),
                end:me.chart3.time[1].format('yyyy-MM-DD')
            }).then(r=>{
                if(r.data.length>0){
                    //console.log(r.data)
                    let processData=_.groupBy(r.data,'time')
                    let data={columns:[],data:[]}
                    for(let key in processData){
                        data.columns.push(key)
                        let count=processData[key].length
                        data.data.push(count)
                    }
                    this.drawChart3(data)
                }
            })
        },
        chart1TimeChange(){
            let me=this
            getRecordTotal({
                start:me.chart1.time[0].format('yyyy-MM-DD'),
                end:me.chart1.time[1].format('yyyy-MM-DD')
            }).then(r=>{
                //console.log(r)
                let data=[{value:0,name:'已退款'},{value:0,name:'已取消'},{value:0,name:'已预定'},{value:0,name:'待结账'},{value:0,name:'已完成'},]
                if(r.data.length>0){
                    r.data.forEach(e=>{
                        data[parseInt(e.order_status)+1].value++
                    })
                }
                me.drawChart1(data)
            })
        },
        drawChart1( data){
            let me=this
            echarts.dispose(document.getElementById('chart1'))
            let myChart=echarts.init(document.getElementById('chart1'))
            myChart.showLoading()
            let option={
                legend:{
                    data: ['已退款', '已取消', '已预定', '待结账', '已完成'],
                    top: '1%',
                    left: 'center'
                },
                tooltip:{
                    trigger:'item'
                },

                series:[{
                    type:'pie',
                    radius:['40%', '70%'],
                    data:data,
                    itemStyle:{
                        //color:'#009DFF'
                        color:function (arg){
                            return me.colorList[arg.dataIndex]
                        }
                    },
                    label:{
                        formatter:function (arg){
                            return arg.data.value+'个'
                        }
                    }
                }]
            }
            myChart.setOption(option)
            myChart.hideLoading()

        },
        chart2TimeChange(){
            let me=this
            getSalesByTime({
                start:me.chart2.time[0].format('yyyy-MM-DD'),
                end:me.chart2.time[1].format('yyyy-MM-DD')
            }).then(r=>{
                if(r.data.length>0){
                    let processData=_.groupBy(r.data,'time')
                    let data={columns:[],data:[]}
                    //console.log(processData)
                    for(let key in processData){
                        data.columns.push(key)
                        let count=0.0
                        processData[key].forEach(e=>{
                            count+=e.final_payment_amount
                        })
                        data.data.push(count)
                    }
                    //console.log(data)
                    me.drawChart2(data)
                    //console.log(r.data)
                }
            })
        },
        drawChart2(data){
            let me=this
            echarts.dispose(document.getElementById('chart2'))
            let myChart=echarts.init(document.getElementById('chart2'))
            myChart.showLoading()
            let option={
                xAxis: {
                    type: 'category',
                    data: data.columns
                },
                yAxis: {
                    name:'入账金额/¥',
                    type: 'value'
                },
                legend:{},
                tooltip: {
                    trigger: 'axis',
                    axisPointer:{
                        label:{
                            // formatter:function (arg){
                            // }
                        }
                    }
                },
                series: [
                    {
                        name:'入账金额',
                        data: data.data,
                        type: 'bar',
                        itemStyle:{
                            //color:'#009DFF'
                            color:'#8080FF'
                        },
                        label:{
                            // formatter:function (arg){
                            //     return arg.data.value+'¥'
                            // }
                        }
                    }
                ]
            }
            myChart.setOption(option)
            myChart.hideLoading()
        },
        chart3TimeChange(){
            let me=this
            getCustomerFlowByTime({
                start:me.chart3.time[0].format('yyyy-MM-DD'),
                end:me.chart3.time[1].format('yyyy-MM-DD')
            }).then(r=>{
                if(r.data.length>0){
                    //console.log(r.data)
                    let processData=_.groupBy(r.data,'time')
                    let data={columns:[],data:[]}
                    for(let key in processData){
                        data.columns.push(key)
                        let count=processData[key].length
                        data.data.push(count)
                    }
                    me.drawChart3(data)
                }
            })
        },
        drawChart3(data){
            let me=this
            echarts.dispose(document.getElementById('chart3'))
            let myChart=echarts.init(document.getElementById('chart3'))
            myChart.showLoading()
            let option={
                xAxis: {
                    type: 'category',
                    data: data.columns
                },
                yAxis: {
                    name:'人数/个',
                    type: 'value'
                },
                legend:{},
                tooltip: {
                    trigger: 'axis',
                    axisPointer:{
                        label:{
                            // formatter:function (arg){
                            // }
                        }
                    }
                },
                series: [
                    {
                        name:'人数',
                        data: data.data,
                        type: 'bar',
                        itemStyle:{
                            //color:'#009DFF'
                            color:'#8080FF'
                        },
                        label:{
                            // formatter:function (arg){
                            //     return arg.data.value+'¥'
                            // }
                        }
                    }
                ]
            }
            myChart.setOption(option)
            myChart.hideLoading()
        }
    },



}
</script>

<style scoped>

</style>