import supabase from "./supabase"

const getProfile = async (profileId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq("id", profileId);
    return data;
}

export default getProfile;