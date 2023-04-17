<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-14 16:45
-->
<template>
    <div>
        <a-card style="margin: 20px;border-radius: 5px">
            <a-form-model :label-col="{span:5}" :wrapper-col="{span:12}">
                <a-form-model-item label="姓名" >
                    <a-input style="width: 200px" v-model="checkInInfo.name"></a-input>
                </a-form-model-item>
                <a-form-model-item label="电话" >
                    <a-input style="width: 200px" v-model="checkInInfo.phone"></a-input>
                </a-form-model-item>
                <a-form-model-item label="房间性质" prop="roomNature">
                    <a-select style="width: 200px" v-model="checkInInfo.roomNature" @change="natureChange">
                        <a-select-option key="0" value="0">标准房</a-select-option>
                        <a-select-option key="1" value="1">钟点房</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="时间选择" prop="timePicker">
                    <a-range-picker v-show="checkInInfo.roomNature==='0'" size="large" v-model="checkInInfo.timePicker"
                                    :format="checkInInfo.timeFormat" @change="timeChangeOk"></a-range-picker>
                    <a-range-picker v-show="checkInInfo.roomNature==='1'" size="large" v-model="checkInInfo.timePicker"
                                    show-time :format="checkInInfo.timeFormat" @ok="timeChangeOk"></a-range-picker>
                </a-form-model-item>
                <a-form-item label="房间类型">
                    <a-select default-value="all" style="width: 200px" @change="changeSelect">
                        <a-select-option key="all" value="all">全部</a-select-option>
                        <a-select-option v-for="item in roomType" :key="item.id" :value="item.id">{{item.type}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-model-item label="房间选择" :label-col="{span:2}" :wrapper-col="{span:20}" prop="roomId">
                    <a-select v-model="checkInInfo.roomId" option-label-prop="label" placeholder="请选择房间">
                        <a-select-option v-for="item in roomData" :key="item.room_id" :value="item.room_id"
                                         :label="item.room_number">
                            <a-card>
                                <a-descriptions bordered :column="5">
                                    <a-descriptions-item label="房间门牌号">
                                        {{ item.room_number }}
                                    </a-descriptions-item>
                                    <a-descriptions-item label="房间价格">
                                        ¥{{ item.room_price }}
                                    </a-descriptions-item>
                                    <a-descriptions-item label="钟点房价格">
                                        ¥{{ item.hour_price }}
                                    </a-descriptions-item>
                                    <a-descriptions-item label="房间类型">
                                        {{ item.type }}
                                    </a-descriptions-item>
                                    <a-descriptions-item label="房间照片">
                                        <img :src="item.room_url" style="height: 100px;width: 150px">
                                    </a-descriptions-item>
                                </a-descriptions>
                            </a-card>
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="身份登记">
                    <div v-for="(item,index) in checkInInfo.occupants" :key="index">
                        <a-card style="margin-top: 2px">
                            <a-input style="width: 200px;margin-left: 5px" v-model="item.name" placeholder="姓名"></a-input>
                            <a-input style="width: 200px ;margin-left: 5px" v-model="item.cardId" placeholder="身份证号"></a-input>
                            <a-select style="width: 200px ;margin-left: 5px" v-model="item.type">
                                <a-select-option  value="0" >居民身份证</a-select-option>
                                <a-select-option value="1">临时身份证</a-select-option>
                                <a-select-option value="2">港澳台身份证</a-select-option>
                            </a-select>
                        </a-card>
                    </div>
                    <a-button type="primary" @click="addOccupant" >添加</a-button>
                    <a-button type="danger" style="margin-left: 20px" @click="deleteOccupant">删除</a-button>
                </a-form-model-item>
                <a-form-model-item label="操作">
                    <a-button style="width: 150px" type="primary" @click="submitInfo">确定</a-button>
                </a-form-model-item>
            </a-form-model>
        </a-card>
    </div>
</template>

<script>
import moment from 'moment'
import {getAvailableRoomByTime, getTypeInfo} from "@/api/admin/roomApi";
import {addFastCheckIn} from '@/api/admin/recordApi'

moment.locale('zh-cn')

export default {
    name: "FastCheckIn",
    data() {
        return {
            timeFormat: 'YYYY-MM-DD',
            time: [moment('2023-03-15'), moment('2023-04-15')],
            roomType: [],
            checkInInfo: { //快速入住信息
                name: '',
                phone: '',
                roomNature: '0',
                roomId:'',
                timeFormat: 'YYYY-MM-DD HH:mm',
                timePicker: [moment('2023-03-15 14:00'), moment('2023-03-16 12:00')],
                occupants:[{name:'',cardId:'',type:'0'}],
            },
            roomData: [],//通过选定日期来查询是否有空余的房间
            roomDataCopy: [],
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            let me = this
            getTypeInfo().then(r => {
                if (r.status === 200 && r.data.length > 0) {
                    me.roomType = r.data
                }
            })
            me.timeChangeOk()
        },
        /**
         * 房间性质改变
         */
        natureChange() {
            if (this.checkInInfo.roomNature === '0') {
                this.checkInInfo.timePicker = [moment('2023-03-15 14:00'), moment('2023-03-16 12:00')]
                this.showTime = false
            } else {
                this.checkInInfo.timePicker = [moment('2023-03-15 10:00'), moment('2023-03-15 13:00')]
                this.showTime = true
            }
        },
        /**
         * 时间切换对应房间切换
         */
        timeChangeOk() {
            let me = this
            let params = {
                start: me.checkInInfo.timePicker[0].format('YYYY-MM-DD HH:mm'),
                end: me.checkInInfo.timePicker[1].format('YYYY-MM-DD HH:mm')
            }
            console.log(params)
            getAvailableRoomByTime(params).then(response => {
                if (response.status === 200 && response.data.length > 0) {
                    me.roomData = response.data
                    me.roomDataCopy = [...response.data]
                    //console.log(me.checkInInfo.roomData)
                }
            })
        },
        /**
         * 房间类别切换
         * @param value
         */
        changeSelect(value) {
            let me = this
            if (value === 'all')
                me.roomData = me.roomDataCopy.filter(() => true);
            else
                me.roomData = me.roomDataCopy.filter((e) => e.type_id === value);
        },
        addOccupant(){
            this.checkInInfo.occupants.push({name:'',cardId:'',type:'0'})
        },
        deleteOccupant(){
            this.checkInInfo.occupants.pop()
        },
        /**
         * 提交入住信息
         */
        submitInfo(){
            console.log(this.checkInInfo)
            let me=this
            let params={
                customer_name:me.checkInInfo.name,
                customer_phone:me.checkInInfo.phone,
                room_id:me.checkInInfo.roomId,
                room_type: me.checkInInfo.roomNature,
                check_in_time: me.checkInInfo.timePicker[0].format('YYYY-MM-DD HH:mm'),
                check_out_time: me.checkInInfo.timePicker[1].format('YYYY-MM-DD HH:mm'),
                occupants:me.checkInInfo.occupants
            }
            addFastCheckIn(params).then(r=>{
                if(r.data===1){
                    me.$message.success("入住成功")
                }
                else
                    me.$message.error("入住失败")
            })
        }
    }
}
</script>

<style scoped>

</style>