import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {EvaluateRequestDtos} from '../../interfaces/evaluate/request/EvaluateRequestDto';
import {ChatReportsRequestDto} from '../../interfaces/report/request/ChatReportsRequestDto';
import ThunderReports from '../../models/ThunderReports';
import ThunderServiceUtils from '../thunder/ThunderServiceUtils';
import ChatReports from '../../models/ChatReports';
import ThunderEvaluate from '../../models/ThunderEvaluates';
import Evaluate from '../../models/Evaluate';

const evaluateThunder = async (
  evaluateRequestDtos: EvaluateRequestDtos,
  thunderId: string,
): Promise<PostBaseResponseDto> => {
  try {
    var thunderEvaluate = await ThunderEvaluate.findById(thunderId);

    if (thunderEvaluate) {
      //평가하고 있는 번개 방이 있다면
      for (const evaluateRequestDto of evaluateRequestDtos) {
        const userIdList = [];
        userIdList.push(evaluateRequestDto.userId); //중복 방지 userList

        if (userIdList.includes(evaluateRequestDto.userId)) {
          //이미 존재하는 Evaluate 객체이면
          await Evaluate.findByIdAndUpdate(evaluateRequestDto.userId, {
            $push: {scores: evaluateRequestDto.scores}, //존재하는 객체의 scores에 push
          });
        } else {
          const evaluate = new Evaluate({
            //존재하지 않는 Evaluate 객체이면
            userId: evaluateRequestDto.userId, //new Evaluate
            scores: [evaluateRequestDto.scores],
          });

          await evaluate.save();

          thunderEvaluate.evaluates.push(evaluate._id);
        }
      }
    } else {
      //평가하고 있는 번개 방이 없다면
      const thunderEvaluate = new ThunderEvaluate({
        //번개방 평가 객체 생성
        thunderId: thunderId,
        evaluates: [],
      });

      await thunderEvaluate.save();

      for (const evaluateRequestDto of evaluateRequestDtos) {
        const evaluate = new Evaluate({
          //Evaluate 객체 생성
          userId: evaluateRequestDto.userId,
          scores: [evaluateRequestDto.scores],
        });

        await evaluate.save();

        thunderEvaluate.evaluates.push(evaluate._id);
      }
    }

    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  evaluateThunder,
};
