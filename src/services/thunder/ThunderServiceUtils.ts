const findMemberById = async (
  userId: string,
  list: string[],
): Promise<string> => {
  var i = 0;
  if (list[0] == userId) {
    return 'HOST';
  }
  for (i = 1; i < list.length; i++) {
    if (list[i] == userId) {
      return 'MEMBER';
    }
  }
  return 'NON_MEMBER';
};

export default {
  findMemberById,
};
