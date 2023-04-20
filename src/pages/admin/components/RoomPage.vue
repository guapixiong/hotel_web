<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="房间门牌号">
                    <a-input-search v-model="selectContent" :allowClear=true @change="contentChange"></a-input-search>
                </a-form-item>
                <a-form-item label="房间类型">
                    <a-select default-value="all" style="width: 200px" @change="changeSelect">
                        <a-select-option key="all" value="all">全部</a-select-option>
                        <a-select-option v-for="item in roomType" :key="item.id" :value="item.id">{{ item.type }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" @click="addRoomModal">新增房间</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data"
                 :rowKey="(record)=>record.room_id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="type" slot-scope="text,record"><a-tag :color="colorList[record.type_id]">{{text}}</a-tag></span>
            <span slot="room_price" slot-scope="text">¥{{text}}</span>
            <span slot="hour_price" slot-scope="text">¥{{text}}</span>
            <span slot="room_url" slot-scope="text"><img style="width: 150px;height: 80px" :src=text></span>
            <span slot="status" slot-scope="text"><a-switch checked-children="已开启" un-checked-children="已关闭"
                                                            :default-checked="text==='1'" disabled/></span>
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
        <a-modal  :visible="room.visible" @ok="addRoomOk" @cancel="cancelRoomModal"  >
            <a-form-model ref="roomForm" :label-col="{span:5}" :wrapper-col="{span:12}" :model="room.form" :rules="room.rules">
                <a-form-model-item label="房间门牌号" prop="roomNumber">
                    <a-input v-model="room.form.roomNumber"></a-input>
                </a-form-model-item>
                <a-form-model-item label="房间照片">
                    <a-upload
                        :before-upload="beforeUpload"
                        :remove="removeImage"
                        :fileList="imageStatus.fileList">
                        <a-button>
                            <a-icon type="upload"/>
                            点击上传图片
                        </a-button>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item label="房间类型">
                    <a-select v-model="room.form.typeId" placeholder="请选择类型">
                        <a-select-option v-for="item in roomType" :key="item.id" :value="item.id">{{ item.type }}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="房间介绍">
                    <a-input v-model="room.form.roomIntroduction" type="textarea"></a-input>
                </a-form-model-item>
                <a-form-model-item label="房间价格¥">
                    <a-input-number  v-model="room.form.roomPrice"></a-input-number>
                </a-form-model-item>
                <a-form-model-item label="钟点房价格¥">
                    <a-input-number v-model="room.form.hourPrice"></a-input-number>
                </a-form-model-item>
                <a-form-model-item label="房间状态">
                    <a-switch checked-children="已开启" un-checked-children="已关闭" :checked="room.form.roomState==='1'"
                              @change="changeState"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <a-modal :visible="room1.visible" @ok="updateRoomOk" @cancel="cancelRoomModal1">
            <a-form-model :label-col="{span:5}" :wrapper-col="{span:12}">
                <a-form-model-item label="房间门牌号">
                    <a-input v-model="room1.form.roomNumber"></a-input>
                </a-form-model-item>
                <a-form-model-item label="房间照片">
                    <img :src="room1.form.roomUrl" style="height: 100px;width: 150px">
                    <a-upload
                        :before-upload="beforeUpload1"
                        :remove="removeImage1"
                        :fileList="imageStatus1.fileList">
                        <a-button>
                            <a-icon type="upload"/>
                            点击更换照片图片
                        </a-button>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item label="房间类型">
                    <a-select v-model="room1.form.typeId" placeholder="请选择类型">
                        <a-select-option v-for="item in roomType" :key="item.id" :value="item.id">{{ item.type }}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="房间介绍">
                    <a-input v-model="room1.form.roomIntroduction" type="textarea"></a-input>
                </a-form-model-item>
                <a-form-model-item label="房间价格¥">
                    <a-input-number v-model="room1.form.roomPrice"></a-input-number>
                </a-form-model-item>
                <a-form-model-item label="钟点房价格¥">
                    <a-input-number v-model="room1.form.hourPrice"></a-input-number>
                </a-form-model-item>
                <a-form-model-item label="房间状态">
                    <a-switch checked-children="已开启" un-checked-children="已关闭" :checked="room1.form.roomState==='1'"
                              @change="changeState1"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <!--        <a-button @click="uploadImage">保存</a-button>-->
        <!--        <a-button @click="downLoadImage">获取图片</a-button>-->
    </div>
</template>

<script>
import moment from 'moment'
import Util from '@/util/generalMethod'
moment.locale('zh-cn')
// eslint-disable-next-line no-unused-vars
import {getTypeInfo,getAllRoomDetail, imageUpload, imageDownload, insertRoom, updateRoom, deleteRoom} from '@/api/admin/roomApi'

export default {
    name: "RoomPage",
    data() {
        return {
            selectContent:'',
            roomType: [],
            table1: {
                loading: false,
                columns: [
                    {
                        title: '房间编号',
                        align: 'center',
                        dataIndex: 'room_id'
                    },
                    {
                        title: '房间门牌号',
                        align: 'center',
                        dataIndex: 'room_number'
                    },
                    {
                        title: '房间类型',
                        align: 'center',
                        dataIndex: 'type',
                        scopedSlots: {customRender: 'type'}

                    },
                    {
                        title: '房间价格',
                        align: 'center',
                        dataIndex: 'room_price',
                        scopedSlots: {customRender: 'room_price'}
                    },
                    {
                        title: '钟点房价格',
                        align: 'center',
                        dataIndex: 'hour_price',
                        scopedSlots: {customRender: 'hour_price'}
                    },
                    {
                        title: '房间照片',
                        align: 'center',
                        dataIndex: 'room_url',
                        scopedSlots: {customRender: 'room_url'}
                    },
                    {
                        title: '房间状态',
                        align: 'center',
                        dataIndex: 'room_state',
                        scopedSlots: {customRender: 'status'}
                    },
                    {
                        title: '房间信息',
                        align: 'center',
                        dataIndex: 'room_introduction'
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
                    pageSize: 7,//每页中显示10条数据
                    //showSizeChanger: true,
                    // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                },
            },
            //增加一条记录房间对应信息
            room: {
                visible: false,
                form: {
                    roomNumber: '',
                    roomUrl: '',
                    typeId:1,
                    roomPrice: '',
                    hourPrice: '',
                    roomIntroduction: '',
                    roomState: '1',
                },
                rules:{roomNumber:[{required:true,message:'请输入房间号',trigger: 'blur'}]},
            },
            imageStatus: {
                file: {},
                fileList: []
            },
            //修改一条记录房间对应信息
            room1: {
                visible: false,
                form: {
                    roomId: '',
                    roomNumber: '',
                    roomUrl: '',
                    typeId: null,
                    roomPrice: '',
                    hourPrice: '',
                    roomIntroduction: '',
                    roomState: '1',
                },
                rules:{},
            },
            imageStatus1: {
                file: {},
                fileList: []
            },
            colorList:['green','orange','blue','purple','red','pink']
        }
    },
    mounted() {
        this.loadTable1()
    },
    methods: {

        async loadTable1() {
            let me = this
            me.roomType=await new Promise((resolve => {
                getTypeInfo().then(r=>{
                    if(r.status===200&&r.data.length>0){
                        resolve(r.data)
                    }
                })
            }))
            me.table1.loading = true
            let data = await me.getAllRoom()
            me.table1.data = data
            me.table1.loading = false
            //console.log(me.table1.data)
            me.table1.dataCopy = [...me.table1.data]
        },
        /**
         * 获取所有房间信息
         * @returns {Promise<unknown>}
         */
        getAllRoom() {
            return new Promise((resolve) => {
                getAllRoomDetail().then(r => {
                    if (r.data.length > 0 && r.status === 200) {
                        // me.table1.data=r.data
                        resolve(r.data)
                    } else {
                        resolve([])
                    }
                })
            })
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
        downLoadImage(url) {
            return new Promise((resolve) => {
                imageDownload({name: url}).then(res => {

                    if (res.data.length > 0) {
                        resolve(res)
                    } else
                        resolve("")
                })
            })

        },
        /**
         * 上传前校验
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
            //console.log(this.imageStatus)
            if (isJpgOrPng && isLt2M) {
                this.imageStatus.file = file
                this.imageStatus.fileList.push(file)
            }
            //console.log(this.imageStatus.file)
            return false
        },
        /**
         * 去除图片
         * @returns {boolean}
         */
        removeImage() {
            this.imageStatus.file = {}
            this.imageStatus.fileList = []
            return true
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
            //console.log(this.imageStatus)
            if (isJpgOrPng && isLt2M) {
                this.imageStatus1.file = file
                this.imageStatus1.fileList.push(file)
            }
            //console.log(this.imageStatus1.file)
            return false
        },
        removeImage1() {
            this.imageStatus1.file = {}
            this.imageStatus1.fileList = []
            return true
        },
        /**
         * 编辑房间信息
         * @param record
         */
        editRoom(record) {
            let me = this
            me.room1.visible = true
            me.room1.form.roomId = record.room_id
            me.room1.form.roomUrl = record.room_url
            me.room1.form.roomNumber = record.room_number
            me.room1.form.typeId = record.type_id
            me.room1.form.roomPrice = record.room_price
            me.room1.form.hourPrice = record.hour_price
            me.room1.form.roomIntroduction = record.room_introduction
            me.room1.form.roomState = record.room_state
            me.imageStatus1= {
                file: {},
                fileList: []
            }
            //console.log(record)
        },
        /**
         * 查询内容改变
         */
        contentChange(){
            let me= this
            if(this.selectContent.length>0){
                this.table1.data=this.table1.dataCopy.filter(e=>{return Util.fuzzyQuery(e.room_number,me.selectContent)
                })
            }
            else
                this.table1.data=this.table1.dataCopy
        },
        /**
         * 类别切换
         * @param value
         */
        changeSelect(value) {
            if(value==='all')
                this.table1.data = this.table1.dataCopy.filter(() => true);
            else
                this.table1.data = this.table1.dataCopy.filter((e) => e.type_id === value);
        },
        /**
         * 房间状态切换
         * @param value
         */
        changeState(value) {
            if (value)
                this.room.form.roomState = '1'
            else
                this.room.form.roomState = '0'
        },
        changeState1(value) {
            if (value)
                this.room1.form.roomState = '1'
            else
                this.room1.form.roomState = '0'
        },
        /**
         * 打开新增对话框
         */
        addRoomModal() {
            let me = this
            me.room.visible = true
            me.imageStatus= {
                file: {},
                fileList: []
            }
        },
        /**
         * 取消新增对话框
         */
        cancelRoomModal() {
            this.room.visible = false
        },
        cancelRoomModal1() {
            this.room1.visible = false
        },
        /**
         * 提交新增记录
         * @returns {Promise<void>}
         */
        async addRoomOk() {
            let me = this
            let url = ''
            //上传图片
            if (Object.keys(me.imageStatus.file).length > 0) {
                url = await me.uploadImage(me.imageStatus.file)
                me.room.form.roomUrl = url
            }
            await new Promise((() => {
                insertRoom(me.room.form).then(r => {
                    if (r.status === 200) {
                        me.$message.success("保存成功")
                        me.room.visible=false
                        me.loadTable1()
                    } else
                        me.$message.error("保存失败")
                })
            }))
            me.room.form = {
                roomNumber: '',
                roomUrl: '',
                typeId: '',
                roomPrice: '',
                hourPrice: '',
                roomIntroduction: '',
                roomState: true,
            }
            me.imageStatus = {
                file: {},
                fileList: []
            }
        },
        /**
         * 更新房间记录
         * @returns {Promise<void>}
         */
        async updateRoomOk() {
            let me = this
            let url = ''
            //上传图片
            if (Object.keys(me.imageStatus1.file).length > 0) {
                url = await me.uploadImage(me.imageStatus1.file)
                me.room1.form.roomUrl = url
            }
            await new Promise((() => {
                updateRoom(me.room1.form).then(r => {
                    if (r.status === 200 && r.data === 1) {
                        me.$message.success("修改成功")
                        me.room1.visible=false
                        me.loadTable1()
                    } else
                        me.$message.error("修改失败")
                })
            }))
            me.imageStatus1 = {
                file: {},
                fileList: []
            }
        },
        /**
         * 删除房间
         * @param record
         */
        deleteRoom(record) {
            let me = this
            deleteRoom({room_id: record.room_id}).then(r => {
                    if (r.data === 1){
                        me.$message.success("删除成功")
                        me.loadTable1()
                    }
                    else
                        me.$message.error("删除失败")
                }
            )
            //console.log(record.room_id)
        }
    }
}
</script>
<style scoped>

</style>