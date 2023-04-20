<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="商品名称">
                    <a-input-search v-model="selectContent" :allowClear=true @change="contentChange"></a-input-search>
                </a-form-item>
                <a-form-item label="商品类型">
                    <a-select default-value="all" style="width: 200px" @change="changeSelect">
                        <a-select-option key="all" value="all">全部</a-select-option>
                        <a-select-option v-for="item in commodityType" :key="item.id" :value="item.id">{{item.type }}</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" @click="addCommodityModal">新增商品</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data"
                 :rowKey="(record)=>record.commodity_id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="type" slot-scope="text,record"><a-tag :color="colorList[record.category_id]">{{text}}</a-tag></span>
            <span slot="url" slot-scope="text"><img style="width: 150px;height: 80px" :src=text></span>
            <span slot="price" slot-scope="text">¥{{text}}</span>
<!--            <span slot="commodity_url" slot-scope="text"><img style="width: 150px;height: 80px" :src=text></span>-->
            <span slot="operate" slot-scope="record">
                <a-button type="primary" @click="editCommodity(record)">编辑</a-button>
                <a-divider type="vertical"/>
                <a-popconfirm
                    title="确定要删除吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="deleteCommodity(record)"
                >
                    <a-button type="danger" click="#">删除</a-button>
                </a-popconfirm>
            </span>
        </a-table>
        <a-modal :visible="commodity.visible" @ok="addCommodityOk" @cancel="cancelAddCommodityModal">
            <a-form-model :label-col="{span:5}" :wrapper-col="{span:12}">
                <a-form-model-item label="商品名称">
                    <a-input v-model="commodity.form.name"></a-input>
                </a-form-model-item>
                <a-form-model-item label="商品价格">
                    <a-input v-model="commodity.form.price">
                        <a-input-number v-model="commodity.form.price"></a-input-number>
                    </a-input>
                </a-form-model-item>
                <a-form-model-item label="商品图片">
                    <a-upload
                        :before-upload="beforeUpload"
                        :remove="removeImage"
                        :fileList="commodity.fileList">
                        <a-button>
                            <a-icon type="upload"/>
                            点击上传图片
                        </a-button>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item label="商品类型">
                    <a-select v-model="commodity.form.category_id" style="width: 200px" >
                        <a-select-option v-for="item in commodityType" :key="item.id" :value="item.id">{{item.type }}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="商品介绍">
                    <a-input type="textarea" v-model="commodity.form.commodity_introduction"></a-input>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <a-modal :visible="commodity1.visible" @ok="editCommodityOk" @cancel="editCommodityCancel">
            <a-form-model :label-col="{span:5}" :wrapper-col="{span:12}">
                <a-form-model-item label="商品名称">
                    <a-input v-model="commodity1.form.name"></a-input>
                </a-form-model-item>
                <a-form-model-item label="商品价格">
                    <a-input-number v-model="commodity1.form.price">
                    </a-input-number>
                </a-form-model-item>
                <a-form-model-item label="商品数量">
                    <a-input-number v-model="commodity1.form.amount">
                    </a-input-number>
                </a-form-model-item>
                <a-form-model-item label="商品图片">
                    <img :src="commodity1.form.commodity_url" style="height: 100px;width: 150px">
                    <a-upload
                        :before-upload="beforeUpload1"
                        :remove="removeImage1"
                        :fileList="commodity1.fileList">
                        <a-button>
                            <a-icon type="upload"/>
                            点击更换图片
                        </a-button>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item label="商品类型">
                    <a-select v-model="commodity1.form.category_id" style="width: 200px" >
                        <a-select-option v-for="item in commodityType" :key="item.id" :value="item.id">{{item.type }}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="商品介绍">
                    <a-input type="textarea" v-model="commodity1.form.commodity_introduction"></a-input>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import {getAllInfo, getCommodityType,insertCommodity,updateCommodity,deleteCommodity} from '@/api/admin/commodityApi'
