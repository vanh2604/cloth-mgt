<template>
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
</template>

<script>
import {defineComponent, reactive, onMounted, toRefs} from 'vue'
import {message, Table, Popconfirm} from 'ant-design-vue'
import {Image} from "ant-design-vue";
import axios from 'axios'

export default defineComponent({
    name: 'Table',
    components: {
        'a-table': Table,
        'a-image': Image,
        'a-popconfirm': Popconfirm
    },
    setup() {
        const state = reactive({
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
            const response = await fetch('/api/clothes/getAll')
            const data = await response.json()
            console.log(data)
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