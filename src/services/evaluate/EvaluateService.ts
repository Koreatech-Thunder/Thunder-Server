import {EvaluateRequestDto} from '../../interfaces/evaluate/request/EvaluateRequestDto';
import ThunderEvaluate from '../../models/ThunderEvaluates';
import Evaluate from '../../models/Evaluate';

const evaluateThunder = async (
  EvaluateRequestDto: EvaluateRequestDto,
  thunderId: string,
): Promise<void> => {
  try {
    const thunderEvaluate = await ThunderEvaluate.findOne({
      thunderId: thunderId,
    });
    if (thunderEvaluate) {
      //평가하고 있는 번개 방이 있다면
      for (const evaluateRequest of EvaluateRequestDto.evaluate) {
        const evaluate = await Evaluate.findOne({
          $and: [{userId: evaluateRequest.userId}, {thunderId: thunderId}],
        });

        if (evaluate) {
          await Evaluate.findByIdAndUpdate(evaluate, {
            $push: {scores: evaluateRequest.score}, //존재하는 객체의 scores에 push
          });
        } else {
          const evaluate = new Evaluate({
            //존재하지 않는 Evaluate 객체이면
            userId: evaluateRequest.userId, //new Evaluate
            thunderId: thunderId,
            scores: [evaluateRequest.score],
          });

          await evaluate.save();

          await ThunderEvaluate.findByIdAndUpdate(thunderEvaluate, {
            $push: {evaluates: evaluate._id}, //존재하는 객체의 scores에 push
          });
        }
      }
    } else {
      const thunderEvaluate = new ThunderEvaluate({
        //번개방 평가 객체 생성
        thunderId: thunderId,
        evaluates: [],
      });

      await thunderEvaluate.save();

      for (const evaluateRequest of EvaluateRequestDto.evaluate) {
        const evaluate = new Evaluate({
          //Evaluate 객체 생성
          userId: evaluateRequest.userId,
          thunderId: thunderId,
          scores: [evaluateRequest.score],
        });

        await evaluate.save();

        await ThunderEvaluate.findByIdAndUpdate(thunderEvaluate, {
          $push: {evaluates: evaluate._id}, //존재하는 객체의 scores에 push
        });
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
