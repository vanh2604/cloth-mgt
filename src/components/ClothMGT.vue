<template>
    <div class="container">
        <div class="button-style">
            <a-button type="primary" @click="state.visible = true">Add Data</a-button>
        </div>
        <div>
            <a-table :columns="state.columns" :data-source="dataSource">
                <template #imageRender="{record}">
                    <img :width="300" :height="300" :src="record.image[0].imageUrl" />
                </template>
                <template #action="{ _, record }">
                    <a-popconfirm
                        title="Are you sure you want to delete this data?"
                        ok-type="danger"
                        :onConfirm="() => handleDelete(record.id)"
                    >
                        <a-button type="link" danger>Delete</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
        </div>
    </div>
    <ModalCreateCloth v-model="state.visible" />
</template>

<script>
import {defineComponent, reactive, onMounted, toRefs} from 'vue'
import {message, Table, Popconfirm, Button} from 'ant-design-vue'
import {Image} from "ant-design-vue";
import ModalCreateCloth from "@/components/ModalCreateCloth.vue";
import axios from 'axios'
import useCloth from "@/uses/useCloth";

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names,vue/no-reserved-component-names
    name: 'Table',
    components: {
        'a-button' : Button,
        'a-table': Table,
        // eslint-disable-next-line vue/no-unused-components
        'a-image': Image,
        'a-popconfirm': Popconfirm,
        ModalCreateCloth
    },
    setup() {
        const state = reactive({
            visible: false,
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    width: 300
                },
                {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                },
                {
                    title: 'Image',
                    dataIndex: '',
                    key: '',
                    slots: { customRender: 'imageRender'}
                },
                {
                    title: 'Action',
                    dataIndex: 'action',
                    key: 'action',
                    slots: {customRender: 'action'}
                }
            ],
        })

        const {  dataSource, fetchData, handleDelete } = useCloth()

        onMounted(() => {
            fetchData()
        })

        return {
            state,
            handleDelete,
            dataSource,
            fetchData,
        }
    },
})
</script>

<style lang="css">
.container {
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
}
.button-style {
    float: right;
    margin-bottom: 24px;
    margin-top: 24px;
}
</style>