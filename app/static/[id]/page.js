import { notFound } from "next/navigation";
import supabase from "../../../utils/supabase";

export async function generateStaticParams() {
    const {data: chatLog} = await supabase.from('chatlogs').select('id')
    return chatLog ?? [];
}

export default async function ChatLog({
    params: { id }
}) {
    const { data: chatLog } = await supabase
        .from('chatlogs')
        .select()
        .match({ id })
        .single();

        if (!chatLog) {
            notFound()
        }
    return <pre>{JSON.stringify(chatLog, null, 2)}</pre>
}