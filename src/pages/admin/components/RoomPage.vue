<template>
    <div>
        <a-card style="height: 75px;margin: 20px;border-radius: 5px">
            <a-form layout="inline">
                <a-form-item label="房间门牌号">
                    <a-input-search v-model="selectContent" :allowClear=true @change="contentChange"></a-input-search>
                </a-form-item>
                <a-form-item label="房间类型">
                    <a-select default-value="all" style="width: 200px" @change="changeSelect">
                        <a-select-option v-for="item in roomType" :key="item.key" :value="item.key">{{ item.value }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" @click="addRoomModal">新增</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-table style="margin: 20px;border-radius: 5px" :columns="table1.columns" :dataSource="table1.data"
                 :rowKey="(record)=>record.room_id"
                 :loading="table1.loading" :pagination="table1.pagination" size="small" bordered>
            <span slot="type" slot-scope="text"><a-tag :color="colorList[text]">{{ roomType[text].value }}</a-tag></span>
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
        <a-modal :visible="room.visible" @ok="addRoomOk" @cancel="cancelRoomModal">
            <a-form-model :label-col="{span:5}" :wrapper-col="{span:12}">
                <a-form-model-item label="房间门牌号">
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
                    <a-select v-model="room.form.roomType" placeholder="请选择类型">
                        <a-select-option value="1">单人间</a-select-option>
                        <a-select-option value="2">双人间</a-select-option>
                        <a-select-option value="3">三人间</a-select-option>
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
                    <a-select v-model="room1.form.roomType" placeholder="请选择类型">
                        <a-select-option value="1">单人间</a-select-option>
                        <a-select-option value="2">双人间</a-select-option>
                        <a-select-option value="3">三人间</a-select-option>
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
import {getAllRoomDetail, imageUpload, imageDownload, insertRoom, updateRoom, deleteRoom} from '@/api/admin/roomApi'

export default {
    name: "RoomPage",
    data() {
        return {
            selectContent:'',
            selectType: 'all',
            roomType: [
                {key: 'all', value: '全部'},
                {key: '1', value: '单人间'},
                {key: '2', value: '双人间'},
                {key: '3', value: '三人间'}
            ],

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
                        dataIndex: 'room_type',
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
                    pageSize: 10,//每页中显示10条数据
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
                    roomType: '',
                    roomPrice: '',
                    hourPrice: '',
                    roomIntroduction: '',
                    roomState: '1',
                }
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
                    roomType: '',
                    roomPrice: '',
                    hourPrice: '',
                    roomIntroduction: '',
                    roomState: '1',
                }
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
            me.table1.loading = true
            let data = await me.getAllRoom()
            me.table1.data = data
            me.table1.loading = false
            //console.log(me.table1.data)
            me.table1.dataCopy = [...me.table1.data]
        },
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
        editRoom(record) {
            let me = this
            me.room1.visible = true
            me.room1.form.roomId = record.room_id
            me.room1.form.roomUrl = record.room_url
            me.room1.form.roomNumber = record.room_number
            me.room1.form.roomType = record.room_type
            me.room1.form.roomPrice = record.room_price
            me.room1.form.hourPrice = record.hour_price
            me.room1.form.roomIntroduction = record.room_introduction
            me.room1.form.roomState = record.room_state
            console.log(record)
        },
        contentChange(){
            let me= this
            if(this.selectContent.length>0){
                this.table1.data=this.table1.dataCopy.filter(e=>{return Util.fuzzyQuery(e.room_number,me.selectContent)
                })
            }
            else
                this.table1.data=this.table1.dataCopy
        },
        changeSelect(value) {
            if(value==='all')
                this.table1.data = this.table1.dataCopy.filter(() => true);
            else
                this.table1.data = this.table1.dataCopy.filter((e) => e.room_type === value);
        },
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
        addRoomModal() {
            let me = this
            me.room.visible = true
        },
        cancelRoomModal() {
            this.room.visible = false
        },
        cancelRoomModal1() {
            this.room1.visible = false
        },
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
                    } else
                        me.$message.error("保存失败")
                })
            }))
            me.room.form = {
                roomNumber: '',
                roomUrl: '',
                roomType: '',
                roomPrice: '',
                hourPrice: '',
                roomIntroduction: '',
                roomState: true,
            }
            me.imageStatus = {
                file: {},
                fileList: []
            }
            me.room.visible=false
        },
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
                    } else
                        me.$message.error("修改失败")
                })
            }))
            me.imageStatus1 = {
                file: {},
                fileList: []
            }
        },
        deleteRoom(record) {
            let me = this
            deleteRoom({room_id: record.room_id}).then(r => {
                    if (r.data === 1)
                        me.$message.success("删除成功")
                    else
                        me.$message.error("删除失败")
                }
            )
            console.log(record.room_id)
        }
    }
}
</script>
<style scoped>

</style>