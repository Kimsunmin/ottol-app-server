export enum ReturnValue {
    SUCCESS = 'success',
    FAIL = 'fail',
}

export const excelColArr = [
    'drwNo', 'drwNoDate', 
    'winnerRank1', 'winPayRank1', 
    'winnerRank2', 'winPayRank2',
    'winnerRank3', 'winPayRank3', 
    'winnerRank4', 'winPayRank4', 
    'winnerRank5', 'winPayRank5', 
    'drwtNo1', 'drwtNo2', 'drwtNo3', 'drwtNo4', 'drwtNo5', 'drwtNo6', 'bnusNo'];

export const lottoSearchMapper = {
    drwtNo1: {
        drwtNoType: 'drwt_no1',
        acc: 1
    },
    drwtNo2: {
        drwtNoType: 'drwt_no2',
        acc: 1
    },
    drwtNo3: {
        drwtNoType: 'drwt_no3',
        acc: 1
    },
    drwtNo4: {
        drwtNoType: 'drwt_no4',
        acc: 1
    },
    drwtNo5: {
        drwtNoType: 'drwt_no5',
        acc: 1
    },
    drwtNo6: {
        drwtNoType: 'drwt_no6',
        acc: 1
    },
    bnusNo: {
        drwtNoType: 'buns_no',
        acc: 10
    }
};