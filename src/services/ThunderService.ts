import { ThunderCreateDto } from '../interfaces/thunder/ThunderCreateDto';
import Thunder from "../models/Thunder";
import { ThunderResponseDto } from '../interfaces/thunder/ThunderResponseDto';


const createThunder = async (thunderCreateDto: ThunderCreateDto) => {
    try {
        const thunder = new Thunder({
            host: thunderCreateDto.host,
            title: thunderCreateDto.title,
            hashtags: thunderCreateDto.hashtags,
            limitPlayerCount: thunderCreateDto.limitPlayerCount,
            deadline: thunderCreateDto.deadline,
            content: thunderCreateDto.content,
            createdAt: thunderCreateDto.createdAt,
            updatedAt: thunderCreateDto.updatedAt,
            members: [thunderCreateDto.host]
        });

        await thunder.save();
        const data = {
            _id: thunder._id
        };

        return data;
    } catch (error)
    {
        console.log(error);
        throw(error);
    };
}

const getThunderList = async () => {
    try {
        const thunders: ThunderResponseDto[] | null = await Thunder.find().populate('host', 'name').populate('members', 'name');

        return thunders;
    } catch (error)
    {
        console.log(error);
        throw(error);
    };
}

const getThunder = async (postId: string) => {
    try {
        const thunder: ThunderResponseDto | null = await Thunder.findById(postId).populate('hostId', 'name').populate('members', 'name');

        return thunder;
    } catch (error)
    {
        console.log(error);
        throw(error);
    };
}


const getThunderByHashtags = async (tag: string) => {
    try {
        const thunder: ThunderResponseDto[] | null = await Thunder.find({hashtags: tag}).populate('hostId', 'name').populate('members', 'name');

        return thunder;
    } catch (error)
    {
        console.log(error);
        throw(error);
    };
}



export default {
    createThunder,
    getThunderList,
    getThunder,
    getThunderByHashtags
}