<template>
    <div>
        <a-button type="primary" @click="visible = true">Add Data</a-button>
    </div>
    <div>
        <a-table :columns="columns" :data-source="dataSource">
            <template #imageRender="{record}">
                <img :width="300" :height="300" :src="record.image[0].imageUrl" />
            </template>
            <template #action="{ text, record }">
                <a-popconfirm
                    title="Are you sure you want to delete this data?"
                    ok-type="danger"
                    onConfirm="handleDelete(record.id)"
                >
                    <a-button type="link" danger>Delete</a-button>
                </a-popconfirm>
            </template>
        </a-table>
    </div>
    <ModalCreateCloth v-model="visible" />
</template>

<script>
import {defineComponent, reactive, onMounted, toRefs} from 'vue'
import {message, Table, Popconfirm, Button} from 'ant-design-vue'
import {Image} from "ant-design-vue";
import ModalCreateCloth from "@/components/ModalCreateCloth.vue";
import axios from 'axios'

export default defineComponent({
    name: 'Table',
    components: {
        'a-button' : Button,
        'a-table': Table,
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
            dataSource: [],
        })

        const fetchData = async () => {
            const response = await fetch('http://ec2-13-215-140-47.ap-southeast-1.compute.amazonaws.com:8080/api/clothes/getAll')
            const data = await response.json()
            state.dataSource = data
            console.log(state.dataSource)
        }
        const handleDelete = async (id) => {
            try {
                await axios.delete(`/api/clothes/delete/${id}`)
                message.success('Data deleted successfully!')
                await fetchData()
            } catch (error) {
                message.error('Error deleting data')
            }
        }
        onMounted(() => {
            fetchData()
        })

        return toRefs(state)
    },
})
</script>