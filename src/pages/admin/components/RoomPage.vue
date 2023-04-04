<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="房间名称">
                    <a-input-search ></a-input-search>
                </a-form-item>
                <a-form-item label="房间类型">
                    <a-select v-model="selectType" style="width: 200px" >
                        <a-select-option v-for="item in roomType" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                </a-form-item>

<!--                <a-form-item label="时间">-->
<!--                    <a-range-picker  :format="timeFormat" v-model="time" size="small" />-->
<!--                </a-form-item>-->
                <a-form-item>
                    <a-button type="primary" @click="loadTable1">新增</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data" :rowKey="(record)=>record.room_id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="type" slot-scope="text"><a-tag color="green">{{roomType[text].value}}</a-tag></span>
        </a-table>
        <a-upload
            :before-upload="beforeUpload"
            :remove="removeImage"
            :fileList="imageStatus.fileList"
        >
            <a-button> <a-icon type="upload" /> 点击上传图片 </a-button>
        </a-upload>
    </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import {getAllRoomDetail,imageUpload} from '@/api/admin/roomApi'
export default {
    name: "RoomPage",
    data(){
        return{
            selectType:'all',
            roomType:[
                {key:'all',value: '全部'},
                {key:'1',value:'单人间'},
                {key:'2',value:'双人间'},
                {key:'3',value:'三人间'}
            ],
            imageStatus:{
                file:{},
                loading:false,
                fileList:[]
            },
            table1:{
                loading:false,
                columns:[
                    {
                        title:'房间编号',
                        align:'center',
                        dataIndex:'room_id'
                    },
                    {
                        title:'房间名字',
                        align:'center',
                        dataIndex: 'room_name'
                    },
                    {
                      title:'房间类型',
                      align: 'center',
                      dataIndex: 'room_type',
                        scopedSlots:{customRender:'type'}

                    },
                    {
                        title: '房间价格',
                        align: 'center',
                        dataIndex: 'room_price'
                    },
                    {
                        title:'钟点房价格',
                        align: 'center',
                        dataIndex: 'hour_price'
                    },
                    {
                        title:'房间状态',
                        align: 'center',
                        dataIndex: 'room_state'
                    },
                    {
                        title:'房间信息',
                        align: 'center',
                        dataIndex: 'room_introduction'
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
            }
        }
    },
    mounted() {
        this.loadTable1()
    },
    methods:{
        loadTable1(){
            let me=this
            me.table1.loading=true
            getAllRoomDetail().then(r=>{
                if(r.data.length>0&& r.status===200){
                    me.table1.data=r.data
                    me.table1.loading=r.data
                }
                else {
                    me.table1.data=[]
                    me.table1.loading=[]
                }
                console.log(r.data)
                me.table1.loading=false
            })
        },

        uploadImage(data){
            let me=this
            console.log(data)
            let file = data.file;
            let param = new FormData(); //创建form对象
            param.append('file',file);//通过append向form对象添加数据
            imageUpload(param).then(r=>{
                if(r.status===200){
                    me.$message.success('上传成功')
                }
                else{
                    me.$message.error('上传失败')
                }
            })

        },
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('图片格式只支持jpeg和png');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('图片大小需要小于2MB!');
            }
            console.log(this.imageStatus)
            if(isJpgOrPng && isLt2M){
                this.imageStatus.file=file
            }
            //console.log(this.imageStatus.file)
            return false
        },
        removeImage(){
            this.imageStatus.file={}
            return true
        }
    }
}
</script>
<style scoped>

</style>