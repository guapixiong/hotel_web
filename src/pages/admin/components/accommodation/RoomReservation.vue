<template>
    <div>
        <p>入住政策：入住时间当天14:00之后，退房时间12:00之前（中间时间留给打扫）<br>钟点房入住时间为6:00之后，退房时间18:00之前</p>
        <a-card style="margin: 20px;border-radius: 5px">
            <a-form-model ref="ruleForm" :rules="rules" :label-col="{span:5}" :wrapper-col="{span:12}" :model="destineInfo">
                <a-form-model-item label="姓名" prop="name">
                    <a-input style="width: 200px" v-model="destineInfo.name"></a-input>
                </a-form-model-item>
                <a-form-model-item label="电话" prop="phone">
                    <a-input style="width: 200px" v-model="destineInfo.phone"></a-input>
                </a-form-model-item>
                <a-form-model-item label="房间性质" prop="roomNature">
                    <a-select style="width: 200px" v-model="destineInfo.roomNature" @change="natureChange">
                        <a-select-option key="0" value="0">标准房</a-select-option>
                        <a-select-option key="1" value="1">钟点房</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="时间选择" prop="timePicker">
                    <a-range-picker v-show="destineInfo.roomNature==='0'" size="large" v-model="destineInfo.timePicker" :format="destineInfo.timeFormat" @change="timeChangeOk"></a-range-picker>
                    <a-range-picker v-show="destineInfo.roomNature==='1'" size="large" v-model="destineInfo.timePicker" show-time :format="destineInfo.timeFormat" @ok="timeChangeOk"></a-range-picker>
                </a-form-model-item>
                <a-form-item label="房间类型">
                    <a-select default-value="all" style="width: 200px" @change="changeSelect">
                        <a-select-option key="all" value="all">全部</a-select-option>
                        <a-select-option v-for="item in roomType" :key="item.id" :value="item.id">{{ item.type }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-model-item label="房间选择" :label-col="{span:2}" :wrapper-col="{span:20}" prop="roomId">
                    <a-select v-model="destineInfo.roomId" option-label-prop="label" placeholder="请选择房间">
                        <a-select-option v-for="item in roomData" :key="item.room_id" :value="item.room_id" :label="item.room_number">
                                <a-card>
                                    <a-descriptions  bordered :column="5">
                                        <a-descriptions-item label="房间门牌号">
                                            {{item.room_number}}
                                        </a-descriptions-item>
                                        <a-descriptions-item label="房间价格">
                                            ¥{{item.room_price}}
                                        </a-descriptions-item>
                                        <a-descriptions-item label="钟点房价格">
                                            ¥{{item.hour_price}}
                                        </a-descriptions-item>
                                        <a-descriptions-item label="房间类型">
                                            {{item.type}}
                                        </a-descriptions-item>
                                        <a-descriptions-item label="房间照片">
                                            <img :src="item.room_url" style="height: 100px;width: 150px">
                                        </a-descriptions-item>
                                    </a-descriptions>
                                </a-card>
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{offset:5}">
                    <a-button type="primary" @click="submitReservation">确定</a-button>
                    <a-button type="primary" style="margin-left: 20px" @click="resetForm">重置</a-button>
                </a-form-model-item>
            </a-form-model>
        </a-card>
    </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import {getAvailableRoomByTime, getTypeInfo,insertReservation} from '@/api/admin/roomApi'
export default {
    name: "RoomReservation",
    data(){
        return{
            showTime:false,
            roomType: [],
            rules: {
                name:[{required: true,message:'请输入姓名'}],
                phone:[{required:true ,message:'请输入电话'}],
                roomNature: [{required:true,trigger:'change'}],
                timePicker:[{required:true}],
                roomId:[{required:true,message:'请选择房间'}]
            },
            roomData:[],//通过选定日期来查询是否有空余的房间
            roomDataCopy:[],
            destineInfo:{
                name:'',
                phone:'',
                roomId:'',
                roomNature:'0',
                timeFormat:'YYYY-MM-DD HH:mm',
                timePicker:[moment(moment().format('YYYY-MM-DD 14:00')),moment(moment().format('YYYY-MM-DD 14:00')).add(1,'d').add(-2,'h')],

            },

        }
    },
    mounted() {
        this.getData()
        this.timeChangeOk()

    },
    methods:{
        getData(){
            let me=this
            getTypeInfo().then(r=>{
                if(r.status===200&&r.data.length>0){
                    me.roomType=r.data
                }
            })
        },
        /**
         * 房间性质改变
         */
        natureChange(){
            if(this.destineInfo.roomNature === '0'){
                this.destineInfo.timePicker=[moment(moment().format('YYYY-MM-DD 14:00')),moment(moment().format('YYYY-MM-DD 14:00')).add(1,'d').add(-2,'h')]
                this.showTime=false
            }
            else {
                this.destineInfo.timePicker=[moment(),moment().add(3,'h')]
                this.showTime=true
            }
        },
        /**
         * 时间切换对应房间切换
         */
        timeChangeOk(){
            let me=this
            let params={
                start:me.destineInfo.timePicker[0].format('YYYY-MM-DD HH:mm'),
                end:me.destineInfo.timePicker[1].format('YYYY-MM-DD HH:mm')
            }
            console.log(params)
            getAvailableRoomByTime(params).then(response=>{
                if(response.status===200&&response.data.length>0){
                    me.roomData=response.data
                    me.roomDataCopy=[...response.data]
                    //console.log(me.destineInfo.roomData)
                }
            })

        },
        /**
         * 房间类别切换
         * @param value
         */
        changeSelect(value) {
            let me=this
            if(value==='all')
                me.roomData = me.roomDataCopy.filter(() => true);
            else
                me.roomData = me.roomDataCopy.filter((e) => e.type_id === value);
        },
        /**
         * 提交预定
         */
        submitReservation(){
            let me=this
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let params={
                        customer_name:me.destineInfo.name,
                        customer_phone:me.destineInfo.phone,
                        room_id:me.destineInfo.roomId,
                        room_type:me.destineInfo.roomNature,
                        check_in_time:me.destineInfo.timePicker[0].format('YYYY-MM-DD HH:mm'),
                        check_out_time:me.destineInfo.timePicker[1].format('YYYY-MM-DD HH:mm')
                    }
                    insertReservation(params).then(r=>{
                        if(r.data===1&&r.status===200){
                            me.$message.success("预定成功")
                        }
                        else
                            me.$message.error("预定失败")
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
            this.destineInfo={
                name:'',
                    phone:'',
                    roomId:'',
                    roomNature:'0',
                    timeFormat:'YYYY-MM-DD HH:mm',
                    timePicker:[moment(moment().format('YYYY-MM-DD 14:00')),moment(moment().format('YYYY-MM-DD 14:00')).add(1,'d').add(-2,'h')]
            }
        },


    }
}
</script>

<style scoped>

</style>