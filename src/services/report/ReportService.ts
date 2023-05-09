import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {ThunderReportsRequestDto} from '../../interfaces/report/request/ThunderReportRequestsDto';
import {ChatReportsRequestDto} from '../../interfaces/report/request/ChatReportsRequestDto';
import ThunderReports from '../../models/ThunderReports';
import ThunderServiceUtils from '../thunder/ThunderServiceUtils';
import ChatReports from '../../models/ChatReports';

const reportThunder = async (
  ThunderReportsRequestDto: ThunderReportsRequestDto,
  thunderId: string,
): Promise<void> => {
  try {
    const thunder = await ThunderServiceUtils.getThunderById(thunderId);

    const thunderReports = new ThunderReports({
      userId: thunder.members[0],
      thunderId: thunderId,
      reportIndex: ThunderReportsRequestDto.reportIndex,
      createdAt: Date.now() + 3600000 * 9,
    });

    await thunderReports.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const reportChat = async (
  ChatReportsRequestDto: ChatReportsRequestDto,
  thunderId: string,
): Promise<void> => {
  try {
    const chatReports = new ChatReports({
      userId: ChatReportsRequestDto.userId,
      thunderId: thunderId,
      reportIndex: ChatReportsRequestDto.reportIndex,
      createdAt: Date.now() + 3600000 * 9,
    });

    await chatReports.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  reportThunder,
  reportChat,
};
