<template>
    <div>
        <a-modal
                title="Add Data"
                v-model:visible="visible"
                @ok="handleSubmit"
                @cancel="handleCancel"
        >
            <a-form :form="form" layout="vertical">
                <a-form-item
                        label="Name"
                        name="name"
                        :rules="[{ required: true, message: 'Please enter a name' }]"
                >
                    <a-input v-model:value="formData.name" />
                </a-form-item>
                <a-form-item
                        label="Description"
                        name="description"
                        :rules="[{ required: true, message: 'Please enter a description' }]"
                >
                    <a-textarea v-model:value="formData.description" />
                </a-form-item>
                <a-form-item
                        label="Image"
                        name="image"
                        :rules="[{ required: true, message: 'Please upload an image' }]"
                >
                    <a-upload
                            :before-upload="beforeUpload"
                            :on-success="handleUploadSuccess"
                            :show-upload-list="false"
                    >
                        <a-button>
                            <upload-outlined></upload-outlined>
                            Click to Upload
                        </a-button>
                    </a-upload>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { Modal, Button, Form, Input, Textarea, Upload, message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue';
import axios from 'axios'

export default defineComponent({
    name: 'AddDataModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    components: {
        'a-modal': Modal,
        'a-button': Button,
        'a-form': Form,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-textarea': Textarea,
        'a-upload': Upload,
        UploadOutlined
    },
    setup() {
        const form = ref(null)
        const formData = reactive({
            name: '',
            description: '',
            image: null,
        })
        const uploading = ref(false)

        const beforeUpload = (file) => {
            formData.image = file
            return false
        }

        const handleUploadSuccess = async (response) => {
            const imageUrl = response.data.imageUrl
            formData.image = imageUrl
            uploading.value = false
            message.success('Image uploaded successfully')
        }

        const handleSubmit = async () => {
            try {
                const { name, description, image } = formData
                const formDataToSubmit = new FormData()
                formDataToSubmit.append('name', name)
                formDataToSubmit.append('description', description)
                formDataToSubmit.append('image', image)
                await axios.post('/api/data', formDataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                message.success('Data added successfully!')
            } catch (error) {
                message.error('Error adding data')
            }
        }

        const handleCancel = () => {
            form.value.resetFields()
            formData.name = ''
            formData.description = ''
            formData.image = null
        }

        return {
            form,
            formData,
            uploading,
            beforeUpload,
            handleUploadSuccess,
            handleSubmit,
            handleCancel,
        }
    },
})
</script>