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
                    <a-button type="primary" click="#">查询</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data" :rowKey="(record)=>record.id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="action"><a-button type="primary">编辑</a-button></span>
        </a-table>
    </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import {getCommodityRecordByTime} from '@/api/admin/commodityApi'
export default {
    name: "CommodityRecord",
    data(){
        return{
            timeFormat: 'YYYY-MM-DD',
            time:[moment('2023-03-01'),moment('2023-04-30')],
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
                    pageSize: 20,//每页中显示10条数据
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
        }
    }
}
</script>

<style scoped>

</style>