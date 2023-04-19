<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-19 10:40
-->
<template>
    <div>
        <a style="color: #C081FF" @click="goBack"><a-icon type="double-left"/>返回</a>
        <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="房间费用">¥{{identityRegistration.roomFee}}</a-form-item>
            <a-form-item label="已付金额"><a-input-number v-model="identityRegistration.actuallyPaid"></a-input-number></a-form-item>
            <a-form-item label="房间押金"><a-input-number v-model="identityRegistration.deposit"></a-input-number> </a-form-item>
            <a-form-item label="同行人">
                <div v-for="(item,index) in identityRegistration.occupants" :key="index">
                    <a-input style="width: 200px;margin-left: 5px" v-model="item.name" placeholder="姓名"></a-input>
                    <a-input style="width: 200px ;margin-left: 5px" v-model="item.cardId" placeholder="身份证号"></a-input>
                    <a-select style="width: 200px ;margin: 5px" v-model="item.type">
                        <a-select-option value="0">居民身份证</a-select-option>
                        <a-select-option value="1">临时身份证</a-select-option>
                        <a-select-option value="2">港澳台身份证</a-select-option>
                    </a-select>
                </div>
                <a-button type="primary" @click="addOccupant">添加</a-button>
                <a-button type="danger" style="margin-left: 20px" @click="deleteOccupant">删除</a-button>
            </a-form-item>
        </a-form>

        <a-button type="primary" @click="destineCheckIn" style="margin-left:100px;width: 100px">登记</a-button>
    </div>
</template>

<script>
import {addBookAStayInfo} from "@/api/admin/recordApi";
import {getRoomInfoByRecordId} from '@/api/admin/roomApi';
import moment from 'moment'
moment.locale('zh-cn')
export default {
    name: "CheckIn",
    data() {
        return {
            identityRegistration: {
                order_id: '',
                roomFee: 0.0,
                actuallyPaid:0.0,
                deposit: 0.0,
                occupants: [{name: '', cardId: '', type: '0'}],
            },
        }
    },
    mounted() {
        this.identityRegistration.order_id = this.$route.params.id
        this.getData()
    },
    methods: {
        /**
         * 获取房间必要信息
         */
        getData(){
            let me=this
            let start='',end=''
            getRoomInfoByRecordId({order_id: me.identityRegistration.order_id}).then(
                r=>{
                    console.log(r.data)
                    if(r.status===200){
                        start=r.data.check_in_time
                        end=r.data.check_out_time
                        if(r.data.room_type=='1')
                            me.identityRegistration.roomFee=r.data.hour_price
                        else{
                            let time1=moment(start,'YYYY-MM-DD')
                            let time2=moment(end,'YYYY-MM-DD')
                            let day=time2.diff(time1,'day')
                            me.identityRegistration.roomFee=day*r.data.room_price
                        }
                    }
                }
            )
        },
        /**
         * 添加同行人
         */
        addOccupant() {
            this.identityRegistration.occupants.push({name: '', cardId: '', type: '0'})
        },
        /**
         * 删除同行人
         */
        deleteOccupant() {
            this.identityRegistration.occupants.pop()
        },
        /**
         * 预定入住
         */
        destineCheckIn() {
            let me = this
            let params = {
                record_id: me.identityRegistration.order_id,
                occupants: me.identityRegistration.occupants,
                actuallyPaid:me.identityRegistration.actuallyPaid,
                deposit:me.identityRegistration.deposit

            }
            //console.log(params)
            addBookAStayInfo(params).then(r => {
                if (r.status === 200 && r.data === 1) {
                    me.$message.success("添加成功")
                } else
                    me.$message.success("添加失败")
            })
        },
        goBack() {
            this.$router.go(-1)
        }

    }
}
</script>

<style scoped>

</style>