
import api from "../utils/api";

export const getESP32Status = async () =>{
    try {
        const res = await api.get("esp32/status");
        return res.data.connected
    } catch (error) {     
        throw error
    }
}


export const getAllValveStatus = async () =>{
    try {
        const res = await api.get("esp32/get/getAllValveStatus");
        return res.data.data
    } catch (error) {     
        throw error
    }
}


export const systemPowerOn = async (action) =>{
    try {
        const res = await api.post("esp32/post/forceOFF_ON_System",{action:action});
        return res
    } catch (error) {     
        throw error
    }
}




