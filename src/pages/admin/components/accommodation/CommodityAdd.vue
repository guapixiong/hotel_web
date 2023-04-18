<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-18 09:54
-->
<template>
    <div>
        <a-table style="margin: 20px;border-radius: 5px" :columns="columns" :data-source="data" :scroll="{  y: 300 }"
                 :rowKey="(record)=>record.commodity_id">
            <span slot="type" slot-scope="text,record"><a-tag :color="colorList[record.category_id]">{{ text }}</a-tag></span>
            <span slot="url" slot-scope="text"><img style="width: 150px;height: 80px" :src=text></span>
            <span slot="price" slot-scope="text">¥{{ text }}</span>
            <span slot="operate" slot-scope="record"><a-button type="primary"
                                                               @click="addCommodity(record)">添加</a-button></span>
        </a-table>
        <a-card title="购物车">
            <a-table style="margin: 20px;border-radius: 5px" :columns="columns1" :data-source="commodities" bordered :rowKey="(record)=>record.commodity_id"
                     :scroll="{  y: 300 }">
                <span slot="price" slot-scope="text,record">¥{{ text*record.count }}</span>
                <template slot="count" slot-scope="text,record">
                    <span v-if="editable">
                        <a-input :value="text" @change="e=>countChange(e.target.value,record)"></a-input>
                    </span>
                    <span v-else>{{text}}</span>
                </template>
                <template slot="operate" slot-scope="record">
                    <a-button v-if="!editable" type="primary" @click="editCount">编辑</a-button>
                    <a-button v-else type="primary" @click="editCount">保存</a-button>
                    <a-divider type="vertical"/>
                    <a-popconfirm
                        title="确定要删除吗?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="deleteCommodity(record)"
                    >
                    <a-button type="danger" click="#">删除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
            <a-button type="primary" @click="submitRecord">提交</a-button>
<!--            <a-modal title="添加商品" @cancel="cancelEditCommodity" :visible="commodityModal.visible" @ok="okEditCommodity">-->
<!--                <a-form-model>-->
<!--                    <a-form-item label="名称">{{commodityModal.form.name}}</a-form-item>-->
<!--                    <a-form-item label="价格">{{commodityModal.form.count*commodityModal.form.price}}</a-form-item>-->
<!--                    <a-form-item label="数量">-->
<!--                        <a-input-number v-model="commodityModal.form.count" :min="1" :max="commodityModal.form.amount"></a-input-number>-->
<!--                    </a-form-item>-->
<!--                </a-form-model>-->
<!--            </a-modal>-->
        </a-card>
    </div>
</template>

<script>
import {getAllInfo, insertCommodityRecords} from "@/api/admin/commodityApi";

export default {
    name: "CommodityAdd",
    data() {
        return {
            record_id: '',
            loading: false,
            columns: [
                {
                    title: '商品编号',
                    align: 'center',
                    dataIndex: 'commodity_id'

                },
                {
                    title: '商品名称',
                    align: 'center',
                    dataIndex: 'name'
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
                {
                    title: '操作',
                    align: 'center',
                    scopedSlots: {customRender: 'operate'}
                }
            ],


            data: [],
            dataCopy: [],
            pagination: {
                total: 0,
                pageSize: 10,//每页中显示10条数据
                //showSizeChanger: true,
                // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
            },
            commodities: [],
            columns1: [
                {
                title: '商品名称',
                align: 'center',
                dataIndex: 'name'
            }, {
                title: '商品价格',
                align: 'center',
                dataIndex: 'price',
                scopedSlots: {customRender: 'price'}
            }, {
                title: '商品数量',
                align: 'center',
                dataIndex: 'count',
                scopedSlots: {customRender: 'count'}
            }, {
                title: '操作',
                align: 'center',
                scopedSlots: {customRender: 'operate'}
            }],
            editable:false,
            colorList: ['green', 'orange', 'blue', 'purple', 'red', 'pink'],
            // commodityModal:{
            //     visible:false,
            //     form:{
            //         commodity_id:'',
            //         name:'',
            //         price:'',
            //         count:'',
            //         amount:0
            //     }
            // }

        }
    },
    mounted() {
        this.record_id = this.$route.params.id
        this.getData()
    },
    methods: {
        getData() {
            let me = this
            getAllInfo().then(r => {
                if (r.status === 200 && r.data.length > 0) {
                    me.data = r.data
                    me.dataCopy = [...r.data]
                }
            })
        },
        /**
         * 添加商品
         */
        addCommodity(record) {
            let me = this
            let index=me.commodities.findIndex((value => value.commodity_id===record.commodity_id))
            if(index!==-1){
                if(me.commodities[index].count>=record.amount){
                    me.$message.info("商品库存不足")
                }
                else {
                    me.commodities[index].count++
                }

            }
            else
                me.commodities.push({commodity_id: record.commodity_id, name: record.name, count: 1, price: record.price,amount:record.amount})
        },
        /**
         * 删除商品
         * @param record
         */
        deleteCommodity(record) {
            let me=this
            let index=me.commodities.findIndex((value => value.commodity_id===record.commodity_id))
            me.commodities.splice(index,1)
        },
        editCount(){
            this.editable=!this.editable
        },
        countChange(value,record){
            if(value>record.amount){
                this.$message.info("商品库存不足")
            }
            else {


            let index=this.commodities.findIndex((value => value.commodity_id===record.commodity_id))
            this.commodities[index].count=value
            }
        },
        // /**
        //  * 编辑商品
        //  * @param record
        //  */
        // openEditCommodity(record){
        //     let me=this
        //     me.commodityModal.visible=true
        //     //let index=me.commodities.findIndex((value => value.commodity_id===record.commodity_id))
        //     me.commodityModal.form={
        //         commodity_id: record.commodity_id,
        //         name:record.name,
        //         price:record.price,
        //         count: record.count,
        //         amount:record.amount
        //     }
        // },
        // okEditCommodity(){
        //     let me=this
        //     let index=me.commodities.findIndex((value => value.commodity_id===me.commodityModal.commodity_id))
        //     console.log(me.commodityModal.form.count)
        //     me.commodities[index].count=me.commodityModal.form.count
        //     this.commodityModal.visible=false
        // },
        // cancelEditCommodity(){
        //     let me=this
        //     me.commodityModal.visible=false
        // },
        submitRecord(){
            let me=this
            // console.log(me.record_id)
            // console.log(me.commodities)
            let params={
                record_id:me.record_id,
                commodities:me.commodities
            }
            console.log(params)
            insertCommodityRecords(params).then(r=>{
                if(r.status===200&&r.data===1){
                    me.$message.success("添加成功")
                }
                else
                    me.$message.error("添加失败")
            })
        }

    },

}
</script>

<style scoped>

</style>