import { join, split } from 'lodash';
import supabase from '../services/supabase.ts';

const patchFileName = (name: string) => join(split(join(split(name, ' '), '_'), '\%20'), '_')

const useBuckets = () => {
    const uploadFile = async (file: File, fileName?: string) => {
        const { data } = await supabase
            .storage
            .from('wall_of_fame_posters')  // Replace 'images' with your bucket name
            .upload(fileName || patchFileName(`${Date.now()}_${file.name}`), file);
        return data;
    };

    const getPublicUrl = async (fileName: string) => {
        const { data } = supabase
            .storage
            .from('wall_of_fame_posters')
            .getPublicUrl(fileName);
        return data?.publicUrl;
    };

    const deleteFile = async (filePath: string) => supabase
        .storage
        .from('wall_of_fame_posters')
        .remove([filePath]);

    return { uploadFile, getPublicUrl, deleteFile };
};

export default useBuckets;
