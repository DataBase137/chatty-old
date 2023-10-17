import supabase from "../../utils/supabase";

export default function updateChatLogs() {
    const channel = supabase
    .channel('chat log changes')
    .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'chatlogs',
        },
        (payload) => {
            const eventType = payload.eventType;
            const newRecord = payload.new;
            const oldRecord = payload.old;
            console.log(
                "Event Type: ", eventType,
                "\nNew Record: ", newRecord,
                "\nOld Record: ", oldRecord
            );
        }
    )
    .subscribe()
}