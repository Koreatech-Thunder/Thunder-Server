import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {EvaluateRequestDtos} from '../../interfaces/evaluate/request/EvaluateRequestDto';
import {ChatReportsRequestDto} from '../../interfaces/report/request/ChatReportsRequestDto';
import ThunderReports from '../../models/ThunderReports';
import ThunderServiceUtils from '../thunder/ThunderServiceUtils';
import ChatReports from '../../models/ChatReports';
import ThunderEvaluate from '../../models/ThunderEvaluates';
import Evaluate from '../../models/Evaluate';

const evaluateThunder = async (
  EvaluateRequestDtos: EvaluateRequestDtos,
  thunderId: string,
): Promise<PostBaseResponseDto> => {
  try {
    var thunderEvaluate = await ThunderEvaluate.findById(thunderId);

    for (const evaluateRequestDto of EvaluateRequestDtos) {
      const userIdList = [];
      userIdList.push(evaluateRequestDto.userId);

      if (userIdList.includes(evaluateRequestDto.userId)) {
        await Evaluate.findByIdAndUpdate(evaluateRequestDto.userId, {
          $push: {scores: evaluateRequestDto.scores},
        });
      } else {
        const evaluate = new Evaluate({
          userId: evaluateRequestDto.userId,
          scores: [evaluateRequestDto.scores],
        });

        await evaluate.save();

        if (thunderEvaluate) {
          thunderEvaluate.evaluates.push();
        } else {
          const thunderEvaluate = new ThunderEvaluate({
            thunderId: thunderId,
            evaluates: [],
          });
        }
      }
    }

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
  evaluateThunder,
};
