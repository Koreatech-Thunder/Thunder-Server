import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {ThunderReportsRequestDto} from '../../interfaces/report/request/ThunderReportRequestsDto';
import {ChatReportsRequestDto} from '../../interfaces/report/request/ChatReportsRequestDto';
import ThunderReports from '../../models/ThunderReports';
import ThunderServiceUtils from '../thunder/ThunderServiceUtils';
import ChatReports from '../../models/ChatReports';

const reportThunder = async (
  thunderReportsRequestDto: ThunderReportsRequestDto,
  thunderId: string,
): Promise<void> => {
  try {
    const thunder = await ThunderServiceUtils.getThunderOneById(thunderId);

    const thunderReports = new ThunderReports({
      userId: thunder.members[0],
      thunderId: thunderId,
      reportIndex: thunderReportsRequestDto.reportIndex,
      createdAt: Date.now() + 3600000 * 9,
    });

    await thunderReports.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const reportChat = async (
  chatReportsRequestDto: ChatReportsRequestDto,
  thunderId: string,
): Promise<void> => {
  try {
    const chatReports = new ChatReports({
      userId: chatReportsRequestDto.userId,
      thunderId: thunderId,
      reportIndex: chatReportsRequestDto.reportIndex,
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
