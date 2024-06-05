import {ref} from 'vue'

export function getID(id){
    const data = ref(null)

    data.value = id

    return data

}