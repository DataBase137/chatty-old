import supabase from "../../utils/supabase";

export default async function chatLogs() {
    const { data } = await supabase.from("chatlogs").select()
    return <pre>{JSON.stringify(data, null, 2)}</pre>
}