import Util from "@/util/generalMethod";
import {imageUpload} from "@/api/admin/roomApi";

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
            },
            commodity:{     //新增商品信息
                visible:false,
                form:{
                    name:'',
                    price:0.0,
                    amount:0,
                    commodity_url:'',
                    commodity_introduction:'',
                    category_id:1,
                },
                fileList:[]
            },
            commodity1:{  //修改商品信息
                visible:false,
                form:{
                    commodity_id:0,
                    name:'',
                    price:0.0,
                    amount:0,
                    commodity_url:'',
                    commodity_introduction:'',
                    category_id:1,
                },
                fileList:[]
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
                }
            })
            getAllInfo().then(r => {
                if (r.status === 200 && r.data.length > 0) {
                    me.table1.data = r.data
                    me.table1.dataCopy = [...r.data]
                }
            })
        },
        /**
         * 模糊查询
         */
        contentChange() {
            let me = this
            if (this.selectContent.length > 0) {
                this.table1.data = this.table1.dataCopy.filter(e => {
                    return Util.fuzzyQuery(e.name, me.selectContent)
                })
            } else
                this.table1.data = this.table1.dataCopy
        },
        /**
         * 类型切换
         * @param value
         */
        changeSelect(value) {
            if(value==='all')
                this.table1.data = this.table1.dataCopy.filter(() => true);
            else
                this.table1.data = this.table1.dataCopy.filter((e) => e.category_id === value);
        },
        /**
         * 弹出新增对话框
         */
        addCommodityModal(){
            this.commodity.visible=true
        },
        /**
         * 编辑对应行信息
         * @param record
         */
        editCommodity(record){
            let me=this
            //console.log(record)
            me.commodity1.fileList=[]
            for (const key in me.commodity1.form)
                me.commodity1.form[key]=record[key]
            me.commodity1.visible=true

        },
        async editCommodityOk(){
            let me=this
            if(me.commodity1.fileList.length>0){
                me.commodity1.form.commodity_url=await me.uploadImage(me.commodity1.fileList[0])
            }
            updateCommodity(me.commodity1.form).then(r=>{
                if(r.status===200&&r.data===1){
                    me.$message.success("修改成功")
                    me.getData()
                    me.commodity1.visible=false

                }
                else
                    me.$message.error("修改失败")
            })

        },
        editCommodityCancel(){
            let me=this
            me.commodity1.visible=false
        },
        /**
         * 校验新增图片
         * @param file
         * @returns {boolean}
         */
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('图片格式只支持jpeg和png');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('图片大小需要小于2MB!');
            }
            if (isJpgOrPng && isLt2M) {
                this.commodity.fileList.push(file)
            }
            return false
        },
        beforeUpload1(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('图片格式只支持jpeg和png');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('图片大小需要小于2MB!');
            }
            if (isJpgOrPng && isLt2M) {
                this.commodity1.fileList.push(file)
            }
            return false
        },
        /**
         * 删除新增图片
         * @returns {boolean}
         */
        removeImage() {
            this.commodity.fileList = []
            return true
        },
        removeImage1() {
            this.commodity1.fileList = []
            return true
        },
        /**
         * 提交新增记录
         */
        async addCommodityOk(){
            let me=this
            let url=''
            //上传图片
            if(me.commodity.fileList.length>0){
                url=await me.uploadImage(me.commodity.fileList[0])
                me.commodity.form.commodity_url=url
            }
            insertCommodity(me.commodity.form).then(r=>{
                if(r.status===200&&r.data===1){
                    me.$message.success("保存成功")
                    me.getData()
                    me.commodity.visible=false
                }
                else
                    me.$message.error("保存失败")
                me.commodity={     //新增商品信息
                    visible:false,
                        form:{
                        name:'',
                            price:0.0,
                            amount:0,
                            commodity_url:'',
                            commodity_introduction:'',
                            category_id:1,
                    },
                    fileList:[]
                }
            })

        },
        /**
         * 取消新增记录
         */
        cancelAddCommodityModal(){
            this.commodity.visible=false
        },
        /**
         * 上传图片文件
         * @param file
         * @returns {Promise<unknown>}
         */
        uploadImage(file) {
            return new Promise((resolve => {
                //let file = me.imageStatus.file;
                let param = new FormData(); //创建form对象
                param.append('file', file);//通过append向form对象添加数据
                imageUpload(param).then(r => {
                    if (r.status === 200) {
                        resolve(r.data)
                        //console.log(r.data)
                    } else {
                        resolve("")
                    }
                })
            }))
        },
        deleteCommodity(record){
            let me=this
            deleteCommodity({commodity_id:record.commodity_id}).then(r=>{
                if(r.status===200&&r.data===1){
                    me.$message.success("删除成功")
                    me.getData()
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