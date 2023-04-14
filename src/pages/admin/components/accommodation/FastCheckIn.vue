<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-14 16:45
-->
<template>
    <div>
        <a-form>
            <a-form-item label="姓名">
                <a-input></a-input>
            </a-form-item>
            <a-form-item label="电话">
                <a-input></a-input>
            </a-form-item>
            <a-form-model-item label="房间性质" prop="roomNature">
                <a-select  v-model="checkInInfo.roomNature" @change="natureChange">
                    <a-select-option key="0" value="0">标准房</a-select-option>
                    <a-select-option key="1" value="1">钟点房</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="时间选择" prop="timePicker">
                <a-range-picker v-show="checkInInfo.roomNature==='0'" size="large" v-model="checkInInfo.timePicker" :format="checkInInfo.timeFormat" @change="timeChangeOk"></a-range-picker>
                <a-range-picker v-show="checkInInfo.roomNature==='1'" size="large" v-model="checkInInfo.timePicker" show-time :format="checkInInfo.timeFormat" @ok="timeChangeOk"></a-range-picker>
            </a-form-model-item>
            <a-form-item label="房间类型">
                <a-select default-value="all" style="width: 200px" @change="changeSelect">
                    <a-select-option key="all" value="all">全部</a-select-option>
                    <a-select-option v-for="item in roomType" :key="item.id" :value="item.id">{{ item.type }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-model-item label="房间选择" :label-col="{span:2}" :wrapper-col="{span:20}" prop="roomId">
                <a-select v-model="checkInInfo.roomId" option-label-prop="label" placeholder="请选择房间">
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
        </a-form>
    </div>
</template>

<script>
import moment from 'moment'
import {getAvailableRoomByTime, getTypeInfo} from "@/api/admin/roomApi";
moment.locale('zh-cn')

export default {
    name: "FastCheckIn",
    data(){
        return{
            timeFormat: 'YYYY-MM-DD',
            time:[moment('2023-03-15'),moment('2023-04-15')],
            roomType:[],
            checkInVisible:false,//快速入住对话框
            checkInInfo:{ //快速入住信息
                name:'',
                phone:'',
                roomNature:'0',
                timeFormat:'YYYY-MM-DD HH:mm',
                timePicker:[moment('2023-03-15 14:00'),moment('2023-03-16 12:00')],
            },
            roomData:[],//通过选定日期来查询是否有空余的房间
            roomDataCopy:[],
        }
    },
    mounted() {
        this.getData()
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
            if(this.checkInInfo.roomNature === '0'){
                this.checkInInfo.timePicker=[moment('2023-03-15 14:00'),moment('2023-03-16 12:00')]
                this.showTime=false
            }
            else {
                this.checkInInfo.timePicker=[moment('2023-03-15 10:00'),moment('2023-03-15 13:00')]
                this.showTime=true
            }
        },
        /**
         * 时间切换对应房间切换
         */
        timeChangeOk(){
            let me=this
            let params={
                start:me.checkInInfo.timePicker[0].format('YYYY-MM-DD HH:mm'),
                end:me.checkInInfo.timePicker[1].format('YYYY-MM-DD HH:mm')
            }
            console.log(params)
            getAvailableRoomByTime(params).then(response=>{
                if(response.status===200&&response.data.length>0){
                    me.roomData=response.data
                    me.roomDataCopy=[...response.data]
                    //console.log(me.checkInInfo.roomData)
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
    }
}
</script>

<style scoped>

</style>