<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-20 14:22
-->
<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="时间">
                    <a-range-picker :format="timeFormat" v-model="time" size="small"/>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="loadTable1">查询</a-button>
                </a-form-item>
                <a-form-item label="身份证号查询">
                    <a-input-search v-model="cardId" allowClear @change="cardIdChange"></a-input-search>
                </a-form-item>
                <a-form-item label="姓名查询">
                    <a-input-search v-model="name" allowClear @change="nameChange"></a-input-search>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data"
                 :rowKey="(record)=>record.id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="type" slot-scope="text">{{type[text]}}</span>
            <span slot="operate" slot-scope="record">
<!--                <a-button type="primary">编辑</a-button>-->
                <a-popconfirm
                    title="确定要删除吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="deleteOccupant(record)"
                >
                <a-button style="margin-left: 2px" type="danger" click="#">删除</a-button>
            </a-popconfirm>
            </span>


        </a-table>
    </div>
</template>

<script>
import moment from 'moment'
import {getOrderByTime} from "@/api/admin/recordApi";
import {deleteOccupantById, getOccupantByTime} from "@/api/admin/userApi";
import Util from "@/util/generalMethod";

moment.locale('zh-cn')
export default {
    name: "OccupantPage",
    data() {
        return {
            timeFormat: 'YYYY-MM-DD',
            time: [moment(moment().format('YYYY-MM-01')).add(-1,'M'), moment(moment().format('YYYY-MM-01')).add(1,'M')],
            table1: {
                loading: false,
                columns: [
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
                        title: '房间号',
                        align: 'center',
                        dataIndex: 'room_number'
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
                        dataIndex: 'register_time',
                        sorter:(a,b)=>{ return a.register_time> b.register_time? 1 : -1 }
                    },
                    {
                        title:'离店时间',
                        align: 'center',
                        dataIndex: 'leave_time',
                        sorter:(a,b)=>{ return a.leave_time> b.leave_time? 1 : -1 }
                    },
                    {
                        title:'操作',
                        align: 'center',
                        scopedSlots: {customRender: 'operate'}
                    }
                ],
                data: [],
                dataCopy: [],
                pagination: {
                    total: 0,
                    pageSize: 14,//每页中显示10条数据
                    //showSizeChanger: true,
                    // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                },
            },
            type:["居民身份证","临时身份证","港澳台身份证"],
            name:'',
            cardId:'',
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
            getOccupantByTime(params).then(r=>{
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
         * 名称模糊匹配
         */
        nameChange() {
            let me = this
            if (this.name.length > 0) {
                this.table1.data = this.table1.dataCopy.filter(e => {
                    return Util.fuzzyQuery(e.name, me.name)
                })
            } else
                this.table1.data = this.table1.dataCopy
        },
        /**
         * 身份证模糊匹配
         */
        cardIdChange() {
            let me = this
            if (this.cardId.length > 0) {
                this.table1.data = this.table1.dataCopy.filter(e => {
                    return Util.fuzzyQuery(e.card_id, me.cardId)
                })
            } else
                this.table1.data = this.table1.dataCopy
        },
        /**
         * 删除同行人
         */
        deleteOccupant(record){
            let me=this
            //console.log(record)
            deleteOccupantById({id:record.id}).then(r=>{
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