import {EvaluateRequestDto} from '../../interfaces/evaluate/request/EvaluateRequestDto';
import ThunderEvaluate from '../../models/ThunderEvaluates';
import Evaluate from '../../models/Evaluate';
import User from '../../models/User';

const evaluateThunder = async (
  EvaluateRequestDto: EvaluateRequestDto,
  thunderId: string,
): Promise<void> => {
  try {
    const thunderEvaluate = await ThunderEvaluate.findById(thunderId);

    if (thunderEvaluate) {
      //평가하고 있는 번개 방이 있다면
      for (const evaluateRequest of EvaluateRequestDto.evaluate) {
        const evaluate = await Evaluate.find({
          userId: evaluateRequest.userId,
          thunderId: thunderId,
        });

        if (evaluate) {
          await Evaluate.findByIdAndUpdate(evaluateRequest.userId, {
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

          thunderEvaluate.evaluates.push(evaluate._id);
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

        thunderEvaluate.evaluates.push(evaluate._id);
      }
    }

    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const calculateScore = async (thunderId: string): Promise<void> => {
  try {
    const thunderEvaluate = await ThunderEvaluate.findById(thunderId)
      .populate('thunderId', 'members')
      .populate('evaluates', 'scores');

    if (!thunderEvaluate) {
      const thunderEvaluate = new ThunderEvaluate({
        //번개방 평가 객체 생성
        thunderId: thunderId,
        evaluates: [],
      });

      await thunderEvaluate.save();
    }
    for (const member of (thunderEvaluate.thunderId as any).members) {
      const evaluate = await Evaluate.find({
        userId: member,
        thunderId: thunderId,
      });

      if (!evaluate) {
        const evaluate = new Evaluate({
          //존재하지 않는 Evaluate 객체이면
          userId: member, //new Evaluate
          thunderId: thunderId,
          scores: [],
        });

        await evaluate.save();

        thunderEvaluate.evaluates.push(evaluate._id);
      }
    }

    const totalMember = (thunderEvaluate.thunderId as any).members.length;

    for (const evaluate of thunderEvaluate.evaluates) {
      var totalScore;
      var scoreList = [];

      for (var i = 1; i < totalMember; i++) {
        scoreList.push(3);
      }

      for (var i = 0; i < (evaluate as any).scores.length; i++) {
        scoreList[i] = (evaluate as any).scores[i];
      }

      totalScore =
        scoreList.reduce(function add(sum, currValue) {
          return sum + currValue;
        }, 0) / scoreList.length;

      switch (true) {
        case totalScore < 2.0:
          totalScore = -1;
          break;

        case totalScore < 3.0:
          totalScore = 0;
          break;

        case totalScore < 4.0:
          totalScore = 1;
          break;

        case totalScore <= 5.0:
          totalScore = 2;
          break;

        default:
          totalScore = 0;
          break;
      }

      await User.updateOne((evaluate as any).userId, {
        $inc: {scores: totalScore}, //존재하는 객체의 scores에 push
      });
    }

    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  evaluateThunder,
  calculateScore,
};
