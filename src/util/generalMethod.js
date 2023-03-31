let Util={}
/**
 * 最大余额法解决百分比和不是100%的问题
 * @param arrList  数组列表
 * @param index    索引
 * @param precision  保留几位
 * @returns {number}  返回百分比，不需额外*100
 */
    Util.getPercentValue=function (arrList, index, precision) {
        if (!arrList[index]) {
            return 0;
        }
        //if (!precision) precision = 2;   因为如果使用0的话则会默认2位小数，
        let sum = arrList.reduce((acc, val) => {
            return acc + (isNaN(val) ? 0 : val);
        }, 0);
        if (sum === 0) {
            return 0;
        }
        let digits = Math.pow(10, precision);
        let votesPerQuota = arrList.map((val) => {
            return (isNaN(val) ? 0 : val) / sum * digits * 100;
        });

        let targetSeats = digits * 100;
        let seats = votesPerQuota.map((votes) => {
            return Math.floor(votes);
        });

        let currentSum = seats.reduce((acc, val) => {
            return acc + val;
        }, 0);

        let remainder = votesPerQuota.map(function (votes, index) {
            return votes - seats[index];
        });

        while (currentSum < targetSeats) {
            let max = Number.NEGATIVE_INFINITY;
            let maxId = null;
            for (let i = 0, len = remainder.length; i < len; ++i) {
                if (remainder[i] > max) {
                    max = remainder[i];
                    maxId = i;
                }
            }
            ++seats[maxId];
            remainder[maxId] = 0;
            ++currentSum;
        }

        return seats[index] / digits;
    }
export default Util