<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="商品名称">
                    <a-input-search v-model="selectContent" :allowClear=true @change="contentChange"></a-input-search>
                </a-form-item>
                <a-form-item label="商品类型">
                    <a-select default-value="all" style="width: 200px" @change="changeSelect">
                        <a-select-option v-for="item in commodityType" :key="item.id" :value="item.id">
                            {{item.type }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" @click="addRoomModal">新增</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data"
                 :rowKey="(record)=>record.commodity_id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="type" slot-scope="text,record"><a-tag :color="colorList[record.category_id]">{{text}}</a-tag></span>
            <span slot="price" slot-scope="text">¥{{text}}</span>
<!--            <span slot="commodity_url" slot-scope="text"><img style="width: 150px;height: 80px" :src=text></span>-->
            <span slot="operate" slot-scope="record">
                <a-button type="primary" @click="editRoom(record)">编辑</a-button>
                <a-divider type="vertical"/>
                <a-popconfirm
                    title="确定要删除吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="deleteRoom(record)"
                >
                    <a-button type="danger" click="#">删除</a-button>
                </a-popconfirm>
            </span>
        </a-table>
    </div>
</template>

<script>
import {getAllInfo, getCommodityType} from '@/api/admin/commodityApi'
import Util from "@/util/generalMethod";

export default {
    name: "CommodityPage",
    data() {
        return {
            selectContent: '',
            commodityType: [],
            table1: {
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
                        dataIndex: 'commodity_url'
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
            },
            colorList:['green','orange','blue','purple','red','pink']

        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            let me = this
            getCommodityType().then(r => {
                if (r.status === 200 && r.data.length > 0) {
                    me.commodityType = r.data
                    me.commodityType.unshift({id:'all',type:'全部'})
                }
            })
            getAllInfo().then(r => {
                if (r.status === 200 && r.data.length > 0) {
                    me.table1.data = r.data
                    me.table1.dataCopy = [...r.data]
                }
            })
        },
        contentChange() {
            let me = this
            if (this.selectContent.length > 0) {
                this.table1.data = this.table1.dataCopy.filter(e => {
                    return Util.fuzzyQuery(e.name, me.selectContent)
                })
            } else
                this.table1.data = this.table1.dataCopy
        },
        changeSelect(value) {
            if(value==='all')
                this.table1.data = this.table1.dataCopy.filter(() => true);
            else
                this.table1.data = this.table1.dataCopy.filter((e) => e.category_id === value);
        },

    }
}

</script>

<style scoped>

</style>