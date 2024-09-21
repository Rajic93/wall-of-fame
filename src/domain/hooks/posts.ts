import { useState } from 'react';
import { notification } from 'antd';
import { find } from 'lodash';
import useSession from './useSession.ts';
import useBuckets from './buckets.ts';
import PostItem, { PostTypes } from '../models/Post.ts';
import supabase from '../services/supabase.ts';

const usePosts = () => {
    const [posts, setPosts] = useState<Record<string, any>[]>([]);
    const { session } = useSession();
    const { uploadFile, getPublicUrl, deleteFile } = useBuckets();
    const [notifications] = notification.useNotification();

    const fetchPosts = async (boardId?: number) => new Promise(async (resolve, reject) => {
        const builder = supabase.from('posts').select('*');
        const { data, error } = await (boardId ? builder.eq('board_id', boardId) : builder);
        if (error) {
            return reject(error);
        }
        return resolve(data);
    })
        .then((fetchedPosts: any) => fetchedPosts.map((post: Record<string, any>) => ({
            type: post.post_type,
            size: post.post_size,
            index: post.start_at_index,
            imageSrc: post.data.imageSrc || post.data.image_src,
            url: post.data.url,
            postId: post.data.postId || post.data.post_id,
            id: post.id
        })))
        .then((fetchedPosts) => {
            setPosts(fetchedPosts as Record<string, any>[])
            return fetchedPosts;
        })
        .catch((error) => {
            notifications.error({
                message: `Failed to fetch posts: ${error.toString()}`,
                placement: 'topRight',
            });
            console.error('Error fetching posts:', error);
        });

    const savePost = (post: PostItem) =>
        new Promise(async (resolve, reject) => {
            if (post.type === PostTypes.POSTER && !post.file) {
                return reject(new Error('File is not provided.'));
            }
            let publicUrl;
            let fileId;
            let filePath;
            let fileName;
            if (post.type === PostTypes.POSTER && post.file) {
                fileName = `${session?.user.id}_${post.size}_${post.type}_${Date.now()}`;
                const uploaded = await uploadFile(post.file, fileName);
                fileId = uploaded?.id;
                filePath = uploaded?.fullPath;
                publicUrl = await getPublicUrl(fileName);
            }
            const now = new Date();
            const expiresAt = new Date(now)
            expiresAt.setDate(now.getDate() + 7)
            const { data, error } = await supabase
                .from('posts')  // Replace 'users' with your actual table name
                .insert([
                    {
                        inserted_at: now.toISOString(),
                        updated_at: now.toISOString(),
                        expires_at: expiresAt.toISOString(),
                        data: {
                            image_src: publicUrl,
                            post_id: post.postId,
                            url: post.url,
                            file_id: fileId,
                            file_path: filePath,
                            file_name: fileName,
                        },
                        post_type: post.type,
                        post_size: post.size,
                        table_row_size: 50,
                        table_column_size: 20,
                        start_at_index: post.index,
                        user_id: session?.user?.id,
                        board_id: post.boardId,
                    },
                ]);  // Insert the form data
            if (error) {
                return reject(error);
            }
            return resolve(data);
        })
            .then(() => {
                notifications.success({
                    message: 'Successfully created post.',
                    placement: 'topRight',
                })
                return fetchPosts();
            })
            .catch((error) => {
                notifications.error({
                    message: `Failed to create post: ${error.toString()}`,
                    placement: 'topRight',
                });
                console.error('Error fetching users:', error);
            });

    const getPostById = (id: number) => new Promise(async (resolve, reject) => {
        const { data, error } = await supabase.from('posts').select().eq('id', id);
        if (error) {
            return reject(error);
        }
        return resolve(find(data, (record) => record.id === id));
    })

    const deletePost = (postId: number) => new Promise(async (resolve, reject) => {
        const res: Record<string, any> = await getPostById(postId) as PostItem;
        if (res?.data?.file_id && res.data.file_name) {
            await deleteFile(res.data.file_name);
        }

        const { data, error } = await supabase.from('posts').delete().eq('id', postId);
        if (error) {
            return reject(error);
        }
        return resolve(data);
    })
        .then(() => {
            notifications.success({
                message: 'Successfully deleted post.',
                placement: 'topRight',
            })
            return fetchPosts();
        })
        .catch((error) => {
            notifications.error({
                message: `Failed to delete post: ${error.toString()}`,
                placement: 'topRight',
            });
            console.error('Error fetching posts:', error);
        });

    return { posts, savePost, deletePost, fetchPosts };
};

export default usePosts;
