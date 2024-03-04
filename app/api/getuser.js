import { createClient } from '@supabase/supabase-js'

export const getStaticProps = async () => {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_PASSWORD
    );

    return { props: { supabase } }
}

export default handler = (req, res, { props: { supabase } }) => {
    let data;
    let error;

    const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();

        data = data;
        error = error;
    }

    getUser();

    if (error) {
        res.status(500).json({ "success": false, error });
    } else {
        res.status(200).json({ "success": true, data });
    }
}