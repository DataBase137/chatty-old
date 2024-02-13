import supabase from "./supabase"

const sendMessage = async (message) => {
    const { data, error } = await supabase
        .from('messages')
        .insert([
            { text: message },
        ]);
}

export default sendMessage;