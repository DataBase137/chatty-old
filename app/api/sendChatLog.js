import supabase from "../../utils/supabase";

export default async function sendChatLog(text) {
    const { data, error } = await supabase
        .from('chatlogs')
        .insert([
            { text: text },
        ])
        .select()
    console.log(data, error);
}