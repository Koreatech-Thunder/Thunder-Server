import ThunderEvaluate from '../../models/ThunderEvaluates';
import Evaluate from '../../models/Evaluate';
import User from '../../models/User';
import ThunderRecord from '../../models/ThunderRecord';

const calculateScore = async (thunderId: string): Promise<void> => {
  try {
    console.log('calculate 시작...');
    var thunderEvaluate = await ThunderEvaluate.findOne({
      thunderId: thunderId,
    })
      .populate({
        path: 'thunderId',
        populate: {path: 'members', select: 'userId'},
      })
      .populate('evaluates');

    if (!thunderEvaluate) {
      var thunderEvaluate = new ThunderEvaluate({
        //번개방 평가 객체 생성
        thunderId: thunderId,
        evaluates: [],
      });

      await thunderEvaluate.save();

      thunderEvaluate = await ThunderEvaluate.findOne({
        thunderId: thunderId,
      })
        .populate({
          path: 'thunderId',
          populate: {path: 'members', select: 'userId'},
        })
        .populate('evaluates');
    }

    for (const member of (thunderEvaluate.thunderId as any).members) {
      const evaluate = await Evaluate.findOne({
        userId: (member as any).userId,
        thunderId: thunderId,
      });

      if (!evaluate) {
        //존재하지 않는 Evaluate 객체이면
        const evaluate = new Evaluate({
          userId: (member as any).userId, //new Evaluate
          thunderId: thunderId,
          scores: [],
        });

        await evaluate.save();

        await ThunderEvaluate.findByIdAndUpdate(thunderEvaluate._id, {
          $push: {evaluates: evaluate._id}, //존재하는 객체의 scores에 push
        });
      }
    }

    thunderEvaluate = await ThunderEvaluate.findOne({
      thunderId: thunderId,
    })
      .populate({
        path: 'thunderId',
        populate: {path: 'members', select: 'userId'},
      })
      .populate('evaluates');
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

      await User.findByIdAndUpdate((evaluate as any).userId, {
        $inc: {mannerTemperature: totalScore}, //존재하는 객체의 scores에 push
      });

      const user = await User.findById((evaluate as any).userId).populate(
        'thunderRecords',
      );

      for (const thunder of user.thunderRecords) {
        if ((thunder as any).thunderId == thunderId) {
          (thunder as any).isEvaluate = true;

          await ThunderRecord.findByIdAndUpdate(thunder, {
            isEvaluate: (thunder as any).isEvaluate,
          });
        }
      }
    }

    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  calculateScore,
};
