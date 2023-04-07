<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="房间名称">
                    <a-input-search ></a-input-search>
                </a-form-item>
                <a-form-item label="房间类型">
                    <a-select default-value="all" style="width: 200px" @change="changeSelect" >
                        <a-select-option v-for="item in roomType" :key="item.key" :value="item.key" >{{item.value}}</a-select-option>
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
            <span slot="room_url" slot-scope="text"><img style="width: 150px;height: 80px" :src=text></span>
            <span slot="status" slot-scope="text"><a-switch checked-children="已开启" un-checked-children="已关闭" :default-checked="text==='1'" disabled /></span>
            <span slot="operate" slot-scope="record" ><a-button type="primary" @click="editRoom(record)">编辑</a-button></span>

        </a-table>
        <a-upload
            :before-upload="beforeUpload"
            :remove="removeImage"
            :fileList="imageStatus.fileList">
            <a-button> <a-icon type="upload" /> 点击上传图片 </a-button>
        </a-upload>
        <a-button @click="uploadImage">保存</a-button>
        <a-button @click="downLoadImage">获取图片</a-button>
        <img :src="src">
    </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import {getAllRoomDetail,imageUpload,imageDownload} from '@/api/admin/roomApi'
export default {
    name: "RoomPage",
    data(){
        return{
            src:'',
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
                        title: '房间照片',
                        align: 'center',
                        dataIndex: 'room_url',
                        scopedSlots: {customRender: 'room_url'}
                    },
                    {
                        title:'房间状态',
                        align: 'center',
                        dataIndex: 'room_state',
                        scopedSlots: {customRender: 'status'}
                    },
                    {
                        title:'房间信息',
                        align: 'center',
                        dataIndex: 'room_introduction'
                    },
                    {
                        title:'操作',
                        align: 'center',
                        scopedSlots: {customRender: 'operate'}
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

                }
                else {
                    me.table1.data=[]
                    // me.table1.dataCopy=[]
                }
                console.log(r.data)
                me.table1.loading=false
            }).then(function (){
                //加载图片
                me.table1.data.forEach((e,index)=>{
                    if(e.room_url.length>0){
                        imageDownload({name:e.room_url}).then(res=>{
                            console.log(res)
                            if(res.data.length>0){
                                me.table1.data[index].room_url=URL.createObjectURL(res.data)
                            }
                        })
                    }
                })
                 me.table1.dataCopy=[...me.table1.data]
            })
        },

        uploadImage(){
            let me=this

            let file = me.imageStatus.file;
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
        downLoadImage(){
            let url='d58b2d56-ae2d-4c02-8941-6456b5770684.jpg'
            imageDownload({name:url}).then(res=>{

                if(res.data.length>0){
                    url=window.URL.createObjectURL(res.data)
                }
                console.log(url)
            })
            return url
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
                this.imageStatus.fileList.push(file)
            }
            //console.log(this.imageStatus.file)
            return false
        },
        removeImage(){
            this.imageStatus.file={}
            this.imageStatus.fileList=[]
            return true
        },
        editRoom(record){
            console.log(record)
        },
        changeSelect(value){
            switch (value){
                case 'all':this.table1.data=this.table1.dataCopy.filter(()=> true);break
                case '1':this.table1.data=this.table1.dataCopy.filter((e)=> e.room_type==='1');break
                case '2':this.table1.data=this.table1.dataCopy.filter((e)=> e.room_type==='2');break
                case '3':this.table1.data=this.table1.dataCopy.filter((e)=> e.room_type==='3');break
            }

        }
    }
}
</script>
<style scoped>

</style>