import {ref} from 'vue'

export function getID(id){
    const data = ref(null)

    data.value = id

    console.log(data.value);
    return data

}