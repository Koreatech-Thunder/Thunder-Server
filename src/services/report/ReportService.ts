import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {ThunderReportsRequestDto} from '../../interfaces/report/request/ThunderReportRequestsDto';
import {ChatReportsRequestDto} from '../../interfaces/report/request/ChatReportsRequestDto';
import ThunderReports from '../../models/ThunderReports';
import ThunderServiceUtils from '../thunder/ThunderServiceUtils';
import ChatReports from '../../models/ChatReports';

const reportThunder = async (
  ThunderReportsRequestDto: ThunderReportsRequestDto,
  thunderId: string,
): Promise<PostBaseResponseDto> => {
  try {
    const thunder = await ThunderServiceUtils.getThunderById(thunderId);

    ThunderReportsRequestDto.userId = thunder.members[0].toString();

    const thunderReports = new ThunderReports({
      userId: ThunderReportsRequestDto.userId,
      thunderId: thunderId,
      reportIndex: ThunderReportsRequestDto.reportIndex,
      createdAt: Date.now() + 3600000 * 9,
    });

    await thunderReports.save();

    const data = {
      _id: thunderReports._id,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const reportChat = async (
  ChatReportsRequestDto: ChatReportsRequestDto,
  thunderId: string,
): Promise<PostBaseResponseDto> => {
  try {
    const chatReports = new ChatReports({
      userId: ChatReportsRequestDto.userId,
      thunderId: thunderId,
      reportIndex: ChatReportsRequestDto.reportIndex,
      createdAt: Date.now() + 3600000 * 9,
    });

    await chatReports.save();

    const data = {
      _id: chatReports._id,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  reportThunder,
  reportChat,
};
