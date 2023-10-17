import supabase from "../../utils/supabase";

export default async function getChatLogs() {
    let { data: chatlogs, error } = await supabase
        .from('chatlogs')
        .select()
    return chatlogs;
}