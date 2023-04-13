<template>
    <div>
        <p>入住政策：入住时间当天14:00之后，退房时间12:00之前（中间时间留给打扫）<br>钟点房入住时间为6:00之后，退房时间18:00之前</p>
        <a-card style="margin: 20px;border-radius: 5px">
            <a-form-model :label-col="{span:5}" :wrapper-col="{span:12}" >
                <a-form-model-item label="姓名">
                    <a-input style="width: 200px"></a-input>
                </a-form-model-item>
                <a-form-model-item label="电话">
                    <a-input style="width: 200px"></a-input>
                </a-form-model-item>
                <a-form-model-item label="房间性质">
                    <a-select style="width: 200px" v-model="destineInfo.roomNature" @change="natureChange">
                        <a-select-option key="0" value="0">标准房</a-select-option>
                        <a-select-option key="1" value="1">钟点房</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="时间选择">
                    <a-range-picker v-show="destineInfo.roomNature==='0'" size="large" v-model="destineInfo.timePicker" :format="destineInfo.timeFormat" @change="timeChangeOk"></a-range-picker>
                    <a-range-picker v-show="destineInfo.roomNature==='1'" size="large" v-model="destineInfo.timePicker" show-time :format="destineInfo.timeFormat" @ok="timeChangeOk"></a-range-picker>
                </a-form-model-item>
                <a-form-item label="房间类型">
                    <a-select default-value="all" style="width: 200px" @change="changeSelect">
                        <a-select-option key="all" value="all">全部</a-select-option>
                        <a-select-option v-for="item in roomType" :key="item.id" :value="item.id">{{ item.type }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-model-item label="房间选择" :label-col="{span:2}" :wrapper-col="{span:20}">
                    <a-list :grid="{ gutter: 16, column: 4 }" :data-source="destineInfo.roomData">
                        <a-list-item slot="renderItem" slot-scope="item, index">
                            <a-card>
                                <a-descriptions >
                                    <a-descriptions-item label="房间门牌号">
                                        {{item.room_number}}
                                    </a-descriptions-item>
                                    <a-descriptions-item label="房间照片">
                                        <img :src="item.room_url" style="height: 100px;width: 150px">
                                    </a-descriptions-item>
                                    <a-descriptions-item label="房间价格">
                                        ¥66
                                    </a-descriptions-item>
                                </a-descriptions>

                                Card content{{index}}
                            </a-card>
                        </a-list-item>
                    </a-list>
                </a-form-model-item>
            </a-form-model>
        </a-card>
    </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import {getAvailableRoomByTime, getTypeInfo} from '@/api/admin/roomApi'
export default {
    name: "RoomReservation",
    data(){
        return{
            showTime:false,
            roomType: [],
            destineInfo:{
                name:'',
                phone:'',
                roomId:'',
                roomNature:'0',
                timeFormat:'YYYY-MM-DD HH:mm',
                timePicker:[moment('2023-03-15 14:00'),moment('2023-03-16 12:00')],
                roomData:[],//通过选定日期来查询是否有空余的房间
                roomDataCopy:[]
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
                this.destineInfo.timePicker=[moment('2023-03-15 14:00'),moment('2023-03-16 12:00')]
                this.showTime=false
            }
            else {
                this.destineInfo.timePicker=[moment('2023-03-15 10:00'),moment('2023-03-15 13:00')]
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
                    me.destineInfo.roomData=response.data
                    me.destineInfo.roomDataCopy=[...response.data]
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
                me.destineInfo.roomData = me.destineInfo.roomDataCopy.filter(() => true);
            else
                me.destineInfo.roomData = me.destineInfo.roomDataCopy.filter((e) => e.type_id === value);
        },


    }
}
</script>

<style scoped>

</style>