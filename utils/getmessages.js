import supabase from "./supabase";

const getMessages = async () => {
    let { data, error } = await supabase
        .from('messages')
        .select('*, profile: profiles(username)');
    return data;
}

export default getMessages;