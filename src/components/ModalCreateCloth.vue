<template>
    <div>
        <a-modal
                title="Add Data"
                v-model:visible="value"
        >
            <a-form :model="formData" layout="vertical">
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
                    label="Category"
                    name="style"
                    :rules="[{ required: true, message: 'Please select category' }]"
                >
                    <a-select
                    ref="select"
                    v-model:value="formData.style"
                    :options="listStyle"
                    >

                    </a-select>
                </a-form-item>
                <a-form-item

                        label="Image"
                        name="image"
                        :rules="[{ required: true, message: 'Please upload an image' }]"
                >
                    <a-upload
                            :before-upload="beforeUpload"
                            :file-list="formData.image"
                    >
                        <a-button>
                            <upload-outlined></upload-outlined>
                            Click to Upload
                        </a-button>
                    </a-upload>
                </a-form-item>
            </a-form>
            <template #footer>
                <a-button key="back" @click="handleCancel">Cancel</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">Submit</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { Modal, Button, Form, Input, Textarea, Upload, message, Select } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue';
import axios from 'axios'
import useCloth from "@/uses/useCloth";

export default defineComponent({
    name: 'AddDataModal',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
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
        'a-select': Select,
        UploadOutlined
    },
    setup(props,{emit}) {
        const URL_UPLOAD = "https://api.cloudinary.com/v1_1/davd7xm53/image/upload"
        const CLOUDINARY_UPLOAD_PRESET = 'sbhfd4ls';
        const form = ref(null)
        const loading = ref(false)
        const formData = reactive({
            name: '',
            description: '',
            image: [],
            style: ""
        })
        const uploading = ref(false)
        const {fetchData, getAllStyle, listStyle, dataSource } = useCloth()

        const handleUpload = (action) => {
            const URL_UPLOAD = "https://api.cloudinary.com/v1_1/davd7xm53/image/upload"
            const CLOUDINARY_UPLOAD_PRESET = 'sbhfd4ls';
            const form = new FormData();
            form.append('file', action.file);
            form.append('upload_preset',CLOUDINARY_UPLOAD_PRESET)

            return axios.post(`${URL_UPLOAD}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                console.log(response.data.secure_url)
                 formData.image =  response.data.secure_url; // assuming the server returns the URL of the uploaded image
            });
        }
        const beforeUpload = (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG/PNG file!');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('Image must smaller than 2MB!');
                return false;
            }
            formData.image = [...formData.image,file]
            return false;
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
                const form = new FormData();
                form.append('file', image[0]);
                form.append('upload_preset',CLOUDINARY_UPLOAD_PRESET)
                loading.value = true
                const {data : imageUrl} = await axios.post(`${URL_UPLOAD}`, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                const dataCloth = {
                    name: name,
                    description: description,
                    image: [imageUrl.secure_url],
                    model3d: ""
                }
                const styleId = formData.style
                const res = await axios.post(`http://ec2-13-215-140-47.ap-southeast-1.compute.amazonaws.com:8080/api/clothes/insert/${styleId}`,dataCloth)
                if(res) {
                    await fetchData()
                }
                loading.value = false
                message.success('Data added successfully!')
                emit('update:modelValue',false)
            } catch (error) {
                message.error('Error adding data')
                loading.value = false
            }
        }

        const handleCancel = () => {
            formData.name = ''
            formData.description = ''
            emit('update:modelValue',false)
        }

        getAllStyle()

        return {
            form,
            formData,
            uploading,
            beforeUpload,
            handleUploadSuccess,
            handleUpload,
            handleSubmit,
            handleCancel,
            listStyle,
            loading,
            dataSource
        }
    },
})
</script>