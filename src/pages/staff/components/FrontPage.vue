<template>
    <div>
        <a-card style="height: 200px;margin: 10px;">
            <p style="font-weight: bold;font-size: 16px">经营概况</p>
            <a-row :gutter="[24,24]">
                <a-col span="6">
                    <a-card
                        style="width: auto;height: 120px;background: linear-gradient(to left,#7F87FE,#09BDFE);border-radius: 8px ">
                        <div style="text-align: left;margin-left: 30px;font-size: 16px;color: white">
                            <p>房间总数</p>
                            <span style="font-size: 20px;">20</span>
                        </div>
                    </a-card>
                </a-col>
                <a-col span="6">
                    <a-card>
                        <span>图标2</span>
                    </a-card>
                </a-col>
                <a-col span="6">
                    <a-card>
                        <span>图标3</span>
                    </a-card>
                </a-col>
                <a-col span="6">
                    <a-card>
                        <span>图标4</span>
                    </a-card>
                </a-col>
            </a-row>

        </a-card>

    </div>
</template>

<script>
export default {
    name: "FrontPage",
}
</script>

<style scoped>

</style>