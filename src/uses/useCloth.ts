import {ref} from 'vue'
import axios from "axios";
import {message} from "ant-design-vue";

const dataSource = ref([])
const useCloth =  () => {
        const listStyle = ref([])
        const fetchData = async () => {
            const response = await fetch('https://ec2-13-215-140-47.ap-southeast-1.compute.amazonaws.com:8080/api/clothes/getAll')
            const data = await response.json()
            dataSource.value = data
        }
        const handleDelete = async (id : any) => {
            try {
                await axios.delete(`https://ec2-13-215-140-47.ap-southeast-1.compute.amazonaws.com:8080/api/clothes/delete/${id}`)
                message.success('Data deleted successfully!')
                await fetchData()
            } catch (error) {
                message.error('Error deleting data')
            }
        }
        const getAllStyle = async () => {
        const {data} = await axios.get("https://ec2-13-215-140-47.ap-southeast-1.compute.amazonaws.com:8080/api/style/getAll")
        const optionStyle = data.map((option : any) => {
            return {
                value : option.styleId,
                label: option.styleName,
            }
        })
        listStyle.value = optionStyle
    }
        return {
            dataSource,
            fetchData,
            handleDelete,
            listStyle,
            getAllStyle
        }
}

export default useCloth